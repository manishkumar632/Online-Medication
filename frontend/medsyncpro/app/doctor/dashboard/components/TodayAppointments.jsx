"use client";
import { Video, MapPin, Play, Eye, RefreshCw } from "lucide-react";

const appointments = [
    { time: "09:00 AM", patient: "Sarah Johnson", condition: "Follow-up: Hypertension", type: "in-person", status: "completed", avatar: "SJ", color: "#0d9488" },
    { time: "09:30 AM", patient: "Michael Chen", condition: "Chest Pain Evaluation", type: "in-person", status: "completed", avatar: "MC", color: "#2563eb" },
    { time: "10:15 AM", patient: "Emma Wilson", condition: "Annual Checkup", type: "online", status: "in-progress", avatar: "EW", color: "#8b5cf6" },
    { time: "11:00 AM", patient: "James Brown", condition: "ECG Report Review", type: "online", status: "upcoming", avatar: "JB", color: "#f59e0b" },
    { time: "11:45 AM", patient: "Lisa Anderson", condition: "Blood Pressure Control", type: "in-person", status: "upcoming", avatar: "LA", color: "#059669" },
    { time: "02:00 PM", patient: "Robert Taylor", condition: "Post-Surgery Review", type: "in-person", status: "upcoming", avatar: "RT", color: "#ef4444" },
    { time: "03:00 PM", patient: "Maria Garcia", condition: "Medication Adjustment", type: "online", status: "upcoming", avatar: "MG", color: "#0891b2" },
];

const statusLabel = { completed: "Completed", "in-progress": "In Progress", upcoming: "Upcoming" };

export default function TodayAppointments() {
    return (
        <div className="doc-glass-card doc-appointments-card">
            <div className="doc-card-header">
                <h3>Today&apos;s Appointments</h3>
                <span className="doc-card-count">{appointments.length} scheduled</span>
            </div>
            <div className="doc-timeline">
                {appointments.map((a, i) => (
                    <div key={i} className={`doc-timeline-item ${a.status}`}>
                        <div className="doc-timeline-time">{a.time}</div>
                        <div className="doc-timeline-dot" />
                        <div className="doc-timeline-content">
                            <div className="doc-timeline-row">
                                <div className="doc-timeline-avatar" style={{ background: a.color }}>{a.avatar}</div>
                                <div className="doc-timeline-info">
                                    <div className="doc-timeline-patient">{a.patient}</div>
                                    <div className="doc-timeline-condition">{a.condition}</div>
                                </div>
                                <div className="doc-timeline-meta">
                                    <span className={`doc-type-badge ${a.type}`}>
                                        {a.type === "online" ? <Video size={11} /> : <MapPin size={11} />}
                                        {a.type === "online" ? "Online" : "In-person"}
                                    </span>
                                    <span className={`doc-status-pill ${a.status}`}>{statusLabel[a.status]}</span>
                                </div>
                            </div>
                            <div className="doc-timeline-actions">
                                {a.status === "upcoming" && (
                                    <button className="doc-action-start"><Play size={12} /> Start</button>
                                )}
                                <button className="doc-action-view"><Eye size={12} /> View</button>
                                {a.status === "upcoming" && (
                                    <button className="doc-action-resched"><RefreshCw size={12} /> Reschedule</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
