"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, CalendarCheck, Users, Pill, FolderHeart, MessageSquare,
    Clock, BarChart3, Bell, Settings, ChevronLeft, ChevronRight, ChevronDown,
    Stethoscope, User, Briefcase, Building2, CalendarClock, MessageSquareText,
    FileCheck, ShieldCheck, Lock, UserX
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/doctor/dashboard" },
    { name: "Appointments", icon: CalendarCheck, href: "/doctor/appointments", badge: 8 },
    { name: "Patients", icon: Users, href: "/doctor/patients" },
    { name: "Prescriptions", icon: Pill, href: "#" },
    { name: "Medical Records", icon: FolderHeart, href: "#" },
    { name: "Messages", icon: MessageSquare, href: "#", badge: 3 },
    { name: "Schedule", icon: Clock, href: "#" },
    { name: "Reports", icon: BarChart3, href: "#" },
    { name: "Notifications", icon: Bell, href: "#", badge: 5 },
];

const settingsSubItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "professional", label: "Professional Info", icon: Briefcase },
    { id: "clinic", label: "Clinic / Practice", icon: Building2 },
    { id: "availability", label: "Availability", icon: CalendarClock },
    { id: "consultation", label: "Consultation", icon: MessageSquareText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "documents", label: "Documents", icon: FileCheck },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "account", label: "Account", icon: UserX },
];

export default function DoctorSidebar({ collapsed, onToggle }) {
    const pathname = usePathname();
    const isSettings = pathname?.includes("/doctor/settings");
    const [settingsOpen, setSettingsOpen] = useState(isSettings);
    const [activeSub, setActiveSub] = useState(null);
    const subMenuRef = useRef(null);
    const subMenuInnerRef = useRef(null);

    // Smooth height transition
    useEffect(() => {
        const outer = subMenuRef.current;
        const inner = subMenuInnerRef.current;
        if (!outer || !inner) return;
        if (settingsOpen) {
            outer.style.maxHeight = inner.scrollHeight + "px";
            outer.style.opacity = "1";
        } else {
            outer.style.maxHeight = "0px";
            outer.style.opacity = "0";
        }
    }, [settingsOpen]);

    const scrollToSection = (id) => {
        setActiveSub(id);
        if (isSettings) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            {!collapsed && <div className="doc-sidebar-overlay" onClick={onToggle} />}
            <aside className={`doc-sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="doc-sidebar-logo">
                    <div className="doc-logo-icon">
                        <Stethoscope size={18} color="#fff" />
                    </div>
                    {!collapsed && <span className="doc-logo-text">MedSyncpro</span>}
                </div>

                <nav className="doc-sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href || "#"}
                            className={`doc-nav-item ${pathname === item.href ? "active" : ""}`}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon size={19} />
                            {!collapsed && <span>{item.name}</span>}
                            {!collapsed && item.badge && (
                                <span className="doc-nav-badge">{item.badge}</span>
                            )}
                        </Link>
                    ))}

                    {/* Settings with dropdown */}
                    <div className={`doc-nav-group ${isSettings ? "active-group" : ""}`}>
                        <Link
                            href="/doctor/settings"
                            className={`doc-nav-item ${isSettings ? "active" : ""}`}
                            title={collapsed ? "Settings" : undefined}
                            onClick={(e) => {
                                if (isSettings) {
                                    e.preventDefault();
                                }
                                setSettingsOpen((p) => !p);
                            }}
                        >
                            <Settings size={19} />
                            {!collapsed && <span>Settings</span>}
                            {!collapsed && (
                                <ChevronDown
                                    size={14}
                                    className={`doc-nav-arrow ${settingsOpen ? "open" : ""}`}
                                />
                            )}
                        </Link>

                        {!collapsed && (
                            <div className="doc-sub-menu" ref={subMenuRef}>
                                <div ref={subMenuInnerRef}>
                                    {settingsSubItems.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/doctor/settings#${sub.id}`}
                                            className={`doc-sub-item ${activeSub === sub.id ? "active" : ""}`}
                                            onClick={(e) => {
                                                if (isSettings) {
                                                    e.preventDefault();
                                                }
                                                scrollToSection(sub.id);
                                            }}
                                        >
                                            <sub.icon size={15} />
                                            <span>{sub.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                <button className="doc-collapse-btn" onClick={onToggle}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    {!collapsed && <span>Collapse</span>}
                </button>
            </aside>
        </>
    );
}
