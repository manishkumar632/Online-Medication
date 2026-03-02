import { cookies } from "next/headers";
import { config } from "./config";

// ─── Error class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  /**
   * @param {number} status
   * @param {string} message
   */
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ─── Client ───────────────────────────────────────────────────────────────────

/**
 * Server-side fetch wrapper.
 * Forwards the `access_token` HttpOnly cookie to Spring Boot.
 * Throws `ApiError` for non-2xx responses.
 *
 * Content-Type handling:
 *   - JSON body (string / object)  → sets "application/json" automatically
 *   - FormData body                → does NOT set Content-Type, letting the
 *                                    runtime attach the correct multipart
 *                                    boundary automatically
 *
 * @param {string}      endpoint  e.g. "/auth/me"
 * @param {RequestInit} [options]
 */
export async function serverApiClient(endpoint, options) {
  const headers = new Headers(options?.headers);
  headers.set("Accept", "application/json");

  // Only force JSON content type when the body is NOT FormData.
  // FormData requires a multipart/form-data header with a boundary that the
  // runtime generates — setting it manually would omit the boundary and break
  // the upstream parser.
  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Forward the session cookie to the Spring Boot backend.
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (token) {
    headers.set("Cookie", `access_token=${token}`);
  }

  let response;
  try {
    response = await fetch(`${config.apiUrl}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(503, "Network error — cannot reach the API server.");
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, "Invalid JSON response from API.");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed with status ${response.status}.`,
    );
  }

  return body;
}
