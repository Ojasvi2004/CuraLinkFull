import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  search:    ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  pin:       ["M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z", "M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  video:     ["M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"],
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  clock:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  filter:    "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L16 11.414V17l-4 4v-8.586L3.293 6.707A1 1 0 0 1 3 6V4z",
  calendar:  ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  arrow:     "M5 12h14M12 5l7 7-7 7",
  check:     ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  close:     "M18 6 6 18M6 6l12 12",
  stethoscope: ["M4.5 11a7.5 7.5 0 0 0 15 0V5.5", "M19.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z", "M12 18.5v3M9 21.5h6"],
  user:      ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  sparkle:   ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
};

// ─── SPECIALTY CONFIG ───────────────────────────────────────────────────────────
const SPECIALTIES = [
  "All Specialties","Cardiology","Pediatrics","Dermatology","Orthopedics",
  "Neurology","Gynecology","Ophthalmology","ENT","Psychiatry","General Medicine",
];

const SPECIALTY_COLORS = {
  Cardiology:       { color: "#DC2626", bg: "#FEF2F2" },
  Pediatrics:       { color: "#D97706", bg: "#FFFBEB" },
  Dermatology:      { color: "#EC4899", bg: "#FDF2F8" },
  Orthopedics:      { color: "#2563EB", bg: "#EFF6FF" },
  Neurology:        { color: "#7C3AED", bg: "#F5F3FF" },
  Gynecology:       { color: "#059669", bg: "#ECFDF5" },
  Ophthalmology:    { color: "#0284C7", bg: "#E0F2FE" },
  ENT:              { color: "#CA8A04", bg: "#FEFCE8" },
  Psychiatry:       { color: "#9333EA", bg: "#FAF5FF" },
  "General Medicine":{ color: "#475569", bg: "#F1F5F9" },
};
const getSpecColor = (s) => SPECIALTY_COLORS[s] || { color: "#6366F1", bg: "#EEF2FF" };

