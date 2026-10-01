import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

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
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  doc:      "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  bell:     ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  sun:      ["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
};

// ─── QUICK LINK DATA ──────────────────────────────────────────────────────────
const quickLinks = [
  {
    title: "My Appointments",
    description: "Manage upcoming and historical clinical consultations in real-time.",
    icon: ICONS.calendar,
    link: "/my-appointments",
    tag: "Consultations",
    orb: ORBS.violet,
  },
  {
    title: "Find Doctors",
    description: "Access our verified network of credentialed specialists across 120+ cities.",
    icon: ICONS.search,
    link: "/find-doctors",
    tag: "Directory",
    orb: ORBS.sky,
  },
  {
    title: "AI Symptom Analyzer",
    description: "Experience guided clinical triage powered by predictive machine learning.",
    icon: ICONS.ai,
    link: "/symptom-analyzer",
    tag: "AI Intelligence",
    orb: ORBS.mint,
  },
  {
    title: "Health Records",
    description: "Comprehensive medical documents, biometric histories, and verified lab results.",
    icon: ICONS.doc,
    link: "/health-records",
    tag: "Encrypted Vault",
    orb: ORBS.sun,
  },
  {
    title: "Notifications",
    description: "Timely appointment alerts, physician notes, and prescription renewal pings.",
    icon: ICONS.bell,
    link: "/notifications",
    tag: "Live Updates",
    orb: ORBS.violet,
  },
];

const HEALTH_TIP =
  "Staying hydrated is one of the simplest ways to support cellular energy, cognitive focus, and systemic immunity. Aim for 8 glasses of water a day — your body will thank you.";

// ─── GREETING HELPER ──────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE } },
};

// ─── WORD REVEAL COMPONENT ────────────────────────────────────────────────────
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

// ─── PILL BADGE ───────────────────────────────────────────────────────────────
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

