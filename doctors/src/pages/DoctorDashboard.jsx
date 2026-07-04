import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// ─── ICONS ──────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar:    ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  users:       ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  video:       ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 0 0-5V5z"],
  chart:       ["M18 20V10", "M12 20V4", "M6 20v-6"],
  settings:    ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  clock:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  arrow:       "M17 8l4 4m0 0l-4 4m4-4H3",
  chevron:     "m9 18 6-6-6-6",
  sun:         ["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z","M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"],
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  stethoscope: ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
  pulse:       "M22 12h-4l-3 9L9 3l-3 9H2",
  check:       ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  phone:       "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69l3-.15a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.96-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  queue:       ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  building:    ["M6 22V2l6 2 6-2v20", "M6 12h6", "M12 12h6"],
  moon:        "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", icon: ICONS.sun };
  if (h < 17) return { text: "Good afternoon", icon: ICONS.sun };
  return { text: "Good evening", icon: ICONS.moon };
};

// ─── QUICK ACTION CARD ────────────────────────────────────────────────────────
const QuickCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.08 * index, type: "spring", stiffness: 260, damping: 22 }}
    whileHover={{ y: -6, boxShadow: `0 20px 48px ${item.glow}` }}
    style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", cursor: "pointer" }}
  >
    <Link to={item.link} style={{ textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ height: 4, background: item.gradient }} />
      <div style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={item.icon} size={22} color={item.iconColor} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: item.iconColor, background: item.iconBg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase" }}>{item.tag}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 6, lineHeight: 1.25 }}>{item.title}</h3>
        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, flex: 1 }}>{item.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16, color: item.iconColor, fontWeight: 700, fontSize: 12 }}>
          Go to {item.title} <Icon d={ICONS.arrow} size={13} color={item.iconColor} style={{ marginLeft: 2 }} />
        </div>
      </div>
    </Link>
  </motion.div>
);

