"use client";
import { useState } from "react";
import {
    Search, SlidersHorizontal, Eye, Pencil, Ban, CheckCircle, ChevronDown,
} from "lucide-react";

const patientsData = [
    { id: 1, name: "Sarah Johnson", age: 34, condition: "Diabetes Type 2", status: "Active", verified: true, lastActivity: "2 hours ago" },
    { id: 2, name: "Michael Chen", age: 45, condition: "Hypertension", status: "Active", verified: true, lastActivity: "5 hours ago" },
    { id: 3, name: "Emma Wilson", age: 28, condition: "Asthma", status: "Inactive", verified: false, lastActivity: "3 days ago" },
    { id: 4, name: "James Brown", age: 52, condition: "Arthritis", status: "Active", verified: true, lastActivity: "1 hour ago" },
    { id: 5, name: "Lisa Anderson", age: 39, condition: "Migraine", status: "Active", verified: true, lastActivity: "30 mins ago" },
];

const doctorsData = [
    { id: 1, name: "Dr. Emily Roberts", specialty: "Cardiology", experience: "12 yrs", verification: "Verified", availability: "Available" },
    { id: 2, name: "Dr. David Kim", specialty: "Neurology", experience: "8 yrs", verification: "Pending", availability: "On Leave" },
    { id: 3, name: "Dr. Maria Garcia", specialty: "Pediatrics", experience: "15 yrs", verification: "Verified", availability: "Available" },
    { id: 4, name: "Dr. John Smith", specialty: "Orthopedics", experience: "10 yrs", verification: "Verified", availability: "Available" },
    { id: 5, name: "Dr. Aisha Patel", specialty: "Dermatology", experience: "6 yrs", verification: "Pending", availability: "Available" },
];

const pharmacistsData = [
    { id: 1, name: "MedPlus Pharmacy", license: "Active", verification: "Verified", orders: 1245 },
    { id: 2, name: "HealthFirst Drugs", license: "Pending Renewal", verification: "Pending", orders: 890 },
    { id: 3, name: "CareWell Pharmacy", license: "Active", verification: "Verified", orders: 2100 },
    { id: 4, name: "QuickMeds Store", license: "Active", verification: "Verified", orders: 675 },
    { id: 5, name: "TrustRx Pharmacy", license: "Expired", verification: "Rejected", orders: 430 },
];

const avatarColors = ["#0d9488", "#6366f1", "#8b5cf6", "#0891b2", "#059669", "#f59e0b"];

const tabs = [
    { key: "patients", label: "Patients", count: 12845 },
    { key: "doctors", label: "Doctors", count: 1234 },
    { key: "pharmacists", label: "Pharmacists", count: 856 },
];

export default function RoleManagement() {
    const [activeTab, setActiveTab] = useState("patients");

    return (
        <div className="admin-glass-card admin-role-section">
            {/* Tabs */}
            <div className="admin-role-header">
                <div className="admin-role-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`admin-role-tab ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            <span className="admin-tab-count">{tab.count.toLocaleString()}</span>
                        </button>
                    ))}
                </div>
                <div className="admin-role-controls">
                    <div className="admin-role-search">
                        <Search size={14} />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <button className="admin-filter-pill">
                        <SlidersHorizontal size={14} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                {activeTab === "patients" && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Condition</th>
                                <th>Status</th>
                                <th>Verified</th>
                                <th>Last Activity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientsData.map((row, idx) => (
                                <tr key={row.id}>
                                    <td>
                                        <div className="admin-table-user">
                                            <div className="admin-table-avatar" style={{ background: avatarColors[idx % avatarColors.length] }}>
                                                {row.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <span>{row.name}</span>
                                        </div>
                                    </td>
                                    <td>{row.age}</td>
                                    <td>{row.condition}</td>
                                    <td><span className={`admin-status-badge ${row.status.toLowerCase()}`}>{row.status}</span></td>
                                    <td><span className={`admin-status-badge ${row.verified ? "verified" : "pending"}`}>{row.verified ? "Yes" : "No"}</span></td>
                                    <td className="admin-muted">{row.lastActivity}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-action-btn" title="View"><Eye size={14} /></button>
                                            <button className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
                                            <button className="admin-action-btn admin-action-danger" title="Block"><Ban size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "doctors" && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialty</th>
                                <th>Experience</th>
                                <th>Verification</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorsData.map((row, idx) => (
                                <tr key={row.id}>
                                    <td>
                                        <div className="admin-table-user">
                                            <div className="admin-table-avatar" style={{ background: avatarColors[idx % avatarColors.length] }}>
                                                {row.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <span>{row.name}</span>
                                        </div>
                                    </td>
                                    <td>{row.specialty}</td>
                                    <td>{row.experience}</td>
                                    <td><span className={`admin-status-badge ${row.verification.toLowerCase()}`}>{row.verification}</span></td>
                                    <td><span className={`admin-status-badge ${row.availability === "Available" ? "active" : row.availability === "On Leave" ? "inactive" : ""}`}>{row.availability}</span></td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-action-btn" title="View"><Eye size={14} /></button>
                                            <button className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
                                            {row.verification === "Pending" && <button className="admin-action-btn admin-action-approve" title="Approve"><CheckCircle size={14} /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "pharmacists" && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Pharmacy Name</th>
                                <th>License</th>
                                <th>Verification</th>
                                <th>Orders Handled</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pharmacistsData.map((row, idx) => (
                                <tr key={row.id}>
                                    <td>
                                        <div className="admin-table-user">
                                            <div className="admin-table-avatar" style={{ background: avatarColors[idx % avatarColors.length] }}>
                                                {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <span>{row.name}</span>
                                        </div>
                                    </td>
                                    <td><span className={`admin-status-badge ${row.license === "Active" ? "active" : row.license === "Expired" ? "rejected" : "pending"}`}>{row.license}</span></td>
                                    <td><span className={`admin-status-badge ${row.verification.toLowerCase()}`}>{row.verification}</span></td>
                                    <td>{row.orders.toLocaleString()}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-action-btn" title="View"><Eye size={14} /></button>
                                            <button className="admin-action-btn" title="Edit"><Pencil size={14} /></button>
                                            {row.verification === "Pending" && <button className="admin-action-btn admin-action-approve" title="Approve"><CheckCircle size={14} /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="admin-pagination">
                <div className="admin-page-btns">
                    {["Prev", 1, 2, 3, "...", 10, "Next"].map((p, i) => (
                        <button key={i} className={`admin-page-btn ${p === 1 ? "active" : ""} ${typeof p === "string" && p === "..." ? "dots" : ""}`}>
                            {p}
                        </button>
                    ))}
                </div>
                <span className="admin-page-info">Showing 1–5 of 12,845</span>
            </div>
        </div>
    );
}
