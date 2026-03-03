"use client";

/**
 * AuthContext.jsx
 *
 * Provides auth state to the client component tree.
 * Hydrates from sessionStorage first (instant), then validates via Server Action.
 * The client never sees the JWT — only the decoded User object.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSession, logoutAction } from "@/actions/authAction";
import { ROLE_ROUTES, ROUTES } from "@/lib/constants";

// ─── Session Storage Key ──────────────────────────────────────────────────────

const SESSION_KEY = "medsyncpro_user";

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getRedirectPath(role) {
  return ROLE_ROUTES[role] ?? ROUTES.HOME;
}

function readSessionStorage() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSessionStorage(user) {
  try {
    if (user) {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          userId: user.userId,
          role: user.role,
          name: user.name,
          email: user.email,
        })
      );
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // sessionStorage unavailable — non-critical
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate: sessionStorage first (instant), then verify via Server Action.
  useEffect(() => {
    const cached = readSessionStorage();
    if (cached) {
      setUser(cached);
      setReady(true);
    }

    getSession()
      .then((sessionUser) => {
        setUser(sessionUser ?? null);
        writeSessionStorage(sessionUser);
      })
      .catch(() => {
        setUser(null);
        writeSessionStorage(null);
      })
      .finally(() => setReady(true));
  }, []);

  /** Sync client state after a successful loginAction. */
  const login = useCallback((userData) => {
    setUser(userData);
    writeSessionStorage(userData);
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
      writeSessionStorage(sessionUser);
    } catch {
      // If the session check fails, leave the current user state intact.
    }
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      writeSessionStorage(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    writeSessionStorage(null);
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
