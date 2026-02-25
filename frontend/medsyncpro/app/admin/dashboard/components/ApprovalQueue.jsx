"use client";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const approvals = [
    { name: "Dr. David Kim", role: "Doctor", submitted: "Feb 23, 2026", avatar: "DK", color: "#6366f1", doc: "Medical License" },
    { name: "Dr. Aisha Patel", role: "Doctor", submitted: "Feb 24, 2026", avatar: "AP", color: "#0d9488", doc: "Board Certification" },
    { name: "HealthFirst Drugs", role: "Pharmacist", submitted: "Feb 22, 2026", avatar: "HF", color: "#f59e0b", doc: "Pharmacy License" },
    { name: "QuickMeds Store", role: "Pharmacist", submitted: "Feb 25, 2026", avatar: "QM", color: "#8b5cf6", doc: "Business Permit" },
];

export default function ApprovalQueue() {
    return (
        <div className="admin-glass-card admin-approval-queue">
            <div className="admin-approval-header">
                <h3>Approval Queue</h3>
                <span className="admin-approval-count">{approvals.length} pending</span>
            </div>
            <div className="admin-approval-list">
                {approvals.map((a, i) => (
                    <div key={i} className="admin-approval-item">
                        <div className="admin-approval-avatar" style={{ background: a.color }}>
                            {a.avatar}
                        </div>
                        <div className="admin-approval-info">
                            <div className="admin-approval-name">{a.name}</div>
                            <div className="admin-approval-meta">
                                <span className="admin-approval-role">{a.role}</span>
                                <span className="admin-approval-doc">{a.doc}</span>
                            </div>
                            <div className="admin-approval-date">
                                <Clock size={11} />
                                <span>{a.submitted}</span>
                            </div>
                        </div>
                        <div className="admin-approval-actions">
                            <button className="admin-approve-btn" title="Approve">
                                <CheckCircle size={18} />
                            </button>
                            <button className="admin-reject-btn" title="Reject">
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
