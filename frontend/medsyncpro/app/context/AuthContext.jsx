"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing session on mount
        try {
            const stored = localStorage.getItem("medsyncpro_user");
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if session hasn't expired
                if (!parsed.expiresAt || Date.now() < parsed.expiresAt) {
                    setUser(parsed);
                } else {
                    // Session expired, clear it
                    localStorage.removeItem("medsyncpro_user");
                }
            }
        } catch {
            localStorage.removeItem("medsyncpro_user");
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // userData: { name, email, role, profileImage?, expiresAt? }
        // Token is handled via HttpOnly cookie by the backend
        const enriched = {
            ...userData,
            expiresAt: userData.expiresAt || Date.now() + 24 * 60 * 60 * 1000, // default 24 hours
        };
        setUser(enriched);
        localStorage.setItem("medsyncpro_user", JSON.stringify(enriched));
    };

    const updateProfile = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem("medsyncpro_user", JSON.stringify(updated));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("medsyncpro_user");
    };

    const isLoggedIn = !!user && !loading;

    return (
        <AuthContext.Provider value={{ user, loading, isLoggedIn, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
