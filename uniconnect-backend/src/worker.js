import { handleUsers } from "./routes/users/index.js";
import { handleAuth } from "./routes/auth/index.js";
import { handleEmail } from "./routes/email/index.js";
import { handleUpload } from "./routes/upload/index.js";
import { handleDownload } from "./routes/download/index.js";
import { handlePosts } from "./routes/posts/index.js";
import { uploadPostMedia } from "./routes/posts/media.js";
import { uploadProfilePicture, getProfilePicture } from "./routes/auth/profile-upload.js";
import { handleConnections } from "./routes/connections/index.js";
import { 
  handleR2Upload, 
  handleR2Download, 
  handleR2Delete, 
  handleR2List, 
  handleR2PresignedUpload, 
  handleR2PresignedDownload, 
  handleR2Exists 
} from "./routes/r2/index.js";
import { withCors, CORS_HEADERS } from "./middleware/cors.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      // Profile upload routes (check before general users routes)
      if (url.pathname === "/users/me/profile" && method === "POST") {
        const res = await uploadProfilePicture(request, env);
        return withCors(res);
      }

      if (url.pathname === "/users/me/profile" && method === "GET") {
        const res = await getProfilePicture(request, env, url);
        return withCors(res);
      }

      if (url.pathname.startsWith("/users/") && url.pathname.endsWith("/profile") && method === "POST") {
        const res = await uploadProfilePicture(request, env);
        return withCors(res);
      }

      if (url.pathname.startsWith("/users/") && url.pathname.endsWith("/profile") && method === "GET") {
        const res = await getProfilePicture(request, env, url);
        return withCors(res);
      }

      if (url.pathname.startsWith("/users")) {
        const res = await handleUsers(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname.startsWith("/connections")) {
        const res = await handleConnections(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname.startsWith("/auth")) {
        const res = await handleAuth(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname.startsWith("/posts")) {
        const res = await handlePosts(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname === "/feed" && method === "GET") {
        const res = await handlePosts(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname === "/posts/media/upload" && method === "POST") {
        const res = await uploadPostMedia(request, env);
        return withCors(res);
      }

      if (url.pathname === "/send-email") {
        const res = await handleEmail(request, env, url, method);
        if (res) return withCors(res);
      }

      // Upload endpoint
      if (url.pathname.startsWith("/upload")) {
        const res = await handleUpload(request, env);
        return withCors(res);
      }

      // Download endpoint
      if (url.pathname.startsWith("/download")) {
        const res = await handleDownload(request, env);
        return withCors(res);
      }

      // R2 Storage routes
      if (url.pathname.startsWith("/r2")) {
        if (url.pathname === "/r2/upload" && (method === "PUT" || method === "POST")) {
          const res = await handleR2Upload(request, env);
          return withCors(res);
        }

        if (url.pathname === "/r2/download" && method === "GET") {
          const res = await handleR2Download(request, env);
          return withCors(res);
        }

        if (url.pathname === "/r2/delete" && method === "DELETE") {
          const res = await handleR2Delete(request, env);
          return withCors(res);
        }

        if (url.pathname === "/r2/list" && method === "GET") {
          const res = await handleR2List(request, env);
          return withCors(res);
        }

        if (url.pathname === "/r2/presigned-upload" && method === "GET") {
          const res = await handleR2PresignedUpload(request, env);
          return withCors(res);
        }

        if (url.pathname === "/r2/presigned-download" && method === "GET") {
          const res = await handleR2PresignedDownload(request, env);
          return withCors(res);
        }

        if (url.pathname === "/r2/exists" && method === "GET") {
          const res = await handleR2Exists(request, env);
          return withCors(res);
        }
      }

      return withCors(new Response("Route not found", { status: 404 }));
    } catch (err) {
      console.error(err);
      return withCors(Response.json({ success: false, message: err.message }, { status: 500 }));
    }
  }
};
