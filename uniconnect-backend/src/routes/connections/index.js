async function requireSessionUser(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: Response.json({ success: false, message: "Authentication required." }, { status: 401 }) };
  }

  const session_id = authHeader.substring(7);
  const session = await env.DB.prepare(
    `SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`
  )
    .bind(session_id)
    .first();

  if (!session) {
    return { error: Response.json({ success: false, message: "Invalid or expired session." }, { status: 401 }) };
  }

  const user = await env.DB.prepare(`SELECT id, username, full_name FROM users WHERE id = ?`)
    .bind(session.user_id)
    .first();

  if (!user) {
    return { error: Response.json({ success: false, message: "User not found." }, { status: 404 }) };
  }

  return { user };
}

const DEFAULT_DP_URL =
  "https://backend.uniconnectmmu.workers.dev/download/users/7/profile/7_1777890781131_YOR4ATDF.jpg";

export async function handleConnections(request, env, url, method) {
  if (!url.pathname.startsWith("/connections")) return null;

  // GET /connections  (list my mutual connections, supports pagination + search)
  if (url.pathname === "/connections" && method === "GET") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const q = (url.searchParams.get("q") || "").trim();
    const usernameParam = (url.searchParams.get("username") || "").trim();
    const limitParam = Number.parseInt(url.searchParams.get("limit") || "20", 10);
    const offsetParam = Number.parseInt(url.searchParams.get("offset") || "0", 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;
    const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0;

    // If username parameter is provided, show that user's connections instead of current user's
    let targetUserId = me.id;
    if (usernameParam) {
      const targetUser = await env.DB.prepare(`SELECT id FROM users WHERE username = ?`).bind(usernameParam).first();
      if (!targetUser) {
        return Response.json({ success: false, message: "User not found." }, { status: 404 });
      }
      targetUserId = targetUser.id;
    }

    const term = q ? `%${q.toLowerCase()}%` : null;

    const totalRow = await env.DB.prepare(
      `
        SELECT COUNT(DISTINCT u.id) as count
            FROM connections c1
            JOIN connections c2
              ON c1.follower_id = c2.following_id
             AND c1.following_id = c2.follower_id
            JOIN users u
              ON u.id = c1.following_id
            WHERE c1.follower_id = ?
              AND (? IS NULL OR lower(u.username) LIKE ? OR lower(u.full_name) LIKE ?)
      `
    )
      .bind(targetUserId, term, term, term)
      .first();
    const total = totalRow?.count ?? 0;

    const { results } = await env.DB.prepare(
      `
        SELECT u.id, u.username, u.full_name, u.profile_picture_url
        FROM connections c1
        JOIN connections c2
          ON c1.follower_id = c2.following_id
         AND c1.following_id = c2.follower_id
        JOIN users u
          ON u.id = c1.following_id
        WHERE c1.follower_id = ?
          AND (? IS NULL OR lower(u.username) LIKE ? OR lower(u.full_name) LIKE ?)
        GROUP BY u.id
        ORDER BY u.full_name ASC
        LIMIT ? OFFSET ?
      `
    )
      .bind(targetUserId, term, term, term, limit, offset)
      .all();

    const next_offset = offset + (results || []).length;
    const has_more = next_offset < total;

    return Response.json({
      success: true,
      total,
      limit,
      offset,
      next_offset: has_more ? next_offset : null,
      has_more,
      results: (results || []).map((u) => ({
        id: u.id,
        username: u.username,
        name: u.full_name,
        dp: u.profile_picture_url || DEFAULT_DP_URL,
      })),
    });
  }

  // POST /connections/:username  (follow/connect)
  if (url.pathname.startsWith("/connections/") && method === "POST") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const targetUsername = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!targetUsername) {
      return Response.json({ success: false, message: "Target username is required." }, { status: 400 });
    }

    const target = await env.DB.prepare(
      `SELECT id, username, full_name FROM users WHERE username = ?`
    )
      .bind(targetUsername)
      .first();

    if (!target) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    if (String(target.id) === String(me.id)) {
      return Response.json({ success: false, message: "You cannot connect with yourself." }, { status: 400 });
    }

    // A "connection" means both users connect to each other (mutual).
    await env.DB.prepare(`INSERT OR IGNORE INTO connections (follower_id, following_id) VALUES (?, ?)`)
      .bind(me.id, target.id)
      .run();
    await env.DB.prepare(`INSERT OR IGNORE INTO connections (follower_id, following_id) VALUES (?, ?)`)
      .bind(target.id, me.id)
      .run();

    return Response.json({ success: true, message: "Connected." }, { status: 200 });
  }

  // DELETE /connections/:username  (unfollow/disconnect)
  if (url.pathname.startsWith("/connections/") && method === "DELETE") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const targetUsername = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!targetUsername) {
      return Response.json({ success: false, message: "Target username is required." }, { status: 400 });
    }

    const target = await env.DB.prepare(`SELECT id FROM users WHERE username = ?`)
      .bind(targetUsername)
      .first();

    if (!target) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Remove both directions
    await env.DB.prepare(`DELETE FROM connections WHERE follower_id = ? AND following_id = ?`)
      .bind(me.id, target.id)
      .run();
    await env.DB.prepare(`DELETE FROM connections WHERE follower_id = ? AND following_id = ?`)
      .bind(target.id, me.id)
      .run();

    return Response.json({ success: true, message: "Disconnected." }, { status: 200 });
  }

  // GET /connections/count?username=...   (counts mutual connections)
  if (url.pathname === "/connections/count" && method === "GET") {
    const username = (url.searchParams.get("username") || "").trim();
    if (!username) {
      return Response.json({ success: false, message: "Missing query param: username" }, { status: 400 });
    }

    const target = await env.DB.prepare(`SELECT id FROM users WHERE username = ?`)
      .bind(username)
      .first();

    if (!target) {
      return Response.json({ success: false, message: "User not found." }, { status: 404 });
    }

    const connected = await env.DB.prepare(
      `
        SELECT COUNT(DISTINCT c1.following_id) as count
        FROM connections c1
        JOIN connections c2
          ON c1.follower_id = c2.following_id
         AND c1.following_id = c2.follower_id
        WHERE c1.follower_id = ?
      `
    )
      .bind(target.id)
      .first();

    return Response.json({
      success: true,
      username,
      connected: connected?.count ?? 0,
    });
  }

  return null;
}
