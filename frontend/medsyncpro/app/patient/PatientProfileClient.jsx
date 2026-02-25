"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../../lib/config";
import { toast } from "sonner";
import "../clinik.css";

/* ─── icon helpers (inline SVGs, no deps) ─── */
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{typeof d === "string" ? <path d={d} /> : d}</svg>
);

const Icons = {
    schedule: <Icon d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>} />,
    patients: <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />,
    visits: <Icon d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>} />,
    statistics: <Icon d={<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>} />,
    reports: <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} />,
    price: <Icon d={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>} />,
    cabinets: <Icon d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>} />,
    settings: <Icon d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>} />,
    phone: <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
    email: <Icon d={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>} />,
    file: <Icon d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>} />,
    download: <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} size={14} />,
    print: <Icon d={<><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>} size={16} />,
    edit: <Icon d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>} size={16} />,
    close: <Icon d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} size={14} />,
    menu: <Icon d={<><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>} size={20} />,
    bell: <Icon d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>} size={18} />,
    pencil: <Icon d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={14} />,
    check: <Icon d={<><polyline points="20 6 9 17 4 12" /></>} size={16} />,
    x: <Icon d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} size={16} />,
    camera: <Icon d={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>} size={18} />,
};

const sidebarItems = [
    { key: "schedule", label: "Schedule", icon: Icons.schedule },
    { key: "patients", label: "Patients", icon: Icons.patients },
    { key: "visits", label: "Scheduled visits", icon: Icons.visits },
    { key: "statistics", label: "Statistics", icon: Icons.statistics },
    { key: "reports", label: "Reports", icon: Icons.reports },
    { key: "price", label: "Price", icon: Icons.price },
    { key: "cabinets", label: "Cabinets", icon: Icons.cabinets },
];

/* ─── Editable field component ─── */
function EditableField({ label, value, field, editing, draft, onChange }) {
    return (
        <div className="clinik-info-item">
            <span className="clinik-info-label">{label}</span>
            {editing ? (
                <input
                    className="clinik-edit-input"
                    type="text"
                    value={draft[field] || ""}
                    onChange={(e) => onChange(field, e.target.value)}
                    autoComplete="off"
                />
            ) : (
                <span className="clinik-info-value">{value || "—"}</span>
            )}
        </div>
    );
}

/* ── Helper: build auth headers ── */
function getAuthHeaders() {
    try {
        const stored = localStorage.getItem("medsyncpro_user");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.token) {
                return { Authorization: `Bearer ${parsed.token}` };
            }
        }
    } catch { /* ignore */ }

    // Also try reading from document.cookie
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) {
        return { Authorization: `Bearer ${match[1]}` };
    }

    return {};
}

/* ── Helper: build profile object from user data ── */
function buildProfileFromUser(userData) {
    return {
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        dob: userData?.dob || "",
        address: userData?.address || "",
        gender: userData?.gender || "",
        profileImageUrl: userData?.profileImageUrl || userData?.profileImage || null,
        allergies: userData?.allergies || "",
        chronicDiseases: userData?.chronicDiseases || "",
        bloodType: userData?.bloodType || "",
        pastIllnesses: userData?.pastIllnesses || "",
        regDate: userData?.regDate || userData?.createdAt || "",
    };
}

