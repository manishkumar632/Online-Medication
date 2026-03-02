"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  fetchSpecialtiesAction,
  searchDoctorsAction,
} from "@/action/Finddoctoraction";
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

/* ─── Specialty emoji map ─── */
const SPECIALTY_ICONS = {
  cardiology: "❤️",
  dermatology: "🩺",
  orthopedics: "🦴",
  pediatrics: "👶",
  neurology: "🧠",
  gynecology: "🌸",
  ophthalmology: "👁️",
  ent: "👂",
  psychiatry: "🧘",
  gastroenterology: "🫁",
  endocrinology: "⚗️",
  urology: "🔬",
  nephrology: "🫘",
  pulmonology: "🌬️",
  general: "🩻",
  oncology: "🎗️",
  rheumatology: "🦵",
  default: "🏥",
};

function getSpecialtyIcon(name = "") {
  const key = name.toLowerCase().replace(/\s+/g, "");
  for (const [k, v] of Object.entries(SPECIALTY_ICONS)) {
    if (key.includes(k)) return v;
  }
  return SPECIALTY_ICONS.default;
}

/* ─── Doctor Card ─── */
function DoctorCard({ doctor, onViewProfile, onBookAppointment }) {
  const isAvailable = doctor.availableForConsultation ?? false;
  const initials = (doctor.name || "D")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fd-doctor-card">
      <div className="fd-doctor-card-top">
        <div className="fd-doctor-avatar">
          {doctor.profileImageUrl ? (
            <img src={doctor.profileImageUrl} alt={doctor.name} />
          ) : (
            <span className="fd-avatar-initials">{initials}</span>
          )}
          <span
            className={`fd-avail-dot ${isAvailable ? "available" : "busy"}`}
            title={
              isAvailable
                ? "Available for Consultation"
                : "Currently Unavailable"
            }
          />
        </div>
        <div className="fd-doctor-meta">
          <h3 className="fd-doctor-name">{doctor.name}</h3>
          <p className="fd-doctor-specialty">{doctor.specialty || "General"}</p>
          {doctor.experienceYears != null && (
            <p className="fd-doctor-exp">
              <I
                d={
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </>
                }
                size={13}
                stroke="var(--pd-gray-400)"
              />
              {doctor.experienceYears} yrs experience
            </p>
          )}
          {(doctor.primaryClinicName || doctor.city) && (
            <p className="fd-doctor-clinic">
              <I
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                size={13}
                stroke="var(--pd-gray-400)"
              />
              {doctor.primaryClinicName || doctor.city}
              {doctor.primaryClinicCity &&
              doctor.primaryClinicCity !== doctor.city
                ? `, ${doctor.primaryClinicCity}`
                : ""}
            </p>
          )}
        </div>
      </div>

      <div className="fd-doctor-card-mid">
        <div className="fd-tags">
          {doctor.onlineConsultationEnabled && (
            <span className="fd-tag online">🎥 Online</span>
          )}
          {doctor.primaryClinicName && (
            <span className="fd-tag inperson">🏥 In-Person</span>
          )}
          {isAvailable && <span className="fd-tag avail">✅ Available</span>}
        </div>
        {doctor.consultationFee != null && (
          <div className="fd-rating">
            <span
              className="fd-rating-num"
              style={{ color: "var(--pd-teal)", fontWeight: 700 }}
            >
              &#8377;{doctor.consultationFee}
            </span>
            <span className="fd-rating-count"> / consult</span>
          </div>
        )}
      </div>

      {doctor.bio && (
        <p className="fd-doctor-bio">
          {doctor.bio.slice(0, 110)}
          {doctor.bio.length > 110 ? "…" : ""}
        </p>
      )}

      <div className="fd-doctor-card-actions">
        <button
          className="fd-btn-secondary"
          onClick={() => onViewProfile(doctor)}
        >
          <I
            d={
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            }
            size={15}
          />
          View Profile
        </button>
        <button
          className="fd-btn-primary"
          onClick={() => onBookAppointment(doctor)}
        >
          <I d="M12 5v14M5 12h14" size={15} />
          Book Appointment
        </button>
      </div>
    </div>
  );
}

