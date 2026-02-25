"use client";
import "./settings.css";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Settings, Shield, Users, CheckCircle2, Calendar, Pill, Bell, Plug, Lock,
  Flag, FileText, CreditCard, Save, X, ChevronRight, Upload, Eye, EyeOff,
  RefreshCw, Trash2, Plus, ToggleLeft, ToggleRight, Download, Search,
  Globe, Mail, Clock, Monitor, Heart, Zap, AlertTriangle, Check, Copy,
  Server, Database, Cloud, Key, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

/* ─── MOCK DATA ─── */
const INITIAL_GENERAL = { platformName: "MedSyncPro", supportEmail: "support@medsyncpro.com", language: "en", timezone: "America/New_York", maintenanceMode: false };
const ROLES = [
  { id: "admin", name: "Admin", desc: "Full system access", color: "#ef4444", perms: { dashboard: true, users: true, doctors: true, pharmacists: true, appointments: true, prescriptions: true, payments: true, reports: true, settings: true, audit: true } },
  { id: "doctor", name: "Doctor", desc: "Medical operations", color: "#0891b2", perms: { dashboard: true, users: false, doctors: false, pharmacists: false, appointments: true, prescriptions: true, payments: false, reports: true, settings: false, audit: false } },
  { id: "pharmacist", name: "Pharmacist", desc: "Pharmacy operations", color: "#8b5cf6", perms: { dashboard: true, users: false, doctors: false, pharmacists: false, appointments: false, prescriptions: true, payments: true, reports: true, settings: false, audit: false } },
  { id: "patient", name: "Patient", desc: "Basic access", color: "#10b981", perms: { dashboard: true, users: false, doctors: false, pharmacists: false, appointments: true, prescriptions: true, payments: true, reports: false, settings: false, audit: false } },
];
const PERM_LABELS = { dashboard: "Dashboard", users: "User Management", doctors: "Doctor Management", pharmacists: "Pharmacist Management", appointments: "Appointments", prescriptions: "Prescriptions", payments: "Payments", reports: "Reports", settings: "Settings", audit: "Audit Logs" };

const VERIF_RULES = { doctorDocs: ["Medical License", "Board Certification", "ID Proof", "DEA Registration"], pharmacistDocs: ["Pharmacy License", "State Certification", "ID Proof", "Compliance Certificate"], autoApproval: false, reVerifyMonths: 12 };

const APPT_RULES = { defaultDuration: 30, cancellationWindow: 24, rescheduleLimit: 3, autoReminder: true, reminderHours: 2, noShowPolicy: "warn" };
const RX_RULES = { expiryDays: 30, refillLimit: 3, controlledRestricted: true, templateEnabled: true };

const NOTIF_EVENTS = [
  { id: "new_user", label: "New User Registration", email: true, push: true, admin: true },
  { id: "verification", label: "Verification Request", email: true, push: true, admin: true },
  { id: "appointment", label: "Appointment Booked", email: true, push: true, admin: false },
  { id: "cancellation", label: "Appointment Cancelled", email: true, push: false, admin: true },
  { id: "prescription", label: "Prescription Issued", email: true, push: true, admin: false },
  { id: "payment", label: "Payment Received", email: true, push: false, admin: false },
  { id: "flag", label: "Account Flagged", email: true, push: true, admin: true },
];

const INTEGRATIONS = [
  { id: "firebase", name: "Firebase", desc: "Push notifications & auth", icon: Zap, status: "connected", color: "#f59e0b" },
  { id: "smtp", name: "SMTP Email", desc: "Transactional email delivery", icon: Mail, status: "connected", color: "#10b981" },
  { id: "stripe", name: "Stripe", desc: "Payment processing", icon: CreditCard, status: "disconnected", color: "#6366f1" },
  { id: "aws", name: "AWS S3", desc: "File & document storage", icon: Cloud, status: "connected", color: "#0891b2" },
];

