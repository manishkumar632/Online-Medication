// app/patient/layout.jsx
import RouteGuard from "../components/RouteGuard";
import PatientSidebarLayout from "./components/PatientSidebarLayout";

// Import ALL css here once — never in individual pages
import "./patient-dashboard.css";
import "./patient-workflow.css";
import "./find-doctor/find-doctor.css";
import "./doctors/[id]/doctor-profile.css";
import "./patient-profile.css";

export default function PatientLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["PATIENT"]}>
      <PatientSidebarLayout>{children}</PatientSidebarLayout>
    </RouteGuard>
  );
}
