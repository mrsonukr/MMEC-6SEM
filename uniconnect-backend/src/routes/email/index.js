export async function handleEmail(request, env, url, method) {
  if (url.pathname === "/send-email" && method === "POST") {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return Response.json({ success: false, message: "to, subject, and message are required." }, { status: 400 });
    }

    const res = await fetch(env.EMAIL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, message }),
    });

    const result = await res.text();
    return Response.json({ success: true, message: "Email sent.", detail: result });
  }

  return null;
}
