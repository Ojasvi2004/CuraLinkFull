import React, { useState, useEffect, useMemo, useRef } from "react";
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
  search:      ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  pin:         ["M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z", "M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  video:       ["M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"],
  clock:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  arrow:       "M17 8l4 4m0 0l-4 4m4-4H3",
  check:       ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  stethoscope: ["M4.5 11a7.5 7.5 0 0 0 15 0V5.5", "M19.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z", "M12 18.5v3M9 21.5h6"],
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  filter:      "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L16 11.414V17l-4 4v-8.586L3.293 6.707A1 1 0 0 1 3 6V4z",
};

const SPECIALTIES = [
  "All Specialties", "Cardiology", "Pediatrics", "Dermatology", "Orthopedics",
  "Neurology", "Gynecology", "Ophthalmology", "ENT", "Psychiatry", "General Medicine",
];

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
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
      marginBottom: 14,
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
const TiltCard = ({ children, style = {}, max = 4, className = "", ...rest }) => {
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
      className={`doc-card ${className}`}
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
const Magnetic = ({ children, strength = 0.28 }) => {
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
        width={12}
        height={12}
        viewBox="0 0 20 20"
        fill={i <= Math.round(rating) ? T.ink : "#E5E5E5"}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── DOCTOR CARD ───────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, index }) => {
  const [imgErr, setImgErr] = useState(false);

  const initials = (doctor.FullName || "D")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Pick an iridescent orb variant based on index
  const orbList = [ORBS.violet, ORBS.sun, ORBS.sky, ORBS.mint];
  const orbBg = orbList[index % orbList.length];

  return (
    <TiltCard style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      
      {/* Visual Header / Avatar */}
      <div
        style={{
          position: "relative",
          height: 180,
          background: T.surface2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${T.line}`,
          overflow: "hidden",
        }}
      >
        {doctor.ProfilePicture && !imgErr ? (
          <img
            src={doctor.ProfilePicture}
            alt={doctor.FullName}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: "50%",
              background: orbBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 500,
              color: "white",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 24px rgba(12,10,9,0.12)",
            }}
          >
            {initials}
          </div>
        )}

        {/* Digital Teleconsult Badge */}
        {doctor.availableDigital && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${T.line}`,
              borderRadius: 20,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: T.ink }}>Online Consult</span>
          </div>
        )}
      </div>

      {/* Details Body */}
      <div style={{ padding: "22px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        
        {/* Specialty Tag */}
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              display: "inline-block",
              background: T.white,
              border: `1px solid ${T.line}`,
              color: T.ink,
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: 20,
              letterSpacing: "-0.01em",
            }}
          >
            {doctor.Speciality}
          </span>
        </div>

        {/* Doctor Name */}
        <h3
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: T.ink,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          {doctor.FullName}
        </h3>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12, color: T.body }}>
          <Icon d={ICONS.pin} size={13} color={T.muted} />
          <span style={{ fontSize: 13 }}>
            {doctor.ClinicDetails?.city}
            {doctor.ClinicDetails?.state ? `, ${doctor.ClinicDetails.state}` : ""}
          </span>
        </div>

        {/* Rating & Experience */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            background: T.white,
            border: `1px solid ${T.line}`,
            borderRadius: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Stars rating={doctor.rating || 0} />
            <span style={{ fontSize: 12, fontWeight: 500, color: T.ink, fontVariantNumeric: "tabular-nums" }}>
              {doctor.rating ? doctor.rating.toFixed(1) : "5.0"}
            </span>
          </div>

          {doctor.experience && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.muted }}>
              <Icon d={ICONS.clock} size={12} color={T.muted} />
              <span style={{ fontSize: 11.5, color: T.body }}>{doctor.experience} yrs</span>
            </div>
          )}
        </div>

        {/* Clinic Name */}
        {doctor.ClinicDetails?.clinicName && (
          <p style={{ fontSize: 12, color: T.muted, marginBottom: 18, fontStyle: "italic" }}>
            {doctor.ClinicDetails.clinicName}
          </p>
        )}

        {/* Action Button */}
        <div style={{ marginTop: "auto" }}>
          <Magnetic strength={0.25}>
            <Link to={`/doctors/${doctor._id}`} className="doc-book-btn">
              View Profile
              <Icon d={ICONS.arrow} size={14} color="white" />
            </Link>
          </Magnetic>
        </div>

      </div>

    </TiltCard>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

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

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/api/user/getDoctorList`);
      if (res.data.success) setDoctors(res.data.doctorList);
    } catch (e) {
      console.error("Error fetching doctors", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = useMemo(() => {
    let list = doctors.filter(
      (d) =>
        d.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!specialtyFilter || d.Speciality?.toLowerCase().includes(specialtyFilter.toLowerCase())) &&
        (!locationFilter || d.ClinicDetails?.city?.toLowerCase().includes(locationFilter.toLowerCase())) &&
        (!onlineOnly || d.availableDigital)
    );
    if (sortBy === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "experience") list = [...list].sort((a, b) => (b.experience || 0) - (a.experience || 0));
    return list;
  }, [doctors, searchTerm, specialtyFilter, locationFilter, onlineOnly, sortBy]);

  const cities = useMemo(
    () => [...new Set(doctors.map((d) => d.ClinicDetails?.city).filter(Boolean))].slice(0, 8),
    [doctors]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dir-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .doc-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 24px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .doc-card::before {
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
        .doc-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .doc-card:hover::before {
          opacity: 1;
        }

        .doc-book-btn {
          width: 100%;
          height: 44px;
          border-radius: 999px;
          background: ${T.ink};
          color: white;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .doc-book-btn:hover {
          box-shadow: 0 10px 28px rgba(12,10,9,0.22);
          transform: translateY(-1px);
        }
        .doc-book-btn svg {
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .doc-book-btn:hover svg {
          transform: translateX(4px);
        }

        .filter-input {
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px 12px 38px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .filter-input:focus {
          border-color: ${T.ink};
          box-shadow: 0 2px 12px rgba(12,10,9,0.04);
        }

        .filter-select {
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .filter-select:focus {
          border-color: ${T.ink};
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="dir-root"
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

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL HERO ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{ textAlign: "center", marginBottom: 44 }}
          >
            <Pill>Verified Clinical Directory</Pill>
            <WordReveal
              as="h1"
              text={"Find Your Specialist"}
              style={{
                fontSize: "clamp(34px, 5vw, 58px)",
                fontWeight: 300,
                color: T.ink,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                marginBottom: 14,
              }}
            />
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 15.5,
                color: T.body,
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Browse our verified network of credentialed specialists across 120+ cities. Book online consultations or in-person visits with complete ease.
            </motion.p>
          </motion.div>

          {/* ──────────────── 2. FILTER CONSOLE ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            style={{
              background: T.surface,
              borderRadius: 24,
              padding: "24px 24px 20px",
              marginBottom: 20,
              border: `1px solid ${T.line}`,
              boxShadow: "0 10px 30px rgba(12,10,9,0.03)",
            }}
          >
            {/* Primary Inputs Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              
              {/* Doctor Name */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon d={ICONS.search} size={15} color={T.muted} />
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctor by name…"
                  className="filter-input"
                />
              </div>

              {/* Specialty Select */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon d={ICONS.stethoscope} size={15} color={T.muted} />
                </div>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="filter-select"
                  style={{ paddingLeft: 38 }}
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s === "All Specialties" ? "" : s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* City or Location */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon d={ICONS.pin} size={15} color={T.muted} />
                </div>
                <input
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="City or location…"
                  className="filter-input"
                />
              </div>

              {/* Sort Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="default">Default Order</option>
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>

            </div>

            {/* Quick Filter Pill Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                marginTop: 18,
                paddingTop: 16,
                borderTop: `1px solid ${T.line}`,
              }}
            >
              {/* Online Only Toggle */}
              <button
                type="button"
                onClick={() => setOnlineOnly((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: `1px solid ${onlineOnly ? T.ink : T.line}`,
                  background: onlineOnly ? T.ink : T.white,
                  color: onlineOnly ? "white" : T.body,
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon d={ICONS.video} size={13} color={onlineOnly ? "white" : T.muted} />
                Online Consult Only
              </button>

              {/* City Pills */}
              {cities.slice(0, 5).map((city) => {
                const active = locationFilter === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setLocationFilter(active ? "" : city)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1px solid ${active ? T.ink : T.line}`,
                      background: active ? T.ink : T.white,
                      color: active ? "white" : T.body,
                      fontSize: 12.5,
                      fontWeight: 400,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {city}
                  </button>
                );
              })}

              {/* Clear All Button */}
              {(searchTerm || specialtyFilter || locationFilter || onlineOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSpecialtyFilter("");
                    setLocationFilter("");
                    setOnlineOnly(false);
                  }}
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    background: "transparent",
                    border: `1px dashed ${T.line}`,
                    padding: "6px 14px",
                    borderRadius: 20,
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  Reset Filters
                </button>
              )}

              {/* Results Count */}
              <span
                style={{
                  fontSize: 12.5,
                  color: T.muted,
                  marginLeft: (searchTerm || specialtyFilter || locationFilter || onlineOnly) ? 0 : "auto",
                }}
              >
                {filtered.length} specialist{filtered.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </motion.div>

          {/* ──────────────── 3. SPECIALTY TABS ──────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
          >
            {["All Specialties", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology"].map((s) => {
              const val = s === "All Specialties" ? "" : s;
              const active = specialtyFilter === val;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecialtyFilter(val)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 20,
                    border: `1px solid ${active ? T.ink : T.line}`,
                    background: active ? T.ink : T.white,
                    color: active ? "white" : T.body,
                    fontSize: 12.5,
                    fontWeight: active ? 500 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </motion.div>

          {/* ──────────────── 4. DOCTORS GRID ──────────────── */}
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
                Syncing with medical registry…
              </p>
            </div>
          ) : filtered.length === 0 ? (
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
                <Icon d={ICONS.stethoscope} size={24} color={T.ink} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>
                No specialists matched
              </h3>
              <p style={{ color: T.muted, fontSize: 14, maxWidth: 360, margin: "0 auto 20px" }}>
                Try adjusting your search criteria, removing filters, or searching for a broader location.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSpecialtyFilter("");
                  setLocationFilter("");
                  setOnlineOnly(false);
                }}
                style={{
                  background: T.ink,
                  color: "white",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 22,
              }}
            >
              <AnimatePresence>
                {filtered.map((doc, i) => (
                  <DoctorCard key={doc._id} doctor={doc} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
};

export default FindDoctors;