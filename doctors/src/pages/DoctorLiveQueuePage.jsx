import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  check:   ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  clock:   ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  x:       ["M18 6 6 18", "m6 6 12 12"],
  search:  ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  user:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  pulse:   "M22 12h-4l-3 9L9 3l-3 9H2",
  refresh: ["M23 4v6h-6", "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"],
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
};

// ─── SECTION CONFIG ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: "upcoming",
    label: "Upcoming",
    emoji: "🔵",
    gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)",
    glow: "rgba(99,102,241,0.2)",
    iconBg: "#EEF2FF",
    iconColor: "#6366F1",
    badgeBg: "#EEF2FF",
    badgeColor: "#6366F1",
    cardBorderColor: "#C7D2FE",
  },
  {
    key: "no_show",
    label: "On Hold",
    emoji: "🟡",
    gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)",
    glow: "rgba(245,158,11,0.2)",
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    badgeBg: "#FFFBEB",
    badgeColor: "#D97706",
    cardBorderColor: "#FCD34D",
  },
  {
    key: "completed",
    label: "Completed",
    emoji: "🟢",
    gradient: "linear-gradient(135deg,#10B981,#34D399)",
    glow: "rgba(16,185,129,0.2)",
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    badgeBg: "#DCFCE7",
    badgeColor: "#15803D",
    cardBorderColor: "#86EFAC",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    emoji: "🔴",
    gradient: "linear-gradient(135deg,#EF4444,#F87171)",
    glow: "rgba(239,68,68,0.2)",
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
    badgeBg: "#FEE2E2",
    badgeColor: "#B91C1C",
    cardBorderColor: "#FCA5A5",
  },
];

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, color }) => {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const AVATAR_COLORS = ["#6366F1","#0EA5E9","#10B981","#F59E0B","#EC4899","#8B5CF6","#EF4444","#14B8A6"];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ─── PATIENT CARD ─────────────────────────────────────────────────────────────
const PatientCard = ({ appt, sec, onMark }) => (
  <motion.div layout variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
    initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
    whileHover={{ y: -2, boxShadow: `0 8px 24px ${sec.glow}` }}
    style={{ background: "white", borderRadius: 16, border: `1.5px solid ${sec.cardBorderColor}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden", cursor: "default" }}>
    <div style={{ height: 3, background: sec.gradient }} />
    <div style={{ padding: "14px 14px 12px", display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar name={appt.name} color={avatarColor(appt.name)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
          <Icon d={ICONS.clock} size={12} color="#94A3B8" />
          <p style={{ fontSize: 11, color: "#94A3B8" }}>{appt.time}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 5 }}>
        {appt.status === "upcoming" && (
          <>
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => onMark(appt.id, "completed")} title="Mark Completed"
              style={{ width: 30, height: 30, borderRadius: 9, background: "#DCFCE7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={ICONS.check} size={14} color="#15803D" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => onMark(appt.id, "no_show")} title="Put on Hold"
              style={{ width: 30, height: 30, borderRadius: 9, background: "#FFFBEB", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={ICONS.clock} size={14} color="#D97706" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => onMark(appt.id, "cancelled")} title="Cancel"
              style={{ width: 30, height: 30, borderRadius: 9, background: "#FEF2F2", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={ICONS.x} size={14} color="#DC2626" />
            </motion.button>
          </>
        )}
        {appt.status === "no_show" && (
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => onMark(appt.id, "completed")} title="Patient arrived — Complete"
            style={{ width: 30, height: 30, borderRadius: 9, background: "#DCFCE7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon d={ICONS.check} size={14} color="#15803D" />
          </motion.button>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── COLUMN ───────────────────────────────────────────────────────────────────
const Column = ({ sec, appointments, onMark }) => {
  const [search, setSearch] = useState("");
  const filtered = appointments.filter(a => a.status === sec.key && a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", minHeight: 400, overflow: "hidden" }}>

      {/* Column header */}
      <div style={{ height: 4, background: sec.gradient }} />
      <div style={{ padding: "16px 18px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: sec.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14 }}>{sec.emoji}</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{sec.label}</span>
          </div>
          <span style={{ background: sec.badgeBg, color: sec.badgeColor, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
            {filtered.length}
          </span>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFF", border: "1.5px solid #EEF2FF", borderRadius: 11, padding: "7px 12px" }}>
          <Icon d={ICONS.search} size={13} color="#94A3B8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${sec.label.toLowerCase()}...`}
            style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#475569", width: "100%", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "0 12px 12px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, maxHeight: "55vh" }}>
        <AnimatePresence>
          {filtered.length > 0
            ? filtered.map(a => <PatientCard key={a.id} appt={a} sec={sec} onMark={onMark} />)
            : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: sec.iconBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <Icon d={ICONS.user} size={18} color={sec.iconColor} />
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>No patients here</p>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorLiveQueuePage = () => {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const getISODate = (d) => d.toISOString().split("T")[0];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const todayISO = getISODate(new Date()) + "T00:00:00.000+00:00";
      const response = await axios.post(
        "${server}/api/doctors/gettodayAppointment",
        { dateISO: todayISO },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setAppointments(response.data.DayAppointment.map(el => ({
          id: el._id, name: el.patientName, time: el.time.start, status: el.status,
        })));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatus = async (id, newstatus) => {
    try {
      await axios.post(`${server}/api/doctors/handleAppointment`, { id, newstatus }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { console.error(e); }
  };

  const handleMark = async (id, newStatus) => {
    await handleStatus(id, newStatus);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const counts = SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: appointments.filter(a => a.status === s.key).length }), {});

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(30,58,95,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)", borderRadius: 24, padding: "32px 40px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(30,58,95,0.4)" }}>

            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 0 3px rgba(16,185,129,0.25)", animation: "livePulse 2s infinite" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Queue</span>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Patient Queue <span style={{ color: "rgba(255,255,255,0.45)" }}>Today</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}>
                  Manage live patient flow, update statuses and track your day.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                {/* Summary pills */}
                {SECTIONS.map(s => (
                  <div key={s.key} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{loading ? "—" : counts[s.key]}</p>
                  </div>
                ))}

                {/* Refresh button */}
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} onClick={fetchAppointments}
                  style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 16px", cursor: "pointer", color: "white", fontWeight: 700, fontSize: 12 }}>
                  <Icon d={ICONS.refresh} size={14} color="white" /> Refresh
                </motion.button>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                Last updated: {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </p>
            </div>
          </motion.div>

          {/* ── KANBAN GRID ──────────────────────────────────────────────────── */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1" }} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {SECTIONS.map(sec => (
                <Column key={sec.key} sec={sec} appointments={appointments} onMark={handleMark} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.08); }
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default DoctorLiveQueuePage;