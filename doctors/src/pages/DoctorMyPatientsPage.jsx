import React, { useState, useMemo, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  users:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  sort:     ["M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  plus:     ["M12 5v14", "M5 12h14"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  chevron:  "m9 18 6-6-6-6",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69l3-.15a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.96-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  empty:    ["M12 4.354a4 4 0 1 1 0 5.292M15 21H3v-1a6 6 0 0 1 12 0v1zm0 0h6v-1a6 6 0 0 0-9-5.197M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"],
};

// ─── AVATAR INITIALS ──────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#38BDF8)",
  "linear-gradient(135deg,#10B981,#34D399)",
  "linear-gradient(135deg,#F59E0B,#FBBF24)",
  "linear-gradient(135deg,#EC4899,#F472B6)",
  "linear-gradient(135deg,#8B5CF6,#A78BFA)",
];

const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

const getGradient = (name = "") =>
  AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];

// ─── PATIENT CARD ─────────────────────────────────────────────────────────────
const PatientCard = ({ patient, index }) => {
  const initials = getInitials(patient.name);
  const gradient = getGradient(patient.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -8, boxShadow: "0 24px 56px rgba(99,102,241,0.18)" }}
      style={{
        background: "white",
        borderRadius: 24,
        border: "1px solid #EEF2FF",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: gradient }} />

      <div style={{ padding: "28px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
        {/* Avatar */}
        {patient.profilePic ? (
          <img src={patient.profilePic} alt={patient.name}
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid white", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", marginBottom: 16 }} />
        ) : (
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
            border: "3px solid white",
          }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif" }}>{initials}</span>
          </div>
        )}

        {/* Name & ID */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 4, textAlign: "center" }}>
          {patient.name}
        </h3>
        <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
          ID: {patient._id?.slice(-8) || "N/A"}
        </span>

        {/* Concern badge */}
        <span style={{
          background: "#EEF2FF", color: "#6366F1", fontSize: 11, fontWeight: 700,
          padding: "4px 14px", borderRadius: 20, letterSpacing: "0.04em",
          textTransform: "uppercase", marginBottom: 20,
        }}>
          {patient.primaryConcern || "General"}
        </span>

        {/* Info rows */}
        <div style={{
          width: "100%", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9",
          padding: "14px 0", marginBottom: 20, display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={ICONS.calendar} size={13} color="#059669" />
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Last Visit</p>
              <p style={{ fontSize: 12, color: "#334155", fontWeight: 600 }}>
                {patient.lastVisit ? new Date(patient.lastVisit + 'T00:00:00').toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={ICONS.calendar} size={13} color="#6366F1" />
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Next Appointment</p>
              <p style={{ fontSize: 12, color: "#334155", fontWeight: 600 }}>
                {patient.nextAppointment ? new Date(patient.nextAppointment + 'T00:00:00').toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "None Scheduled"}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link to={`/doctor/patient-record/${patient._id}`} style={{ textDecoration: "none", width: "100%" }}>
          <motion.div
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              color: "white", borderRadius: 14, padding: "11px 0",
              textAlign: "center", fontWeight: 700, fontSize: 13,
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            View Full Record <Icon d={ICONS.arrow} size={13} color="white" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorMyPatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [mockPatientsData, setMockPatientsData] = useState([]);
  const { token } = useContext(AuthContext);

  const GetAllPatientsData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/doctors/get-patients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setMockPatientsData(response.data.patient);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { GetAllPatientsData(); }, []);

  const filteredAndSortedPatients = useMemo(() => {
    let patients = mockPatientsData.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === 'name_asc') patients.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name_desc') patients.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'last_visit_desc') patients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    else if (sortBy === 'last_visit_asc') patients.sort((a, b) => new Date(a.lastVisit) - new Date(b.lastVisit));
    return patients;
  }, [searchTerm, sortBy, mockPatientsData]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #94A3B8; }
        select option { color: #0F172A; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{
              background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
              borderRadius: 24, padding: "36px 40px", marginBottom: 32,
              position: "relative", overflow: "hidden",
              boxShadow: "0 16px 48px rgba(30,58,95,0.4)",
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, right: 140, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon d={ICONS.sparkle} size={15} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>Patient Management</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  My Patients<span style={{ color: "rgba(255,255,255,0.45)" }}>.</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 5, fontWeight: 500 }}>
                  Your complete patient roster — records, history &amp; appointments.
                </p>
              </div>

              <Link to="/doctor/add-patient" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "linear-gradient(135deg,#10B981,#34D399)",
                    borderRadius: 16, padding: "13px 24px",
                    display: "flex", alignItems: "center", gap: 8,
                    color: "white", fontWeight: 700, fontSize: 14,
                    boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  <Icon d={ICONS.plus} size={16} color="white" />
                  Add New Patient
                </motion.div>
              </Link>
            </div>

            {/* Stats pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {[
                { label: "Total Patients", value: mockPatientsData.length, icon: ICONS.users },
                { label: "Search Results", value: filteredAndSortedPatients.length, icon: ICONS.search },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "8px 14px",
                  border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Icon d={s.icon} size={14} color="rgba(255,255,255,0.8)" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{s.label}:</span>
                  <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── SEARCH & SORT BAR ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            style={{
              background: "white", borderRadius: 20, border: "1px solid #EEF2FF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 24px",
              marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 280px" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <Icon d={ICONS.search} size={16} color="#94A3B8" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search patients by name…"
                style={{
                  width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                  border: "1.5px solid #EEF2FF", borderRadius: 12, fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", color: "#0F172A", outline: "none",
                  background: "#F8FAFF", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#6366F1"}
                onBlur={e => e.target.style.borderColor = "#EEF2FF"}
              />
            </div>

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={ICONS.sort} size={16} color="#6366F1" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Sort by</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  border: "1.5px solid #EEF2FF", borderRadius: 12, padding: "10px 14px",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
                  background: "#F8FAFF", outline: "none", cursor: "pointer",
                }}
              >
                <option value="name_asc">Name (A–Z)</option>
                <option value="name_desc">Name (Z–A)</option>
                <option value="last_visit_desc">Last Visit (Newest)</option>
                <option value="last_visit_asc">Last Visit (Oldest)</option>
              </select>
            </div>
          </motion.div>

          {/* ── SECTION LABEL ────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS.users} size={17} color="#6366F1" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Patient Roster</p>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 1 }}>
                {filteredAndSortedPatients.length} patient{filteredAndSortedPatients.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </motion.div>

          {/* ── PATIENT GRID ──────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {filteredAndSortedPatients.length > 0 ? (
              <motion.div
                key={searchTerm + sortBy}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}
              >
                {filteredAndSortedPatients.map((patient, i) => (
                  <PatientCard key={patient._id || i} patient={patient} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "white", borderRadius: 24, border: "1px solid #EEF2FF",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", padding: "80px 40px", textAlign: "center",
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: 20, background: "#EEF2FF",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
                }}>
                  <Icon d={ICONS.empty} size={32} color="#6366F1" />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
                  No patients found
                </h3>
                <p style={{ fontSize: 14, color: "#64748B", maxWidth: 320 }}>
                  {searchTerm ? "No patients match your search. Try a different name." : "Your patient roster is empty. Add your first patient to get started."}
                </p>
                {!searchTerm && (
                  <Link to="/doctor/add-patient" style={{ textDecoration: "none", marginTop: 24 }}>
                    <motion.div
                      whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                      style={{
                        background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                        color: "white", borderRadius: 14, padding: "12px 28px",
                        fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6,
                        boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                      }}
                    >
                      <Icon d={ICONS.plus} size={14} color="white" />
                      Add First Patient
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default DoctorMyPatientsPage;