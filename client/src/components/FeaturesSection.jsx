import React from "react";
import { motion } from "framer-motion";

const Icon = ({ d, size = 22, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  video:    ["M15 10l4.55-2.28A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.9L15 14", "M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"],
  doc:      "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

const FEATURES = [
  { icon: ICONS.ai,       color: "#059669", bg: "#ECFDF5", gradient: "linear-gradient(135deg,#10B981,#34D399)", title: "AI Symptom Analyzer",            tag: "AI-Powered",  desc: "Not sure which specialist to see? Describe your symptoms and our AI guides you to the right doctor, saving time and worry."                              },
  { icon: ICONS.search,   color: "#6366F1", bg: "#EEF2FF", gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)", title: "Comprehensive Doctor Search",    tag: "Directory",   desc: "Find verified doctors by specialty, location, availability, or ratings. Access detailed profiles to make informed decisions."                          },
  { icon: ICONS.calendar, color: "#0284C7", bg: "#E0F2FE", gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)", title: "Effortless Appointment Booking", tag: "Scheduling",  desc: "Book in-person or digital consultations in just a few clicks. View real-time availability and manage your schedule seamlessly."                        },
  { icon: ICONS.video,    color: "#8B5CF6", bg: "#F5F3FF", gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)", title: "Secure Telemedicine",            tag: "Video Calls", desc: "Connect with doctors remotely via high-quality video calls for minor ailments, follow-ups, or when travel is a constraint."                           },
  { icon: ICONS.doc,      color: "#EC4899", bg: "#FDF2F8", gradient: "linear-gradient(135deg,#EC4899,#F472B6)", title: "Digital Prescription Vault",     tag: "Health Vault", desc: "Receive and store prescriptions digitally after consultations — easily accessible, shareable, and always organized."                                },
  { icon: ICONS.user,     color: "#D97706", bg: "#FFFBEB", gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)", title: "Personalized Dashboard",         tag: "Personal",    desc: "Track appointments, medical history, prescriptions, and doctor communications — all in one secure, beautifully designed hub."                           },
];

const USE_CASES = [
  {
    title: "Quick Consultation for Minor Ailments",
    desc:  "Use our AI symptom analyzer, connect with a general physician via telemedicine, and get expert advice without leaving home.",
    scenario: "A busy professional needs quick advice for a recurring headache.",
    benefit:  "Saves travel time, provides rapid access to medical guidance.",
    color: "#6366F1", bg: "#EEF2FF",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "Finding the Right Specialist",
    desc:  "Our AI guides you to the appropriate specialist and helps you book an informed, targeted consultation the first time.",
    scenario: "A patient has persistent joint pain but isn't sure whether to see a rheumatologist or orthopedist.",
    benefit:  "Reduces misdirected consultations, accelerates path to correct diagnosis.",
    color: "#059669", bg: "#ECFDF5",
    image: "https://images.unsplash.com/photo-1584515933487-750f40589918?auto=format&fit=crop&w=870&q=80",
  },
  {
    title: "Convenient Follow-Up Appointments",
    desc:  "Schedule a digital consultation for a quick check-in, discuss lab results, or adjust medication with your doctor.",
    scenario: "A patient recovering from surgery needs a routine follow-up but lives far from the hospital.",
    benefit:  "Improves continuity of care, reduces travel burden for patients.",
    color: "#8B5CF6", bg: "#F5F3FF",
    image: "https://images.unsplash.com/photo-1622227945605-b54ca7968097?auto=format&fit=crop&w=774&q=80",
  },
];

const fadeUp  = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };

const SectionHeading = ({ pill, pillColor = "#6366F1", pillBg = "#EEF2FF", title, sub, center = true }) => (
  <div style={{ textAlign: center ? "center" : "left", marginBottom: 52 }}>
    <motion.div variants={fadeUp}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: pillColor, background: pillBg, padding: "5px 13px", borderRadius: 20, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 14 }}>
        <Icon d={ICONS.sparkle} size={11} color={pillColor} />
        {pill}
      </span>
    </motion.div>
    <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: sub ? 12 : 0 }}>
      {title}
    </motion.h2>
    {sub && <motion.p variants={fadeUp} style={{ fontSize: 15, color: "#64748B", maxWidth: 540, margin: center ? "0 auto" : 0, lineHeight: 1.75 }}>{sub}</motion.p>}
  </div>
);

const FeaturesSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .feat-root { font-family:'DM Sans',sans-serif; background:linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%); }
      .feat-card {
        background:white; border-radius:20px; border:1px solid #EEF2FF;
        box-shadow:0 2px 12px rgba(0,0,0,0.05); overflow:hidden;
        transition:transform 0.25s,box-shadow 0.25s; cursor:default;
      }
      .feat-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(99,102,241,0.13); }
      .usecase-card {
        background:white; border-radius:22px; border:1px solid #EEF2FF;
        box-shadow:0 4px 24px rgba(0,0,0,0.06); overflow:hidden;
        display:flex; align-items:stretch;
        transition:box-shadow 0.25s;
      }
      .usecase-card:hover { box-shadow:0 12px 40px rgba(99,102,241,0.13); }
      @media(max-width:900px){ .usecase-card { flex-direction:column !important; } }
    `}</style>

    <div className="feat-root">

      {/* ──────── FEATURES GRID ──────── */}
      <section style={{ padding: "96px 0 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <SectionHeading
              pill="Core Capabilities"
              title="How CuraLink Empowers Your Health Journey"
              sub="A suite of integrated tools designed to simplify access to quality healthcare — from intelligent guidance to seamless consultations."
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
              {FEATURES.map((f, i) => (
                <motion.div key={i} variants={fadeUp} className="feat-card">
                  {/* Gradient top bar */}
                  <div style={{ height: 4, background: f.gradient }} />
                  <div style={{ padding: "26px 24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon d={f.icon} size={22} color={f.color} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 800, color: f.color, background: f.bg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase" }}>{f.tag}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                    <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.75 }}>{f.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 18, color: f.color, fontWeight: 700, fontSize: 12 }}>
                      Learn more <Icon d={ICONS.arrow} size={12} color={f.color} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────── USE CASES ──────── */}
      <section style={{ padding: "0 0 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <SectionHeading
              pill="Real-World Scenarios"
              pillColor="#8B5CF6"
              pillBg="#F5F3FF"
              title="See CuraLink in Action"
              sub="Explore how CuraLink addresses common healthcare challenges, making medical care more accessible and efficient for everyone."
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {USE_CASES.map((uc, i) => (
                <motion.div key={i} variants={scaleIn}
                  className="usecase-card"
                  style={{ flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}>

                  {/* Image side */}
                  <div style={{ flex: "0 0 42%", minHeight: 280, position: "relative", overflow: "hidden" }}>
                    <img src={uc.image} alt={uc.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                    {/* Color overlay strip */}
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${i % 2 === 0 ? "to right" : "to left"},transparent 60%,rgba(255,255,255,0.15))` }} />
                  </div>

                  {/* Content side */}
                  <div style={{ flex: 1, padding: "36px 36px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 800, color: uc.color, background: uc.bg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>
                      <Icon d={ICONS.sparkle} size={10} color={uc.color} />
                      Use Case
                    </span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", marginBottom: 12, lineHeight: 1.3 }}>{uc.title}</h3>
                    <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.8, marginBottom: 20 }}>{uc.desc}</p>

                    {/* Scenario / Benefit box */}
                    <div style={{ background: uc.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${uc.color}18` }}>
                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: uc.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Example Scenario</p>
                        <p style={{ fontSize: 13, color: "#475569", fontStyle: "italic", lineHeight: 1.6 }}>{uc.scenario}</p>
                      </div>
                      <div style={{ height: 1, background: `${uc.color}18`, marginBottom: 10 }} />
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: uc.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Key Benefit</p>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                          <Icon d={ICONS.check} size={14} color={uc.color} style={{ flexShrink: 0, marginTop: 1 }} />
                          <p style={{ fontSize: 13, color: "#334155", fontWeight: 600, lineHeight: 1.6 }}>{uc.benefit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  </>
);

export default FeaturesSection;