"use client";

/**
 * AuthContext.jsx
 *
 * Provides auth state to the client component tree.
 * Hydrates from the server on mount via a Server Action.
 * The client never sees the JWT — only the decoded User object.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSession, logoutAction } from "@/action/authAction";
import { ROLE_ROUTES, ROUTES } from "@/lib/constants";

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getRedirectPath(role) {
  return ROLE_ROUTES[role] ?? ROUTES.HOME;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate on mount via Server Action — reads the HttpOnly cookie server-side.
  useEffect(() => {
    getSession()
      .then((sessionUser) => setUser(sessionUser ?? null))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  /** Sync client state after a successful loginAction. */
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  /**
   * Re-fetch the session from the server.
   * Used by NotificationContext when a VERIFICATION_DECISION event arrives —
   * the user's approval status may have changed server-side.
   */
  const validateSession = useCallback(async () => {
    try {
      const sessionUser = await getSession();
      setUser(sessionUser ?? null);
    } catch {
      // If the session check fails, leave the current user state intact.
    }
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        isLoggedIn: !!user && ready,
        login,
        logout,
        updateProfile,
        validateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>.");
  return ctx;
}
