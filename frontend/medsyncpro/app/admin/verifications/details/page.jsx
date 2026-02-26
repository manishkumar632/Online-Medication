"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { Check, X, ArrowLeft, FileText, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

function VerificationDetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const { user } = useAuth();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectComment, setRejectComment] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN' || !id) return;

        const fetchDetails = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/verifications/${id}`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setRequest(data.data);
                } else {
                    toast.error("Failed to load verification details.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Network error while loading details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, user]);

    const handleAction = async (action) => {
        if (action === 'reject' && !rejectComment.trim()) {
            toast.error("Please provide a rejection reason.");
            return;
        }

        setActionLoading(true);
        // Optimistic UI update
        const previousStatus = request.status;
        setRequest(prev => ({ ...prev, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }));

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/verifications/${id}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(action === 'reject' ? { comment: rejectComment } : {})
            });

            if (res.ok) {
                toast.success(`Verification ${action}d successfully`);
                router.push("/admin/dashboard");
            } else {
                throw new Error("Failed to perform action");
            }
        } catch (error) {
            console.error(error);
            toast.error(`Error: Could not ${action} request.`);
            // Revert optimistic update
            setRequest(prev => ({ ...prev, status: previousStatus }));
        } finally {
            setActionLoading(false);
            setShowRejectInput(false);
        }
    };

    if (!id) {
        return (
            <div className="p-6 text-center text-gray-500">
                Invalid verification ID.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="p-6 text-center text-gray-500">
                Verification request not found.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Verification Details</h1>
                <span className={`ml-auto px-3 py-1 text-sm font-medium rounded-full 
                    ${request.status === 'PENDING' || request.status === 'UNDER_REVIEW' || request.status === 'DOCUMENT_SUBMITTED' ? 'bg-orange-100 text-orange-700' :
                        request.status === 'APPROVED' || request.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'}`}
                >
                    {request.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                            {request.user.profileImageUrl ? (
                                <img src={request.user.profileImageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserIcon size={40} className="text-teal-600" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{request.user.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{request.user.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wider">
                            {request.user.role}
                        </span>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-medium text-gray-900">{request.user.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Joined</span>
                            <span className="font-medium text-gray-900">
                                {new Date(request.user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Documents & Actions Card */}
                <div className="md:col-span-2 space-y-6">
                    {/* Documents */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-teal-600" />
                            Submitted Documents
                        </h3>

                        {request.documents && request.documents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {request.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg hover:border-teal-300 hover:bg-teal-50/10 transition-colors group"
                                    >
                                        <div className="p-2 bg-gray-50 text-gray-400 rounded-md group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{doc.documentType}</p>
                                            <p className="text-xs text-gray-500">Click to view</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-lg text-gray-500">
                                No documents uploaded yet.
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {(request.status === 'PENDING' || request.status === 'DOCUMENT_SUBMITTED' || request.status === 'UNDER_REVIEW') && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Actions</h3>

                            {!showRejectInput ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleAction('approve')}
                                        disabled={actionLoading}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors focus:ring-4 focus:ring-teal-100 disabled:opacity-70"
                                    >
                                        {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                        Approve Profile
                                    </button>
                                    <button
                                        onClick={() => setShowRejectInput(true)}
                                        disabled={actionLoading}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-red-600 border border-red-200 font-medium rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-70"
                                    >
                                        <X size={18} />
                                        Reject Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Reason for Rejection <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectComment}
                                        onChange={(e) => setRejectComment(e.target.value)}
                                        placeholder="Please provide clear instructions on what needs to be fixed..."
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm min-h-[100px]"
                                    />
                                    <div className="flex gap-3 justify-end mt-4">
                                        <button
                                            onClick={() => setShowRejectInput(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleAction('reject')}
                                            disabled={actionLoading || !rejectComment.trim()}
                                            className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : "Confirm Rejection"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerificationDetailsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        }>
            <VerificationDetailsContent />
        </Suspense>
    );
}
