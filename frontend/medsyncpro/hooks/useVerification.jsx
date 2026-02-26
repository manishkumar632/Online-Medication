import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'sonner';

export default function useVerification() {
    const [status, setStatus] = useState("UNVERIFIED");
    const [documents, setDocuments] = useState([]);
    const [notes, setNotes] = useState("");
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
                setNotes(data.data.verificationNotes || "");
            }
        } catch (error) {
            console.error("Error fetching verification status", error);
        } finally {
            setLoading(false);
        }
    }, []);

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
                await fetchVerificationStatus(); // Refresh state
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
        notes,
        loading,
        uploadDocuments,
        refresh: fetchVerificationStatus
    };
}
