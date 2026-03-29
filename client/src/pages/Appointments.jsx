import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  video: ["M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"],
  pin: ["M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z", "M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  reschedule: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  details: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  close: "M18 6 6 18M6 6l12 12",
  search: ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  plus: "M12 5v14M5 12h14",
  check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  cancel: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "m15 9-6 6M9 9l6 6"],
  stethoscope: ["M4.5 11a7.5 7.5 0 0 0 15 0V5.5", "M19.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z", "M12 18.5v3M9 21.5h6"],
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const statusConfig = {
  upcoming:  { label: "Upcoming",  color: "#2563EB", bg: "#EFF6FF",  dot: "#3B82F6" },
  scheduled: { label: "Scheduled", color: "#D97706", bg: "#FFFBEB",  dot: "#F59E0B" },
  completed: { label: "Completed", color: "#16A34A", bg: "#F0FDF4",  dot: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEF2F2",  dot: "#EF4444" },
};

const getStatus = (s = "") => statusConfig[s.toLowerCase()] || statusConfig.scheduled;

// ─── CANCEL MODAL ──────────────────────────────────────────────────────────────
const CancelModal = ({ apt, onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 400, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon d={ICONS.cancel} size={26} color="#DC2626" />
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0F172A", textAlign: "center" }}>Cancel Appointment?</h3>
      <p style={{ color: "#64748B", fontSize: 13, textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
        You're about to cancel your appointment with <strong style={{ color: "#1E293B" }}>{apt?.doctorName}</strong>. This action cannot be undone.
      </p>
      <div className="flex gap-3 mt-6">
        <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFF", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Keep It</button>
        <button onClick={() => { onConfirm(apt._id); onClose(); }} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#DC2626,#EF4444)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Yes, Cancel</button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── APPOINTMENT CARD ──────────────────────────────────────────────────────────
const AptCard = ({ apt, isUpcoming, onCancel }) => {
  const stat = getStatus(apt.status);
  const isDigital = apt.type === "DIGITAL";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(99,102,241,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: isDigital ? "linear-gradient(90deg,#6366F1,#8B5CF6)" : "linear-gradient(90deg,#0EA5E9,#38BDF8)" }} />

      <div style={{ padding: "22px 24px" }}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div style={{ width: 50, height: 50, borderRadius: 14, background: isDigital ? "linear-gradient(135deg,#EEF2FF,#E0E7FF)" : "linear-gradient(135deg,#E0F2FE,#BAE6FD)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={isDigital ? ICONS.video : ICONS.stethoscope} size={22} color={isDigital ? "#6366F1" : "#0284C7"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span style={{ background: isDigital ? "#EEF2FF" : "#E0F2FE", color: isDigital ? "#4338CA" : "#0369A1", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {isDigital ? "Video Consult" : "In-Person"}
                </span>
                <span style={{ background: stat.bg, color: stat.color, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{stat.label}</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginTop: 4, lineHeight: 1.2 }}>{apt.doctorName}</h3>
              <p style={{ fontSize: 12, color: isDigital ? "#6366F1" : "#0284C7", fontWeight: 600, marginTop: 2 }}>{apt.specialty}</p>
            </div>
          </div>

          {/* Date badge */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ background: "#F8FAFF", borderRadius: 12, padding: "8px 14px", border: "1px solid #EEF2FF" }}>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</p>
              <p style={{ fontSize: 13, color: "#1E293B", fontWeight: 700, marginTop: 2 }}>{fmtDate(apt.date)}</p>
              {apt.time?.start && (
                <p style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, marginTop: 1 }}>{apt.time.start} – {apt.time.end}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {apt.time?.start && (
            <span style={{ background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={ICONS.clock} size={13} color="#94A3B8" /> {apt.time.start} – {apt.time.end}
            </span>
          )}
          {!isDigital && apt.clinicName && (
            <span style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#16803D", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={ICONS.pin} size={13} color="#16A34A" /> {apt.clinicName}
            </span>
          )}
          {isDigital && (
            <span style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#4338CA", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={ICONS.video} size={13} color="#6366F1" /> Online Video Consultation
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          {isUpcoming && isDigital && (
            <Link to={`/consultation/${apt._id}`}
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 12, fontWeight: 700, padding: "9px 18px", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
              <Icon d={ICONS.video} size={13} color="white" /> Join Video Call
            </Link>
          )}
          {isUpcoming && (
            <Link to={`/reschedule/${apt._id}`}
              style={{ background: "#F8FAFF", color: "#475569", fontSize: 12, fontWeight: 600, padding: "9px 18px", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, border: "1px solid #E2E8F0" }}>
              <Icon d={ICONS.reschedule} size={13} color="#64748B" /> Reschedule
            </Link>
          )}
          <Link to={`/appointment-details/${apt._id}`}
            style={{ background: "#F8FAFF", color: "#475569", fontSize: 12, fontWeight: 600, padding: "9px 18px", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, border: "1px solid #E2E8F0" }}>
            <Icon d={ICONS.details} size={13} color="#64748B" /> View Details
          </Link>
          {!isUpcoming && (
            <Link to={`/review/${apt.doctorId}/${apt._id}`}
              style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)", color: "white", fontSize: 12, fontWeight: 700, padding: "9px 18px", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>
              <Icon d={ICONS.star} size={13} color="white" /> Leave Review
            </Link>
          )}
          {isUpcoming && (
            <button onClick={() => onCancel(apt)}
              style={{ background: "transparent", color: "#94A3B8", fontSize: 12, fontWeight: 600, padding: "9px 14px", borderRadius: 10, border: "1px solid #E2E8F0", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <Icon d={ICONS.cancel} size={13} color="#94A3B8" /> Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
const Appointments = () => {
  const { token } = useContext(Authcontext);
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/user/getAppointmentsAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const all = res.data.MyScheduleArray || [];
        setAppointments({
          upcoming: all.filter(a => a.status?.toLowerCase() === "upcoming" || a.status?.toLowerCase() === "scheduled"),
          past: all.filter(a => a.status?.toLowerCase() === "completed" || a.status?.toLowerCase() === "cancelled"),
        });
      }
    } catch (e) {
      console.error("Error fetching appointments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = (id) => {
    setAppointments(prev => ({
      ...prev,
      upcoming: prev.upcoming.filter(a => a._id !== id),
    }));
    // TODO: call DELETE /api/appointments/:id
  };

  const displayList = useMemo(() => {
    const base = activeTab === "upcoming" ? appointments.upcoming : appointments.past;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(a => [a.doctorName, a.specialty, a.clinicName].some(v => v?.toLowerCase().includes(q)));
  }, [appointments, activeTab, search]);

  const stats = useMemo(() => ({
    upcoming: appointments.upcoming.length,
    completed: appointments.past.filter(a => a.status?.toLowerCase() === "completed").length,
    total: appointments.upcoming.length + appointments.past.length,
  }), [appointments]);

  const inputCls = { background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 12px 10px 38px", fontSize: 13, color: "#1E293B", outline: "none", width: "100%" };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #F0F4FF 0%, #F8F6FF 40%, #EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Decorative blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HEADER ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}>
                  <Icon d={ICONS.calendar} size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>CuraLink</p>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>My Appointments</h1>
                </div>
              </div>
              <p style={{ color: "#64748B", fontSize: 14, marginLeft: 2 }}>Track all your consultations, past and upcoming</p>
            </div>
            <Link to="/find-doctors"
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 14, padding: "13px 24px", borderRadius: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(99,102,241,0.35)", whiteSpace: "nowrap" }}>
              <Icon d={ICONS.plus} size={18} color="white" /> Book Appointment
            </Link>
          </motion.div>

          {/* ── STATS ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, icon: ICONS.calendar, color: "#6366F1", bg: "#EEF2FF" },
              { label: "Upcoming", value: stats.upcoming, icon: ICONS.clock, color: "#2563EB", bg: "#EFF6FF" },
              { label: "Completed", value: stats.completed, icon: ICONS.check, color: "#16A34A", bg: "#F0FDF4" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}
                style={{ background: "white", borderRadius: 18, padding: "18px 20px", border: "1px solid #EEF2FF", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", transition: "all 0.2s" }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={s.icon} size={18} color={s.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontWeight: 600 }}>{s.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── TABS + SEARCH ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: 18, marginBottom: 24, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9" }}>
              {["upcoming", "past"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: "16px 20px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 700, color: activeTab === tab ? "#6366F1" : "#94A3B8", borderBottom: activeTab === tab ? "2px solid #6366F1" : "2px solid transparent", transition: "all 0.2s", textTransform: "capitalize", letterSpacing: "0.02em" }}>
                  {tab === "upcoming" ? `Upcoming (${appointments.upcoming.length})` : `Past (${appointments.past.length})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ padding: "14px 18px", position: "relative" }}>
              <Icon d={ICONS.search} size={15} color="#94A3B8" style={{ position: "absolute", left: 30, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by doctor, specialty, clinic…" style={inputCls} />
            </div>
          </motion.div>

          {/* ── LIST ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1", animation: "spin 0.9s linear infinite" }} />
              <p style={{ color: "#94A3B8", marginTop: 16, fontSize: 14 }}>Loading your appointments…</p>
            </div>
          ) : displayList.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon d={ICONS.calendar} size={36} color="#C7D2FE" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>
                No {activeTab} appointments
              </h3>
              <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 6 }}>
                {search ? "Try a different search term." : activeTab === "upcoming" ? "You have no upcoming consultations scheduled." : "Your past consultation history will appear here."}
              </p>
              {activeTab === "upcoming" && !search && (
                <Link to="/find-doctors" style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 600, fontSize: 13, padding: "12px 22px", borderRadius: 12, textDecoration: "none" }}>
                  <Icon d={ICONS.plus} size={15} color="white" /> Book Your First Appointment
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {displayList.map(apt => (
                  <AptCard key={apt._id} apt={apt} isUpcoming={activeTab === "upcoming"} onCancel={setCancelTarget} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* ── CANCEL MODAL ── */}
        <AnimatePresence>
          {cancelTarget && (
            <CancelModal apt={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={handleCancel} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Appointments;