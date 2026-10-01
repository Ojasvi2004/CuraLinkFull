import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

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

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  video:    ["M15 10l4.55-2.28A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.9L15 14", "M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"],
  doc:      "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: ICONS.ai,       title: "AI Symptom Analyzer",            tag: "AI-Powered",   desc: "Not sure which specialist to see? Describe your symptoms and our AI guides you to the right doctor, saving time and worry."                              },
  { icon: ICONS.search,   title: "Comprehensive Doctor Search",    tag: "Directory",    desc: "Find verified doctors by specialty, location, availability, or ratings. Access detailed profiles to make informed decisions."                          },
  { icon: ICONS.calendar, title: "Effortless Appointment Booking", tag: "Scheduling",   desc: "Book in-person or digital consultations in just a few clicks. View real-time availability and manage your schedule seamlessly."                        },
  { icon: ICONS.video,    title: "Secure Telemedicine",            tag: "Video Calls",  desc: "Connect with doctors remotely via high-quality video calls for minor ailments, follow-ups, or when travel is a constraint."                           },
  { icon: ICONS.doc,      title: "Digital Prescription Vault",     tag: "Health Vault", desc: "Receive and store prescriptions digitally after consultations — easily accessible, shareable, and always organized."                                },
  { icon: ICONS.user,     title: "Personalized Dashboard",         tag: "Personal",     desc: "Track appointments, medical history, prescriptions, and doctor communications — all in one secure, beautifully designed hub."                           },
];

