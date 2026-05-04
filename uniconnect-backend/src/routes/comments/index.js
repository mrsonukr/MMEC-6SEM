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

  const user = await env.DB.prepare(`SELECT id, username, full_name, profile_picture_url FROM users WHERE id = ?`)
    .bind(session.user_id)
    .first();

  if (!user) {
    return { error: Response.json({ success: false, message: "User not found." }, { status: 404 }) };
  }

  return { user };
}

// Format relative time (e.g., "2m ago", "5h ago")
function formatRelativeTime(timestamp) {
  if (!timestamp) return 'just now';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

export async function handleComments(request, env, url, method) {
  if (!url.pathname.startsWith("/comments")) return null;

  // POST /comments/:post_id  (add a comment to a post)
  if (url.pathname.startsWith("/comments/") && method === "POST") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const postId = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!postId) {
      return Response.json({ success: false, message: "Post ID is required." }, { status: 400 });
    }

    const body = await request.json();
    const { comment_text } = body;

    if (!comment_text || comment_text.trim() === "") {
      return Response.json({ success: false, message: "Comment text is required." }, { status: 400 });
    }

    // Check if post exists
    const post = await env.DB.prepare(
      `SELECT id FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!post) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    // Add comment
    const result = await env.DB.prepare(
      `INSERT INTO comments (user_id_ref, post_id_ref, comment_text) VALUES (?, ?, ?)`
    ).bind(me.id, post.id, comment_text.trim()).run();

    // Get the created comment with author info
    const commentId = result.meta.last_row_id;
    const comment = await env.DB.prepare(`
      SELECT c.*, u.username, u.full_name, u.profile_picture_url
      FROM comments c
      JOIN users u ON c.user_id_ref = u.id
      WHERE c.id = ?
    `).bind(commentId).first();

    return Response.json({
      success: true,
      message: "Comment added.",
      data: {
        id: comment.id,
        comment_text: comment.comment_text,
        author: {
          id: comment.user_id_ref,
          username: comment.username,
          full_name: comment.full_name,
          profile_picture_url: comment.profile_picture_url
        },
        time: formatRelativeTime(comment.created_at),
        created_at: comment.created_at
      }
    }, { status: 201 });
  }

  // GET /comments/:post_id  (get comments for a post)
  if (url.pathname.startsWith("/comments/") && method === "GET") {
    const postId = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!postId) {
      return Response.json({ success: false, message: "Post ID is required." }, { status: 400 });
    }

    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // Check if post exists
    const post = await env.DB.prepare(
      `SELECT id FROM posts WHERE post_id = ? AND deleted_at IS NULL`
    ).bind(postId).first();

    if (!post) {
      return Response.json({ success: false, message: "Post not found." }, { status: 404 });
    }

    // Get total count
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as total FROM comments WHERE post_id_ref = ?`
    ).bind(post.id).first();
    const total = countResult.total;

    // Get comments with author info
    const commentsQuery = `
      SELECT c.*, u.username, u.full_name, u.profile_picture_url
      FROM comments c
      JOIN users u ON c.user_id_ref = u.id
      WHERE c.post_id_ref = ?
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `;
    
    const commentsResult = await env.DB.prepare(commentsQuery)
      .bind(post.id, limit, offset)
      .all();
    const comments = commentsResult.results || [];

    return Response.json({
      success: true,
      data: {
        comments: comments.map((comment) => ({
          id: comment.id,
          comment_text: comment.comment_text,
          author: {
            id: comment.user_id_ref,
            username: comment.username,
            full_name: comment.full_name,
            profile_picture_url: comment.profile_picture_url
          },
          time: formatRelativeTime(comment.created_at),
          created_at: comment.created_at
        })),
        pagination: {
          page,
          limit,
          total,
          has_next: offset + limit < total
        }
      }
    });
  }

  // DELETE /comments/:comment_id  (delete a comment)
  if (url.pathname.startsWith("/comments/") && method === "DELETE") {
    const { user: me, error } = await requireSessionUser(request, env);
    if (error) return error;

    const commentId = decodeURIComponent(url.pathname.split("/")[2] || "").trim();
    if (!commentId) {
      return Response.json({ success: false, message: "Comment ID is required." }, { status: 400 });
    }

    // Check if comment exists and user is the author
    const comment = await env.DB.prepare(
      `SELECT id, user_id_ref FROM comments WHERE id = ?`
    ).bind(commentId).first();

    if (!comment) {
      return Response.json({ success: false, message: "Comment not found." }, { status: 404 });
    }

    if (comment.user_id_ref !== me.id) {
      return Response.json({ success: false, message: "You can only delete your own comments." }, { status: 403 });
    }

    // Delete comment
    await env.DB.prepare(`DELETE FROM comments WHERE id = ?`).bind(commentId).run();

    return Response.json({ success: true, message: "Comment deleted." }, { status: 200 });
  }

  return null;
}
