import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chat:     ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
};

const STATS = [
  { value: "2,400+", label: "Verified Doctors",   color: "#6366F1", bg: "#EEF2FF" },
  { value: "180K+",  label: "Patients Served",    color: "#059669", bg: "#ECFDF5" },
  { value: "4.9 ★",  label: "Average Rating",     color: "#D97706", bg: "#FFFBEB" },
  { value: "120+",   label: "Cities Covered",     color: "#EC4899", bg: "#FDF2F8" },
];

const TRUST = [
  { icon: ICONS.check,    color: "#6366F1", label: "Verified Doctors"       },
  { icon: ICONS.calendar, color: "#059669", label: "Easy Appointments"      },
  { icon: ICONS.chat,     color: "#8B5CF6", label: "Digital Consultations"  },
  { icon: ICONS.shield,   color: "#D97706", label: "HIPAA Compliant"        },
];

const Header = () => {
  const { scrollYProgress } = useScroll();
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0,  60]);

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const fadeUp  = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .hero-root { font-family:'DM Sans',sans-serif; }
        .hero-btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 28px; border-radius:14px; border:none;
          background:linear-gradient(135deg,#6366F1,#8B5CF6);
          color:white; font-size:14px; font-weight:800;
          cursor:pointer; text-decoration:none;
          box-shadow:0 8px 24px rgba(99,102,241,0.38);
          transition:all 0.2s; font-family:'DM Sans',sans-serif;
          white-space:nowrap;
        }
        .hero-btn-primary:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(99,102,241,0.46); }
        .hero-btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px; border-radius:14px;
          background:rgba(255,255,255,0.7); backdrop-filter:blur(8px);
          border:1.5px solid #C7D2FE; color:#6366F1;
          font-size:14px; font-weight:800; cursor:pointer;
          text-decoration:none; transition:all 0.2s;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .hero-btn-ghost:hover { background:white; border-color:#6366F1; box-shadow:0 8px 20px rgba(99,102,241,0.14); transform:translateY(-2px); }
        .hero-stat-card {
          background:white; border-radius:16px; border:1px solid #EEF2FF;
          box-shadow:0 2px 12px rgba(0,0,0,0.06); padding:14px 18px;
          display:flex; flex-direction:column; align-items:center;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .hero-stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(99,102,241,0.12); }
      `}</style>

      <div className="hero-root" style={{ position: "relative", minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* ── Floating blobs ── */}
        <motion.div style={{ y: yBlob1, position: "absolute", top: -120, right: -80, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)", pointerEvents: "none" }} />
        <motion.div style={{ y: yBlob2, position: "absolute", bottom: -80, left: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "15%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* ── Floating card decorations ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{ position: "absolute", top: "18%", right: "6%", background: "white", borderRadius: 18, border: "1px solid #EEF2FF", boxShadow: "0 8px 28px rgba(99,102,241,0.14)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, zIndex: 2 }}
          className="hidden xl:flex">
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.activity} size={18} color="#059669" />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#0F172A" }}>Health Score</p>
            <p style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>Excellent ↑ 12%</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          style={{ position: "absolute", bottom: "22%", left: "5%", background: "white", borderRadius: 18, border: "1px solid #EEF2FF", boxShadow: "0 8px 28px rgba(99,102,241,0.12)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, zIndex: 2 }}
          className="hidden xl:flex">
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.calendar} size={18} color="#6366F1" />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#0F172A" }}>Next Appointment</p>
            <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700 }}>Tomorrow, 10:00 AM</p>
          </div>
        </motion.div>

        {/* ── Main content ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 80px", width: "100%", position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger} style={{ textAlign: "center" }}>

            {/* Top badge */}
            <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid #C7D2FE", borderRadius: 40, padding: "7px 18px 7px 10px" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.sparkle} size={13} color="white" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#6366F1", letterSpacing: "0.06em" }}>AI-POWERED HEALTHCARE PLATFORM</span>
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 6.5vw, 72px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.08, marginBottom: 22, letterSpacing: "-0.02em" }}>
              Find Your Doctor,<br />
              Get{" "}
              <span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                AI-Powered Guidance
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,18px)", color: "#64748B", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 40px" }}>
              CuraLink connects you with trusted medical professionals effortlessly. Use our smart symptom analyzer or search directly to find the care you deserve.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 56 }}>
              <Link to="/find-doctors" className="hero-btn-primary">
                <Icon d={ICONS.search} size={16} color="white" />
                Search Doctors
                <Icon d={ICONS.arrow} size={15} color="white" />
              </Link>
              <Link to="/symptom-analyzer" className="hero-btn-ghost">
                <Icon d={ICONS.ai} size={16} color="#6366F1" />
                Analyze Symptoms (AI)
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 40 }}>
              {STATS.map((s, i) => (
                <div key={i} className="hero-stat-card">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginTop: 2 }}>{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {TRUST.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1px solid #EEF2FF", borderRadius: 20, padding: "6px 14px" }}>
                  <Icon d={t.icon} size={13} color={t.color} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{t.label}</span>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Header;