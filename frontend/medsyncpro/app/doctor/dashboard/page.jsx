"use client";
import DoctorKpiCards from "./components/DoctorKpiCards";
import TodayAppointments from "./components/TodayAppointments";
import PrescriptionPanel from "./components/PrescriptionPanel";
import DoctorAnalytics from "./components/DoctorAnalytics";
import ScheduleWidget from "./components/ScheduleWidget";
import NotificationsPanel from "./components/NotificationsPanel";
import PatientsOverview from "./components/PatientsOverview";

export default function DoctorDashboardPage() {
    return (
        <div className="doc-dashboard">
            {/* Welcome */}
            <div className="doc-welcome">
                <div>
                    <h1 className="doc-welcome-title">Good Morning, Dr. Smith 👋</h1>
                    <p className="doc-welcome-sub">You have <strong>12 appointments</strong> today. 5 consultations are pending.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <DoctorKpiCards />

            {/* Appointments + Prescriptions */}
            <div className="doc-row-2col">
                <TodayAppointments />
                <PrescriptionPanel />
            </div>

            {/* Analytics */}
            <DoctorAnalytics />

            {/* Schedule + Notifications */}
            <div className="doc-row-2col">
                <ScheduleWidget />
                <NotificationsPanel />
            </div>

            {/* Patients */}
            <PatientsOverview />
        </div>
    );
}
