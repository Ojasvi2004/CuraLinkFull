import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// ─── ICON SYSTEM ─────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  queue:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  video:    ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 0 0-5V5z"],
  notes:    ["M9 12h6", "M9 16h6", "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M9 7h6"],
  chart:    ["M18 20V10", "M12 20V4", "M6 20v-6"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  steth:    ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  pulse:    "M22 12h-4l-3 9L9 3l-3 9H2",
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  quote:    "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
};

// ─── FEATURES DATA ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: ICONS.calendar, title: "Smart Scheduling", description: "Effortlessly set and update consultation slots for in-person and digital appointments with intelligent conflict detection.", gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)", glow: "rgba(99,102,241,0.22)", bg: "#EEF2FF", color: "#6366F1", tag: "Schedule" },
  { icon: ICONS.queue, title: "Live Patient Queue", description: "Real-time queue management that reduces wait times and keeps your clinic flowing smoothly through any busy day.", gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)", glow: "rgba(14,165,233,0.22)", bg: "#E0F2FE", color: "#0284C7", tag: "Live" },
  { icon: ICONS.video, title: "Secure Telemedicine", description: "High-quality encrypted video consultations built directly into your workflow — no third-party apps needed.", gradient: "linear-gradient(135deg,#10B981,#34D399)", glow: "rgba(16,185,129,0.22)", bg: "#ECFDF5", color: "#059669", tag: "Digital" },
  { icon: ICONS.notes, title: "Patient History", description: "Instant access to patient-shared medical records, past prescriptions, and consultation notes at a glance.", gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)", glow: "rgba(245,158,11,0.22)", bg: "#FFFBEB", color: "#D97706", tag: "Records" },
  { icon: ICONS.user, title: "Digital Presence", description: "Build a professional profile that showcases your expertise and helps patients find and trust you instantly.", gradient: "linear-gradient(135deg,#EC4899,#F472B6)", glow: "rgba(236,72,153,0.22)", bg: "#FDF2F8", color: "#DB2777", tag: "Profile" },
  { icon: ICONS.chart, title: "Practice Analytics", description: "Deep insights on revenue, patient volume, no-show rates, and growth trends — all in one unified view.", gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)", glow: "rgba(139,92,246,0.22)", bg: "#F5F3FF", color: "#7C3AED", tag: "Insights" },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Dr. Riya Chauhan", role: "General Medicine · Apollo Delhi", quote: "CuraLink transformed how I connect with patients. The telemedicine feature cut my no-show rate by 40% in the first month alone.", avatar: "RC", gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)" },
  { name: "Dr. Arjun Mehta", role: "Cardiologist · Fortis Mumbai", quote: "The live queue system is a game-changer. My clinic now runs like clockwork. Patients actually arrive prepared and on time.", avatar: "AM", gradient: "linear-gradient(135deg,#10B981,#34D399)" },
  { name: "Dr. Sneha Rao", role: "Paediatrician · Manipal Bangalore", quote: "Setting up was incredibly fast. Within an hour I had my full schedule live and was receiving bookings. Outstanding platform.", avatar: "SR", gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)" },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "12,000+", label: "Verified Doctors", icon: ICONS.user },
  { value: "2.4M+", label: "Consultations Done", icon: ICONS.steth },
  { value: "98.2%", label: "Uptime Guarantee", icon: ICONS.shield },
  { value: "4.9★", label: "Average Rating", icon: ICONS.sparkle },
];

