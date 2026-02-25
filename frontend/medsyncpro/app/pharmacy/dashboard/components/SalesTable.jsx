"use client";
import { useState } from "react";
import {
    Search, SlidersHorizontal, ChevronDown, Pencil, Trash2, MoreVertical, Plus, Minus,
} from "lucide-react";

const salesData = [
    { id: 1, name: "Susan Williams", avatar: "SW", medicine: "Medicine Two", email: "gust@avohertiz.com", qty: 1, price: 152.0, date: "Apr 22, 2015 12:00 AM" },
    { id: 2, name: "Bentley Howard", avatar: "BH", medicine: "Test Medicine", email: "gust@avohertiz.com", qty: 1, price: 196.0, date: "Apr 22, 2015 12:00 AM" },
    { id: 3, name: "Evelyn Johnson", avatar: "EJ", medicine: "Medicine One", email: "gust@avohertiz.com", qty: 1, price: 270.0, date: "Apr 22, 2015 12:00 AM" },
];

const avatarColors = ["#6dd5a1", "#f9b572", "#a78bfa"];

export default function SalesTable() {
    const [currentPage, setCurrentPage] = useState(2);

    return (
        <div className="pharm-glass-card pharm-table-card">
            {/* Header */}
            <div className="pharm-table-header">
                <h3 className="pharm-chart-title">Recent Sales List</h3>
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
                            <th style={{ width: 40 }}></th>
                            <th>Name</th>
                            <th>Medicine</th>
                            <th>User Email</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>
                                Date <ChevronDown size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                            </th>
                            <th style={{ width: 50 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((row, idx) => (
                            <tr key={row.id}>
                                <td>
                                    <input type="checkbox" className="pharm-checkbox" />
                                </td>
                                <td>
                                    <div className="pharm-table-user">
                                        <div
                                            className="pharm-table-avatar"
                                            style={{ background: avatarColors[idx % avatarColors.length] }}
                                        >
                                            {row.avatar}
                                        </div>
                                        <span>{row.name}</span>
                                    </div>
                                </td>
                                <td>{row.medicine}</td>
                                <td>{row.email}</td>
                                <td>
                                    <div className="pharm-qty-stepper">
                                        <button className="pharm-qty-btn">
                                            <Minus size={12} />
                                        </button>
                                        <span>{row.qty}</span>
                                        <button className="pharm-qty-btn pharm-qty-plus">
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </td>
                                <td>$ {row.price.toFixed(2)}</td>
                                <td>{row.date}</td>
                                <td>
                                    <div className="pharm-table-actions">
                                        <button className="pharm-action-btn"><Pencil size={14} /></button>
                                        <button className="pharm-action-btn pharm-action-delete"><Trash2 size={14} /></button>
                                        <button className="pharm-action-btn"><MoreVertical size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pharm-pagination">
                <div className="pharm-page-buttons">
                    <button className="pharm-page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                        Prev
                    </button>
                    {[1, 2, "...", 8, 9].map((p, i) => (
                        <button
                            key={i}
                            className={`pharm-page-btn ${p === currentPage ? "active" : ""} ${p === "..." ? "dots" : ""}`}
                            onClick={() => typeof p === "number" && setCurrentPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button className="pharm-page-btn" onClick={() => setCurrentPage((p) => p + 1)}>
                        Next
                    </button>
                </div>
                <div className="pharm-page-info">
                    <span>Showing of 120 Entries</span>
                    <button className="pharm-filter-btn">
                        Show 3 <ChevronDown size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
