"use client";
import { useState, useMemo } from "react";
import {
    Search, Plus, X, ChevronLeft, ChevronRight, Clock, Calendar, CalendarDays,
    CalendarRange, User, Video, Building2, Phone, Mail, MapPin, AlertTriangle,
    Pill, StickyNote, Send, Eye, Play, RefreshCw, Trash2, CheckCircle2,
    CircleAlert, Timer, ArrowUpDown, Filter, FileText, Stethoscope,
    ClipboardList, CalendarCheck, CalendarX, CalendarClock, Users, Activity,
    Heart, Thermometer, ChevronDown, MoreHorizontal, Flag, Star, XCircle
} from "lucide-react";
import "../doctor-appointments.css";

// ─── Mock Data ───
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const APPOINTMENTS = [
    { id: 1, patient: "Sarah Johnson", age: 34, gender: "F", avatar: "SJ", color: "#0d9488", condition: "Hypertension", time: "09:00", endTime: "09:30", type: "in-person", status: "completed", date: "2026-02-25", phone: "+91 98765 43210", email: "sarah.j@email.com", reason: "Regular BP check-up", notes: "BP trending down, continue current medication" },
    { id: 2, patient: "Michael Chen", age: 45, gender: "M", avatar: "MC", color: "#dc2626", condition: "Coronary Artery Disease", time: "09:30", endTime: "10:00", type: "in-person", status: "completed", date: "2026-02-25", phone: "+91 98123 45678", email: "m.chen@email.com", reason: "Post-intervention follow-up", notes: "Recovery on track. Next ECG in 2 weeks." },
    { id: 3, patient: "Emma Wilson", age: 28, gender: "F", avatar: "EW", color: "#8b5cf6", condition: "Arrhythmia", time: "10:30", endTime: "11:00", type: "online", status: "in-progress", date: "2026-02-25", phone: "+91 91234 56780", email: "emma.w@email.com", reason: "Medication review", notes: "" },
    { id: 4, patient: "James Brown", age: 52, gender: "M", avatar: "JB", color: "#ef4444", condition: "Heart Failure", time: "11:00", endTime: "11:30", type: "in-person", status: "confirmed", date: "2026-02-25", phone: "+91 87654 32109", email: "j.brown@email.com", reason: "Routine cardiac evaluation", notes: "" },
    { id: 5, patient: "Priya Sharma", age: 42, gender: "F", avatar: "PS", color: "#2563eb", condition: "Atrial Fibrillation", time: "11:30", endTime: "12:00", type: "online", status: "scheduled", date: "2026-02-25", phone: "+91 54321 09876", email: "priya.s@email.com", reason: "Anticoagulation management", notes: "" },
    { id: 6, patient: "Lisa Anderson", age: 39, gender: "F", avatar: "LA", color: "#059669", condition: "Hyperlipidemia", time: "14:00", endTime: "14:30", type: "in-person", status: "scheduled", date: "2026-02-25", phone: "+91 76543 21098", email: "lisa.a@email.com", reason: "Lipid panel review", notes: "" },
    { id: 7, patient: "Robert Taylor", age: 61, gender: "M", avatar: "RT", color: "#f59e0b", condition: "Post-CABG Recovery", time: "14:30", endTime: "15:00", type: "in-person", status: "scheduled", date: "2026-02-25", phone: "+91 65432 10987", email: "r.taylor@email.com", reason: "Post-surgery follow-up", notes: "" },
    { id: 8, patient: "David Kim", age: 55, gender: "M", avatar: "DK", color: "#dc2626", condition: "Aortic Stenosis", time: "15:30", endTime: "16:00", type: "in-person", status: "scheduled", date: "2026-02-25", phone: "+91 43210 98765", email: "d.kim@email.com", reason: "Pre-surgical assessment", notes: "" },
    { id: 9, patient: "Anita Patel", age: 30, gender: "F", avatar: "AP", color: "#6366f1", condition: "Mitral Valve Prolapse", time: "16:00", endTime: "16:30", type: "online", status: "scheduled", date: "2026-02-25", phone: "+91 32109 87654", email: "a.patel@email.com", reason: "New patient consultation", notes: "" },
    { id: 10, patient: "Thomas Lee", age: 68, gender: "M", avatar: "TL", color: "#f97316", condition: "Peripheral Artery Disease", time: "17:00", endTime: "17:30", type: "in-person", status: "cancelled", date: "2026-02-25", phone: "+91 21098 76543", email: "t.lee@email.com", reason: "Medication adjustment", notes: "Patient cancelled due to travel" },
];

