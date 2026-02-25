import { generateToken, hashPassword } from "../../utils/crypto.js";
import { sendEmail } from "../../utils/email.js";
import { resetPasswordTemplate } from "../email/templates/reset.js";
import { createSession } from "../../utils/session.js";

export async function localLogin(request, env) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ success: false, message: "email and password are required." }, { status: 400 });
  }

  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE email = ?`
  ).bind(email).first();

  if (!user) {
    return Response.json({ success: false, message: "Invalid email or password." }, { status: 401 });
  }

  const authRecord = await env.DB.prepare(
    `SELECT * FROM auth WHERE user_id_ref = ? AND auth_provider = 'local'`
  ).bind(user.id).first();

  if (!authRecord || !authRecord.password_hash) {
    return Response.json({ success: false, message: "No local account found. Please use Google login or reset your password." }, { status: 401 });
  }

  const inputHash = await hashPassword(password);

  if (inputHash !== authRecord.password_hash) {
    return Response.json({ success: false, message: "Invalid email or password." }, { status: 401 });
  }

  await env.DB.prepare(
    `UPDATE auth SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE user_id_ref = ?`
  ).bind(user.id).run();

  const { access_token, session_id } = await createSession(env, request, user);

  return Response.json({
    success: true,
    message: "Login successful",
    access_token,
    session_id,
  });
}

async function checkResetRateLimit(env, userId) {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const recent = await env.DB.prepare(
    `SELECT created_at FROM password_reset_tokens WHERE user_id_ref = ? AND created_at >= ? ORDER BY created_at DESC`
  ).bind(userId, since24h).all();

  const rows = recent.results ?? [];

  if (rows.length >= 5) {
    return { allowed: false, message: "You have reached the maximum of 5 reset requests in 24 hours. Please try again later.", status: 429 };
  }

  if (rows.length > 0) {
    const secondsSinceLast = (Date.now() - new Date(rows[0].created_at).getTime()) / 1000;
    if (secondsSinceLast < 60) {
      const waitSec = Math.ceil(60 - secondsSinceLast);
      return { allowed: false, message: `Please wait ${waitSec} seconds before requesting again.`, status: 429 };
    }
  }

  return { allowed: true };
}

export async function forgotPassword(request, env) {
  const { email } = await request.json();

  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE email = ?`
  ).bind(email).first();

  if (!user) {
    return Response.json({ success: false, message: "No account found with this email." }, { status: 404 });
  }

  const rateCheck = await checkResetRateLimit(env, user.id);
  if (!rateCheck.allowed) {
    return Response.json({ success: false, message: rateCheck.message }, { status: rateCheck.status });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO password_reset_tokens (user_id_ref, token, expires_at)
    VALUES (?, ?, ?)
  `).bind(user.id, token, expiresAt).run();

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(env, {
    to: email,
    subject: "UniConnect - Reset Your Password",
    message: resetPasswordTemplate({ full_name: user.full_name, resetLink }),
  });

  return Response.json({ success: true, message: "Password reset link sent to your email." });
}

export async function resendReset(request, env) {
  const { email } = await request.json();

  const user = await env.DB.prepare(
    `SELECT * FROM users WHERE email = ?`
  ).bind(email).first();

  if (!user) {
    return Response.json({ success: false, message: "No account found with this email." }, { status: 404 });
  }

  const rateCheck = await checkResetRateLimit(env, user.id);
  if (!rateCheck.allowed) {
    return Response.json({ success: false, message: rateCheck.message }, { status: rateCheck.status });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO password_reset_tokens (user_id_ref, token, expires_at)
    VALUES (?, ?, ?)
  `).bind(user.id, token, expiresAt).run();

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(env, {
    to: email,
    subject: "UniConnect - Reset Your Password",
    message: resetPasswordTemplate({ full_name: user.full_name, resetLink }),
  });

  return Response.json({ success: true, message: "Password reset link resent to your email." });
}

export async function resetPassword(request, env) {
  const { token, new_password } = await request.json();

  const record = await env.DB.prepare(
    `SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0`
  ).bind(token).first();

  if (!record) {
    return Response.json({ success: false, message: "Invalid or already used token." }, { status: 400 });
  }

  if (new Date(record.expires_at) < new Date()) {
    return Response.json({ success: false, message: "Token has expired." }, { status: 400 });
  }

  const password_hash = await hashPassword(new_password);

  const existingAuth = await env.DB.prepare(
    `SELECT * FROM auth WHERE user_id_ref = ?`
  ).bind(record.user_id_ref).first();

  if (!existingAuth) {
    await env.DB.prepare(`
      INSERT INTO auth (user_id_ref, auth_provider, password_hash)
      VALUES (?, 'local', ?)
    `).bind(record.user_id_ref, password_hash).run();
  } else {
    await env.DB.prepare(`
      UPDATE auth
      SET password_hash = ?, auth_provider = 'local', updated_at = CURRENT_TIMESTAMP
      WHERE user_id_ref = ?
    `).bind(password_hash, record.user_id_ref).run();
  }

  await env.DB.prepare(`
    UPDATE password_reset_tokens SET used = 1 WHERE token = ?
  `).bind(token).run();

  return Response.json({ success: true, message: "Password updated successfully." });
}
