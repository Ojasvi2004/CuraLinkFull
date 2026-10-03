import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion, animate, useInView, useMotionValue, useReducedMotion,
  useScroll, useSpring, useTransform,
} from "framer-motion";
import DoctorHero from "./HeroSection";     // the neural-brain hero (adjust path)

/* ─── THEME TOKENS (identical to hero + footer) ─────────────────────────── */
const T = {
  ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
  surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun: "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};
const GLASS = {
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: `1px solid ${T.line}`,
};

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  queue: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
  notes: ["M9 12h6", "M9 16h6", "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M9 7h6"],
  chart: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
  steth: ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
};

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: I.calendar, title: "Smart scheduling", desc: "Set in-person and video slots once. Conflicts are caught before a patient ever sees them." },
  { icon: I.queue, title: "Live patient queue", desc: "Patients see their turn in real time, so your waiting room stays calm on the busiest day." },
  { icon: I.video, title: "Built-in video visits", desc: "Encrypted consultations start from the appointment itself. No links, no extra apps." },
  { icon: I.notes, title: "Patient history", desc: "Shared records, past prescriptions and notes open beside the patient you're seeing." },
  { icon: I.user, title: "Public profile", desc: "A clear page with your experience, fees and clinics, so patients can choose you with confidence." },
  { icon: I.chart, title: "Practice analytics", desc: "Revenue, patient volume and no-show rate on one screen, compared week over week." },
];
const STEPS = [
  { icon: I.check, title: "Register and verify", desc: "Sign up in minutes and submit your credentials. We verify your profile within 24 hours." },
  { icon: I.user, title: "Set up your clinic", desc: "Add services, fees and clinic locations, then upload a professional photo." },
  { icon: I.calendar, title: "Set your availability", desc: "Mark in-person and video hours on the calendar. Change them any time." },
  { icon: I.steth, title: "Start consulting", desc: "Accept bookings, run your queue and see patients from one dashboard." },
];
const TESTIMONIALS = [
  { name: "Dr. Riya Chauhan", role: "General Medicine, Apollo Delhi", quote: "Video visits cut my no-show rate by 40% in the first month.", av: "RC", orb: ORBS.violet },
  { name: "Dr. Arjun Mehta", role: "Cardiologist, Fortis Mumbai", quote: "The live queue changed my clinic. Patients arrive prepared and on time.", av: "AM", orb: ORBS.sun },
  { name: "Dr. Sneha Rao", role: "Paediatrician, Manipal Bangalore", quote: "My full schedule was live and taking bookings within an hour.", av: "SR", orb: ORBS.sky },
];
const STATS = [
  { label: "Verified doctors", to: 12000, decimals: 0, suffix: "+" },
  { label: "Consultations", to: 2.4, decimals: 1, suffix: "M+" },
  { label: "Uptime", to: 98.2, decimals: 1, suffix: "%" },
  { label: "Average rating", to: 4.9, decimals: 1, suffix: " ★" },
];
const MARQUEE = ["General Medicine", "Cardiology", "Paediatrics", "Dermatology", "Orthopaedics", "Gynaecology", "Psychiatry", "ENT"];
const BEADS = [ORBS.violet, ORBS.sun, ORBS.sky, ORBS.mint];

