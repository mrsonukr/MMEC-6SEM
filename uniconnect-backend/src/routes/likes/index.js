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

export async function handleLikes(request, env, url, method) {
  if (!url.pathname.startsWith("/likes")) return null;

  // POST /likes/:post_id  (like a post)
  if (url.pathname.startsWith("/likes/") && method === "POST") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const postId = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!postId) {
      return Response.json({ success: false, message: "Post ID is required." }, { status: 400 });
    }

    // Check if post exists
    const post = await env.DB.prepare(
      `SELECT id FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!post) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await env.DB.prepare(
      `SELECT id FROM likes WHERE user_id_ref = ? AND post_id_ref = ?`
    ).bind(me.id, post.id).first();

    if (existingLike) {
      return Response.json({ success: false, message: "Post already liked." }, { status: 400 });
    }

    // Add like
    await env.DB.prepare(
      `INSERT INTO likes (user_id_ref, post_id_ref) VALUES (?, ?)`
    ).bind(me.id, post.id).run();

    return Response.json({ success: true, message: "Post liked." }, { status: 201 });
  }

  // DELETE /likes/:post_id  (unlike a post)
  if (url.pathname.startsWith("/likes/") && method === "DELETE") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const postId = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!postId) {
      return Response.json({ success: false, message: "Post ID is required." }, { status: 400 });
    }

    // Check if post exists
    const post = await env.DB.prepare(
      `SELECT id FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!post) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    // Remove like
    const result = await env.DB.prepare(
      `DELETE FROM likes WHERE user_id_ref = ? AND post_id_ref = ?`
    ).bind(me.id, post.id).run();

    if (result.meta.changes === 0) {
      return Response.json({ success: false, message: "Post not liked." }, { status: 400 });
    }

    return Response.json({ success: true, message: "Post unliked." }, { status: 200 });
  }

  // GET /likes/:post_id  (check if liked and get like count)
  if (url.pathname.startsWith("/likes/") && method === "GET") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const postId = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!postId) {
      return Response.json({ success: false, message: "Post ID is required." }, { status: 400 });
    }

    // Check if post exists
    const post = await env.DB.prepare(
      `SELECT id FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!post) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    // Check if current user liked
    const userLike = await env.DB.prepare(
      `SELECT id FROM likes WHERE user_id_ref = ? AND post_id_ref = ?`
    ).bind(me.id, post.id).first();

    // Get total like count
    const likeCount = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM likes WHERE post_id_ref = ?`
    ).bind(post.id).first();

    return Response.json({
      success: true,
      data: {
        is_liked: !!userLike,
        like_count: likeCount?.count || 0
      }
    });
  }

  return null;
}