const SEC_SETTINGS = { minPassword: 8, require2FA: false, sessionTimeout: 30, loginMethods: ["email", "google"], ipAllowlist: "" };

const FEATURE_FLAGS = [
  { id: "telemedicine", label: "Telemedicine Module", desc: "Video consultations", enabled: true, rollout: 100 },
  { id: "ai_chat", label: "AI Health Assistant", desc: "AI-powered chat for patients", enabled: false, rollout: 0 },
  { id: "pharmacy_delivery", label: "Pharmacy Delivery", desc: "Home delivery of medications", enabled: true, rollout: 80 },
  { id: "lab_integration", label: "Lab Results Integration", desc: "Sync with diagnostic labs", enabled: false, rollout: 0 },
  { id: "dark_mode", label: "Dark Mode", desc: "Dark theme for all users", enabled: false, rollout: 25 },
  { id: "referral_program", label: "Referral Program", desc: "Patient referral rewards", enabled: true, rollout: 100 },
];

const AUDIT_LOGS = [
  { id: 1, action: "Settings Updated", user: "Admin User", target: "General Settings", time: "2 hours ago", type: "settings" },
  { id: 2, action: "User Suspended", user: "Admin User", target: "Marcus Williams", time: "5 hours ago", type: "user" },
  { id: 3, action: "Doctor Verified", user: "Admin User", target: "Dr. Sarah Zhang", time: "1 day ago", type: "verification" },
  { id: 4, action: "Role Updated", user: "Admin User", target: "Pharmacist Role", time: "2 days ago", type: "role" },
  { id: 5, action: "Feature Flag Changed", user: "Admin User", target: "AI Health Assistant", time: "3 days ago", type: "feature" },
  { id: 6, action: "Integration Connected", user: "Admin User", target: "AWS S3 Storage", time: "5 days ago", type: "integration" },
  { id: 7, action: "Security Policy Updated", user: "Admin User", target: "Password Policy", time: "1 week ago", type: "security" },
  { id: 8, action: "User Approved", user: "Admin User", target: "Dr. Liam Patel", time: "1 week ago", type: "verification" },
];

