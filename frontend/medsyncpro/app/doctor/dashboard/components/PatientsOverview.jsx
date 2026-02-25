"use client";
import { Search, Eye, Pencil, SlidersHorizontal } from "lucide-react";

const patients = [
    { name: "Sarah Johnson", age: 34, condition: "Hypertension", lastVisit: "Today", status: "Active", avatar: "SJ", color: "#0d9488" },
    { name: "Michael Chen", age: 45, condition: "Coronary Artery Disease", lastVisit: "Today", status: "Active", avatar: "MC", color: "#2563eb" },
    { name: "Emma Wilson", age: 28, condition: "Arrhythmia", lastVisit: "Feb 20", status: "Active", avatar: "EW", color: "#8b5cf6" },
    { name: "James Brown", age: 52, condition: "Heart Failure", lastVisit: "Feb 18", status: "Critical", avatar: "JB", color: "#ef4444" },
    { name: "Lisa Anderson", age: 39, condition: "Hyperlipidemia", lastVisit: "Feb 15", status: "Stable", avatar: "LA", color: "#059669" },
    { name: "Robert Taylor", age: 61, condition: "Post-CABG Recovery", lastVisit: "Feb 12", status: "Follow-up", avatar: "RT", color: "#f59e0b" },
];

export default function PatientsOverview() {
    return (
        <div className="doc-glass-card doc-patients-card">
            <div className="doc-card-header">
                <h3>My Patients</h3>
                <div className="doc-patients-controls">
                    <div className="doc-mini-search">
                        <Search size={13} />
                        <input placeholder="Search..." />
                    </div>
                    <button className="doc-filter-pill"><SlidersHorizontal size={13} /> Filter</button>
                </div>
            </div>
            <div className="doc-patients-table-wrap">
                <table className="doc-patients-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Age</th>
                            <th>Condition</th>
                            <th>Last Visit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p, i) => (
                            <tr key={i}>
                                <td>
                                    <div className="doc-table-user">
                                        <div className="doc-table-avatar" style={{ background: p.color }}>{p.avatar}</div>
                                        <span>{p.name}</span>
                                    </div>
                                </td>
                                <td>{p.age}</td>
                                <td>{p.condition}</td>
                                <td className="doc-muted">{p.lastVisit}</td>
                                <td>
                                    <span className={`doc-status-badge ${p.status.toLowerCase().replace("-", "")}`}>{p.status}</span>
                                </td>
                                <td>
                                    <div className="doc-tbl-actions">
                                        <button className="doc-tbl-btn" title="View"><Eye size={14} /></button>
                                        <button className="doc-tbl-btn" title="Edit"><Pencil size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
