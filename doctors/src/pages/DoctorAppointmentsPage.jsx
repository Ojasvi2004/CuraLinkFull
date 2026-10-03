import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const server=import.meta.env.VITE_SERVER;

// ─── ICONS ──────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar:    ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  clock:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  video:       ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 0 0-5V5z"],
  building:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  filter:      "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  chevronL:    "M15 18l-6-6 6-6",
  chevronR:    "m9 18 6-6-6-6",
  chevron:     "m9 18 6-6-6-6",
  arrow:       "M17 8l4 4m0 0l-4 4m4-4H3",
  user:        ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  phone:       "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69l3-.15a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.96-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  doc:         "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  empty:       ["M9 13h6m-3-3v6m-9 1V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  availability:"M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z",
  check:       ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getISODate = (d) => d.toISOString().split("T")[0];

const formatDisplayDate = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

const isToday = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    upcoming:    { bg: "#FEF9C3", color: "#A16207", label: "Upcoming" },
    completed:   { bg: "#DCFCE7", color: "#15803D", label: "Completed" },
    cancelled:   { bg: "#FEE2E2", color: "#B91C1C", label: "Cancelled" },
    "checked-in":{ bg: "#DBEAFE", color: "#1D4ED8", label: "Checked In" },
    no_show:     { bg: "#F3E8FF", color: "#7C3AED", label: "No Show" },
  };
  const s = map[status?.toLowerCase()] || { bg: "#F1F5F9", color: "#475569", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};



// ─── TAB BUTTON ───────────────────────────────────────────────────────────────
const TabBtn = ({ label, active, onClick }) => (
  <motion.button whileTap={{ scale: 0.96 }} onClick={onClick}
    style={{ padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", transition: "all 0.2s",
      background: active ? "linear-gradient(135deg,#1E3A5F,#2D4E8A)" : "transparent",
      color: active ? "white" : "#64748B",
      boxShadow: active ? "0 4px 14px rgba(30,58,95,0.3)" : "none",
    }}>
    {label}
  </motion.button>
);