/* ─── VARIANTS / HELPERS ────────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const wordChild = { hidden: { y: "115%", rotate: 4 }, visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } } };

const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

// iridescent progress bar (was solid ink)
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <motion.div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#7C8CFF,#F6A5D8,#FFB36B)", transformOrigin: "0% 50%", scaleX, zIndex: 60 }} />;
};

// soft blurred colour blobs, the same recipe as the footer aurora
const Aura = ({ blobs }) => (
  <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {blobs.map((b, i) => (
      <div key={i} style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", width: b.s, height: b.s, background: b.c, opacity: b.o ?? 0.45, top: b.t, left: b.l, right: b.r, bottom: b.b }} />
    ))}
  </div>
);

// glass bead, the "neuron" from the hero used as a bullet
const Bead = ({ bg, size = 14 }) => (
  <span style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0, boxShadow: "0 0 14px rgba(124,140,255,0.35)" }}>
    <span style={{ position: "absolute", top: "18%", left: "22%", width: "30%", height: "30%", borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} />
  </span>
);

// SVG neural constellation (same generator as the footer)
const NeuralArt = ({ reduce, count = 46, style = {}, id = "lp-g", live = true }) => {
  const { nodes, edges } = useMemo(() => {
    let s = 7;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const nodes = [];
    while (nodes.length < count) {
      const x = rnd() * 2 - 1, y = rnd() * 2 - 1;
      if (x * x + (y * y) / 0.62 > 1) continue;
      if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 0.028)) continue;
      nodes.push({ x, y, r: 2.2 + rnd() * 3, d: rnd() * 5, h: rnd() });
    }
    const edges = [];
    nodes.forEach((a, i) => nodes.forEach((b, j) => {
      if (j > i && (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < 0.13) edges.push([a, b]);
    }));
    return { nodes, edges };
  }, [count]);
  const P = ["#7C8CFF", "#C9B8FF", "#F6A5D8", "#A5D8FF", "#FFB36B"];
  return (
    <svg viewBox="-1.1 -0.85 2.2 1.7" aria-hidden style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C8CFF" /><stop offset="1" stopColor="#F6A5D8" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`url(#${id})`} strokeWidth="0.004" opacity="0.6" />)}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r / 260} fill={P[(n.h * P.length) | 0]}
          className={reduce || !live ? undefined : "lp-node"} style={{ animationDelay: `${n.d}s` }} />
      ))}
    </svg>
  );
};

const Section = ({ children, style = {}, once = false }) => (
  <motion.section initial="hidden" whileInView="visible" viewport={{ once, amount: 0.15 }} variants={stagger} style={{ position: "relative", ...style }}>
    {children}
  </motion.section>
);

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {text.split("\n").map((line, li, arr) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.24em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// headings now use the hero's light weight and tight tracking
const H2 = { fontWeight: 300, color: T.ink, lineHeight: 1.06, letterSpacing: "-0.04em" };

const SectionHeading = ({ title, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 56 }}>
    <WordReveal text={title} style={{ ...H2, fontSize: "clamp(32px,4.8vw,56px)", marginBottom: 16 }} />
    {sub && <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>{sub}</motion.p>}
  </div>
);

const Magnetic = ({ children, strength = 0.28 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
};

const TiltCard = ({ children, style = {}, max = 6, ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  return (
    <motion.div ref={ref} variants={fadeUp} className="lp-card"
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2);
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, ...style }} {...rest}>
      {children}
    </motion.div>
  );
};

const IconTile = ({ d, size = 48 }) => (
  <div style={{ width: size, height: size, borderRadius: 14, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} size={22} color={T.ink} />
  </div>
);

// same glass pill as the hero stats
const Stat = ({ to, decimals, suffix, label, delay = 0 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.6, once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce) { setV(to); return; }
    if (!inView) return;
    const c = animate(0, to, { duration: 1.9, delay, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, to, delay, reduce]);
  return (
    <motion.div ref={ref} variants={fadeUp} whileHover={{ y: -4, backgroundColor: "#FFFFFF" }}
      style={{ background: "rgba(245,244,242,0.85)", backdropFilter: "blur(8px)", border: `1px solid ${T.line}`, borderRadius: 24, padding: "30px 20px", textAlign: "center" }}>
      <p style={{ fontSize: "clamp(30px,3.6vw,46px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
        {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </p>
      <p style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{label}</p>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — SPECIALTY MARQUEE + STATS
═══════════════════════════════════════════════════════════════════════════ */
const MarqueeSection = () => (
  <div className="marquee" aria-hidden>
    <div className="marquee-track">
      {[...MARQUEE, ...MARQUEE].map((v, i) => (
        <span key={i} className="marquee-item"><Bead bg={BEADS[i % 4]} size={16} />{v}</span>
      ))}
    </div>
  </div>
);

