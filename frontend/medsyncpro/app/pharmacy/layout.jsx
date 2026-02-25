"use client";
import "./dashboard.css";
import { useState } from "react";
import Sidebar from "./dashboard/components/Sidebar";
import TopNavbar from "./dashboard/components/TopNavbar";
import RouteGuard from "../components/RouteGuard";

export default function PharmacyLayout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // collapsed on mobile by default

    return (
        <RouteGuard allowedRoles={["PHARMACIST"]}>
            <div className="pharm-layout">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarCollapsed(true)}
                />
                <div className="pharm-main-wrapper">
                    <TopNavbar onMenuToggle={() => setSidebarCollapsed((p) => !p)} />
                    <main className="pharm-main-content">{children}</main>
                </div>
            </div>
        </RouteGuard>
    );
}
