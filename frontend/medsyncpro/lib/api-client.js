import { cookies } from "next/headers";
import { config } from "./config";

// ─── Error class ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ─── Response Wrapper ─────────────────────────────────────────────────────────

export class ApiResponse {
  constructor(data, status, headers) {
    this.data = data;
    this.status = status;
    this.headers = headers;
  }
}

// ─── Client ───────────────────────────────────────────────────────────────────

export async function serverApiClient(endpoint, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");

    if (typeof options.body === "object") {
      options.body = JSON.stringify(options.body);
    }
  }

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
  } catch (error) {
    throw new ApiError(503, "Network error — cannot reach the API server.");
  }

  let data = null;

  if (
    response.status !== 204 &&
    response.headers.get("content-length") !== "0"
  ) {
    try {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      throw new ApiError(response.status, "Failed to parse API response.");
    }
  }

  // ─── DEBUG LOG ─────────────────────────────────────────
  const safeBody =
    options.body instanceof FormData ? "[FormData]" : options.body;

  console.log(
    "API REQUEST 👇 \n",
    JSON.stringify(
      {
        url: `${config.apiUrl}${endpoint}`,
        method: options.method || "GET",
        body: safeBody,
      },
      null,
      2,
    ),
  );

  console.log(
    "API RESPONSE 👇",
    JSON.stringify(
      {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      },
      null,
      2,
    ),
  );
  // ───────────────────────────────────────────────────────

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? `Request failed with status ${response.status}.`,
    );
  }

  return new ApiResponse(data, response.status, response.headers);
}