const StatsSection = () => (
  <Section style={{ padding: "90px 24px 60px" }}>
    <Aura blobs={[{ c: "#C9B8FF", s: 420, t: "-20%", l: "-6%", o: 0.35 }, { c: "#A5D8FF", s: 380, b: "-30%", r: "-4%", o: 0.35 }]} />
    <div className="lp-grid-4" style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
      {STATS.map((s, i) => <Stat key={s.label} {...s} delay={i * 0.1} />)}
    </div>
  </Section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 — FEATURES (cards fly through 3D space on scroll)
═══════════════════════════════════════════════════════════════════════════ */
const FeatureCard = ({ f, i }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dir = i % 3 === 0 ? -1 : i % 3 === 2 ? 1 : 0;
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], reduce ? [0, 0, 0, 0] : [50, 0, 0, -35]);
  const rotateY = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], reduce ? [0, 0, 0, 0] : [dir * 35, 0, 0, dir * -25]);
  const z = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], reduce ? [0, 0, 0, 0] : [-450, 0, 0, -350]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.2]);
  return (
    <motion.div ref={ref} style={{ rotateX, rotateY, z, opacity, transformStyle: "preserve-3d" }}>
      <TiltCard style={{ padding: "32px 28px", minHeight: 250 }}>
        <IconTile d={f.icon} />
        <h3 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", margin: "22px 0 10px" }}>{f.title}</h3>
        <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>{f.desc}</p>
      </TiltCard>
    </motion.div>
  );
};

