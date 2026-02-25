import { handleUsers } from "./routes/users/index.js";
import { handleAuth } from "./routes/auth/index.js";
import { handleEmail } from "./routes/email/index.js";
import { withCors, CORS_HEADERS } from "./middleware/cors.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      if (url.pathname.startsWith("/users")) {
        const res = await handleUsers(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname.startsWith("/auth")) {
        const res = await handleAuth(request, env, url, method);
        if (res) return withCors(res);
      }

      if (url.pathname === "/send-email") {
        const res = await handleEmail(request, env, url, method);
        if (res) return withCors(res);
      }

      return withCors(new Response("Route not found", { status: 404 }));
    } catch (err) {
      console.error(err);
      return withCors(Response.json({ success: false, message: err.message }, { status: 500 }));
    }
  }
};