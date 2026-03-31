import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  location: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  faq:      ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  subject:  ["M4 6h16M4 12h16M4 18h8"],
  msg:      ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
};

const CONTACT_CARDS = [
  {
    icon: ICONS.mail,     color: "#6366F1", bg: "#EEF2FF", gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)",
    title: "Email Us",    sub: "General inquiries, support or feedback.",
    value: "support@curalink.com", href: "mailto:support@curalink.com",
    detail: "We reply within 24 hours",
  },
  {
    icon: ICONS.phone,    color: "#059669", bg: "#ECFDF5", gradient: "linear-gradient(135deg,#10B981,#34D399)",
    title: "Call Us",     sub: "Speak with our support team directly.",
    value: "(123) 456-7890", href: "tel:+1234567890",
    detail: "Mon – Fri, 9 AM – 6 PM",
  },
  {
    icon: ICONS.location, color: "#8B5CF6", bg: "#F5F3FF", gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)",
    title: "Our Office",  sub: "Visit us at our main headquarters.",
    value: "123 Health St, Wellness City", href: "#map",
    detail: "Get directions →",
  },
  {
    icon: ICONS.faq,      color: "#D97706", bg: "#FFFBEB", gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)",
    title: "FAQ",         sub: "Quick answers to common questions.",
    value: "Visit FAQ Page", href: "/faq",
    detail: "50+ articles available",
  },
];

