"use client";
import { useState, useRef, useEffect } from "react";
import {
    User, Briefcase, Building2, CalendarClock, MessageSquareText, Bell,
    FileCheck, ShieldCheck, Lock, UserX, Camera, X, Plus, Trash2, Upload,
    Save, RotateCcw, Eye, EyeOff, LogOut, Download, AlertTriangle,
    CheckCircle2, Clock, Globe, Phone, Mail, MapPin, Languages, Award,
    Stethoscope, IndianRupee
} from "lucide-react";
import "../doctor-settings.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            className={`ds-toggle ${checked ? "active" : ""}`}
            onClick={() => onChange(!checked)}
            aria-checked={checked}
            role="switch"
        >
            <span className="ds-toggle-thumb" />
        </button>
    );
}

function TagInput({ tags, onChange, placeholder }) {
    const [input, setInput] = useState("");
    const add = () => {
        const val = input.trim();
        if (val && !tags.includes(val)) {
            onChange([...tags, val]);
            setInput("");
        }
    };
    return (
        <div className="ds-tag-input">
            <div className="ds-tags">
                {tags.map((t) => (
                    <span key={t} className="ds-tag">
                        {t}
                        <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}><X size={12} /></button>
                    </span>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                placeholder={placeholder}
            />
        </div>
    );
}

// ────────────────────────── PROFILE ──────────────────────────
function ProfileSection() {
    const [photo, setPhoto] = useState(null);
    return (
        <div className="ds-section" id="profile">
            <h2 className="ds-section-title"><User size={20} /> Profile</h2>
            <p className="ds-section-desc">Manage your personal information</p>

            <div className="ds-photo-upload">
                <div className="ds-avatar">
                    {photo ? <img src={URL.createObjectURL(photo)} alt="avatar" /> : <User size={36} />}
                    <label className="ds-avatar-edit"><Camera size={14} /><input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files[0])} /></label>
                </div>
                <div className="ds-photo-info">
                    <span className="ds-photo-label">Profile Photo</span>
                    <span className="ds-photo-hint">JPG, PNG under 2 MB. Recommended 256×256px.</span>
                </div>
            </div>

            <div className="ds-form-grid">
                <div className="ds-field">
                    <label>Full Name</label>
                    <input type="text" placeholder="Dr. John Smith" />
                </div>
                <div className="ds-field">
                    <label>Email <span className="ds-readonly-badge">Read-only</span></label>
                    <input type="email" value="dr.smith@medsyncpro.com" readOnly className="ds-readonly" />
                </div>
                <div className="ds-field">
                    <label>Phone Number</label>
                    <div className="ds-input-icon"><Phone size={15} /><input type="tel" placeholder="+91 98765 43210" /></div>
                </div>
                <div className="ds-field">
                    <label>Gender</label>
                    <select><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select>
                </div>
                <div className="ds-field">
                    <label>Date of Birth</label>
                    <input type="date" />
                </div>
            </div>
            <div className="ds-field ds-full">
                <label>Bio / About</label>
                <textarea rows={4} placeholder="Write a short bio about yourself, your experience, and your approach to patient care..." />
            </div>
        </div>
    );
}