// ─── QUICK LINKS ─────────────────────────────────────────────────────────────
const quickLinks = [
  { title: "My Schedule", description: "View today's appointments, manage your calendar and set availability slots.", icon: ICONS.calendar, link: "/doctor/appointments", gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)", glow: "rgba(99,102,241,0.28)", iconBg: "#EEF2FF", iconColor: "#6366F1", tag: "Schedule" },
  { title: "Patient Queue", description: "Monitor live queue status, call next patient, and manage walk-ins.", icon: ICONS.queue, link: "/doctor/queue-management", gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)", glow: "rgba(14,165,233,0.25)", iconBg: "#E0F2FE", iconColor: "#0284C7", tag: "Live Queue" },
  { title: "Teleconsultation", description: "Start or join a secure video consultation with your patient now.", icon: ICONS.video, link: "/doctor/teleconsult", gradient: "linear-gradient(135deg,#10B981,#34D399)", glow: "rgba(16,185,129,0.25)", iconBg: "#ECFDF5", iconColor: "#059669", tag: "Digital" },
  {
  title: "Patient Data Access",
  description: "Request secure access to patient health records for better diagnosis and AI-powered insights. Supports individual and today's appointments.",
  icon: ICONS.lock,
  link: "/doctor/permissions",
  gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)",
  glow: "rgba(99,102,241,0.25)",
  iconBg: "#EEF2FF",
  iconColor: "#4F46E5",
  tag: "Permissions"
},
  { title: "Set Availability", description: "Define your consultation hours, breaks and holiday schedule.", icon: ICONS.settings, link: "/doctor/availability", gradient: "linear-gradient(135deg,#EC4899,#F472B6)", glow: "rgba(236,72,153,0.25)", iconBg: "#FDF2F8", iconColor: "#DB2777", tag: "Availability" },
  { title: "All Patients", description: "Browse your full patient roster, medical records and history.", icon: ICONS.users, link: "/doctor/patients", gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)", glow: "rgba(139,92,246,0.25)", iconBg: "#F5F3FF", iconColor: "#7C3AED", tag: "Records" },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    upcoming:  { bg: "#FEF9C3", color: "#A16207", label: "Upcoming" },
    completed: { bg: "#DCFCE7", color: "#15803D", label: "Completed" },
    cancelled: { bg: "#FEE2E2", color: "#B91C1C", label: "Cancelled" },
    "checked-in": { bg: "#DBEAFE", color: "#1D4ED8", label: "Checked In" },
  };
  const s = map[status?.toLowerCase()] || { bg: "#F1F5F9", color: "#475569", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_APPOINTMENTS = [
  { id: "apt001", patientName: "Rohan Patel", time: "10:30 AM", type: "DIGITAL", status: "upcoming" },
  { id: "apt002", patientName: "Priya Kumari", time: "11:00 AM", type: "PHYSICAL", status: "checked-in" },
  { id: "apt003", patientName: "Amit Singh", time: "11:30 AM", type: "PHYSICAL", status: "upcoming" },
  { id: "apt004", patientName: "Sunita Rao", time: "12:00 PM", type: "DIGITAL", status: "completed" },
];

const QUEUE = { currentServing: "A005", patientsWaiting: 7, avgWaitTime: "15 min" };

// ─── DOCTOR DASHBOARD ─────────────────────────────────────────────────────────
const DoctorDashboard = () => {
  // Replace with: const { user } = useContext(AuthContext);
  const doctorName = "Dr. Ananya Sharma";
  const specialty = "Cardiologist · AIIMS Delhi";
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const greeting = getGreeting();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)", borderRadius: 24, padding: "36px 40px", marginBottom: 32, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(30,58,95,0.4)" }}>

            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, right: 140, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", right: 40, transform: "translateY(-50%)", width: 2, height: "60%", background: "rgba(255,255,255,0.1)", borderRadius: 2, pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon d={greeting.icon} size={15} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{greeting.text}</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  {doctorName}<span style={{ color: "rgba(255,255,255,0.45)" }}>.</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 5, fontWeight: 500 }}>{specialty}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 6 }}>Your practice dashboard is ready.</p>
              </div>

              {/* Live clock */}
              <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 18, padding: "16px 24px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center", flexShrink: 0 }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{dateStr}</p>
                <p style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "0.04em", marginTop: 4 }}>{timeStr}</p>
              </div>
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {[
                { label: "Today's Appointments", value: "15", icon: ICONS.calendar },
                { label: "Digital Consults", value: "6 Today", icon: ICONS.video },
                { label: "Patients Waiting", value: `${QUEUE.patientsWaiting} in Queue`, icon: ICONS.queue },
                { label: "Avg. Wait Time", value: QUEUE.avgWaitTime, icon: ICONS.clock },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon d={s.icon} size={14} color="rgba(255,255,255,0.8)" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{s.label}:</span>
                  <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
 
          {/* ── LIVE QUEUE BANNER ─────────────────────────────────────────────── 
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 32, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px 12px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 0 3px rgba(16,185,129,0.2)", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Live Patient Queue</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#6366F1", fontWeight: 700, background: "#EEF2FF", padding: "3px 10px", borderRadius: 20 }}>LIVE</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: "16px 24px" }}>
              {[
                { label: "Currently Serving", value: QUEUE.currentServing, bg: "#EEF2FF", color: "#6366F1" },
                { label: "Patients Waiting", value: QUEUE.patientsWaiting, bg: "#FFFBEB", color: "#D97706" },
                { label: "Avg. Wait Time", value: QUEUE.avgWaitTime, bg: "#ECFDF5", color: "#059669" },
              ].map((q, i) => (
                <div key={i} style={{ textAlign: "center", padding: "12px 0" }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{q.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: q.color, fontFamily: "'Playfair Display', serif" }}>{q.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, padding: "0 24px 16px" }}>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, background: "linear-gradient(135deg,#10B981,#34D399)", color: "white", border: "none", borderRadius: 12, padding: "11px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}>
                Call Next Patient
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, background: "linear-gradient(135deg,#F59E0B,#FBBF24)", color: "white", border: "none", borderRadius: 12, padding: "11px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}>
                Pause Queue
              </motion.button>
              <Link to="/doctor/queue-management" style={{ flex: 1, textDecoration: "none" }}>
                <motion.div whileHover={{ y: -2 }} style={{ background: "#F8FAFF", border: "1.5px solid #EEF2FF", borderRadius: 12, padding: "11px 0", fontWeight: 700, fontSize: 13, color: "#6366F1", textAlign: "center", cursor: "pointer" }}>
                  Manage Full Queue
                </motion.div>
              </Link>
            </div>
          </motion.div> */}

          {/* ── SECTION LABEL ─────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS.sparkle} size={17} color="#6366F1" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Quick Access</p>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 1 }}>Everything you need, one tap away</p>
            </div>
          </motion.div>

          {/* ── QUICK LINKS GRID ──────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginBottom: 40 }}>
            {quickLinks.map((item, i) => <QuickCard key={i} item={item} index={i} />)}
          </div>

          {/* ── BOTTOM ROW ────────────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }}>

            {/* Today's Appointments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon d={ICONS.pulse} size={17} color="#6366F1" />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Today's Appointments</span>
                </div>
                <Link to="/doctor/appointments" style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>View all →</Link>
              </div>
              <div style={{ padding: "8px 12px" }}>
                {MOCK_APPOINTMENTS.map((apt, i) => (
                  <motion.div key={apt.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                    <Link to={`/doctor/appointment/${apt.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, padding: "12px", borderRadius: 14, transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFF"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: apt.type === "DIGITAL" ? "#E0F2FE" : "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon d={apt.type === "DIGITAL" ? ICONS.video : ICONS.building} size={17} color={apt.type === "DIGITAL" ? "#0284C7" : "#059669"} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: "#1E293B", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{apt.patientName}</p>
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{apt.time} · {apt.type === "DIGITAL" ? "Video Call" : "In-Person"}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </Link>
                    {i < MOCK_APPOINTMENTS.length - 1 && <div style={{ height: 1, background: "#F1F5F9", margin: "0 12px" }} />}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Practice tip card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
              style={{ background: "linear-gradient(145deg,#1E3A5F 0%,#2D4E8A 100%)", borderRadius: 20, padding: "28px 26px", boxShadow: "0 8px 32px rgba(30,58,95,0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220 }}>
              <div>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon d={ICONS.stethoscope} size={20} color="white" />
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Clinical Insight</p>
                <p style={{ color: "white", fontSize: 14, lineHeight: 1.65 }}>Patients who receive appointment reminders show a 34% reduction in no-shows. Your digital consults are up 18% this week — great momentum.</p>
              </div>
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={ICONS.sparkle} size={14} color="rgba(255,255,255,0.6)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Excellence in care starts with preparation.</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.08); }
        }
        @media (max-width: 768px) {
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default DoctorDashboard;