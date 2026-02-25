"use client";
import { Plus, FileText, Clock, Pill } from "lucide-react";

const recent = [
    { patient: "Sarah Johnson", drug: "Amlodipine 5mg", date: "Today", status: "Active" },
    { patient: "Michael Chen", drug: "Aspirin 75mg, Atorvastatin 20mg", date: "Today", status: "Active" },
    { patient: "Emma Wilson", drug: "Metoprolol 25mg", date: "Feb 20", status: "Active" },
    { patient: "James Brown", drug: "Furosemide 40mg, Enalapril 10mg", date: "Feb 18", status: "Refill" },
];

const templates = [
    { name: "Hypertension Standard", drugs: 3, icon: "💊" },
    { name: "Post-Surgery Recovery", drugs: 5, icon: "🩹" },
    { name: "Cardiac Maintenance", drugs: 4, icon: "❤️" },
];

export default function PrescriptionPanel() {
    return (
        <div className="doc-glass-card doc-rx-panel">
            <div className="doc-card-header">
                <h3>Prescriptions</h3>
                <button className="doc-rx-create-btn"><Plus size={14} /> Create New</button>
            </div>

            {/* Recent */}
            <div className="doc-rx-section">
                <h4 className="doc-rx-subtitle"><FileText size={14} /> Recent Prescriptions</h4>
                <div className="doc-rx-list">
                    {recent.map((r, i) => (
                        <div key={i} className="doc-rx-item">
                            <div className="doc-rx-item-info">
                                <div className="doc-rx-patient">{r.patient}</div>
                                <div className="doc-rx-drug"><Pill size={11} /> {r.drug}</div>
                            </div>
                            <div className="doc-rx-item-meta">
                                <span className={`doc-rx-status ${r.status.toLowerCase()}`}>{r.status}</span>
                                <span className="doc-rx-date"><Clock size={11} /> {r.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Templates */}
            <div className="doc-rx-section">
                <h4 className="doc-rx-subtitle">Quick Templates</h4>
                <div className="doc-rx-templates">
                    {templates.map((t, i) => (
                        <button key={i} className="doc-rx-template">
                            <span className="doc-rx-template-icon">{t.icon}</span>
                            <span className="doc-rx-template-name">{t.name}</span>
                            <span className="doc-rx-template-count">{t.drugs} drugs</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
