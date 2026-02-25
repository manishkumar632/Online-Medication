"use client";
import { useState, useMemo } from "react";
import {
    Search, SlidersHorizontal, Plus, Eye, FileText, Pill, ChevronLeft, ChevronRight,
    X, Phone, Mail, MapPin, AlertTriangle, Heart, Thermometer, Activity, Clock,
    Calendar, User, Stethoscope, ClipboardList, TrendingUp, Weight, Droplets,
    CircleAlert, CheckCircle2, StickyNote, Send, ChevronDown, ArrowUpDown,
    UserPlus, Filter, MoreHorizontal, Flag, MessageSquare, Star
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import "../doctor-patients.css";

// ─── Mock Data ───
const PATIENTS = [
    { id: 1, name: "Sarah Johnson", age: 34, gender: "Female", condition: "Hypertension", lastVisit: "Feb 25, 2026", nextAppt: "Mar 04, 2026", status: "active", avatar: "SJ", color: "#0d9488", phone: "+91 98765 43210", email: "sarah.j@email.com", address: "Marine Drive, Mumbai", allergies: ["Penicillin", "Sulfa drugs"], medications: ["Amlodipine 5mg", "Losartan 50mg"], bloodGroup: "A+", risk: false },
    { id: 2, name: "Michael Chen", age: 45, gender: "Male", condition: "Coronary Artery Disease", lastVisit: "Feb 25, 2026", nextAppt: "Mar 01, 2026", status: "critical", avatar: "MC", color: "#dc2626", phone: "+91 98123 45678", email: "m.chen@email.com", address: "Andheri, Mumbai", allergies: ["Aspirin"], medications: ["Clopidogrel 75mg", "Atorvastatin 40mg", "Metoprolol 50mg"], bloodGroup: "B+", risk: true },
    { id: 3, name: "Emma Wilson", age: 28, gender: "Female", condition: "Arrhythmia", lastVisit: "Feb 20, 2026", nextAppt: "Mar 10, 2026", status: "active", avatar: "EW", color: "#8b5cf6", phone: "+91 91234 56780", email: "emma.w@email.com", address: "Bandra, Mumbai", allergies: [], medications: ["Amiodarone 200mg"], bloodGroup: "O+", risk: false },
    { id: 4, name: "James Brown", age: 52, gender: "Male", condition: "Heart Failure", lastVisit: "Feb 18, 2026", nextAppt: "Feb 28, 2026", status: "critical", avatar: "JB", color: "#ef4444", phone: "+91 87654 32109", email: "j.brown@email.com", address: "Juhu, Mumbai", allergies: ["ACE Inhibitors"], medications: ["Furosemide 40mg", "Digoxin 0.25mg", "Carvedilol 25mg"], bloodGroup: "AB+", risk: true },
    { id: 5, name: "Lisa Anderson", age: 39, gender: "Female", condition: "Hyperlipidemia", lastVisit: "Feb 15, 2026", nextAppt: null, status: "followup", avatar: "LA", color: "#059669", phone: "+91 76543 21098", email: "lisa.a@email.com", address: "Powai, Mumbai", allergies: [], medications: ["Rosuvastatin 10mg"], bloodGroup: "A-", risk: false },
    { id: 6, name: "Robert Taylor", age: 61, gender: "Male", condition: "Post-CABG Recovery", lastVisit: "Feb 12, 2026", nextAppt: "Mar 05, 2026", status: "followup", avatar: "RT", color: "#f59e0b", phone: "+91 65432 10987", email: "r.taylor@email.com", address: "Colaba, Mumbai", allergies: ["Morphine"], medications: ["Warfarin 5mg", "Enalapril 10mg"], bloodGroup: "O-", risk: false },
    { id: 7, name: "Priya Sharma", age: 42, gender: "Female", condition: "Atrial Fibrillation", lastVisit: "Feb 22, 2026", nextAppt: "Mar 08, 2026", status: "active", avatar: "PS", color: "#2563eb", phone: "+91 54321 09876", email: "priya.s@email.com", address: "Worli, Mumbai", allergies: ["Ibuprofen"], medications: ["Rivaroxaban 20mg", "Flecainide 100mg"], bloodGroup: "B-", risk: false },
    { id: 8, name: "David Kim", age: 55, gender: "Male", condition: "Aortic Stenosis", lastVisit: "Feb 10, 2026", nextAppt: "Feb 27, 2026", status: "critical", avatar: "DK", color: "#dc2626", phone: "+91 43210 98765", email: "d.kim@email.com", address: "Churchgate, Mumbai", allergies: ["Latex"], medications: ["Atenolol 25mg"], bloodGroup: "A+", risk: true },
    { id: 9, name: "Anita Patel", age: 30, gender: "Female", condition: "Mitral Valve Prolapse", lastVisit: "Feb 24, 2026", nextAppt: null, status: "new", avatar: "AP", color: "#6366f1", phone: "+91 32109 87654", email: "a.patel@email.com", address: "Dadar, Mumbai", allergies: [], medications: [], bloodGroup: "O+", risk: false },
    { id: 10, name: "Thomas Lee", age: 68, gender: "Male", condition: "Peripheral Artery Disease", lastVisit: "Feb 08, 2026", nextAppt: "Mar 02, 2026", status: "followup", avatar: "TL", color: "#f97316", phone: "+91 21098 76543", email: "t.lee@email.com", address: "Borivali, Mumbai", allergies: ["Codeine"], medications: ["Cilostazol 100mg", "Aspirin 81mg"], bloodGroup: "AB-", risk: false },
];

const TIMELINE = [
    { date: "Feb 25, 2026", type: "visit", title: "Regular Check-up", desc: "BP: 130/85, Heart Rate: 78 bpm. Medication adjusted.", doctor: "Dr. Smith" },
    { date: "Feb 18, 2026", type: "prescription", title: "Prescription Updated", desc: "Amlodipine dose increased from 5mg to 10mg.", doctor: "Dr. Smith" },
    { date: "Feb 10, 2026", type: "lab", title: "Lab Results", desc: "Lipid Panel: Total Cholesterol 210, LDL 130, HDL 48, Triglycerides 165.", doctor: "Dr. Smith" },
    { date: "Jan 28, 2026", type: "visit", title: "Follow-up Visit", desc: "Patient reports dizziness. ECG normal. Advised to monitor BP at home.", doctor: "Dr. Smith" },
    { date: "Jan 15, 2026", type: "note", title: "Doctor Note", desc: "Patient needs closer monitoring. Consider adding beta-blocker if BP remains elevated.", doctor: "Dr. Smith" },
    { date: "Jan 05, 2026", type: "lab", title: "Blood Work", desc: "CBC normal. HbA1c: 5.8%. Kidney function within limits.", doctor: "Dr. Smith" },
];

const BP_DATA = [
    { date: "Jan", systolic: 142, diastolic: 92 },
    { date: "Feb", systolic: 138, diastolic: 88 },
    { date: "Mar", systolic: 135, diastolic: 86 },
    { date: "Apr", systolic: 132, diastolic: 84 },
    { date: "May", systolic: 130, diastolic: 85 },
    { date: "Jun", systolic: 128, diastolic: 82 },
];

const WEIGHT_DATA = [
    { date: "Jan", weight: 82 }, { date: "Feb", weight: 81 }, { date: "Mar", weight: 80.5 },
    { date: "Apr", weight: 79.8 }, { date: "May", weight: 79.2 }, { date: "Jun", weight: 78.5 },
];

const PRESCRIPTIONS = [
    { drug: "Amlodipine", dose: "10mg", freq: "Once daily", started: "Feb 18, 2026", status: "active", refill: true },
    { drug: "Losartan", dose: "50mg", freq: "Once daily", started: "Jan 05, 2026", status: "active", refill: false },
    { drug: "Atorvastatin", dose: "20mg", freq: "Nightly", started: "Dec 10, 2025", status: "active", refill: false },
    { drug: "Hydrochlorothiazide", dose: "12.5mg", freq: "Morning", started: "Nov 01, 2025", status: "discontinued", refill: false },
];

const NOTES = [
    { date: "Feb 25, 2026", text: "Patient responding well to increased Amlodipine dose. BP trending down. Continue monitoring.", important: false },
    { date: "Jan 28, 2026", text: "⚠️ Patient reports episodes of dizziness, especially when standing. Rule out orthostatic hypotension. Consider adjusting evening medications.", important: true },
    { date: "Jan 15, 2026", text: "Discussed lifestyle modifications. Patient agrees to reduce sodium intake and start 30-min daily walks.", important: false },
];

const STATUS_MAP = {
    active: { label: "Active", cls: "active" },
    critical: { label: "Critical", cls: "critical" },
    followup: { label: "Follow-up", cls: "followup" },
    new: { label: "New", cls: "new" },
};

const FILTERS = ["All", "Active", "Critical", "Follow-up", "New"];

// ─── Status Badge ───
function StatusBadge({ status }) {
    const s = STATUS_MAP[status] || STATUS_MAP.active;
    return <span className={`dp-status-badge ${s.cls}`}>{s.label}</span>;
}

// ─── Timeline Icon ───
function TimelineIcon({ type }) {
    const map = {
        visit: { icon: Stethoscope, cls: "visit" },
        prescription: { icon: Pill, cls: "rx" },
        lab: { icon: Activity, cls: "lab" },
        note: { icon: StickyNote, cls: "note" },
    };
    const t = map[type] || map.visit;
    const Icon = t.icon;
    return <div className={`dp-tl-icon ${t.cls}`}><Icon size={14} /></div>;
}

// ═══════════════════════════════════════════════════
//  PATIENT QUICK PREVIEW DRAWER
// ═══════════════════════════════════════════════════
function PatientDrawer({ patient, onClose, onOpenProfile }) {
    if (!patient) return null;
    return (
        <>
            <div className="dp-drawer-overlay" onClick={onClose} />
            <aside className="dp-drawer">
                <div className="dp-drawer-header">
                    <h3>Patient Preview</h3>
                    <button onClick={onClose} className="dp-drawer-close"><X size={18} /></button>
                </div>

                <div className="dp-drawer-body">
                    <div className="dp-drawer-profile">
                        <div className="dp-drawer-avatar" style={{ background: patient.color }}>{patient.avatar}</div>
                        <div>
                            <h4 className="dp-drawer-name">{patient.name}</h4>
                            <span className="dp-drawer-meta">{patient.age}y · {patient.gender} · {patient.bloodGroup}</span>
                            <StatusBadge status={patient.status} />
                        </div>
                    </div>

                    {patient.risk && (
                        <div className="dp-drawer-alert">
                            <AlertTriangle size={14} /> High Risk Patient — Needs Close Monitoring
                        </div>
                    )}

                    <div className="dp-drawer-section">
                        <h5>Contact</h5>
                        <div className="dp-drawer-info-row"><Phone size={13} /> {patient.phone}</div>
                        <div className="dp-drawer-info-row"><Mail size={13} /> {patient.email}</div>
                        <div className="dp-drawer-info-row"><MapPin size={13} /> {patient.address}</div>
                    </div>

                    <div className="dp-drawer-section">
                        <h5>Primary Condition</h5>
                        <span className="dp-condition-tag">{patient.condition}</span>
                    </div>

                    <div className="dp-drawer-section">
                        <h5>Allergies</h5>
                        <div className="dp-tag-row">
                            {patient.allergies.length > 0
                                ? patient.allergies.map((a) => <span key={a} className="dp-allergy-tag"><AlertTriangle size={10} /> {a}</span>)
                                : <span className="dp-none-text">No known allergies</span>}
                        </div>
                    </div>

                    <div className="dp-drawer-section">
                        <h5>Current Medications</h5>
                        <div className="dp-med-list">
                            {patient.medications.length > 0
                                ? patient.medications.map((m) => <div key={m} className="dp-med-item"><Pill size={12} /> {m}</div>)
                                : <span className="dp-none-text">No active medications</span>}
                        </div>
                    </div>

                    <div className="dp-drawer-section">
                        <h5>Latest Vitals</h5>
                        <div className="dp-vitals-mini">
                            <div className="dp-vital-card"><Heart size={14} /><span>130/85</span><small>BP</small></div>
                            <div className="dp-vital-card"><Activity size={14} /><span>78</span><small>Heart Rate</small></div>
                            <div className="dp-vital-card"><Thermometer size={14} /><span>98.2°F</span><small>Temp</small></div>
                            <div className="dp-vital-card"><Droplets size={14} /><span>98%</span><small>SpO₂</small></div>
                        </div>
                    </div>
                </div>

                <div className="dp-drawer-footer">
                    <button className="dp-btn-primary" onClick={() => onOpenProfile(patient)}><Eye size={14} /> Full Profile</button>
                    <button className="dp-btn-outline"><Pill size={14} /> Prescribe</button>
                    <button className="dp-btn-outline"><StickyNote size={14} /> Note</button>
                </div>
            </aside>
        </>
    );
}

// ═══════════════════════════════════════════════════
//  PATIENT DETAIL PROFILE
// ═══════════════════════════════════════════════════
function PatientProfile({ patient, onBack }) {
    const [tab, setTab] = useState("timeline");

    return (
        <div className="dp-profile">
            {/* Sticky Header */}
            <div className="dp-profile-header">
                <button className="dp-back-btn" onClick={onBack}><ChevronLeft size={18} /> Back to Patients</button>
                <div className="dp-profile-hero">
                    <div className="dp-profile-avatar" style={{ background: patient.color }}>{patient.avatar}</div>
                    <div className="dp-profile-info">
                        <div className="dp-profile-name-row">
                            <h2>{patient.name}</h2>
                            <StatusBadge status={patient.status} />
                            {patient.risk && <span className="dp-risk-flag"><AlertTriangle size={13} /> High Risk</span>}
                        </div>
                        <p className="dp-profile-meta">{patient.age} years · {patient.gender} · Blood Group: {patient.bloodGroup}</p>
                        <div className="dp-profile-contact">
                            <span><Phone size={12} /> {patient.phone}</span>
                            <span><Mail size={12} /> {patient.email}</span>
                        </div>
                    </div>
                    <div className="dp-profile-actions">
                        <button className="dp-btn-primary"><Pill size={14} /> Write Prescription</button>
                        <button className="dp-btn-outline"><Stethoscope size={14} /> Start Consultation</button>
                        <button className="dp-btn-outline"><StickyNote size={14} /> Add Note</button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="dp-quick-stats">
                    <div className="dp-qs-card">
                        <span className="dp-qs-label">Primary Condition</span>
                        <span className="dp-qs-value">{patient.condition}</span>
                    </div>
                    <div className="dp-qs-card">
                        <span className="dp-qs-label">Last Visit</span>
                        <span className="dp-qs-value">{patient.lastVisit}</span>
                    </div>
                    <div className="dp-qs-card">
                        <span className="dp-qs-label">Next Appointment</span>
                        <span className="dp-qs-value">{patient.nextAppt || "Not Scheduled"}</span>
                    </div>
                    <div className="dp-qs-card">
                        <span className="dp-qs-label">Allergies</span>
                        <span className="dp-qs-value">{patient.allergies.length > 0 ? patient.allergies.join(", ") : "None"}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="dp-tabs">
                {[
                    { id: "timeline", label: "Medical History", icon: ClipboardList },
                    { id: "prescriptions", label: "Prescriptions", icon: Pill },
                    { id: "vitals", label: "Vitals & Reports", icon: TrendingUp },
                    { id: "notes", label: "Notes", icon: StickyNote },
                    { id: "appointments", label: "Appointments", icon: Calendar },
                ].map((t) => (
                    <button key={t.id} className={`dp-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                        <t.icon size={15} /> {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="dp-tab-content">
                {tab === "timeline" && <TimelineTab />}
                {tab === "prescriptions" && <PrescriptionsTab />}
                {tab === "vitals" && <VitalsTab />}
                {tab === "notes" && <NotesTab />}
                {tab === "appointments" && <AppointmentsTab patient={patient} />}
            </div>
        </div>
    );
}

// ─── Timeline Tab ───
function TimelineTab() {
    return (
        <div className="dp-section-card">
            <h3 className="dp-section-title"><ClipboardList size={18} /> Medical History Timeline</h3>
            <div className="dp-timeline">
                {TIMELINE.map((item, i) => (
                    <div key={i} className="dp-tl-item">
                        <TimelineIcon type={item.type} />
                        <div className="dp-tl-line" />
                        <div className="dp-tl-content">
                            <div className="dp-tl-header">
                                <span className="dp-tl-title">{item.title}</span>
                                <span className="dp-tl-date"><Clock size={11} /> {item.date}</span>
                            </div>
                            <p className="dp-tl-desc">{item.desc}</p>
                            <span className="dp-tl-doctor">{item.doctor}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Prescriptions Tab ───
function PrescriptionsTab() {
    return (
        <div className="dp-section-card">
            <div className="dp-section-header">
                <h3 className="dp-section-title"><Pill size={18} /> Prescriptions</h3>
                <button className="dp-btn-primary dp-btn-sm"><Plus size={13} /> Create Prescription</button>
            </div>
            <div className="dp-rx-grid">
                {PRESCRIPTIONS.map((rx, i) => (
                    <div key={i} className={`dp-rx-card ${rx.status === "discontinued" ? "discontinued" : ""}`}>
                        <div className="dp-rx-top">
                            <div className="dp-rx-drug">
                                <Pill size={15} />
                                <div>
                                    <span className="dp-rx-name">{rx.drug}</span>
                                    <span className="dp-rx-dose">{rx.dose} · {rx.freq}</span>
                                </div>
                            </div>
                            <span className={`dp-rx-status ${rx.status}`}>{rx.status === "active" ? "Active" : "Discontinued"}</span>
                        </div>
                        <div className="dp-rx-bottom">
                            <span className="dp-rx-started">Since {rx.started}</span>
                            {rx.refill && <span className="dp-refill-badge"><Clock size={11} /> Refill Needed</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Vitals Tab ───
function VitalsTab() {
    return (
        <div className="dp-vitals-section">
            <div className="dp-section-card">
                <h3 className="dp-section-title"><Heart size={18} /> Blood Pressure Trend</h3>
                <div className="dp-chart-container">
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={BP_DATA}>
                            <defs>
                                <linearGradient id="sysFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="diaFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[70, 160]} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                            <Area type="monotone" dataKey="systolic" stroke="#ef4444" fill="url(#sysFill)" strokeWidth={2.5} dot={{ r: 4 }} name="Systolic" />
                            <Area type="monotone" dataKey="diastolic" stroke="#2563eb" fill="url(#diaFill)" strokeWidth={2.5} dot={{ r: 4 }} name="Diastolic" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="dp-section-card">
                <h3 className="dp-section-title"><Weight size={18} /> Weight Trend</h3>
                <div className="dp-chart-container">
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={WEIGHT_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[75, 85]} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                            <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2.5} dot={{ r: 4, fill: "#059669" }} name="Weight (kg)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// ─── Notes Tab ───
function NotesTab() {
    const [note, setNote] = useState("");
    return (
        <div className="dp-section-card">
            <h3 className="dp-section-title"><StickyNote size={18} /> Doctor Notes</h3>

            <div className="dp-note-editor">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a note about this patient..." rows={3} />
                <div className="dp-note-toolbar">
                    <label className="dp-note-flag"><input type="checkbox" /> <Flag size={12} /> Mark as Important</label>
                    <button className="dp-btn-primary dp-btn-sm" disabled={!note.trim()}><Send size={13} /> Add Note</button>
                </div>
            </div>

            <div className="dp-notes-list">
                {NOTES.map((n, i) => (
                    <div key={i} className={`dp-note-card ${n.important ? "important" : ""}`}>
                        {n.important && <span className="dp-note-important-badge"><Star size={11} /> Important</span>}
                        <p className="dp-note-text">{n.text}</p>
                        <span className="dp-note-date"><Clock size={11} /> {n.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Appointments Tab ───
function AppointmentsTab({ patient }) {
    const appts = [
        { date: "Mar 04, 2026", time: "10:00 AM", type: "Follow-up", status: "upcoming" },
        { date: "Feb 25, 2026", time: "09:30 AM", type: "Check-up", status: "completed" },
        { date: "Feb 10, 2026", time: "11:00 AM", type: "Lab Review", status: "completed" },
        { date: "Jan 28, 2026", time: "02:00 PM", type: "Follow-up", status: "completed" },
        { date: "Jan 10, 2026", time: "10:30 AM", type: "Check-up", status: "missed" },
    ];
    return (
        <div className="dp-section-card">
            <div className="dp-section-header">
                <h3 className="dp-section-title"><Calendar size={18} /> Appointments</h3>
                <button className="dp-btn-primary dp-btn-sm"><Plus size={13} /> Schedule</button>
            </div>
            <div className="dp-appt-list">
                {appts.map((a, i) => (
                    <div key={i} className={`dp-appt-card ${a.status}`}>
                        <div className="dp-appt-date">
                            <Calendar size={14} />
                            <span>{a.date}</span>
                            <span className="dp-appt-time">{a.time}</span>
                        </div>
                        <span className="dp-appt-type">{a.type}</span>
                        <span className={`dp-appt-status ${a.status}`}>
                            {a.status === "upcoming" && <Clock size={11} />}
                            {a.status === "completed" && <CheckCircle2 size={11} />}
                            {a.status === "missed" && <CircleAlert size={11} />}
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════
export default function DoctorPatientsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("name");
    const [page, setPage] = useState(1);
    const [drawerPatient, setDrawerPatient] = useState(null);
    const [profilePatient, setProfilePatient] = useState(null);
    const perPage = 6;

    const filtered = useMemo(() => {
        let list = PATIENTS.filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.condition.toLowerCase().includes(search.toLowerCase()) ||
                p.phone.includes(search);
            const matchStatus = statusFilter === "All" || STATUS_MAP[p.status]?.label === statusFilter;
            return matchSearch && matchStatus;
        });
        list.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "age") return a.age - b.age;
            if (sortBy === "status") return a.status.localeCompare(b.status);
            return 0;
        });
        return list;
    }, [search, statusFilter, sortBy]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    // If profile view is active
    if (profilePatient) {
        return <PatientProfile patient={profilePatient} onBack={() => setProfilePatient(null)} />;
    }

    return (
        <div className="dp-page">
            {/* Page Header */}
            <div className="dp-header">
                <div>
                    <h1 className="dp-title">Patients</h1>
                    <p className="dp-subtitle">{PATIENTS.length} total patients · {PATIENTS.filter((p) => p.status === "critical").length} critical</p>
                </div>
                <button className="dp-btn-primary"><UserPlus size={15} /> Add Patient</button>
            </div>

            {/* Search & Filters */}
            <div className="dp-toolbar">
                <div className="dp-search">
                    <Search size={16} />
                    <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, condition, or phone..." />
                    {search && <button className="dp-search-clear" onClick={() => setSearch("")}><X size={14} /></button>}
                </div>

                <div className="dp-filter-pills">
                    {FILTERS.map((f) => (
                        <button key={f} className={`dp-filter-pill ${statusFilter === f ? "active" : ""}`} onClick={() => { setStatusFilter(f); setPage(1); }}>
                            {f}
                            {f !== "All" && <span className="dp-filter-count">{PATIENTS.filter((p) => STATUS_MAP[p.status]?.label === f).length}</span>}
                        </button>
                    ))}
                </div>

                <div className="dp-sort">
                    <ArrowUpDown size={13} />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="age">Age</option>
                        <option value="status">Status</option>
                    </select>
                </div>
            </div>

            {/* Patients Table */}
            {paginated.length > 0 ? (
                <div className="dp-table-card">
                    <table className="dp-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Age / Gender</th>
                                <th>Condition</th>
                                <th>Last Visit</th>
                                <th>Next Appt</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((p) => (
                                <tr key={p.id} className={p.risk ? "risk-row" : ""} onClick={() => setDrawerPatient(p)}>
                                    <td>
                                        <div className="dp-patient-cell">
                                            <div className="dp-table-avatar" style={{ background: p.color }}>{p.avatar}</div>
                                            <div>
                                                <span className="dp-patient-name">{p.name}</span>
                                                {p.risk && <span className="dp-risk-dot" title="High Risk"><CircleAlert size={12} /></span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{p.age}y · {p.gender.charAt(0)}</td>
                                    <td><span className="dp-condition-text">{p.condition}</span></td>
                                    <td className="dp-muted">{p.lastVisit}</td>
                                    <td className="dp-muted">{p.nextAppt || "—"}</td>
                                    <td><StatusBadge status={p.status} /></td>
                                    <td>
                                        <div className="dp-actions" onClick={(e) => e.stopPropagation()}>
                                            <button className="dp-action-btn" title="View Profile" onClick={() => setProfilePatient(p)}><Eye size={14} /></button>
                                            <button className="dp-action-btn" title="Notes" onClick={() => { setProfilePatient(p); }}><FileText size={14} /></button>
                                            <button className="dp-action-btn" title="Prescribe"><Pill size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="dp-empty">
                    <User size={40} />
                    <h3>No patients found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="dp-pagination">
                    <span className="dp-page-info">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
                    <div className="dp-page-btns">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
                    </div>
                </div>
            )}

            {/* Quick Preview Drawer */}
            <PatientDrawer patient={drawerPatient} onClose={() => setDrawerPatient(null)} onOpenProfile={(p) => { setDrawerPatient(null); setProfilePatient(p); }} />
        </div>
    );
}
