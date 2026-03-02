"use server";

/**
 * authAction.js — Server Actions
 *
 * These are the ONLY entry points the client may call.
 * Validate input → delegate to auth.service.js → return plain objects.
 * Zero business logic lives here.
 */

import {
  loginService,
  signupService,
  logoutService,
  getSessionService,
  resendVerificationService,
  verifyEmailService,
} from "@/lib/auth.service";

// ─── Validation ───────────────────────────────────────────────────────────────

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character.";
  return null;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      ...prevState,
      error: "Invalid form submission.",
      isLoading: false,
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return {
      ...prevState,
      error: "Email and password are required.",
      isLoading: false,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return {
      ...prevState,
      error: "Please enter a valid email address.",
      isLoading: false,
    };
  }

  const passwordError = validatePassword(password);
  if (passwordError)
    return { ...prevState, error: passwordError, isLoading: false };

  const result = await loginService({ email: trimmedEmail, password });

  if (!result.success)
    return { ...prevState, error: result.message, isLoading: false };

  return {
    user: result.data,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  };
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signupAction(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role");
  const termsAccepted = formData.get("termsAccepted") === "on";

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    typeof role !== "string"
  ) {
    return {
      ...prevState,
      success: false,
      error: "Invalid form submission.",
      isLoading: false,
    };
  }

  if (!name.trim() || !email.trim() || !password || !confirmPassword || !role) {
    return {
      ...prevState,
      success: false,
      error: "All fields are required.",
      isLoading: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      ...prevState,
      success: false,
      error: "Passwords do not match.",
      isLoading: false,
    };
  }

  if (!termsAccepted) {
    return {
      ...prevState,
      success: false,
      error: "You must accept the terms and conditions.",
      isLoading: false,
    };
  }

  const passwordError = validatePassword(password);
  if (passwordError)
    return {
      ...prevState,
      success: false,
      error: passwordError,
      isLoading: false,
    };

  const result = await signupService({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    confirmPassword,
    role,
    termsAccepted,
  });

  if (!result.success)
    return {
      ...prevState,
      success: false,
      error: result.message,
      isLoading: false,
    };

  return { success: true, error: null, isLoading: false };
}

// ─── Resend verification ──────────────────────────────────────────────────────

export async function resendVerificationAction(prevState, formData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { success: false, error: "A valid email address is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { success: false, error: "Please provide a valid email address." };
  }

  const result = await resendVerificationService(email.trim().toLowerCase());

  return result.success
    ? { success: true, error: null }
    : { success: false, error: result.message };
}

// ─── Verify email ─────────────────────────────────────────────────────────────

export async function verifyEmailAction(token) {
  if (typeof token !== "string" || !token.trim()) {
    return {
      success: false,
      message: "No verification token found. Please check your email link.",
    };
  }
  const result = await verifyEmailService(token.trim());
  return { success: result.success, message: result.message };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await logoutService();
}

// ─── Session ──────────────────────────────────────────────────────────────────

export async function getSession() {
  return getSessionService();
}
