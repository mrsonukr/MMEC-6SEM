export async function handleUsers(request, env, url, method) {
  const DEFAULT_DP_URL =
    "https://backend.uniconnectmmu.workers.dev/download/users/7/profile/7_1776060489755_GfYvBwN2.webp";

  if (url.pathname.startsWith("/users/profile/") && method === "GET") {
    const username = decodeURIComponent(url.pathname.split("/")[3] || "").trim();
    if (!username) {
      return Response.json({ success: false, message: "Username is required." }, { status: 400 });
    }

    const target = await env.DB.prepare(
      `SELECT id, full_name, username, role, profile_picture_url, bio FROM users WHERE username = ?`
    )
      .bind(username)
      .first();

    if (!target) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const connectedRow = await env.DB.prepare(
      `
        SELECT COUNT(DISTINCT c1.following_id) AS count
        FROM connections c1
        JOIN connections c2
          ON c1.follower_id = c2.following_id
         AND c1.following_id = c2.follower_id
        WHERE c1.follower_id = ?
      `
    )
      .bind(target.id)
      .first();

    const { results: connectedUsers } = await env.DB.prepare(
      `
        SELECT u.profile_picture_url
        FROM connections c1
        JOIN connections c2
          ON c1.follower_id = c2.following_id
         AND c1.following_id = c2.follower_id
        JOIN users u
          ON u.id = c1.following_id
        WHERE c1.follower_id = ?
        GROUP BY u.id
        ORDER BY u.full_name ASC
        LIMIT 3
      `
    )
      .bind(target.id)
      .all();

    return Response.json({
      success: true,
      user: {
        id: target.id,
        full_name: target.full_name,
        username: target.username,
        role: target.role,
        profile_picture_url: target.profile_picture_url || DEFAULT_DP_URL,
        bio: target.bio,
        connected_count: connectedRow?.count ?? 0,
        connected_dps: (connectedUsers || []).map((u) => u.profile_picture_url || DEFAULT_DP_URL),
      },
    });
  }

  if (url.pathname === "/users/search" && method === "GET") {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const session_id = authHeader.substring(7);
    const session = await env.DB.prepare(
      `SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`
    )
      .bind(session_id)
      .first();

    if (!session) {
      return Response.json(
        { success: false, message: "Invalid or expired session." },
        { status: 401 }
      );
    }

    const me = await env.DB.prepare(`SELECT id FROM users WHERE id = ?`)
      .bind(session.user_id)
      .first();

    if (!me) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const q = (url.searchParams.get("q") || "").trim();
    const limitParam = Number.parseInt(url.searchParams.get("limit") || "20", 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;

    if (!q) {
      return Response.json(
        { success: false, message: "Missing query param: q" },
        { status: 400 }
      );
    }

    const term = `%${q.toLowerCase()}%`;
    const { results } = await env.DB.prepare(
      `
        SELECT id, username, full_name, profile_picture_url
        FROM users
        WHERE username IS NOT NULL
          AND username != ''
          AND (lower(username) LIKE ? OR lower(full_name) LIKE ?)
        ORDER BY
          CASE WHEN (lower(username) LIKE ?) THEN 0 ELSE 1 END,
          full_name ASC
        LIMIT ?
      `
    )
      .bind(term, term, term, limit)
      .all();

    const userIds = (results || []).map((u) => u.id);
    let connectedIds = new Set();
    if (userIds.length > 0) {
      const placeholders = userIds.map(() => "?").join(", ");
      const { results: connectionRows } = await env.DB.prepare(
        `
          SELECT DISTINCT c1.following_id AS id
          FROM connections c1
          JOIN connections c2
            ON c1.follower_id = c2.following_id
           AND c1.following_id = c2.follower_id
          WHERE c1.follower_id = ?
            AND c1.following_id IN (${placeholders})
        `
      )
        .bind(me.id, ...userIds)
        .all();

      connectedIds = new Set((connectionRows || []).map((r) => r.id));
    }

    return Response.json({
      success: true,
      results: (results || []).map((u) => ({
        username: u.username,
        name: u.full_name,
        dp: u.profile_picture_url || DEFAULT_DP_URL,
        isConnected: connectedIds.has(u.id),
        show_btn: String(u.id) !== String(me.id),
      })),
    });
  }

  if (url.pathname === "/users" && method === "POST") {
    const body = await request.json();
    const { user_id, full_name, role, email, bio } = body;

    await env.DB.prepare(`
      INSERT INTO users (user_id, full_name, role, email, bio)
      VALUES (?, ?, ?, ?, ?)
    `).bind(user_id, full_name, role, email, bio || null).run();

    return Response.json({ success: true, message: "User created" }, { status: 201 });
  }

  if (url.pathname === "/users" && method === "GET") {
    const users = await env.DB.prepare(`SELECT * FROM users`).all();
    return Response.json(users);
  }

  if (url.pathname.startsWith("/users/") && method === "GET") {
    const id = url.pathname.split("/")[2];
    const user = await env.DB.prepare(
      `SELECT * FROM users WHERE id = ?`
    ).bind(id).first();

    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });
    return Response.json(user);
  }

  if (url.pathname.startsWith("/users/") && method === "PUT") {
    const id = url.pathname.split("/")[2];
    const body = await request.json();
    const { user_id, full_name, role, email, bio } = body;

    await env.DB.prepare(`
      UPDATE users
      SET user_id = ?, full_name = ?, role = ?, email = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(user_id, full_name, role, email, bio || null, id).run();

    return Response.json({ success: true, message: "User updated" });
  }

  if (url.pathname.startsWith("/users/") && method === "DELETE") {
    const id = url.pathname.split("/")[2];

    await env.DB.prepare(`
      DELETE FROM users WHERE id = ?
    `).bind(id).run();

    return Response.json({ success: true, message: "User deleted" });
  }

  return null;
}