// ────────────────────────── PROFESSIONAL INFO ──────────────────────────
function ProfessionalSection() {
    const [expertise, setExpertise] = useState(["Cardiac Surgery", "Interventional Cardiology"]);
    const [languages, setLanguages] = useState(["English", "Hindi"]);
    return (
        <div className="ds-section" id="professional">
            <h2 className="ds-section-title"><Briefcase size={20} /> Professional Info</h2>
            <p className="ds-section-desc">Your medical qualifications and specialization</p>

            <div className="ds-form-grid">
                <div className="ds-field">
                    <label>Specialty</label>
                    <select>
                        <option value="">Select Specialty</option>
                        <option>Cardiology</option><option>Dermatology</option><option>Neurology</option>
                        <option>Orthopedics</option><option>Pediatrics</option><option>General Medicine</option>
                    </select>
                </div>
                <div className="ds-field">
                    <label>Qualifications</label>
                    <input type="text" placeholder="MBBS, MD, DM" />
                </div>
                <div className="ds-field">
                    <label>Experience (Years)</label>
                    <input type="number" placeholder="12" min="0" />
                </div>
                <div className="ds-field">
                    <label>Medical Registration Number</label>
                    <input type="text" placeholder="MCI-12345" />
                </div>
                <div className="ds-field">
                    <label>Consultation Fee</label>
                    <div className="ds-input-icon"><IndianRupee size={15} /><input type="number" placeholder="500" /></div>
                </div>
            </div>
            <div className="ds-field ds-full">
                <label>Languages Spoken</label>
                <TagInput tags={languages} onChange={setLanguages} placeholder="Add language..." />
            </div>
            <div className="ds-field ds-full">
                <label>Areas of Expertise</label>
                <TagInput tags={expertise} onChange={setExpertise} placeholder="Add expertise..." />
            </div>
        </div>
    );
}

// ────────────────────────── CLINIC ──────────────────────────
function ClinicSection() {
    return (
        <div className="ds-section" id="clinic">
            <h2 className="ds-section-title"><Building2 size={20} /> Clinic / Practice Info</h2>
            <p className="ds-section-desc">Where do your consultations take place?</p>

            <div className="ds-form-grid">
                <div className="ds-field">
                    <label>Clinic Name</label>
                    <input type="text" placeholder="HeartCare Clinics" />
                </div>
                <div className="ds-field">
                    <label>City</label>
                    <input type="text" placeholder="Mumbai" />
                </div>
                <div className="ds-field ds-full">
                    <label>Address</label>
                    <div className="ds-input-icon"><MapPin size={15} /><input type="text" placeholder="123, Marine Drive, Mumbai - 400001" /></div>
                </div>
                <div className="ds-field">
                    <label>Consultation Mode</label>
                    <select>
                        <option>Online Only</option>
                        <option>In-Person Only</option>
                        <option>Both (Online & In-Person)</option>
                    </select>
                </div>
            </div>

            <div className="ds-field ds-full" style={{ marginTop: 8 }}>
                <label>Working Locations</label>
                <div className="ds-location-list">
                    <div className="ds-location-item">
                        <MapPin size={14} />
                        <span>HeartCare Clinics — Marine Drive, Mumbai</span>
                        <button type="button" className="ds-remove-btn"><X size={14} /></button>
                    </div>
                    <div className="ds-location-item">
                        <MapPin size={14} />
                        <span>City Hospital — Andheri, Mumbai</span>
                        <button type="button" className="ds-remove-btn"><X size={14} /></button>
                    </div>
                </div>
                <button type="button" className="ds-add-btn"><Plus size={14} /> Add Location</button>
            </div>
        </div>
    );
}

