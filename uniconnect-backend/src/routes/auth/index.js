import { googleRedirect, googleCallback, googleTokenLogin } from "./google.js";
import { localLogin, forgotPassword, resendReset, resetPassword } from "./password.js";

export async function handleAuth(request, env, url, method) {
  if (url.pathname === "/auth/google" && method === "GET")
    return googleRedirect(request, env, url);

  if (url.pathname === "/auth/google/callback" && method === "GET")
    return googleCallback(request, env, url);

  if (url.pathname === "/auth/google" && method === "POST")
    return googleTokenLogin(request, env);

  if (url.pathname === "/auth/login" && method === "POST")
    return localLogin(request, env);

  if (url.pathname === "/auth/forgot-password" && method === "POST")
    return forgotPassword(request, env);

  if (url.pathname === "/auth/resend-reset" && method === "POST")
    return resendReset(request, env);

  if (url.pathname === "/auth/reset-password" && method === "POST")
    return resetPassword(request, env);

  return null;
}
