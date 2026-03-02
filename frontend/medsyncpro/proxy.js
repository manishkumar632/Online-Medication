import { NextResponse } from "next/server";
import {
  PROTECTED_PREFIXES,
  AUTH_ROUTES,
  ROUTES,
  ROLE_ALLOWED_PREFIXES,
  ROLE_ROUTES,
} from "@/lib/constants";

// ─── Security headers ─────────────────────────────────────────────────────────

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

function withSecurityHeaders(response) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) =>
    response.headers.set(key, value),
  );
  return response;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function proxy(req) {
  const { pathname } = req.nextUrl;
  console.log(`[Middleware] ${req.nextUrl.pathname}`);

  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("user_role")?.value;

  console.log(`  → Auth token: ${token ? "present" : "absent"}, role: ${role}`);

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated user on a protected route → send to login.
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = ROUTES.AUTH.LOGIN;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated user on an auth route → send to their dashboard.
  if (isAuthRoute && token) {
    const url = req.nextUrl.clone();
    url.pathname = (role && ROLE_ROUTES[role]) ?? ROUTES.HOME;
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  // 3. Authenticated user on the wrong role's route → redirect to own dashboard.
  if (isProtected && token && role) {
    const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role] ?? [];
    const hasAccess = allowedPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (!hasAccess) {
      const url = req.nextUrl.clone();
      url.pathname = ROLE_ROUTES[role] ?? ROUTES.HOME;
      return NextResponse.redirect(url);
    }
  }

  // 4. Allow through — attach security headers.
  return withSecurityHeaders(NextResponse.next());
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