// ─── HOW IT WORKS STEPS ───────────────────────────────────────────────────────
const STEPS = [
  { num: "01", title: "Register & Verify", desc: "Sign up in minutes, submit credentials, and our team verifies your profile within 24 hours.", icon: ICONS.check, color: "#6366F1", bg: "#EEF2FF" },
  { num: "02", title: "Set Up Your Clinic", desc: "Add services, fees, clinic locations, and upload a professional photo to attract patients.", icon: ICONS.user, color: "#059669", bg: "#ECFDF5" },
  { num: "03", title: "Define Availability", desc: "Use the intuitive calendar to set physical and teleconsultation hours that fit your lifestyle.", icon: ICONS.calendar, color: "#D97706", bg: "#FFFBEB" },
  { num: "04", title: "Start Consulting", desc: "Receive bookings, manage your queue, and consult patients — all from one beautiful dashboard.", icon: ICONS.steth, color: "#0284C7", bg: "#E0F2FE" },
];

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────
const FeatureCard = ({ feat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: 0.07 * index, type: "spring", stiffness: 240, damping: 22 }}
    whileHover={{ y: -8, boxShadow: `0 24px 56px ${feat.glow}` }}
    style={{
      background: "white", borderRadius: 24, border: "1px solid #EEF2FF",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden", cursor: "default",
    }}
  >
    <div style={{ height: 4, background: feat.gradient }} />
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: feat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={feat.icon} size={24} color={feat.color} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: feat.color, background: feat.bg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase" }}>{feat.tag}</span>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{feat.title}</h3>
      <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{feat.description}</p>
    </div>
  </motion.div>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const DoctorLandingPage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#0F172A", overflowX: "hidden" }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>

          {/* Ambient blobs */}
          <div style={{ position: "absolute", top: -120, right: -120, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "30%", left: "55%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1, width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.1em" }}>For Medical Professionals</span>
                  </div>

                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 58, fontWeight: 900, lineHeight: 1.08, color: "#0F172A", marginBottom: 24 }}>
                    Elevate Your<br />
                    Practice with<br />
                    <span style={{ color: "#6366F1" }}>CuraLink.</span>
                  </h1>

                  <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
                    Join 12,000+ doctors who streamlined their appointments, expanded with telemedicine, and focused on what matters most — their patients.
                  </p>

                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <Link to="/doctor/register" style={{ textDecoration: "none" }}>
                      <motion.div
                        whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(30,58,95,0.45)" }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          background: "linear-gradient(135deg,#1E3A5F,#3B5CB8)", color: "white",
                          borderRadius: 16, padding: "15px 32px", fontWeight: 700, fontSize: 15,
                          boxShadow: "0 6px 24px rgba(30,58,95,0.35)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                        }}
                      >
                        Register Your Clinic <Icon d={ICONS.arrow} size={15} color="white" />
                      </motion.div>
                    </Link>
                    <Link to="/doctor/login" style={{ textDecoration: "none" }}>
                      <motion.div
                        whileHover={{ y: -2, background: "#EEF2FF" }}
                        style={{
                          background: "white", color: "#6366F1", border: "1.5px solid #EEF2FF",
                          borderRadius: 16, padding: "15px 28px", fontWeight: 700, fontSize: 15,
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.2s",
                        }}
                      >
                        Doctor Login
                      </motion.div>
                    </Link>
                  </div>

                  {/* Trust indicators */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
                    <div style={{ display: "flex" }}>
                      {["RC","AM","SR","VK"].map((initials, i) => (
                        <div key={i} style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: ["linear-gradient(135deg,#6366F1,#8B5CF6)","linear-gradient(135deg,#10B981,#34D399)","linear-gradient(135deg,#F59E0B,#FBBF24)","linear-gradient(135deg,#EC4899,#F472B6)"][i],
                          border: "2px solid white", marginLeft: i > 0 ? -10 : 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 800, color: "white",
                        }}>
                          {initials}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B" }}>
                      <span style={{ fontWeight: 700, color: "#0F172A" }}>12,000+</span> verified doctors already on CuraLink
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right — Dashboard preview card */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ position: "relative" }}
              >
                {/* Main card */}
                <div style={{
                  background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
                  borderRadius: 28, padding: "32px", boxShadow: "0 24px 64px rgba(30,58,95,0.45)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Good morning, Doctor</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "white", fontWeight: 800, marginBottom: 20 }}>Dr. Ananya Sharma.</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "Today's Appointments", value: "15", color: "#A78BFA" },
                      { label: "Patients Waiting", value: "7", color: "#34D399" },
                      { label: "Digital Consults", value: "6", color: "#38BDF8" },
                      { label: "Avg. Wait Time", value: "15m", color: "#FBBF24" },
                    ].map((s, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4, fontWeight: 600 }}>{s.label}</p>
                        <p style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Live Queue · Currently serving A005</span>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", top: -20, right: -20,
                    background: "white", borderRadius: 16, padding: "12px 18px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #EEF2FF",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.check} size={16} color="#059669" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>Verified Doctor</p>
                    <p style={{ fontSize: 10, color: "#94A3B8" }}>AIIMS Delhi</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  style={{
                    position: "absolute", bottom: -16, left: -20,
                    background: "white", borderRadius: 16, padding: "12px 18px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #EEF2FF",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.video} size={16} color="#6366F1" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>Next: Teleconsult</p>
                    <p style={{ fontSize: 10, color: "#94A3B8" }}>in 12 minutes</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)", padding: "40px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={s.icon} size={18} color="rgba(255,255,255,0.8)" />
                  </div>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, color: "white" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 4 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", padding: "100px 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              style={{ textAlign: "center", marginBottom: 64 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.sparkle} size={17} color="#6366F1" />
                </div>
                <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Platform Advantages</p>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: "#0F172A", lineHeight: 1.15, marginBottom: 16 }}>
                Tools Designed for<br />Modern Medical Practice.
              </h2>
              <p style={{ fontSize: 16, color: "#64748B", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
                A comprehensive suite of features to help you manage your practice efficiently and connect with patients effectively.
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
              {FEATURES.map((f, i) => <FeatureCard key={i} feat={f} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section style={{ background: "white", padding: "100px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 64 }}
            >
              <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>How It Works</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: "#0F172A", lineHeight: 1.15 }}>
                Up and running<br />in four steps.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{
                    background: "#F8FAFF", borderRadius: 24, padding: "28px 24px",
                    border: "1px solid #EEF2FF", position: "relative", overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", top: 16, right: 16, fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: "rgba(99,102,241,0.06)", lineHeight: 1 }}>
                    {step.num}
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon d={step.icon} size={22} color={step.color} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)",
                      zIndex: 2, display: "flex", alignItems: "center",
                    }}>
                      <Icon d={ICONS.arrow} size={16} color="#CBD5E1" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", padding: "100px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 56 }}
            >
              <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>What Doctors Say</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: "#0F172A" }}>Trusted by 12,000+ doctors.</h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(99,102,241,0.15)" }}
                  style={{
                    background: "white", borderRadius: 24, padding: "28px",
                    border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <Icon d={ICONS.quote} size={24} color="#EEF2FF" />
                  </div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>"{t.quote}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", background: t.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 800, color: "white",
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon d={ICONS.steth} size={24} color="white" />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
              Ready to Transform<br />Your Practice?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: 36 }}>
              Join the growing network of forward-thinking doctors on CuraLink. Setup takes less than an hour.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/doctor/register" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "white", color: "#1E3A5F",
                    borderRadius: 16, padding: "15px 36px", fontWeight: 800, fontSize: 15,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.2)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  Register Now <Icon d={ICONS.arrow} size={15} color="#1E3A5F" />
                </motion.div>
              </Link>
              <Link to="/doctor/how-it-works" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ y: -2, background: "rgba(255,255,255,0.15)" }}
                  style={{
                    background: "rgba(255,255,255,0.1)", color: "white",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    borderRadius: 16, padding: "15px 28px", fontWeight: 700, fontSize: 15,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  See How It Works
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer style={{ background: "#0F172A", padding: "32px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
            © 2025 CuraLink for Doctors · Empowering healthcare professionals across India
          </p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2,1fr) !important; }
          section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          h1 { font-size: 38px !important; }
          h2 { font-size: 30px !important; }
        }
      `}</style>
    </>
  );
};

export default DoctorLandingPage;