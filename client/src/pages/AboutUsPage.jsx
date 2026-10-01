import React, { useEffect, useRef, useState } from "react";
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
import { NavLink } from "react-router-dom";

// ─── THEME TOKENS (minimal, monochrome, soft pastel orbs) ────────────────────
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

// ─── SHARED ICON PRIMITIVE ───────────────────────────────────────────────────
const Icon = ({ d, size = 22, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mission:  ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m4 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"],
  vision:   ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  pill:     "M10.5 3.5a4 4 0 0 1 5.657 5.657l-7.07 7.07a4 4 0 0 1-5.658-5.656l7.07-7.07z M14 10l-4 4",
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chat:     ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  bulb:     ["M9 18h6", "M10 22h4", "M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C4.19 13.47 3 11.38 3 9a7 7 0 0 1 7-7z"],
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
};

// ─── IMAGE ASSETS ────────────────────────────────────────────────────────────
const ourStoryImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1170&q=80";
const howItWorksImage = "https://images.unsplash.com/photo-1581091226809-5c04E0607502?auto=format&fit=crop&w=774&q=80";

// Iridescent orb gradients (same look as the hero orbs in the inspiration)
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

const teamMembers = [
  { name: "Dr. Evelyn Reed", role: "Chief Medical Officer", initials: "ER", color: T.ink, bg: T.surface, orb: ORBS.violet, bio: "With 20+ years in clinical practice, Dr. Reed ensures CuraLink's medical guidance is sound, ethical, and patient-first." },
  { name: "Alex Chen",       role: "Lead AI Engineer",     initials: "AC", color: T.ink, bg: T.surface, orb: ORBS.sun,    bio: "Alex spearheads our AI development, building intelligent systems that are powerful yet deeply human in feel." },
  { name: "Priya Sharma",    role: "Head of Product & UX", initials: "PS", color: T.ink, bg: T.surface, orb: ORBS.sky,    bio: "Priya is obsessed with the user — leading design and product strategy so CuraLink feels effortless and intuitive." },
];

const VALUES = [
  "Patient-Centricity Above All",
  "Unwavering Innovation",
  "Trust & Transparency",
  "Universal Accessibility",
  "Empathy in Every Interaction",
  "Excellence in Delivery",
];

const HOW_IT_WORKS = [
  { step: 1, icon: ICONS.ai,       color: T.ink, bg: T.surface, title: "Tell Us Your Symptoms",  desc: "Use our AI Symptom Analyzer to get intelligent guidance on which specialist is right for you."  },
  { step: 2, icon: ICONS.search,   color: T.ink, bg: T.surface, title: "Find Your Doctor",       desc: "Browse our verified network. Filter by specialty, location, ratings, and more."                },
  { step: 3, icon: ICONS.calendar, color: T.ink, bg: T.surface, title: "Book with Ease",         desc: "View real-time availability and confirm your in-person or digital appointment in seconds."       },
  { step: 4, icon: ICONS.chat,     color: T.ink, bg: T.surface, title: "Consult & Connect",      desc: "Attend your visit or join a secure video call — your care, your way."                          },
];

const COMMITMENTS = [
  { icon: ICONS.heart, color: T.ink, bg: T.surface, title: "Exceptional Patient Care", desc: "Your health journey is unique. We provide tools and connections that respect your individuality with empathy and professionalism." },
  { icon: ICONS.lock,  color: T.ink, bg: T.surface, title: "Data Security & Privacy",  desc: "Built with enterprise-grade security. Your health data is encrypted, private, and never sold — ever."                         },
  { icon: ICONS.bulb,  color: T.ink, bg: T.surface, title: "Continuous Innovation",    desc: "We're always evolving. From AI breakthroughs to UX refinements — every update makes CuraLink smarter for you."                },
];

const STATS = [
  { label: "Verified Doctors", to: 2400, decimals: 0, suffix: "+"   },
  { label: "Patients Served",  to: 180,  decimals: 0, suffix: "K+"  },
  { label: "Cities Covered",   to: 120,  decimals: 0, suffix: "+"   },
  { label: "Avg. Rating",      to: 4.9,  decimals: 1, suffix: " ★"  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};
const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};
const clipReveal = {
  hidden:  { clipPath: "inset(14% 14% 14% 14% round 36px)", opacity: 0 },
  visible: { clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

// ─── HOOKS / HELPERS ─────────────────────────────────────────────────────────
// Parallax value that collapses to a constant when the user prefers reduced motion
const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: T.ink, transformOrigin: "0% 50%", scaleX, zIndex: 60 }}
    />
  );
};

