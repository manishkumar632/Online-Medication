"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roles = [
    { value: "PATIENT", label: "Patient", icon: "🧑", desc: "Book appointments & order medicines" },
    { value: "DOCTOR", label: "Doctor", icon: "👨‍⚕️", desc: "Manage patients & prescriptions" },
    { value: "PHARMACIST", label: "Pharmacist", icon: "💊", desc: "Fulfill & manage orders" },
    { value: "ADMIN", label: "Admin", icon: "🔒", desc: "Full system access" },
];

const Signup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "PATIENT",
        termsAccepted: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const selectedRole = roles.find(r => r.value === formData.role);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!formData.termsAccepted) {
            toast.error("Please accept the terms and conditions");
            return;
        }

        setIsLoading(true);
        try {
            const requestPayload = { ...formData };
            console.log("[SIGNUP] Request URL:", `${API_BASE_URL}/api/auth/register`);
            console.log("[SIGNUP] Request Payload:", { ...requestPayload, password: "***", confirmPassword: "***" });
            console.log("[SIGNUP] Request Payload:", JSON.stringify(formData));
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            const data = await response.json();

            console.log("[SIGNUP] Response Status:", response.status);
            console.log("[SIGNUP] Response Body:", data);

            if (data.success) {
                console.log("[SIGNUP] ✅ Registration successful — redirecting to email-sent page");
                router.push(`/auth/email-sent?email=${encodeURIComponent(formData.email)}`);
            } else {
                console.warn("[SIGNUP] ❌ Registration failed:", data.message, data.errors);
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("[SIGNUP] ❌ Network error:", error);
            toast.error("Unable to connect to the server. Please check your internet connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="flex w-full lg:w-1/2 flex-col px-8 sm:px-16 lg:px-24 overflow-y-auto hide-scrollbar" style={{ maxHeight: '100vh', paddingTop: 48, paddingBottom: 48, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="max-w-md">
                    <h1 className="text-4xl font-bold mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Let's get started by creating new account.
                    </p>

                    {/* Google Sign Up Button */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-3 px-6 mb-6 hover:bg-gray-50 transition">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                            <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                            <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                            <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                        </svg>
                        <span className="text-gray-200 font-medium">Sign up with Google Account</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="text-gray-400 text-sm">Or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="yourname@example.com"
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-11 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-11 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Role — shadcn DropdownMenu */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Role</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between border border-gray-300 rounded-lg py-3 px-4 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{selectedRole?.icon}</span>
                                            <span className="text-gray-800 font-medium">{selectedRole?.label}</span>
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]" align="start">
                                    <DropdownMenuLabel>Select your role</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        {roles.map((role) => (
                                            <DropdownMenuItem
                                                key={role.value}
                                                onClick={() => setFormData({ ...formData, role: role.value })}
                                                className={formData.role === role.value ? "bg-accent" : ""}
                                            >
                                                <span className="text-lg mr-1">{role.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{role.label}</span>
                                                    <span className="text-xs text-muted-foreground">{role.desc}</span>
                                                </div>
                                                {formData.role === role.value && (
                                                    <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                    className="w-4 h-4"
                                    required
                                />
                                <span className="text-sm text-gray-600">I accept the terms and conditions</span>
                            </label>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-cyan-500 text-white rounded-full py-3 px-6 font-medium hover:bg-cyan-600 transition mb-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    Creating Account...
                                </>
                            ) : "Continue"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-400">
                        Already have an account?{" "}
                        <a href="/online-medication/auth/login" className="text-cyan-500 font-medium hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>

            {/* Right Section - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-purple-100 items-center justify-center">
                <Image
                    src="/online-medication/doctors_signup_page.png"
                    alt="Doctors illustration"
                    width={500}
                    height={700}
                    priority
                />
            </div>
        </div>
    );
}

export default Signup;