// ────────────────────────── AVAILABILITY & SCHEDULE ──────────────────────────
function AvailabilitySection() {
    const [available, setAvailable] = useState(true);
    const [schedule, setSchedule] = useState(
        DAYS.reduce((acc, d) => ({
            ...acc,
            [d]: d === "Sunday"
                ? { enabled: false, slots: [] }
                : { enabled: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] }
        }), {})
    );

    const toggleDay = (day) => {
        setSchedule((s) => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }));
    };
    const updateSlot = (day, idx, field, val) => {
        setSchedule((s) => {
            const slots = [...s[day].slots];
            slots[idx] = { ...slots[idx], [field]: val };
            return { ...s, [day]: { ...s[day], slots } };
        });
    };
    const addSlot = (day) => {
        setSchedule((s) => ({ ...s, [day]: { ...s[day], slots: [...s[day].slots, { start: "09:00", end: "17:00" }] } }));
    };
    const removeSlot = (day, idx) => {
        setSchedule((s) => ({ ...s, [day]: { ...s[day], slots: s[day].slots.filter((_, i) => i !== idx) } }));
    };

    return (
        <div className="ds-section" id="availability">
            <h2 className="ds-section-title"><CalendarClock size={20} /> Availability & Schedule</h2>
            <p className="ds-section-desc">Set your weekly availability for consultations</p>

            <div className="ds-availability-toggle">
                <div>
                    <span className="ds-toggle-label">Available for Consultations</span>
                    <span className="ds-toggle-hint">Toggle off to pause all appointments</span>
                </div>
                <Toggle checked={available} onChange={setAvailable} />
            </div>

            <div className="ds-schedule-editor">
                {DAYS.map((day) => (
                    <div key={day} className={`ds-schedule-row ${!schedule[day].enabled ? "disabled" : ""}`}>
                        <div className="ds-schedule-day">
                            <Toggle checked={schedule[day].enabled} onChange={() => toggleDay(day)} />
                            <span>{day}</span>
                        </div>
                        <div className="ds-schedule-slots">
                            {schedule[day].enabled ? (
                                <>
                                    {schedule[day].slots.map((slot, idx) => (
                                        <div key={idx} className="ds-slot">
                                            <input type="time" value={slot.start} onChange={(e) => updateSlot(day, idx, "start", e.target.value)} />
                                            <span className="ds-slot-sep">to</span>
                                            <input type="time" value={slot.end} onChange={(e) => updateSlot(day, idx, "end", e.target.value)} />
                                            {schedule[day].slots.length > 1 && (
                                                <button type="button" className="ds-slot-remove" onClick={() => removeSlot(day, idx)}><X size={14} /></button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="ds-add-slot-btn" onClick={() => addSlot(day)}>
                                        <Plus size={13} /> Add Slot
                                    </button>
                                </>
                            ) : (
                                <span className="ds-day-off">Day Off</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ────────────────────────── CONSULTATION SETTINGS ──────────────────────────
function ConsultationSection() {
    const [autoApproval, setAutoApproval] = useState(true);
    const [onlineConsultation, setOnlineConsultation] = useState(true);
    return (
        <div className="ds-section" id="consultation">
            <h2 className="ds-section-title"><MessageSquareText size={20} /> Consultation Settings</h2>
            <p className="ds-section-desc">Configure how your consultations work</p>

            <div className="ds-form-grid">
                <div className="ds-field">
                    <label>Consultation Duration</label>
                    <select>
                        <option>15 minutes</option><option>20 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option>
                    </select>
                </div>
                <div className="ds-field">
                    <label>Follow-up Window</label>
                    <select>
                        <option>3 days</option><option>7 days</option><option>14 days</option><option>30 days</option>
                    </select>
                </div>
                <div className="ds-field">
                    <label>Prescription Template</label>
                    <select>
                        <option>Default Template</option><option>Cardiology Template</option><option>Custom Template</option>
                    </select>
                </div>
            </div>

            <div className="ds-toggle-cards">
                <div className="ds-toggle-card">
                    <div>
                        <span className="ds-toggle-label">Auto-Approve Appointments</span>
                        <span className="ds-toggle-hint">Automatically confirm patient bookings</span>
                    </div>
                    <Toggle checked={autoApproval} onChange={setAutoApproval} />
                </div>
                <div className="ds-toggle-card">
                    <div>
                        <span className="ds-toggle-label">Online Consultation</span>
                        <span className="ds-toggle-hint">Enable video / chat consultations</span>
                    </div>
                    <Toggle checked={onlineConsultation} onChange={setOnlineConsultation} />
                </div>
            </div>
        </div>
    );
}

// ────────────────────────── NOTIFICATIONS ──────────────────────────
function NotificationsSection() {
    const [prefs, setPrefs] = useState({
        newAppointment: true, messages: true, prescriptionReminders: true,
        followUpReminders: true, systemUpdates: false, emailNotifs: true, pushNotifs: true,
    });
    const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

    const items = [
        { key: "newAppointment", label: "New Appointment Alerts", desc: "Get notified when a patient books" },
        { key: "messages", label: "Messages", desc: "Notifications for new patient messages" },
        { key: "prescriptionReminders", label: "Prescription Reminders", desc: "Reminders for pending prescriptions" },
        { key: "followUpReminders", label: "Follow-up Reminders", desc: "Alerts for upcoming follow-ups" },
        { key: "systemUpdates", label: "System Updates", desc: "Platform updates and announcements" },
        { key: "emailNotifs", label: "Email Notifications", desc: "Receive notifications via email" },
        { key: "pushNotifs", label: "Push Notifications", desc: "Browser and mobile push alerts" },
    ];

    return (
        <div className="ds-section" id="notifications">
            <h2 className="ds-section-title"><Bell size={20} /> Notifications</h2>
            <p className="ds-section-desc">Choose how you&apos;d like to be notified</p>

            <div className="ds-toggle-cards">
                {items.map((it) => (
                    <div key={it.key} className="ds-toggle-card">
                        <div>
                            <span className="ds-toggle-label">{it.label}</span>
                            <span className="ds-toggle-hint">{it.desc}</span>
                        </div>
                        <Toggle checked={prefs[it.key]} onChange={() => toggle(it.key)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ────────────────────────── DOCUMENTS ──────────────────────────
function DocumentsSection() {
    const docs = [
        { name: "Medical License", status: "verified", file: "medical_license.pdf" },
        { name: "Board Certification", status: "pending", file: "board_cert.pdf" },
        { name: "Government ID", status: "not_uploaded", file: null },
    ];
    const statusMap = {
        verified: { label: "Verified", cls: "verified", icon: CheckCircle2 },
        pending: { label: "Pending Review", cls: "pending", icon: Clock },
        not_uploaded: { label: "Not Uploaded", cls: "missing", icon: Upload },
    };

    return (
        <div className="ds-section" id="documents">
            <h2 className="ds-section-title"><FileCheck size={20} /> Documents & Verification</h2>
            <p className="ds-section-desc">Upload your credentials for verification</p>

            <div className="ds-doc-list">
                {docs.map((doc) => {
                    const st = statusMap[doc.status];
                    const StIcon = st.icon;
                    return (
                        <div key={doc.name} className="ds-doc-card">
                            <div className="ds-doc-info">
                                <span className="ds-doc-name">{doc.name}</span>
                                {doc.file && <span className="ds-doc-file">{doc.file}</span>}
                            </div>
                            <div className="ds-doc-actions">
                                <span className={`ds-doc-status ${st.cls}`}>
                                    <StIcon size={13} /> {st.label}
                                </span>
                                <label className="ds-upload-btn">
                                    <Upload size={13} /> {doc.file ? "Re-upload" : "Upload"}
                                    <input type="file" hidden />
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ────────────────────────── SECURITY ──────────────────────────
function SecuritySection() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [twoFa, setTwoFa] = useState(false);

    const sessions = [
        { device: "Chrome — Windows 10", location: "Mumbai, India", current: true },
        { device: "Safari — iPhone 14", location: "Mumbai, India", current: false },
    ];

    return (
        <div className="ds-section" id="security">
            <h2 className="ds-section-title"><ShieldCheck size={20} /> Security & Password</h2>
            <p className="ds-section-desc">Keep your account secure</p>

            <div className="ds-subsection">
                <h3 className="ds-subsection-title">Change Password</h3>
                <div className="ds-form-grid ds-narrow">
                    <div className="ds-field ds-full">
                        <label>Current Password</label>
                        <div className="ds-input-icon">
                            <input type={showOld ? "text" : "password"} placeholder="Enter current password" />
                            <button type="button" className="ds-eye-btn" onClick={() => setShowOld(!showOld)}>
                                {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    <div className="ds-field ds-full">
                        <label>New Password</label>
                        <div className="ds-input-icon">
                            <input type={showNew ? "text" : "password"} placeholder="Enter new password" />
                            <button type="button" className="ds-eye-btn" onClick={() => setShowNew(!showNew)}>
                                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    <div className="ds-field ds-full">
                        <label>Confirm New Password</label>
                        <input type="password" placeholder="Confirm new password" />
                    </div>
                </div>
            </div>

            <div className="ds-toggle-cards">
                <div className="ds-toggle-card">
                    <div>
                        <span className="ds-toggle-label">Two-Factor Authentication</span>
                        <span className="ds-toggle-hint">Add an extra layer of security to your account</span>
                    </div>
                    <Toggle checked={twoFa} onChange={setTwoFa} />
                </div>
            </div>

            <div className="ds-subsection">
                <h3 className="ds-subsection-title">Active Sessions</h3>
                <div className="ds-sessions">
                    {sessions.map((s, i) => (
                        <div key={i} className="ds-session-item">
                            <div className="ds-session-info">
                                <span className="ds-session-device">{s.device} {s.current && <span className="ds-current-badge">Current</span>}</span>
                                <span className="ds-session-loc">{s.location}</span>
                            </div>
                            {!s.current && <button type="button" className="ds-logout-session-btn"><LogOut size={14} /> Revoke</button>}
                        </div>
                    ))}
                </div>
                <button type="button" className="ds-danger-outline-btn"><LogOut size={14} /> Logout from All Other Devices</button>
            </div>
        </div>
    );
}

// ────────────────────────── PRIVACY ──────────────────────────
function PrivacySection() {
    const [prefs, setPrefs] = useState({
        profileVisible: true, allowReviews: true, showContact: false, dataSharing: false,
    });
    const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

    const items = [
        { key: "profileVisible", label: "Profile Visibility", desc: "Allow patients to view your profile" },
        { key: "allowReviews", label: "Allow Patient Reviews", desc: "Let patients leave public reviews" },
        { key: "showContact", label: "Show Contact Info", desc: "Display phone/email on public profile" },
        { key: "dataSharing", label: "Data Sharing", desc: "Share anonymized data for research" },
    ];

    return (
        <div className="ds-section" id="privacy">
            <h2 className="ds-section-title"><Lock size={20} /> Privacy</h2>
            <p className="ds-section-desc">Control how your information is shared</p>

            <div className="ds-toggle-cards">
                {items.map((it) => (
                    <div key={it.key} className="ds-toggle-card">
                        <div>
                            <span className="ds-toggle-label">{it.label}</span>
                            <span className="ds-toggle-hint">{it.desc}</span>
                        </div>
                        <Toggle checked={prefs[it.key]} onChange={() => toggle(it.key)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ────────────────────────── ACCOUNT ──────────────────────────
function AccountSection() {
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <div className="ds-section" id="account">
            <h2 className="ds-section-title ds-danger-title"><UserX size={20} /> Account</h2>
            <p className="ds-section-desc">Manage your account status</p>

            <div className="ds-danger-zone">
                <div className="ds-danger-card">
                    <div>
                        <span className="ds-danger-label">Export Your Data</span>
                        <span className="ds-danger-hint">Download all your data in a portable format</span>
                    </div>
                    <button type="button" className="ds-export-btn"><Download size={14} /> Export</button>
                </div>
                <div className="ds-danger-card">
                    <div>
                        <span className="ds-danger-label">Deactivate Account</span>
                        <span className="ds-danger-hint">Temporarily hide your profile. You can reactivate anytime.</span>
                    </div>
                    <button type="button" className="ds-danger-outline-btn" onClick={() => setShowDeactivate(true)}>Deactivate</button>
                </div>
                <div className="ds-danger-card">
                    <div>
                        <span className="ds-danger-label">Delete Account</span>
                        <span className="ds-danger-hint">Permanently delete your account and all data. This cannot be undone.</span>
                    </div>
                    <button type="button" className="ds-danger-btn" onClick={() => setShowDelete(true)}><Trash2 size={14} /> Delete</button>
                </div>
            </div>

            {/* Destructive action modal */}
            {(showDeactivate || showDelete) && (
                <div className="ds-modal-overlay" onClick={() => { setShowDeactivate(false); setShowDelete(false); }}>
                    <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ds-modal-icon"><AlertTriangle size={28} /></div>
                        <h3>{showDelete ? "Delete Account?" : "Deactivate Account?"}</h3>
                        <p>{showDelete
                            ? "This action is permanent and cannot be undone. All your data, appointments, and records will be permanently removed."
                            : "Your profile will be hidden from patients. You can reactivate your account by logging in again."
                        }</p>
                        <div className="ds-modal-actions">
                            <button type="button" className="ds-cancel-btn" onClick={() => { setShowDeactivate(false); setShowDelete(false); }}>Cancel</button>
                            <button type="button" className={showDelete ? "ds-danger-btn" : "ds-danger-outline-btn"}>
                                {showDelete ? "Yes, Delete Permanently" : "Yes, Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ────────────────────────── MAIN PAGE ──────────────────────────
export default function DoctorSettingsPage() {
    const [dirty, setDirty] = useState(false);
    const [saved, setSaved] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const handler = () => setDirty(true);
        const el = contentRef.current;
        if (el) {
            el.addEventListener("input", handler);
            el.addEventListener("change", handler);
        }
        return () => {
            if (el) {
                el.removeEventListener("input", handler);
                el.removeEventListener("change", handler);
            }
        };
    }, []);

    const handleSave = async () => {
        setSaved(false);
        setDirty(false);

        const el = contentRef.current;
        if (!el) return;

        // Collect data from uncontrolled inputs in the Profile section
        const profileSection = el.querySelector("#profile");
        const nameInput = profileSection?.querySelector('input[type="text"]');
        const phoneInput = profileSection?.querySelector('input[type="tel"]');
        const genderSelect = profileSection?.querySelector("select");
        const dobInput = profileSection?.querySelector('input[type="date"]');
        const bioTextarea = profileSection?.querySelector("textarea");
        const photoInput = profileSection?.querySelector('input[type="file"]');

        const profileData = {};
        if (nameInput?.value) profileData.name = nameInput.value;
        if (phoneInput?.value) profileData.phone = phoneInput.value;
        if (genderSelect?.value) profileData.gender = genderSelect.value.toUpperCase();
        if (dobInput?.value) profileData.dob = dobInput.value;
        if (bioTextarea?.value) profileData.bio = bioTextarea.value;

        const formData = new FormData();
        formData.append("profile", new Blob([JSON.stringify(profileData)], { type: "application/json" }));

        if (photoInput?.files?.[0]) {
            formData.append("profileImage", photoInput.files[0]);
        }

        try {
            const { API_BASE_URL } = await import("@/lib/config");
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            } else {
                alert(data.message || "Failed to save profile. Please try again.");
            }
        } catch {
            alert("Unable to connect to the server. Please try again.");
        }
    };

    return (
        <div className="ds-page">
            <div className="ds-content" ref={contentRef}>
                <ProfileSection />
                <ProfessionalSection />
                <ClinicSection />
                <AvailabilitySection />
                <ConsultationSection />
                <NotificationsSection />
                <DocumentsSection />
                <SecuritySection />
                <PrivacySection />
                <AccountSection />
            </div>

            {/* Sticky Save Bar */}
            <div className={`ds-save-bar ${dirty || saved ? "visible" : ""}`}>
                <div className="ds-save-bar-inner">
                    {saved ? (
                        <span className="ds-saved-msg"><CheckCircle2 size={16} /> Changes saved successfully!</span>
                    ) : (
                        <>
                            <span className="ds-unsaved-msg">You have unsaved changes</span>
                            <div className="ds-save-actions">
                                <button type="button" className="ds-discard-btn" onClick={() => setDirty(false)}><RotateCcw size={14} /> Discard</button>
                                <button type="button" className="ds-save-btn" onClick={handleSave}><Save size={14} /> Save Changes</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
