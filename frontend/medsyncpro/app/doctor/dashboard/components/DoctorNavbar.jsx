"use client";
import { Search, Bell, Plus, ChevronDown, Menu, CalendarDays } from "lucide-react";

export default function DoctorNavbar({ onMenuToggle }) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <header className="doc-topnav">
            <button className="doc-hamburger" onClick={onMenuToggle}>
                <Menu size={22} />
            </button>

            <div className="doc-search">
                <Search size={16} className="doc-search-icon" />
                <input type="text" placeholder="Search patients, records..." />
            </div>

            <div className="doc-topnav-right">
                <div className="doc-today-badge">
                    <CalendarDays size={14} />
                    <span>{today}</span>
                </div>

                <button className="doc-rx-btn">
                    <Plus size={16} />
                    <span>New Prescription</span>
                </button>

                <button className="doc-notif-btn">
                    <Bell size={18} />
                    <span className="doc-notif-dot" />
                </button>

                <div className="doc-profile">
                    <div className="doc-profile-avatar">
                        <img src="https://ui-avatars.com/api/?name=Dr+Smith&background=2563eb&color=fff&size=80" alt="" />
                    </div>
                    <div className="doc-profile-info">
                        <span className="doc-profile-name">Dr. Sarah Smith</span>
                        <span className="doc-profile-spec">Cardiologist</span>
                    </div>
                    <ChevronDown size={14} className="doc-profile-chevron" />
                </div>
            </div>
        </header>
    );
}
