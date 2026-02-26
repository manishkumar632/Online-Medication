import React, { useState } from 'react';
import useVerification from '../../hooks/useVerification';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfessionalVerificationGuard({ children }) {
    const { user } = useAuth();
    const { status, documents, notes, loading, uploadDocuments } = useVerification();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [documentTypes, setDocumentTypes] = useState({});
    const [uploading, setUploading] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    // Fully verified - render the dashboard normally
    if (status === 'VERIFIED') {
        return children;
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            toast.error("You can upload a maximum of 5 documents");
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);

        // Auto-assign default types
        const newTypes = { ...documentTypes };
        files.forEach((file, index) => {
            const fileId = `type_${selectedFiles.length + index}`;
            newTypes[fileId] = "LICENSE";
        });
        setDocumentTypes(newTypes);
    };

    const handleTypeChange = (index, type) => {
        setDocumentTypes(prev => ({
            ...prev,
            [`type_${index}`]: type
        }));
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));

        // Rebuild the types map
        const newTypes = {};
        selectedFiles.filter((_, idx) => idx !== indexToRemove).forEach((_, newIdx) => {
            // Keep the previous selection if possible
            const oldTypeKey = `type_${newIdx >= indexToRemove ? newIdx + 1 : newIdx}`;
            newTypes[`type_${newIdx}`] = documentTypes[oldTypeKey] || "OTHER";
        });
        setDocumentTypes(newTypes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one document");
            return;
        }

        setUploading(true);
        try {
            await uploadDocuments(selectedFiles, documentTypes);
            setSelectedFiles([]);
        } finally {
            setUploading(false);
        }
    };

    const renderUploadForm = () => (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="border-2 border-dashed border-teal-200 rounded-xl p-8 text-center bg-teal-50/30 hover:bg-teal-50 transition-colors">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                >
                    <div className="p-4 bg-teal-100/50 rounded-full text-teal-600">
                        <Upload size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Click to upload your credentials</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG up to 10MB each (max 5 files)</p>
                    </div>
                </label>
            </div>

            {selectedFiles.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText size={18} className="text-teal-600" />
                        Selected Documents
                    </h4>
                    <div className="grid gap-4">
                        {selectedFiles.map((file, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-100 bg-white shadow-sm items-start sm:items-center">
                                <div className="flex-1 truncate">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>

                                <select
                                    value={documentTypes[`type_${idx}`] || "OTHER"}
                                    onChange={(e) => handleTypeChange(idx, e.target.value)}
                                    className="text-sm border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full sm:w-[150px]"
                                >
                                    <option value="LICENSE">Medical License</option>
                                    <option value="DEGREE">Degree Certificate</option>
                                    <option value="ID_PROOF">ID Proof</option>
                                    <option value="OTHER">Other</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={() => removeFile(idx)}
                                    className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors w-full sm:w-auto"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
            >
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                {uploading ? 'Uploading Documents...' : 'Submit for Verification'}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
                {/* Header Profile Section */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white relative flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40 shadow-inner mb-4">
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="..." className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold">{user?.name ? user.name[0].toUpperCase() : '👤'}</span>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-teal-100 text-sm mt-1">{user?.role} Account Verification</p>
                </div>

                <div className="p-8">
                    {/* Status Banners */}
                    {status === 'UNVERIFIED' && (
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-8 flex gap-4">
                            <AlertCircle className="text-orange-500 shrink-0" size={24} />
                            <div>
                                <h3 className="font-semibold text-orange-800">Account Unverified</h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    To access your {user?.role.toLowerCase()} dashboard, our administrative team needs to verify your professional credentials. Please upload the required documents below.
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'DOCUMENT_SUBMITTED' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 flex gap-4">
                            <CheckCircle className="text-blue-500 shrink-0" size={24} />
                            <div>
                                <h3 className="font-semibold text-blue-800">Documents Submitted</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Your documents have been successfully submitted and are waiting for an administrator to begin the review process.
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'UNDER_REVIEW' && (
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-8 flex gap-4">
                            <Clock className="text-purple-500 shrink-0 animate-pulse" size={24} />
                            <div>
                                <h3 className="font-semibold text-purple-800">Profile Under Review</h3>
                                <p className="text-sm text-purple-700 mt-1">
                                    An administrator is currently reviewing your professional credentials. We will notify you once the verification is complete.
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'REJECTED' && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-8">
                            <div className="flex gap-4">
                                <AlertCircle className="text-red-500 shrink-0" size={24} />
                                <div>
                                    <h3 className="font-semibold text-red-800">Verification Failed</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        Your previous submission was rejected. Please review the feedback below and upload new documents.
                                    </p>

                                    {notes && (
                                        <div className="mt-4 p-4 bg-white border border-red-200 rounded-lg shadow-sm">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <Info size={14} /> Admin Notes
                                            </p>
                                            <p className="text-sm text-gray-700 italic">{notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show File Upload only for specific statuses */}
                    {(status === 'UNVERIFIED' || status === 'REJECTED') && renderUploadForm()}

                    {/* Show Submitted Documents list */}
                    {(status === 'DOCUMENT_SUBMITTED' || status === 'UNDER_REVIEW') && documents?.length > 0 && (
                        <div className="mt-8">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
                                <FileText size={18} className="text-teal-600" />
                                Your Uploaded Documents
                            </h4>
                            <div className="grid gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                {documents.map((doc, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                                        <div className="truncate flex-1">
                                            <p className="text-sm font-medium text-gray-800 truncate">{doc.fileName}</p>
                                            <p className="text-xs text-gray-500">{doc.documentType}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                                            Uploaded
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
