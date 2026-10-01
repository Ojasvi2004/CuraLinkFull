import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
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
  pin:         ["M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z", "M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  brief:       ["M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m8 0H8m8 0H8"],
  cap:         ["M12 14l9-5-9-5-9 5 9 5z", "M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 1 12 20.055a11.952 11.952 0 0 1-6.824-5.998 12.078 12.078 0 0 1 .665-6.479L12 14z"],
  video:       ["M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"],
  clock:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  check:       "m9 11 3 3L22 4",
  calendar:    ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  arrow:       "M17 8l4 4m0 0l-4 4m4-4H3",
  stethoscope: ["M4.5 11a7.5 7.5 0 0 0 15 0V5.5", "M19.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z", "M12 18.5v3M9 21.5h6"],
  verified:    ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "m9 12 2 2 4-4"],
  tag:         "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  lang:        ["M5 8l6 6", "M4 14l6-6 2-3", "M2 5h12", "M7 2h1", "M22 22l-5-10-5 10", "M14 18h6"],
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
};

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
      fontSize: 12,
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
      <Icon d={ICONS.sparkle} size={11} color={T.muted} />
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
      variants={fadeUp}
      className={`profile-card ${className}`}
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
      style={{ x: sx, y: sy, width: "100%" }}
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

// ─── STAR RATING ───────────────────────────────────────────────────────────────
const Stars = ({ rating = 0 }) => (
  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width={13}
        height={13}
        viewBox="0 0 20 20"
        fill={i <= Math.round(rating) ? T.ink : "#E5E5E5"}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── FLOATING CONFIRMATION TOAST ─────────────────────────────────────────────
const Toast = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      x: "-50%",
      background: T.ink,
      color: "white",
      borderRadius: 999,
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      zIndex: 100,
      boxShadow: "0 14px 40px rgba(12,10,9,0.25)",
      whiteSpace: "nowrap",
      border: "1px solid rgba(255,255,255,0.15)",
    }}
  >
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={ICONS.check} size={12} color="white" />
    </div>
    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{msg}</span>
  </motion.div>
);

