import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

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

// Iridescent orb gradients
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── SHARED ICON PRIMITIVE ───────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chat:     ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
};

const STATS = [
  { to: 2400, decimals: 0, suffix: "+",  label: "Verified Doctors" },
  { to: 180,  decimals: 0, suffix: "K+", label: "Patients Served" },
  { to: 4.9,  decimals: 1, suffix: " ★", label: "Average Rating" },
  { to: 120,  decimals: 0, suffix: "+",  label: "Cities Covered" },
];

const TRUST = [
  { icon: ICONS.check,    label: "Verified Doctors" },
  { icon: ICONS.calendar, label: "Easy Appointments" },
  { icon: ICONS.chat,     label: "Digital Consultations" },
  { icon: ICONS.shield,   label: "HIPAA Compliant" },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};

// ─── HELPERS / UTILITIES ─────────────────────────────────────────────────────
const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

// Word-by-word mask reveal
const WordReveal = ({ text, as = "h1", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em", marginRight: "0.24em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// Magnetic button
const Magnetic = ({ children, strength = 0.26 }) => {
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

// Count-up Stat card
const Stat = ({ to, decimals, suffix, label, delay = 0 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.6 });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (reduce) { setV(to); return; }
    if (!inView) { setV(0); return; }
    const c = animate(0, to, { duration: 1.8, delay, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, to, delay, reduce]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, backgroundColor: "#FFFFFF" }}
      transition={{ duration: 0.25 }}
      style={{
        background: "rgba(245,244,242,0.85)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: "12px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 124,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </span>
      <span style={{ fontSize: 12, fontWeight: 400, color: T.muted, marginTop: 2 }}>{label}</span>
    </motion.div>
  );
};

// Parallax Floating Orb
const Orb = ({ size, bg, opacity = 1, blur = 0, pos, scrollY, mx, my, depth = 1, dur = 9, delay = 0 }) => {
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const x = useTransform(smx, [-0.5, 0.5], [-40 * depth, 40 * depth]);
  const my2 = useTransform(smy, [-0.5, 0.5], [-30 * depth, 30 * depth]);

  return (
    <motion.div style={{ position: "absolute", ...pos, y: scrollY, pointerEvents: "none" }}>
      <motion.div style={{ x, y: my2 }}>
        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
          style={{ width: size, height: size, borderRadius: "50%", background: bg, opacity, filter: `blur(${blur}px)` }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Header = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();

  const contentY = useParallax(scrollYProgress, 0, 120);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.95]);

  const orbA = useParallax(scrollYProgress, 0, -240);
  const orbB = useParallax(scrollYProgress, 0, 180);
  const orbC = useParallax(scrollYProgress, 0, -110);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .hero-root { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:${T.white}; color:${T.body}; -webkit-font-smoothing:antialiased; }
        .hero-root ::selection { background:${T.ink}; color:${T.white}; }

        .btn-ink {
          display:inline-flex; align-items:center; gap:8px;
          background:${T.ink}; color:#fff; font-weight:500; font-size:14px;
          padding:14px 28px; border-radius:999px; text-decoration:none;
          transition:box-shadow 0.25s, transform 0.25s;
        }
        .btn-ink:hover { box-shadow:0 16px 36px rgba(12,10,9,0.25); transform:translateY(-1px); }
        .btn-ink svg { transition:transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .btn-ink:hover svg:last-child { transform:translateX(4px); }

        .btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          background:${T.white}; color:${T.ink}; font-weight:500; font-size:14px;
          padding:13px 28px; border-radius:999px; text-decoration:none;
          border:1px solid ${T.line}; transition:background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .btn-outline:hover { background:${T.surface}; border-color:#D6D3D1; transform:translateY(-1px); }

        .floating-status-card {
          position:absolute; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px);
          border-radius:20px; border:1px solid ${T.line}; box-shadow:0 18px 40px rgba(12,10,9,0.06);
          padding:12px 18px; display:flex; align-items:center; gap:12px; z-index:2;
        }

        @media (max-width: 1200px) {
          .floating-status-card { display:none !important; }
        }
      `}</style>

      <div
        ref={ref}
        className="hero-root"
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
      >
        {/* Background Iridescent Orbs */}
        <Orb size={480} bg={ORBS.violet} opacity={0.38} blur={55} pos={{ top: -140, right: -120 }} scrollY={orbA} mx={mx} my={my} depth={1.2} dur={11} />
        <Orb size={390} bg={ORBS.sky}    opacity={0.32} blur={50} pos={{ bottom: -120, left: -100 }} scrollY={orbB} mx={mx} my={my} depth={0.8} dur={13} delay={1} />
        <Orb size={130} bg={ORBS.sun}    opacity={0.45} blur={24} pos={{ top: "32%", left: "8%" }} scrollY={orbC} mx={mx} my={my} depth={2} dur={8} delay={0.5} />
        <Orb size={85}  bg={ORBS.mint}   opacity={0.5} blur={16} pos={{ top: "20%", right: "12%" }} scrollY={orbC} mx={mx} my={my} depth={2.4} dur={7} delay={1.5} />

        {/* ── Floating status card 1 (Health Score) ── */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          style={{ top: "20%", right: "7%" }}
          className="floating-status-card"
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.activity} size={18} color={T.ink} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Health Score</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Excellent ↑ 12%</p>
          </div>
        </motion.div>

        {/* ── Floating status card 2 (Next Appointment) ── */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          style={{ bottom: "20%", left: "6%" }}
          className="floating-status-card"
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.calendar} size={18} color={T.ink} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Next Appointment</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Tomorrow, 10:00 AM</p>
          </div>
        </motion.div>

        {/* ── Main content ── */}
        <motion.div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "120px 24px 80px",
            width: "100%",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
          }}
        >
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            {/* Top badge */}
            <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: `1px solid ${T.line}`, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                <div style={{ position: "relative", width: 26, height: 26 }}>
                  <motion.span
                    animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }}
                  />
                  <div style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.cross} size={13} color="white" />
                  </div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>AI-Powered Healthcare Platform</span>
              </span>
            </motion.div>

            {/* H1 Heading */}
            <WordReveal
              as="h1"
              text={"Find Your Doctor,\nGet AI-Powered Guidance"}
              style={{ fontSize: "clamp(40px, 6.5vw, 84px)", fontWeight: 300, color: T.ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}
            />

            {/* Subtitle */}
            <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
              CuraLink connects you with trusted medical professionals effortlessly. Use our smart symptom analyzer or search directly to find the care you deserve.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 54 }}>
              <Magnetic>
                <Link to="/find-doctors" className="btn-ink">
                  <Icon d={ICONS.search} size={16} color="white" />
                  Search Doctors
                  <Icon d={ICONS.arrow} size={15} color="white" />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link to="/symptom-analyzer" className="btn-outline">
                  <Icon d={ICONS.ai} size={16} color={T.ink} />
                  Analyze Symptoms (AI)
                </Link>
              </Magnetic>
            </motion.div>

            {/* Stats row with count-up animation */}
            <motion.div
              variants={fadeUp}
              style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 38 }}
            >
              {STATS.map((s, i) => (
                <Stat key={i} {...s} delay={0.6 + i * 0.1} />
              ))}
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {TRUST.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${T.line}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                  }}
                >
                  <Icon d={t.icon} size={12} color={T.ink} />
                  <span style={{ fontSize: 12.5, fontWeight: 400, color: T.body, letterSpacing: "-0.01em" }}>{t.label}</span>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{ position: "absolute", bottom: 26, left: "50%", x: "-50%", opacity: contentOpacity }}
          aria-hidden
        >
          <div style={{ width: 22, height: 36, borderRadius: 14, border: `1.5px solid ${T.muted}`, display: "flex", justifyContent: "center", paddingTop: 7 }}>
            <motion.span
              animate={{ y: [0, 11, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 3, height: 7, borderRadius: 3, background: T.ink }}
            />
          </div>
        </motion.div>

      </div>
    </>
  );
};

export default Header;