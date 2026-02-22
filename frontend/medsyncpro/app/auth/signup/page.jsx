"use client";
import { useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "PATIENT",
        termsAccepted: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 sm:px-16 lg:px-24">
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
                            <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                            <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                            <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                            <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
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
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="yourname@example.com"
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="PHARMACIST">Pharmacist</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                                    className="w-4 h-4"
                                    required
                                />
                                <span className="text-sm text-gray-600">I accept the terms and conditions</span>
                            </label>
                        </div>

                        <button type="submit" className="w-full bg-cyan-500 text-white rounded-full py-3 px-6 font-medium hover:bg-cyan-600 transition mb-4">
                            Continue
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-400">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-cyan-500 font-medium hover:underline">
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