// ─── FLOATING INPUT ───────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", placeholder, icon, textarea = false, rows = 5 }) => {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const active = focused || val.length > 0;

  const base = {
    width: "100%", background: focused ? "#FAFBFF" : "#F8FAFC",
    border: `1.5px solid ${focused ? "#6366F1" : "#E2E8F0"}`,
    borderRadius: 14, outline: "none",
    fontSize: 14, fontWeight: 500, color: "#0F172A",
    transition: "all 0.18s",
    boxShadow: focused ? "0 0 0 4px rgba(99,102,241,0.08)" : "none",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{ position: "relative" }}>
      <label style={{
        position: "absolute", left: 44, top: active ? 8 : textarea ? 18 : "50%",
        transform: active ? "none" : textarea ? "none" : "translateY(-50%)",
        fontSize: active ? 10 : 13.5, fontWeight: active ? 800 : 500,
        color: focused ? "#6366F1" : "#94A3B8",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "none", letterSpacing: active ? "0.06em" : 0,
        textTransform: active ? "uppercase" : "none", zIndex: 2,
      }}>
        {label}
      </label>
      <div style={{ position: "absolute", left: 14, top: textarea ? 18 : "50%", transform: textarea ? "none" : "translateY(-50%)", zIndex: 2 }}>
        <Icon d={icon} size={16} color={focused ? "#6366F1" : "#94A3B8"} />
      </div>
      {textarea
        ? <textarea name={name} rows={rows} required value={val} onChange={e => setVal(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...base, padding: "28px 14px 14px 44px", resize: "vertical", minHeight: 130 }} />
        : <input name={name} type={type} required value={val} onChange={e => setVal(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ ...base, height: 58, paddingTop: active ? 22 : 0, paddingBottom: active ? 6 : 0, paddingLeft: 44, paddingRight: 14 }} />
      }
    </div>
  );
};

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────
const fadeUp  = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .ct-root { font-family:'DM Sans',sans-serif; background:linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%); }
        .ct-card {
          background:white; border-radius:20px; border:1px solid #EEF2FF;
          box-shadow:0 2px 12px rgba(0,0,0,0.055); overflow:hidden;
          transition:transform 0.25s, box-shadow 0.25s;
        }
        .ct-card:hover { transform:translateY(-5px); box-shadow:0 14px 40px rgba(99,102,241,0.13); }
        .ct-submit {
          width:100%; height:52px; border:none; border-radius:14px;
          background:linear-gradient(135deg,#6366F1,#8B5CF6);
          color:white; font-size:14px; font-weight:800; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 8px 24px rgba(99,102,241,0.35);
          transition:all 0.2s; font-family:'DM Sans',sans-serif;
        }
        .ct-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 32px rgba(99,102,241,0.42); }
        .ct-submit:disabled { opacity:.65; cursor:not-allowed; }
        .ct-map-placeholder {
          width:100%; height:340px; border-radius:22px;
          background:linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 100%);
          border:1px solid #C7D2FE;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
        }
      `}</style>

      <div className="ct-root">

        {/* ──────────────── HERO ──────────────── */}
        <section style={{ position: "relative", minHeight: "52vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "120px 24px 80px" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.11) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 22 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid #C7D2FE", borderRadius: 40, padding: "6px 16px 6px 10px" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.sparkle} size={13} color="white" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#6366F1", letterSpacing: "0.07em" }}>WE'D LOVE TO HEAR FROM YOU</span>
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.65, type: "spring", stiffness: 100 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,6vw,64px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.02em" }}>
              Get In{" "}
              <span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "#64748B", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
              We're here to help with any question you might have. Our team typically responds within 24 hours.
            </motion.p>
          </div>
        </section>

        {/* ──────────────── CONTACT CARDS ──────────────── */}
        <section style={{ padding: "0 24px 72px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
              {CONTACT_CARDS.map((c, i) => (
                <motion.div key={i} variants={fadeUp} className="ct-card">
                  <div style={{ height: 4, background: c.gradient }} />
                  <div style={{ padding: "22px 22px 20px" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <Icon d={c.icon} size={22} color={c.color} />
                    </div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 5 }}>{c.title}</h4>
                    <p style={{ fontSize: 12.5, color: "#94A3B8", marginBottom: 10, lineHeight: 1.55 }}>{c.sub}</p>
                    <a href={c.href} style={{ fontSize: 13.5, fontWeight: 700, color: c.color, textDecoration: "none", display: "block", marginBottom: 6, transition: "opacity 0.18s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      {c.value}
                    </a>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon d={ICONS.clock} size={11} color="#94A3B8" />
                      <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{c.detail}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ──────────────── FORM + INFO ──────────────── */}
        <section style={{ padding: "0 24px 96px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 32, alignItems: "start" }}>

            {/* ── FORM CARD ── */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={scaleIn}
              style={{ background: "white", borderRadius: 24, border: "1px solid #EEF2FF", boxShadow: "0 8px 40px rgba(99,102,241,0.10)", overflow: "hidden" }}>
              <div style={{ height: 4, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA)" }} />
              <div style={{ padding: "36px 34px 32px" }}>

                <div style={{ marginBottom: 28 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: "#6366F1", background: "#EEF2FF", padding: "4px 12px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                    <Icon d={ICONS.sparkle} size={10} color="#6366F1" />
                    Direct Message
                  </span>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>Send Us a Message</h2>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="success"
                      initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}
                      style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
                        <Icon d={ICONS.check} size={28} color="white" />
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Message Sent!</h3>
                      <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>Thanks for reaching out. Our team will get back to you within 24 hours.</p>
                      <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, padding: "9px 22px", borderRadius: 11, border: "1.5px solid #C7D2FE", background: "transparent", color: "#6366F1", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Full Name"      name="name"    icon={ICONS.user}    />
                        <Field label="Email Address"  name="email"   icon={ICONS.mail}    type="email" />
                      </div>
                      <Field label="Subject"          name="subject" icon={ICONS.subject} />
                      <Field label="Your Message"     name="message" icon={ICONS.msg}     textarea rows={5} />

                      <motion.button type="submit" className="ct-submit" disabled={loading}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                        {loading ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        ) : (
                          <>Send Message <Icon d={ICONS.arrow} size={15} color="white" /></>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── INFO SIDE ── */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: "#8B5CF6", background: "#F5F3FF", padding: "4px 12px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  <Icon d={ICONS.sparkle} size={10} color="#8B5CF6" />
                  Support Channels
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>Other Ways to Reach Us</h2>
              </motion.div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CONTACT_CARDS.map((c, i) => (
                  <motion.div key={i} variants={fadeUp}
                    style={{ background: "white", borderRadius: 18, border: "1px solid #EEF2FF", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", transition: "all 0.22s", cursor: "default" }}
                    whileHover={{ y: -3, boxShadow: `0 10px 30px ${c.color}18` }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon d={c.icon} size={19} color={c.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 3 }}>{c.title}</h4>
                      <p style={{ fontSize: 12.5, color: "#94A3B8", marginBottom: 5, lineHeight: 1.5 }}>{c.sub}</p>
                      <a href={c.href} style={{ fontSize: 13, fontWeight: 700, color: c.color, textDecoration: "none" }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                        {c.value}
                      </a>
                      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon d={ICONS.clock} size={10} color="#94A3B8" />
                        {c.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office hours mini card */}
              <motion.div variants={fadeUp} style={{ marginTop: 14, background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)", borderRadius: 18, padding: "22px 22px", boxShadow: "0 8px 28px rgba(99,102,241,0.30)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.clock} size={16} color="white" />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "0.04em" }}>Support Hours</p>
                </div>
                {[["Monday – Friday", "9:00 AM – 6:00 PM"], ["Saturday", "10:00 AM – 2:00 PM"], ["Sunday", "Closed"]].map(([day, time], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{day}</span>
                    <span style={{ fontSize: 12.5, color: "white", fontWeight: 700 }}>{time}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ──────────────── MAP ──────────────── */}
        <section style={{ padding: "0 24px 96px" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <motion.div variants={fadeUp}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, color: "#D97706", background: "#FFFBEB", padding: "4px 12px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  <Icon d={ICONS.sparkle} size={10} color="#D97706" />
                  Location
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                Find Us on the Map
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: 14, color: "#64748B" }}>Visit our main office or explore our service areas.</motion.p>
            </div>

            <motion.div variants={scaleIn} className="ct-map-placeholder">
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={ICONS.location} size={26} color="#6366F1" />
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#6366F1" }}>123 Health St, Wellness City</p>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Replace with your Google Maps iframe</p>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 6, padding: "10px 20px", borderRadius: 11, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 18px rgba(99,102,241,0.30)" }}>
                Open in Maps <Icon d={ICONS.arrow} size={13} color="white" />
              </a>
            </motion.div>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default Contact;