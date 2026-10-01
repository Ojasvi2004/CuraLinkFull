import React, { useContext, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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
  mail:    ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  lock:    ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  eye:     ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  eyeOff:  ["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M1 1l22 22"],
  arrow:   "M17 8l4 4m0 0l-4 4m4-4H3",
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  alert:   ["M12 9v2m0 4h.01", "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"],
};

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE } },
};

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} initial="hidden" animate="visible" style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em", marginRight: "0.22em" }}>
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
      marginBottom: 14,
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

// Magnetic button wrapper
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

// ─── FLOATING INPUT FIELD ─────────────────────────────────────────────────────
const Field = ({ label, name, type, value, onChange, icon, rightEl }) => {
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
        required
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

// ─── MAIN LOGIN PAGE ──────────────────────────────────────────────────────────
const LoginPage = () => {
  const { settoken } = useContext(Authcontext);
  const navigate = useNavigate();

  const [formData, setformData] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cardRef = useRef(null);

  // Mouse Parallax for Ambient Orbs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const orbX1 = useTransform(smx, [-0.5, 0.5], [-35, 35]);
  const orbY1 = useTransform(smy, [-0.5, 0.5], [-25, 25]);
  const orbX2 = useTransform(smx, [-0.5, 0.5], [25, -25]);
  const orbY2 = useTransform(smy, [-0.5, 0.5], [25, -25]);

  const changeHandler = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${server}/api/user/login`, formData);

      if (response.data.success) {
        const token = response.data.token;
        settoken(token);
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .auth-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .auth-card {
          position: relative;
          isolation: isolate;
          width: 100%;
          max-width: 440px;
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
        className="auth-root"
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
      >
        {/* Ambient Iridescent Background Orbs */}
        <motion.div
          style={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.35,
            filter: "blur(60px)",
            pointerEvents: "none",
            x: orbX1,
            y: orbY1,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.3,
            filter: "blur(55px)",
            pointerEvents: "none",
            x: orbX2,
            y: orbY2,
          }}
        />

        {/* ── LOGIN CARD ── */}
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
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Pill>Secure Access</Pill>
            <WordReveal
              as="h2"
              text={"Welcome Back"}
              style={{
                fontSize: "clamp(26px, 3.5vw, 32px)",
                fontWeight: 300,
                color: T.ink,
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            />
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ fontSize: 14.5, color: T.body, lineHeight: 1.6 }}
            >
              Sign in to continue to CuraLink
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={changeHandler}
              icon={ICONS.mail}
            />

            <Field
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              value={formData.password}
              onChange={changeHandler}
              icon={ICONS.lock}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={{
                    background: "none",
                    border: "none",
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

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
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

            {/* Submit Button */}
            <div style={{ marginTop: 8 }}>
              <Magnetic>
                <button type="submit" disabled={loading} className="btn-ink">
                  {loading ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                      </path>
                    </svg>
                  ) : (
                    <>
                      Sign in
                      <Icon d={ICONS.arrow} size={14} color="white" />
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </form>

          {/* Footer Navigation */}
          <p style={{ marginTop: 26, textAlign: "center", fontSize: 13.5, color: T.muted }}>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;