export default function PatientProfileClient() {
    const { user, loading: authLoading, updateProfile: updateAuthProfile } = useAuth();
    const [activeTab, setActiveTab] = useState("future");
    const [activeSidebar, setActiveSidebar] = useState("patients");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    /* ── Profile state ── */
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({});
    const [saving, setSaving] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [apiConnected, setApiConnected] = useState(false);

    /* ── Profile image state ── */
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    /* ── Documents from API ── */
    const [documents, setDocuments] = useState([]);

    /* ── Visits (mock for now) ── */
    const futureVisits = [
        { time: "11.00-12.30", date: "26 Jun 2023", service: "Treatment and cleaning of canals", doctor: "Oksana Ma...", status: "Scheduled" },
        { time: "11.00-12.30", date: "27 Jul 2023", service: "Teeth whitening", doctor: "Max Oched...", status: "Scheduled" },
    ];
    const pastVisits = [
        { time: "09.00-10.00", date: "15 Mar 2023", service: "Regular checkup", doctor: "Dr. Smith", status: "Completed" },
        { time: "14.00-15.30", date: "02 Feb 2023", service: "Blood work analysis", doctor: "Dr. Patel", status: "Completed" },
    ];

    /* ── Step 1: Once AuthContext finishes loading, immediately populate profile from cached user ── */
    useEffect(() => {
        if (authLoading) return; // Wait for auth to finish loading

        if (user) {
            console.log("[PROFILE] Initializing from cached user:", user.name, user.email);
            const cached = buildProfileFromUser(user);
            setProfile(cached);
            setDraft(cached);
        }

        // Then try to enhance with API data
        fetchProfileFromAPI();
    }, [authLoading, user?._id]);

    /* ── Step 2: Try fetching fresh data from API (enhancement, not required) ── */
    const fetchProfileFromAPI = async () => {
        setLoadingProfile(true);
        try {
            const headers = getAuthHeaders();
            console.log("[PROFILE] Fetching from API with auth:", Object.keys(headers).length > 0 ? "Bearer token" : "cookies only");

            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: "GET",
                credentials: "include",
                headers: headers,
            });

            if (!res.ok) {
                console.warn(`[PROFILE] API returned ${res.status} — using cached data`);
                return; // Profile is already populated from cache, so just return
            }

            const data = await res.json();
            console.log("[PROFILE] API data received:", data);

            if (data.success && data.data) {
                const p = data.data;
                const apiProfile = {
                    name: p.name || user?.name || "",
                    email: p.email || user?.email || "",
                    phone: p.phone || "",
                    dob: p.dob || "",
                    address: p.address || "",
                    gender: p.gender || "",
                    profileImageUrl: p.profileImageUrl || null,
                    allergies: p.allergies || "",
                    chronicDiseases: p.chronicDiseases || "",
                    bloodType: p.bloodType || "",
                    pastIllnesses: p.pastIllnesses || "",
                    regDate: p.createdAt || p.registrationDate || "",
                };
                setProfile(apiProfile);
                setDraft(apiProfile);
                setApiConnected(true);

                if (p.documents && Array.isArray(p.documents)) {
                    setDocuments(p.documents);
                }

                console.log("[PROFILE] ✅ Enhanced with API data");
            }
        } catch (err) {
            console.warn("[PROFILE] API unreachable — using cached data:", err.message);
            // Profile is already populated from AuthContext, so no error needed
        } finally {
            setLoadingProfile(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const visits = activeTab === "future" ? futureVisits : activeTab === "past" ? pastVisits : [];

    /* ── Edit handlers ── */
    const handleEdit = () => {
        setDraft({ ...profile });
        setSelectedImage(null);
        setImagePreview(null);
        setEditing(true);
    };

    const handleCancel = () => {
        setDraft({ ...profile });
        setSelectedImage(null);
        setImagePreview(null);
        setEditing(false);
    };

    const handleFieldChange = (field, value) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    /* ── Image selection ── */
    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB.");
            return;
        }

        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    /* ── Save to API ── */
    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();

            // Build the profile JSON — include all editable fields
            const profilePayload = {};
            if (draft.name !== profile.name) profilePayload.name = draft.name;
            if (draft.phone !== profile.phone) profilePayload.phone = draft.phone;
            if (draft.dob !== profile.dob) profilePayload.dob = draft.dob;
            if (draft.address !== profile.address) profilePayload.address = draft.address;
            if (draft.gender !== profile.gender) profilePayload.gender = draft.gender;

            const hasChanges = Object.keys(profilePayload).length > 0 || selectedImage;

            if (!hasChanges) {
                // Nothing changed, just close edit mode
                setEditing(false);
                toast.info("No changes to save.");
                setSaving(false);
                return;
            }

            // Only send profile JSON if there are field changes
            if (Object.keys(profilePayload).length > 0) {
                formData.append("profile", JSON.stringify(profilePayload));
            }

            // Attach profile image if selected
            if (selectedImage) {
                formData.append("profileImage", selectedImage);
            }

            console.log("[PROFILE] Saving with payload:", profilePayload);

            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: "PATCH",
                credentials: "include",
                headers: headers,
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();
            console.log("[PROFILE] Save response:", data);

            if (!data.success) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Update local state with the response data
            const updated = data.data;
            const newProfile = {
                ...profile,
                name: updated.name || draft.name,
                email: updated.email || draft.email,
                phone: updated.phone || draft.phone,
                dob: updated.dob || draft.dob,
                address: updated.address || draft.address,
                gender: updated.gender || draft.gender,
                profileImageUrl: updated.profileImageUrl || profile.profileImageUrl,
            };

            setProfile(newProfile);
            setDraft(newProfile);
            setSelectedImage(null);
            setImagePreview(null);
            setEditing(false);

            // Sync back to AuthContext (persists to localStorage)
            updateAuthProfile({
                name: newProfile.name,
                email: newProfile.email,
                phone: newProfile.phone,
                dob: newProfile.dob,
                address: newProfile.address,
                gender: newProfile.gender,
                profileImageUrl: newProfile.profileImageUrl,
            });

            if (updated.documents && Array.isArray(updated.documents)) {
                setDocuments(updated.documents);
            }

            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("[PROFILE] Save error:", err);
            toast.error(err.message || "Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    /* ── Format date for display ── */
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        } catch {
            return dateStr;
        }
    };

    /* ── Loading state — only show spinner if we have NO data yet ── */
    if (authLoading || (!profile && loadingProfile)) {
        return (
            <div className="clinik-layout">
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="clinik-spinner" style={{ width: 40, height: 40, borderWidth: 3, borderColor: "rgba(79,125,249,0.2)", borderTopColor: "#4f7df9", margin: "0 auto 16px" }}></div>
                        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile && !user) {
        return (
            <div className="clinik-layout">
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: "16px" }}>
                    <p style={{ color: "#94a3b8", fontSize: "1rem" }}>Please log in to view your profile.</p>
                    <a href="/online-medication/auth/login" style={{ color: "#4f7df9", fontWeight: 600, textDecoration: "none" }}>Go to Login →</a>
                </div>
            </div>
        );
    }

    const displayImage = imagePreview || profile.profileImageUrl;

    return (
        <div className="clinik-layout">
            {/* ── Sidebar ── */}
            <aside className={`clinik-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="clinik-sidebar-header">
                    <a href="/online-medication" className="clinik-logo">
                        <span className="clinik-logo-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                        </span>
                        <span className="clinik-logo-text">MedSyncpro</span>
                    </a>
                </div>

                <nav className="clinik-nav">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.key}
                            className={`clinik-nav-item ${activeSidebar === item.key ? "active" : ""}`}
                            onClick={() => setActiveSidebar(item.key)}
                        >
                            <span className="clinik-nav-icon">{item.icon}</span>
                            <span className="clinik-nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="clinik-nav-bottom">
                    <button
                        className={`clinik-nav-item ${activeSidebar === "settings" ? "active" : ""}`}
                        onClick={() => setActiveSidebar("settings")}
                    >
                        <span className="clinik-nav-icon">{Icons.settings}</span>
                        <span className="clinik-nav-label">Settings</span>
                    </button>

                    <div className="clinik-upgrade-card">
                        <div className="clinik-upgrade-badge">✨ Upgrade to PRO</div>
                        <p className="clinik-upgrade-text">Improve your workflow and start doing more with MedSyncpro PRO!</p>
                        <button className="clinik-upgrade-btn">UPDATE TO PRO</button>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="clinik-main">
                {/* Top bar */}
                <header className="clinik-topbar">
                    <div className="clinik-topbar-left">
                        <button className="clinik-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {Icons.menu}
                        </button>
                        <h1 className="clinik-page-title">Patient profile</h1>
                    </div>
                    <div className="clinik-topbar-right">
                        <div className="clinik-topbar-org">MEDSYNC <span>▾</span></div>
                        <span className="clinik-topbar-lang">EN</span>
                        <button className="clinik-topbar-bell">{Icons.bell}<span className="clinik-bell-dot"></span></button>
                        <div className="clinik-topbar-avatar">
                            {displayImage ? (
                                <img src={displayImage} alt={profile.name} />
                            ) : (
                                <span>{getInitials(profile.name)}</span>
                            )}
                        </div>

                        {editing ? (
                            <>
                                <button className="clinik-btn-cancel" onClick={handleCancel} disabled={saving}>
                                    {Icons.x} CANCEL
                                </button>
                                <button className="clinik-btn-save" onClick={handleSave} disabled={saving}>
                                    {saving ? <span className="clinik-spinner"></span> : Icons.check}
                                    {saving ? "SAVING..." : "SAVE"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="clinik-btn-outline clinik-btn-print">{Icons.print} PRINT</button>
                                <button className="clinik-btn-primary clinik-btn-edit" onClick={handleEdit}>{Icons.edit} EDIT</button>
                            </>
                        )}
                    </div>
                </header>

                {/* Content grid */}
                <div className="clinik-content">
                    {/* ── Left column ── */}
                    <div className="clinik-left-col">
                        {/* Patient profile card */}
                        <div className={`clinik-profile-card ${editing ? "clinik-editing" : ""}`}>
                            <div className="clinik-profile-header">
                                <div className="clinik-profile-avatar" style={{ position: "relative" }}>
                                    {displayImage ? (
                                        <img src={displayImage} alt={profile.name} />
                                    ) : (
                                        <div className="clinik-avatar-placeholder">{getInitials(editing ? draft.name : profile.name)}</div>
                                    )}
                                    {editing && (
                                        <button
                                            className="clinik-avatar-upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Change profile photo"
                                        >
                                            {Icons.camera}
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{ display: "none" }}
                                    />
                                </div>

                                {editing ? (
                                    <input
                                        className="clinik-edit-input clinik-edit-name"
                                        type="text"
                                        value={draft.name}
                                        onChange={(e) => handleFieldChange("name", e.target.value)}
                                        placeholder="Patient name"
                                    />
                                ) : (
                                    <h2 className="clinik-profile-name">{profile.name}</h2>
                                )}

                                <div className="clinik-profile-contact">
                                    {editing ? (
                                        <>
                                            <div className="clinik-contact-edit-row">
                                                <span className="clinik-contact-icon">{Icons.phone}</span>
                                                <input
                                                    className="clinik-edit-input"
                                                    type="text"
                                                    value={draft.phone}
                                                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                            <div className="clinik-contact-edit-row">
                                                <span className="clinik-contact-icon">{Icons.email}</span>
                                                <input
                                                    className="clinik-edit-input"
                                                    type="email"
                                                    value={draft.email}
                                                    onChange={(e) => handleFieldChange("email", e.target.value)}
                                                    placeholder="Email"
                                                    disabled
                                                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <a href={`tel:${profile.phone}`} className="clinik-contact-link clinik-contact-phone">
                                                {Icons.phone} {profile.phone || "No phone added"}
                                            </a>
                                            <a href={`mailto:${profile.email}`} className="clinik-contact-link clinik-contact-email">
                                                {Icons.email} {profile.email}
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="clinik-info-row">
                                {/* General information */}
                                <div className="clinik-info-card">
                                    <div className="clinik-info-title">
                                        General information
                                        {!editing && <button className="clinik-edit-tiny" onClick={handleEdit}>{Icons.pencil}</button>}
                                    </div>
                                    <div className="clinik-info-grid">
                                        <EditableField label="Date of birth:" value={formatDate(profile.dob)} field="dob" editing={editing} draft={draft} onChange={handleFieldChange} />
                                        <EditableField label="Address:" value={profile.address} field="address" editing={editing} draft={draft} onChange={handleFieldChange} />
                                        <div className="clinik-info-item">
                                            <span className="clinik-info-label">Gender:</span>
                                            {editing ? (
                                                <select
                                                    className="clinik-edit-input"
                                                    value={draft.gender || ""}
                                                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            ) : (
                                                <span className="clinik-info-value">{profile.gender || "—"}</span>
                                            )}
                                        </div>
                                        <div className="clinik-info-item">
                                            <span className="clinik-info-label">Registration Date:</span>
                                            <span className="clinik-info-value">{formatDate(profile.regDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Anamnesis */}
                                <div className="clinik-info-card">
                                    <div className="clinik-info-title">
                                        Anamnesis
                                        {!editing && <button className="clinik-edit-tiny" onClick={handleEdit}>{Icons.pencil}</button>}
                                    </div>
                                    <div className="clinik-info-grid">
                                        <EditableField label="Allergies:" value={profile.allergies} field="allergies" editing={editing} draft={draft} onChange={handleFieldChange} />
                                        <EditableField label="Chronic diseases:" value={profile.chronicDiseases} field="chronicDiseases" editing={editing} draft={draft} onChange={handleFieldChange} />
                                        <EditableField label="Blood type:" value={profile.bloodType} field="bloodType" editing={editing} draft={draft} onChange={handleFieldChange} />
                                        <EditableField label="Past illnesses or injuries:" value={profile.pastIllnesses} field="pastIllnesses" editing={editing} draft={draft} onChange={handleFieldChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visits section */}
                        <div className="clinik-visits-card">
                            <div className="clinik-visits-tabs">
                                <button className={`clinik-tab ${activeTab === "future" ? "active" : ""}`} onClick={() => setActiveTab("future")}>
                                    Future visits (2)
                                </button>
                                <button className={`clinik-tab ${activeTab === "past" ? "active" : ""}`} onClick={() => setActiveTab("past")}>
                                    Past visits (15)
                                </button>
                                <button className={`clinik-tab ${activeTab === "planned" ? "active" : ""}`} onClick={() => setActiveTab("planned")}>
                                    Planned treatments
                                </button>
                            </div>

                            <div className="clinik-visits-list">
                                {visits.length === 0 ? (
                                    <div className="clinik-empty-state">No planned treatments yet.</div>
                                ) : visits.map((v, i) => (
                                    <div key={i} className={`clinik-visit-row ${activeTab === "past" ? "past" : ""}`}>
                                        <div className="clinik-visit-time">
                                            <div className="clinik-visit-clock">{v.time}</div>
                                            <div className="clinik-visit-date">{v.date}</div>
                                        </div>
                                        <div className="clinik-visit-detail">
                                            <span className="clinik-visit-label">Service:</span>
                                            <span className="clinik-visit-value">{v.service}</span>
                                        </div>
                                        <div className="clinik-visit-detail">
                                            <span className="clinik-visit-label">Doctor:</span>
                                            <span className="clinik-visit-value clinik-doctor-link">{v.doctor}</span>
                                        </div>
                                        <div className="clinik-visit-detail">
                                            <span className="clinik-visit-label">Status:</span>
                                            <span className={`clinik-status-badge ${v.status.toLowerCase()}`}>{v.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className="clinik-right-col">
                        {/* Files / Documents */}
                        <div className="clinik-side-card">
                            <div className="clinik-side-header">
                                <h3>Documents</h3>
                                {documents.length > 0 && (
                                    <button className="clinik-download-all">DOWNLOAD</button>
                                )}
                            </div>
                            {documents.length > 0 ? (
                                <ul className="clinik-file-list">
                                    {documents.map((doc, i) => (
                                        <li key={doc.id || i} className="clinik-file-item">
                                            <span className="clinik-file-icon">{Icons.file}</span>
                                            <span className="clinik-file-name">{doc.fileName || `Document ${i + 1}`}</span>
                                            <span className="clinik-file-size">{doc.fileSize ? `${Math.round(doc.fileSize / 1024)}kb` : ""}</span>
                                            {doc.url && (
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="clinik-file-dl">
                                                    {Icons.download}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="clinik-empty-state" style={{ padding: "20px" }}>No documents uploaded yet.</div>
                            )}
                        </div>

                        {/* Profile Summary Card */}
                        <div className="clinik-side-card">
                            <div className="clinik-side-header">
                                <h3>Quick Info</h3>
                            </div>
                            <div className="clinik-info-grid" style={{ gap: "14px" }}>
                                <div className="clinik-info-item">
                                    <span className="clinik-info-label">Role</span>
                                    <span className="clinik-info-value">{user?.role || "PATIENT"}</span>
                                </div>
                                <div className="clinik-info-item">
                                    <span className="clinik-info-label">Email verified</span>
                                    <span className="clinik-info-value" style={{ color: "#22c55e" }}>✓ Yes</span>
                                </div>
                                <div className="clinik-info-item">
                                    <span className="clinik-info-label">User ID</span>
                                    <span className="clinik-info-value" style={{ fontSize: "0.72rem", fontFamily: "monospace", wordBreak: "break-all" }}>
                                        {user?._id || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
