"use client";
import "./doctors.css";
import { useState, useMemo, useRef, useEffect } from "react";
import {
    Search, Filter, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal,
    CheckCircle2, XCircle, Shield, ShieldAlert, Eye, UserPlus,
    Stethoscope, Clock, Star, TrendingUp, Users, FileText, Award,
    AlertTriangle, X, Phone, Mail, MapPin, Calendar, Activity,
    ClipboardCheck, BadgeCheck, ShieldOff, Flag, MessageSquare, Download,
    ArrowUpDown, Check, BarChart3
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   MOCK DATA — Rich, realistic doctor data
   ═══════════════════════════════════════════════════════ */
const SPECIALTIES = [
    "Cardiology", "Dermatology", "Neurology", "Orthopedics",
    "Pediatrics", "Psychiatry", "Radiology", "Surgery",
    "General Medicine", "Oncology", "Ophthalmology", "ENT"
];

const STATUS_MAP = {
    verified: { label: "Verified", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    suspended: { label: "Suspended", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    inactive: { label: "Inactive", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

const MOCK_DOCTORS = [
    { id: "d1", name: "Dr. Sarah Chen", email: "sarah.chen@medsync.com", phone: "+1 (555) 123-4567", specialty: "Cardiology", experience: 12, license: "MD-2019-4821", status: "verified", accountStatus: "active", joined: "2024-01-15", avatar: null, rating: 4.8, patients: 234, appointments: 1847, prescriptions: 3201, bio: "Board-certified cardiologist with expertise in interventional procedures and heart failure management.", address: "123 Medical Center Dr, New York, NY", documents: { license: true, certificates: true, idProof: true }, notes: "Excellent track record. Top-rated doctor.", lastActive: "2 hours ago", riskFlag: false },
    { id: "d2", name: "Dr. James Wilson", email: "james.wilson@medsync.com", phone: "+1 (555) 234-5678", specialty: "Neurology", experience: 8, license: "MD-2020-7392", status: "verified", accountStatus: "active", joined: "2024-02-20", avatar: null, rating: 4.6, patients: 187, appointments: 1203, prescriptions: 2180, bio: "Neurologist specializing in movement disorders and neurodegenerative diseases.", address: "456 Brain Health Ave, Boston, MA", documents: { license: true, certificates: true, idProof: true }, notes: "", lastActive: "5 hours ago", riskFlag: false },
    { id: "d3", name: "Dr. Priya Sharma", email: "priya.sharma@medsync.com", phone: "+1 (555) 345-6789", specialty: "Pediatrics", experience: 15, license: "MD-2018-1156", status: "pending", accountStatus: "active", joined: "2025-02-18", avatar: null, rating: 0, patients: 0, appointments: 0, prescriptions: 0, bio: "Experienced pediatrician with focus on developmental disorders and neonatal care.", address: "789 Children's Way, Chicago, IL", documents: { license: true, certificates: false, idProof: true }, notes: "Awaiting certificate verification.", lastActive: "Just now", riskFlag: false },
    { id: "d4", name: "Dr. Michael Brown", email: "michael.brown@medsync.com", phone: "+1 (555) 456-7890", specialty: "Orthopedics", experience: 20, license: "MD-2015-8834", status: "pending", accountStatus: "active", joined: "2025-02-20", avatar: null, rating: 0, patients: 0, appointments: 0, prescriptions: 0, bio: "Orthopedic surgeon specializing in joint replacement and sports medicine.", address: "321 Bone & Joint Blvd, Dallas, TX", documents: { license: true, certificates: true, idProof: false }, notes: "ID proof pending re-upload.", lastActive: "1 day ago", riskFlag: false },
    { id: "d5", name: "Dr. Emily Davis", email: "emily.davis@medsync.com", phone: "+1 (555) 567-8901", specialty: "Dermatology", experience: 6, license: "MD-2022-3341", status: "rejected", accountStatus: "inactive", joined: "2025-01-10", avatar: null, rating: 0, patients: 0, appointments: 0, prescriptions: 0, bio: "Dermatologist with interest in cosmetic procedures and skin cancer screening.", address: "654 Skin Care Ln, Miami, FL", documents: { license: false, certificates: false, idProof: true }, notes: "License document unclear. Requested re-upload on Feb 5.", lastActive: "2 weeks ago", riskFlag: true },
    { id: "d6", name: "Dr. Robert Kim", email: "robert.kim@medsync.com", phone: "+1 (555) 678-9012", specialty: "Surgery", experience: 18, license: "MD-2016-5567", status: "verified", accountStatus: "active", joined: "2023-11-05", avatar: null, rating: 4.9, patients: 312, appointments: 2456, prescriptions: 4102, bio: "General surgeon with subspecialty in laparoscopic and robotic-assisted surgery.", address: "987 Surgical Center, San Francisco, CA", documents: { license: true, certificates: true, idProof: true }, notes: "Exemplary performance. Consider for featured doctor.", lastActive: "30 min ago", riskFlag: false },
    { id: "d7", name: "Dr. Lisa Thompson", email: "lisa.t@medsync.com", phone: "+1 (555) 789-0123", specialty: "Psychiatry", experience: 10, license: "MD-2019-9023", status: "suspended", accountStatus: "suspended", joined: "2024-03-15", avatar: null, rating: 3.2, patients: 89, appointments: 567, prescriptions: 1230, bio: "Psychiatrist specializing in anxiety disorders and PTSD treatment.", address: "741 Mind Health Rd, Seattle, WA", documents: { license: true, certificates: true, idProof: true }, notes: "Suspended due to patient complaints. Under review since Feb 10.", lastActive: "1 month ago", riskFlag: true },
    { id: "d8", name: "Dr. Ahmed Hassan", email: "ahmed.h@medsync.com", phone: "+1 (555) 890-1234", specialty: "General Medicine", experience: 5, license: "MD-2023-1102", status: "pending", accountStatus: "active", joined: "2025-02-22", avatar: null, rating: 0, patients: 0, appointments: 0, prescriptions: 0, bio: "General practitioner with focus on preventive medicine and chronic disease management.", address: "852 Primary Care St, Houston, TX", documents: { license: true, certificates: true, idProof: true }, notes: "All documents uploaded. Ready for review.", lastActive: "3 hours ago", riskFlag: false },
    { id: "d9", name: "Dr. Maria Garcia", email: "maria.g@medsync.com", phone: "+1 (555) 901-2345", specialty: "Oncology", experience: 14, license: "MD-2017-6678", status: "verified", accountStatus: "active", joined: "2024-05-10", avatar: null, rating: 4.7, patients: 156, appointments: 1089, prescriptions: 2890, bio: "Medical oncologist with expertise in breast cancer and immunotherapy.", address: "963 Cancer Research Dr, Baltimore, MD", documents: { license: true, certificates: true, idProof: true }, notes: "", lastActive: "1 hour ago", riskFlag: false },
    { id: "d10", name: "Dr. David Park", email: "david.park@medsync.com", phone: "+1 (555) 012-3456", specialty: "Ophthalmology", experience: 9, license: "MD-2020-4490", status: "verified", accountStatus: "inactive", joined: "2024-06-01", avatar: null, rating: 4.4, patients: 201, appointments: 980, prescriptions: 1560, bio: "Ophthalmologist specializing in LASIK surgery and retinal diseases.", address: "147 Eye Care Center, Los Angeles, CA", documents: { license: true, certificates: true, idProof: true }, notes: "Requested leave of absence.", lastActive: "3 days ago", riskFlag: false },
];

const VERIFICATION_QUEUE = MOCK_DOCTORS.filter(d => d.status === "pending");
const PAGE_SIZE = 8;

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function DoctorsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [sortBy, setSortBy] = useState("joined");
    const [sortDir, setSortDir] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(new Set());
    const [drawerDoc, setDrawerDoc] = useState(null);
    const [doctors, setDoctors] = useState(MOCK_DOCTORS);
    const [showFilters, setShowFilters] = useState(false);
    const [adminNote, setAdminNote] = useState("");
    const [confirmAction, setConfirmAction] = useState(null); // {type, doctor}

    /* ── Derived data ── */
    const filtered = useMemo(() => {
        let list = [...doctors];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(d =>
                d.name.toLowerCase().includes(q) ||
                d.email.toLowerCase().includes(q) ||
                d.license.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== "all") list = list.filter(d => d.status === statusFilter);
        if (specialtyFilter !== "all") list = list.filter(d => d.specialty === specialtyFilter);

        list.sort((a, b) => {
            let cmp = 0;
            if (sortBy === "joined") cmp = new Date(a.joined) - new Date(b.joined);
            else if (sortBy === "name") cmp = a.name.localeCompare(b.name);
            else if (sortBy === "experience") cmp = a.experience - b.experience;
            else if (sortBy === "rating") cmp = a.rating - b.rating;
            else if (sortBy === "patients") cmp = a.patients - b.patients;
            return sortDir === "desc" ? -cmp : cmp;
        });
        return list;
    }, [doctors, search, statusFilter, specialtyFilter, sortBy, sortDir]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const stats = useMemo(() => ({
        total: doctors.length,
        verified: doctors.filter(d => d.status === "verified").length,
        pending: doctors.filter(d => d.status === "pending").length,
        suspended: doctors.filter(d => d.status === "suspended").length,
        rejected: doctors.filter(d => d.status === "rejected").length,
    }), [doctors]);

    /* ── Actions ── */
    const updateDoctor = (id, updates) => {
        setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
        if (drawerDoc?.id === id) setDrawerDoc(prev => ({ ...prev, ...updates }));
    };

    const handleAction = (type, doctor) => {
        setConfirmAction({ type, doctor });
    };

    const confirmActionHandler = () => {
        if (!confirmAction) return;
        const { type, doctor } = confirmAction;
        switch (type) {
            case "approve":
                updateDoctor(doctor.id, { status: "verified", accountStatus: "active" });
                break;
            case "reject":
                updateDoctor(doctor.id, { status: "rejected", accountStatus: "inactive" });
                break;
            case "suspend":
                updateDoctor(doctor.id, { status: "suspended", accountStatus: "suspended" });
                break;
            case "activate":
                updateDoctor(doctor.id, { status: "verified", accountStatus: "active" });
                break;
        }
        setConfirmAction(null);
    };

    const bulkAction = (type) => {
        selected.forEach(id => {
            if (type === "approve") updateDoctor(id, { status: "verified", accountStatus: "active" });
            else if (type === "suspend") updateDoctor(id, { status: "suspended", accountStatus: "suspended" });
        });
        setSelected(new Set());
    };

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === paginated.length) setSelected(new Set());
        else setSelected(new Set(paginated.map(d => d.id)));
    };

    const getInitials = (name) => name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const getAvatarColor = (name) => {
        const colors = ["#0d9488", "#0891b2", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="dm-page">
            {/* ── Page Header ── */}
            <div className="dm-page-header">
                <div>
                    <h1 className="dm-page-title">
                        <Stethoscope size={28} style={{ color: "#0d9488" }} />
                        Doctors
                    </h1>
                    <p className="dm-page-subtitle">Manage, verify, and monitor all doctors on the platform</p>
                </div>
                <button className="dm-add-doctor-btn">
                    <UserPlus size={16} /> Add Doctor
                </button>
            </div>

            {/* ── KPI Cards ── */}
            <div className="dm-kpi-row">
                {[
                    { label: "Total Doctors", value: stats.total, icon: <Users size={20} />, color: "#0891b2", trend: "+12%" },
                    { label: "Verified", value: stats.verified, icon: <BadgeCheck size={20} />, color: "#10b981", trend: "+8%" },
                    { label: "Pending Review", value: stats.pending, icon: <Clock size={20} />, color: "#f59e0b", trend: `${stats.pending} new` },
                    { label: "Suspended", value: stats.suspended, icon: <ShieldAlert size={20} />, color: "#8b5cf6", trend: "—" },
                ].map((kpi, i) => (
                    <div key={i} className="dm-kpi-card admin-glass-card">
                        <div className="dm-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                            {kpi.icon}
                        </div>
                        <div className="dm-kpi-value">{kpi.value}</div>
                        <div className="dm-kpi-label">{kpi.label}</div>
                        <span className="dm-kpi-trend" style={{ color: kpi.color }}>{kpi.trend}</span>
                    </div>
                ))}
            </div>

            {/* ── Verification Queue ── */}
            {VERIFICATION_QUEUE.length > 0 && (
                <div className="dm-verification-queue admin-glass-card">
                    <div className="dm-vq-header">
                        <div className="dm-vq-title">
                            <ShieldAlert size={18} style={{ color: "#f59e0b" }} />
                            <h3>Verification Queue</h3>
                            <span className="dm-vq-count">{VERIFICATION_QUEUE.length} pending</span>
                        </div>
                        <button className="dm-vq-bulk-btn" onClick={() => {
                            VERIFICATION_QUEUE.forEach(d => updateDoctor(d.id, { status: "verified", accountStatus: "active" }));
                        }}>
                            <CheckCircle2 size={14} /> Approve All
                        </button>
                    </div>
                    <div className="dm-vq-list">
                        {VERIFICATION_QUEUE.map(doc => (
                            <div key={doc.id} className="dm-vq-item">
                                <div className="dm-vq-avatar" style={{ background: getAvatarColor(doc.name) }}>
                                    {getInitials(doc.name)}
                                </div>
                                <div className="dm-vq-info">
                                    <span className="dm-vq-name">{doc.name}</span>
                                    <span className="dm-vq-meta">{doc.specialty} · {doc.experience} yrs exp</span>
                                    <div className="dm-vq-docs">
                                        {Object.entries(doc.documents).map(([key, val]) => (
                                            <span key={key} className={`dm-doc-badge ${val ? "ok" : "missing"}`}>
                                                {val ? <Check size={10} /> : <AlertTriangle size={10} />}
                                                {key === "license" ? "License" : key === "certificates" ? "Certs" : "ID"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="dm-vq-actions">
                                    <button className="dm-vq-approve" onClick={() => handleAction("approve", doc)} title="Approve">
                                        <CheckCircle2 size={18} />
                                    </button>
                                    <button className="dm-vq-reject" onClick={() => handleAction("reject", doc)} title="Reject">
                                        <XCircle size={18} />
                                    </button>
                                    <button className="dm-vq-view" onClick={() => setDrawerDoc(doc)} title="View Details">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Filters & Search ── */}
            <div className="dm-toolbar admin-glass-card">
                <div className="dm-search-box">
                    <Search size={16} className="dm-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or license..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="dm-filter-group">
                    <select className="dm-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Status</option>
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select className="dm-select" value={specialtyFilter} onChange={e => { setSpecialtyFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Specialties</option>
                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="dm-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="joined">Sort: Joined</option>
                        <option value="name">Sort: Name</option>
                        <option value="experience">Sort: Experience</option>
                        <option value="rating">Sort: Rating</option>
                        <option value="patients">Sort: Patients</option>
                    </select>
                    <button className="dm-sort-dir" onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")} title="Toggle sort direction">
                        <ArrowUpDown size={14} />
                    </button>
                </div>
            </div>

            {/* ── Bulk Actions ── */}
            {selected.size > 0 && (
                <div className="dm-bulk-bar">
                    <span>{selected.size} doctor(s) selected</span>
                    <div className="dm-bulk-actions">
                        <button className="dm-bulk-approve" onClick={() => bulkAction("approve")}>
                            <CheckCircle2 size={14} /> Bulk Approve
                        </button>
                        <button className="dm-bulk-suspend" onClick={() => bulkAction("suspend")}>
                            <ShieldOff size={14} /> Bulk Suspend
                        </button>
                        <button className="dm-bulk-clear" onClick={() => setSelected(new Set())}>
                            <X size={14} /> Clear
                        </button>
                    </div>
                </div>
            )}

            {/* ── Doctors Table ── */}
            <div className="dm-table-wrapper admin-glass-card">
                <table className="dm-table">
                    <thead>
                        <tr>
                            <th className="dm-th-check">
                                <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleSelectAll} />
                            </th>
                            <th>Doctor</th>
                            <th>Specialty</th>
                            <th>Experience</th>
                            <th>License</th>
                            <th>Verification</th>
                            <th>Account</th>
                            <th>Joined</th>
                            <th>Activity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="dm-empty">
                                    <Search size={40} strokeWidth={1} />
                                    <p>No doctors found matching your criteria.</p>
                                </td>
                            </tr>
                        ) : paginated.map(doc => (
                            <tr key={doc.id} className={selected.has(doc.id) ? "dm-row-selected" : ""}>
                                <td className="dm-td-check">
                                    <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleSelect(doc.id)} />
                                </td>
                                <td>
                                    <div className="dm-doctor-cell" onClick={() => setDrawerDoc(doc)} style={{ cursor: "pointer" }}>
                                        <div className="dm-doctor-avatar" style={{ background: getAvatarColor(doc.name) }}>
                                            {getInitials(doc.name)}
                                        </div>
                                        <div>
                                            <div className="dm-doctor-name">
                                                {doc.name}
                                                {doc.riskFlag && <Flag size={12} className="dm-risk-flag" />}
                                            </div>
                                            <div className="dm-doctor-email">{doc.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="dm-specialty-tag">{doc.specialty}</span></td>
                                <td><span className="dm-exp">{doc.experience} yrs</span></td>
                                <td><code className="dm-license">{doc.license}</code></td>
                                <td>
                                    <span className="dm-status-badge" style={{ color: STATUS_MAP[doc.status]?.color, background: STATUS_MAP[doc.status]?.bg }}>
                                        {doc.status === "verified" && <CheckCircle2 size={12} />}
                                        {doc.status === "pending" && <Clock size={12} />}
                                        {doc.status === "rejected" && <XCircle size={12} />}
                                        {doc.status === "suspended" && <ShieldAlert size={12} />}
                                        {doc.status === "inactive" && <Shield size={12} />}
                                        {STATUS_MAP[doc.status]?.label}
                                    </span>
                                </td>
                                <td>
                                    <span className={`dm-account-dot ${doc.accountStatus}`}></span>
                                    {doc.accountStatus === "active" ? "Active" : doc.accountStatus === "suspended" ? "Suspended" : "Inactive"}
                                </td>
                                <td className="dm-date">{new Date(doc.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                                <td>
                                    <span className={`dm-activity ${doc.lastActive.includes("hour") || doc.lastActive.includes("min") || doc.lastActive === "Just now" ? "online" : "offline"}`}>
                                        <span className="dm-activity-dot"></span>
                                        {doc.lastActive}
                                    </span>
                                </td>
                                <td>
                                    <DoctorActions doc={doc} onAction={handleAction} onView={() => setDrawerDoc(doc)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="dm-pagination">
                        <span className="dm-page-info">Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div className="dm-page-btns">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16} /></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} className={p === currentPage ? "active" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
                            ))}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Analytics Section ── */}
            <div className="dm-analytics-row">
                <div className="dm-analytics-card admin-glass-card">
                    <h3><BarChart3 size={16} /> Specialty Distribution</h3>
                    <div className="dm-specialty-bars">
                        {SPECIALTIES.map(s => {
                            const count = doctors.filter(d => d.specialty === s).length;
                            if (count === 0) return null;
                            return (
                                <div key={s} className="dm-spec-bar">
                                    <span className="dm-spec-label">{s}</span>
                                    <div className="dm-spec-track">
                                        <div className="dm-spec-fill" style={{ width: `${(count / doctors.length) * 100}%` }}></div>
                                    </div>
                                    <span className="dm-spec-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="dm-analytics-card admin-glass-card">
                    <h3><Activity size={16} /> Status Overview</h3>
                    <div className="dm-status-overview">
                        {Object.entries(STATUS_MAP).map(([key, val]) => {
                            const count = doctors.filter(d => d.status === key).length;
                            const pct = doctors.length > 0 ? ((count / doctors.length) * 100).toFixed(0) : 0;
                            return (
                                <div key={key} className="dm-status-row">
                                    <span className="dm-so-dot" style={{ background: val.color }}></span>
                                    <span className="dm-so-label">{val.label}</span>
                                    <div className="dm-so-bar-track">
                                        <div className="dm-so-bar-fill" style={{ width: `${pct}%`, background: val.color }}></div>
                                    </div>
                                    <span className="dm-so-count" style={{ color: val.color }}>{count} ({pct}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Detail Drawer ── */}
            {drawerDoc && (
                <DoctorDrawer
                    doc={drawerDoc}
                    onClose={() => setDrawerDoc(null)}
                    onAction={handleAction}
                    getInitials={getInitials}
                    getAvatarColor={getAvatarColor}
                    adminNote={adminNote}
                    setAdminNote={setAdminNote}
                    updateDoctor={updateDoctor}
                />
            )}

            {/* ── Confirm Modal ── */}
            {confirmAction && (
                <div className="dm-modal-overlay" onClick={() => setConfirmAction(null)}>
                    <div className="dm-modal" onClick={e => e.stopPropagation()}>
                        <h3>Confirm {confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}</h3>
                        <p>Are you sure you want to <strong>{confirmAction.type}</strong> <strong>{confirmAction.doctor.name}</strong>?</p>
                        <div className="dm-modal-actions">
                            <button className="dm-modal-cancel" onClick={() => setConfirmAction(null)}>Cancel</button>
                            <button className={`dm-modal-confirm ${confirmAction.type}`} onClick={confirmActionHandler}>
                                {confirmAction.type === "approve" && <CheckCircle2 size={14} />}
                                {confirmAction.type === "reject" && <XCircle size={14} />}
                                {confirmAction.type === "suspend" && <ShieldOff size={14} />}
                                {confirmAction.type === "activate" && <Shield size={14} />}
                                {confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   DOCTOR ACTIONS DROPDOWN
   ═══════════════════════════════════════════════════════ */
function DoctorActions({ doc, onAction, onView }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <div className="dm-actions-wrap" ref={ref}>
            <button className="dm-actions-btn" onClick={() => setOpen(!open)}>
                <MoreHorizontal size={16} />
            </button>
            {open && (
                <div className="dm-actions-menu">
                    <button onClick={() => { onView(); setOpen(false); }}><Eye size={14} /> View Profile</button>
                    {doc.status === "pending" && (
                        <>
                            <button className="dm-act-approve" onClick={() => { onAction("approve", doc); setOpen(false); }}><CheckCircle2 size={14} /> Approve</button>
                            <button className="dm-act-reject" onClick={() => { onAction("reject", doc); setOpen(false); }}><XCircle size={14} /> Reject</button>
                        </>
                    )}
                    {doc.status !== "suspended" && doc.status !== "pending" && (
                        <button className="dm-act-suspend" onClick={() => { onAction("suspend", doc); setOpen(false); }}><ShieldOff size={14} /> Suspend</button>
                    )}
                    {(doc.status === "suspended" || doc.status === "rejected" || doc.status === "inactive") && (
                        <button className="dm-act-activate" onClick={() => { onAction("activate", doc); setOpen(false); }}><Shield size={14} /> Activate</button>
                    )}
                    <button onClick={() => setOpen(false)}><FileText size={14} /> View Documents</button>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   DOCTOR DETAIL DRAWER
   ═══════════════════════════════════════════════════════ */
function DoctorDrawer({ doc, onClose, onAction, getInitials, getAvatarColor, adminNote, setAdminNote, updateDoctor }) {
    const [activeSection, setActiveSection] = useState("profile");

    return (
        <>
            <div className="dm-drawer-overlay" onClick={onClose}></div>
            <aside className="dm-drawer">
                {/* Header */}
                <div className="dm-drawer-header">
                    <h2>Doctor Details</h2>
                    <button className="dm-drawer-close" onClick={onClose}><X size={18} /></button>
                </div>

                {/* Profile summary */}
                <div className="dm-drawer-profile">
                    <div className="dm-drawer-avatar" style={{ background: getAvatarColor(doc.name) }}>
                        {getInitials(doc.name)}
                    </div>
                    <div className="dm-drawer-info">
                        <h3>
                            {doc.name}
                            {doc.riskFlag && <Flag size={14} className="dm-risk-flag" />}
                        </h3>
                        <span className="dm-drawer-specialty">{doc.specialty}</span>
                        <span className="dm-status-badge" style={{ color: STATUS_MAP[doc.status]?.color, background: STATUS_MAP[doc.status]?.bg }}>
                            {STATUS_MAP[doc.status]?.label}
                        </span>
                    </div>
                </div>

                {/* Contact */}
                <div className="dm-drawer-contact">
                    <div><Mail size={14} /> {doc.email}</div>
                    <div><Phone size={14} /> {doc.phone}</div>
                    <div><MapPin size={14} /> {doc.address}</div>
                </div>

                {/* Bio */}
                <p className="dm-drawer-bio">{doc.bio}</p>

                {/* Tab navigation */}
                <div className="dm-drawer-tabs">
                    {["profile", "documents", "activity", "notes"].map(tab => (
                        <button key={tab} className={activeSection === tab ? "active" : ""} onClick={() => setActiveSection(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="dm-drawer-body">
                    {activeSection === "profile" && (
                        <div className="dm-drawer-section">
                            <div className="dm-detail-grid">
                                <div className="dm-detail-item"><span className="dm-detail-label">Experience</span><span className="dm-detail-value">{doc.experience} years</span></div>
                                <div className="dm-detail-item"><span className="dm-detail-label">License</span><span className="dm-detail-value"><code>{doc.license}</code></span></div>
                                <div className="dm-detail-item"><span className="dm-detail-label">Rating</span><span className="dm-detail-value">{doc.rating > 0 ? `⭐ ${doc.rating}` : "N/A"}</span></div>
                                <div className="dm-detail-item"><span className="dm-detail-label">Joined</span><span className="dm-detail-value">{new Date(doc.joined).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
                                <div className="dm-detail-item"><span className="dm-detail-label">Last Active</span><span className="dm-detail-value">{doc.lastActive}</span></div>
                                <div className="dm-detail-item"><span className="dm-detail-label">Account</span><span className="dm-detail-value" style={{ textTransform: "capitalize" }}>{doc.accountStatus}</span></div>
                            </div>
                        </div>
                    )}

                    {activeSection === "documents" && (
                        <div className="dm-drawer-section">
                            <div className="dm-doc-list">
                                {[
                                    { key: "license", label: "Medical License", icon: <Award size={18} /> },
                                    { key: "certificates", label: "Certificates", icon: <ClipboardCheck size={18} /> },
                                    { key: "idProof", label: "ID Proof", icon: <Shield size={18} /> },
                                ].map(item => (
                                    <div key={item.key} className={`dm-doc-row ${doc.documents[item.key] ? "uploaded" : "missing"}`}>
                                        <div className="dm-doc-icon">{item.icon}</div>
                                        <div className="dm-doc-info">
                                            <span className="dm-doc-label">{item.label}</span>
                                            <span className={`dm-doc-status ${doc.documents[item.key] ? "ok" : "warn"}`}>
                                                {doc.documents[item.key] ? "✓ Uploaded" : "⚠ Missing"}
                                            </span>
                                        </div>
                                        {doc.documents[item.key] ? (
                                            <button className="dm-doc-preview-btn"><Eye size={14} /> Preview</button>
                                        ) : (
                                            <button className="dm-doc-request-btn">Request Upload</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "activity" && (
                        <div className="dm-drawer-section">
                            <div className="dm-activity-stats">
                                <div className="dm-stat-card">
                                    <Users size={20} style={{ color: "#0891b2" }} />
                                    <span className="dm-stat-val">{doc.patients}</span>
                                    <span className="dm-stat-label">Patients</span>
                                </div>
                                <div className="dm-stat-card">
                                    <Calendar size={20} style={{ color: "#10b981" }} />
                                    <span className="dm-stat-val">{doc.appointments.toLocaleString()}</span>
                                    <span className="dm-stat-label">Appointments</span>
                                </div>
                                <div className="dm-stat-card">
                                    <FileText size={20} style={{ color: "#6366f1" }} />
                                    <span className="dm-stat-val">{doc.prescriptions.toLocaleString()}</span>
                                    <span className="dm-stat-label">Prescriptions</span>
                                </div>
                                <div className="dm-stat-card">
                                    <Star size={20} style={{ color: "#f59e0b" }} />
                                    <span className="dm-stat-val">{doc.rating > 0 ? doc.rating : "—"}</span>
                                    <span className="dm-stat-label">Rating</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "notes" && (
                        <div className="dm-drawer-section">
                            {doc.notes && (
                                <div className="dm-existing-note">
                                    <MessageSquare size={14} />
                                    <p>{doc.notes}</p>
                                </div>
                            )}
                            <textarea
                                className="dm-note-input"
                                placeholder="Add an admin note..."
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                rows={3}
                            />
                            <button className="dm-save-note" onClick={() => {
                                if (adminNote.trim()) {
                                    updateDoctor(doc.id, { notes: adminNote.trim() });
                                    setAdminNote("");
                                }
                            }}>
                                <MessageSquare size={14} /> Save Note
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="dm-drawer-footer">
                    {doc.status === "pending" && (
                        <>
                            <button className="dm-drawer-approve" onClick={() => onAction("approve", doc)}>
                                <CheckCircle2 size={16} /> Approve
                            </button>
                            <button className="dm-drawer-reject" onClick={() => onAction("reject", doc)}>
                                <XCircle size={16} /> Reject
                            </button>
                        </>
                    )}
                    {doc.status === "verified" && (
                        <button className="dm-drawer-suspend" onClick={() => onAction("suspend", doc)}>
                            <ShieldOff size={16} /> Suspend
                        </button>
                    )}
                    {(doc.status === "suspended" || doc.status === "rejected") && (
                        <button className="dm-drawer-activate" onClick={() => onAction("activate", doc)}>
                            <Shield size={16} /> Activate
                        </button>
                    )}
                    {doc.riskFlag && (
                        <div className="dm-drawer-risk">
                            <AlertTriangle size={14} /> This doctor has been flagged for review
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