const FeaturesSection = () => (
  <Section style={{ padding: "100px 0 130px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 55%, ${T.white} 100%)` }}>
    <Aura blobs={[{ c: "#F6A5D8", s: 440, t: "6%", r: "-8%", o: 0.28 }, { c: "#FFD9B8", s: 420, b: "2%", l: "-8%", o: 0.4 }]} />
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
      <SectionHeading title="Everything a modern clinic needs" sub="Six tools that replace the paper diary, the phone calls and the spreadsheet." />
      <div className="lp-grid-3" style={{ perspective: 1300, perspectiveOrigin: "50% 40%" }}>
        {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 — HOW IT WORKS (scroll-drawn timeline + neural panel)
═══════════════════════════════════════════════════════════════════════════ */
const StepsTimeline = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });
  const [active, setActive] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setActive(Math.max(0, Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))))), [scrollYProgress]);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 23, top: 24, bottom: 24, width: 1, background: T.line }} />
      <motion.div style={{ position: "absolute", left: 23, top: 24, bottom: 24, width: 1.5, background: "linear-gradient(180deg,#7C8CFF,#F6A5D8)", transformOrigin: "50% 0%", scaleY: fill }} />
      {STEPS.map((s, i) => {
        const reached = i <= active;
        return (
          <motion.div key={s.title} variants={fadeUp} style={{ display: "flex", gap: 18, position: "relative", paddingBottom: i < STEPS.length - 1 ? 36 : 0 }}>
            <motion.div animate={{ scale: i === active ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: reached ? T.ink : T.white, border: `1px solid ${reached ? T.ink : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, transition: "background .45s, border-color .45s" }}>
              <Icon d={s.icon} size={20} color={reached ? "#fff" : T.ink} />
            </motion.div>
            <div style={{ paddingTop: 4, opacity: reached ? 1 : 0.42, transition: "opacity .45s" }}>
              <span style={{ ...GLASS, fontSize: 12, fontWeight: 500, color: T.body, padding: "3px 12px", borderRadius: 20 }}>Step {i + 1}</span>
              <h4 style={{ fontSize: 18, fontWeight: 500, color: T.ink, letterSpacing: "-0.02em", margin: "10px 0 4px" }}>{s.title}</h4>
              <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const HowItWorksSection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const artY = useParallax(scrollYProgress, -30, 30);
  return (
    <Section style={{ padding: "110px 0" }}>
      <Aura blobs={[{ c: "#A5D8FF", s: 400, t: "10%", l: "-10%", o: 0.3 }]} />
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 56, alignItems: "start", position: "relative", zIndex: 1 }}>
        <div>
          <WordReveal text={"Live in four steps,\nusually within a day."} style={{ ...H2, fontSize: "clamp(30px,4.2vw,50px)", marginBottom: 44 }} />
          <StepsTimeline />
        </div>
        <motion.div variants={scaleIn} style={{ position: "sticky", top: 110, height: 500, borderRadius: 28, border: `1px solid ${T.line}`, overflow: "hidden", boxShadow: "0 30px 80px rgba(12,10,9,0.08)", background: `radial-gradient(ellipse 70% 60% at 50% 42%, rgba(201,184,255,0.55), rgba(165,216,255,0.25) 55%, rgba(255,255,255,0.9) 100%), ${T.white}` }}>
          <motion.div style={{ position: "absolute", inset: "6% 4% 26%", y: artY }}>
            <NeuralArt reduce={reduce} count={40} id="lp-g2" style={{ width: "100%", height: "100%" }} />
          </motion.div>
          <div style={{ ...GLASS, position: "absolute", left: 24, right: 24, bottom: 24, borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 18px 40px rgba(12,10,9,0.06)" }}>
            <IconTile d={I.shield} size={44} />
            <div><p style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>Credentials verified</p><p style={{ fontSize: 13, color: T.body }}>Your profile goes live within 24 hours.</p></div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 — TESTIMONIALS
═══════════════════════════════════════════════════════════════════════════ */
const QuoteCard = ({ t, i }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [(i - 1) * 45, 0, (i - 1) * -45]);
  const z = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [-300, 0, -300]);
  return (
    <motion.figure ref={ref} style={{ rotateY, z, margin: 0, transformStyle: "preserve-3d" }}>
      <TiltCard style={{ padding: "34px 28px", minHeight: 290, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <blockquote style={{ fontSize: 21, fontWeight: 300, color: T.ink, lineHeight: 1.45, letterSpacing: "-0.03em" }}>“{t.quote}”</blockquote>
        <figcaption style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 46, height: 46, borderRadius: "50%", background: t.orb, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: "#fff", textShadow: "0 1px 6px rgba(12,10,9,.25)", flexShrink: 0 }}>{t.av}</motion.div>
          <div><p style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{t.name}</p><p style={{ fontSize: 13, color: T.muted }}>{t.role}</p></div>
        </figcaption>
      </TiltCard>
    </motion.figure>
  );
};

const TestimonialsSection = () => (
  <Section style={{ padding: "110px 0", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 50%, ${T.white} 100%)` }}>
    <Aura blobs={[{ c: "#FFD9B8", s: 420, t: "0%", r: "-6%", o: 0.4 }, { c: "#C9B8FF", s: 400, b: "-4%", l: "-6%", o: 0.35 }]} />
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
      <SectionHeading title="Doctors who made the switch" />
      <div className="lp-grid-3" style={{ perspective: 1200 }}>
        {TESTIMONIALS.map((t, i) => <QuoteCard key={t.name} t={t} i={i} />)}
      </div>
    </div>
  </Section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 — CTA (light glass panel, like the hero, instead of a dark block)
═══════════════════════════════════════════════════════════════════════════ */
const CTASection = () => {
  const reduce = useReducedMotion();
  // Plays once and has no scroll-linked transforms: nothing re-renders or
  // re-rasterises while scrolling, which is what caused the blinking.
  return (
    <Section once style={{ padding: "110px 24px 110px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={scaleIn} style={{ position: "relative", overflow: "hidden", borderRadius: 32, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.08)", padding: "clamp(44px,6vw,84px) clamp(28px,6vw,72px)", background: `radial-gradient(ellipse 60% 70% at 50% 40%, rgba(201,184,255,0.5), rgba(165,216,255,0.22) 55%, rgba(255,255,255,0) 80%), radial-gradient(ellipse 40% 50% at 12% 100%, rgba(255,217,184,0.5), rgba(255,255,255,0) 70%), ${T.white}`, transform: "translateZ(0)" }}>
          <div aria-hidden style={{ position: "absolute", inset: "-10% 4%", opacity: 0.5, pointerEvents: "none" }}>
            <NeuralArt reduce={reduce} live={false} count={52} id="lp-g3" style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <motion.div variants={fadeUp} style={{ background: "rgba(255,255,255,0.92)", border: `1px solid ${T.line}`, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px", marginBottom: 26 }}>
              <span style={{ position: "relative", width: 26, height: 26 }}>
                <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={I.sparkle} size={13} color="white" />
                </span>
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Setup takes under an hour</span>
            </motion.div>
            <WordReveal text={"Ready to see patients,\nnot paperwork?"} style={{ ...H2, fontSize: "clamp(34px,5.6vw,68px)", lineHeight: 1.05, marginBottom: 20 }} />
            <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.7 }}>
              Join the doctors already running their clinics on CuraLink. Your profile is verified within 24 hours.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Magnetic><Link to="/doctor/register" className="btn-ink">Register now <Icon d={I.arrow} size={15} color="white" /></Link></Magnetic>
              <Magnetic><Link to="/doctor/how-it-works" className="btn-outline">See how it works</Link></Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorLandingPage = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      .lp-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip}
      .lp-body *{box-sizing:border-box;margin:0;padding:0}
      .lp-root ::selection{background:${T.ink};color:#fff}
      .lp-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
      .lp-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}

      .lp-body .btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;transition:box-shadow .25s,transform .25s}
      .lp-body .btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
      .lp-body .btn-ink svg{transition:transform .3s cubic-bezier(.22,1,.36,1)}
      .lp-body .btn-ink:hover svg:last-child{transform:translateX(4px)}
      .lp-body .btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;text-decoration:none;border:1px solid ${T.line};transition:background .25s,border-color .25s,transform .25s}
      .lp-body .btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
      .lp-body a:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

      .lp-card{position:relative;isolation:isolate;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border-radius:28px;border:1px solid ${T.line};box-shadow:0 18px 50px rgba(12,10,9,.04);transition:box-shadow .3s,border-color .3s,background .3s;will-change:transform}
      .lp-card::before{content:"";position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(201,184,255,.28),rgba(255,255,255,0) 60%)}
      .lp-card:hover{border-color:#D6D3D1;background:rgba(255,255,255,.92);box-shadow:0 30px 80px rgba(12,10,9,.09)}
      .lp-card:hover::before{opacity:1}

      .marquee{overflow:hidden;border-top:1px solid ${T.line};border-bottom:1px solid ${T.line};padding:24px 0;background:linear-gradient(90deg,#F4F0FF,#FFFFFF 30%,#FFFFFF 70%,#FFF4EA);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
      .marquee-track{display:flex;width:max-content;animation:lp-marquee 38s linear infinite}
      .marquee:hover .marquee-track{animation-play-state:paused}
      .marquee-item{display:inline-flex;align-items:center;gap:16px;padding-right:56px;font-size:clamp(22px,2.8vw,34px);font-weight:300;letter-spacing:-.04em;color:${T.ink};white-space:nowrap}
      @keyframes lp-marquee{to{transform:translateX(-50%)}}

      @keyframes lp-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
      .lp-node{transform-box:fill-box;transform-origin:center;animation:lp-pulse 4.5s ease-in-out infinite}

      @media (max-width:900px){
        .lp-grid-3{grid-template-columns:1fr}
        .lp-grid-4{grid-template-columns:repeat(2,1fr)}
      }
      @media (prefers-reduced-motion:reduce){.marquee-track{animation:none}.lp-card{transition:none}.lp-node{animation:none}}
    `}</style>

    <ScrollProgress />
    <div className="lp-root">
      <DoctorHero />
      <div className="lp-body">
        <MarqueeSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </div>
  </>
);

export default DoctorLandingPage;