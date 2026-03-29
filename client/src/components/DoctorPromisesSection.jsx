import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  chevL:   "M15 19l-7-7 7-7",
  chevR:   "M9 5l7 7-7 7",
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  quote:   "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check:   ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  heart:   ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
};

const DOCTORS = [
  {
    name:      "Dr. Ananya Sharma",
    specialty: "Cardiologist",
    clinic:    "MedHeart Clinic",
    title:     "Prioritizing Your Heart Health",
    quote:     "Your heart health is my priority. I believe in providing compassionate, comprehensive care tailored to each patient, utilizing the latest advancements to ensure the best possible outcomes.",
    initials:  "AS",
    color:     "#EC4899",
    bg:        "#FDF2F8",
    gradient:  "linear-gradient(135deg,#EC4899,#F472B6)",
    image:     "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=870&q=80",
    tags:      ["Cardiology", "20+ Years", "500+ Patients"],
    rating:    "4.9",
  },
  {
    name:      "Dr. Vikram Singh",
    specialty: "Pediatrician",
    clinic:    "TinyCare Hospital",
    title:     "Dedicated to Children's Well-being",
    quote:     "Children deserve the best start in life. My commitment is to their well-being, offering expert care with a gentle touch and ensuring parents are informed partners in their child's health journey.",
    initials:  "VS",
    color:     "#6366F1",
    bg:        "#EEF2FF",
    gradient:  "linear-gradient(135deg,#6366F1,#8B5CF6)",
    image:     "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=870&q=80",
    tags:      ["Pediatrics", "15+ Years", "800+ Patients"],
    rating:    "4.8",
  },
  {
    name:      "Dr. Priya Reddy",
    specialty: "Dermatologist",
    clinic:    "SkinGlow Center",
    title:     "Achieving Radiant, Healthy Skin",
    quote:     "Healthy skin reflects overall wellness. I focus on personalized treatments and preventive care to help you achieve and maintain radiant, healthy skin with lasting confidence.",
    initials:  "PR",
    color:     "#059669",
    bg:        "#ECFDF5",
    gradient:  "linear-gradient(135deg,#10B981,#34D399)",
    image:     "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=870&q=80",
    tags:      ["Dermatology", "12+ Years", "600+ Patients"],
    rating:    "4.9",
  },
];

const DoctorPromisesSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(i => (i + dir + DOCTORS.length) % DOCTORS.length);
  };

  const doc = DOCTORS[current];

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -40 : 40, transition: { duration: 0.3 } }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .dp-root { font-family:'DM Sans',sans-serif; background:white; }
        .dp-nav-btn {
          width:44px; height:44px; border-radius:13px; border:1.5px solid #E2E8F0;
          background:white; display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.18s; color:#64748B;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }
        .dp-nav-btn:hover { border-color:#6366F1; background:#EEF2FF; color:#6366F1; box-shadow:0 4px 16px rgba(99,102,241,0.16); }
        .dp-nav-btn.active { background:linear-gradient(135deg,#6366F1,#8B5CF6); border-color:transparent; color:white; box-shadow:0 6px 20px rgba(99,102,241,0.35); }
        .dp-dot { width:8px; height:8px; border-radius:50%; cursor:pointer; transition:all 0.25s; }
      `}</style>

      <section className="dp-root" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* Section heading */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "#6366F1", background: "#EEF2FF", padding: "5px 13px", borderRadius: 20, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 14 }}>
              <Icon d={ICONS.sparkle} size={11} color="#6366F1" />
              Doctor Stories
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: 12 }}>
              What Our Doctors{" "}
              <span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Promise You</span>
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
              Hear directly from the specialists who make CuraLink extraordinary — their commitment, your care.
            </p>
          </motion.div>

          {/* Card */}
          <div style={{ background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", borderRadius: 28, padding: "clamp(28px,4vw,52px)", border: "1px solid #EEF2FF", boxShadow: "0 4px 32px rgba(99,102,241,0.10)", position: "relative", overflow: "hidden" }}>

            {/* Decorative blob inside card */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle,${doc.color}18 0%,transparent 70%)`, pointerEvents: "none", transition: "background 0.4s" }} />

            <AnimatePresence custom={direction} mode="wait">
              <motion.div key={current} custom={direction}
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40, alignItems: "center", position: "relative", zIndex: 1 }}>

                {/* Image column */}
                <div style={{ position: "relative" }}>
                  <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: `0 20px 56px ${doc.color}30` }}>
                    <img src={doc.image} alt={doc.name} style={{ width: "100%", height: 360, objectFit: "cover", objectPosition: "top", display: "block" }} />
                  </div>
                  {/* Floating rating badge */}
                  <div style={{ position: "absolute", bottom: 16, left: 16, background: "white", borderRadius: 14, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: doc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.star} size={15} color={doc.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{doc.rating}</p>
                      <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>Patient Rating</p>
                    </div>
                  </div>
                </div>

                {/* Content column */}
                <div>
                  {/* Specialty pill */}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: doc.color, background: doc.bg, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 18 }}>
                    <Icon d={ICONS.check} size={11} color={doc.color} />
                    {doc.specialty}
                  </span>

                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: 20 }}>
                    {doc.title}
                  </h3>

                  {/* Quote */}
                  <div style={{ position: "relative", marginBottom: 24 }}>
                    <div style={{ position: "absolute", top: -6, left: -4, opacity: 0.12 }}>
                      <Icon d={ICONS.quote} size={32} color={doc.color} />
                    </div>
                    <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, fontStyle: "italic", paddingLeft: 8 }}>
                      "{doc.quote}"
                    </p>
                  </div>

                  {/* Doctor info */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: doc.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif", boxShadow: `0 6px 18px ${doc.color}44` }}>
                      {doc.initials}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, color: "#0F172A", fontSize: 15 }}>{doc.name}</p>
                      <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{doc.clinic}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                    {doc.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: 12, fontWeight: 700, color: doc.color, background: doc.bg, padding: "4px 12px", borderRadius: 20 }}>{tag}</span>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <button className="dp-nav-btn" onClick={() => go(-1)} aria-label="Previous">
                      <Icon d={ICONS.chevL} size={16} color="currentColor" />
                    </button>
                    <button className="dp-nav-btn" onClick={() => go(1)} aria-label="Next">
                      <Icon d={ICONS.chevR} size={16} color="currentColor" />
                    </button>

                    {/* Dots */}
                    <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                      {DOCTORS.map((_, i) => (
                        <button key={i} className="dp-dot"
                          onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                          style={{ background: i === current ? doc.color : "#E2E8F0", width: i === current ? 22 : 8, borderRadius: i === current ? 4 : "50%", border: "none", cursor: "pointer" }}
                          aria-label={`Go to doctor ${i + 1}`}
                        />
                      ))}
                    </div>

                    <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>
                      {String(current + 1).padStart(2, "0")} / {String(DOCTORS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom trust strip */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 32 }}>
            {[
              { icon: ICONS.check,  color: "#6366F1", text: "All doctors are verified & credentialed" },
              { icon: ICONS.shield, color: "#059669", text: "HIPAA-compliant consultations"            },
              { icon: ICONS.heart,  color: "#EC4899", text: "Patient-first approach guaranteed"        },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.9)", border: "1px solid #EEF2FF", borderRadius: 20, padding: "6px 14px" }}>
                <Icon d={t.icon} size={13} color={t.color} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{t.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default DoctorPromisesSection;