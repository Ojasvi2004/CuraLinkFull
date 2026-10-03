import React, { useState, useContext, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
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
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  eyeOff:   ["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M1 1l22 22"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  alert:    ["M12 9v2m0 4h.01", "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"],
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.94-2.27 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// ─── PASSWORD STRENGTH HELPER ─────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: T.line },
    { label: "Weak",   color: "#EF4444" },
    { label: "Fair",   color: "#F59E0B" },
    { label: "Good",   color: "#10B981" },
    { label: "Strong", color: T.ink },
  ];
  return { score, ...map[score] };
};

const TRUST = [
  { icon: ICONS.shield,   text: "256-bit SSL encryption" },
  { icon: ICONS.heart,    text: "HIPAA compliant" },
  { icon: ICONS.calendar, text: "Free to join" },
];

// ─── FLOATING INPUT FIELD ─────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", value, onChange, icon, rightEl, required = true }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value?.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          position: "absolute",
          left: 44,
          top: active ? 9 : "50%",
          transform: active ? "none" : "translateY(-50%)",
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

      <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
        <Icon d={icon} size={16} color={focused ? T.ink : T.muted} />
      </div>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        style={{
          width: "100%",
          height: 56,
          paddingTop: active ? 19 : 0,
          paddingBottom: active ? 3 : 0,
          paddingLeft: 44,
          paddingRight: rightEl ? 46 : 16,
          borderRadius: 16,
          border: `1px solid ${focused ? T.ink : T.line}`,
          background: focused ? T.white : T.surface2,
          outline: "none",
          fontSize: 14,
          color: T.ink,
          fontFamily: "'Inter', sans-serif",
          boxSizing: "border-box",
          transition: "all 0.22s ease",
          boxShadow: focused ? "0 4px 18px rgba(12,10,9,0.04)" : "none",
        }}
      />

      {rightEl && (
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
          {rightEl}
        </div>
      )}
    </div>
  );
};

