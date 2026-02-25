"use client";
import PatientProfileClient from "./PatientProfileClient";
import RouteGuard from "../components/RouteGuard";

export default function PatientProfilePage() {
    return (
        <RouteGuard allowedRoles={["PATIENT"]}>
            <PatientProfileClient />
        </RouteGuard>
    );
}