const USE_CASES = [
  {
    title: "Quick Consultation for Minor Ailments",
    desc:  "Use our AI symptom analyzer, connect with a general physician via telemedicine, and get expert advice without leaving home.",
    scenario: "A busy professional needs quick advice for a recurring headache.",
    benefit:  "Saves travel time, provides rapid access to medical guidance.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "Finding the Right Specialist",
    desc:  "Our AI guides you to the appropriate specialist and helps you book an informed, targeted consultation the first time.",
    scenario: "A patient has persistent joint pain but isn't sure whether to see a rheumatologist or orthopedist.",
    benefit:  "Reduces misdirected consultations, accelerates path to correct diagnosis.",
    image: "https://images.unsplash.com/photo-1584515933487-750f40589918?auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "Convenient Follow-Up Appointments",
    desc:  "Schedule a digital consultation for a quick check-in, discuss lab results, or adjust medication with your doctor.",
    scenario: "A patient recovering from surgery needs a routine follow-up but lives far from the hospital.",
    benefit:  "Improves continuity of care, reduces travel burden for patients.",
    image: "https://images.unsplash.com/photo-1622227945605-b54ca7968097?auto=format&fit=crop&w=774&q=80",
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};

const clipReveal = {
  hidden:  { clipPath: "inset(12% 12% 12% 12% round 26px)", opacity: 0 },
  visible: { clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1, transition: { duration: 1.0, ease: EASE } },
};

// ─── HOOKS & HELPERS ─────────────────────────────────────────────────────────
const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

// Word-by-word reveal
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

// Eyebrow Pill Badge
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
      marginBottom: 16,
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

// 3D Tilt Card with cursor radial spotlight
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
      className="feat-card"
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
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, ...style }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// Parallax Image Frame for Use Cases
const ParallaxCaseImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useParallax(scrollYProgress, -10, 10);
  const yPct = useTransform(y, (v) => `${v}%`);

  return (
    <motion.div
      ref={ref}
      variants={clipReveal}
      style={{
        position: "relative",
        height: "100%",
        minHeight: 320,
        overflow: "hidden",
        border: `1px solid ${T.line}`,
        borderRadius: 24,
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          left: 0,
          top: "-10%",
          width: "100%",
          height: "120%",
          objectFit: "cover",
          display: "block",
          y: yPct,
        }}
      />
    </motion.div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const FeaturesSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  // Scroll parallax orbs
  const orbY1 = useParallax(scrollYProgress, -180, 180);
  const orbY2 = useParallax(scrollYProgress, 140, -140);
  const orbY3 = useParallax(scrollYProgress, -100, 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .feat-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow-x: clip;
        }

        .feat-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border-radius: 24px;
          border: 1px solid ${T.line};
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .feat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.95), rgba(255,255,255,0) 60%);
        }
        .feat-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 18px 50px rgba(12,10,9,0.06);
        }
        .feat-card:hover::before {
          opacity: 1;
        }

        .learn-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: ${T.ink};
          cursor: pointer;
          margin-top: auto;
          padding-top: 18px;
        }
        .learn-more svg {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .feat-card:hover .learn-more svg {
          transform: translateX(4px);
        }

        .usecase-container {
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 28px;
          padding: clamp(24px, 4vw, 36px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          transition: border-color 0.3s;
        }
        .usecase-container:hover {
          border-color: #D6D3D1;
        }

        @media (max-width: 900px) {
          .usecase-container {
            grid-template-columns: 1fr !important;
            gap: 28px;
          }
        }
      `}</style>

      <div ref={containerRef} className="feat-root">

        {/* Ambient Parallax Orbs drifting on scroll */}
        <motion.div
          style={{
            position: "absolute",
            top: "10%",
            right: "-120px",
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.28,
            filter: "blur(60px)",
            pointerEvents: "none",
            y: orbY1,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "45%",
            left: "-100px",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.25,
            filter: "blur(55px)",
            pointerEvents: "none",
            y: orbY2,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "-80px",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: ORBS.sun,
            opacity: 0.22,
            filter: "blur(50px)",
            pointerEvents: "none",
            y: orbY3,
          }}
        />

        {/* ──────── 1. FEATURES GRID ──────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ padding: "110px 0 80px", position: "relative", zIndex: 1 }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            
            {/* Section Heading */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Pill>Core Capabilities</Pill>
              <WordReveal
                text={"How CuraLink Empowers\nYour Health Journey"}
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 300,
                  color: T.ink,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  marginBottom: 14,
                }}
              />
              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: 15,
                  color: T.body,
                  maxWidth: 540,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                A suite of integrated tools designed to simplify access to quality healthcare — from intelligent guidance to seamless consultations.
              </motion.p>
            </div>

            {/* Grid of 3D Tilt Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 20 }}>
              {FEATURES.map((f, i) => (
                <TiltCard key={i} style={{ padding: "30px 26px", display: "flex", flexDirection: "column" }}>
                  
                  {/* Top Bar: Icon & Pill Tag */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
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
                      }}
                    >
                      <Icon d={f.icon} size={22} color={T.ink} />
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
                      {f.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: T.ink,
                      letterSpacing: "-0.02em",
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {f.title}
                  </h3>

                  <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7 }}>
                    {f.desc}
                  </p>

                  {/* Learn More link */}
                  <div className="learn-more">
                    Learn more
                    <Icon d={ICONS.arrow} size={13} color={T.ink} />
                  </div>

                </TiltCard>
              ))}
            </div>

          </div>
        </motion.section>

        {/* ──────── 2. REAL-WORLD USE CASES ──────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          style={{ padding: "40px 0 110px", position: "relative", zIndex: 1 }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

            {/* Section Heading */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Pill>Real-World Scenarios</Pill>
              <WordReveal
                text={"See CuraLink in Action"}
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 300,
                  color: T.ink,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  marginBottom: 14,
                }}
              />
              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: 15,
                  color: T.body,
                  maxWidth: 540,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                Explore how CuraLink addresses common healthcare challenges, making medical care more accessible and efficient for everyone.
              </motion.p>
            </div>

            {/* Staggered Alternating Rows with Scroll Parallax Images */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {USE_CASES.map((uc, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="usecase-container"
                  >
                    {/* Image Column (Alternates placement) */}
                    <div style={{ order: isEven ? 1 : 2 }}>
                      <ParallaxCaseImage src={uc.image} alt={uc.title} />
                    </div>

                    {/* Content Column */}
                    <div style={{ order: isEven ? 2 : 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
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
                          Scenario {i + 1}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: "clamp(20px, 2.5vw, 26px)",
                          fontWeight: 300,
                          color: T.ink,
                          lineHeight: 1.25,
                          letterSpacing: "-0.025em",
                          marginBottom: 12,
                        }}
                      >
                        {uc.title}
                      </h3>

                      <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.75, marginBottom: 24 }}>
                        {uc.desc}
                      </p>

                      {/* Scenario / Benefit Card */}
                      <div
                        style={{
                          background: T.white,
                          borderRadius: 18,
                          padding: "18px 20px",
                          border: `1px solid ${T.line}`,
                        }}
                      >
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                            Example Scenario
                          </p>
                          <p style={{ fontSize: 13.5, color: T.body, fontStyle: "italic", lineHeight: 1.65 }}>
                            "{uc.scenario}"
                          </p>
                        </div>

                        <div style={{ height: 1, background: T.line, marginBottom: 12 }} />

                        <div>
                          <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                            Key Benefit
                          </p>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 6,
                                background: T.surface,
                                border: `1px solid ${T.line}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 1,
                              }}
                            >
                              <Icon d={ICONS.check} size={11} color={T.ink} />
                            </div>
                            <p style={{ fontSize: 13.5, color: T.ink, fontWeight: 400, lineHeight: 1.6 }}>
                              {uc.benefit}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.section>

      </div>
    </>
  );
};

export default FeaturesSection;