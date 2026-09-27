import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";
const server=import.meta.env.VITE_SERVER;


const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
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
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
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


const Field = ({ label, name, type = "text", placeholder, value, onChange, icon, rightEl, required = true }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value?.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <label style={{
        position: "absolute", left: 44, top: active ? 7 : "50%",
        transform: active ? "none" : "translateY(-50%)",
        fontSize: active ? 10 : 13.5, fontWeight: active ? 700 : 500,
        color: focused ? "#6366F1" : active ? "#94A3B8" : "#94A3B8",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "none", letterSpacing: active ? "0.06em" : "0",
        textTransform: active ? "uppercase" : "none", zIndex: 2,
      }}>
        {label}
      </label>

      {/* Left icon */}
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", zIndex: 2, transition: "color 0.18s" }}>
        <Icon d={icon} size={16} color={focused ? "#6366F1" : "#94A3B8"} />
      </div>

      <input
        name={name} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        required={required}
        placeholder=""
        style={{
          width: "100%", height: 58,
          paddingTop: active ? 22 : 0,
          paddingBottom: active ? 6 : 0,
          paddingLeft: 44, paddingRight: rightEl ? 44 : 14,
          background: focused ? "#FAFBFF" : "#F8FAFC",
          border: `1.5px solid ${focused ? "#6366F1" : "#E2E8F0"}`,
          borderRadius: 14, outline: "none",
          fontSize: 14, fontWeight: 500, color: "#0F172A",
          transition: "all 0.18s",
          boxShadow: focused ? "0 0 0 4px rgba(99,102,241,0.08)" : "none",
          fontFamily: "'DM Sans', sans-serif",
          boxSizing: "border-box",
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


const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "#E2E8F0" },
    { label: "Weak",   color: "#EF4444" },
    { label: "Fair",   color: "#F59E0B" },
    { label: "Good",   color: "#10B981" },
    { label: "Strong", color: "#6366F1" },
  ];
  return { score, ...map[score] };
};

const TRUST = [
  { icon: ICONS.shield,   color: "#6366F1", bg: "#EEF2FF", text: "256-bit SSL encryption" },
  { icon: ICONS.heart,    color: "#EC4899", bg: "#FDF2F8", text: "HIPAA compliant" },
  { icon: ICONS.calendar, color: "#059669", bg: "#ECFDF5", text: "Free to join" },
];

