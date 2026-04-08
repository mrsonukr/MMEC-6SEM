import { verifyGoogleToken } from "../../utils/crypto.js";
import { createSession } from "../../utils/session.js";

export async function googleRedirect(request, env, url) {
  const redirectUri = `${env.APP_BASE_URL}/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    302
  );
}

export async function googleCallback(request, env, url) {
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const frontendUrl = env.FRONTEND_URL;

  if (error || !code) {
    return Response.redirect(`${frontendUrl}/auth?error=${encodeURIComponent(error || "no_code")}`, 302);
  }

  const redirectUri = `${env.APP_BASE_URL}/auth/google/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.id_token) {
    return Response.redirect(`${frontendUrl}/auth?error=token_exchange_failed`, 302);
  }

  const payload = await verifyGoogleToken(tokenData.id_token, env.GOOGLE_CLIENT_ID);
  if (!payload) {
    return Response.redirect(`${frontendUrl}/auth?error=invalid_token`, 302);
  }

  const { email, sub: google_id } = payload;

  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE email = ?`
  ).bind(email).first();

  if (!user) {
    return Response.redirect(
      `${frontendUrl}/auth?error=user_not_found&email=${encodeURIComponent(email)}`,
      302
    );
  }

  const existingAuth = await env.DB.prepare(
    `SELECT * FROM auth WHERE user_id_ref = ?`
  ).bind(user.id).first();

  if (!existingAuth) {
    await env.DB.prepare(`
      INSERT INTO auth (user_id_ref, auth_provider, google_id, last_login)
      VALUES (?, 'google', ?, CURRENT_TIMESTAMP)
    `).bind(user.id, google_id).run();
  } else {
    await env.DB.prepare(`
      UPDATE auth
      SET google_id = ?, last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE user_id_ref = ?
    `).bind(google_id, user.id).run();
  }

  const { access_token, session_id } = await createSession(env, request, user);

  // Check if user has username set
  if (!user.username) {
    const params = new URLSearchParams({ 
      access_token, 
      session_id, 
      username: 'false' 
    });
    return Response.redirect(`${frontendUrl}/auth?success=true&${params.toString()}`, 302);
  }

  const params = new URLSearchParams({ access_token, session_id, username: 'true' });

  return Response.redirect(`${frontendUrl}/auth?success=true&${params.toString()}`, 302);
}

export async function googleTokenLogin(request, env) {
  const { id_token } = await request.json();

  const payload = await verifyGoogleToken(id_token, env.GOOGLE_CLIENT_ID);
  if (!payload) {
    return Response.json({ success: false, message: "Invalid Google token" }, { status: 401 });
  }

  const { email, sub: google_id } = payload;

  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE email = ?`
  ).bind(email).first();

  if (!user) {
    return Response.json(
      { success: false, message: "User not found. Please register first." },
      { status: 404 }
    );
  }

  const existingAuth = await env.DB.prepare(
    `SELECT * FROM auth WHERE user_id_ref = ?`
  ).bind(user.id).first();

  if (!existingAuth) {
    await env.DB.prepare(`
      INSERT INTO auth (user_id_ref, auth_provider, google_id, last_login)
      VALUES (?, 'google', ?, CURRENT_TIMESTAMP)
    `).bind(user.id, google_id).run();
  } else {
    await env.DB.prepare(`
      UPDATE auth
      SET google_id = ?, last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE user_id_ref = ?
    `).bind(google_id, user.id).run();
  }

  const { access_token, session_id } = await createSession(env, request, user);

  // Check if user has username set
  if (!user.username) {
    return Response.json({
      success: true,
      message: "Login successful",
      access_token,
      session_id,
      username: false
    });
  }

  return Response.json({
    success: true,
    message: "Login successful",
    access_token,
    session_id,
    username: true
  });
}
