import React from "react";
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
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  steth:    ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
  chart:    ["M18 20V10", "M12 20V4", "M6 20v-6"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  video:    ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 0 0-5V5z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
};

// ─── STEPS DATA ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01", icon: ICONS.check, title: "Register & Verify Your Profile",
    color: "#6366F1", bg: "#EEF2FF", gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)", glow: "rgba(99,102,241,0.25)",
    desc: "Sign up in minutes and complete your professional profile. Our dedicated verification team reviews your credentials and medical registration within 24 hours — ensuring only qualified doctors join our network.",
    bullets: ["Quick 5-minute signup form", "Secure credential submission", "Verified badge on your profile", "24-hour review turnaround"],
    visual: {
      title: "Profile Verification",
      lines: [
        { label: "MBBS, MD — Cardiology", icon: ICONS.user, done: true },
        { label: "Medical Registration Verified", icon: ICONS.shield, done: true },
        { label: "Hospital Affiliation Confirmed", icon: ICONS.check, done: true },
        { label: "Profile Live on CuraLink", icon: ICONS.sparkle, done: false, pulse: true },
      ]
    }
  },
  {
    num: "02", icon: ICONS.user, title: "Set Up Your Clinic & Services",
    color: "#059669", bg: "#ECFDF5", gradient: "linear-gradient(135deg,#10B981,#34D399)", glow: "rgba(16,185,129,0.25)",
    desc: "Add details about your clinic locations, services offered, consultation fees, and upload a professional headshot. Build a profile that patients trust and that showcases the full breadth of your expertise.",
    bullets: ["Multiple clinic locations", "Physical & digital consultation types", "Custom consultation fees", "Patient-facing bio and photo"],
    visual: {
      title: "Clinic Setup",
      lines: [
        { label: "Apollo Clinic, Delhi · ₹800", icon: ICONS.steth, done: true },
        { label: "Fortis Hospital · ₹1,200", icon: ICONS.steth, done: true },
        { label: "Video Consult · ₹600", icon: ICONS.video, done: true },
        { label: "Services live & bookable", icon: ICONS.check, done: false, pulse: true },
      ]
    }
  },
  {
    num: "03", icon: ICONS.calendar, title: "Define Your Availability",
    color: "#D97706", bg: "#FFFBEB", gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)", glow: "rgba(245,158,11,0.25)",
    desc: "Use our intuitive calendar to set your available slots for in-person and teleconsultation sessions. Block personal time, set recurring schedules, and update your calendar on the fly from any device.",
    bullets: ["Recurring weekly schedules", "Physical and digital slot types", "Holiday & break blocking", "Real-time availability sync"],
    visual: {
      title: "Weekly Schedule",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      slots: [
        { day: "Mon", time: "9 AM–1 PM", color: "#6366F1", bg: "#EEF2FF" },
        { day: "Tue", time: "10 AM–3 PM", color: "#059669", bg: "#ECFDF5" },
        { day: "Thu", time: "9 AM–12 PM", color: "#D97706", bg: "#FFFBEB" },
        { day: "Fri", time: "2 PM–6 PM", color: "#6366F1", bg: "#EEF2FF" },
      ]
    }
  },
  {
    num: "04", icon: ICONS.steth, title: "Start Consulting & Managing Patients",
    color: "#0284C7", bg: "#E0F2FE", gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)", glow: "rgba(14,165,233,0.25)",
    desc: "Receive appointment bookings, manage your live patient queue for same-day visits, conduct secure teleconsultations, and issue digital prescriptions — all from one beautiful dashboard.",
    bullets: ["Live patient queue management", "Secure HD video consultations", "Digital prescription issuing", "Patient record access"],
    visual: {
      title: "Today's Dashboard",
      stats: [
        { label: "Appointments", value: "15", color: "#6366F1" },
        { label: "Waiting", value: "7", color: "#D97706" },
        { label: "Teleconsults", value: "6", color: "#059669" },
        { label: "Avg Wait", value: "15m", color: "#0284C7" },
      ]
    }
  },
  {
    num: "05", icon: ICONS.chart, title: "Grow Your Practice",
    color: "#7C3AED", bg: "#F5F3FF", gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)", glow: "rgba(139,92,246,0.25)",
    desc: "Leverage CuraLink's analytics to understand your practice performance, track no-show rates, monitor revenue trends, and identify growth opportunities. Focus on care — we handle the rest.",
    bullets: ["Revenue & volume analytics", "No-show rate tracking", "Patient satisfaction scores", "Practice growth insights"],
    visual: {
      title: "Practice Analytics",
      bars: [
        { label: "Jan", height: 40 }, { label: "Feb", height: 55 }, { label: "Mar", height: 48 },
        { label: "Apr", height: 70 }, { label: "May", height: 62 }, { label: "Jun", height: 85 },
      ]
    }
  },
];