// ─── APPOINTMENT CARD ────────────────────────────────────────────────────────
const AppointmentCard = ({ apt, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 22 }}
    whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.09)" }}
    style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}
  >
    {/* Gradient top accent */}
    <div style={{ height: 3, background: apt.type === "DIGITAL" ? "linear-gradient(90deg,#0EA5E9,#38BDF8)" : "linear-gradient(90deg,#10B981,#34D399)" }} />

    <div style={{ padding: "20px 24px" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: apt.type === "DIGITAL" ? "#E0F2FE" : "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={apt.type === "DIGITAL" ? ICONS.video : ICONS.building} size={20} color={apt.type === "DIGITAL" ? "#0284C7" : "#059669"} />
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>{apt.patientName}</p>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>ID: {apt.id}</p>
          </div>
        </div>
        <StatusBadge status={apt.status} />
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: apt.notesPreview ? 14 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d={ICONS.clock} size={14} color="#6366F1" />
          <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{apt.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d={apt.type === "DIGITAL" ? ICONS.video : ICONS.building} size={14} color="#6366F1" />
          <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{apt.type === "DIGITAL" ? "Video Consultation" : "In-Person Visit"}</span>
        </div>
      </div>

      {/* Notes */}
      {apt.notesPreview && (
        <div style={{ background: "#F8FAFF", border: "1px solid #EEF2FF", borderRadius: 10, padding: "10px 14px", marginTop: 12, marginBottom: 0 }}>
          <p style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>📋 {apt.notesPreview}</p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
        <Link to={`/doctor/appointment/${apt.id}`} style={{ textDecoration: "none" }}>
          <motion.span whileHover={{ y: -1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#EEF2FF", color: "#6366F1", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}>
            <Icon d={ICONS.doc} size={13} color="#6366F1" /> View Details
          </motion.span>
        </Link>

        {apt.type === "DIGITAL" && apt.status === "upcoming" && (
          <Link to={`/doctor/start-call/${apt.id}`} style={{ textDecoration: "none" }}>
            <motion.span whileHover={{ y: -1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg,#0EA5E9,#38BDF8)", color: "white", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 10, cursor: "pointer", boxShadow: "0 3px 10px rgba(14,165,233,0.3)" }}>
              <Icon d={ICONS.video} size={13} color="white" /> Start Call
            </motion.span>
          </Link>
        )}

        {apt.status === "upcoming" && (
          <Link to={`/doctor/patient/${apt.id}/record`} style={{ textDecoration: "none" }}>
            <motion.span whileHover={{ y: -1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#ECFDF5", color: "#059669", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}>
              <Icon d={ICONS.user} size={13} color="#059669" /> Patient Record
            </motion.span>
          </Link>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", padding: "60px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
    <div style={{ width: 64, height: 64, borderRadius: 18, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
      <Icon d={ICONS.empty} size={28} color="#6366F1" />
    </div>
    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>No appointments found</p>
    <p style={{ fontSize: 14, color: "#94A3B8" }}>No appointments match your current filters.</p>
  </motion.div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorAppointmentsPage = () => {
  // const { token } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
  const [activeTab, setActiveTab] = useState("ALL");
  const [filterType, setFilterType] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const {token,settoken}=useContext(AuthContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.post(`${server}/api/doctors/gettodayAppointment`,
          { dateISO: selectedDate + "T00:00:00.000+00:00" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
            console.log(res);
        if (res.data.success) {
          setAppointments(res.data.DayAppointment.map(el => ({
            id: el._id, patientName: el.patientName, time: el.time.start,
            date: el.date, type: el.consultationType, status: el.status,
            notesPreview: el.notes, clinicName: el.clinicId,
          })));
        }
      } catch (e) { console.error(e); }
    };
    fetchAppointments();
    setActiveTab("ALL");
  }, [selectedDate]);

const handleDateOffset = (offset) => {
  const d = new Date(selectedDate + "T00:00:00Z"); 
  d.setUTCDate(d.getUTCDate() + offset);
  setSelectedDate(d.toISOString().split("T")[0]);
};

  const today = isToday(selectedDate);

  const filtered = appointments.filter(apt => {
    const tabMatch = activeTab === "ALL" || (activeTab === "upcoming" ? apt.status === "upcoming" : ["completed","cancelled","no_show"].includes(apt.status));
    const typeMatch = filterType === "all" || apt.type === filterType;
    return tabMatch && typeMatch;
  });

  const counts = {
    ALL: appointments.length,
    upcoming: appointments.filter(a => a.status === "upcoming").length,
    past: appointments.filter(a => ["completed","cancelled","no_show"].includes(a.status)).length,
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(30,58,95,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HEADER ────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)", borderRadius: 24, padding: "32px 40px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(30,58,95,0.4)" }}>

            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Icon d={ICONS.sparkle} size={14} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Appointment Manager</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Manage <span style={{ color: "rgba(255,255,255,0.5)" }}>Appointments</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 6 }}>View your schedule, manage bookings and prepare for consultations.</p>
              </div>

              <Link to="/doctor/availability" style={{ textDecoration: "none" }}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "12px 20px", cursor: "pointer", backdropFilter: "blur(8px)" }}>
                  <Icon d={ICONS.availability} size={16} color="white" />
                  <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Set Availability</span>
                </motion.div>
              </Link>
            </div>

            {/* Summary pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
              {[
                { label: "Total Today", value: appointments.length, color: "rgba(255,255,255,0.9)" },
                { label: "Upcoming", value: counts.upcoming, color: "#86EFAC" },
                { label: "Completed", value: counts.past, color: "#93C5FD" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "7px 14px", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{s.label}:</span>
                  <span style={{ fontSize: 13, color: s.color, fontWeight: 800 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── FILTER BAR ────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: 18, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "16px 20px", marginBottom: 28, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, justifyContent: "space-between" }}>

            {/* Date navigator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDateOffset(-1)}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid #EEF2FF", background: "#F8FAFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={ICONS.chevronL} size={16} color="#6366F1" />
              </motion.button>

              <div style={{ position: "relative" }}>
                <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setActiveTab("ALL"); }}
                  style={{ padding: "8px 14px", border: "1.5px solid #EEF2FF", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#1E293B", background: "#F8FAFF", outline: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }} />
              </div>

              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDateOffset(+1)}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid #EEF2FF", background: "#F8FAFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={ICONS.chevronR} size={16} color="#6366F1" />
              </motion.button>
            </div>

            {/* Tabs — only show upcoming/past on today */}
            <div style={{ display: "flex", gap: 4, background: "#F8FAFF", borderRadius: 12, padding: 4, border: "1px solid #EEF2FF" }}>
              {(today ? ["ALL","upcoming","past"] : ["ALL"]).map(tab => (
                <TabBtn key={tab} label={tab === "ALL" ? `All (${counts.ALL})` : tab === "upcoming" ? `Upcoming (${counts.upcoming})` : `Past (${counts.past})`} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>

            {/* Type filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={ICONS.filter} size={16} color="#94A3B8" />
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                style={{ padding: "8px 12px", border: "1.5px solid #EEF2FF", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#1E293B", background: "#F8FAFF", outline: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <option value="all">All Types</option>
                <option value="PHYSICAL">In-Person</option>
                <option value="DIGITAL">Digital</option>
              </select>
            </div>
          </motion.div>

          {/* ── DATE HEADING ─────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS.calendar} size={16} color="#6366F1" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{today ? "Today" : "Selected Date"}</p>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 1 }}>{formatDisplayDate(selectedDate)}</p>
            </div>
          </motion.div>

          {/* ── APPOINTMENT CARDS ─────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div key={activeTab + selectedDate + filterType}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {filtered.map((apt, i) => <AppointmentCard key={apt.id} apt={apt} index={i} />)}
              </motion.div>
            ) : (
              <EmptyState key="empty" />
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default DoctorAppointmentsPage;