const STATUS_CONFIG = {
    scheduled: { label: "Scheduled", cls: "scheduled", icon: CalendarClock },
    confirmed: { label: "Confirmed", cls: "confirmed", icon: CalendarCheck },
    "in-progress": { label: "In Progress", cls: "inprogress", icon: Play },
    completed: { label: "Completed", cls: "completed", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", cls: "cancelled", icon: XCircle },
    missed: { label: "Missed", cls: "missed", icon: CircleAlert },
    followup: { label: "Follow-up", cls: "followup", icon: RefreshCw },
};

const VIEWS = [
    { id: "day", label: "Day", icon: Calendar },
    { id: "list", label: "List", icon: ClipboardList },
];

const STATUS_FILTERS = ["All", "Scheduled", "Confirmed", "In Progress", "Completed", "Cancelled"];

// ─── Helpers ───
function StatusBadge({ status }) {
    const s = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled;
    const Icon = s.icon;
    return <span className={`da-status-badge ${s.cls}`}><Icon size={11} /> {s.label}</span>;
}

function TypeBadge({ type }) {
    return (
        <span className={`da-type-badge ${type}`}>
            {type === "online" ? <Video size={11} /> : <Building2 size={11} />}
            {type === "online" ? "Online" : "In-person"}
        </span>
    );
}

function formatTime(t) {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

// ═══════════════════════════════════════════════════
//  SUMMARY CARDS
// ═══════════════════════════════════════════════════
function SummaryCards({ appointments }) {
    const total = appointments.length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const pending = appointments.filter((a) => ["scheduled", "confirmed"].includes(a.status)).length;
    const inProgress = appointments.filter((a) => a.status === "in-progress").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;

    const cards = [
        { label: "Total Today", value: total, icon: CalendarDays, cls: "total" },
        { label: "Completed", value: completed, icon: CheckCircle2, cls: "completed" },
        { label: "In Progress", value: inProgress, icon: Play, cls: "inprogress" },
        { label: "Pending", value: pending, icon: Timer, cls: "pending" },
        { label: "Cancelled", value: cancelled, icon: XCircle, cls: "cancelled" },
    ];

    return (
        <div className="da-summary-row">
            {cards.map((c) => (
                <div key={c.label} className={`da-summary-card ${c.cls}`}>
                    <div className="da-summary-icon"><c.icon size={18} /></div>
                    <div>
                        <span className="da-summary-value">{c.value}</span>
                        <span className="da-summary-label">{c.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════
//  NEXT APPOINTMENT WIDGET
// ═══════════════════════════════════════════════════
function NextAppointmentCard({ appointments }) {
    const next = appointments.find((a) => ["scheduled", "confirmed"].includes(a.status));
    if (!next) return null;

    return (
        <div className="da-next-card">
            <div className="da-next-label"><Clock size={13} /> Next Appointment</div>
            <div className="da-next-info">
                <div className="da-next-avatar" style={{ background: next.color }}>{next.avatar}</div>
                <div>
                    <span className="da-next-name">{next.patient}</span>
                    <span className="da-next-meta">{formatTime(next.time)} – {formatTime(next.endTime)} · {next.reason}</span>
                </div>
                <TypeBadge type={next.type} />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
//  DAY TIMELINE VIEW
// ═══════════════════════════════════════════════════
function DayTimeline({ appointments, onSelect }) {
    return (
        <div className="da-timeline">
            <div className="da-timeline-grid">
                {HOURS.map((hour) => {
                    const hourAppts = appointments.filter((a) => {
                        const h = parseInt(a.time.split(":")[0]);
                        return h === hour;
                    });
                    const timeLabel = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`;

                    return (
                        <div key={hour} className="da-timeline-row">
                            <div className="da-timeline-time">{timeLabel}</div>
                            <div className="da-timeline-slot">
                                <div className="da-timeline-line" />
                                {hourAppts.map((appt) => (
                                    <div
                                        key={appt.id}
                                        className={`da-timeline-card ${appt.status} ${appt.type}`}
                                        onClick={() => onSelect(appt)}
                                    >
                                        <div className="da-tc-header">
                                            <div className="da-tc-patient">
                                                <div className="da-tc-avatar" style={{ background: appt.color }}>{appt.avatar}</div>
                                                <div>
                                                    <span className="da-tc-name">{appt.patient}</span>
                                                    <span className="da-tc-condition">{appt.condition}</span>
                                                </div>
                                            </div>
                                            <StatusBadge status={appt.status} />
                                        </div>
                                        <div className="da-tc-footer">
                                            <span className="da-tc-time"><Clock size={11} /> {formatTime(appt.time)} – {formatTime(appt.endTime)}</span>
                                            <TypeBadge type={appt.type} />
                                        </div>
                                        <div className="da-tc-actions">
                                            {["scheduled", "confirmed"].includes(appt.status) && (
                                                <button className="da-tc-btn start" onClick={(e) => { e.stopPropagation(); }}><Play size={12} /> Start</button>
                                            )}
                                            {appt.status === "in-progress" && (
                                                <button className="da-tc-btn start" onClick={(e) => { e.stopPropagation(); }}><Play size={12} /> Continue</button>
                                            )}
                                            <button className="da-tc-btn" onClick={(e) => { e.stopPropagation(); onSelect(appt); }}><Eye size={12} /> View</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
//  LIST VIEW
// ═══════════════════════════════════════════════════
function ListView({ appointments, onSelect }) {
    return (
        <div className="da-list-card">
            <table className="da-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appt) => (
                        <tr key={appt.id} className={appt.status === "cancelled" ? "cancelled-row" : ""} onClick={() => onSelect(appt)}>
                            <td>
                                <div className="da-time-cell">
                                    <Clock size={13} />
                                    <div>
                                        <span className="da-time-main">{formatTime(appt.time)}</span>
                                        <span className="da-time-end">to {formatTime(appt.endTime)}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="da-patient-cell">
                                    <div className="da-table-avatar" style={{ background: appt.color }}>{appt.avatar}</div>
                                    <div>
                                        <span className="da-patient-name">{appt.patient}</span>
                                        <span className="da-patient-meta">{appt.age}y · {appt.gender} · {appt.condition}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="da-reason-cell">{appt.reason}</td>
                            <td><TypeBadge type={appt.type} /></td>
                            <td><StatusBadge status={appt.status} /></td>
                            <td>
                                <div className="da-actions" onClick={(e) => e.stopPropagation()}>
                                    {["scheduled", "confirmed"].includes(appt.status) && (
                                        <button className="da-action-btn start" title="Start Consultation"><Play size={14} /></button>
                                    )}
                                    <button className="da-action-btn" title="View" onClick={() => onSelect(appt)}><Eye size={14} /></button>
                                    <button className="da-action-btn" title="Reschedule"><RefreshCw size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ═══════════════════════════════════════════════════
//  APPOINTMENT DRAWER
// ═══════════════════════════════════════════════════
function AppointmentDrawer({ appt, onClose }) {
    if (!appt) return null;

    const statusSteps = ["scheduled", "confirmed", "in-progress", "completed"];
    const currentIdx = statusSteps.indexOf(appt.status);

    return (
        <>
            <div className="da-drawer-overlay" onClick={onClose} />
            <aside className="da-drawer">
                <div className="da-drawer-header">
                    <h3>Appointment Details</h3>
                    <button onClick={onClose} className="da-drawer-close"><X size={18} /></button>
                </div>

                <div className="da-drawer-body">
                    {/* Patient Info */}
                    <div className="da-drawer-patient">
                        <div className="da-drawer-avatar" style={{ background: appt.color }}>{appt.avatar}</div>
                        <div>
                            <h4 className="da-drawer-name">{appt.patient}</h4>
                            <span className="da-drawer-meta">{appt.age}y · {appt.gender === "M" ? "Male" : "Female"} · {appt.condition}</span>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="da-status-timeline">
                        <h5>Status</h5>
                        <div className="da-st-track">
                            {statusSteps.map((step, i) => {
                                const done = i <= currentIdx && appt.status !== "cancelled";
                                const isCurrent = i === currentIdx;
                                return (
                                    <div key={step} className={`da-st-step ${done ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                                        <div className="da-st-dot" />
                                        <span>{STATUS_CONFIG[step]?.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {appt.status === "cancelled" && (
                            <div className="da-cancelled-banner"><XCircle size={14} /> This appointment was cancelled</div>
                        )}
                    </div>

                    {/* Appointment Details */}
                    <div className="da-drawer-section">
                        <h5>Details</h5>
                        <div className="da-detail-grid">
                            <div className="da-detail-item">
                                <Calendar size={13} /> <span>February 25, 2026</span>
                            </div>
                            <div className="da-detail-item">
                                <Clock size={13} /> <span>{formatTime(appt.time)} – {formatTime(appt.endTime)}</span>
                            </div>
                            <div className="da-detail-item">
                                {appt.type === "online" ? <Video size={13} /> : <Building2 size={13} />}
                                <span>{appt.type === "online" ? "Online Consultation" : "In-Person Visit"}</span>
                            </div>
                            <div className="da-detail-item">
                                <FileText size={13} /> <span>{appt.reason}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="da-drawer-section">
                        <h5>Contact</h5>
                        <div className="da-detail-grid">
                            <div className="da-detail-item"><Phone size={13} /> <span>{appt.phone}</span></div>
                            <div className="da-detail-item"><Mail size={13} /> <span>{appt.email}</span></div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="da-drawer-section">
                        <h5>Notes</h5>
                        {appt.notes ? (
                            <p className="da-drawer-notes">{appt.notes}</p>
                        ) : (
                            <p className="da-drawer-empty">No notes for this appointment</p>
                        )}
                    </div>

                    {/* Past Visits */}
                    <div className="da-drawer-section">
                        <h5>Recent Visits</h5>
                        <div className="da-past-visits">
                            <div className="da-pv-item">
                                <span className="da-pv-date">Feb 18, 2026</span>
                                <span className="da-pv-reason">Follow-up — BP: 135/88</span>
                            </div>
                            <div className="da-pv-item">
                                <span className="da-pv-date">Feb 04, 2026</span>
                                <span className="da-pv-reason">Routine Check-up</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="da-drawer-footer">
                    {["scheduled", "confirmed"].includes(appt.status) && (
                        <button className="da-btn-primary"><Play size={14} /> Start Consultation</button>
                    )}
                    {appt.status === "in-progress" && (
                        <button className="da-btn-primary"><Play size={14} /> Continue Consultation</button>
                    )}
                    <button className="da-btn-outline"><Pill size={14} /> Prescribe</button>
                    <button className="da-btn-outline"><StickyNote size={14} /> Note</button>
                    {appt.status !== "completed" && appt.status !== "cancelled" && (
                        <>
                            <button className="da-btn-outline"><RefreshCw size={14} /> Reschedule</button>
                            <button className="da-btn-danger-outline"><XCircle size={14} /> Cancel</button>
                        </>
                    )}
                    {appt.status === "completed" && (
                        <button className="da-btn-outline"><RefreshCw size={14} /> Schedule Follow-up</button>
                    )}
                </div>
            </aside>
        </>
    );
}

// ═══════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════
export default function DoctorAppointmentsPage() {
    const [view, setView] = useState("day");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedAppt, setSelectedAppt] = useState(null);

    // Current date display
    const dateStr = "Wednesday, February 25, 2026";

    const filtered = useMemo(() => {
        return APPOINTMENTS.filter((a) => {
            const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) ||
                a.condition.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "All" ||
                STATUS_CONFIG[a.status]?.label === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    return (
        <div className="da-page">
            {/* Header */}
            <div className="da-header">
                <div>
                    <h1 className="da-title">Appointments</h1>
                    <p className="da-subtitle">{dateStr}</p>
                </div>
                <button className="da-btn-primary"><Plus size={15} /> New Appointment</button>
            </div>

            {/* Summary Cards */}
            <SummaryCards appointments={APPOINTMENTS} />

            {/* Next Appointment */}
            <NextAppointmentCard appointments={filtered} />

            {/* Toolbar */}
            <div className="da-toolbar">
                <div className="da-search">
                    <Search size={16} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient name or condition..." />
                    {search && <button className="da-search-clear" onClick={() => setSearch("")}><X size={14} /></button>}
                </div>

                <div className="da-filter-pills">
                    {STATUS_FILTERS.map((f) => (
                        <button key={f} className={`da-filter-pill ${statusFilter === f ? "active" : ""}`} onClick={() => setStatusFilter(f)}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="da-view-switcher">
                    {VIEWS.map((v) => (
                        <button key={v.id} className={`da-view-btn ${view === v.id ? "active" : ""}`} onClick={() => setView(v.id)}>
                            <v.icon size={14} /> {v.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main View */}
            {filtered.length > 0 ? (
                view === "day" ? (
                    <DayTimeline appointments={filtered} onSelect={setSelectedAppt} />
                ) : (
                    <ListView appointments={filtered} onSelect={setSelectedAppt} />
                )
            ) : (
                <div className="da-empty">
                    <CalendarX size={40} />
                    <h3>No appointments found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}

            {/* Drawer */}
            <AppointmentDrawer appt={selectedAppt} onClose={() => setSelectedAppt(null)} />
        </div>
    );
}
