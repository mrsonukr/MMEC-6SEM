export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function withCors(response) {
  const newRes = new Response(response.body, response);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => newRes.headers.set(k, v));
  return newRes;
}
