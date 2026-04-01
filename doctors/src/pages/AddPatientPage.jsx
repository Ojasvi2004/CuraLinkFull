import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69l3-.15a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.96-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  notes:    ["M9 12h6", "M9 16h6", "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M9 7h6"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  arrowL:   "M19 12H5m7-7-7 7 7 7",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  plus:     ["M12 5v14", "M5 12h14"],
  info:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4m0 4h.01"],
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "12px 16px",
  border: "1.5px solid #EEF2FF", borderRadius: 14, fontSize: 13,
  fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
  background: "#F8FAFF", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
};

const InputField = ({ label, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </label>
    {children}
    {hint && <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{hint}</p>}
  </div>
);

const SectionHeader = ({ icon, title, subtitle, color = "#6366F1", bg = "#EEF2FF" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #F1F5F9" }}>
    <div style={{ width: 44, height: 44, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon d={icon} size={20} color={color} />
    </div>
    <div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{subtitle}</p>}
    </div>
  </div>
);

const FormCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 240, damping: 22 }}
    style={{
      background: "white", borderRadius: 24, border: "1px solid #EEF2FF",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: "32px",
      marginBottom: 20,
    }}
  >
    {children}
  </motion.div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorAddPatientPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    patientFullName: "", patientGender: "", patientDob: "",
    patientEmail: "", patientPhone: "",
    primaryConcern: "", allergies: "", chronicConditions: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#6366F1";
    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "#EEF2FF";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/doctors/add-patient",
        { formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSubmitted(true);
        setTimeout(() => navigate('/doctor/patients'), 1600);
      }
    } catch (error) {
      console.log(error);
      navigate('/doctor/patients');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #CBD5E1; font-size: 13px; }
        select { appearance: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{
              background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
              borderRadius: 24, padding: "36px 40px", marginBottom: 32,
              position: "relative", overflow: "hidden",
              boxShadow: "0 16px 48px rgba(30,58,95,0.4)",
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, right: 140, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon d={ICONS.sparkle} size={15} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>Patient Management</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Add New Patient<span style={{ color: "rgba(255,255,255,0.45)" }}>.</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 5, fontWeight: 500, maxWidth: 480 }}>
                  Create a patient profile in your practice. An invitation to join CuraLink will be sent to their email address.
                </p>
              </div>

              <Link to="/doctor/patients" style={{ textDecoration: "none", flexShrink: 0 }}>
                <motion.div
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{
                    background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14,
                    padding: "11px 18px", display: "flex", alignItems: "center", gap: 7,
                    color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer",
                  }}
                >
                  <Icon d={ICONS.arrowL} size={14} color="white" />
                  Back to Patients
                </motion.div>
              </Link>
            </div>

            {/* Steps indicator */}
            <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
              {["Basic Info", "Contact", "Clinical Notes"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: "white",
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{step}</span>
                  {i < 2 && <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.2)" }} />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── SUCCESS STATE ────────────────────────────────────────────────── */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", borderRadius: 20,
                border: "1px solid #6EE7B7", padding: "24px 28px", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 14,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d={ICONS.check} size={20} color="white" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#065F46", fontSize: 15 }}>Patient profile created!</p>
                <p style={{ fontSize: 12, color: "#059669", marginTop: 2 }}>Redirecting to your patient roster…</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── SECTION 1: BASIC INFO ─────────────────────────────────────── */}
            <FormCard delay={0.18}>
              <SectionHeader
                icon={ICONS.user} title="Basic Information"
                subtitle="Legal name, gender and date of birth"
                color="#6366F1" bg="#EEF2FF"
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                <InputField label="Full Name" >
                  <input
                    type="text" name="patientFullName" required
                    placeholder="Firstname Lastname"
                    value={formData.patientFullName} onChange={handleChange}
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                  />
                </InputField>
                <InputField label="Gender">
                  <div style={{ position: "relative" }}>
                    <select
                      name="patientGender" required
                      value={formData.patientGender} onChange={handleChange}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={handleFocus} onBlur={handleBlur}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <Icon d="m6 9 6 6 6-6" size={14} color="#6366F1" />
                    </div>
                  </div>
                </InputField>
                <InputField label="Date of Birth">
                  <input
                    type="date" name="patientDob" required
                    value={formData.patientDob} onChange={handleChange}
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                  />
                </InputField>
              </div>
            </FormCard>

            {/* ── SECTION 2: CONTACT ───────────────────────────────────────── */}
            <FormCard delay={0.24}>
              <SectionHeader
                icon={ICONS.mail} title="Contact Details"
                subtitle="Email invitation and phone for reminders"
                color="#0284C7" bg="#E0F2FE"
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                <InputField label="Email Address" hint="An invitation to create their account will be sent here.">
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                      <Icon d={ICONS.mail} size={14} color="#94A3B8" />
                    </div>
                    <input
                      type="email" name="patientEmail" required
                      placeholder="patient@example.com"
                      value={formData.patientEmail} onChange={handleChange}
                      style={{ ...inputStyle, paddingLeft: 40 }}
                      onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </div>
                </InputField>
                <InputField label="Phone Number" hint="Used for appointment reminders.">
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                      <Icon d={ICONS.phone} size={14} color="#94A3B8" />
                    </div>
                    <input
                      type="tel" name="patientPhone" required
                      placeholder="+91 98765 43210"
                      value={formData.patientPhone} onChange={handleChange}
                      style={{ ...inputStyle, paddingLeft: 40 }}
                      onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </div>
                </InputField>
              </div>
            </FormCard>

            {/* ── SECTION 3: CLINICAL NOTES ────────────────────────────────── */}
            <FormCard delay={0.30}>
              <SectionHeader
                icon={ICONS.notes} title="Initial Clinical Notes"
                subtitle="Optional — can be updated anytime from the patient record"
                color="#D97706" bg="#FFFBEB"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <InputField label="Primary Concern / Reason for Visit">
                  <input
                    type="text" name="primaryConcern"
                    placeholder="e.g. Hypertension, Routine Checkup, Knee Pain"
                    value={formData.primaryConcern} onChange={handleChange}
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                  />
                </InputField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <InputField label="Known Allergies" hint="Comma-separated">
                    <input
                      type="text" name="allergies"
                      placeholder="e.g. Penicillin, Peanuts"
                      value={formData.allergies} onChange={handleChange}
                      style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </InputField>
                  <InputField label="Chronic Conditions" hint="Comma-separated">
                    <input
                      type="text" name="chronicConditions"
                      placeholder="e.g. Diabetes, Asthma"
                      value={formData.chronicConditions} onChange={handleChange}
                      style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </InputField>
                </div>
              </div>
            </FormCard>

            {/* ── INFO CARD ────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
              style={{
                background: "linear-gradient(145deg,#1E3A5F 0%,#2D4E8A 100%)",
                borderRadius: 20, padding: "22px 28px", marginBottom: 24,
                display: "flex", alignItems: "flex-start", gap: 14,
                boxShadow: "0 6px 24px rgba(30,58,95,0.25)",
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <Icon d={ICONS.info} size={18} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>Account Invitation</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                  Once you create this profile, the patient will receive a secure email invitation to set up their CuraLink account and access their records, prescriptions, and appointment history.
                </p>
              </div>
            </motion.div>

            {/* ── ACTION BUTTONS ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ display: "flex", gap: 14, justifyContent: "flex-end", flexWrap: "wrap" }}
            >
              <Link to="/doctor/patients" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{
                    background: "white", border: "1.5px solid #E2E8F0", borderRadius: 14,
                    padding: "13px 28px", fontWeight: 600, fontSize: 14, color: "#475569",
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  Cancel
                </motion.div>
              </Link>

              <motion.button
                type="submit"
                whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                  color: "white", border: "none", borderRadius: 14,
                  padding: "13px 36px", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Icon d={ICONS.plus} size={15} color="white" />
                Create Patient Profile
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorAddPatientPage;