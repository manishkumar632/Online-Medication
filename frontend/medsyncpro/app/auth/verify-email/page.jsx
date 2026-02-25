"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            verifyEmail(token);
        } else {
            setStatus("error");
            setMessage("No verification token found. Please check your email link.");
        }
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setStatus("success");
                setMessage(data.message || "Your email has been verified successfully!");
            } else {
                setStatus("error");
                setMessage(data.message || "Verification failed. The link may have expired.");
            }
        } catch {
            setStatus("error");
            setMessage("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                {status === "verifying" && (
                    <>
                        <div style={s.spinnerWrap}>
                            <div style={s.spinner} />
                        </div>
                        <h2 style={s.title}>Verifying Your Email...</h2>
                        <p style={s.subtitle}>Please wait while we verify your email address.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div style={{ ...s.iconCircle, background: "#d1fae5" }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h2 style={s.title}>Email Verified!</h2>
                        <p style={s.subtitle}>{message}</p>
                        <a href="/online-medication/auth/login" style={s.primaryBtn}>
                            Go to Login
                        </a>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div style={{ ...s.iconCircle, background: "#fee2e2" }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                        <h2 style={s.title}>Verification Failed</h2>
                        <p style={s.subtitle}>{message}</p>
                        <a href="/online-medication/auth/signup" style={s.primaryBtn}>
                            Back to Signup
                        </a>
                    </>
                )}
            </div>
            <style>{`@keyframes ve-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const VerifyEmail = () => {
    return (
        <Suspense fallback={
            <div style={s.page}>
                <div style={s.spinnerWrap}>
                    <div style={s.spinner} />
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
};

const s = {
    page: {
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "linear-gradient(135deg, #f0feff 0%, #e0f7fa 50%, #f5f5f5 100%)",
        padding: 24, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    card: {
        background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 440,
        width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    },
    iconCircle: {
        width: 96, height: 96, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
    },
    spinnerWrap: {
        display: "flex", justifyContent: "center", marginBottom: 24,
    },
    spinner: {
        width: 48, height: 48, border: "4px solid rgba(13, 115, 119, 0.15)",
        borderTopColor: "#0d7377", borderRadius: "50%",
        animation: "ve-spin 0.8s linear infinite",
    },
    title: {
        fontSize: "1.75rem", fontWeight: 800, color: "#111827", marginBottom: 8,
        letterSpacing: "-0.02em",
    },
    subtitle: { color: "#6b7280", fontSize: "0.95rem", marginBottom: 28, lineHeight: 1.6 },
    primaryBtn: {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "#0d7377", color: "#fff", border: "none", borderRadius: 9999,
        padding: "13px 40px", fontSize: "0.9rem", fontWeight: 600,
        textDecoration: "none", cursor: "pointer",
    },
};

export default VerifyEmail;