// ─── STAR RATING ───────────────────────────────────────────────────────────────
const Stars = ({ rating = 0 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={13} height={13} viewBox="0 0 20 20" fill={i <= Math.round(rating) ? "#F59E0B" : "#E2E8F0"}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

// ─── DOCTOR CARD ───────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, index }) => {
  const sc = getSpecColor(doctor.Speciality);
  const [imgErr, setImgErr] = useState(false);

  const initials = (doctor.FullName || "D")
    .split(" ").filter(Boolean).slice(0,2).map(n => n[0]).join("").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -6, boxShadow: `0 20px 48px rgba(99,102,241,0.13)` }}
      style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Gradient top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg,${sc.color},${sc.color}99)` }} />

      {/* Photo / Avatar */}
      <div style={{ position: "relative", height: 160, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {doctor.ProfilePicture && !imgErr ? (
          <img src={doctor.ProfilePicture} alt={doctor.FullName}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: sc.color }}>{initials}</span>
          </div>
        )}
        {/* Teleconsult badge */}
        {doctor.availableDigital && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Icon d={ICONS.video} size={12} color="#6366F1" />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#6366F1" }}>Online</span>
          </div>
        )}
      </div>

      <div style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Specialty pill */}
        <span style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start", marginBottom: 8 }}>
          {doctor.Speciality}
        </span>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A", lineHeight: 1.2, marginBottom: 4 }}>{doctor.FullName}</h3>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <Icon d={ICONS.pin} size={13} color="#94A3B8" />
          <span style={{ fontSize: 12, color: "#64748B" }}>{doctor.ClinicDetails?.city}{doctor.ClinicDetails?.state ? `, ${doctor.ClinicDetails.state}` : ""}</span>
        </div>

        {/* Rating + Experience row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Stars rating={doctor.rating || 0} />
            {doctor.rating && <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>({doctor.rating?.toFixed(1)})</span>}
          </div>
          {doctor.experience && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon d={ICONS.clock} size={12} color="#94A3B8" />
              <span style={{ fontSize: 11, color: "#64748B" }}>{doctor.experience} yrs exp</span>
            </div>
          )}
        </div>

        {/* Clinic name */}
        {doctor.ClinicDetails?.clinicName && (
          <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14, fontStyle: "italic" }}>{doctor.ClinicDetails.clinicName}</p>
        )}

        {/* CTA */}
        <div style={{ marginTop: "auto" }}>
          <Link to={`/doctors/${doctor._id}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 13, padding: "11px 16px", borderRadius: 12, textDecoration: "none", boxShadow: "0 4px 14px rgba(99,102,241,0.3)", transition: "opacity 0.15s" }}>
            View Profile & Book <Icon d={ICONS.arrow} size={14} color="white" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // default | rating | experience

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/user/getDoctorList");
      if (res.data.success) setDoctors(res.data.doctorList);
    } catch (e) {
      console.error("Error fetching doctors", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const filtered = useMemo(() => {
    let list = doctors.filter(d =>
      d.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!specialtyFilter || d.Speciality?.toLowerCase().includes(specialtyFilter.toLowerCase())) &&
      (!locationFilter || d.ClinicDetails?.city?.toLowerCase().includes(locationFilter.toLowerCase())) &&
      (!onlineOnly || d.availableDigital)
    );
    if (sortBy === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "experience") list = [...list].sort((a, b) => (b.experience || 0) - (a.experience || 0));
    return list;
  }, [doctors, searchTerm, specialtyFilter, locationFilter, onlineOnly, sortBy]);

  const inputCls = { background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 12px 10px 38px", fontSize: 13, color: "#1E293B", outline: "none", width: "100%" };
  const selCls  = { background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#475569", outline: "none", width: "100%" };

  // Unique cities for quick filter
  const cities = useMemo(() => [...new Set(doctors.map(d => d.ClinicDetails?.city).filter(Boolean))].slice(0, 8), [doctors]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO HEADER ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EEF2FF", borderRadius: 20, padding: "6px 16px", marginBottom: 16 }}>
              <Icon d={ICONS.sparkle} size={14} color="#6366F1" />
              <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Verified Specialists</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.15 }}>
              Find Your <span style={{ color: "#6366F1" }}>Specialist</span>
            </h1>
            <p style={{ color: "#64748B", fontSize: 16, marginTop: 10, maxWidth: 520, margin: "10px auto 0" }}>
              Browse our network of certified doctors and book a consultation — online or in-person.
            </p>
          </motion.div>

          {/* ── SEARCH BAR ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: "white", borderRadius: 20, padding: "20px 24px", marginBottom: 12, border: "1px solid #EEF2FF", boxShadow: "0 4px 24px rgba(99,102,241,0.08)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Name search */}
              <div style={{ position: "relative" }}>
                <Icon d={ICONS.search} size={15} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by doctor name…" style={inputCls} />
              </div>
              {/* Specialty */}
              <div style={{ position: "relative" }}>
                <Icon d={ICONS.stethoscope} size={15} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} style={{ ...selCls, paddingLeft: 36 }}>
                  {SPECIALTIES.map(s => <option key={s} value={s === "All Specialties" ? "" : s}>{s}</option>)}
                </select>
              </div>
              {/* Location */}
              <div style={{ position: "relative" }}>
                <Icon d={ICONS.pin} size={15} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="City or location…" style={inputCls} />
              </div>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selCls}>
                <option value="default">Default Order</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            {/* Second row — toggles + counts */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
              {/* Online toggle */}
              <button onClick={() => setOnlineOnly(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 20, border: `1px solid ${onlineOnly ? "#6366F1" : "#E2E8F0"}`, background: onlineOnly ? "#EEF2FF" : "transparent", color: onlineOnly ? "#4338CA" : "#64748B", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                <Icon d={ICONS.video} size={13} color={onlineOnly ? "#6366F1" : "#94A3B8"} /> Online Consult Only
              </button>

              {/* City quick pills */}
              {cities.slice(0, 5).map(city => (
                <button key={city} onClick={() => setLocationFilter(locationFilter === city ? "" : city)}
                  style={{ padding: "6px 13px", borderRadius: 20, border: `1px solid ${locationFilter === city ? "#6366F1" : "#E2E8F0"}`, background: locationFilter === city ? "#EEF2FF" : "transparent", color: locationFilter === city ? "#4338CA" : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                  {city}
                </button>
              ))}

              {(searchTerm || specialtyFilter || locationFilter || onlineOnly) && (
                <button onClick={() => { setSearchTerm(""); setSpecialtyFilter(""); setLocationFilter(""); setOnlineOnly(false); }}
                  style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "none", padding: "7px 14px", borderRadius: 10, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
                  Clear all
                </button>
              )}
              <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, marginLeft: "auto" }}>
                {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </motion.div>

          {/* ── SPECIALTY QUICK TABS ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
            className="flex flex-wrap gap-2 mb-8">
            {["All Specialties", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology"].map(s => {
              const val = s === "All Specialties" ? "" : s;
              const active = specialtyFilter === val;
              const sc = s === "All Specialties" ? { color: "#6366F1", bg: "#EEF2FF" } : getSpecColor(s);
              return (
                <button key={s} onClick={() => setSpecialtyFilter(val)}
                  style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${active ? sc.color : "#E2E8F0"}`, background: active ? sc.bg : "white", color: active ? sc.color : "#64748B", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s", boxShadow: active ? `0 2px 8px ${sc.color}33` : "none" }}>
                  {s}
                </button>
              );
            })}
          </motion.div>

          {/* ── GRID ── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1", animation: "spin 0.9s linear infinite" }} />
              <p style={{ color: "#94A3B8", marginTop: 16, fontSize: 14 }}>Finding the best specialists for you…</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon d={ICONS.stethoscope} size={36} color="#C7D2FE" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>No doctors found</h3>
              <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 6 }}>Try adjusting your search or filters.</p>
              <button onClick={() => { setSearchTerm(""); setSpecialtyFilter(""); setLocationFilter(""); setOnlineOnly(false); }}
                style={{ marginTop: 20, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 600, fontSize: 13, padding: "12px 22px", borderRadius: 12, border: "none", cursor: "pointer" }}>
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {filtered.map((doc, i) => <DoctorCard key={doc._id} doctor={doc} index={i} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default FindDoctors;