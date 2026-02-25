"use client";
import { CalendarCheck, Users, Clock, Pill, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const kpis = [
    { label: "Today Appointments", value: "12", trend: "+3 vs yesterday", up: true, icon: CalendarCheck, color: "#2563eb", bg: "linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%)" },
    { label: "Total Patients", value: "1,847", trend: "+24 this month", up: true, icon: Users, color: "#0d9488", bg: "linear-gradient(135deg,#ccfbf1 0%,#99f6e4 100%)" },
    { label: "Pending Consultations", value: "5", trend: "2 urgent", up: false, icon: Clock, color: "#f59e0b", bg: "linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)" },
    { label: "Prescriptions Created", value: "328", trend: "+18 this week", up: true, icon: Pill, color: "#8b5cf6", bg: "linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%)" },
    { label: "Monthly Revenue", value: "$24.8K", trend: "+12.5%", up: true, icon: DollarSign, color: "#059669", bg: "linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)" },
];

const spark = [25, 38, 30, 48, 42, 55, 50, 62, 58, 70, 64, 75];

export default function DoctorKpiCards() {
    return (
        <div className="doc-kpi-grid">
            {kpis.map((k) => (
                <div key={k.label} className="doc-kpi-card" style={{ background: k.bg }}>
                    <div className="doc-kpi-top">
                        <div className="doc-kpi-icon" style={{ background: `${k.color}18`, color: k.color }}>
                            <k.icon size={20} />
                        </div>
                        <div className={`doc-kpi-trend ${k.up ? "up" : "down"}`}>
                            {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            <span>{k.trend}</span>
                        </div>
                    </div>
                    <div className="doc-kpi-value">{k.value}</div>
                    <div className="doc-kpi-label">{k.label}</div>
                    <svg className="doc-kpi-spark" viewBox="0 0 120 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            points={spark.map((v, i) => `${(i / (spark.length - 1)) * 120},${30 - (v / 80) * 30}`).join(" ")} />
                    </svg>
                </div>
            ))}
        </div>
    );
}
