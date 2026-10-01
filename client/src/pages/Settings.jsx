import React, { useState, useContext, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

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
  bell:    ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  lock:    ["M12 15v2", "M6 20h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z", "M16 10V7a4 4 0 0 0-8 0v3"],
  globe:   ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  chevron: "m9 18 6-6-6-6",
  key:     ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3-3.5 3.5z"],
  danger:  ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  save:    ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:   ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

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
  const lines = (text || "").split("\n");
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

// ─── 3D TILT CARD ─────────────────────────────────────────────────────────────
const TiltCard = ({ children, style = {}, max = 2.5, className = "", ...rest }) => {
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
      className={`settings-tilt-card ${className}`}
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

// ─── MINIMAL MONOCHROME TOGGLE SWITCH ─────────────────────────────────────────
const ToggleSwitch = ({ enabled, setEnabled, labelId }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-labelledby={labelId}
    onClick={() => setEnabled(!enabled)}
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      width: 44,
      height: 24,
      borderRadius: 999,
      border: `1px solid ${enabled ? T.ink : T.line}`,
      cursor: "pointer",
      flexShrink: 0,
      padding: 0,
      background: enabled ? T.ink : T.surface2,
      transition: "background 0.2s ease, border-color 0.2s ease",
    }}
  >
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      style={{
        position: "absolute",
        left: enabled ? 22 : 2,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: enabled ? T.white : T.muted,
        boxShadow: "0 2px 6px rgba(12,10,9,0.15)",
      }}
    />
  </button>
);

// ─── SETTING ROW HELPER ───────────────────────────────────────────────────────
const SettingRow = ({ label, description, labelId, control, bordered = true }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "16px 0",
      borderTop: bordered ? `1px solid ${T.line}` : "none",
    }}
  >
    <div>
      <label id={labelId} style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>
        {label}
      </label>
      {description && (
        <p style={{ fontSize: 13, color: T.muted, marginTop: 2, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </div>
    {control}
  </div>
);

// ─── MAIN SETTINGS PAGE ──────────────────────────────────────────────────────
const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [saved, setSaved] = useState(false);
  const { token } = useContext(Authcontext);
  const navigate = useNavigate();

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

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`${server}/api/user/deleteUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleSave = () => {
    alert("Settings Save (UI Only)");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .settings-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .settings-tilt-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 28px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .settings-tilt-card::before {
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
        .settings-tilt-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .settings-tilt-card:hover::before {
          opacity: 1;
        }

        .settings-select {
          width: 100%;
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .settings-select:focus {
          border-color: ${T.ink};
        }

        .btn-ink {
          padding: 12px 26px;
          border-radius: 999px;
          background: ${T.ink};
          color: white;
          font-size: 13.5px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: box-shadow 0.25s, transform 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-ink:hover {
          box-shadow: 0 10px 28px rgba(12,10,9,0.2);
          transform: translateY(-1px);
        }

        .settings-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 10px;
          border-radius: 14px;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .settings-nav-row:hover {
          background: ${T.white};
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="settings-root"
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

          {/* ──────────────── 1. EDITORIAL HERO CONSOLE ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{ marginBottom: 36 }}
          >
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.line}`,
                borderRadius: 32,
                padding: "clamp(30px, 4.5vw, 44px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: ORBS.violet,
                  opacity: 0.4,
                  filter: "blur(50px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <Pill>Preferences & Governance</Pill>
                <WordReveal
                  as="h1"
                  text={"Account Settings"}
                  style={{
                    fontSize: "clamp(30px, 4.5vw, 46px)",
                    fontWeight: 300,
                    color: T.ink,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}
                />
                <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, maxWidth: 500 }}>
                  Manage notifications, security credentials, clinical data synchronization, and language preferences.
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* ──────────────── 2. NOTIFICATIONS MODULE ──────────────── */}
          <TiltCard style={{ padding: "30px 32px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.bell} size={16} color={T.ink} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                  Care Notifications
                </h2>
                <p style={{ fontSize: 12.5, color: T.muted }}>Direct clinical communications and reminders</p>
              </div>
            </div>

            <div>
              <SettingRow
                labelId="email-label"
                label="Email Notifications"
                description="Receive clinical consultation summaries and platform notifications via email."
                bordered={false}
                control={
                  <ToggleSwitch
                    enabled={emailNotifications}
                    setEnabled={setEmailNotifications}
                    labelId="email-label"
                  />
                }
              />
              <SettingRow
                labelId="sms-label"
                label="SMS Care Reminders"
                description="Receive real-time cellular reminders for scheduled appointments."
                control={
                  <ToggleSwitch
                    enabled={smsReminders}
                    setEnabled={setSmsReminders}
                    labelId="sms-label"
                  />
                }
              />
            </div>
          </TiltCard>

          {/* ──────────────── 3. SECURITY & CREDENTIALS ──────────────── */}
          <TiltCard style={{ padding: "30px 32px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.lock} size={16} color={T.ink} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                  Security & Access
                </h2>
                <p style={{ fontSize: 12.5, color: T.muted }}>Manage passwords and session security</p>
              </div>
            </div>

            <div>
              <Link to="/change-password" className="settings-nav-row">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: T.white,
                      border: `1px solid ${T.line}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon d={ICONS.key} size={14} color={T.ink} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 400, color: T.ink }}>Change Your Password</span>
                </div>
                <Icon d={ICONS.chevron} size={14} color={T.muted} />
              </Link>
            </div>
          </TiltCard>

          {/* ──────────────── 4. PREFERENCES ──────────────── */}
          <TiltCard style={{ padding: "30px 32px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.globe} size={16} color={T.ink} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                  Interface Localization
                </h2>
                <p style={{ fontSize: 12.5, color: T.muted }}>Set language and regional formats</p>
              </div>
            </div>

            <div>
              <label
                htmlFor="language"
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 8,
                }}
              >
                Display Language
              </label>
              <select
                id="language"
                name="language"
                defaultValue="en-US"
                className="settings-select"
              >
                <option value="en-US">English (United States)</option>
              </select>
            </div>
          </TiltCard>

          {/* ──────────────── 5. DANGER ZONE (ACCOUNT GOVERNANCE) ──────────────── */}
          <TiltCard
            style={{
              padding: "30px 32px",
              marginBottom: 32,
              border: `1px dashed #FECACA`,
              background: "#FFFBFB",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "#FEF2F2",
                  border: "1px solid #FEE2E2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.danger} size={16} color="#DC2626" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 400, color: "#DC2626", letterSpacing: "-0.015em" }}>
                Account Deletion
              </h3>
            </div>

            <p style={{ fontSize: 13.5, color: T.body, lineHeight: 1.65, marginBottom: 20 }}>
              Permanently expunge your CuraLink account, health repository documents, and consultation records. This action cannot be reversed.
            </p>

            <button
              type="button"
              onClick={handleDeleteAccount}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#DC2626",
                background: T.white,
                border: "1px solid #FECACA",
                padding: "10px 22px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Delete My Account
            </button>
          </TiltCard>

          {/* ──────────────── 6. SAVE BAR ──────────────── */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Magnetic>
              <button
                type="button"
                onClick={handleSave}
                className="btn-ink"
              >
                <Icon d={saved ? ICONS.check : ICONS.save} size={15} color="white" />
                {saved ? "Preferences Saved" : "Save Preferences"}
              </button>
            </Magnetic>
          </div>

        </div>
      </div>
    </>
  );
};

export default SettingsPage;