/* ─── Specialty Card ─── */
function SpecialtyCard({ specialty, selected, onClick }) {
  return (
    <button
      className={`fd-specialty-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(specialty)}
    >
      <span className="fd-sp-icon">{getSpecialtyIcon(specialty.name)}</span>
      <span className="fd-sp-name">{specialty.name}</span>
      {specialty.doctorCount != null && (
        <span className="fd-sp-count">
          {specialty.doctorCount} doctor{specialty.doctorCount !== 1 ? "s" : ""}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   — Renders only pd-main content (no layout, no sidebar).
   — The parent PatientDashboard provides the full pd-layout shell.
   ═══════════════════════════════════════════════════════════════ */
export default function FindDoctorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState("specialty"); // "specialty" | "doctors"

  /* ── Specialty state ── */
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(true);
  const [specialtiesError, setSpecialtiesError] = useState(null);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  /* ── Doctor list state ── */
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalDoctors, setTotalDoctors] = useState(0);

  /* ── Search / sort ── */
  const [doctorSearch, setDoctorSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const PAGE_SIZE = 12;
  const searchDebounce = useRef(null);

  /* ── Load specialties on mount ── */
  useEffect(() => {
    let cancelled = false;
    setSpecialtiesLoading(true);
    setSpecialtiesError(null);
    fetchSpecialtiesAction().then((res) => {
      if (cancelled) return;
      if (res.success) setSpecialties(res.data);
      else setSpecialtiesError(res.message);
      setSpecialtiesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Restore from URL ?specialty= on mount ── */
  useEffect(() => {
    const sp = searchParams.get("specialty");
    if (sp) {
      setSelectedSpecialty({ name: sp });
      setStep("doctors");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Core fetch function ──
     API: GET /api/doctors/search?q=<term>&page=0&size=12&sort=name&direction=asc
     The `q` param is a free-text search across name/specialty/clinic/city.
     We combine the selected specialty name + any free-text the user typed.
  ── */
  const fetchDoctors = useCallback(
    async ({
      specialty = selectedSpecialty,
      query = doctorSearch,
      pageNum = 0,
      sort = sortField,
      direction = sortDirection,
      append = false,
    } = {}) => {
      if (!specialty) return;
      setDoctorsLoading(true);
      setDoctorsError(null);

      const combined = query.trim()
        ? `${specialty.name} ${query.trim()}`
        : specialty.name;

      const res = await searchDoctorsAction({
        query: combined,
        page: pageNum,
        size: PAGE_SIZE,
        sort,
        direction,
      });

      if (res.success) {
        setDoctors((prev) =>
          append ? [...prev, ...res.data.content] : res.data.content,
        );
        setTotalDoctors(res.data.totalElements);
        setHasMore(pageNum < res.data.totalPages - 1);
        setCurrentPage(pageNum);
      } else {
        setDoctorsError(res.message);
      }
      setDoctorsLoading(false);
    },
    [selectedSpecialty, doctorSearch, sortField, sortDirection],
  );

  /* ── Auto-fetch when entering doctor step ── */
  useEffect(() => {
    if (
      step === "doctors" &&
      selectedSpecialty &&
      doctors.length === 0 &&
      !doctorsLoading
    ) {
      fetchDoctors({ specialty: selectedSpecialty, pageNum: 0 });
    }
  }, [step, selectedSpecialty]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Re-fetch when sort changes ── */
  useEffect(() => {
    if (step === "doctors" && selectedSpecialty) {
      fetchDoctors({ pageNum: 0, sort: sortField, direction: sortDirection });
    }
  }, [sortField, sortDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Debounced free-text search ── */
  const handleDoctorSearchChange = (val) => {
    setDoctorSearch(val);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      fetchDoctors({ query: val, pageNum: 0 });
    }, 400);
  };

  /* ── Navigation handlers ── */
  const handleSelectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
    setStep("doctors");
    setDoctors([]);
    setCurrentPage(0);
    setDoctorSearch("");
    window.history.replaceState(
      null,
      "",
      `/patient/find-doctor?specialty=${encodeURIComponent(specialty.name)}`,
    );
    fetchDoctors({ specialty, query: "", pageNum: 0 });
  };

  const handleBackToSpecialties = () => {
    setStep("specialty");
    setSelectedSpecialty(null);
    setDoctors([]);
    setDoctorSearch("");
    window.history.replaceState(null, "", "/patient/find-doctor");
  };

  const handleViewProfile = (doc) => router.push(`/patient/doctors/${doc.id}`);
  const handleBookAppointment = (doc) =>
    router.push(`/patient/doctors/${doc.id}?action=book`);
  const handleLoadMore = () =>
    fetchDoctors({ pageNum: currentPage + 1, append: true });

  const filteredSpecialties = specialties.filter((s) =>
    s.name?.toLowerCase().includes(specialtySearch.toLowerCase()),
  );
  const popularSpecialties = specialties.slice(0, 8);

  /* ════════════════════════════════════════════════════════
     RENDER — only the inner content, no pd-layout/sidebar.
     PatientDashboard wraps this in its pd-main > pd-content.
     ════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Page header ── */}
      <div className="fd-page-header">
        <div className="fd-page-header-left">
          {step === "doctors" && (
            <button className="fd-back-btn" onClick={handleBackToSpecialties}>
              <I d="M19 12H5M12 5l-7 7 7 7" size={16} /> Back
            </button>
          )}
          <div>
            <h1 className="fd-page-title">
              {step === "specialty"
                ? "Find a Doctor"
                : `${selectedSpecialty?.name} Specialists`}
            </h1>
            <p className="fd-page-sub">
              {step === "specialty"
                ? "Select a specialty to find the right doctor for you"
                : `${totalDoctors} verified doctor${totalDoctors !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        {/* Specialty search input */}
        {step === "specialty" && (
          <div className="fd-search-box">
            <I
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              size={16}
              stroke="var(--pd-gray-400)"
            />
            <input
              type="text"
              placeholder="Search specialties..."
              value={specialtySearch}
              onChange={(e) => setSpecialtySearch(e.target.value)}
              autoFocus
            />
            {specialtySearch && (
              <button
                className="fd-search-clear"
                onClick={() => setSpecialtySearch("")}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Doctor search + sort controls */}
        {step === "doctors" && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div className="fd-search-box" style={{ minWidth: 220 }}>
              <I
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                size={16}
                stroke="var(--pd-gray-400)"
              />
              <input
                type="text"
                placeholder="Search by name, clinic, city..."
                value={doctorSearch}
                onChange={(e) => handleDoctorSearchChange(e.target.value)}
              />
              {doctorSearch && (
                <button
                  className="fd-search-clear"
                  onClick={() => handleDoctorSearchChange("")}
                >
                  ✕
                </button>
              )}
            </div>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--pd-radius-xs)",
                border: "1.5px solid var(--pd-gray-200)",
                fontSize: "0.82rem",
                fontFamily: "inherit",
                color: "var(--pd-gray-700)",
                cursor: "pointer",
                background: "var(--pd-white)",
              }}
            >
              <option value="name">Sort: Name</option>
              <option value="consultationFee">Sort: Fee</option>
              <option value="experienceYears">Sort: Experience</option>
            </select>
            <button
              onClick={() =>
                setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
              }
              style={{
                padding: "8px 12px",
                borderRadius: "var(--pd-radius-xs)",
                border: "1.5px solid var(--pd-gray-200)",
                fontSize: "0.85rem",
                fontFamily: "inherit",
                color: "var(--pd-gray-700)",
                cursor: "pointer",
                background: "var(--pd-white)",
              }}
            >
              {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        )}
      </div>

      {/* ════ STEP 1: Specialty grid ════ */}
      {step === "specialty" && (
        <div className="fd-specialty-section">
          {specialtiesLoading && (
            <div className="fd-loading-state">
              <div className="fd-spinner" />
              <p>Loading specialties...</p>
            </div>
          )}
          {specialtiesError && (
            <div className="fd-error-state">
              <span className="fd-error-icon">⚠️</span>
              <p>Could not load specialties: {specialtiesError}</p>
              <button
                className="fd-retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}
          {!specialtiesLoading && !specialtiesError && (
            <>
              {!specialtySearch && popularSpecialties.length > 0 && (
                <div className="fd-section-block">
                  <h2 className="fd-section-label">
                    <I
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      size={14}
                      stroke="var(--pd-orange)"
                      fill="var(--pd-orange)"
                    />
                    Popular Specialties
                  </h2>
                  <div className="fd-specialty-grid">
                    {popularSpecialties.map((sp) => (
                      <SpecialtyCard
                        key={sp.name}
                        specialty={sp}
                        selected={selectedSpecialty?.name === sp.name}
                        onClick={handleSelectSpecialty}
                      />
                    ))}
                  </div>
                </div>
              )}
              {filteredSpecialties.length > 0 && (
                <div className="fd-section-block">
                  <h2 className="fd-section-label">
                    <I
                      d="M4 6h16M4 12h16M4 18h16"
                      size={14}
                      stroke="var(--pd-teal)"
                    />
                    {specialtySearch
                      ? `Results for "${specialtySearch}"`
                      : "All Specialties"}
                  </h2>
                  <div className="fd-specialty-grid">
                    {filteredSpecialties.map((sp) => (
                      <SpecialtyCard
                        key={sp.name}
                        specialty={sp}
                        selected={selectedSpecialty?.name === sp.name}
                        onClick={handleSelectSpecialty}
                      />
                    ))}
                  </div>
                </div>
              )}
              {filteredSpecialties.length === 0 && (
                <div className="fd-empty-state">
                  <span className="fd-empty-icon">🔍</span>
                  <p>
                    No specialties found for <strong>{specialtySearch}</strong>
                  </p>
                  <button
                    className="fd-retry-btn"
                    onClick={() => setSpecialtySearch("")}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ════ STEP 2: Doctor list ════ */}
      {step === "doctors" && (
        <div className="fd-doctors-section">
          {doctorsLoading && doctors.length === 0 && (
            <div className="fd-loading-state">
              <div className="fd-spinner" />
              <p>Finding verified doctors...</p>
            </div>
          )}
          {doctorsError && (
            <div className="fd-error-state">
              <span className="fd-error-icon">⚠️</span>
              <p>Could not load doctors: {doctorsError}</p>
              <button
                className="fd-retry-btn"
                onClick={() => fetchDoctors({ pageNum: 0 })}
              >
                Retry
              </button>
            </div>
          )}
          {!doctorsLoading && !doctorsError && doctors.length === 0 && (
            <div className="fd-empty-state">
              <span className="fd-empty-icon">👨‍⚕️</span>
              <p>
                No verified doctors found
                {doctorSearch ? ` for "${doctorSearch}"` : ""} in{" "}
                <strong>{selectedSpecialty?.name}</strong>.
              </p>
              {doctorSearch ? (
                <button
                  className="fd-retry-btn"
                  onClick={() => handleDoctorSearchChange("")}
                >
                  Clear Search
                </button>
              ) : (
                <button
                  className="fd-retry-btn"
                  onClick={handleBackToSpecialties}
                >
                  Try another specialty
                </button>
              )}
            </div>
          )}
          {doctors.length > 0 && (
            <>
              <div className="fd-doctors-grid">
                {doctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onViewProfile={handleViewProfile}
                    onBookAppointment={handleBookAppointment}
                  />
                ))}
              </div>
              {doctorsLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 20,
                  }}
                >
                  <div className="fd-spinner" />
                </div>
              )}
              {hasMore && !doctorsLoading && (
                <div className="fd-load-more">
                  <button className="fd-load-more-btn" onClick={handleLoadMore}>
                    Load More Doctors
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
