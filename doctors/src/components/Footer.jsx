import React, { useState, useRef, useMemo, useContext } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // adjust the path if your Footer lives elsewhere

// ─── THEME TOKENS (same as the doctor hero) ──────────────────────────────────
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

// ─── ICONS ───────────────────────────────────────────────────────────────────
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

// ─── LINKS (all taken from the doctor routes in App.jsx) ─────────────────────
const EXPLORE_PUBLIC = [
  { label: "Features",     to: "/doctor/features"     },
  { label: "How It Works", to: "/doctor/how-it-works" },
  { label: "FAQ",          to: "/doctor/faq"          },
];
const EXPLORE_GUEST = [
  { label: "Register Your Clinic", to: "/doctor/register" },
  { label: "Doctor Login",         to: "/doctor/login"    },
];
const EXPLORE_MEMBER = [
  { label: "Profile Settings",  to: "/doctor/settings"    },
  { label: "Patient Data Access", to: "/doctor/permissions" },
];
const WORKSPACE = [
  { label: "Dashboard",        to: "/doctor/dashboard"        },
  { label: "Appointments",     to: "/doctor/appointments"     },
  { label: "My Patients",      to: "/doctor/patients"         },
  { label: "Add Patient",      to: "/doctor/add-patient"      },
  { label: "Live Queue",       to: "/doctor/queue-management" },
  { label: "Set Availability", to: "/doctor/availability"     },
];
const BOTTOM_LINKS = [
  { label: "Patient Data Access", to: "/doctor/permissions" },
  { label: "Settings",            to: "/doctor/settings"    },
  { label: "FAQ",                 to: "/doctor/faq"         },
];
const TRUST_ITEMS = [
  { icon: ICONS.shield, label: "256-bit SSL"     },
  { icon: ICONS.check,  label: "HIPAA Compliant" },
  { icon: ICONS.heart,  label: "Patient-First"   },
];
const CONTACTS = [
  { icon: ICONS.location, text: "123 Health St, Wellness City" },
  { icon: ICONS.mail,     text: "doctors@curalink.com", href: "mailto:doctors@curalink.com" },
  { icon: ICONS.phone,    text: "(123) 456-7890",       href: "tel:+1234567890" },
];

// ─── ANIMATION ───────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};

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

// ─── NEURAL CONSTELLATION (echoes the hero brain, SVG only) ──────────────────
const NeuralArt = ({ reduce }) => {
  const { nodes, edges } = useMemo(() => {
    let s = 7;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const nodes = [];
    while (nodes.length < 46) {
      const x = rnd() * 2 - 1, y = rnd() * 2 - 1;
      if ((x * x) / 1 + (y * y) / 0.62 > 1) continue;                 // brain-ish ellipse
      if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 0.028)) continue;
      nodes.push({ x, y, r: 2.2 + rnd() * 3, d: rnd() * 5, h: rnd() });
    }
    const edges = [];
    nodes.forEach((a, i) => nodes.forEach((b, j) => {
      if (j > i && (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < 0.13) edges.push([a, b]);
    }));
    return { nodes, edges };
  }, []);
  const P = ["#7C8CFF", "#C9B8FF", "#F6A5D8", "#A5D8FF", "#FFB36B"];
  return (
    <svg className="dft-neural" viewBox="-1.1 -0.85 2.2 1.7" aria-hidden>
      <defs>
        <linearGradient id="dft-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C8CFF" /><stop offset="1" stopColor="#F6A5D8" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#dft-g)" strokeWidth="0.004" opacity="0.55" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r / 260} fill={P[(n.h * P.length) | 0]}
          className={reduce ? undefined : "dft-node"} style={{ animationDelay: `${n.d}s` }} />
      ))}
    </svg>
  );
};

