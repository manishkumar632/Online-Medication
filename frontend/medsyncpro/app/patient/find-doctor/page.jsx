// app/patient/find-doctor/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import RouteGuard from "../../components/RouteGuard";
import FindDoctorClient from "./Finddoctorclient";
import "../patient-dashboard.css";
import "./find-doctor.css";

/* ─── SVG icon helper ─── */
const I = ({ d, size = 18, stroke = "currentColor", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

/* ─── Same NAV_ITEMS as PatientDashboard ─── */
const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/patient/dashboard",
    icon: (
      <I
        d={
          <>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </>
        }
      />
    ),
  },
  {
    id: "appointments",
    label: "Appointments",
    href: "/patient/appointments",
    icon: (
      <I d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM16 2v4M8 2v4M3 10h18" />
    ),
  },
  {
    id: "find-doctor",
    label: "Find Doctor",
    href: "/patient/find-doctor",
    icon: (
      <I
        d={
          <>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </>
        }
      />
    ),
  },
  {
    id: "prescriptions",
    label: "Prescriptions",
    href: "/patient/dashboard",
    icon: (
      <I
        d={
          <>
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v6m0 0H3m6 0h12M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 1-2-2V9" />
            <path d="M9 14h.01M9 17h.01M13 14h2M13 17h2" />
          </>
        }
      />
    ),
    badge: 2,
  },
  {
    id: "vitals",
    label: "Health Vitals",
    href: "/patient/dashboard",
    icon: <I d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  },
  {
    id: "history",
    label: "Medical History",
    href: "/patient/dashboard",
    icon: (
      <I
        d={
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </>
        }
      />
    ),
  },
  {
    id: "messages",
    label: "Messages",
    href: "/patient/dashboard",
    icon: (
      <I
        d={
          <>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </>
        }
      />
    ),
    badge: 2,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/patient/dashboard",
    icon: (
      <I
        d={
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </>
        }
      />
    ),
  },
  {
    id: "profile",
    label: "My Profile",
    href: "/patient",
    icon: (
      <I
        d={
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        }
      />
    ),
  },
];

function FindDoctorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "P";

  return (
    <div className="pd-layout">
      {/* ═══ SIDEBAR — same structure as PatientDashboard ═══ */}
      <aside className={`pd-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="pd-sidebar-header">
          <div className="pd-sidebar-logo">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <span className="pd-sidebar-brand">MedSync</span>
        </div>
        <nav className="pd-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`pd-nav-item ${item.id === "find-doctor" ? "active" : ""}`}
              onClick={() => router.push(item.href)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="pd-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="pd-sidebar-footer">
          <button
            className="pd-sidebar-toggle"
            onClick={() => setSidebarCollapsed((c) => !c)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {sidebarCollapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="pd-main">
        {/* Navbar */}
        <header className="pd-navbar">
          <button
            className="pd-nav-toggle"
            onClick={() => setSidebarCollapsed((c) => !c)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="pd-navbar-center">
            <nav className="fd-breadcrumb">
              <span
                className="fd-bc-item"
                onClick={() => router.push("/patient/dashboard")}
              >
                Dashboard
              </span>
              <span className="fd-bc-sep">›</span>
              <span className="fd-bc-item active">Find Doctor</span>
            </nav>
          </div>
          <div className="pd-navbar-right">
            <button className="pd-icon-btn" title="Notifications">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notif-dot" />
            </button>
            <div
              className="pd-avatar-sm"
              onClick={() => router.push("/patient")}
            >
              {user?.profileImage || user?.profileImageUrl ? (
                <img
                  src={user.profileImage || user.profileImageUrl}
                  alt={user?.name}
                />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        {/* Content — FindDoctorClient renders only the inner content */}
        <div className="pd-content">
          <FindDoctorClient />
        </div>
      </div>
    </div>
  );
}

export default function FindDoctorPageWrapper() {
  return (
    <RouteGuard allowedRoles={["PATIENT"]}>
      <FindDoctorPage />
    </RouteGuard>
  );
}