// ─── SECTION WRAPPER (replays when scrolling down AND back up) ───────────────
const Section = ({ children, style = {}, once = false }) => (
  <motion.section
    initial="hidden" whileInView="visible"
    viewport={{ once, amount: 0.15 }}
    variants={stagger}
    style={style}
  >
    {children}
  </motion.section>
);

// ─── WORD-BY-WORD MASK REVEAL ────────────────────────────────────────────────
const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.26em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// ─── PILL LABEL (small muted eyebrow, like "ElevenCreative") ─────────────────
const Pill = ({ children, color = T.muted }) => (
  <motion.span variants={fadeUp} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 13, fontWeight: 500, color,
    marginBottom: 16, letterSpacing: "-0.005em",
  }}>
    <motion.span
      animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-flex" }}
    >
      <Icon d={ICONS.sparkle} size={12} color={color} />
    </motion.span>
    {children}
  </motion.span>
);

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
const SectionHeading = ({ title, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 56 }}>
    <WordReveal text={title} style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, color: T.ink, lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 14 }} />
    {sub && <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>{sub}</motion.p>}
  </div>
);

// ─── MAGNETIC WRAPPER (buttons gently follow the cursor) ─────────────────────
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
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

// ─── TILT CARD (3D tilt + cursor spotlight) ──────────────────────────────────
const TiltCard = ({ children, style = {}, max = 5, ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="about-card"
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, ...style }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// ─── COUNT-UP STAT ───────────────────────────────────────────────────────────
const Stat = ({ to, decimals, suffix, label, delay = 0 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce) { setV(to); return; }
    if (!inView) { setV(0); return; }
    const c = animate(0, to, { duration: 1.9, delay, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, to, delay, reduce]);
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, backgroundColor: "#FFFFFF" }}
      transition={{ duration: 0.25 }}
      style={{ background: "rgba(245,244,242,0.85)", backdropFilter: "blur(8px)", border: `1px solid ${T.line}`, borderRadius: 18, padding: "12px 22px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 124 }}
    >
      <span style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </span>
      <span style={{ fontSize: 12, fontWeight: 400, color: T.muted, marginTop: 2 }}>{label}</span>
    </motion.div>
  );
};

// ─── FLOATING ORB (scroll parallax + mouse parallax + idle float) ────────────
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

// ─── VALUES MARQUEE ──────────────────────────────────────────────────────────
const Marquee = () => (
  <div className="marquee" aria-hidden>
    <div className="marquee-track">
      {[...VALUES, ...VALUES].map((v, i) => (
        <span key={i} className="marquee-item">
          <span className="marquee-dot" style={{ background: [ORBS.violet, ORBS.sun, ORBS.sky, ORBS.mint][i % 4] }} />
          {v}
        </span>
      ))}
    </div>
  </div>
);

// ─── PARALLAX IMAGE FRAME (clip reveal + inner scroll parallax) ──────────────
const ParallaxImage = ({ src, alt, height, sticky = false }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useParallax(scrollYProgress, -8, 8);
  const yPct = useTransform(y, (v) => `${v}%`);
  return (
    <motion.div
      ref={ref}
      variants={clipReveal}
      style={{ position: sticky ? "sticky" : "relative", top: sticky ? 110 : undefined, height, overflow: "hidden", border: `1px solid ${T.line}`, borderRadius: 28 }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ position: "absolute", left: 0, top: "-12%", width: "100%", height: "124%", objectFit: "cover", display: "block", y: yPct }}
      />
    </motion.div>
  );
};

