import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

/* ─── ICON SYSTEM (same as register) ─── */
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mail: ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  eyeOff: ["M1 1l22 22"],
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
};

/* ─── FLOATING FIELD ─── */
const Field = ({ label, name, type, value, onChange, icon, rightEl }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value?.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <label style={{
        position: "absolute",
        left: 44,
        top: active ? 7 : "50%",
        transform: active ? "none" : "translateY(-50%)",
        fontSize: active ? 10 : 13.5,
        fontWeight: active ? 700 : 500,
        color: focused ? "#6366F1" : "#94A3B8",
        transition: "all 0.18s",
        pointerEvents: "none",
        zIndex: 2
      }}>
        {label}
      </label>

      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
        <Icon d={icon} size={16} color={focused ? "#6366F1" : "#94A3B8"} />
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
          height: 58,
          paddingLeft: 44,
          paddingRight: rightEl ? 44 : 14,
          borderRadius: 14,
          border: `1.5px solid ${focused ? "#6366F1" : "#E2E8F0"}`,
          background: focused ? "#FAFBFF" : "#F8FAFC",
          outline: "none",
          fontSize: 14,
        }}
      />

      {rightEl && (
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
          {rightEl}
        </div>
      )}
    </div>
  );
};

/* ─── MAIN LOGIN ─── */
const LoginPage = () => {
  const { settoken } = useContext(Authcontext);
  const navigate = useNavigate();

  const [formData, setformData] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        formData
      );

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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg,#F0F4FF,#F8F6FF,#EFF6FF)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20
    }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 24,
          padding: 30,
          boxShadow: "0 10px 40px rgba(99,102,241,0.15)"
        }}
      >

        <h2 style={{
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 10
        }}>
          Welcome Back 👋
        </h2>

        <p style={{ color: "#64748B", marginBottom: 20 }}>
          Sign in to continue to CuraLink
        </p>

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Field
            label="Email"
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
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none" }}>
                <Icon d={showPw ? ICONS.eyeOff : ICONS.eye} />
              </button>
            }
          />

          {error && (
            <div style={{ color: "red", fontSize: 13 }}>{error}</div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: 50,
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {loading ? "Signing in..." : <>Sign in <Icon d={ICONS.arrow} size={14} /></>}
          </motion.button>

        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 13 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#6366F1", fontWeight: 700 }}>
            Register
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default LoginPage;