"use client";
import PatientDashboard from "./PatientDashboard";
import RouteGuard from "../../components/RouteGuard";

export default function PatientDashboardPage() {
    return (
        <RouteGuard allowedRoles={["PATIENT"]}>
            <PatientDashboard />
        </RouteGuard>
    );
}
