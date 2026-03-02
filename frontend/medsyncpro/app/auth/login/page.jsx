"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/action/authAction";
import { useAuth, getRedirectPath } from "@/app/context/AuthContext";

/** @type {import("@/types/auth").AuthState} */
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export default function LoginPage() {
const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  // After a successful server action: sync context → redirect.
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      login(state.user);
      const redirectTo = searchParams.get("redirect");
      const destination = isSafeRedirect(redirectTo)
        ? redirectTo
        : getRedirectPath(state.user.role);

      router.replace(destination);
    }
  }, [state.isAuthenticated, state.user, login, router, searchParams]);

  return (
    <div className="flex min-h-screen font-sans">
      {/* ── Left: form ── */}
      <div className="flex flex-1 items-center justify-center p-10 bg-white">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 text-sm mb-8 no-underline hover:text-gray-600 transition-colors"
          >
            <BackArrowIcon />
            Back to Home
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-base mb-7">
            Sign in to your MedSyncpro account
          </p>

          {state.error && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4"
            >
              <ErrorIcon />
              {state.error}
            </div>
          )}

          <form action={formAction} noValidate>
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="yourname@example.com"
                className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-800 outline-none bg-white transition-all focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#0d7377] font-medium no-underline hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 border-[1.5px] border-gray-200 rounded-lg text-sm text-gray-800 outline-none bg-white transition-all focus:border-[#0d7377] focus:ring-4 focus:ring-[#0d7377]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || state.isAuthenticated}
              className="w-full py-3 bg-[#0d7377] text-white border-none rounded-full text-sm font-semibold mt-1 flex items-center justify-center min-h-[48px] transition-all hover:bg-[#0a5a5d] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending || state.isAuthenticated ? (
                <span className="inline-block w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400 text-sm">
            Don&rsquo;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#0d7377] font-semibold no-underline hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: branding ── */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#0a2640] via-[#0c3d5f] to-[#0d7377] text-white p-15">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🏥</div>
          <h2 className="text-3xl font-extrabold mb-3">
            Your Health, Delivered
          </h2>
          <p className="opacity-75 leading-relaxed text-base">
            Access genuine medicines, book appointments, and manage your health
            — all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Icon components ──────────────────────────────────────────────────────────

function BackArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}


// Prevents open-redirect attacks — only allow relative paths.
function isSafeRedirect(path) {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//")   // blocks "//evil.com"
  );
}