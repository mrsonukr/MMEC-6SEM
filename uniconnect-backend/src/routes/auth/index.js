import { googleRedirect, googleCallback, googleTokenLogin } from "./google.js";
import { localLogin, forgotPassword, resendReset, resetPassword } from "./password.js";
import { setUsername, getUsernameSuggestions, checkUsernameAvailability, getUserProfile, updateUserProfile } from "./username.js";
import { checkUsernameStatus } from "./username-status.js";
import { uploadProfilePicture, getProfilePicture } from "./profile-upload.js";

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

  if (url.pathname === "/auth/set-username" && method === "POST")
    return setUsername(request, env);

  if (url.pathname === "/auth/username-suggestions" && method === "GET")
    return getUsernameSuggestions(request, env);

  if (url.pathname === "/auth/check-username" && method === "GET")
    return checkUsernameAvailability(request, env, url);

  if (url.pathname === "/auth/profile" && method === "GET")
    return getUserProfile(request, env);

  if (url.pathname === "/auth/profile" && method === "PUT")
    return updateUserProfile(request, env);

  if (url.pathname === "/auth/username-status" && method === "GET")
    return checkUsernameStatus(request, env);

  if (url.pathname.startsWith("/users/") && url.pathname.endsWith("/profile") && method === "POST")
    return uploadProfilePicture(request, env);

  if (url.pathname.startsWith("/users/") && url.pathname.endsWith("/profile") && method === "GET")
    return getProfilePicture(request, env, url);

  if (url.pathname === "/users/me/profile" && method === "POST")
    return uploadProfilePicture(request, env);

  if (url.pathname === "/users/me/profile" && method === "GET")
    return getProfilePicture(request, env, url);

  return null;
}
