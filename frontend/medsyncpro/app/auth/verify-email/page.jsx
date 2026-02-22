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
        }
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await response.json();
            console.log('Response:', response.status, data);
            
            if (response.ok) {
                setStatus("success");
                setMessage(data.message || "Email verified successfully!");
            } else {
                setStatus("error");
                setMessage(data.message || "Verification failed");
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus("error");
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                {status === "verifying" && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Verifying Email...</h2>
                    </>
                )}
                
                {status === "success" && (
                    <>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <a href="/auth/login" className="inline-block bg-cyan-500 text-white rounded-full py-3 px-6 font-medium hover:bg-cyan-600 transition">
                            Go to Login
                        </a>
                    </>
                )}
                
                {status === "error" && (
                    <>
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <a href="/auth/signup" className="inline-block bg-cyan-500 text-white rounded-full py-3 px-6 font-medium hover:bg-cyan-600 transition">
                            Back to Signup
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}

const VerifyEmail = () => {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmail;
