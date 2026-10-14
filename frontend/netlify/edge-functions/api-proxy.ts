import type { Config, Context } from "@netlify/edge-functions";

// Forwards API and upload requests to the Express backend so the browser only
// ever talks to the Netlify origin. This avoids the backend's CORS allow-list
// rejecting the Netlify domain.
export default async (req: Request, _context: Context) => {
  const backendOrigin = (
    Netlify.env.get("BACKEND_URL") || "https://form.eliyastech.com"
  ).replace(/\/+$/, "");

  const incoming = new URL(req.url);
  const target = new URL(incoming.pathname + incoming.search, backendOrigin);

  const headers = new Headers(req.headers);
  // Server-to-server requests carry no Origin, so CORS checks pass upstream.
  headers.delete("origin");
  headers.delete("host");

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    redirect: "manual",
    // Required by fetch when streaming a request body.
    ...(hasBody ? { duplex: "half" } : {}),
  } as RequestInit);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: upstream.headers,
  });
};

export const config: Config = {
  path: ["/api/*", "/uploads/*"],
};