// ─── SMALL PIECES ────────────────────────────────────────────────────────────
const FooterLink = ({ to, children }) => (
  <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.2, ease: EASE }}>
    <Link to={to} className="dft-link">{children}</Link>
  </motion.li>
);
const ColHeading = ({ children }) => (
  <h4 style={{ fontSize: 12, fontWeight: 600, color: T.ink, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 20 }}>{children}</h4>
);

// ink mark with the same pulse as the hero badge
const PulseMark = () => (
  <div style={{ position: "relative", width: 56, height: 56 }}>
    <motion.span aria-hidden animate={{ scale: [1, 1.7], opacity: [0.35, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
    <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={ICONS.cross} size={24} color="white" />
    </div>
  </div>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const DoctorFooter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();
  const { token } = useContext(AuthContext);

  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end end"] });
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -30]);

  const explore = [...EXPLORE_PUBLIC, ...(token ? EXPLORE_MEMBER : EXPLORE_GUEST)];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        .dft-root {
          position: relative; isolation: isolate; overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: ${T.ink}; -webkit-font-smoothing: antialiased;
          background: linear-gradient(180deg, ${T.white} 0%, #F4F0FF 28%, #E9E3FC 62%, #F5F1FF 100%);
        }
        .dft-root ::selection { background: ${T.ink}; color: ${T.white}; }
        .dft-aurora { position: absolute; border-radius: 50%; filter: blur(80px); }
        .dft-aurora-a { top: -10%; left: -8%; width: 520px; height: 520px; background: #C9B8FF; opacity: 0.5; }
        .dft-aurora-b { top: 6%; right: 4%; width: 460px; height: 460px; background: #A5D8FF; opacity: 0.45; }
        .dft-aurora-c { bottom: 6%; left: 24%; width: 420px; height: 420px; background: #FFD9B8; opacity: 0.5; }
        .dft-aurora-d { bottom: -8%; right: -4%; width: 380px; height: 380px; background: #F6A5D8; opacity: 0.35; }
        .dft-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(124,140,255,0.35) 1px, transparent 1.3px);
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(ellipse 70% 80% at 100% 0%, #000 0%, transparent 70%);
                  mask-image: radial-gradient(ellipse 70% 80% at 100% 0%, #000 0%, transparent 70%);
        }
        .dft-neural { position: absolute; top: 3%; right: 1%; width: min(52vw, 640px); opacity: 0.9; overflow: visible; }
        @keyframes dft-pulse { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 1; transform: scale(1.9); } }
        .dft-node { transform-box: fill-box; transform-origin: center; animation: dft-pulse 4.5s ease-in-out infinite; }

        .dft-wrap { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        .dft-hero { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; align-items: start; }
        .dft-headline {
          font-weight: 300; font-size: clamp(44px, 7vw, 100px);
          line-height: 1.02; letter-spacing: -0.04em; color: ${T.ink};
        }
        .dft-lede p { font-size: clamp(15px, 1.25vw, 17.5px); line-height: 1.7; color: ${T.body}; margin: 0 0 14px; max-width: 520px; }
        .dft-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }

        .btn-ink {
          display: inline-flex; align-items: center; gap: 8px; background: ${T.ink}; color: #fff;
          font-weight: 500; font-size: 14px; padding: 14px 28px; border-radius: 999px; text-decoration: none;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .btn-ink:hover { box-shadow: 0 16px 36px rgba(12,10,9,0.25); transform: translateY(-1px); }
        .btn-ink svg { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .btn-ink:hover svg:last-child { transform: translateX(4px); }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
          color: ${T.ink}; font-weight: 500; font-size: 14px; padding: 13px 28px; border-radius: 999px; text-decoration: none;
          border: 1px solid ${T.line}; transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .btn-outline:hover { background: ${T.white}; border-color: #D6D3D1; transform: translateY(-1px); }

        .dft-card {
          background: ${T.white}; border: 1px solid ${T.line}; border-radius: 28px;
          padding: clamp(28px, 5vw, 64px); box-shadow: 0 30px 80px rgba(12,10,9,0.08);
        }
        .dft-card-grid { display: grid; grid-template-columns: 1.15fr 1fr 1fr 1.2fr 1.35fr; gap: 40px 36px; }
        .dft-brand { display: flex; flex-direction: column; justify-content: space-between; gap: 36px; }

        .dft-link { display: inline-block; font-size: 14.5px; color: ${T.body}; text-decoration: none; padding: 6px 0; transition: color 0.2s; }
        .dft-link:hover { color: ${T.ink}; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
        .dft-link:focus-visible, .dft-social:focus-visible, .dft-sub:focus-visible, .dft-input:focus-visible,
        .btn-ink:focus-visible, .btn-outline:focus-visible { outline: 2px solid ${T.ink}; outline-offset: 3px; }

        .dft-social { background: none; border: none; padding: 4px; color: ${T.body}; cursor: pointer; display: flex; transition: color 0.2s; }
        .dft-social:hover { color: ${T.ink}; }
        .dft-contact { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; color: ${T.body}; text-decoration: none; padding: 6px 0; line-height: 1.4; transition: color 0.2s; }
        a.dft-contact:hover { color: ${T.ink}; }

        .dft-input {
          flex: 1; min-width: 0; height: 44px; padding: 0 16px; background: ${T.surface}; border: 1px solid ${T.line}; border-right: none;
          border-radius: 999px 0 0 999px; color: ${T.ink}; font-size: 14px; font-family: inherit; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .dft-input::placeholder { color: ${T.muted}; }
        .dft-input:focus { background: ${T.white}; border-color: #A8A29E; }
        .dft-sub {
          height: 44px; padding: 0 18px; border: none; cursor: pointer; background: ${T.ink};
          border-radius: 0 999px 999px 0; display: flex; align-items: center; justify-content: center; transition: background 0.2s;
        }
        .dft-sub:hover { background: #292524; }

        .dft-trust { margin-top: 44px; padding-top: 24px; border-top: 1px solid ${T.line}; display: flex; flex-wrap: wrap; gap: 10px 26px; }
        .dft-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 24px; font-size: 12.5px; color: ${T.body}; }
        .dft-bar a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .dft-bar a:hover { color: ${T.ink}; }

        @media (max-width: 1100px) {
          .dft-card-grid { grid-template-columns: repeat(3, 1fr); }
          .dft-brand { grid-column: 1 / -1; flex-direction: row; align-items: flex-end; flex-wrap: wrap; }
          .dft-news { grid-column: span 2; }
        }
        @media (max-width: 900px) {
          .dft-hero { grid-template-columns: 1fr; gap: 28px; }
          .dft-neural { opacity: 0.45; width: 90vw; top: 0; }
        }
        @media (max-width: 680px) {
          .dft-card-grid { grid-template-columns: 1fr 1fr; gap: 34px 20px; }
          .dft-contactcol, .dft-news { grid-column: 1 / -1; }
          .dft-trust { gap: 10px 18px; }
          .dft-bar { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 380px) { .dft-card-grid { grid-template-columns: 1fr; } }
      `}</style>

      <footer ref={rootRef} className="dft-root">

        {/* pastel aurora, dot texture and neural constellation */}
        <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="dft-dots" />
          <div className="dft-aurora dft-aurora-a" />
          <div className="dft-aurora dft-aurora-b" />
          <div className="dft-aurora dft-aurora-c" />
          <div className="dft-aurora dft-aurora-d" />
          <motion.div style={{ y: artY }}><NeuralArt reduce={reduce} /></motion.div>
        </div>

        {/* ── HERO: mark, headline, lede ── */}
        <motion.div
          className="dft-wrap"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          style={{ paddingTop: "clamp(56px, 8vw, 96px)", paddingBottom: "clamp(40px, 6vw, 72px)" }}
        >
          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(28px, 4vw, 44px)" }}>
            <PulseMark />
            <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.04em", color: T.ink }}>CuraLink</span>
          </motion.div>

          <div className="dft-hero">
            <WordReveal as="h2" className="dft-headline" text={"Less admin.\nMore medicine."} />

            <motion.div variants={fadeUp} className="dft-lede" style={{ paddingTop: "clamp(0px, 1.6vw, 22px)" }}>
              <p>Appointments, queues and video visits in one calm workspace, built with and for practising doctors.</p>
              <p>We take care of the schedule so your attention stays on the patient in front of you.</p>
              <div className="dft-row">
                <Magnetic>
                  <Link to={token ? "/doctor/dashboard" : "/doctor/register"} className="btn-ink">
                    {token ? "Open dashboard" : "Register your clinic"} <Icon d={ICONS.arrow} size={15} color="white" />
                  </Link>
                </Magnetic>
                {!token && (
                  <Magnetic><Link to="/doctor/login" className="btn-outline">Doctor login</Link></Magnetic>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── WHITE LINK CARD ── */}
        <div className="dft-wrap">
          <motion.div
            className="dft-card"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8, ease: EASE }}
          >
            <motion.div className="dft-card-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>

              {/* Brand + socials */}
              <motion.div variants={fadeUp} className="dft-brand">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.cross} size={18} color="#fff" />
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.04em", color: T.ink }}>CuraLink</span>
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, marginTop: 12, maxWidth: 200, lineHeight: 1.5 }}>Practice workspace for doctors</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {SOCIALS.map(({ label, C }) => (
                    <Magnetic key={label} strength={0.35}>
                      <motion.button aria-label={label} className="dft-social" whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}>
                        <C />
                      </motion.button>
                    </Magnetic>
                  ))}
                </div>
              </motion.div>

              {/* Explore */}
              <motion.div variants={fadeUp}>
                <ColHeading>Explore</ColHeading>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {explore.map((l) => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
                </ul>
              </motion.div>

              {/* Workspace */}
              <motion.div variants={fadeUp}>
                <ColHeading>Your Workspace</ColHeading>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {WORKSPACE.map((l) => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
                </ul>
              </motion.div>

              {/* Contact */}
              <motion.div variants={fadeUp} className="dft-contactcol">
                <ColHeading>Get In Touch</ColHeading>
                {CONTACTS.map((c, i) => {
                  const inner = (
                    <>
                      <span style={{ marginTop: 2, display: "inline-flex" }}><Icon d={c.icon} size={15} color={T.ink} /></span>
                      <span>{c.text}</span>
                    </>
                  );
                  return c.href
                    ? <a key={i} href={c.href} className="dft-contact">{inner}</a>
                    : <div key={i} className="dft-contact">{inner}</div>;
                })}
              </motion.div>

              {/* Newsletter */}
              <motion.div variants={fadeUp} className="dft-news">
                <ColHeading>Stay Updated</ColHeading>
                <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.55, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon d={ICONS.sparkle} size={13} color={T.ink} />
                  Product updates for doctors
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
                    <input type="email" className="dft-input" placeholder="you@clinic.com" aria-label="Email address"
                      value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit" className="dft-sub" aria-label="Subscribe">
                      <Icon d={ICONS.arrow} size={14} color="#fff" />
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>

            <div className="dft-trust">
              {TRUST_ITEMS.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.body }}>
                  <Icon d={t.icon} size={14} color={T.ink} />
                  {t.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="dft-wrap" style={{ paddingTop: 30, paddingBottom: 34 }}>
          <motion.div className="dft-bar" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
            <span>© {year} CuraLink. All rights reserved.</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              Designed with <Icon d={ICONS.heart} size={12} color={T.ink} /> for the people who heal.
            </span>
            <span style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", alignItems: "center" }}>
              {BOTTOM_LINKS.map((l, i) => (
                <React.Fragment key={l.label}>
                  {i > 0 && <span aria-hidden>·</span>}
                  <Link to={l.to}>{l.label}</Link>
                </React.Fragment>
              ))}
            </span>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default DoctorFooter;