// ─── HOW IT WORKS: scroll-drawn timeline ─────────────────────────────────────
const StepsTimeline = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });
  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setActive(Math.max(0, Math.min(HOW_IT_WORKS.length - 1, Math.floor(v * HOW_IT_WORKS.length))));
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Track + scroll-driven fill */}
      <div style={{ position: "absolute", left: 23, top: 24, bottom: 24, width: 1, background: T.line }} />
      <motion.div style={{ position: "absolute", left: 23, top: 24, bottom: 24, width: 1, background: T.ink, transformOrigin: "50% 0%", scaleY: fill }} />

      {HOW_IT_WORKS.map((item, i) => {
        const reached = i <= active;
        return (
          <motion.div key={i} variants={fadeUp} style={{ display: "flex", gap: 18, position: "relative", paddingBottom: i < HOW_IT_WORKS.length - 1 ? 36 : 0 }}>
            <motion.div
              animate={{ scale: i === active ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{
                flexShrink: 0, width: 48, height: 48, borderRadius: 14,
                background: reached ? T.ink : T.surface,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${reached ? T.ink : T.line}`, position: "relative", zIndex: 1,
                transition: "background 0.45s ease, border-color 0.45s ease",
              }}
            >
              <Icon d={item.icon} size={20} color={reached ? "#FFFFFF" : item.color} />
            </motion.div>
            <div style={{ paddingTop: 4, opacity: reached ? 1 : 0.42, transition: "opacity 0.45s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.body, background: T.white, border: `1px solid ${T.line}`, padding: "2px 10px", borderRadius: 20 }}>Step {item.step}</span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em", marginBottom: 4 }}>{item.title}</h4>
              <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();

  const contentY = useParallax(scrollYProgress, 0, 140);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94]);
  const orbA = useParallax(scrollYProgress, 0, -260);
  const orbB = useParallax(scrollYProgress, 0, 200);
  const orbC = useParallax(scrollYProgress, 0, -120);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
    >
      {/* Background orbs */}
      <Orb size={460} bg={ORBS.violet} opacity={0.4} blur={50} pos={{ top: -140, right: -120 }} scrollY={orbA} mx={mx} my={my} depth={1.2} dur={11} />
      <Orb size={380} bg={ORBS.sky}    opacity={0.34} blur={50} pos={{ bottom: -120, left: -100 }} scrollY={orbB} mx={mx} my={my} depth={0.8} dur={13} delay={1} />
      <Orb size={120} bg={ORBS.sun}    opacity={0.5} blur={24} pos={{ top: "30%", left: "9%" }} scrollY={orbC} mx={mx} my={my} depth={2} dur={8} delay={0.5} />
      <Orb size={80}  bg={ORBS.mint}   opacity={0.55} blur={14} pos={{ top: "22%", right: "12%" }} scrollY={orbC} mx={mx} my={my} depth={2.4} dur={7} delay={1.5} />

      <motion.div style={{ position: "relative", zIndex: 1, maxWidth: 840, margin: "0 auto", padding: "120px 24px 90px", textAlign: "center", y: contentY, opacity: contentOpacity, scale: contentScale }}>

        {/* Floating badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", border: `1px solid ${T.line}`, borderRadius: 40, padding: "6px 16px 6px 8px", marginBottom: 30 }}>
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
          <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>Trusted healthcare platform</span>
        </motion.div>

        <WordReveal
          as="h1"
          text="About CuraLink"
          initial="hidden"
          animate="visible"
          style={{ fontSize: "clamp(44px, 7.5vw, 92px)", fontWeight: 300, color: T.ink, lineHeight: 1.04, letterSpacing: "-0.04em", marginBottom: 26 }}
        />

        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
          style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.65, maxWidth: 620, margin: "0 auto 42px" }}>
          Pioneering a future where intelligent technology and compassionate healthcare converge — making quality medical support accessible, understandable, and deeply personal.
        </motion.p>

        {/* Stat pills */}
        <motion.div initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } } }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {STATS.map((s, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Stat {...s} delay={0.9 + i * 0.1} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
        style={{ position: "absolute", bottom: 28, left: "50%", x: "-50%", opacity: contentOpacity }}
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
    </section>
  );
};

// ─── CTA ─────────────────────────────────────────────────────────────────────
const CTA = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wrapScale = useTransform(scrollYProgress, [0, 0.35, 1], reduce ? [1, 1, 1] : [0.94, 1, 1]);
  const orbY1 = useParallax(scrollYProgress, -80, 80);
  const orbY2 = useParallax(scrollYProgress, 70, -70);
  const rot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-25, 25]);

  return (
    <Section style={{ padding: "0 24px 96px" }}>
      <motion.div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", scale: wrapScale }}>
        <motion.div variants={scaleIn} style={{ background: T.ink, borderRadius: 32, padding: "clamp(44px,6vw,80px) clamp(28px,6vw,72px)", position: "relative", overflow: "hidden" }}>

          {/* Decorative orbs inside CTA */}
          <motion.div style={{ position: "absolute", top: -90, right: -70, width: 340, height: 340, borderRadius: "50%", background: ORBS.violet, opacity: 0.55, filter: "blur(28px)", pointerEvents: "none", y: orbY1, rotate: rot }} />
          <motion.div style={{ position: "absolute", bottom: -90, left: 60, width: 240, height: 240, borderRadius: "50%", background: ORBS.sun, opacity: 0.38, filter: "blur(40px)", pointerEvents: "none", y: orbY2 }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Badge */}
            <motion.div variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
              <Icon d={ICONS.sparkle} size={13} color="rgba(255,255,255,0.9)" />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>Start your journey</span>
            </motion.div>

            <WordReveal
              text={"Ready to Experience\nSmarter Healthcare?"}
              style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, color: "white", lineHeight: 1.1, letterSpacing: "-0.035em", marginBottom: 18 }}
            />
            <motion.p variants={fadeUp} style={{ fontSize: 15.5, color: "rgba(255,255,255,0.72)", maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.7 }}>
              Join CuraLink today and take the first step towards a more connected, empowered health journey.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Magnetic>
                <NavLink to="/signup" className="btn-light">
                  Get Started Free
                  <Icon d={ICONS.arrow} size={15} color={T.ink} />
                </NavLink>
              </Magnetic>
              <Magnetic>
                <NavLink to="/find-doctors" className="btn-ghost">
                  Browse Doctors
                </NavLink>
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AboutUsPage = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      .about-root { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:${T.white}; color:${T.body}; -webkit-font-smoothing:antialiased; }
      .about-root ::selection { background:${T.ink}; color:${T.white}; }

      .about-card { position:relative; isolation:isolate; background:${T.surface}; border-radius:24px; border:1px solid ${T.line}; transition:box-shadow 0.3s, border-color 0.3s; will-change:transform; }
      .about-card::before { content:""; position:absolute; inset:0; border-radius:inherit; z-index:-1; pointer-events:none; opacity:0; transition:opacity 0.3s;
        background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.95), rgba(255,255,255,0) 60%); }
      .about-card:hover { border-color:#D6D3D1; box-shadow:0 18px 50px rgba(12,10,9,0.08); }
      .about-card:hover::before { opacity:1; }

      .learn-more { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:500; color:${T.ink}; cursor:pointer; }
      .learn-more svg { transition:transform 0.3s ${"cubic-bezier(0.22,1,0.36,1)"}; }
      .about-card:hover .learn-more svg { transform:translateX(5px); }

      .btn-light { display:inline-flex; align-items:center; gap:8px; background:#fff; color:${T.ink}; font-weight:500; font-size:14px; padding:14px 28px; border-radius:999px; text-decoration:none; transition:box-shadow 0.25s, transform 0.25s; }
      .btn-light:hover { box-shadow:0 16px 36px rgba(0,0,0,0.35); }
      .btn-light svg { transition:transform 0.3s; }
      .btn-light:hover svg { transform:translateX(4px); }
      .btn-ghost { display:inline-flex; align-items:center; gap:8px; background:transparent; color:#fff; font-weight:500; font-size:14px; padding:14px 28px; border-radius:999px; text-decoration:none; border:1px solid rgba(255,255,255,0.3); transition:background 0.25s, border-color 0.25s; }
      .btn-ghost:hover { background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.5); }
      .btn-light:focus-visible, .btn-ghost:focus-visible { outline:2px solid #fff; outline-offset:3px; }

      .marquee { overflow:hidden; border-top:1px solid ${T.line}; border-bottom:1px solid ${T.line}; padding:22px 0; background:${T.white};
        -webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); }
      .marquee-track { display:flex; width:max-content; animation:marquee 38s linear infinite; }
      .marquee:hover .marquee-track { animation-play-state:paused; }
      .marquee-item { display:inline-flex; align-items:center; gap:16px; padding-right:56px; font-size:clamp(20px,2.6vw,30px); font-weight:300; letter-spacing:-0.025em; color:${T.ink}; white-space:nowrap; }
      .marquee-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; }
      @keyframes marquee { to { transform:translateX(-50%); } }

      @media (prefers-reduced-motion: reduce) {
        .marquee-track { animation:none; }
        .about-card, .btn-light svg, .learn-more svg { transition:none; }
      }
    `}</style>

    <ScrollProgress />

    <div className="about-root" style={{ overflowX: "clip" }}>

      {/* ──────────────── HERO ──────────────── */}
      <Hero />

      {/* ──────────────── VALUES MARQUEE ──────────────── */}
      <Marquee />

      {/* ──────────────── OUR STORY ──────────────── */}
      <Section style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "center" }}>
          <div>
            <Pill>Our Genesis</Pill>
            <WordReveal
              text="The Journey to Simplify Your Healthcare"
              style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 400, color: T.ink, lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: 24 }}
            />
            {[
              "CuraLink was born from a deeply personal observation: navigating the healthcare system can feel like a maze — complex, fragmented, and overwhelming. We saw patients struggling to find the right specialists, enduring long waits, and feeling lost in a sea of medical jargon.",
              "Driven by a desire to make a tangible difference, our founding team — technologists, healthcare advocates, and design thinkers — embarked on a shared mission: to build an intelligent, empathetic bridge connecting patients to the quality care they deserve.",
              "We believe technology, when thoughtfully applied, can humanize healthcare. Every feature in CuraLink, from our AI symptom analyzer to seamless telemedicine, is crafted with the patient's journey at its absolute core.",
            ].map((text, i) => (
              <motion.p key={i} variants={fadeUp} style={{ fontSize: 15, color: T.body, lineHeight: 1.75, marginBottom: 14 }}>{text}</motion.p>
            ))}
          </div>
          <ParallaxImage src={ourStoryImage} alt="CuraLink story" height={460} />
        </div>
      </Section>

      {/* ──────────────── MISSION / VISION / VALUES ──────────────── */}
      <Section style={{ padding: "110px 0", background: T.surface2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Our Guiding Principles" sub="The beliefs and commitments that shape everything we build at CuraLink." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

            {/* Mission */}
            <TiltCard style={{ padding: "32px 28px", overflow: "hidden" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon d={ICONS.mission} size={22} color={T.ink} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 12 }}>Our Mission</h3>
              <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>To empower every individual by providing intuitive, AI-driven access to a network of trusted healthcare professionals, fostering informed decisions and better health outcomes for all.</p>
            </TiltCard>

            {/* Vision */}
            <TiltCard style={{ padding: "32px 28px", overflow: "hidden" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon d={ICONS.vision} size={22} color={T.ink} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 12 }}>Our Vision</h3>
              <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>To be the most trusted digital health platform — seamlessly integrating cutting-edge technology with compassionate, patient-first care that is universally accessible and deeply personalized.</p>
            </TiltCard>

            {/* Values */}
            <TiltCard style={{ padding: "32px 28px", overflow: "hidden" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon d={ICONS.heart} size={22} color={T.ink} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 12 }}>Core Values</h3>
              <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } } }}
                style={{ display: "flex", flexDirection: "column", gap: 9 }}
              >
                {VALUES.map((v, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 6, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon d={ICONS.check} size={11} color={T.ink} />
                    </div>
                    <span style={{ fontSize: 14, color: T.ink, fontWeight: 400 }}>{v}</span>
                  </motion.div>
                ))}
              </motion.div>
            </TiltCard>

          </div>
        </div>
      </Section>

      {/* ──────────────── COMMITMENT ──────────────── */}
      <Section style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Our Commitment to You" sub="At CuraLink, we're not just building a platform — we're building a community founded on trust and dedicated to your well-being." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {COMMITMENTS.map((c, i) => (
              <TiltCard key={i} style={{ padding: "30px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  style={{ width: 48, height: 48, borderRadius: 14, background: T.white, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon d={c.icon} size={22} color={c.color} />
                </motion.div>
                <div>
                  <h4 style={{ fontSize: 19, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 8 }}>{c.title}</h4>
                  <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>{c.desc}</p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${T.line}` }}>
                  <span className="learn-more">
                    Learn more
                    <Icon d={ICONS.arrow} size={13} color={c.color} />
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <Section style={{ padding: "110px 0", background: T.surface2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "start" }}>

          {/* Steps */}
          <div>
            <Pill>How It Works</Pill>
            <WordReveal
              text={"Getting Started\nis Easy"}
              style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 400, color: T.ink, lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: 40 }}
            />
            <StepsTimeline />
          </div>

          <ParallaxImage src={howItWorksImage} alt="How CuraLink works" height={520} sticky />
        </div>
      </Section>

      {/* ──────────────── TEAM ──────────────── */}
      <Section style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Meet Our Core Team" sub="A dedicated group of innovators passionate about transforming healthcare through technology and empathy." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {teamMembers.map((m, i) => (
              <TiltCard key={i} style={{ padding: "36px 26px", textAlign: "center", overflow: "hidden" }}>

                {/* Avatar (floating iridescent orb) */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  style={{ width: 80, height: 80, borderRadius: "50%", background: m.orb, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 20, fontWeight: 500, color: "white", letterSpacing: "-0.01em", textShadow: "0 1px 6px rgba(12,10,9,0.25)", boxShadow: "0 10px 30px rgba(12,10,9,0.10)" }}
                >
                  {m.initials}
                </motion.div>

                <h4 style={{ fontSize: 19, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 8 }}>{m.name}</h4>
                <span style={{ fontSize: 12, fontWeight: 500, color: m.color, background: T.white, border: `1px solid ${T.line}`, padding: "4px 12px", borderRadius: 20 }}>{m.role}</span>
                <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7, marginTop: 16 }}>{m.bio}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────────────── CTA ──────────────── */}
      <CTA />

    </div>
  </>
);

export default AboutUsPage;