export async function handleUsers(request, env, url, method) {
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
