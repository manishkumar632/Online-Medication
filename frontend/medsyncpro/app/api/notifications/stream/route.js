/**
 * app/api/notifications/stream/route.js  —  SSE Proxy
 *
 * WHY THIS EXISTS:
 *   The browser cannot forward the `access_token` cookie to Spring Boot
 *   because Next.js set it on localhost:3000, not localhost:8080.
 *   Browsers only send cookies to the origin they belong to — so even with
 *   `withCredentials: true`, Spring Boot receives no token and treats every
 *   SSE connection as unauthenticated.
 *
 *   This Route Handler runs on the Next.js server, where it can read the
 *   HttpOnly cookie. It opens the real SSE connection to Spring Boot
 *   server-to-server (with the token forwarded as a Cookie header), then
 *   pipes the raw stream back to the browser unchanged.
 *
 *   Browser  →  GET /api/notifications/stream  (same origin, no cookie issue)
 *   Next.js  →  GET Spring Boot /notifications/stream  (server-side, token attached)
 */

import { cookies } from "next/headers";
import { config } from "@/lib/config";

// Never cache — this is a live stream.
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let upstream;
  try {
    upstream = await fetch(`${config.apiUrl}/notifications/stream`, {
      headers: {
        Cookie: `access_token=${token}`,
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });
  } catch {
    return new Response("Could not connect to notification stream.", {
      status: 503,
    });
  }

  if (!upstream.ok) {
    return new Response("Upstream stream error.", { status: upstream.status });
  }

  // Pipe the upstream ReadableStream straight to the browser.
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
