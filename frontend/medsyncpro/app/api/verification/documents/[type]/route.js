/**
 * app/api/verification/documents/[type]/route.js
 *
 * Proxies document upload and delete to Spring Boot.
 *
 * The access_token cookie lives on localhost:3000 (set by Next.js).
 * The browser cannot send it to localhost:8080 directly.
 * This handler reads it server-side and attaches it to the upstream request.
 *
 * WHY NOT duplex: "half" (streaming):
 *   Node.js's built-in fetch does not reliably support duplex streaming in all
 *   Next.js runtime versions. Reading the FormData first and forwarding it is
 *   simpler, universally supported, and correct for typical document sizes.
 */

import { cookies } from "next/headers";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function POST(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { type } = await params;

  // Read the multipart FormData from the incoming browser request.
  let formData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json(
      { success: false, message: "Invalid form data." },
      { status: 400 },
    );
  }

  // Forward to Spring Boot.
  // Do NOT set Content-Type manually — fetch sets it automatically with the
  // correct multipart boundary when the body is a FormData instance.
  let upstream;
  try {
    upstream = await fetch(`${config.apiUrl}/users/me/documents/${type}`, {
      method: "POST",
      headers: { Cookie: `access_token=${token}` },
      body: formData,
    });
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the server." },
      { status: 503 },
    );
  }

  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { type } = await params;

  let upstream;
  try {
    upstream = await fetch(`${config.apiUrl}/users/me/documents/${type}`, {
      method: "DELETE",
      headers: { Cookie: `access_token=${token}` },
    });
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the server." },
      { status: 503 },
    );
  }

  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}