// ─── VISUAL RENDERER ─────────────────────────────────────────────────────────
const StepVisual = ({ step }) => {
  const { visual, gradient, color, bg } = step;

  // Analytics bars
  if (visual.bars) {
    return (
      <div style={{
        background: "white", borderRadius: 24, padding: "24px",
        border: "1px solid #EEF2FF", boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>{visual.title}</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {visual.bars.map((b, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }} whileInView={{ height: `${b.height}%` }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              style={{ flex: 1, background: gradient, borderRadius: "6px 6px 0 0", minHeight: 8 }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {visual.bars.map((b, i) => (
            <p key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{b.label}</p>
          ))}
        </div>
      </div>
    );
  }

  // Dashboard stats
  if (visual.stats) {
    return (
      <div style={{
        background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
        borderRadius: 24, padding: "24px",
        boxShadow: "0 8px 32px rgba(30,58,95,0.4)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16 }}>{visual.title}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {visual.stats.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Schedule
  if (visual.slots) {
    return (
      <div style={{
        background: "white", borderRadius: 24, padding: "24px",
        border: "1px solid #EEF2FF", boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>{visual.title}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visual.slots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 12, background: s.bg, border: `1px solid ${s.bg}`,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, minWidth: 30 }}>{s.day}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${s.color}33` }}>
                <div style={{ height: "100%", width: "70%", borderRadius: 3, background: s.color }} />
              </div>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Checklist lines (steps 1 & 2)
  return (
    <div style={{
      background: "white", borderRadius: 24, padding: "24px",
      border: "1px solid #EEF2FF", boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>{visual.title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visual.lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              borderRadius: 14, background: line.done ? bg : "#F8FAFF",
              border: `1px solid ${line.done ? bg : "#F1F5F9"}`,
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 8, background: line.done ? gradient : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={line.icon} size={13} color={line.done ? "white" : "#94A3B8"} />
            </div>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: line.done ? "#1E293B" : "#94A3B8" }}>{line.label}</span>
            {line.pulse ? (
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 0 3px ${bg}` }} />
            ) : line.done ? (
              <Icon d={ICONS.check} size={14} color={color} />
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorHowItWorksPage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          style={{
            background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
            padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 40px rgba(30,58,95,0.3)",
          }}
        >
          <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 18px", marginBottom: 24 }}>
              <Icon d={ICONS.sparkle} size={13} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.1em" }}>How CuraLink Works</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
              Five steps to a<br />transformed practice.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: 540, margin: "0 auto 36px" }}>
              Joining CuraLink is simple. Follow these steps to enhance your practice, connect with patients, and leverage our powerful digital tools.
            </p>

            {/* Step nav pills */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12, padding: "7px 16px", fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.75)", cursor: "pointer",
                }}>
                  {s.num} — {s.title.split(" ").slice(0, 2).join(" ")}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── STEPS ─────────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 48,
                    alignItems: "center",
                  }}
                >
                  {/* Text side */}
                  <div style={{ order: isEven ? 0 : 1 }}>
                    {/* Step number */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 16, background: step.gradient,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 6px 20px ${step.glow}`,
                      }}>
                        <Icon d={step.icon} size={22} color="white" />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: step.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Step {step.num}</p>
                        <div style={{ width: 40, height: 3, background: step.gradient, borderRadius: 2, marginTop: 4 }} />
                      </div>
                    </div>

                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: 16 }}>
                      {step.title}
                    </h2>
                    <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>{step.desc}</p>

                    {/* Bullets */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {step.bullets.map((b, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.08 }}
                          style={{ display: "flex", alignItems: "center", gap: 10 }}
                        >
                          <div style={{
                            width: 22, height: 22, borderRadius: 7, background: step.bg,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <Icon d={ICONS.check} size={11} color={step.color} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{b}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Visual side */}
                  <motion.div
                    style={{ order: isEven ? 1 : 0 }}
                    whileHover={{ y: -6, boxShadow: `0 28px 60px ${step.glow}` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <StepVisual step={step} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section style={{ padding: "0 24px 80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              maxWidth: 1100, margin: "0 auto",
              background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
              borderRadius: 28, padding: "56px 48px", textAlign: "center",
              position: "relative", overflow: "hidden",
              boxShadow: "0 16px 56px rgba(30,58,95,0.4)",
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Icon d={ICONS.steth} size={26} color="white" />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
                Ready to Transform<br />Your Practice?
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
                Join thousands of forward-thinking doctors on CuraLink. Setup takes less than an hour.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/doctor/register" style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "white", color: "#1E3A5F",
                      borderRadius: 16, padding: "15px 36px", fontWeight: 800, fontSize: 15,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    Register Now <Icon d={ICONS.arrow} size={15} color="#1E3A5F" />
                  </motion.div>
                </Link>
                <Link to="/doctor/features" style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ y: -2, background: "rgba(255,255,255,0.15)" }}
                    style={{
                      background: "rgba(255,255,255,0.1)", color: "white",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      borderRadius: 16, padding: "15px 28px", fontWeight: 700, fontSize: 15,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    Explore Features
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <footer style={{ background: "#0F172A", padding: "28px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
            © 2025 CuraLink for Doctors · Empowering healthcare professionals across India
          </p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="order: 1"] { order: 0 !important; }
        }
      `}</style>
    </>
  );
};

export default DoctorHowItWorksPage;