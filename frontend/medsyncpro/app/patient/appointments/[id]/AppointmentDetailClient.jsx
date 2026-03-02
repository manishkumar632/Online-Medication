"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import RouteGuard from "../../../components/RouteGuard";
import { API_BASE_URL } from "@/lib/config";
import {
    ArrowLeft, Calendar, Clock, Video, Building2, MessageSquare,
    FileText, Pill, ChevronRight, User, Phone, Mail, MapPin,
    Check, X, AlertTriangle, Send, Shield, Stethoscope, Loader2
} from "lucide-react";
import "../../patient-workflow.css";

const STATUS_LABELS = {
    REQUESTED: "Requested", CONFIRMED: "Confirmed", IN_PROGRESS: "In Progress",
    COMPLETED: "Completed", CANCELLED: "Cancelled", REJECTED: "Rejected", NO_SHOW: "No Show",
};

const STATUS_STEPS = ["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];

function formatTime12(t) {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDateLong(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function AppointmentDetailClient() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const apptId = params?.id;

    const [appt, setAppt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [sendingChat, setSendingChat] = useState(false);

    useEffect(() => { if (apptId) { fetchDetail(); fetchChat(); } }, [apptId]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/${apptId}`, { credentials: "include" });
            const data = await res.json();
            if (data.success) setAppt(data.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchChat = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/${apptId}/chat?page=0&size=100`, { credentials: "include" });
            const data = await res.json();
            if (data.success) setChatMessages(data.data?.content || []);
        } catch (err) { console.error(err); }
    };

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/${apptId}/cancel`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                credentials: "include", body: JSON.stringify({ reason: cancelReason.trim() || null }),
            });
            const data = await res.json();
            if (data.success) { setToast({ type: "success", message: "Appointment cancelled" }); setAppt(data.data); setCancelModal(false); }
            else { setToast({ type: "error", message: data.message || "Failed to cancel" }); }
        } catch (err) { setToast({ type: "error", message: "Network error" }); }
        setCancelling(false);
    };

    const handleSendChat = async () => {
        if (!chatInput.trim()) return;
        setSendingChat(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/${apptId}/chat`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                credentials: "include", body: JSON.stringify({ content: chatInput.trim(), messageType: "TEXT" }),
            });
            const data = await res.json();
            if (data.success) { setChatMessages(prev => [...prev, data.data]); setChatInput(""); }
        } catch (err) { console.error(err); }
        setSendingChat(false);
    };

    useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

    if (loading) return <div className="pw-page"><div className="pw-loading"><div className="pw-spinner" /></div></div>;
    if (!appt) return <div className="pw-page"><div className="pw-empty"><h3>Appointment not found</h3></div></div>;

    const currentIdx = STATUS_STEPS.indexOf(appt.status);
    const isCancelled = appt.status === "CANCELLED" || appt.status === "REJECTED";
    const canCancel = ["REQUESTED", "CONFIRMED"].includes(appt.status);
    const TypeIcon = appt.type === "VIDEO" ? Video : appt.type === "IN_PERSON" ? Building2 : MessageSquare;

    return (
        <RouteGuard allowedRoles={["PATIENT"]}>
            <div className="pw-page">
                <div className="pw-breadcrumb">
                    <a onClick={() => router.push("/patient/appointments")} style={{ cursor: "pointer" }}>
                        <ArrowLeft size={14} style={{ verticalAlign: "middle" }} /> Appointments
                    </a>
                    <ChevronRight size={12} />
                    <span>Appointment Detail</span>
                </div>

                <div className="pw-detail-layout">
                    <div>
                        {/* Status */}
                        <div className="pw-detail-card">
                            <h3><span className={`pw-status-badge ${appt.status}`}>{STATUS_LABELS[appt.status]}</span></h3>
                            {!isCancelled && (
                                <div className="pw-status-timeline">
                                    {STATUS_STEPS.map((step, i) => {
                                        const done = currentIdx >= 0 && i <= currentIdx;
                                        const isCurrent = i === currentIdx;
                                        return (
                                            <div key={step} className={`pw-st-step ${done ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                                                <div className="pw-st-dot">{done && <Check size={10} />}</div>
                                                <div className="pw-st-label">{STATUS_LABELS[step]}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {isCancelled && (
                                <div style={{ padding: 12, background: "var(--pw-red-light)", borderRadius: 8, fontSize: "0.82rem", color: "var(--pw-red)", display: "flex", alignItems: "center", gap: 8 }}>
                                    <AlertTriangle size={16} />
                                    {appt.status === "REJECTED" ? `Rejected${appt.rejectionReason ? `: ${appt.rejectionReason}` : ""}` : `Cancelled${appt.cancellationReason ? `: ${appt.cancellationReason}` : ""}`}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="pw-detail-card">
                            <h3><Calendar size={16} /> Appointment Details</h3>
                            <div className="pw-detail-grid">
                                <div className="pw-detail-item"><Calendar size={16} /><div><div className="label">Date</div><div className="value">{formatDateLong(appt.scheduledDate)}</div></div></div>
                                <div className="pw-detail-item"><Clock size={16} /><div><div className="label">Time</div><div className="value">{formatTime12(appt.scheduledTime)}{appt.endTime ? ` – ${formatTime12(appt.endTime)}` : ""}</div></div></div>
                                <div className="pw-detail-item"><TypeIcon size={16} /><div><div className="label">Type</div><div className="value">{appt.type === "VIDEO" ? "Video Call" : appt.type === "IN_PERSON" ? "In-Person" : "Chat"}</div></div></div>
                                {appt.clinicName && <div className="pw-detail-item"><MapPin size={16} /><div><div className="label">Clinic</div><div className="value">{appt.clinicName}</div></div></div>}
                            </div>
                            {appt.symptoms && <div style={{ marginTop: 16, padding: 12, background: "var(--pw-bg)", borderRadius: 8 }}><div style={{ fontSize: "0.75rem", color: "var(--pw-muted)", marginBottom: 4 }}>Symptoms</div><div style={{ fontSize: "0.85rem", color: "var(--pw-text)" }}>{appt.symptoms}</div></div>}
                            {appt.diagnosis && <div style={{ marginTop: 12, padding: 12, background: "var(--pw-green-light)", borderRadius: 8 }}><div style={{ fontSize: "0.75rem", color: "var(--pw-green)", marginBottom: 4 }}>Diagnosis</div><div style={{ fontSize: "0.85rem", color: "var(--pw-text)" }}>{appt.diagnosis}</div></div>}
                            {appt.followUpDate && <div style={{ marginTop: 12, fontSize: "0.82rem", color: "var(--pw-blue)" }}>📅 Follow-up: {formatDateLong(appt.followUpDate)}</div>}
                            {canCancel && <div className="pw-actions-row"><button className="pw-btn pw-btn-outline pw-btn-sm" style={{ color: "var(--pw-red)", borderColor: "var(--pw-red)" }} onClick={() => setCancelModal(true)}><X size={14} /> Cancel</button></div>}
                        </div>

                        {/* Prescription */}
                        {appt.prescription && (
                            <div className="pw-detail-card">
                                <h3><Pill size={16} /> Prescription</h3>
                                <div className="pw-rx-card">
                                    {appt.prescription.diagnosis && <div style={{ marginBottom: 12, fontSize: "0.82rem" }}><strong>Diagnosis:</strong> {appt.prescription.diagnosis}</div>}
                                    {appt.prescription.items?.map(item => (
                                        <div key={item.id} className="pw-rx-item">
                                            <div className="pw-rx-icon"><Pill size={16} /></div>
                                            <div style={{ flex: 1 }}>
                                                <div className="pw-rx-name">{item.medicineName}</div>
                                                <div className="pw-rx-detail">{item.dosage && `${item.dosage} · `}{item.frequency && `${item.frequency} · `}{item.duration}</div>
                                                {item.instructions && <div style={{ fontSize: "0.7rem", color: "var(--pw-primary)", marginTop: 2 }}>💡 {item.instructions}</div>}
                                            </div>
                                            {item.quantity && <span style={{ fontSize: "0.72rem", color: "var(--pw-muted)" }}>Qty: {item.quantity}</span>}
                                        </div>
                                    ))}
                                    {appt.prescription.notes && <div style={{ marginTop: 12, padding: 10, background: "white", borderRadius: 8, fontSize: "0.8rem", color: "var(--pw-muted)" }}><strong>Notes:</strong> {appt.prescription.notes}</div>}
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        {appt.documents?.length > 0 && (
                            <div className="pw-detail-card">
                                <h3><FileText size={16} /> Documents</h3>
                                {appt.documents.map(doc => (
                                    <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--pw-border)" }}>
                                        <FileText size={16} style={{ color: "var(--pw-blue)" }} />
                                        <div style={{ flex: 1 }}><div style={{ fontSize: "0.82rem", fontWeight: 500 }}>{doc.fileName}</div><div style={{ fontSize: "0.7rem", color: "var(--pw-muted)" }}>{doc.fileType}</div></div>
                                        {doc.fileUrl && <a href={doc.fileUrl} target="_blank" className="pw-btn pw-btn-outline pw-btn-sm">View</a>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Doctor + Chat */}
                    <div>
                        <div className="pw-detail-card">
                            <h3><Stethoscope size={16} /> Doctor</h3>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--pw-primary), var(--pw-blue))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, flexShrink: 0 }}>
                                    {(appt.doctorName || "D").charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{appt.doctorName || "Doctor"}</div>
                                    <div style={{ color: "var(--pw-primary)", fontSize: "0.8rem" }}>{appt.doctorSpecialty || "General"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pw-detail-card">
                            <h3><MessageSquare size={16} /> Chat</h3>
                            <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                                {chatMessages.length === 0 ? (
                                    <p style={{ fontSize: "0.8rem", color: "var(--pw-muted)", textAlign: "center", padding: 20 }}>No messages yet</p>
                                ) : chatMessages.map(msg => {
                                    const isMe = msg.senderId === user?.userId;
                                    return (
                                        <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                                            <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: isMe ? "var(--pw-primary)" : "var(--pw-bg)", color: isMe ? "white" : "var(--pw-text)", fontSize: "0.82rem" }}>
                                                {!isMe && <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--pw-primary)", marginBottom: 2 }}>{msg.senderName}</div>}
                                                {msg.content}
                                                <div style={{ fontSize: "0.6rem", opacity: 0.6, textAlign: "right", marginTop: 3 }}>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendChat()} placeholder="Type a message..." style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--pw-border)", borderRadius: 8, fontSize: "0.82rem", outline: "none" }} />
                                <button className="pw-btn pw-btn-primary pw-btn-sm" onClick={handleSendChat} disabled={sendingChat || !chatInput.trim()}><Send size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancel Modal */}
                {cancelModal && (
                    <div className="pw-modal-overlay" onClick={() => setCancelModal(false)}>
                        <div className="pw-modal" onClick={e => e.stopPropagation()}>
                            <h3>Cancel Appointment</h3>
                            <p>Are you sure you want to cancel your appointment with {appt.doctorName}?</p>
                            <textarea className="pw-symptoms-input" placeholder="Reason (optional)" value={cancelReason} onChange={e => setCancelReason(e.target.value)} style={{ minHeight: 50 }} />
                            <div className="pw-modal-actions">
                                <button className="pw-btn pw-btn-outline pw-btn-sm" onClick={() => setCancelModal(false)}>Keep</button>
                                <button className="pw-btn pw-btn-danger pw-btn-sm" onClick={handleCancel} disabled={cancelling}>{cancelling ? "Cancelling..." : "Cancel Appointment"}</button>
                            </div>
                        </div>
                    </div>
                )}

                {toast && <div className={`pw-toast ${toast.type}`}>{toast.message}</div>}
            </div>
        </RouteGuard>
    );
}
