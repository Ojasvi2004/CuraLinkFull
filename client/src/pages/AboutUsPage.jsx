import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

// ─── SHARED ICON PRIMITIVE ───────────────────────────────────────────────────
const Icon = ({ d, size = 22, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mission:  ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m4 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"],
  vision:   ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  pill:     "M10.5 3.5a4 4 0 0 1 5.657 5.657l-7.07 7.07a4 4 0 0 1-5.658-5.656l7.07-7.07z M14 10l-4 4",
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chat:     ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  bulb:     ["M9 18h6", "M10 22h4", "M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C4.19 13.47 3 11.38 3 9a7 7 0 0 1 7-7z"],
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
};

// ─── IMAGE ASSETS ────────────────────────────────────────────────────────────
const ourStoryImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1170&q=80";
const howItWorksImage = "https://images.unsplash.com/photo-1581091226809-5c04E0607502?auto=format&fit=crop&w=774&q=80";

const teamMembers = [
  { name: "Dr. Evelyn Reed", role: "Chief Medical Officer", initials: "ER", color: "#6366F1", bg: "#EEF2FF", bio: "With 20+ years in clinical practice, Dr. Reed ensures CuraLink's medical guidance is sound, ethical, and patient-first." },
  { name: "Alex Chen",       role: "Lead AI Engineer",     initials: "AC", color: "#059669", bg: "#ECFDF5", bio: "Alex spearheads our AI development, building intelligent systems that are powerful yet deeply human in feel." },
  { name: "Priya Sharma",    role: "Head of Product & UX", initials: "PS", color: "#D97706", bg: "#FFFBEB", bio: "Priya is obsessed with the user — leading design and product strategy so CuraLink feels effortless and intuitive." },
];

const VALUES = [
  "Patient-Centricity Above All",
  "Unwavering Innovation",
  "Trust & Transparency",
  "Universal Accessibility",
  "Empathy in Every Interaction",
  "Excellence in Delivery",
];

const HOW_IT_WORKS = [
  { step: 1, icon: ICONS.ai,       color: "#059669", bg: "#ECFDF5", title: "Tell Us Your Symptoms",  desc: "Use our AI Symptom Analyzer to get intelligent guidance on which specialist is right for you."  },
  { step: 2, icon: ICONS.search,   color: "#6366F1", bg: "#EEF2FF", title: "Find Your Doctor",       desc: "Browse our verified network. Filter by specialty, location, ratings, and more."                },
  { step: 3, icon: ICONS.calendar, color: "#D97706", bg: "#FFFBEB", title: "Book with Ease",         desc: "View real-time availability and confirm your in-person or digital appointment in seconds."       },
  { step: 4, icon: ICONS.chat,     color: "#8B5CF6", bg: "#F5F3FF", title: "Consult & Connect",      desc: "Attend your visit or join a secure video call — your care, your way."                          },
];

const COMMITMENTS = [
  { icon: ICONS.heart,   color: "#EC4899", bg: "#FDF2F8", title: "Exceptional Patient Care",    desc: "Your health journey is unique. We provide tools and connections that respect your individuality with empathy and professionalism." },
  { icon: ICONS.lock,    color: "#6366F1", bg: "#EEF2FF", title: "Data Security & Privacy",     desc: "Built with enterprise-grade security. Your health data is encrypted, private, and never sold — ever."                         },
  { icon: ICONS.bulb,    color: "#D97706", bg: "#FFFBEB", title: "Continuous Innovation",       desc: "We're always evolving. From AI breakthroughs to UX refinements — every update makes CuraLink smarter for you."                },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
const Section = ({ children, style = {}, once = true }) => (
  <motion.section
    initial="hidden" whileInView="visible"
    viewport={{ once, amount: 0.15 }}
    variants={stagger}
    style={style}
  >
    {children}
  </motion.section>
);

// ─── PILL LABEL ───────────────────────────────────────────────────────────────
const Pill = ({ children, color = "#6366F1", bg = "#EEF2FF" }) => (
  <motion.span variants={fadeUp} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 11, fontWeight: 800, color, background: bg,
    padding: "5px 13px", borderRadius: 20,
    letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 14,
  }}>
    <Icon d={ICONS.sparkle} size={11} color={color} />
    {children}
  </motion.span>
);

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
const SectionHeading = ({ title, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 52 }}>
    <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: 12 }}>
      {title}
    </motion.h2>
    {sub && <motion.p variants={fadeUp} style={{ fontSize: 15, color: "#64748B", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{sub}</motion.p>}
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AboutUsPage = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .about-root { font-family:'DM Sans',sans-serif; background: linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%); color:#334155; }
      .about-card { background:white; border-radius:20px; border:1px solid #EEF2FF; box-shadow:0 2px 16px rgba(0,0,0,0.06); transition:box-shadow 0.25s, transform 0.25s; }
      .about-card:hover { box-shadow:0 12px 40px rgba(99,102,241,0.14); transform:translateY(-4px); }
      .step-connector { position:absolute; left:23px; top:52px; bottom:-24px; width:2px; background:linear-gradient(to bottom,#C7D2FE,transparent); }
    `}</style>

    <div className="about-root" style={{ overflowX: "hidden" }}>

      {/* ──────────────── HERO ──────────────── */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

        {/* Background blobs */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "120px 24px 80px", textAlign: "center" }}>

          {/* Floating badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid #C7D2FE", borderRadius: 40, padding: "7px 18px 7px 10px", marginBottom: 28 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS.cross} size={14} color="white" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", letterSpacing: "0.06em" }}>TRUSTED HEALTHCARE PLATFORM</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, type: "spring", stiffness: 100 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 22 }}>
            About{" "}
            <span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CuraLink
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: "clamp(15px,2vw,18px)", color: "#64748B", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 40px" }}>
            Pioneering a future where intelligent technology and compassionate healthcare converge — making quality medical support accessible, understandable, and deeply personal.
          </motion.p>

          {/* Stat pills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {[
              { label: "Verified Doctors", value: "2,400+", color: "#6366F1", bg: "#EEF2FF" },
              { label: "Patients Served",  value: "180K+",  color: "#059669", bg: "#ECFDF5" },
              { label: "Cities Covered",   value: "120+",   color: "#D97706", bg: "#FFFBEB" },
              { label: "Avg. Rating",      value: "4.9 ★",  color: "#EC4899", bg: "#FDF2F8" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 14, padding: "10px 18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginTop: 2 }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── OUR STORY ──────────────── */}
      <Section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "center" }}>
          <div>
            <Pill>Our Genesis</Pill>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.25, marginBottom: 22 }}>
              The Journey to Simplify Your Healthcare
            </motion.h2>
            {[
              "CuraLink was born from a deeply personal observation: navigating the healthcare system can feel like a maze — complex, fragmented, and overwhelming. We saw patients struggling to find the right specialists, enduring long waits, and feeling lost in a sea of medical jargon.",
              "Driven by a desire to make a tangible difference, our founding team — technologists, healthcare advocates, and design thinkers — embarked on a shared mission: to build an intelligent, empathetic bridge connecting patients to the quality care they deserve.",
              "We believe technology, when thoughtfully applied, can humanize healthcare. Every feature in CuraLink, from our AI symptom analyzer to seamless telemedicine, is crafted with the patient's journey at its absolute core.",
            ].map((text, i) => (
              <motion.p key={i} variants={fadeUp} style={{ fontSize: 14.5, color: "#64748B", lineHeight: 1.8, marginBottom: 14 }}>{text}</motion.p>
            ))}
          </div>
          <motion.div variants={scaleIn} style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(99,102,241,0.18)" }}>
            <img src={ourStoryImage} alt="CuraLink story" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
          </motion.div>
        </div>
      </Section>

      {/* ──────────────── MISSION / VISION / VALUES ──────────────── */}
      <Section style={{ padding: "96px 0", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Our Guiding Principles" sub="The beliefs and commitments that shape everything we build at CuraLink." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

            {/* Mission */}
            <motion.div variants={fadeUp} className="about-card" style={{ padding: "32px 28px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#6366F1,#8B5CF6)" }} />
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon d={ICONS.mission} size={24} color="#6366F1" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Our Mission</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.75 }}>To empower every individual by providing intuitive, AI-driven access to a network of trusted healthcare professionals, fostering informed decisions and better health outcomes for all.</p>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeUp} className="about-card" style={{ padding: "32px 28px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#8B5CF6,#A78BFA)" }} />
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon d={ICONS.vision} size={24} color="#8B5CF6" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Our Vision</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.75 }}>To be the most trusted digital health platform — seamlessly integrating cutting-edge technology with compassionate, patient-first care that is universally accessible and deeply personalized.</p>
            </motion.div>

            {/* Values */}
            <motion.div variants={fadeUp} className="about-card" style={{ padding: "32px 28px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#EC4899,#F472B6)" }} />
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "#FDF2F8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon d={ICONS.heart} size={24} color="#EC4899" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Core Values</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {VALUES.map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 6, background: "#FDF2F8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon d={ICONS.check} size={11} color="#EC4899" />
                    </div>
                    <span style={{ fontSize: 13.5, color: "#334155", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </Section>

      {/* ──────────────── COMMITMENT ──────────────── */}
      <Section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Our Commitment to You" sub="At CuraLink, we're not just building a platform — we're building a community founded on trust and dedicated to your well-being." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {COMMITMENTS.map((c, i) => (
              <motion.div key={i} variants={fadeUp} className="about-card" style={{ padding: "30px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={c.icon} size={24} color={c.color} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{c.title}</h4>
                  <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.75 }}>{c.desc}</p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${c.bg}`, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.color, cursor: "pointer" }}>Learn more</span>
                  <Icon d={ICONS.arrow} size={12} color={c.color} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <Section style={{ padding: "96px 0", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "center" }}>

          {/* Steps */}
          <div>
            <Pill color="#059669" bg="#ECFDF5">How It Works</Pill>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3.5vw,34px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.25, marginBottom: 36 }}>
              Getting Started<br />is Easy
            </motion.h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {HOW_IT_WORKS.map((item, i) => (
                <motion.div key={i} variants={fadeUp} style={{ display: "flex", gap: 18, position: "relative", paddingBottom: i < HOW_IT_WORKS.length - 1 ? 28 : 0 }}>
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div style={{ position: "absolute", left: 23, top: 52, bottom: 0, width: 2, background: "linear-gradient(to bottom,#C7D2FE,transparent)" }} />
                  )}
                  {/* Step icon */}
                  <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${item.color}22`, position: "relative", zIndex: 1 }}>
                    <Icon d={item.icon} size={20} color={item.color} />
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: item.bg, padding: "2px 8px", borderRadius: 10 }}>Step {item.step}</span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div variants={scaleIn} style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(99,102,241,0.16)" }}>
            <img src={howItWorksImage} alt="How CuraLink works" style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }} />
          </motion.div>
        </div>
      </Section>

      {/* ──────────────── TEAM ──────────────── */}
      <Section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Meet Our Core Team" sub="A dedicated group of innovators passionate about transforming healthcare through technology and empathy." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {teamMembers.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="about-card" style={{ padding: "32px 26px", textAlign: "center", overflow: "hidden", position: "relative" }}>
                {/* Top gradient bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${m.color},${m.color}88)` }} />

                {/* Avatar */}
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${m.color},${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif", boxShadow: `0 8px 24px ${m.color}40` }}>
                  {m.initials}
                </div>

                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{m.name}</h4>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.color, background: m.bg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase" }}>{m.role}</span>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.7, marginTop: 14 }}>{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────────────── CTA ──────────────── */}
      <Section style={{ padding: "0 24px 96px" }}>
        <motion.div variants={scaleIn} style={{ maxWidth: 1100, margin: "0 auto", background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#A78BFA 100%)", borderRadius: 28, padding: "clamp(40px,6vw,72px) clamp(28px,6vw,72px)", position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(99,102,241,0.38)" }}>

          {/* Decorative blobs inside CTA */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: 80, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 22 }}>
              <Icon d={ICONS.sparkle} size={13} color="rgba(255,255,255,0.9)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.08em" }}>START YOUR JOURNEY</span>
            </div>

            <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
              Ready to Experience<br />Smarter Healthcare?
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
              Join CuraLink today and take the first step towards a more connected, empowered health journey.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <NavLink to="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", color: "#6366F1", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 12, textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}>
                Get Started Free
                <Icon d={ICONS.arrow} size={15} color="#6366F1" />
              </NavLink>
              <NavLink to="/find-doctors" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", color: "white", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}>
                Browse Doctors
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
      </Section>

    </div>
  </>
);

export default AboutUsPage;