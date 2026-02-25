"use client";
import "./patients.css";
import { useState, useMemo, useRef, useEffect } from "react";
import {
    Search, ChevronLeft, ChevronRight, MoreHorizontal,
    CheckCircle2, XCircle, Shield, ShieldAlert, Eye, UserPlus,
    Clock, TrendingUp, Users, FileText, Award,
    AlertTriangle, X, Phone, Mail, MapPin, Calendar, Activity,
    BadgeCheck, ShieldOff, Flag, MessageSquare,
    ArrowUpDown, Check, BarChart3, Heart, Pill, Stethoscope,
    UserCheck, UserX, AlertCircle
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════ */
const STATUS_MAP = {
    active: { label: "Active", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    inactive: { label: "Inactive", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
    suspended: { label: "Suspended", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    flagged: { label: "Flagged", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    under_review: { label: "Under Review", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const RISK_MAP = {
    normal: { label: "Normal", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
    flagged: { label: "Flagged", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    high: { label: "High Risk", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

const MOCK_PATIENTS = [
    { id: "pt1", name: "Emma Johnson", email: "emma.j@email.com", phone: "+1 (555) 101-2020", age: 34, gender: "Female", status: "active", risk: "normal", joined: "2024-03-15", lastActive: "2 hours ago", appointments: 12, prescriptions: 8, messages: 5, lastLogin: "Today", engagement: "High", emergencyContact: "John Johnson — (555) 999-1234", address: "45 Oak Lane, Brooklyn, NY 11201", chronicConditions: "None", recentVisits: ["Cardiology — Feb 20", "General — Jan 15"], latestRx: ["Lisinopril 10mg", "Vitamin D 2000IU"], followUp: "None pending", notes: "", riskFlag: false },
    { id: "pt2", name: "Liam Patel", email: "liam.p@email.com", phone: "+1 (555) 202-3030", age: 52, gender: "Male", status: "active", risk: "flagged", joined: "2023-11-10", lastActive: "1 day ago", appointments: 28, prescriptions: 15, messages: 12, lastLogin: "Yesterday", engagement: "High", emergencyContact: "Anita Patel — (555) 888-2345", address: "312 Maple Dr, Austin, TX 78701", chronicConditions: "Hypertension, Type 2 Diabetes", recentVisits: ["Endocrinology — Feb 18", "Cardiology — Feb 5"], latestRx: ["Metformin 500mg", "Amlodipine 5mg", "Insulin glargine"], followUp: "Cardiology — Mar 5", notes: "Missed 2 consecutive follow-ups. Flagged for outreach.", riskFlag: true },
    { id: "pt3", name: "Sofia Rodriguez", email: "sofia.r@email.com", phone: "+1 (555) 303-4040", age: 28, gender: "Female", status: "active", risk: "normal", joined: "2024-06-20", lastActive: "Just now", appointments: 6, prescriptions: 3, messages: 2, lastLogin: "Today", engagement: "Medium", emergencyContact: "Carlos Rodriguez — (555) 777-3456", address: "88 Pine St, San Francisco, CA 94102", chronicConditions: "Asthma (mild)", recentVisits: ["Pulmonology — Feb 10", "General — Dec 12"], latestRx: ["Albuterol inhaler"], followUp: "Pulmonology — Apr 1", notes: "", riskFlag: false },
    { id: "pt4", name: "James Chen", email: "james.c@email.com", phone: "+1 (555) 404-5050", age: 67, gender: "Male", status: "flagged", risk: "high", joined: "2023-08-05", lastActive: "3 days ago", appointments: 42, prescriptions: 22, messages: 18, lastLogin: "3 days ago", engagement: "Low", emergencyContact: "Linda Chen — (555) 666-4567", address: "200 Elm Rd, Portland, OR 97201", chronicConditions: "COPD, Heart failure, CKD Stage 3", recentVisits: ["Nephrology — Feb 22", "Cardiology — Feb 12", "Pulmonology — Feb 1"], latestRx: ["Furosemide 40mg", "Carvedilol 25mg", "Albuterol/Ipratropium"], followUp: "Cardiology — Feb 28 (OVERDUE)", notes: "Multiple chronic conditions. Declining engagement. Needs case manager assignment.", riskFlag: true },
    { id: "pt5", name: "Aisha Khan", email: "aisha.k@email.com", phone: "+1 (555) 505-6060", age: 41, gender: "Female", status: "active", risk: "normal", joined: "2024-01-12", lastActive: "5 hours ago", appointments: 9, prescriptions: 6, messages: 4, lastLogin: "Today", engagement: "High", emergencyContact: "Omar Khan — (555) 555-5678", address: "75 River Walk, Chicago, IL 60601", chronicConditions: "Hypothyroidism", recentVisits: ["Endocrinology — Feb 15", "General — Jan 20"], latestRx: ["Levothyroxine 75mcg"], followUp: "Endocrinology — May 15", notes: "", riskFlag: false },
    { id: "pt6", name: "Marcus Williams", email: "marcus.w@email.com", phone: "+1 (555) 606-7070", age: 45, gender: "Male", status: "suspended", risk: "high", joined: "2024-02-28", lastActive: "2 weeks ago", appointments: 3, prescriptions: 1, messages: 0, lastLogin: "2 weeks ago", engagement: "None", emergencyContact: "N/A", address: "Unknown", chronicConditions: "N/A", recentVisits: ["General — Feb 1"], latestRx: ["N/A"], followUp: "None", notes: "Account suspended: suspected fraudulent activity. Under investigation since Feb 15.", riskFlag: true },
    { id: "pt7", name: "Olivia Brown", email: "olivia.b@email.com", phone: "+1 (555) 707-8080", age: 23, gender: "Female", status: "active", risk: "normal", joined: "2024-09-10", lastActive: "1 hour ago", appointments: 4, prescriptions: 2, messages: 7, lastLogin: "Today", engagement: "Medium", emergencyContact: "Sarah Brown — (555) 444-6789", address: "320 College Ave, Boston, MA 02101", chronicConditions: "None", recentVisits: ["General — Feb 8", "Dermatology — Jan 25"], latestRx: ["Tretinoin 0.025%", "Doxycycline 100mg"], followUp: "Dermatology — Mar 25", notes: "", riskFlag: false },
    { id: "pt8", name: "David Kim", email: "david.k@email.com", phone: "+1 (555) 808-9090", age: 58, gender: "Male", status: "inactive", risk: "normal", joined: "2023-06-15", lastActive: "2 months ago", appointments: 15, prescriptions: 10, messages: 3, lastLogin: "Dec 20, 2024", engagement: "None", emergencyContact: "Susan Kim — (555) 333-7890", address: "450 Summit Blvd, Denver, CO 80201", chronicConditions: "Osteoarthritis", recentVisits: ["Orthopedics — Nov 10"], latestRx: ["Naproxen 500mg", "Glucosamine"], followUp: "Orthopedics — OVERDUE", notes: "Inactive for 2 months. Attempted contact twice.", riskFlag: false },
    { id: "pt9", name: "Isabella Martinez", email: "isabella.m@email.com", phone: "+1 (555) 909-0101", age: 31, gender: "Female", status: "under_review", risk: "flagged", joined: "2024-07-22", lastActive: "4 days ago", appointments: 7, prescriptions: 11, messages: 1, lastLogin: "4 days ago", engagement: "Low", emergencyContact: "Miguel Martinez — (555) 222-8901", address: "180 Sunset Dr, Miami, FL 33101", chronicConditions: "Anxiety, Depression", recentVisits: ["Psychiatry — Feb 20", "General — Feb 5"], latestRx: ["Sertraline 100mg", "Alprazolam 0.5mg", "Trazodone 50mg"], followUp: "Psychiatry — Mar 6", notes: "Flagged: unusual prescription request pattern. Under clinical review.", riskFlag: true },
    { id: "pt10", name: "Noah Taylor", email: "noah.t@email.com", phone: "+1 (555) 010-1212", age: 39, gender: "Male", status: "active", risk: "normal", joined: "2024-04-18", lastActive: "30 min ago", appointments: 8, prescriptions: 4, messages: 6, lastLogin: "Today", engagement: "High", emergencyContact: "Emily Taylor — (555) 111-9012", address: "95 Market St, Seattle, WA 98101", chronicConditions: "None", recentVisits: ["General — Feb 22", "ENT — Jan 30"], latestRx: ["Amoxicillin 500mg"], followUp: "None pending", notes: "", riskFlag: false },
];

const FLAGGED_PATIENTS = MOCK_PATIENTS.filter(p => p.riskFlag);
const PAGE_SIZE = 8;

/* ═══════════════════════════════════════════════════════ */
export default function PatientsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [riskFilter, setRiskFilter] = useState("all");
    const [sortBy, setSortBy] = useState("joined");
    const [sortDir, setSortDir] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(new Set());
    const [drawerDoc, setDrawerDoc] = useState(null);
    const [patients, setPatients] = useState(MOCK_PATIENTS);
    const [adminNote, setAdminNote] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const filtered = useMemo(() => {
        let list = [...patients];
        if (search) { const q = search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q)); }
        if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
        if (riskFilter !== "all") list = list.filter(p => p.risk === riskFilter);
        list.sort((a, b) => { let c = 0; if (sortBy === "joined") c = new Date(a.joined) - new Date(b.joined); else if (sortBy === "name") c = a.name.localeCompare(b.name); else if (sortBy === "appointments") c = a.appointments - b.appointments; else if (sortBy === "age") c = a.age - b.age; return sortDir === "desc" ? -c : c; });
        return list;
    }, [patients, search, statusFilter, riskFilter, sortBy, sortDir]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const stats = useMemo(() => ({ total: patients.length, active: patients.filter(p => p.status === "active").length, flagged: FLAGGED_PATIENTS.length, suspended: patients.filter(p => p.status === "suspended").length }), [patients]);

    const updatePatient = (id, u) => { setPatients(prev => prev.map(p => p.id === id ? { ...p, ...u } : p)); if (drawerDoc?.id === id) setDrawerDoc(prev => ({ ...prev, ...u })); };
    const handleAction = (type, doc) => setConfirmAction({ type, doctor: doc });
    const confirmActionHandler = () => { if (!confirmAction) return; const { type, doctor } = confirmAction; const m = { suspend: { status: "suspended" }, activate: { status: "active", riskFlag: false }, flag: { status: "flagged", risk: "flagged", riskFlag: true }, unflag: { risk: "normal", riskFlag: false }, review: { status: "under_review" } }; if (m[type]) updatePatient(doctor.id, m[type]); setConfirmAction(null); };
    const bulkAction = (type) => { selected.forEach(id => { const m = { suspend: { status: "suspended" }, activate: { status: "active" } }; if (m[type]) updatePatient(id, m[type]); }); setSelected(new Set()); };
    const toggleSelect = (id) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
    const toggleSelectAll = () => { selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(p => p.id))); };
    const getInitials = (n) => n.split(" ").filter(Boolean).map(x => x[0]).join("").toUpperCase().slice(0, 2);
    const getColor = (n) => { const c = ["#0d9488", "#0891b2", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]; let h = 0; for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h); return c[Math.abs(h) % c.length]; };

    return (
        <div className="pt-page">
            {/* Header */}
            <div className="pt-page-header">
                <div>
                    <h1 className="pt-page-title"><Users size={28} style={{ color: "#0d9488" }} /> Patients</h1>
                    <p className="pt-page-subtitle">View, manage, and support all patients on the platform</p>
                </div>
                <button className="pt-add-btn"><UserPlus size={16} /> Add Patient</button>
            </div>

            {/* KPIs */}
            <div className="pt-kpi-row">
                {[
                    { label: "Total Patients", value: stats.total, icon: <Users size={20} />, color: "#0891b2", trend: "+18%" },
                    { label: "Active", value: stats.active, icon: <UserCheck size={20} />, color: "#10b981", trend: "+12%" },
                    { label: "Flagged / At Risk", value: stats.flagged, icon: <AlertTriangle size={20} />, color: "#f59e0b", trend: `${stats.flagged} alerts` },
                    { label: "Suspended", value: stats.suspended, icon: <ShieldAlert size={20} />, color: "#8b5cf6", trend: "—" },
                ].map((kpi, i) => (
                    <div key={i} className="pt-kpi-card admin-glass-card">
                        <div className="pt-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
                        <div className="pt-kpi-value">{kpi.value}</div>
                        <div className="pt-kpi-label">{kpi.label}</div>
                        <span className="pt-kpi-trend" style={{ color: kpi.color }}>{kpi.trend}</span>
                    </div>
                ))}
            </div>

            {/* Flagged Patients Widget */}
            {FLAGGED_PATIENTS.length > 0 && (
                <div className="pt-flagged admin-glass-card">
                    <div className="pt-flagged-header">
                        <div className="pt-flagged-title"><AlertTriangle size={18} style={{ color: "#ef4444" }} /><h3>Flagged Patients</h3><span className="pt-flagged-count">{FLAGGED_PATIENTS.length} alerts</span></div>
                    </div>
                    <div className="pt-flagged-list">
                        {FLAGGED_PATIENTS.map(p => (
                            <div key={p.id} className="pt-flagged-item">
                                <div className="pt-flagged-avatar" style={{ background: getColor(p.name) }}>{getInitials(p.name)}</div>
                                <div className="pt-flagged-info">
                                    <span className="pt-flagged-name">{p.name}</span>
                                    <span className="pt-flagged-meta">{p.chronicConditions !== "None" && p.chronicConditions !== "N/A" ? p.chronicConditions : p.status === "suspended" ? "Suspended account" : "Needs review"}</span>
                                    <span className="pt-flagged-reason" style={{ color: RISK_MAP[p.risk]?.color, background: RISK_MAP[p.risk]?.bg }}>{RISK_MAP[p.risk]?.label}</span>
                                </div>
                                <div className="pt-flagged-actions">
                                    <button className="pt-fl-view" onClick={() => setDrawerDoc(p)} title="Review"><Eye size={16} /></button>
                                    <button className="pt-fl-unflag" onClick={() => handleAction("unflag", p)} title="Clear Flag"><Check size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="pt-toolbar admin-glass-card">
                <div className="pt-search-box">
                    <Search size={16} className="pt-search-icon" />
                    <input type="text" placeholder="Search by name, email, or phone..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="pt-filter-group">
                    <select className="pt-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Status</option>
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select className="pt-select" value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Risk</option>
                        {Object.entries(RISK_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select className="pt-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="joined">Sort: Joined</option>
                        <option value="name">Sort: Name</option>
                        <option value="appointments">Sort: Appointments</option>
                        <option value="age">Sort: Age</option>
                    </select>
                    <button className="pt-sort-dir" onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}><ArrowUpDown size={14} /></button>
                </div>
            </div>

            {/* Bulk */}
            {selected.size > 0 && (
                <div className="pt-bulk-bar">
                    <span>{selected.size} patient(s) selected</span>
                    <div className="pt-bulk-actions">
                        <button className="pt-bulk-activate" onClick={() => bulkAction("activate")}><CheckCircle2 size={14} /> Activate</button>
                        <button className="pt-bulk-suspend" onClick={() => bulkAction("suspend")}><ShieldOff size={14} /> Suspend</button>
                        <button className="pt-bulk-clear" onClick={() => setSelected(new Set())}><X size={14} /> Clear</button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="pt-table-wrapper admin-glass-card">
                <table className="pt-table">
                    <thead>
                        <tr>
                            <th className="pt-th-check"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleSelectAll} /></th>
                            <th>Patient</th>
                            <th>Age / Gender</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Risk</th>
                            <th>Appointments</th>
                            <th>Prescriptions</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={10} className="pt-empty"><Search size={40} strokeWidth={1} /><p>No patients found.</p></td></tr>
                        ) : paginated.map(p => (
                            <tr key={p.id} className={selected.has(p.id) ? "pt-row-selected" : ""}>
                                <td className="pt-td-check"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                                <td>
                                    <div className="pt-cell" onClick={() => setDrawerDoc(p)} style={{ cursor: "pointer" }}>
                                        <div className="pt-avatar" style={{ background: getColor(p.name) }}>{getInitials(p.name)}</div>
                                        <div>
                                            <div className="pt-name">{p.name}{p.riskFlag && <Flag size={12} className="pt-risk-flag" />}</div>
                                            <div className="pt-email">{p.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="pt-age">{p.age} · {p.gender}</span></td>
                                <td className="pt-phone">{p.phone}</td>
                                <td><span className="pt-status-badge" style={{ color: STATUS_MAP[p.status]?.color, background: STATUS_MAP[p.status]?.bg }}>{STATUS_MAP[p.status]?.label}</span></td>
                                <td><span className="pt-risk-badge" style={{ color: RISK_MAP[p.risk]?.color, background: RISK_MAP[p.risk]?.bg }}>{RISK_MAP[p.risk]?.label}</span></td>
                                <td className="pt-metric">{p.appointments}</td>
                                <td className="pt-metric">{p.prescriptions}</td>
                                <td className="pt-date">{new Date(p.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                <td><PatientActions doc={p} onAction={handleAction} onView={() => setDrawerDoc(p)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="pt-pagination">
                        <span className="pt-page-info">Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div className="pt-page-btns">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16} /></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} className={p === currentPage ? "active" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
                            ))}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Analytics */}
            <div className="pt-analytics-row">
                <div className="pt-analytics-card admin-glass-card">
                    <h3><BarChart3 size={16} /> Engagement Distribution</h3>
                    <div className="pt-spec-bars">
                        {["High", "Medium", "Low", "None"].map(lvl => {
                            const count = patients.filter(p => p.engagement === lvl).length;
                            const colors = { High: "#10b981", Medium: "#0891b2", Low: "#f59e0b", None: "#94a3b8" };
                            return (
                                <div key={lvl} className="pt-spec-bar">
                                    <span className="pt-spec-label">{lvl}</span>
                                    <div className="pt-spec-track"><div className="pt-spec-fill" style={{ width: `${(count / patients.length) * 100}%`, background: colors[lvl] }}></div></div>
                                    <span className="pt-spec-count" style={{ color: colors[lvl] }}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="pt-analytics-card admin-glass-card">
                    <h3><Activity size={16} /> Status Overview</h3>
                    <div className="pt-status-overview">
                        {Object.entries(STATUS_MAP).map(([key, val]) => {
                            const count = patients.filter(p => p.status === key).length;
                            const pct = patients.length > 0 ? ((count / patients.length) * 100).toFixed(0) : 0;
                            return (
                                <div key={key} className="pt-status-row">
                                    <span className="pt-so-dot" style={{ background: val.color }}></span>
                                    <span className="pt-so-label">{val.label}</span>
                                    <div className="pt-so-bar-track"><div className="pt-so-bar-fill" style={{ width: `${pct}%`, background: val.color }}></div></div>
                                    <span className="pt-so-count" style={{ color: val.color }}>{count} ({pct}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Drawer */}
            {drawerDoc && <PatientDrawer doc={drawerDoc} onClose={() => setDrawerDoc(null)} onAction={handleAction} getInitials={getInitials} getColor={getColor} adminNote={adminNote} setAdminNote={setAdminNote} updatePatient={updatePatient} />}

            {/* Confirm */}
            {confirmAction && (
                <div className="pt-modal-overlay" onClick={() => setConfirmAction(null)}>
                    <div className="pt-modal" onClick={e => e.stopPropagation()}>
                        <h3>Confirm {confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}</h3>
                        <p>Are you sure you want to <strong>{confirmAction.type}</strong> <strong>{confirmAction.doctor.name}</strong>?</p>
                        <div className="pt-modal-actions">
                            <button className="pt-modal-cancel" onClick={() => setConfirmAction(null)}>Cancel</button>
                            <button className={`pt-modal-confirm ${confirmAction.type}`} onClick={confirmActionHandler}>
                                {confirmAction.type === "suspend" && <ShieldOff size={14} />}
                                {confirmAction.type === "activate" && <Shield size={14} />}
                                {confirmAction.type === "flag" && <Flag size={14} />}
                                {confirmAction.type === "unflag" && <Check size={14} />}
                                {confirmAction.type === "review" && <AlertCircle size={14} />}
                                {confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════ Actions ═══════ */
function PatientActions({ doc, onAction, onView }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; if (open) document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [open]);
    return (
        <div className="pt-actions-wrap" ref={ref}>
            <button className="pt-actions-btn" onClick={() => setOpen(!open)}><MoreHorizontal size={16} /></button>
            {open && (
                <div className="pt-actions-menu">
                    <button onClick={() => { onView(); setOpen(false); }}><Eye size={14} /> View Profile</button>
                    {doc.status !== "suspended" && <button className="pt-act-suspend" onClick={() => { onAction("suspend", doc); setOpen(false); }}><ShieldOff size={14} /> Suspend</button>}
                    {(doc.status === "suspended" || doc.status === "inactive") && <button className="pt-act-activate" onClick={() => { onAction("activate", doc); setOpen(false); }}><Shield size={14} /> Activate</button>}
                    {!doc.riskFlag && <button className="pt-act-flag" onClick={() => { onAction("flag", doc); setOpen(false); }}><Flag size={14} /> Flag Account</button>}
                    {doc.riskFlag && <button className="pt-act-unflag" onClick={() => { onAction("unflag", doc); setOpen(false); }}><Check size={14} /> Clear Flag</button>}
                    <button onClick={() => { onAction("review", doc); setOpen(false); }}><AlertCircle size={14} /> Mark for Review</button>
                </div>
            )}
        </div>
    );
}

/* ═══════ Detail Drawer ═══════ */
function PatientDrawer({ doc, onClose, onAction, getInitials, getColor, adminNote, setAdminNote, updatePatient }) {
    const [tab, setTab] = useState("profile");
    return (
        <>
            <div className="pt-drawer-overlay" onClick={onClose}></div>
            <aside className="pt-drawer">
                <div className="pt-drawer-header"><h2>Patient Details</h2><button className="pt-drawer-close" onClick={onClose}><X size={18} /></button></div>
                <div className="pt-drawer-profile">
                    <div className="pt-drawer-avatar" style={{ background: getColor(doc.name) }}>{getInitials(doc.name)}</div>
                    <div className="pt-drawer-info">
                        <h3>{doc.name}{doc.riskFlag && <Flag size={14} className="pt-risk-flag" />}</h3>
                        <span className="pt-drawer-age">{doc.age} yrs · {doc.gender}</span>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span className="pt-status-badge" style={{ color: STATUS_MAP[doc.status]?.color, background: STATUS_MAP[doc.status]?.bg }}>{STATUS_MAP[doc.status]?.label}</span>
                            <span className="pt-risk-badge" style={{ color: RISK_MAP[doc.risk]?.color, background: RISK_MAP[doc.risk]?.bg }}>{RISK_MAP[doc.risk]?.label}</span>
                        </div>
                    </div>
                </div>
                <div className="pt-drawer-contact">
                    <div><Mail size={14} /> {doc.email}</div>
                    <div><Phone size={14} /> {doc.phone}</div>
                    <div><MapPin size={14} /> {doc.address}</div>
                    <div><Heart size={14} /> Emergency: {doc.emergencyContact}</div>
                </div>
                <div className="pt-drawer-tabs">
                    {["profile", "activity", "medical", "notes"].map(t => (
                        <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                    ))}
                </div>
                <div className="pt-drawer-body">
                    {tab === "profile" && (
                        <div className="pt-drawer-section">
                            <div className="pt-detail-grid">
                                <div className="pt-detail-item"><span className="pt-detail-label">Chronic Conditions</span><span className="pt-detail-value">{doc.chronicConditions}</span></div>
                                <div className="pt-detail-item"><span className="pt-detail-label">Engagement</span><span className="pt-detail-value">{doc.engagement}</span></div>
                                <div className="pt-detail-item"><span className="pt-detail-label">Last Login</span><span className="pt-detail-value">{doc.lastLogin}</span></div>
                                <div className="pt-detail-item"><span className="pt-detail-label">Joined</span><span className="pt-detail-value">{new Date(doc.joined).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
                                <div className="pt-detail-item"><span className="pt-detail-label">Last Active</span><span className="pt-detail-value">{doc.lastActive}</span></div>
                                <div className="pt-detail-item"><span className="pt-detail-label">Messages</span><span className="pt-detail-value">{doc.messages}</span></div>
                            </div>
                        </div>
                    )}
                    {tab === "activity" && (
                        <div className="pt-drawer-section">
                            <div className="pt-activity-stats">
                                <div className="pt-stat-card"><Stethoscope size={20} style={{ color: "#0891b2" }} /><span className="pt-stat-val">{doc.appointments}</span><span className="pt-stat-label">Appointments</span></div>
                                <div className="pt-stat-card"><Pill size={20} style={{ color: "#10b981" }} /><span className="pt-stat-val">{doc.prescriptions}</span><span className="pt-stat-label">Prescriptions</span></div>
                                <div className="pt-stat-card"><MessageSquare size={20} style={{ color: "#6366f1" }} /><span className="pt-stat-val">{doc.messages}</span><span className="pt-stat-label">Messages</span></div>
                                <div className="pt-stat-card"><TrendingUp size={20} style={{ color: "#f59e0b" }} /><span className="pt-stat-val">{doc.engagement}</span><span className="pt-stat-label">Engagement</span></div>
                            </div>
                        </div>
                    )}
                    {tab === "medical" && (
                        <div className="pt-drawer-section">
                            <div className="pt-medical-snapshot">
                                <div className="pt-med-block">
                                    <h4><Stethoscope size={15} /> Recent Visits</h4>
                                    <ul>{doc.recentVisits.map((v, i) => <li key={i}>{v}</li>)}</ul>
                                </div>
                                <div className="pt-med-block">
                                    <h4><Pill size={15} /> Current Prescriptions</h4>
                                    <ul>{doc.latestRx.map((rx, i) => <li key={i}>{rx}</li>)}</ul>
                                </div>
                                <div className="pt-med-block">
                                    <h4><Calendar size={15} /> Follow-up</h4>
                                    <p className={doc.followUp.includes("OVERDUE") ? "pt-overdue" : ""}>{doc.followUp}</p>
                                </div>
                                <div className="pt-med-block">
                                    <h4><Heart size={15} /> Chronic Conditions</h4>
                                    <p>{doc.chronicConditions}</p>
                                </div>
                            </div>
                            <div className="pt-med-disclaimer"><AlertCircle size={12} /> Read-only medical summary for admin reference</div>
                        </div>
                    )}
                    {tab === "notes" && (
                        <div className="pt-drawer-section">
                            {doc.notes && <div className="pt-existing-note"><MessageSquare size={14} /><p>{doc.notes}</p></div>}
                            <textarea className="pt-note-input" placeholder="Add an admin note..." value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={3} />
                            <button className="pt-save-note" onClick={() => { if (adminNote.trim()) { updatePatient(doc.id, { notes: adminNote.trim() }); setAdminNote(""); } }}><MessageSquare size={14} /> Save Note</button>
                        </div>
                    )}
                </div>
                <div className="pt-drawer-footer">
                    {doc.status !== "suspended" && <button className="pt-drawer-suspend" onClick={() => onAction("suspend", doc)}><ShieldOff size={16} /> Suspend</button>}
                    {(doc.status === "suspended" || doc.status === "inactive") && <button className="pt-drawer-activate" onClick={() => onAction("activate", doc)}><Shield size={16} /> Activate</button>}
                    {!doc.riskFlag ? <button className="pt-drawer-flag" onClick={() => onAction("flag", doc)}><Flag size={16} /> Flag</button> : <button className="pt-drawer-unflag" onClick={() => onAction("unflag", doc)}><Check size={16} /> Clear Flag</button>}
                    {doc.riskFlag && <div className="pt-drawer-risk"><AlertTriangle size={14} /> Flagged for review</div>}
                </div>
            </aside>
        </>
    );
}
