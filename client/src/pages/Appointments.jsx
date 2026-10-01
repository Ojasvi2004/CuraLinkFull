import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

const server = import.meta.env.VITE_SERVER;

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  ink:      "#0C0A09",
  body:     "#57534E",
  muted:    "#A8A29E",
  line:     "#ECEAE6",
  surface:  "#F5F4F2",
  surface2: "#FAFAF9",
  white:    "#FFFFFF",
};

const EASE = [0.22, 1, 0.36, 1];

// Iridescent gradient orbs
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar:    ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  clock:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  video:       ["M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"],
  pin:         ["M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z", "M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  star:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  reschedule:  "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  details:     "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  close:       "M18 6 6 18M6 6l12 12",
  search:      ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  plus:        "M12 5v14M5 12h14",
  check:       ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  cancel:      ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "m15 9-6 6M9 9l6 6"],
  stethoscope: ["M4.5 11a7.5 7.5 0 0 0 15 0V5.5", "M19.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z", "M12 18.5v3M9 21.5h6"],
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusConfig = {
  upcoming:  { label: "Upcoming",  badgeBg: T.white, color: T.ink, dot: "#10B981" },
  scheduled: { label: "Scheduled", badgeBg: T.white, color: T.ink, dot: "#3B82F6" },
  completed: { label: "Completed", badgeBg: T.white, color: T.muted, dot: "#94A3B8" },
  cancelled: { label: "Cancelled", badgeBg: "#FEF2F2", color: "#DC2626", dot: "#DC2626" },
};

const getStatus = (s = "") => statusConfig[s.toLowerCase()] || statusConfig.scheduled;

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE } },
};

const WordReveal = ({ text, as = "h1", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                paddingBottom: "0.14em",
                marginBottom: "-0.14em",
                marginRight: "0.24em",
              }}
            >
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>
                {w}
              </motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

const Pill = ({ children }) => (
  <motion.span
    variants={fadeUp}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      fontWeight: 500,
      color: T.muted,
      marginBottom: 12,
      letterSpacing: "-0.01em",
    }}
  >
    <motion.span
      animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-flex" }}
    >
      <Icon d={ICONS.sparkle} size={12} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

// ─── 3D TILT CARD ─────────────────────────────────────────────────────────────
const TiltCard = ({ children, style = {}, max = 3, className = "", ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      layout
      variants={fadeUp}
      className={`apt-card ${className}`}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, ...style }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
const Magnetic = ({ children, strength = 0.25 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

// ─── SCROLL PROGRESS ─────────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: T.ink,
        transformOrigin: "0% 50%",
        scaleX,
        zIndex: 100,
      }}
    />
  );
};

