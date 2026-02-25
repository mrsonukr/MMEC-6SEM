export async function sendEmail(env, { to, subject, message }) {
  const EMAIL_API_URL = env.EMAIL_API_URL;
  if (!EMAIL_API_URL) return;

  await fetch(EMAIL_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, message }),
  });
}
