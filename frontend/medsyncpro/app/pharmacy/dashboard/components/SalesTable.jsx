"use client";
import { useState, useEffect } from "react";
import {
    Search, SlidersHorizontal, ChevronDown, FileText, MoreVertical,
} from "lucide-react";
import { fetchPharmacyPrescriptions } from "@/actions/pharmacyAction";

const avatarColors = ["#6dd5a1", "#f9b572", "#a78bfa"];

export default function PrescriptionsTable() {
    const [currentPage, setCurrentPage] = useState(0);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const loadPrescriptions = async () => {
            setLoading(true);
            const res = await fetchPharmacyPrescriptions(currentPage, 10);
            if (res.success && res.data) {
                setPrescriptions(res.data.content || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalElements(res.data.totalElements || 0);
            }
            setLoading(false);
        };
        loadPrescriptions();
    }, [currentPage]);

    return (
        <div className="pharm-glass-card pharm-table-card">
            {/* Header */}
            <div className="pharm-table-header">
                <h3 className="pharm-chart-title">Recent Prescriptions</h3>
                <div className="pharm-table-controls">
                    <div className="pharm-table-search">
                        <Search size={14} />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <button className="pharm-filter-btn">
                        <SlidersHorizontal size={14} />
                        <span>Filter</span>
                        <ChevronDown size={12} />
                    </button>
                    <button className="pharm-filter-btn">
                        <span>Shot By</span>
                        <ChevronDown size={12} />
                    </button>
                    <button className="pharm-stat-menu">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="pharm-table-wrap">
                <table className="pharm-table">
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Patient</th>
                            <th>Prescription Info</th>
                            <th>Notes</th>
                            <th>
                                Date <ChevronDown size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                            </th>
                            <th style={{ width: 50 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
                        ) : prescriptions.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No prescriptions found</td></tr>
                        ) : (
                            prescriptions.map((row, idx) => {
                                let meds = "";
                                try {
                                    const parsed = row.medicines ? JSON.parse(row.medicines) : [];
                                    meds = Array.isArray(parsed) ? parsed.map(m => typeof m === 'object' ? m.name || JSON.stringify(m) : m).join(", ") : row.medicines;
                                } catch {
                                    meds = row.medicines;
                                }

                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <div className="pharm-table-user">
                                                <div
                                                    className="pharm-table-avatar"
                                                    style={{ background: avatarColors[idx % avatarColors.length] }}
                                                >
                                                    {row.doctorName?.substring(0, 2).toUpperCase() || "DR"}
                                                </div>
                                                <span>Dr. {row.doctorName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{row.patientName}</span>
                                                <span style={{ fontSize: '0.8em', color: '#888' }}>{row.patientEmail}</span>
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {meds || "No specific medicines listed"}
                                        </td>
                                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.notes || "-"}
                                        </td>
                                        <td>{row.appointmentDate ? new Date(row.appointmentDate).toLocaleDateString() : "-"}</td>
                                        <td>
                                            <div className="pharm-table-actions">
                                                <button className="pharm-action-btn"><FileText size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pharm-pagination">
                <div className="pharm-page-buttons">
                    <button className="pharm-page-btn" disabled={currentPage === 0} onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}>
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                        <button
                            key={p}
                            className={`pharm-page-btn ${p === currentPage ? "active" : ""}`}
                            onClick={() => setCurrentPage(p)}
                        >
                            {p + 1}
                        </button>
                    ))}
                    <button className="pharm-page-btn" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}>
                        Next
                    </button>
                </div>
                <div className="pharm-page-info">
                    <span>Showing total of {totalElements} Prescriptions</span>
                </div>
            </div>
        </div>
    );
}