// ─── CANCEL CONFIRMATION MODAL ────────────────────────────────────────────────
const CancelModal = ({ apt, onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(12,10,9,0.45)", backdropFilter: "blur(12px)" }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.92, y: 15, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      style={{
        background: T.white,
        borderRadius: 24,
        padding: "32px",
        maxWidth: 400,
        width: "100%",
        border: `1px solid ${T.line}`,
        boxShadow: "0 25px 60px rgba(12,10,9,0.15)",
        textAlign: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#FEF2F2",
          border: "1px solid #FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Icon d={ICONS.cancel} size={22} color="#DC2626" />
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em" }}>
        Cancel Appointment?
      </h3>

      <p style={{ color: T.body, fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>
        You're about to cancel your consultation with <strong style={{ color: T.ink }}>{apt?.doctorName}</strong>. This clinical slot will be released immediately.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: 999,
            border: `1px solid ${T.line}`,
            background: T.white,
            color: T.body,
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Keep
        </button>
        <button
          onClick={() => {
            onConfirm(apt._id);
            onClose();
          }}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: 999,
            border: "none",
            background: "#DC2626",
            color: "white",
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Yes, Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── APPOINTMENT CARD ──────────────────────────────────────────────────────────
const AptCard = ({ apt, isUpcoming, onCancel }) => {
  const stat = getStatus(apt.status);
  const isDigital = apt.type === "DIGITAL";

  return (
    <TiltCard style={{ padding: "26px 28px", marginBottom: 16 }}>
      {/* Top Details Row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        
        {/* Doctor Icon & Identity */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1, minWidth: 240 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: T.white,
              border: `1px solid ${T.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(12,10,9,0.03)",
            }}
          >
            <Icon d={isDigital ? ICONS.video : ICONS.stethoscope} size={20} color={T.ink} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span
                style={{
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  color: T.ink,
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 20,
                  letterSpacing: "-0.01em",
                }}
              >
                {isDigital ? "Digital Teleconsult" : "In-Person Clinic"}
              </span>

              <span
                style={{
                  background: stat.badgeBg,
                  border: `1px solid ${T.line}`,
                  color: stat.color,
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: stat.dot }} />
                {stat.label}
              </span>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginTop: 4, lineHeight: 1.25 }}>
              {apt.doctorName}
            </h3>
            <p style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{apt.specialty}</p>
          </div>
        </div>

        {/* Date / Time Badge */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ background: T.white, borderRadius: 14, padding: "8px 16px", border: `1px solid ${T.line}` }}>
            <p style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
              Date
            </p>
            <p style={{ fontSize: 13.5, color: T.ink, fontWeight: 500, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
              {fmtDate(apt.date)}
            </p>
            {apt.time?.start && (
              <p style={{ fontSize: 12, color: T.body, fontWeight: 400, marginTop: 1, fontVariantNumeric: "tabular-nums" }}>
                {apt.time.start} – {apt.time.end}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Meta Pills (Clinic or Online Details) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {apt.time?.start && (
          <span style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: T.body, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon d={ICONS.clock} size={12} color={T.muted} /> {apt.time.start} – {apt.time.end}
          </span>
        )}

        {!isDigital && apt.clinicName && (
          <span style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: T.body, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon d={ICONS.pin} size={12} color={T.muted} /> {apt.clinicName}
          </span>
        )}

        {isDigital && (
          <span style={{ background: T.white, border: `1px solid ${T.line}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: T.body, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon d={ICONS.video} size={12} color={T.muted} /> Encrypted Video Room
          </span>
        )}
      </div>

      {/* Actions Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          marginTop: 18,
          paddingTop: 16,
          borderTop: `1px solid ${T.line}`,
        }}
      >
        {isUpcoming && isDigital && (
          <Link
            to={`/consultation/${apt._id}`}
            style={{
              background: T.ink,
              color: "white",
              fontSize: 12.5,
              fontWeight: 500,
              padding: "8px 18px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 6px 18px rgba(12,10,9,0.15)",
            }}
          >
            <Icon d={ICONS.video} size={13} color="white" /> Join Video Call
          </Link>
        )}

        {isUpcoming && (
          <Link
            to={`/reschedule/${apt._id}`}
            style={{
              background: T.white,
              color: T.body,
              fontSize: 12.5,
              fontWeight: 400,
              padding: "8px 16px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${T.line}`,
            }}
          >
            <Icon d={ICONS.reschedule} size={13} color={T.muted} /> Reschedule
          </Link>
        )}

        <Link
          to={`/appointment-details/${apt._id}`}
          style={{
            background: T.white,
            color: T.body,
            fontSize: 12.5,
            fontWeight: 400,
            padding: "8px 16px",
            borderRadius: 999,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: `1px solid ${T.line}`,
          }}
        >
          <Icon d={ICONS.details} size={13} color={T.muted} /> View Details
        </Link>

        {!isUpcoming && (
          <Link
            to={`/review/${apt.doctorId}/${apt._id}`}
            style={{
              background: T.ink,
              color: "white",
              fontSize: 12.5,
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon d={ICONS.star} size={13} color="white" /> Leave Review
          </Link>
        )}

        {isUpcoming && (
          <button
            onClick={() => onCancel(apt)}
            style={{
              background: "transparent",
              color: T.muted,
              fontSize: 12.5,
              fontWeight: 400,
              padding: "8px 14px",
              borderRadius: 999,
              border: `1px dashed ${T.line}`,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginLeft: "auto",
            }}
          >
            <Icon d={ICONS.cancel} size={12} color={T.muted} /> Cancel Visit
          </button>
        )}
      </div>
    </TiltCard>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Appointments = () => {
  const { token } = useContext(Authcontext);
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const reduce = useReducedMotion();

  const orbA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -180]);
  const orbB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 45, damping: 20 });
  const smy = useSpring(my, { stiffness: 45, damping: 20 });
  const mouseX = useTransform(smx, [-0.5, 0.5], [-35, 35]);
  const mouseY = useTransform(smy, [-0.5, 0.5], [-25, 25]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/api/user/getAppointmentsAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const all = res.data.MyScheduleArray || [];
        setAppointments({
          upcoming: all.filter(
            (a) => a.status?.toLowerCase() === "upcoming" || a.status?.toLowerCase() === "scheduled"
          ),
          past: all.filter(
            (a) => a.status?.toLowerCase() === "completed" || a.status?.toLowerCase() === "cancelled"
          ),
        });
      }
    } catch (e) {
      console.error("Error fetching appointments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = (id) => {
    setAppointments((prev) => ({
      ...prev,
      upcoming: prev.upcoming.filter((a) => a._id !== id),
    }));
  };

  const displayList = useMemo(() => {
    const base = activeTab === "upcoming" ? appointments.upcoming : appointments.past;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((a) =>
      [a.doctorName, a.specialty, a.clinicName].some((v) => v?.toLowerCase().includes(q))
    );
  }, [appointments, activeTab, search]);

  const stats = useMemo(
    () => ({
      upcoming:  appointments.upcoming.length,
      completed: appointments.past.filter((a) => a.status?.toLowerCase() === "completed").length,
      total:     appointments.upcoming.length + appointments.past.length,
    }),
    [appointments]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .apt-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .apt-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 24px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .apt-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.92), rgba(255,255,255,0) 60%);
        }
        .apt-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .apt-card:hover::before {
          opacity: 1;
        }

        .search-input {
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px 12px 38px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          width: 100%;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .search-input:focus {
          border-color: ${T.ink};
        }

        .stat-box {
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 20px;
          padding: 16px 20px;
          transition: all 0.2s ease;
        }
        .stat-box:hover {
          background: ${T.white};
          border-color: #D6D3D1;
          transform: translateY(-2px);
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="apt-root"
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
      >
        {/* Ambient Iridescent Background Orbs */}
        <motion.div
          style={{
            position: "fixed",
            top: -120,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.3,
            filter: "blur(70px)",
            pointerEvents: "none",
            y: orbA,
            x: mouseX,
          }}
        />
        <motion.div
          style={{
            position: "fixed",
            bottom: -100,
            left: -80,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.25,
            filter: "blur(65px)",
            pointerEvents: "none",
            y: orbB,
            x: mouseY,
          }}
        />

        <div style={{ maxWidth: 940, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL HEADER ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 44,
            }}
          >
            <div>
              <Pill>Consultation Management</Pill>
              <WordReveal
                as="h1"
                text={"My Appointments"}
                style={{
                  fontSize: "clamp(32px, 4.8vw, 54px)",
                  fontWeight: 300,
                  color: T.ink,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              />
              <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, maxWidth: 500 }}>
                Track and manage clinical consultations across verified digital channels and physical clinics.
              </motion.p>
            </div>

            <motion.div variants={fadeUp}>
              <Magnetic strength={0.28}>
                <Link
                  to="/find-doctors"
                  style={{
                    background: T.ink,
                    color: "white",
                    fontWeight: 500,
                    fontSize: 14,
                    padding: "13px 26px",
                    borderRadius: 999,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 10px 28px rgba(12,10,9,0.18)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Icon d={ICONS.plus} size={15} color="white" /> Book Appointment
                </Link>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* ──────────────── 2. METRICS CAPSULES ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}
          >
            {[
              { label: "Total Booked",  value: stats.total,     icon: ICONS.calendar },
              { label: "Upcoming",      value: stats.upcoming,  icon: ICONS.clock    },
              { label: "Completed",     value: stats.completed, icon: ICONS.check    },
            ].map((s, i) => (
              <div key={i} className="stat-box">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>{s.label}</span>
                  <Icon d={s.icon} size={14} color={T.ink} />
                </div>
                <p style={{ fontSize: 28, fontWeight: 300, color: T.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ──────────────── 3. TABS & SEARCH CONSOLE ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: T.surface,
              borderRadius: 24,
              padding: "20px 22px",
              marginBottom: 28,
              border: `1px solid ${T.line}`,
            }}
          >
            {/* Pill Tab Switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {["upcoming", "past"].map((tab) => {
                const active = activeTab === tab;
                const count = tab === "upcoming" ? appointments.upcoming.length : appointments.past.length;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 20,
                      border: `1px solid ${active ? T.ink : T.line}`,
                      background: active ? T.ink : T.white,
                      color: active ? "white" : T.body,
                      fontSize: 13,
                      fontWeight: active ? 500 : 400,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <Icon d={ICONS.search} size={15} color={T.muted} />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by specialist name, specialty, or clinic facility…"
                className="search-input"
              />
            </div>
          </motion.div>

          {/* ──────────────── 4. APPOINTMENTS FEED ──────────────── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "100px 0" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `2px solid ${T.line}`,
                  borderTop: `2px solid ${T.ink}`,
                }}
              />
              <p style={{ color: T.muted, marginTop: 18, fontSize: 13.5 }}>
                Syncing consultation schedules…
              </p>
            </div>
          ) : displayList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center",
                padding: "90px 24px",
                background: T.surface,
                borderRadius: 28,
                border: `1px solid ${T.line}`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Icon d={ICONS.calendar} size={24} color={T.ink} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>
                No {activeTab} consultations
              </h3>
              <p style={{ color: T.muted, fontSize: 14, maxWidth: 360, margin: "0 auto 20px" }}>
                {search
                  ? "No consultations matched your search criteria."
                  : activeTab === "upcoming"
                  ? "You have no upcoming appointments on your itinerary."
                  : "Completed or past consultations will be cataloged here."}
              </p>

              {activeTab === "upcoming" && !search && (
                <Link
                  to="/find-doctors"
                  style={{
                    background: T.ink,
                    color: "white",
                    padding: "11px 24px",
                    borderRadius: 999,
                    textDecoration: "none",
                    fontSize: 13.5,
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon d={ICONS.plus} size={14} color="white" /> Book Consultation
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div layout style={{ display: "flex", flexDirection: "column" }}>
              <AnimatePresence>
                {displayList.map((apt) => (
                  <AptCard
                    key={apt._id}
                    apt={apt}
                    isUpcoming={activeTab === "upcoming"}
                    onCancel={setCancelTarget}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>

        {/* ── CANCEL MODAL ── */}
        <AnimatePresence>
          {cancelTarget && (
            <CancelModal
              apt={cancelTarget}
              onClose={() => setCancelTarget(null)}
              onConfirm={handleCancel}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Appointments;