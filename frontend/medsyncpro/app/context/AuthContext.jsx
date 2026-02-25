"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";

const AuthContext = createContext(null);

const STORAGE_KEY = "medsyncpro_user";

/**
 * Maps role → post-login dashboard path.
 * Uses basePath-relative paths (basePath is /online-medication).
 */
export function getRedirectPath(role) {
    switch (role) {
        case "PATIENT": return "/patient";
        case "DOCTOR": return "/doctor/dashboard";
        case "PHARMACIST": return "/pharmacy/dashboard";
        case "ADMIN": return "/admin/dashboard";
        default: return "/";
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ─── Load from localStorage on mount ───
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (!parsed.expiresAt || Date.now() < parsed.expiresAt) {
                    setUser(parsed);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
        setLoading(false);
    }, []);

    // ─── Cross-tab logout detection ───
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY) {
                if (e.newValue === null) {
                    // Another tab logged out
                    setUser(null);
                } else {
                    try {
                        setUser(JSON.parse(e.newValue));
                    } catch {
                        setUser(null);
                    }
                }
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ─── Login: store user data ───
    const login = useCallback((userData) => {
        // userData: { userId, name, email, role }
        const enriched = {
            ...userData,
            expiresAt: userData.expiresAt || Date.now() + 24 * 60 * 60 * 1000,
        };
        setUser(enriched);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
    }, []);

    // ─── Update profile fields ───
    const updateProfile = useCallback((updates) => {
        setUser((prev) => {
            const updated = { ...prev, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // ─── Logout: clear state + storage ───
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    /**
     * Validate session against the backend.
     * Calls GET /api/users/me — if the backend returns 401
     * (expired, blacklisted, deleted, token version mismatch),
     * the session is cleared.
     * Returns the user data on success, or null on failure.
     */
    const validateSession = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/me`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                logout();
                return null;
            }

            const data = await res.json();
            if (data.success && data.data) {
                // Refresh local state with backend truth
                const refreshed = {
                    userId: data.data.userId,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                };
                setUser(refreshed);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
                return refreshed;
            }
            logout();
            return null;
        } catch {
            // Network error — don't logout, could be offline
            return user;
        }
    }, [user, logout]);

    const isLoggedIn = !!user && !loading;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isLoggedIn,
            login,
            logout,
            updateProfile,
            validateSession,
            getRedirectPath,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
