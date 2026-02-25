"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, getRedirectPath } from "../context/AuthContext";

/**
 * Client-side route guard for protected pages.
 * 
 * Usage:
 *   <RouteGuard allowedRoles={["DOCTOR"]}>
 *     {children}
 *   </RouteGuard>
 * 
 * Behavior:
 * - If user is not logged in → redirect to /auth/login
 * - If user role is not in allowedRoles → redirect to their correct dashboard
 * - Shows nothing while checking (prevents flash of protected content)
 */
export default function RouteGuard({ children, allowedRoles = [] }) {
    const { user, loading, isLoggedIn } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return; // Wait for auth state to load from localStorage

        if (!isLoggedIn || !user) {
            // Not logged in → redirect to login
            router.replace("/auth/login");
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            // Wrong role → redirect to their correct dashboard
            const correctPath = getRedirectPath(user.role);
            router.replace(correctPath);
            return;
        }

        // All checks passed
        setAuthorized(true);
    }, [loading, isLoggedIn, user, allowedRoles, router, pathname]);

    // Show nothing while loading/checking (prevents flash)
    if (loading || !authorized) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "#f8fafc",
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    border: "3px solid rgba(37, 99, 235, 0.15)",
                    borderTopColor: "#2563eb",
                    borderRadius: "50%",
                    animation: "rg-spin 0.6s linear infinite",
                }} />
                <style>{`@keyframes rg-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return children;
}
