import React, { useContext, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
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
  calendar:    ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  pill:        "M10.5 3.5a4 4 0 0 1 5.657 5.657l-7.07 7.07a4 4 0 0 1-5.658-5.656l7.07-7.07z M14 10l-4 4",
  ai:          ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  doc:         "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  bell:        ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  message:     ["M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"],
  alert:       ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  check:       ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  checkDouble: ["m3 12 5 5L18 7", "m9 12 5 5L24 7"],
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  trash:       ["M3 6h18", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M10 11v6", "M14 11v6"],
  inbox:       ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  flask:       ["M9 2v6.5L4.5 17a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2", "M9 2h6", "M8.5 13h7"],
  dot:         ["M12 12h.01"],
};

// ─── CONFIGURATION ─────────────────────────────────────────────────────────────
const FILTERS = [
  { key: "all",          label: "All Updates" },
  { key: "appointment",  label: "Appointments" },
  { key: "prescription", label: "Prescriptions" },
  { key: "lab",          label: "Lab Results" },
  { key: "message",      label: "Messages" },
  { key: "alert",        label: "Alerts" },
];

const TYPE_META = {
  appointment:  { icon: ICONS.calendar, label: "Appointment",  orb: ORBS.violet },
  prescription: { icon: ICONS.pill,     label: "Prescription", orb: ORBS.sun    },
  lab:          { icon: ICONS.flask,    label: "Lab Result",   orb: ORBS.sky    },
  message:      { icon: ICONS.message,  label: "Message",      orb: ORBS.violet },
  alert:        { icon: ICONS.alert,    label: "Clinical Alert",orb: ORBS.sun   },
  ai:           { icon: ICONS.ai,       label: "AI Insight",   orb: ORBS.mint   },
};

const MOCK_NOTIFICATIONS = [
  // Mock data ready for wiring to API
];

const groupOrder = ["Today", "Yesterday", "Earlier"];

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
      fontSize: 12.5,
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
      <Icon d={ICONS.sparkle} size={12} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

// ─── 3D TILT NOTIFICATION CARD ────────────────────────────────────────────────
const TiltNotificationCard = ({ children, style = {}, max = 2.5, className = "", ...rest }) => {
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
      className={`notif-card ${className}`}
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
      style={{ x: sx, y: sy, display: "inline-block" }}
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

// ─── NOTIFICATION ROW ──────────────────────────────────────────────────────────
const NotificationRow = ({ item, onToggleRead, onDismiss }) => {
  const meta = TYPE_META[item.type] || TYPE_META.appointment;

  return (
    <TiltNotificationCard
      style={{
        padding: "20px 22px",
        marginBottom: 12,
        background: item.unread ? T.white : T.surface,
        borderColor: item.unread ? T.ink : T.line,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        
        {/* Category Icon */}
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
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(12,10,9,0.03)",
            position: "relative",
          }}
        >
          <Icon d={meta.icon} size={18} color={T.ink} />
          {item.unread && (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 0 2px white",
              }}
            />
          )}
        </div>

        {/* Content details */}
        <Link to={item.link} style={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                background: T.white,
                border: `1px solid ${T.line}`,
                color: T.ink,
                fontSize: 10.5,
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 20,
                letterSpacing: "-0.01em",
              }}
            >
              {meta.label}
            </span>
            <span style={{ fontSize: 12, color: T.muted }}>·</span>
            <span style={{ fontSize: 12, color: T.muted }}>{item.time}</span>
          </div>

          <p style={{ fontSize: 14.5, fontWeight: item.unread ? 500 : 400, color: T.ink, lineHeight: 1.4 }}>
            {item.title}
          </p>

          <p style={{ fontSize: 13, color: T.body, marginTop: 3, lineHeight: 1.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.detail}
          </p>
        </Link>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, alignSelf: "center", marginLeft: 8 }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleRead(item.id);
            }}
            title={item.unread ? "Mark as read" : "Mark as unread"}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${T.line}`,
              background: T.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
          >
            <Icon d={ICONS.check} size={13} color={item.unread ? T.ink : T.muted} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onDismiss(item.id);
            }}
            title="Dismiss"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${T.line}`,
              background: T.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
          >
            <Icon d={ICONS.trash} size={13} color={T.muted} />
          </button>
        </div>

      </div>
    </TiltNotificationCard>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Notifications = () => {
  const { user } = useContext(Authcontext);
  const userName = user?.name || "there";

  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

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

  const unreadCount = items.filter((i) => i.unread).length;
  const todayCount = items.filter((i) => i.group === "Today").length;

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.type === filter);
  }, [items, filter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((i) => {
      if (!map[i.group]) map[i.group] = [];
      map[i.group].push(i);
    });
    return map;
  }, [filtered]);

  const toggleRead = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unread: !i.unread } : i))
    );

  const dismiss = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const markAllRead = () =>
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .notif-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .notif-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 22px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .notif-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.92), rgba(255,255,255,0) 60%);
        }
        .notif-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 16px 40px rgba(12,10,9,0.06);
        }
        .notif-card:hover::before {
          opacity: 1;
        }

        .stat-capsule {
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 20px;
          padding: 16px 20px;
          transition: all 0.2s ease;
        }
        .stat-capsule:hover {
          background: ${T.white};
          border-color: #D6D3D1;
          transform: translateY(-2px);
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="notif-root"
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

        <div style={{ maxWidth: 940, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL HEADER ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 44,
            }}
          >
            <div>
              <Pill>Live Care Feed</Pill>
              <WordReveal
                as="h1"
                text={"Notifications"}
                style={{
                  fontSize: "clamp(32px, 4.8vw, 54px)",
                  fontWeight: 300,
                  color: T.ink,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              />
              <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, maxWidth: 500 }}>
                Real-time clinical updates, physician messages, and prescription alerts for {userName}.
              </motion.p>
            </div>

            <motion.div variants={fadeUp}>
              <Magnetic strength={0.25}>
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  style={{
                    background: unreadCount === 0 ? T.surface : T.ink,
                    color: unreadCount === 0 ? T.muted : "white",
                    fontWeight: 500,
                    fontSize: 13.5,
                    padding: "12px 24px",
                    borderRadius: 999,
                    border: `1px solid ${unreadCount === 0 ? T.line : T.ink}`,
                    cursor: unreadCount === 0 ? "default" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Icon d={ICONS.checkDouble} size={14} color={unreadCount === 0 ? T.muted : "white"} />
                  Mark all as read
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* ──────────────── 2. METRICS CAPSULES ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}
          >
            {[
              { label: "Unread Alerts", value: unreadCount,    icon: ICONS.dot      },
              { label: "Delivered Today", value: todayCount,   icon: ICONS.calendar },
              { label: "Total Stream",  value: items.length,   icon: ICONS.inbox    },
            ].map((s, i) => (
              <div key={i} className="stat-capsule">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>{s.label}</span>
                  <Icon d={s.icon} size={14} color={T.ink} />
                </div>
                <p style={{ fontSize: 28, fontWeight: 300, color: T.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ──────────────── 3. FILTER TABS CONSOLE ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 32,
              padding: "16px 20px",
              background: T.surface,
              borderRadius: 24,
              border: `1px solid ${T.line}`,
            }}
          >
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: "7px 18px",
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
                  {f.label}
                </button>
              );
            })}
          </motion.div>

          {/* ──────────────── 4. NOTIFICATION STREAM ──────────────── */}
          {filtered.length === 0 ? (
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
                <Icon d={ICONS.inbox} size={24} color={T.ink} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>
                You're completely caught up
              </h3>
              <p style={{ color: T.muted, fontSize: 14, maxWidth: 360, margin: "0 auto" }}>
                No active notifications or clinical updates in this view.
              </p>
            </motion.div>
          ) : (
            groupOrder
              .filter((g) => grouped[g]?.length)
              .map((g) => (
                <div key={g} style={{ marginBottom: 32 }}>
                  {/* Clean Hairline Group Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingLeft: 4 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {g}
                    </span>
                    <div style={{ flex: 1, height: 1, background: T.line }} />
                  </div>

                  <AnimatePresence initial={false}>
                    {grouped[g].map((item) => (
                      <NotificationRow
                        key={item.id}
                        item={item}
                        onToggleRead={toggleRead}
                        onDismiss={dismiss}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ))
          )}

        </div>
      </div>
    </>
  );
};

export default Notifications;