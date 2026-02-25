"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "@/lib/config";

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            setIsLoading(false);
            return;
        }
        if (!formData.password) {
            setError("Please enter your password.");
            setIsLoading(false);
            return;
        }

        try {
            console.log("[LOGIN] Request URL:", `${API_BASE_URL}/api/auth/login`);
            console.log("[LOGIN] Request Payload:", { email: formData.email, password: "***" });

            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include", // Important: allows browser to receive & store HttpOnly cookies
            });

            const data = await response.json();

            console.log("[LOGIN] Response Status:", response.status);
            console.log("[LOGIN] Response Body:", data);

            if (response.ok && data.success) {
                const userData = data.data;
                console.log("[LOGIN] ✅ Login successful — user:", userData.name);

                // Try to extract JWT token from response body or cookie
                let token = data.token || data.data?.token || null;

                // Try reading from document.cookie (non-HttpOnly cookies)
                if (!token) {
                    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
                    if (match) token = match[1];
                }

                console.log("[LOGIN] Token captured:", token ? "yes (" + token.substring(0, 20) + "...)" : "no (HttpOnly cookie)");

                login({
                    _id: userData.userId,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role || "PATIENT",
                    token: token,
                });
                window.location.href = "/online-medication";
            } else if (response.status === 401) {
                console.warn("[LOGIN] ❌ 401 — Invalid credentials");
                setError("Invalid email or password. Please try again.");
            } else if (response.status === 403) {
                console.warn("[LOGIN] ❌ 403 — Email not verified");
                setError("Your email is not verified. Please check your inbox.");
            } else {
                console.warn("[LOGIN] ❌ Failed:", data.message);
                setError(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("[LOGIN] ❌ Network error:", err);
            setError("Unable to connect to the server. Please check your internet connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={s.page}>
            {/* Left — form */}
            <div style={s.left}>
                <div style={s.formBox}>
                    <a href="/online-medication" style={s.backLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back to Home
                    </a>

                    <h1 style={s.title}>Welcome Back</h1>
                    <p style={s.subtitle}>Sign in to your MedSyncpro account</p>

                    {/* Google */}
                    <button style={s.googleBtn} type="button"
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                            <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                            <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                            <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Divider */}
                    <div style={s.divider}>
                        <div style={s.divLine}></div>
                        <span style={s.divText}>Or sign in with email</span>
                        <div style={s.divLine}></div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={s.errorBox}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={s.field}>
                            <label style={s.label}>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="yourname@example.com"
                                autoComplete="email"
                                required
                                style={s.input}
                                onFocus={e => { e.target.style.borderColor = '#0d7377'; e.target.style.boxShadow = '0 0 0 3px rgba(13,115,119,0.1)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <div style={s.field}>
                            <div style={s.labelRow}>
                                <label style={s.label}>Password</label>
                                <a href="/online-medication/auth/forgot-password" style={s.forgot}>Forgot?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    style={{ ...s.input, paddingRight: 44 }}
                                    onFocus={e => { e.target.style.borderColor = '#0d7377'; e.target.style.boxShadow = '0 0 0 3px rgba(13,115,119,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}>
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} style={{
                            ...s.submitBtn,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}>
                            {isLoading ? <span style={s.spinner}></span> : "Sign In"}
                        </button>
                    </form>

                    <p style={s.switchText}>
                        Don&rsquo;t have an account?{" "}
                        <a href="/online-medication/auth/signup" style={s.switchLink}>Create one</a>
                    </p>
                </div>
            </div>

            {/* Right — branding */}
            <div style={s.right}>
                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <div style={{ fontSize: '4rem', marginBottom: 24 }}>🏥</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Your Health, Delivered</h2>
                    <p style={{ opacity: 0.75, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        Access genuine medicines, book appointments, and manage your health — all in one place.
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .auth-right-responsive { display: none !important; } }
      `}</style>
        </div>
    );
};

const s = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" },
    left: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#fff' },
    formBox: { width: '100%', maxWidth: 420 },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: '0.85rem', marginBottom: 32, textDecoration: 'none' },
    title: { fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: 8, letterSpacing: '-0.02em' },
    subtitle: { color: '#9ca3af', fontSize: '0.95rem', marginBottom: 28 },
    googleBtn: {
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        border: '1.5px solid #e5e7eb', borderRadius: 9999, padding: '12px 24px', background: '#fff',
        fontSize: '0.9rem', fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.2s',
    },
    divider: { display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' },
    divLine: { flex: 1, height: 1, background: '#e5e7eb' },
    divText: { fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap' },
    errorBox: {
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
        color: '#dc2626', fontSize: '0.85rem', marginBottom: 16,
    },
    field: { marginBottom: 20 },
    labelRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    label: { fontSize: '0.85rem', fontWeight: 500, color: '#4b5563', marginBottom: 8, display: 'block' },
    forgot: { fontSize: '0.8rem', color: '#0d7377', fontWeight: 500, textDecoration: 'none' },
    input: {
        width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: 8,
        fontSize: '0.9rem', fontFamily: 'inherit', color: '#1f2937', outline: 'none', background: '#fff',
        transition: 'all 0.2s', boxSizing: 'border-box',
    },
    submitBtn: {
        width: '100%', padding: 13, background: '#0d7377', color: '#fff', border: 'none',
        borderRadius: 9999, fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit',
        marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 48,
    },
    spinner: {
        display: 'inline-block', width: 20, height: 20,
        border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
        borderRadius: '50%', animation: 'spin 0.6s linear infinite',
    },
    switchText: { textAlign: 'center', marginTop: 24, color: '#9ca3af', fontSize: '0.9rem' },
    switchLink: { color: '#0d7377', fontWeight: 600, textDecoration: 'none' },
    right: {
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a2640 0%, #0c3d5f 50%, #0d7377 100%)',
        color: '#fff', padding: 60,
    },
};

export default Login;