// ─── MAIN DOCTOR PROFILE ──────────────────────────────────────────────────────
const DoctorProfile = () => {
  const { doctorId } = useParams();
  const { token } = useContext(Authcontext);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [imgErr, setImgErr] = useState(false);

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

  // Fetch doctor profile
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`${server}/api/user/getDoctorProfile/${doctorId}`);
        if (res.data.success) setDoctor(res.data.doctorProfile);
      } catch (e) {
        console.error(e);
      } finally {
        setPageLoading(false);
      }
    };
    fetchDoc();
  }, [doctorId]);

  // Fetch slots on selectedDate change
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.post(
          `${server}/api/user/getSlotsOfDoctor`,
          { doctorId, date: selectedDate },
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setAvailability(res.data.AllSlots);
      } catch (e) {
        console.error(e);
      }
    };
    setSelectedSlot(null);
    fetchSlots();
  }, [selectedDate, doctorId, token]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${server}/api/user/bookSlot`,
        { id: selectedSlot._id },
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (res.data.message === "Selected sot is already booked") {
        setToast("This slot was just booked. Please pick another.");
        setTimeout(() => setToast(""), 3500);
      } else {
        setToast(`Appointment confirmed for ${selectedSlot.Time.Start} on ${selectedDate}!`);
        setTimeout(() => setToast(""), 4000);
        setSelectedSlot(null);
        const r = await axios.post(
          `${server}/api/user/getSlotsOfDoctor`,
          { doctorId, date: selectedDate },
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (r.data.success) setAvailability(r.data.AllSlots);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.white }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${T.line}`, borderTop: `2px solid ${T.ink}` }}
        />
        <p style={{ color: T.muted, marginTop: 16, fontSize: 14 }}>
          Retrieving credentials & schedules…
        </p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.white }}>
        <p style={{ color: T.muted, fontSize: 16 }}>Specialist profile not found.</p>
        <Link to="/find-doctors" style={{ marginTop: 12, color: T.ink, fontWeight: 500, textDecoration: "underline" }}>
          Return to Directory
        </Link>
      </div>
    );
  }

  const quals = doctor.Qualifications?.split(",").map((q) => q.trim()).filter(Boolean) || [];
  const services = doctor.ServicesOffered?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const initials = (doctor.FullName || "D")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const availableCount = availability.filter((s) => !s.isBooked).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .doc-profile-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .profile-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 28px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .profile-card::before {
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
        .profile-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .profile-card:hover::before {
          opacity: 1;
        }

        .btn-ink {
          width: 100%;
          height: 48px;
          border-radius: 999px;
          background: ${T.ink};
          color: white;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: box-shadow 0.25s, transform 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-ink:hover:not(:disabled) {
          box-shadow: 0 10px 28px rgba(12,10,9,0.22);
          transform: translateY(-1px);
        }
        .btn-ink:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .date-input {
          width: 100%;
          background: ${T.surface2};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .date-input:focus {
          border-color: ${T.ink};
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="doc-profile-root"
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
            width: 520,
            height: 520,
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

        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL HERO CONSOLE ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{ marginBottom: 36 }}
          >
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.line}`,
                borderRadius: 32,
                padding: "clamp(30px, 4.5vw, 44px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Internal subtle ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: ORBS.violet,
                  opacity: 0.4,
                  filter: "blur(50px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", position: "relative", zIndex: 1 }}>
                
                {/* Doctor Avatar / Portrait */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `3px solid ${T.white}`,
                      boxShadow: "0 10px 30px rgba(12,10,9,0.08)",
                      background: ORBS.violet,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {doctor.ProfilePicture && !imgErr ? (
                      <img
                        src={doctor.ProfilePicture}
                        alt={doctor.FullName}
                        onError={() => setImgErr(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 36, fontWeight: 300, color: "white" }}>
                        {initials}
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Details */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span
                      style={{
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        color: T.ink,
                        fontSize: 11.5,
                        fontWeight: 500,
                        padding: "3px 12px",
                        borderRadius: 20,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {doctor.Speciality}
                    </span>

                    <span
                      style={{
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        color: T.ink,
                        fontSize: 11.5,
                        fontWeight: 500,
                        padding: "3px 12px",
                        borderRadius: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Icon d={ICONS.verified} size={11} color="#10B981" /> Verified Clinical Specialist
                    </span>
                  </div>

                  <WordReveal
                    as="h1"
                    text={doctor.FullName}
                    style={{
                      fontSize: "clamp(28px, 4vw, 44px)",
                      fontWeight: 300,
                      color: T.ink,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.15,
                      marginBottom: 8,
                    }}
                  />

                  {/* Rating + Reviews */}
                  {doctor.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <Stars rating={doctor.rating} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, fontVariantNumeric: "tabular-nums" }}>
                        {Number(doctor.rating).toFixed(1)}
                      </span>
                      {doctor.totalReviews && (
                        <span style={{ fontSize: 13, color: T.muted }}>
                          · {doctor.totalReviews} clinical evaluations
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Strip */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8, color: T.body, fontSize: 13.5 }}>
                    {doctor.Experience && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Icon d={ICONS.brief} size={14} color={T.muted} /> {doctor.Experience} years clinical practice
                      </span>
                    )}

                    {doctor.ClinicDetails?.city && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Icon d={ICONS.pin} size={14} color={T.muted} /> {doctor.ClinicDetails.city}
                        {doctor.ClinicDetails.state ? `, ${doctor.ClinicDetails.state}` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Consultation Fee Capsule */}
                {doctor.DigitalConsultationFees && (
                  <div
                    style={{
                      background: T.white,
                      border: `1px solid ${T.line}`,
                      borderRadius: 20,
                      padding: "16px 22px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 4,
                      boxShadow: "0 6px 20px rgba(12,10,9,0.02)",
                    }}
                  >
                    <span style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
                      Teleconsultation Fee
                    </span>
                    <span style={{ fontSize: 24, fontWeight: 300, color: T.ink, letterSpacing: "-0.02em" }}>
                      ₹{doctor.DigitalConsultationFees}
                    </span>
                  </div>
                )}

              </div>
            </div>
          </motion.div>

          {/* ──────────────── 2. TWO-COLUMN LAYOUT ──────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, alignItems: "start" }}>

            {/* LEFT — Clinical Information Panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: "1 1 60%" }}>
              
              {/* Biography */}
              {doctor.Bio && (
                <TiltCard style={{ padding: "28px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.stethoscope} size={16} color={T.ink} />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                      About Specialist
                    </h2>
                  </div>
                  <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.75 }}>
                    {doctor.Bio}
                  </p>
                </TiltCard>
              )}

              {/* Qualifications */}
              {quals.length > 0 && (
                <TiltCard style={{ padding: "28px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.cap} size={16} color={T.ink} />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                      Accreditations & Qualifications
                    </h2>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {quals.map((q, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 14px",
                          background: T.white,
                          borderRadius: 12,
                          border: `1px solid ${T.line}`,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.ink }} />
                        <span style={{ fontSize: 13.5, color: T.ink, fontWeight: 400 }}>{q}</span>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              )}

              {/* Services Offered */}
              {services.length > 0 && (
                <TiltCard style={{ padding: "28px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.tag} size={16} color={T.ink} />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                      Clinical Services Offered
                    </h2>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {services.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: T.white,
                          color: T.ink,
                          fontSize: 12.5,
                          fontWeight: 400,
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: `1px solid ${T.line}`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              )}

              {/* Languages */}
              {doctor.Languages && (
                <TiltCard style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon d={ICONS.lang} size={16} color={T.ink} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Spoken Languages
                    </p>
                    <p style={{ fontSize: 14, color: T.ink, fontWeight: 400, marginTop: 2 }}>
                      {doctor.Languages}
                    </p>
                  </div>
                </TiltCard>
              )}

            </div>

            {/* RIGHT — Interactive Appointment Booking Module */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
              style={{ flex: "1 1 35%", position: "sticky", top: 32 }}
            >
              <div
                style={{
                  background: T.surface,
                  borderRadius: 28,
                  border: `1px solid ${T.line}`,
                  boxShadow: "0 10px 36px rgba(12,10,9,0.04)",
                  overflow: "hidden",
                }}
              >
                {/* Module Header */}
                <div style={{ padding: "24px 26px 18px", borderBottom: `1px solid ${T.line}`, background: T.white }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Icon d={ICONS.calendar} size={16} color={T.ink} />
                    <h2 style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                      Book Consultation
                    </h2>
                  </div>
                  <p style={{ fontSize: 12.5, color: T.muted }}>
                    Select preferred consultation date & clinical slot
                  </p>
                </div>

                <div style={{ padding: "24px 26px" }}>
                  {/* Date Input */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>
                      Date of Consultation
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="date-input"
                    />
                  </div>

                  {/* Slot Title + Open count */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Available Slots
                    </label>
                    {availability.length > 0 && (
                      <span style={{ fontSize: 11.5, color: T.ink, fontWeight: 500 }}>
                        {availableCount} slots open
                      </span>
                    )}
                  </div>

                  {/* Slots Grid */}
                  {availability.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                      {availability.map((slot, i) => {
                        const isSelected = selectedSlot?._id === slot._id;
                        const isDigital = slot.type === "DIGITAL";

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                            style={{
                              padding: "10px 8px",
                              borderRadius: 14,
                              border: `1px solid ${isSelected ? T.ink : slot.isBooked ? T.line : T.line}`,
                              background: isSelected ? T.ink : slot.isBooked ? T.surface2 : T.white,
                              cursor: slot.isBooked ? "not-allowed" : "pointer",
                              textAlign: "center",
                              transition: "all 0.18s ease",
                              opacity: slot.isBooked ? 0.45 : 1,
                            }}
                          >
                            <p
                              style={{
                                fontSize: 12.5,
                                fontWeight: 500,
                                color: isSelected ? "white" : slot.isBooked ? T.muted : T.ink,
                                textDecoration: slot.isBooked ? "line-through" : "none",
                              }}
                            >
                              {slot.Time.Start}
                            </p>
                            <p
                              style={{
                                fontSize: 10,
                                marginTop: 2,
                                color: isSelected ? "rgba(255,255,255,0.7)" : T.muted,
                                fontWeight: 400,
                              }}
                            >
                              {isDigital ? "Digital" : "In-Person"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "30px 16px", background: T.white, borderRadius: 16, border: `1px dashed ${T.line}` }}>
                      <Icon d={ICONS.clock} size={24} color={T.muted} style={{ margin: "0 auto 8px" }} />
                      <p style={{ fontSize: 13, color: T.muted }}>
                        No open consultation slots on this date.<br />Please choose another day.
                      </p>
                    </div>
                  )}

                  {/* Selected Preview Capsule */}
                  <AnimatePresence>
                    {selectedSlot && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        style={{
                          marginTop: 16,
                          background: T.white,
                          borderRadius: 14,
                          padding: "12px 14px",
                          border: `1px solid ${T.line}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon d={ICONS.check} size={12} color={T.ink} />
                        </div>
                        <div>
                          <p style={{ fontSize: 12.5, fontWeight: 500, color: T.ink }}>
                            {selectedSlot.Time.Start} – {selectedSlot.Time.End}
                          </p>
                          <p style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>
                            {selectedSlot.type === "DIGITAL" ? "Encrypted Video Consultation" : "Clinic In-Person Visit"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Booking Button */}
                  <div style={{ marginTop: 18 }}>
                    <Magnetic strength={0.25}>
                      <button
                        type="button"
                        onClick={handleBook}
                        disabled={!selectedSlot || isLoading}
                        className="btn-ink"
                      >
                        {isLoading ? (
                          <>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", animation: "spin 0.8s linear infinite" }} />
                            Confirming…
                          </>
                        ) : (
                          <>
                            Confirm Booking
                            <Icon d={ICONS.arrow} size={14} color="white" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>

                  <p style={{ textAlign: "center", fontSize: 11.5, color: T.muted, marginTop: 12 }}>
                    Free clinical cancellation up to 2 hours before visit
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Confirmation Toast */}
        <AnimatePresence>
          {toast && <Toast msg={toast} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DoctorProfile;