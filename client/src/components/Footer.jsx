import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  ink:      "#0C0A09",
  body:     "#44403C",
  muted:    "#78716C",
  line:     "#ECEAE6",
  surface:  "#F5F4F2",
  surface2: "#FAFAF9",
  white:    "#FFFFFF",
};

const EASE = [0.22, 1, 0.36, 1];

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  location: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

// Social SVG primitives (size-aware)
const SocialIcons = {
  Facebook:  ({ s = 20 }) => <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>,
  Twitter:   ({ s = 20 }) => <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.61.823 2.981 2.074 3.798-.768-.024-1.483-.233-2.11-.583v.06c0 2.254 1.607 4.131 3.737 4.564-.39.106-.803.164-1.227.164-.3 0-.593-.028-.877-.082.593 1.844 2.307 3.183 4.341 3.221-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.512 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.603.91-.658 1.7-1.477 2.323-2.41z"/></svg>,
  LinkedIn:  ({ s = 20 }) => <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>,
  Instagram: ({ s = 20 }) => <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4c2.21 0 4 1.791 4 4s-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
};

const SOCIALS = [
  { label: "Facebook",  C: SocialIcons.Facebook  },
  { label: "Twitter",   C: SocialIcons.Twitter   },
  { label: "LinkedIn",  C: SocialIcons.LinkedIn  },
  { label: "Instagram", C: SocialIcons.Instagram },
];

const QUICK_LINKS = [
  { label: "Find a Doctor",       to: "/find-doctors"     },
  { label: "AI Symptom Analyzer", to: "/symptom-analyzer" },
  { label: "How It Works",        to: "/about"            },
  { label: "About Us",            to: "/about"            },
  { label: "Contact",             to: "/contact"          },
];

const PATIENT_LINKS = [
  { label: "Patient Login",       to: "/login"            },
  { label: "Register",            to: "/signup"           },
  { label: "My Appointments",     to: "/my-appointments"  },
  { label: "Privacy Policy",      to: "/privacy-policy"   },
  { label: "Terms of Service",    to: "/terms"            },
];

const TRUST_ITEMS = [
  { icon: ICONS.shield, label: "256-bit SSL"     },
  { icon: ICONS.check,  label: "HIPAA Compliant" },
  { icon: ICONS.heart,  label: "Patient-First"   },
];

const CONTACTS = [
  { icon: ICONS.location, text: "123 Health St, Wellness City" },
  { icon: ICONS.mail,     text: "support@curalink.com", href: "mailto:support@curalink.com" },
  { icon: ICONS.phone,    text: "(123) 456-7890",       href: "tel:+1234567890" },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const wordChild = {
  hidden:  { y: "115%", rotate: 3 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.95, ease: EASE } },
};

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {text.split("\n").map((line, li, arr) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.16em", marginBottom: "-0.16em", marginRight: "0.22em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// ─── MAGNETIC WRAPPER ────────────────────────────────────────────────────────
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

// ─── SMALL PIECES ────────────────────────────────────────────────────────────
const FooterLink = ({ to, children }) => (
  <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.2, ease: EASE }}>
    <Link to={to} className="ft-link">{children}</Link>
  </motion.li>
);

const ColHeading = ({ children }) => (
  <h4 style={{ fontSize: 12, fontWeight: 600, color: T.ink, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 20 }}>
    {children}
  </h4>
);

