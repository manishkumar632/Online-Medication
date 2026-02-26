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
import { useAuth } from "@/app/context/AuthContext";
import { useNotifications } from "@/app/context/NotificationContext";

const allMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/doctor/dashboard", requiresVerification: false },
    { name: "Appointments", icon: CalendarCheck, href: "/doctor/appointments", requiresVerification: true },
    { name: "Patients", icon: Users, href: "/doctor/patients", requiresVerification: true },
    { name: "Prescriptions", icon: Pill, href: "#", requiresVerification: true },
    { name: "Medical Records", icon: FolderHeart, href: "#", requiresVerification: true },
    { name: "Messages", icon: MessageSquare, href: "#", requiresVerification: false },
    { name: "Schedule", icon: Clock, href: "#", requiresVerification: true },
    { name: "Reports", icon: BarChart3, href: "#", requiresVerification: true },
    { name: "Notifications", icon: Bell, href: "#", requiresVerification: false, useBadge: "notifications" },
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

    const { user, validateSession } = useAuth();
    let unreadCount = 0;
    try {
        const notifications = useNotifications();
        unreadCount = notifications?.unreadCount || 0;
    } catch {
        // NotificationContext may not be available
    }

    const isVerified = user?.professionalVerificationStatus === "VERIFIED";

    // Fallback: periodically poll for verification status changes if not verified
    useEffect(() => {
        if (isVerified || !user || user.role !== "DOCTOR") return;
        const interval = setInterval(() => {
            validateSession?.();
        }, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [isVerified, user, validateSession]);

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
                    {allMenuItems.map((item) => {
                        const isLocked = item.requiresVerification && !isVerified;
                        const badge = item.useBadge === "notifications" ? unreadCount : null;

                        return (
                            <Link
                                key={item.name}
                                href={isLocked ? "#" : (item.href || "#")}
                                className={`doc-nav-item ${pathname === item.href ? "active" : ""} ${isLocked ? "locked" : ""}`}
                                title={collapsed ? item.name : (isLocked ? `${item.name} (Verification required)` : undefined)}
                                onClick={isLocked ? (e) => e.preventDefault() : undefined}
                                style={isLocked ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                            >
                                <item.icon size={19} />
                                {!collapsed && <span>{item.name}</span>}
                                {isLocked && !collapsed && (
                                    <Lock size={13} style={{ marginLeft: "auto", color: "#9ca3af" }} />
                                )}
                                {!isLocked && !collapsed && badge > 0 && (
                                    <span className="doc-nav-badge">{badge}</span>
                                )}
                            </Link>
                        );
                    })}

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
