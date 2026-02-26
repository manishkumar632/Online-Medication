import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'sonner';

export default function useVerification() {
    const [status, setStatus] = useState("UNVERIFIED");
    const [documents, setDocuments] = useState([]);
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [notes, setNotes] = useState("");
    const [submittedAt, setSubmittedAt] = useState(null);
    const [reviewedAt, setReviewedAt] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchVerificationStatus = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/users/me/verification-status`, {
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const data = await res.json();

            if (data.success) {
                setStatus(data.data.status);
                setDocuments(data.data.submittedDocuments || []);
                setRequiredDocuments(data.data.requiredDocuments || []);
                setNotes(data.data.verificationNotes || "");
                setSubmittedAt(data.data.submittedAt || null);
                setReviewedAt(data.data.reviewedAt || null);
            }
        } catch (error) {
            console.error("Error fetching verification status", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Upload a single document by type
    const uploadSingleDocument = async (type, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${API_BASE_URL}/api/users/me/documents/${type}`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Document uploaded successfully");
                // Update local state from response
                setStatus(data.data.status);
                setDocuments(data.data.submittedDocuments || []);
                setRequiredDocuments(data.data.requiredDocuments || []);
                return true;
            } else {
                toast.error(data.message || "Failed to upload document");
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during upload");
            return false;
        }
    };

    // Delete a single document by type
    const deleteSingleDocument = async (type) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/me/documents/${type}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Document removed");
                setStatus(data.data.status);
                setDocuments(data.data.submittedDocuments || []);
                setRequiredDocuments(data.data.requiredDocuments || []);
                return true;
            } else {
                toast.error(data.message || "Failed to remove document");
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return false;
        }
    };

    // Submit all documents for verification
    const submitForVerification = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/me/submit-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Verification submitted! Our team will review your documents.");
                setStatus(data.data.status);
                setDocuments(data.data.submittedDocuments || []);
                setRequiredDocuments(data.data.requiredDocuments || []);
                setSubmittedAt(data.data.submittedAt || null);
                return true;
            } else {
                toast.error(data.message || "Failed to submit verification");
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return false;
        }
    };

    // Legacy batch upload (backwards compatible)
    const uploadDocuments = async (files, documentTypes) => {
        try {
            setLoading(true);
            const formData = new FormData();

            files.forEach(file => {
                formData.append('documents', file);
            });

            Object.entries(documentTypes).forEach(([key, value]) => {
                formData.append(`documentTypes[${key}]`, value);
            });

            const res = await fetch(`${API_BASE_URL}/api/users/me/documents`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Documents uploaded successfully");
                await fetchVerificationStatus();
                return true;
            } else {
                toast.error(data.message || "Failed to upload documents");
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during upload");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerificationStatus();
    }, [fetchVerificationStatus]);

    return {
        status,
        documents,
        requiredDocuments,
        notes,
        submittedAt,
        reviewedAt,
        loading,
        uploadDocuments,
        uploadSingleDocument,
        deleteSingleDocument,
        submitForVerification,
        refresh: fetchVerificationStatus
    };
}