// Glowing circular mark (echoes the speaker button in the inspiration)
const GlowMark = () => (
  <div style={{ position: "relative", width: 68, height: 68 }}>
    <motion.span
      aria-hidden
      animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.15, 0.55] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }}
    />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.75)", backdropFilter: "blur(6px)" }} />
    <div style={{ position: "absolute", inset: 9, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, #FFFFFF 30%, #FFE7CC 72%, #FFD3AE 100%)", boxShadow: "0 0 26px rgba(255,196,140,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={ICONS.cross} size={22} color={T.ink} />
    </div>
  </div>
);

// ─── MAIN FOOTER COMPONENT ───────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();

  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end end"] });
  const raysY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -30]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .ft-root {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: ${T.ink};
          -webkit-font-smoothing: antialiased;
          background: linear-gradient(180deg, #B7A6F4 0%, #C9BBF8 26%, #DCD2FB 54%, #EBE5FD 80%, #F7F3FF 100%);
        }
        .ft-aurora { position: absolute; border-radius: 50%; filter: blur(70px); }
        .ft-aurora-a { top: -12%; left: -8%; width: 540px; height: 540px; background: #EDB6F2; opacity: 0.55; }
        .ft-aurora-b { top: 8%; right: 6%; width: 440px; height: 440px; background: #8E7DF6; opacity: 0.42; }
        .ft-aurora-c { bottom: 8%; left: 22%; width: 400px; height: 400px; background: #FFD0E6; opacity: 0.5; }
        .ft-ripples { position: absolute; right: -14vmax; bottom: -26vmax; width: 74vmax; height: 74vmax; }
        .ft-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: inset 0 0 50px rgba(255,255,255,0.35), 0 0 30px rgba(255,255,255,0.25);
          will-change: transform, opacity;
        }
        .ft-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1.3px);
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(ellipse 70% 80% at 0% 0%, #000 0%, transparent 70%);
                  mask-image: radial-gradient(ellipse 70% 80% at 0% 0%, #000 0%, transparent 70%);
        }
        .ft-glow {
          position: absolute; left: 0; right: 0; bottom: 0; height: 34%;
          background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0));
          pointer-events: none;
        }

        .ft-wrap { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        .ft-hero { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; align-items: start; }
        .ft-headline {
          font-family: 'Instrument Serif', 'Times New Roman', serif;
          font-weight: 400;
          font-size: clamp(46px, 7.4vw, 104px);
          line-height: 0.98;
          letter-spacing: -0.025em;
          color: ${T.ink};
        }
        .ft-lede p { font-size: clamp(15px, 1.25vw, 17.5px); line-height: 1.45; color: ${T.ink}; margin: 0 0 14px; max-width: 600px; }

        .ft-card {
          background: ${T.white};
          border-radius: 22px;
          padding: clamp(28px, 5vw, 64px);
          box-shadow: 0 30px 80px rgba(60, 80, 160, 0.14);
        }
        .ft-card-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr 1.2fr 1.35fr;
          gap: 40px 36px;
        }
        .ft-brand { display: flex; flex-direction: column; justify-content: space-between; gap: 36px; }

        .ft-link {
          display: inline-block;
          font-size: 14.5px;
          color: ${T.body};
          text-decoration: none;
          padding: 6px 0;
          transition: color 0.2s;
        }
        .ft-link:hover { color: ${T.ink}; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
        .ft-link:focus-visible, .ft-social:focus-visible, .ft-sub:focus-visible, .ft-input:focus-visible { outline: 2px solid ${T.ink}; outline-offset: 3px; }

        .ft-social { background: none; border: none; padding: 4px; color: ${T.body}; cursor: pointer; display: flex; transition: color 0.2s, transform 0.2s; }
        .ft-social:hover { color: ${T.ink}; }

        .ft-contact { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; color: ${T.body}; text-decoration: none; padding: 6px 0; line-height: 1.4; transition: color 0.2s; }
        a.ft-contact:hover { color: ${T.ink}; }

        .ft-input {
          flex: 1; min-width: 0; height: 44px; padding: 0 16px;
          background: ${T.surface}; border: 1px solid ${T.line}; border-right: none;
          border-radius: 999px 0 0 999px; color: ${T.ink};
          font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .ft-input::placeholder { color: ${T.muted}; }
        .ft-input:focus { background: ${T.white}; border-color: #A8A29E; }
        .ft-sub {
          height: 44px; padding: 0 18px; border: none; cursor: pointer; background: ${T.ink};
          border-radius: 0 999px 999px 0; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .ft-sub:hover { background: #292524; }

        .ft-trust { margin-top: 44px; padding-top: 24px; border-top: 1px solid ${T.line}; display: flex; flex-wrap: wrap; gap: 10px 26px; }

        .ft-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 24px; font-size: 12.5px; color: rgba(12,10,9,0.62); }
        .ft-bar a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .ft-bar a:hover { color: ${T.ink}; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ft-card-grid { grid-template-columns: repeat(3, 1fr); }
          .ft-brand { grid-column: 1 / -1; flex-direction: row; align-items: flex-end; flex-wrap: wrap; }
          .ft-news { grid-column: span 2; }
        }
        @media (max-width: 900px) {
          .ft-hero { grid-template-columns: 1fr; gap: 28px; }
        }
        @media (max-width: 680px) {
          .ft-card-grid { grid-template-columns: 1fr 1fr; gap: 34px 20px; }
          .ft-contactcol, .ft-news { grid-column: 1 / -1; }
          .ft-trust { gap: 10px 18px; }
          .ft-bar { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 380px) {
          .ft-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer ref={rootRef} className="ft-root">

        {/* Lilac aurora, pulsing ripples and a dot texture */}
        <motion.div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", y: raysY }}>
          <div className="ft-dots" />
          <div className="ft-aurora ft-aurora-a" />
          <div className="ft-aurora ft-aurora-b" />
          <div className="ft-aurora ft-aurora-c" />
          <div className="ft-ripples">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="ft-ring"
                animate={reduce ? undefined : { scale: [0.18, 1], opacity: [0, 0.8, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeOut", delay: i * 2 }}
                style={reduce ? { transform: `scale(${0.25 + i * 0.18})`, opacity: 0.5 } : undefined}
              />
            ))}
          </div>
        </motion.div>
        <div className="ft-glow" aria-hidden />

        {/* ── HERO: mark, giant serif headline, lede ── */}
        <motion.div
          className="ft-wrap"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          style={{ paddingTop: "clamp(56px, 8vw, 96px)", paddingBottom: "clamp(40px, 6vw, 72px)" }}
        >
          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(28px, 4vw, 44px)" }}>
            <GlowMark />
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: "-0.01em", color: T.ink }}>CuraLink</span>
          </motion.div>

          <div className="ft-hero">
            <WordReveal as="h2" className="ft-headline" text={"Healthcare\nthat truly cares."} />

            <motion.div variants={fadeUp} className="ft-lede" style={{ paddingTop: "clamp(0px, 1.6vw, 22px)" }}>
              <p>Connecting individuals to trusted healthcare professionals through intuitive, AI-driven guidance and seamless digital care.</p>
              <p>We build care that listens — to every symptom, every question, and every person, wherever they are.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── WHITE LINK CARD ── */}
        <div className="ft-wrap">
          <motion.div
            className="ft-card"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8, ease: EASE }}
          >
            <motion.div
              className="ft-card-grid"
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
            >
              {/* Brand + socials */}
              <motion.div variants={fadeUp} className="ft-brand">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.cross} size={18} color="#fff" />
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.04em", color: T.ink }}>CuraLink</span>
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, marginTop: 12, maxWidth: 200, lineHeight: 1.5 }}>Intelligent Healthcare Platform</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {SOCIALS.map(({ label, C }) => (
                    <Magnetic key={label} strength={0.35}>
                      <motion.button aria-label={label} className="ft-social" whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}>
                        <C />
                      </motion.button>
                    </Magnetic>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={fadeUp}>
                <ColHeading>Quick Links</ColHeading>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {QUICK_LINKS.map((l) => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
                </ul>
              </motion.div>

              {/* For Patients */}
              <motion.div variants={fadeUp}>
                <ColHeading>For Patients</ColHeading>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {PATIENT_LINKS.map((l) => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
                </ul>
              </motion.div>

              {/* Get In Touch */}
              <motion.div variants={fadeUp} className="ft-contactcol">
                <ColHeading>Get In Touch</ColHeading>
                {CONTACTS.map((c, i) => {
                  const inner = (
                    <>
                      <span style={{ marginTop: 2, display: "inline-flex" }}><Icon d={c.icon} size={15} color={T.ink} /></span>
                      <span>{c.text}</span>
                    </>
                  );
                  return c.href
                    ? <a key={i} href={c.href} className="ft-contact">{inner}</a>
                    : <div key={i} className="ft-contact">{inner}</div>;
                })}
              </motion.div>

              {/* Newsletter */}
              <motion.div variants={fadeUp} className="ft-news">
                <ColHeading>Stay Updated</ColHeading>
                <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.55, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon d={ICONS.sparkle} size={13} color={T.ink} />
                  Health Updates &amp; Insights
                </p>
                {subscribed ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.check} size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: 14, color: T.ink }}>You're subscribed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} style={{ display: "flex", maxWidth: 340 }}>
                    <input
                      type="email"
                      className="ft-input"
                      placeholder="your@email.com"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="ft-sub" aria-label="Subscribe">
                      <Icon d={ICONS.arrow} size={14} color="#fff" />
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>

            {/* Trust row */}
            <div className="ft-trust">
              {TRUST_ITEMS.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.body }}>
                  <Icon d={t.icon} size={14} color={T.ink} />
                  {t.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM BAR (sits on the pale sky) ── */}
        <div className="ft-wrap" style={{ paddingTop: 30, paddingBottom: 34 }}>
          <motion.div
            className="ft-bar"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span>© {year} CuraLink. All rights reserved.</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              Designed with <Icon d={ICONS.heart} size={12} color={T.ink} /> for your well-being.
            </span>
            <span style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", alignItems: "center" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l, i) => (
                <React.Fragment key={l}>
                  {i > 0 && <span aria-hidden>·</span>}
                  <Link to={`/${l.toLowerCase().replace(/ /g, "-")}`}>{l}</Link>
                </React.Fragment>
              ))}
            </span>
          </motion.div>
        </div>

      </footer>
    </>
  );
};

export default Footer;