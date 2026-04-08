import { validateUsername, generateUsernameSuggestions } from "../../utils/username.js";

export async function setUsername(request, env) {
  const { username } = await request.json();

  if (!username) {
    return Response.json({ 
      success: false, 
      message: "Username is required." 
    }, { status: 400 });
  }

  // Validate username format
  if (!validateUsername(username)) {
    return Response.json({ 
      success: false, 
      message: "Username must be 3-20 characters, lowercase letters, numbers, underscores, and dots only." 
    }, { status: 400 });
  }

  // Get user from session (you'll need to implement session verification)
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

  // Get user details
  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE id = ?`
  ).bind(session.user_id).first();

  if (!user) {
    return Response.json({ 
      success: false, 
      message: "User not found." 
    }, { status: 404 });
  }

  // Check if username is already taken
  const existingUser = await env.DB.prepare(
    `SELECT id FROM users WHERE username = ? AND id != ?`
  ).bind(username, user.id).first();

  if (existingUser) {
    return Response.json({ 
      success: false, 
      message: "Username is already taken." 
    }, { status: 409 });
  }

  // Update username
  await env.DB.prepare(`
    UPDATE users 
    SET username = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).bind(username, user.id).run();

  return Response.json({
    success: true,
    message: "Username set successfully.",
    username
  });
}

export async function getUsernameSuggestions(request, env) {
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

  // Get user details
  const user = await env.DB.prepare(
    `SELECT full_name FROM users WHERE id = ?`
  ).bind(session.user_id).first();

  if (!user) {
    return Response.json({ 
      success: false, 
      message: "User not found." 
    }, { status: 404 });
  }

  // Generate suggestions
  const suggestions = generateUsernameSuggestions(user.full_name);

  return Response.json({
    success: true,
    suggestions
  });
}

export async function checkUsernameAvailability(request, env) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return Response.json({ 
      success: false, 
      message: "Username parameter is required." 
    }, { status: 400 });
  }

  // Validate username format
  if (!validateUsername(username)) {
    return Response.json({ 
      success: false, 
      message: "Invalid username format." 
    }, { status: 400 });
  }

  // Check if username exists
  const existingUser = await env.DB.prepare(
    `SELECT id FROM users WHERE username = ?`
  ).bind(username).first();

  return Response.json({
    success: true,
    available: !existingUser
  });
}

export async function getUserProfile(request, env) {
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

  // Get user details including username and profile picture
  const user = await env.DB.prepare(
    `SELECT id, user_id, full_name, email, username, role, profile_picture_url, bio FROM users WHERE id = ?`
  ).bind(session.user_id).first();

  if (!user) {
    return Response.json({ 
      success: false, 
      message: "User not found." 
    }, { status: 404 });
  }

  return Response.json({
    success: true,
    user: {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      role: user.role,
      profile_picture_url: user.profile_picture_url,
      bio: user.bio
    }
  });
}

export async function updateUserProfile(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({
      success: false,
      message: "Authentication required."
    }, { status: 401 });
  }

  const session_id = authHeader.substring(7);

  const session = await env.DB.prepare(
    `SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP`
  ).bind(session_id).first();

  if (!session) {
    return Response.json({
      success: false,
      message: "Invalid or expired session."
    }, { status: 401 });
  }

  const body = await request.json();
  const rawBio = body?.bio ?? body?.desc ?? body?.description ?? '';
  const bio = typeof rawBio === 'string' ? rawBio.trim() : '';

  if (bio.length > 500) {
    return Response.json({
      success: false,
      message: "Bio must be 500 characters or less."
    }, { status: 400 });
  }

  await env.DB.prepare(
    `UPDATE users SET bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(bio, session.user_id).run();

  const updatedUser = await env.DB.prepare(
    `SELECT id, user_id, full_name, email, username, role, profile_picture_url, bio FROM users WHERE id = ?`
  ).bind(session.user_id).first();

  return Response.json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: updatedUser.id,
      full_name: updatedUser.full_name,
      username: updatedUser.username,
      role: updatedUser.role,
      profile_picture_url: updatedUser.profile_picture_url,
      bio: updatedUser.bio
    }
  });
}