const RegisterPage = () => {
  const { settoken } = useContext(Authcontext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPw,       setShowPw]       = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [terms,        setTerms]        = useState(false);

  const strength = getStrength(formData.password);

  const changeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    if (!terms) { setError("Please accept the Terms and Conditions."); return; }
    setLoading(true);
    try {
      const response = await axios.post(`${server}/api/user/register`, formData);
      if (response.data.success) { navigate("/login"); }
      else { setError("Registration failed. Please try again."); }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .reg-root {
          min-height: 100vh;
          background: linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%);
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 16px;
        }
        .reg-btn-primary {
          width: 100%; height: 52px; border: none; border-radius: 14px;
          background: linear-gradient(135deg,#6366F1,#8B5CF6);
          color: white; font-size: 14px; font-weight: 800;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          transition: all 0.2s; letter-spacing: 0.02em;
          font-family: 'DM Sans', sans-serif;
        }
        .reg-btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 32px rgba(99,102,241,0.42); }
        .reg-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .reg-btn-google {
          width: 100%; height: 50px; border-radius: 14px;
          border: 1.5px solid #E2E8F0; background: white;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 13.5px; font-weight: 700; color: #334155;
          cursor: pointer; transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .reg-btn-google:hover { background:#F8FAFF; border-color:#C7D2FE; box-shadow:0 4px 16px rgba(99,102,241,0.10); }
        .reg-checkbox { width:17px; height:17px; accent-color:#6366F1; cursor:pointer; flex-shrink:0; }
        .strength-bar { height:3px; border-radius:2px; transition:width 0.35s,background 0.35s; }
      `}</style>

      <div className="reg-root">

        {/* Left blob */}
        <div style={{ position: "fixed", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>

          {/* ── LOGO ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 28 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(99,102,241,0.38)" }}>
                <Icon d={ICONS.cross} size={22} color="white" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: "#0F172A" }}>
                CURA<span style={{ color: "#6366F1" }}>LINK</span>
              </span>
            </Link>
          </motion.div>

          {/* ── CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "white", borderRadius: 24, border: "1px solid #EEF2FF", boxShadow: "0 8px 48px rgba(99,102,241,0.13), 0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>

            {/* Gradient top bar */}
            <div style={{ height: 4, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA)" }} />

            <div style={{ padding: "36px 36px 32px" }}>

              {/* Heading */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                style={{ marginBottom: 28 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
                  <Icon d={ICONS.sparkle} size={11} color="#6366F1" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#6366F1", letterSpacing: "0.09em", textTransform: "uppercase" }}>Free Account</span>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: 6 }}>Create your account</h1>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.6 }}>Join CuraLink and take control of your health journey.</p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                  <Field label="Full Name" name="fullName" type="text" icon={ICONS.user}
                    value={formData.fullName} onChange={changeHandler} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                  <Field label="Email Address" name="email" type="email" icon={ICONS.mail}
                    value={formData.email} onChange={changeHandler} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                  <Field label="Password" name="password" type={showPw ? "text" : "password"} icon={ICONS.lock}
                    value={formData.password} onChange={changeHandler}
                    rightEl={
                      <button type="button" onClick={() => setShowPw(p => !p)} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                        <Icon d={showPw ? ICONS.eyeOff : ICONS.eye} size={16} color="#94A3B8" />
                      </button>
                    }
                  />
                  {/* Strength bar */}
                  {formData.password && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="strength-bar" style={{ flex: 1, background: i <= strength.score ? strength.color : "#E2E8F0" }} />
                        ))}
                      </div>
                      {strength.label && <p style={{ fontSize: 11, fontWeight: 700, color: strength.color }}>{strength.label} password</p>}
                    </div>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}>
                  <Field label="Confirm Password" name="confirmPassword" type={showConfirm ? "text" : "password"} icon={ICONS.lock}
                    value={formData.confirmPassword} onChange={changeHandler}
                    rightEl={
                      <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                        <Icon d={showConfirm ? ICONS.eyeOff : ICONS.eye} size={16} color="#94A3B8" />
                      </button>
                    }
                  />
                  {/* Match indicator */}
                  {formData.confirmPassword && (
                    <p style={{ fontSize: 11, fontWeight: 700, color: formData.password === formData.confirmPassword ? "#10B981" : "#EF4444", marginTop: 5 }}>
                      {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </motion.div>

                {/* Terms */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                  <input type="checkbox" id="terms" className="reg-checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ marginTop: 1 }} />
                  <label htmlFor="terms" style={{ fontSize: 13, color: "#475569", lineHeight: 1.55, cursor: "pointer" }}>
                    I agree to the{" "}
                    <Link to="/terms" style={{ color: "#6366F1", fontWeight: 700, textDecoration: "none" }}>Terms &amp; Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy" style={{ color: "#6366F1", fontWeight: 700, textDecoration: "none" }}>Privacy Policy</Link>
                  </label>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}
                      style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#EF4444", fontWeight: 600 }}>
                      ✗ &nbsp;{error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
                  <motion.button type="submit" className="reg-btn-primary" disabled={loading}
                    whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    {loading ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                        </path>
                      </svg>
                    ) : (
                      <>Create Account <Icon d={ICONS.arrow} size={15} color="white" /></>
                    )}
                  </motion.button>
                </motion.div>

              </form>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
              </div>

              {/* Google */}
              <motion.button type="button" className="reg-btn-google" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                onClick={() => alert("Google Sign-up (UI only)")}>
                <GoogleIcon />
                Continue with Google
              </motion.button>

            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
            {TRUST.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1px solid #EEF2FF", borderRadius: 20, padding: "5px 12px" }}>
                <Icon d={t.icon} size={12} color={t.color} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{t.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Sign in link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            style={{ textAlign: "center", fontSize: 13.5, color: "#64748B", marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#6366F1", fontWeight: 800, textDecoration: "none" }}>Sign in →</Link>
          </motion.p>

        </div>
      </div>
    </>
  );
};

export default RegisterPage;