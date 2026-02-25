import { generateToken, hashPassword } from "./crypto.js";
import { signJWT } from "./jwt.js";

function parseUserAgent(ua = "") {
  let browser = "Unknown", os = "Unknown", device = "Desktop";

  if (/mobile/i.test(ua)) device = "Mobile";
  else if (/tablet/i.test(ua)) device = "Tablet";

  if (/chrome/i.test(ua) && !/edge|opr/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edge/i.test(ua)) browser = "Edge";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { browser, os, device };
}

export async function createSession(env, request, user) {
  const sessionId = generateToken(32);
  const refreshToken = generateToken(64);
  const refreshTokenHash = await hashPassword(refreshToken);

  const ua = request.headers.get("user-agent") || "";
  const ip = request.headers.get("cf-connecting-ip") ||
             request.headers.get("x-forwarded-for") ||
             "Unknown";
  const country = request.headers.get("cf-ipcountry") || null;

  const { browser, os, device } = parseUserAgent(ua);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO sessions (session_id, user_id, refresh_token_hash, ip_address, device, browser, os, country, expires_at, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).bind(sessionId, String(user.id), refreshTokenHash, ip, device, browser, os, country ?? null, expiresAt).run();

  const access_token = await signJWT(
    {
      sub: String(user.id),
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      session_id: sessionId,
    },
    env.JWT_SECRET,
    60 * 60 * 24
  );

  return { access_token, session_id: sessionId };
}
