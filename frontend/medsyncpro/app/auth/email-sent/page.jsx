"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { API_BASE_URL } from "@/lib/config";

function EmailSentContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "your email";
    const [resendState, setResendState] = useState("idle"); // idle | loading | success | error
    const [cooldown, setCooldown] = useState(0);

    const handleResend = async () => {
        if (cooldown > 0 || resendState === "loading") return;

        setResendState("loading");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/auth/resend-verification?email=${encodeURIComponent(email)}`,
                { method: "POST" }
            );
            const data = await response.json();

            if (response.ok && data.success) {
                setResendState("success");
                // Start 60-second cooldown
                setCooldown(60);
                const timer = setInterval(() => {
                    setCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setResendState("idle");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setResendState("error");
                setTimeout(() => setResendState("idle"), 3000);
            }
        } catch {
            setResendState("error");
            setTimeout(() => setResendState("idle"), 3000);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Animated envelope icon */}
                <div style={styles.iconWrap}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0d7377" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                </div>

                <h1 style={styles.title}>Check Your Email</h1>
                <p style={styles.subtitle}>We&rsquo;ve sent a verification link to</p>
                <p style={styles.email}>{email}</p>

                <div style={styles.stepsBox}>
                    <div style={styles.step}>
                        <span style={styles.stepNum}>1</span>
                        <span style={styles.stepText}>Open your email inbox</span>
                    </div>
                    <div style={styles.step}>
                        <span style={styles.stepNum}>2</span>
                        <span style={styles.stepText}>Click the verification link</span>
                    </div>
                    <div style={styles.step}>
                        <span style={styles.stepNum}>3</span>
                        <span style={styles.stepText}>Start using MedSyncpro</span>
                    </div>
                </div>

                {/* Resend button */}
                <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendState === "loading"}
                    style={{
                        ...styles.resendBtn,
                        opacity: cooldown > 0 || resendState === "loading" ? 0.6 : 1,
                        cursor: cooldown > 0 || resendState === "loading" ? "not-allowed" : "pointer",
                    }}
                >
                    {resendState === "loading" && "Sending..."}
                    {resendState === "success" && `Sent! Resend in ${cooldown}s`}
                    {resendState === "error" && "Failed — try again"}
                    {resendState === "idle" && (cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email")}
                </button>

                <p style={styles.hint}>
                    Didn&rsquo;t receive the email? Check your spam folder or{" "}
                    <a href="/online-medication/auth/signup" style={styles.link}>try signing up again</a>.
                </p>

                <a href="/online-medication/auth/login" style={styles.loginBtn}>
                    Go to Login
                </a>
            </div>
        </div>
    );
}

export default function EmailSentPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>}>
            <EmailSentContent />
        </Suspense>
    );
}

const styles = {
    page: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'linear-gradient(135deg, #f0feff 0%, #e0f7fa 50%, #f5f5f5 100%)',
        padding: 24, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    card: {
        background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 440,
        width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    },
    iconWrap: {
        width: 96, height: 96, borderRadius: '50%', background: '#e0f7fa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
    },
    title: {
        fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 8,
        letterSpacing: '-0.02em',
    },
    subtitle: { color: '#9ca3af', fontSize: '0.95rem', marginBottom: 4 },
    email: {
        color: '#0d7377', fontWeight: 600, fontSize: '1rem', marginBottom: 32,
        wordBreak: 'break-all',
    },
    stepsBox: {
        display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24,
        textAlign: 'left',
    },
    step: { display: 'flex', alignItems: 'center', gap: 14 },
    stepNum: {
        width: 32, height: 32, borderRadius: '50%', background: '#0d7377', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
    },
    stepText: { fontSize: '0.9rem', color: '#4b5563' },
    resendBtn: {
        width: '100%', padding: '12px 24px', background: 'transparent',
        border: '1.5px solid #0d7377', borderRadius: 9999, color: '#0d7377',
        fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
        marginBottom: 16, transition: 'all 0.2s',
    },
    hint: { color: '#9ca3af', fontSize: '0.8rem', marginBottom: 24 },
    link: { color: '#0d7377', fontWeight: 600, textDecoration: 'none' },
    loginBtn: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: '#0d7377', color: '#fff', border: 'none', borderRadius: 9999,
        padding: '13px 40px', fontSize: '0.9rem', fontWeight: 600,
        textDecoration: 'none', cursor: 'pointer',
    },
};
