export async function checkUsernameStatus(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ 
      success: false, 
      message: "Authentication required." 
    }, { status: 401 });
  }

  const session_id = authHeader.substring(7);
  
  // Get user from session
  const session = await env.DB.prepare(
    `SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`
  ).bind(session_id).first();

  if (!session) {
    return Response.json({ 
      success: false, 
      message: "Invalid or expired session." 
    }, { status: 401 });
  }

  // Check if user has username
  const user = await env.DB.prepare(
    `SELECT username FROM users WHERE id = ?`
  ).bind(session.user_id).first();

  if (!user) {
    return Response.json({ 
      success: false, 
      message: "User not found." 
    }, { status: 404 });
  }

  return Response.json({
    success: true,
    username: !!user.username
  });
}