// ─── 3D TILT CARD WITH SPOTLIGHT ──────────────────────────────────────────────
const TiltCard = ({ children, style = {}, max = 4, className = "", ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className={`dash-tilt-card ${className}`}
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

// ─── MAGNETIC WRAPPER ────────────────────────────────────────────────────────
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

// ─── SCROLL PROGRESS INDICATOR ───────────────────────────────────────────────
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

// ─── MAIN DASHBOARD COMPONENT ─────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useContext(Authcontext);
  const userName = user?.name || "there";

  const [time, setTime] = useState(new Date());
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const reduce = useReducedMotion();

  // Background Parallax
  const orbA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -180]);
  const orbB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);

  // Cursor Parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 45, damping: 20 });
  const smy = useSpring(my, { stiffness: 45, damping: 20 });
  const mouseOrbX = useTransform(smx, [-0.5, 0.5], [-35, 35]);
  const mouseOrbY = useTransform(smy, [-0.5, 0.5], [-25, 25]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dash-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .dash-tilt-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 24px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .dash-tilt-card::before {
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
        .dash-tilt-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .dash-tilt-card:hover::before {
          opacity: 1;
        }

        .dash-link-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          color: ${T.ink};
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dash-tilt-card:hover .dash-link-action svg {
          transform: translateX(4px);
        }
        .dash-link-action svg {
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .metric-cell {
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 18px;
          padding: 16px 18px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .metric-cell:hover {
          border-color: #D6D3D1;
          transform: translateY(-2px);
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="dash-root"
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
            x: mouseOrbX,
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
            opacity: 0.26,
            filter: "blur(65px)",
            pointerEvents: "none",
            y: orbB,
            x: mouseOrbY,
          }}
        />

        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL BENTO HERO ──────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            style={{ marginBottom: 44 }}
          >
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.line}`,
                borderRadius: 32,
                padding: "clamp(32px, 5vw, 48px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Internal ambient aura */}
              <div
                style={{
                  position: "absolute",
                  top: -80,
                  right: -60,
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  background: ORBS.violet,
                  opacity: 0.45,
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, alignItems: "center", position: "relative", zIndex: 1 }}>
                
                {/* Greeting Side */}
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#10B981",
                        boxShadow: "0 0 0 4px rgba(16,185,129,0.18)",
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.body, letterSpacing: "-0.01em" }}>
                      {getGreeting()}, {userName}
                    </span>
                  </div>

                  <WordReveal
                    as="h1"
                    text={"Your Personal\nHealth Console"}
                    style={{
                      fontSize: "clamp(32px, 4.8vw, 56px)",
                      fontWeight: 300,
                      color: T.ink,
                      lineHeight: 1.08,
                      letterSpacing: "-0.035em",
                      marginBottom: 14,
                    }}
                  />

                  <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, lineHeight: 1.7, maxWidth: 440 }}>
                    Integrated medical records, appointments, and diagnostic intelligence curated for you.
                  </motion.p>
                </div>

                {/* Live Real-time Clock Console */}
                <motion.div
                  variants={fadeUp}
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${T.line}`,
                    borderRadius: 24,
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 160,
                    boxShadow: "0 10px 30px rgba(12,10,9,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.line}`, paddingBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon d={ICONS.clock} size={13} color={T.muted} />
                      <span style={{ fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Local Observatory Time
                      </span>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 400, color: T.body }}>
                      {dateStr}
                    </span>
                  </div>

                  <div style={{ padding: "12px 0 6px" }}>
                    <p
                      style={{
                        fontSize: "clamp(28px, 3.8vw, 42px)",
                        fontWeight: 300,
                        color: T.ink,
                        letterSpacing: "-0.03em",
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                      }}
                    >
                      {timeStr}
                    </p>
                  </div>

                  {/* Micro Indicators */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 10 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.white, border: `1px solid ${T.line}`, borderRadius: 20, padding: "4px 10px" }}>
                      <Icon d={ICONS.calendar} size={11} color={T.ink} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: T.ink }}>Tomorrow, 10:00 AM</span>
                    </div>

                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.white, border: `1px solid ${T.line}`, borderRadius: 20, padding: "4px 10px" }}>
                      <Icon d={ICONS.heart} size={11} color={T.ink} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: T.ink }}>Health Score: Optimal</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.section>

          {/* ──────────────── 2. QUICK ACCESS CARDS ──────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            style={{ marginBottom: 44 }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, padding: "0 4px" }}>
              <div>
                <Pill>Platform Navigation</Pill>
                <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                  Quick Access
                </h2>
              </div>
              <span style={{ fontSize: 13, color: T.muted }}>5 Services Available</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {quickLinks.map((item, i) => (
                <TiltCard key={i} style={{ padding: "28px 24px", display: "flex", flexDirection: "column" }}>
                  <Link to={item.link} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
                    
                    {/* Top Row: Icon + Tag */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          background: T.white,
                          border: `1px solid ${T.line}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon d={item.icon} size={20} color={T.ink} />
                      </div>

                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 500,
                          color: T.ink,
                          background: T.white,
                          border: `1px solid ${T.line}`,
                          padding: "3px 10px",
                          borderRadius: 20,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3
                      style={{
                        fontSize: 17.5,
                        fontWeight: 400,
                        color: T.ink,
                        letterSpacing: "-0.02em",
                        marginBottom: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p style={{ fontSize: 13.5, color: T.body, lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                      {item.description}
                    </p>

                    {/* Action link */}
                    <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 14, marginTop: "auto" }}>
                      <span className="dash-link-action">
                        Open Service
                        <Icon d={ICONS.arrow} size={13} color={T.ink} />
                      </span>
                    </div>

                  </Link>
                </TiltCard>
              ))}
            </div>
          </motion.section>

          {/* ──────────────── 3. BOTTOM DATA GRID ──────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "stretch" }}
          >
            {/* Snapshot Matrix */}
            <motion.div
              variants={fadeUp}
              style={{
                gridColumn: "span 1",
                background: T.surface,
                borderRadius: 28,
                border: `1px solid ${T.line}`,
                padding: "30px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.activity} size={15} color={T.ink} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                      Health Snapshot
                    </span>
                  </div>

                  <Link
                    to="/health-records"
                    style={{
                      fontSize: 12.5,
                      color: T.ink,
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    View All <Icon d={ICONS.arrow} size={12} color={T.ink} />
                  </Link>
                </div>

                {/* 2x2 Metric Cell Matrix */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { title: "Health Records", value: "14", icon: ICONS.doc      },
                    { title: "Appointments",   value: "2",  icon: ICONS.calendar },
                    { title: "Lab Reports",    value: "5",  icon: ICONS.activity },
                    { title: "Health Score",   value: "98%",icon: ICONS.heart    },
                  ].map((stat, i) => (
                    <div key={i} className="metric-cell">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>{stat.title}</span>
                        <Icon d={stat.icon} size={14} color={T.ink} />
                      </div>
                      <p style={{ fontSize: 24, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status footer */}
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: T.muted }}>Verified sync · Today</span>
                <span style={{ fontSize: 12, color: T.ink, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon d={ICONS.check} size={12} color="#10B981" /> Profile Active
                </span>
              </div>
            </motion.div>

            {/* Health Tip Card — High-End Luxury Dark Card */}
            <motion.div
              variants={fadeUp}
              style={{
                gridColumn: "span 1",
                background: T.ink,
                borderRadius: 28,
                padding: "32px 30px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "white",
              }}
            >
              {/* Internal Iridescent glow */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: ORBS.violet,
                  opacity: 0.35,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon d={ICONS.sparkle} size={15} color="white" />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
                    Wellness Editorial
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "clamp(15px, 2vw, 17px)",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.92)",
                    fontStyle: "italic",
                    letterSpacing: "-0.01em",
                  }}
                >
                  "{HEALTH_TIP}"
                </p>
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderTop: "1px solid rgba(255,255,255,0.14)",
                  paddingTop: 18,
                  marginTop: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon d={ICONS.heart} size={13} color="rgba(255,255,255,0.8)" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Daily Habit Focus</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "white" }}>Continuous Care</span>
              </div>
            </motion.div>

          </motion.section>

        </div>
      </div>
    </>
  );
};

export default Dashboard;