// ─── EYEBROW PILL ────────────────────────────────────────────────────────────
const Pill = ({ children }) => (
  <motion.span
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: EASE }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
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
      <Icon d={ICONS.sparkle} size={11} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

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
      style={{ x: sx, y: sy, width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

// ─── MAIN REGISTER PAGE ───────────────────────────────────────────────────────
const RegisterPage = () => {
  const { settoken } = useContext(Authcontext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPw,       setShowPw]       = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [terms,        setTerms]        = useState(false);

  const cardRef = useRef(null);
  const strength = getStrength(formData.password);

  // Mouse Parallax for ambient orbs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const orbX1 = useTransform(smx, [-0.5, 0.5], [-35, 35]);
  const orbY1 = useTransform(smy, [-0.5, 0.5], [-25, 25]);
  const orbX2 = useTransform(smx, [-0.5, 0.5], [25, -25]);
  const orbY2 = useTransform(smy, [-0.5, 0.5], [25, -25]);

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!terms) {
      setError("Please accept the Terms and Conditions.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${server}/api/user/register`, formData);
      if (response.data.success) {
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .reg-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow-x: clip;
          padding: 48px 24px;
        }

        .auth-card {
          position: relative;
          isolation: isolate;
          width: 100%;
          max-width: 480px;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 28px;
          padding: clamp(30px, 5vw, 44px);
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .auth-card::before {
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
        .auth-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 50px rgba(12,10,9,0.06);
        }
        .auth-card:hover::before {
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

        .reg-btn-google {
          width: 100%;
          height: 50px;
          border-radius: 999px;
          border: 1px solid ${T.line};
          background: ${T.white};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: ${T.ink};
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .reg-btn-google:hover {
          background: ${T.surface2};
          border-color: #D6D3D1;
          transform: translateY(-1px);
        }

        .reg-checkbox {
          width: 16px;
          height: 16px;
          accent-color: ${T.ink};
          cursor: pointer;
          flex-shrink: 0;
          border-radius: 4px;
        }

        .auth-link {
          color: ${T.ink};
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .auth-link:hover {
          border-color: ${T.ink};
        }
      `}</style>

      <div
        className="reg-root"
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
            left: -100,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.32,
            filter: "blur(60px)",
            pointerEvents: "none",
            x: orbX1,
            y: orbY1,
          }}
        />
        <motion.div
          style={{
            position: "fixed",
            bottom: -100,
            right: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.28,
            filter: "blur(55px)",
            pointerEvents: "none",
            x: orbX2,
            y: orbY2,
          }}
        />

        <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>

          {/* ── LOGO / HOME LINK ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div
                style={{
                  position: "relative",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: T.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.cross} size={16} color="white" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em" }}>
                CuraLink
              </span>
            </Link>
          </motion.div>

          {/* ── CARD ── */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="auth-card"
            onMouseMove={(e) => {
              if (!cardRef.current) return;
              const r = cardRef.current.getBoundingClientRect();
              cardRef.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
              cardRef.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
            }}
          >
            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <Pill>Free Account</Pill>
              <h1
                style={{
                  fontSize: "clamp(24px, 3.5vw, 30px)",
                  fontWeight: 300,
                  color: T.ink,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: 6,
                }}
              >
                Create your account
              </h1>
              <p style={{ fontSize: 14, color: T.body, lineHeight: 1.6 }}>
                Join CuraLink and take control of your health journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Full Name */}
              <Field
                label="Full Name"
                name="fullName"
                type="text"
                icon={ICONS.user}
                value={formData.fullName}
                onChange={changeHandler}
              />

              {/* Email Address */}
              <Field
                label="Email Address"
                name="email"
                type="email"
                icon={ICONS.mail}
                value={formData.email}
                onChange={changeHandler}
              />

              {/* Password */}
              <div>
                <Field
                  label="Password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  icon={ICONS.lock}
                  value={formData.password}
                  onChange={changeHandler}
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: T.muted,
                      }}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      <Icon d={showPw ? ICONS.eyeOff : ICONS.eye} size={16} />
                    </button>
                  }
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div style={{ marginTop: 8, padding: "0 4px" }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            height: 3,
                            flex: 1,
                            borderRadius: 2,
                            background: i <= strength.score ? strength.color : T.line,
                            transition: "background 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p style={{ fontSize: 11, fontWeight: 500, color: strength.color, letterSpacing: "-0.01em" }}>
                        {strength.label} password
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Field
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  icon={ICONS.lock}
                  value={formData.confirmPassword}
                  onChange={changeHandler}
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: T.muted,
                      }}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      <Icon d={showConfirm ? ICONS.eyeOff : ICONS.eye} size={16} />
                    </button>
                  }
                />

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <p
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: formData.password === formData.confirmPassword ? "#10B981" : "#EF4444",
                      marginTop: 6,
                      paddingLeft: 4,
                    }}
                  >
                    {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  background: T.surface2,
                  borderRadius: 14,
                  border: `1px solid ${T.line}`,
                }}
              >
                <input
                  type="checkbox"
                  id="terms"
                  className="reg-checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <label htmlFor="terms" style={{ fontSize: 13, color: T.body, lineHeight: 1.5, cursor: "pointer" }}>
                  I agree to the{" "}
                  <Link to="/terms" className="auth-link">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="auth-link">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#FEF2F2",
                      border: "1px solid #FEE2E2",
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "#DC2626",
                    }}
                  >
                    <Icon d={ICONS.alert} size={15} color="#DC2626" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div style={{ marginTop: 6 }}>
                <Magnetic>
                  <button type="submit" className="btn-ink" disabled={loading}>
                    {loading ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                        </path>
                      </svg>
                    ) : (
                      <>
                        Create Account
                        <Icon d={ICONS.arrow} size={14} color="white" />
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0 18px" }}>
              <div style={{ flex: 1, height: 1, background: T.line }} />
              <span style={{ fontSize: 12, fontWeight: 400, color: T.muted }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: T.line }} />
            </div>

            {/* Google Signup Button */}
            {/* <button
              type="button"
              className="reg-btn-google"
              onClick={() => alert("Google Sign-up (UI only)")}
            >
              <GoogleIcon />
              Continue with Google
            </button> */}

          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 24 }}
          >
            {TRUST.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  borderRadius: 20,
                  padding: "5px 12px",
                }}
              >
                <Icon d={t.icon} size={12} color={T.ink} />
                <span style={{ fontSize: 11.5, fontWeight: 400, color: T.body }}>{t.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Sign In Link */}
          <p style={{ textAlign: "center", fontSize: 13.5, color: T.muted, marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in →
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default RegisterPage;