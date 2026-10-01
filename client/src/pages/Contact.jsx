import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
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
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  location: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  faq:      ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  subject:  ["M4 6h16M4 12h16M4 18h8"],
  msg:      ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
};

const CONTACT_CARDS = [
  {
    icon: ICONS.mail,
    title: "Email Us",
    sub: "General inquiries, support or feedback.",
    value: "support@curalink.com",
    href: "mailto:support@curalink.com",
    detail: "We reply within 24 hours",
  },
  {
    icon: ICONS.phone,
    title: "Call Us",
    sub: "Speak with our support team directly.",
    value: "(123) 456-7890",
    href: "tel:+1234567890",
    detail: "Mon – Fri, 9 AM – 6 PM",
  },
  {
    icon: ICONS.location,
    title: "Our Office",
    sub: "Visit us at our main headquarters.",
    value: "123 Health St, Wellness City",
    href: "#map",
    detail: "Get directions →",
  },
  {
    icon: ICONS.faq,
    title: "FAQ",
    sub: "Quick answers to common questions.",
    value: "Visit FAQ Page",
    href: "/faq",
    detail: "50+ articles available",
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
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

// ─── HOOKS & HELPERS ─────────────────────────────────────────────────────────
const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

// Mask Word Reveal
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

// Pill with rotating sparkle
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

// Magnetic wrapper
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

// ─── FLOATING INPUT ───────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", icon, textarea = false, rows = 5 }) => {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const active = focused || val.length > 0;

  const baseStyle = {
    width: "100%",
    background: focused ? T.white : T.surface2,
    border: `1px solid ${focused ? T.ink : T.line}`,
    borderRadius: 16,
    outline: "none",
    fontSize: 14,
    fontWeight: 400,
    color: T.ink,
    transition: "all 0.22s ease",
    boxShadow: focused ? "0 4px 18px rgba(12,10,9,0.04)" : "none",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          position: "absolute",
          left: 44,
          top: active ? 9 : textarea ? 20 : "50%",
          transform: active ? "none" : textarea ? "none" : "translateY(-50%)",
          fontSize: active ? 10.5 : 13.5,
          fontWeight: active ? 500 : 400,
          color: focused ? T.ink : T.muted,
          transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none",
          letterSpacing: active ? "0.02em" : 0,
          textTransform: active ? "uppercase" : "none",
          zIndex: 2,
        }}
      >
        {label}
      </label>

      <div style={{ position: "absolute", left: 16, top: textarea ? 20 : "50%", transform: textarea ? "none" : "translateY(-50%)", zIndex: 2 }}>
        <Icon d={icon} size={16} color={focused ? T.ink : T.muted} />
      </div>

      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          required
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...baseStyle,
            padding: "30px 16px 14px 44px",
            resize: "vertical",
            minHeight: 130,
          }}
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...baseStyle,
            height: 56,
            paddingTop: active ? 20 : 0,
            paddingBottom: active ? 4 : 0,
            paddingLeft: 44,
            paddingRight: 16,
          }}
        />
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Parallax Orbs
  const orbY1 = useParallax(scrollYProgress, 0, -180);
  const orbY2 = useParallax(scrollYProgress, 0, 160);
  const orbY3 = useParallax(scrollYProgress, 0, -110);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .ct-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          overflow-x: clip;
          position: relative;
        }

        .about-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border-radius: 24px;
          border: 1px solid ${T.line};
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .about-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.95), rgba(255,255,255,0) 60%);
        }
        .about-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 18px 50px rgba(12,10,9,0.06);
        }
        .about-card:hover::before {
          opacity: 1;
        }

        .btn-ink {
          width: 100%;
          height: 52px;
          border-radius: 999px;
          border: none;
          background: ${T.ink};
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: box-shadow 0.25s, transform 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-ink:hover:not(:disabled) {
          box-shadow: 0 14px 34px rgba(12,10,9,0.22);
          transform: translateY(-1px);
        }
        .btn-ink:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .btn-ink svg {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .btn-ink:hover:not(:disabled) svg {
          transform: translateX(4px);
        }

        .ct-map-card {
          width: 100%;
          height: 340px;
          border-radius: 24px;
          background: ${T.surface};
          border: 1px solid ${T.line};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
      `}</style>

      <div ref={containerRef} className="ct-root">

        {/* Ambient Scroll Parallax Orbs */}
        <motion.div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.32,
            filter: "blur(60px)",
            pointerEvents: "none",
            y: orbY1,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "35%",
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.28,
            filter: "blur(55px)",
            pointerEvents: "none",
            y: orbY2,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "10%",
            right: -60,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: ORBS.sun,
            opacity: 0.24,
            filter: "blur(50px)",
            pointerEvents: "none",
            y: orbY3,
          }}
        />

        {/* ──────────────── HERO ──────────────── */}
        <section style={{ position: "relative", minHeight: "48vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px" }}>
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <Pill>We'd Love to Hear From You</Pill>
            
            <WordReveal
              as="h1"
              text={"Get In Touch"}
              style={{
                fontSize: "clamp(40px, 6.5vw, 76px)",
                fontWeight: 300,
                color: T.ink,
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
                marginBottom: 20,
              }}
            />

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: "clamp(15px, 2vw, 17px)",
                color: T.body,
                lineHeight: 1.75,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              We're here to help with any question you might have. Our dedicated team typically responds within 24 hours.
            </motion.p>
          </div>
        </section>

        {/* ──────────────── CONTACT CARDS ──────────────── */}
        <section style={{ padding: "0 24px 80px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}
            >
              {CONTACT_CARDS.map((c, i) => (
                <TiltCard key={i} style={{ padding: "28px 24px" }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: T.white,
                      border: `1px solid ${T.line}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    <Icon d={c.icon} size={20} color={T.ink} />
                  </div>

                  <h4 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>
                    {c.title}
                  </h4>

                  <p style={{ fontSize: 13.5, color: T.muted, marginBottom: 14, lineHeight: 1.55 }}>
                    {c.sub}
                  </p>

                  <a
                    href={c.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: T.ink,
                      textDecoration: "none",
                      display: "block",
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.value}
                  </a>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.muted }}>
                    <Icon d={ICONS.clock} size={12} color={T.muted} />
                    <span style={{ fontSize: 12, fontWeight: 400 }}>{c.detail}</span>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ──────────────── FORM + INFO ──────────────── */}
        <section style={{ padding: "0 24px 100px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 36, alignItems: "start" }}>

            {/* ── FORM CARD ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              style={{
                background: T.surface,
                borderRadius: 28,
                border: `1px solid ${T.line}`,
                padding: "clamp(30px, 4vw, 42px)",
                overflow: "hidden",
              }}
            >
              <div style={{ marginBottom: 28 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: T.ink,
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    padding: "3px 12px",
                    borderRadius: 20,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  <Icon d={ICONS.sparkle} size={11} color={T.ink} />
                  Direct Message
                </span>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                  Send Us a Message
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    style={{ textAlign: "center", padding: "50px 20px" }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: T.ink,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 10px 24px rgba(12,10,9,0.15)",
                      }}
                    >
                      <Icon d={ICONS.check} size={26} color="white" />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 300, color: T.ink, letterSpacing: "-0.02em", marginBottom: 8 }}>
                      Message Sent!
                    </h3>
                    <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{
                        marginTop: 24,
                        padding: "10px 24px",
                        borderRadius: 999,
                        border: `1px solid ${T.line}`,
                        background: T.white,
                        color: T.ink,
                        fontWeight: 500,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: 14 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <Field label="Full Name" name="name" icon={ICONS.user} />
                      <Field label="Email Address" name="email" icon={ICONS.mail} type="email" />
                    </div>
                    <Field label="Subject" name="subject" icon={ICONS.subject} />
                    <Field label="Your Message" name="message" icon={ICONS.msg} textarea rows={5} />

                    <div style={{ marginTop: 6 }}>
                      <button type="submit" className="btn-ink" disabled={loading}>
                        {loading ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        ) : (
                          <>
                            Send Message
                            <Icon d={ICONS.arrow} size={15} color="white" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── INFO SIDE ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: T.ink,
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    padding: "3px 12px",
                    borderRadius: 20,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  <Icon d={ICONS.sparkle} size={11} color={T.ink} />
                  Support Channels
                </span>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                  Other Ways to Reach Us
                </h2>
              </motion.div>

              {/* Channels List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {CONTACT_CARDS.map((c, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    style={{
                      background: T.surface,
                      borderRadius: 20,
                      border: `1px solid ${T.line}`,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      transition: "border-color 0.25s, box-shadow 0.25s",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon d={c.icon} size={18} color={T.ink} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em", marginBottom: 2 }}>
                        {c.title}
                      </h4>
                      <p style={{ fontSize: 13, color: T.body, marginBottom: 4, lineHeight: 1.5 }}>
                        {c.sub}
                      </p>
                      <a
                        href={c.href}
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: T.ink,
                          textDecoration: "none",
                        }}
                      >
                        {c.value}
                      </a>
                      <p style={{ fontSize: 11.5, color: T.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon d={ICONS.clock} size={11} color={T.muted} />
                        {c.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office hours card with deep black & iridescent accents */}
              <motion.div
                variants={fadeUp}
                style={{
                  marginTop: 18,
                  background: T.ink,
                  borderRadius: 24,
                  padding: "24px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Embedded decorative glow orb */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: ORBS.violet,
                    opacity: 0.35,
                    filter: "blur(30px)",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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
                      <Icon d={ICONS.clock} size={15} color="white" />
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: "white", letterSpacing: "-0.01em" }}>
                      Support Hours
                    </p>
                  </div>

                  {[
                    ["Monday – Friday", "9:00 AM – 6:00 PM"],
                    ["Saturday", "10:00 AM – 2:00 PM"],
                    ["Sunday", "Closed"],
                  ].map(([day, time], i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 400 }}>{day}</span>
                      <span style={{ fontSize: 13, color: "white", fontWeight: 500 }}>{time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ──────────────── MAP ──────────────── */}
        <section id="map" style={{ padding: "0 24px 110px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{ maxWidth: 1100, margin: "0 auto" }}
          >
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Pill>Location</Pill>
              <WordReveal
                text={"Find Us on the Map"}
                style={{
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 300,
                  color: T.ink,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              />
              <motion.p variants={fadeUp} style={{ fontSize: 14.5, color: T.body }}>
                Visit our main office or explore our service areas.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="ct-map-card">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(12,10,9,0.04)",
                }}
              >
                <Icon d={ICONS.location} size={24} color={T.ink} />
              </div>

              <p style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.01em" }}>
                123 Health St, Wellness City
              </p>
              <p style={{ fontSize: 13, color: T.muted }}>
                Replace with your Google Maps iframe
              </p>

              <div style={{ marginTop: 8 }}>
                <Magnetic>
                  <a
                    href="#"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 24px",
                      borderRadius: 999,
                      background: T.ink,
                      color: "white",
                      fontSize: 13.5,
                      fontWeight: 500,
                      textDecoration: "none",
                      boxShadow: "0 8px 24px rgba(12,10,9,0.18)",
                    }}
                  >
                    Open in Maps
                    <Icon d={ICONS.arrow} size={13} color="white" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default Contact;