const SECTION_TITLES = {
  general: { icon: Settings, title: "General Settings", desc: "Core platform configuration" },
  roles: { icon: Users, title: "Roles & Permissions", desc: "Manage user roles and access control" },
  verification: { icon: CheckCircle2, title: "User Verification Rules", desc: "Configure verification workflows for doctors and pharmacists" },
  appointments: { icon: Calendar, title: "Appointment Rules", desc: "Configure scheduling and policies" },
  prescriptions: { icon: Pill, title: "Prescription Rules", desc: "Manage prescription policies and templates" },
  notifications: { icon: Bell, title: "Notification Settings", desc: "Configure notification channels per event" },
  integrations: { icon: Plug, title: "Integrations", desc: "Manage connected services and APIs" },
  security: { icon: Lock, title: "Security Settings", desc: "Configure authentication and access policies" },
  features: { icon: Flag, title: "Feature Flags", desc: "Enable or disable platform features with gradual rollout" },
  audit: { icon: FileText, title: "Audit Logs", desc: "Track all admin actions and changes" },
  billing: { icon: CreditCard, title: "Billing & Subscription", desc: "Manage platform billing and subscriptions" },
  system: { icon: Monitor, title: "System Preferences", desc: "Advanced system configuration" },
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
function SettingsContent() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "general";
  const [isDirty, setIsDirty] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [general, setGeneral] = useState(INITIAL_GENERAL);
  const [roles, setRoles] = useState(ROLES);
  const [verif, setVerif] = useState(VERIF_RULES);
  const [appt, setAppt] = useState(APPT_RULES);
  const [rx, setRx] = useState(RX_RULES);
  const [notifs, setNotifs] = useState(NOTIF_EVENTS);
  const [sec, setSec] = useState(SEC_SETTINGS);
  const [features, setFeatures] = useState(FEATURE_FLAGS);
  const [auditFilter, setAuditFilter] = useState("all");

  const markDirty = () => { setIsDirty(true); setSaveMsg(""); };
  const handleSave = () => { setIsDirty(false); setSaveMsg("Settings saved successfully!"); setTimeout(() => setSaveMsg(""), 3000); };

  const updateGeneral = (k, v) => { setGeneral(p => ({ ...p, [k]: v })); markDirty(); };
  const togglePerm = (roleId, perm) => { setRoles(prev => prev.map(r => r.id === roleId ? { ...r, perms: { ...r.perms, [perm]: !r.perms[perm] } } : r)); markDirty(); };
  const updateAppt = (k, v) => { setAppt(p => ({ ...p, [k]: v })); markDirty(); };
  const updateRx = (k, v) => { setRx(p => ({ ...p, [k]: v })); markDirty(); };
  const toggleNotif = (id, ch) => { setNotifs(prev => prev.map(n => n.id === id ? { ...n, [ch]: !n[ch] } : n)); markDirty(); };
  const updateSec = (k, v) => { setSec(p => ({ ...p, [k]: v })); markDirty(); };
  const toggleFeature = (id) => { setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)); markDirty(); };
  const updateRollout = (id, v) => { setFeatures(prev => prev.map(f => f.id === id ? { ...f, rollout: Number(v) } : f)); markDirty(); };

  const sectionMeta = SECTION_TITLES[activeSection] || SECTION_TITLES.general;
  const SectionIcon = sectionMeta.icon;

  return (
    <div className="as-page">
      {/* Header */}
      <div className="as-header">
        <div>
          <h1 className="as-title"><Settings size={28} style={{ color: "#0d9488" }} /> Settings</h1>
          <p className="as-subtitle">Configure platform settings, security, and integrations</p>
        </div>
      </div>

      {/* Section header */}
      <div className="as-section-header">
        <h2><SectionIcon size={20} /> {sectionMeta.title}</h2>
        <p>{sectionMeta.desc}</p>
      </div>

      {/* Content */}
      <div className="as-content">
        {activeSection === "general" && <GeneralSection data={general} update={updateGeneral} />}
        {activeSection === "roles" && <RolesSection roles={roles} togglePerm={togglePerm} />}
        {activeSection === "verification" && <VerificationSection data={verif} update={(k, v) => { setVerif(p => ({ ...p, [k]: v })); markDirty(); }} />}
        {activeSection === "appointments" && <AppointmentSection data={appt} update={updateAppt} />}
        {activeSection === "prescriptions" && <PrescriptionSection data={rx} update={updateRx} />}
        {activeSection === "notifications" && <NotifSection data={notifs} toggle={toggleNotif} />}
        {activeSection === "integrations" && <IntegrationSection />}
        {activeSection === "security" && <SecuritySection data={sec} update={updateSec} />}
        {activeSection === "features" && <FeatureFlagsSection data={features} toggle={toggleFeature} updateRollout={updateRollout} />}
        {activeSection === "audit" && <AuditSection filter={auditFilter} setFilter={setAuditFilter} />}
        {activeSection === "billing" && <BillingSection />}
        {activeSection === "system" && <SystemSection />}
      </div>

      {/* Sticky Save Bar */}
      {(isDirty || saveMsg) && (
        <div className={`as-save-bar ${saveMsg ? "success" : ""}`}>
          {saveMsg ? (
            <><Check size={16} /> {saveMsg}</>
          ) : (
            <>
              <span><AlertTriangle size={14} /> You have unsaved changes</span>
              <div className="as-save-actions">
                <button className="as-discard" onClick={() => { setIsDirty(false); setGeneral(INITIAL_GENERAL); setRoles(ROLES); setAppt(APPT_RULES); setRx(RX_RULES); setNotifs(NOTIF_EVENTS); setSec(SEC_SETTINGS); setFeatures(FEATURE_FLAGS); }}><X size={14} /> Discard</button>
                <button className="as-save" onClick={handleSave}><Save size={14} /> Save Changes</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="as-page"><p>Loading...</p></div>}>
      <SettingsContent />
    </Suspense>
  );
}

/* ═══════════════ SECTION COMPONENTS ═══════════════ */

/* ─── General ─── */
function GeneralSection({ data, update }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-form-grid">
          <div className="as-field"><label>Platform Name</label><input type="text" value={data.platformName} onChange={e => update("platformName", e.target.value)} /></div>
          <div className="as-field"><label>Support Email</label><input type="email" value={data.supportEmail} onChange={e => update("supportEmail", e.target.value)} /></div>
          <div className="as-field"><label>Default Language</label>
            <select value={data.language} onChange={e => update("language", e.target.value)}>
              <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option>
            </select>
          </div>
          <div className="as-field"><label>Timezone</label>
            <select value={data.timezone} onChange={e => update("timezone", e.target.value)}>
              <option value="America/New_York">Eastern (ET)</option><option value="America/Chicago">Central (CT)</option><option value="America/Denver">Mountain (MT)</option><option value="America/Los_Angeles">Pacific (PT)</option><option value="Asia/Kolkata">India (IST)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <h3>Branding</h3>
        <div className="as-upload-area"><Upload size={24} /><p>Drag & drop your logo here</p><span>PNG, SVG, or JPG — max 2MB</span></div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row">
          <div><h3>Maintenance Mode</h3><p className="as-toggle-desc">When enabled, only admins can access the platform</p></div>
          <button className={`as-toggle ${data.maintenanceMode ? "on" : ""}`} onClick={() => update("maintenanceMode", !data.maintenanceMode)}>
            {data.maintenanceMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Roles & Permissions ─── */
function RolesSection({ roles, togglePerm }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-roles-list">
          {roles.map(r => (
            <div key={r.id} className="as-role-chip" style={{ borderColor: r.color + "40" }}>
              <div className="as-role-dot" style={{ background: r.color }}></div>
              <div><strong>{r.name}</strong><span>{r.desc}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="as-card admin-glass-card as-perm-card">
        <h3>Permission Matrix</h3>
        <div className="as-perm-table-wrap">
          <table className="as-perm-table">
            <thead>
              <tr><th>Module</th>{roles.map(r => <th key={r.id} style={{ color: r.color }}>{r.name}</th>)}</tr>
            </thead>
            <tbody>
              {Object.entries(PERM_LABELS).map(([k, label]) => (
                <tr key={k}>
                  <td className="as-perm-label">{label}</td>
                  {roles.map(r => (
                    <td key={r.id} className="as-perm-cell">
                      <button className={`as-perm-toggle ${r.perms[k] ? "on" : ""}`} onClick={() => r.id !== "admin" && togglePerm(r.id, k)} disabled={r.id === "admin"}>
                        {r.perms[k] ? <Check size={14} /> : <X size={14} />}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Verification ─── */
function VerificationSection({ data, update }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <h3>Doctor Verification Documents</h3>
        <div className="as-doc-list">{data.doctorDocs.map((d, i) => <div key={i} className="as-doc-item"><CheckCircle2 size={14} style={{ color: "#10b981" }} /><span>{d}</span></div>)}</div>
      </div>
      <div className="as-card admin-glass-card">
        <h3>Pharmacist Verification Documents</h3>
        <div className="as-doc-list">{data.pharmacistDocs.map((d, i) => <div key={i} className="as-doc-item"><CheckCircle2 size={14} style={{ color: "#0891b2" }} /><span>{d}</span></div>)}</div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>Auto-Approval</h3><p className="as-toggle-desc">Automatically approve users when all documents are verified</p></div>
          <button className={`as-toggle ${data.autoApproval ? "on" : ""}`} onClick={() => update("autoApproval", !data.autoApproval)}>{data.autoApproval ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-form-grid"><div className="as-field"><label>Re-Verification Period (months)</label><input type="number" value={data.reVerifyMonths} onChange={e => update("reVerifyMonths", Number(e.target.value))} /></div></div>
      </div>
      <div className="as-card admin-glass-card as-workflow-preview">
        <h3>Verification Workflow</h3>
        <div className="as-workflow-steps">
          {["User Registers", "Documents Uploaded", "Admin Review", data.autoApproval ? "Auto-Approved" : "Manual Approval", "Account Active"].map((s, i) => (
            <div key={i} className="as-wf-step"><div className="as-wf-num">{i + 1}</div><span>{s}</span>{i < 4 && <ChevronRight size={14} className="as-wf-arrow" />}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Appointments ─── */
function AppointmentSection({ data, update }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-form-grid">
          <div className="as-field"><label>Default Duration (min)</label><input type="number" value={data.defaultDuration} onChange={e => update("defaultDuration", Number(e.target.value))} /></div>
          <div className="as-field"><label>Cancellation Window (hrs)</label><input type="number" value={data.cancellationWindow} onChange={e => update("cancellationWindow", Number(e.target.value))} /></div>
          <div className="as-field"><label>Reschedule Limit</label><input type="number" value={data.rescheduleLimit} onChange={e => update("rescheduleLimit", Number(e.target.value))} /></div>
          <div className="as-field"><label>Reminder Before (hrs)</label><input type="number" value={data.reminderHours} onChange={e => update("reminderHours", Number(e.target.value))} /></div>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>Auto Reminders</h3><p className="as-toggle-desc">Send appointment reminders automatically</p></div>
          <button className={`as-toggle ${data.autoReminder ? "on" : ""}`} onClick={() => update("autoReminder", !data.autoReminder)}>{data.autoReminder ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-field"><label>No-Show Policy</label>
          <select value={data.noShowPolicy} onChange={e => update("noShowPolicy", e.target.value)}>
            <option value="warn">Warn patient</option><option value="charge">Charge cancellation fee</option><option value="block">Block after 3 no-shows</option><option value="none">No action</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ─── Prescriptions ─── */
function PrescriptionSection({ data, update }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-form-grid">
          <div className="as-field"><label>Prescription Expiry (days)</label><input type="number" value={data.expiryDays} onChange={e => update("expiryDays", Number(e.target.value))} /></div>
          <div className="as-field"><label>Refill Limit</label><input type="number" value={data.refillLimit} onChange={e => update("refillLimit", Number(e.target.value))} /></div>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>Controlled Substances Restrictions</h3><p className="as-toggle-desc">Require additional verification for controlled substances</p></div>
          <button className={`as-toggle ${data.controlledRestricted ? "on" : ""}`} onClick={() => update("controlledRestricted", !data.controlledRestricted)}>{data.controlledRestricted ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>Prescription Templates</h3><p className="as-toggle-desc">Enable standardized prescription templates for doctors</p></div>
          <button className={`as-toggle ${data.templateEnabled ? "on" : ""}`} onClick={() => update("templateEnabled", !data.templateEnabled)}>{data.templateEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Notifications ─── */
function NotifSection({ data, toggle }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card as-notif-card">
        <div className="as-notif-table-wrap">
          <table className="as-notif-table">
            <thead><tr><th>Event</th><th><Mail size={14} /> Email</th><th><Zap size={14} /> Push</th><th><Shield size={14} /> Admin Alert</th></tr></thead>
            <tbody>
              {data.map(n => (
                <tr key={n.id}>
                  <td className="as-notif-label">{n.label}</td>
                  <td className="as-notif-cell"><button className={`as-perm-toggle ${n.email ? "on" : ""}`} onClick={() => toggle(n.id, "email")}>{n.email ? <Check size={14} /> : <X size={14} />}</button></td>
                  <td className="as-notif-cell"><button className={`as-perm-toggle ${n.push ? "on" : ""}`} onClick={() => toggle(n.id, "push")}>{n.push ? <Check size={14} /> : <X size={14} />}</button></td>
                  <td className="as-notif-cell"><button className={`as-perm-toggle ${n.admin ? "on" : ""}`} onClick={() => toggle(n.id, "admin")}>{n.admin ? <Check size={14} /> : <X size={14} />}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Integrations ─── */
function IntegrationSection() {
  const [showKey, setShowKey] = useState({});
  return (
    <div className="as-section">
      {INTEGRATIONS.map(int => (
        <div key={int.id} className="as-card admin-glass-card as-integ-card">
          <div className="as-integ-row">
            <div className="as-integ-icon" style={{ background: int.color + "15", color: int.color }}><int.icon size={22} /></div>
            <div className="as-integ-info">
              <h3>{int.name}</h3>
              <p>{int.desc}</p>
            </div>
            <div className="as-integ-status-area">
              <span className={`as-integ-status ${int.status}`}><span className="as-integ-dot"></span>{int.status === "connected" ? "Connected" : "Disconnected"}</span>
              <button className={`as-integ-btn ${int.status === "connected" ? "disconnect" : "connect"}`}>{int.status === "connected" ? "Disconnect" : "Connect"}</button>
            </div>
          </div>
          {int.status === "connected" && (
            <div className="as-integ-key-row">
              <label>API Key</label>
              <div className="as-key-box">
                <code>{showKey[int.id] ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}` : "sk_live_••••••••••••••••••••••••"}</code>
                <button onClick={() => setShowKey(p => ({ ...p, [int.id]: !p[int.id] }))}>{showKey[int.id] ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`)}><Copy size={14} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Security ─── */
function SecuritySection({ data, update }) {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <h3>Password Policy</h3>
        <div className="as-form-grid">
          <div className="as-field"><label>Minimum Password Length</label><input type="number" value={data.minPassword} onChange={e => update("minPassword", Number(e.target.value))} /></div>
          <div className="as-field"><label>Session Timeout (min)</label><input type="number" value={data.sessionTimeout} onChange={e => update("sessionTimeout", Number(e.target.value))} /></div>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>Enforce Two-Factor Authentication</h3><p className="as-toggle-desc">Require 2FA for all admin and doctor accounts</p></div>
          <button className={`as-toggle ${data.require2FA ? "on" : ""}`} onClick={() => update("require2FA", !data.require2FA)}>{data.require2FA ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <h3>Allowed Login Methods</h3>
        <div className="as-login-methods">
          {[{ id: "email", label: "Email & Password", icon: Mail }, { id: "google", label: "Google OAuth", icon: Globe }, { id: "sso", label: "SSO / SAML", icon: Key }].map(m => (
            <label key={m.id} className="as-method-check">
              <input type="checkbox" checked={data.loginMethods.includes(m.id)} onChange={() => { const n = data.loginMethods.includes(m.id) ? data.loginMethods.filter(x => x !== m.id) : [...data.loginMethods, m.id]; update("loginMethods", n); }} />
              <m.icon size={16} /> {m.label}
            </label>
          ))}
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <h3>IP Allowlist</h3>
        <p className="as-toggle-desc">Restrict admin access to specific IP addresses (one per line)</p>
        <textarea className="as-ip-input" placeholder={"192.168.1.1\n10.0.0.0/24"} value={data.ipAllowlist} onChange={e => update("ipAllowlist", e.target.value)} rows={3} />
      </div>
    </div>
  );
}

/* ─── Feature Flags ─── */
function FeatureFlagsSection({ data, toggle, updateRollout }) {
  return (
    <div className="as-section">
      {data.map(f => (
        <div key={f.id} className="as-card admin-glass-card as-flag-card">
          <div className="as-flag-row">
            <div className="as-flag-info">
              <h3>{f.label}</h3>
              <p>{f.desc}</p>
            </div>
            <button className={`as-toggle ${f.enabled ? "on" : ""}`} onClick={() => toggle(f.id)}>{f.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}</button>
          </div>
          {f.enabled && (
            <div className="as-flag-rollout">
              <label>Rollout: <strong>{f.rollout}%</strong></label>
              <input type="range" min="0" max="100" value={f.rollout} onChange={e => updateRollout(f.id, e.target.value)} className="as-range" />
              <div className="as-rollout-bar"><div className="as-rollout-fill" style={{ width: `${f.rollout}%` }}></div></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Audit Logs ─── */
function AuditSection({ filter, setFilter }) {
  const types = ["all", "settings", "user", "verification", "role", "feature", "integration", "security"];
  const filtered = filter === "all" ? AUDIT_LOGS : AUDIT_LOGS.filter(l => l.type === filter);
  const typeColors = { settings: "#0891b2", user: "#8b5cf6", verification: "#10b981", role: "#f59e0b", feature: "#6366f1", integration: "#0d9488", security: "#ef4444" };
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-audit-toolbar">
          <div className="as-audit-filters">
            {types.map(t => <button key={t} className={`as-audit-filter ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
          </div>
          <button className="as-export-btn"><Download size={14} /> Export</button>
        </div>
        <div className="as-audit-list">
          {filtered.map(log => (
            <div key={log.id} className="as-audit-item">
              <div className="as-audit-type-dot" style={{ background: typeColors[log.type] }}></div>
              <div className="as-audit-info">
                <span className="as-audit-action">{log.action}</span>
                <span className="as-audit-target">Target: {log.target}</span>
              </div>
              <div className="as-audit-meta">
                <span className="as-audit-user">{log.user}</span>
                <span className="as-audit-time">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Billing ─── */
function BillingSection() {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-plan-card">
          <div className="as-plan-badge">Current Plan</div>
          <h3>Enterprise</h3>
          <p className="as-plan-price">$299<span>/month</span></p>
          <ul className="as-plan-features">
            <li><Check size={14} /> Unlimited users</li>
            <li><Check size={14} /> All integrations</li>
            <li><Check size={14} /> Priority support</li>
            <li><Check size={14} /> Custom branding</li>
            <li><Check size={14} /> Advanced analytics</li>
          </ul>
          <button className="as-upgrade-btn">Manage Subscription</button>
        </div>
      </div>
    </div>
  );
}

/* ─── System ─── */
function SystemSection() {
  return (
    <div className="as-section">
      <div className="as-card admin-glass-card">
        <div className="as-sys-grid">
          {[
            { icon: Server, label: "Server Status", value: "Healthy", color: "#10b981" },
            { icon: Database, label: "Database", value: "Connected", color: "#0891b2" },
            { icon: Cloud, label: "Storage Used", value: "45.2 GB / 100 GB", color: "#6366f1" },
            { icon: RefreshCw, label: "Last Backup", value: "2 hours ago", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className="as-sys-item">
              <div className="as-sys-icon" style={{ background: s.color + "15", color: s.color }}><s.icon size={20} /></div>
              <div><span className="as-sys-label">{s.label}</span><span className="as-sys-value" style={{ color: s.color }}>{s.value}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>Debug Mode</h3><p className="as-toggle-desc">Enable verbose logging for troubleshooting</p></div>
          <button className="as-toggle"><ToggleLeft size={28} /></button>
        </div>
      </div>
      <div className="as-card admin-glass-card">
        <div className="as-toggle-row"><div><h3>API Rate Limiting</h3><p className="as-toggle-desc">Restrict API calls to 100 requests/minute per user</p></div>
          <button className="as-toggle on"><ToggleRight size={28} /></button>
        </div>
      </div>
    </div>
  );
}
