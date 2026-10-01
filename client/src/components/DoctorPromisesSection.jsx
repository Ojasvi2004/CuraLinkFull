import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  ink:      "#0C0A09",
  body:     "#57534E",
  muted:    "#A8A29E",
  line:     "#ECEAE6",
  surface:  "#F5F4F2",
  surface2: "#FAFAF9",
  white:    "#FFFFFF",
};

const EASE = [0.22, 1, 0.36, 1];

// Iridescent orb gradients
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  chevL:   "M15 19l-7-7 7-7",
  chevR:   "M9 5l7 7-7 7",
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  quote:   "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check:   ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  heart:   ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
};

// ─── DOCTORS DATA ────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    name:      "Dr. Ananya Sharma",
    specialty: "Cardiologist",
    clinic:    "MedHeart Clinic",
    title:     "Prioritizing Your Heart Health",
    quote:     "Your heart health is my priority. I believe in providing compassionate, comprehensive care tailored to each patient, utilizing the latest advancements to ensure the best possible outcomes.",
    initials:  "AS",
    orb:       ORBS.violet,
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
    orb:       ORBS.sky,
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
    orb:       ORBS.mint,
    image:     "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=870&q=80",
    tags:      ["Dermatology", "12+ Years", "600+ Patients"],
    rating:    "4.9",
  },
];

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE } },
};

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.24em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// Pill with rotating sparkle
const Pill = ({ children }) => (
  <motion.span
    variants={fadeUp}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      fontWeight: 500,
      color: T.muted,
      marginBottom: 16,
      letterSpacing: "-0.01em",
    }}
  >
    <motion.span
      animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-flex" }}
    >
      <Icon d={ICONS.sparkle} size={12} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

// Magnetic wrapper
const Magnetic = ({ children, strength = 0.3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const DoctorPromisesSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const cardRef = useRef(null);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((i) => (i + dir + DOCTORS.length) % DOCTORS.length);
  };

  const doc = DOCTORS[current];

  // Carousel slide variants
  const slideVariants = {
    enter: (d) => ({
      opacity: 0,
      x: d > 0 ? 50 : -50,
      filter: "blur(4px)",
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.6, ease: EASE },
    },
    exit: (d) => ({
      opacity: 0,
      x: d > 0 ? -40 : 40,
      filter: "blur(4px)",
      scale: 0.98,
      transition: { duration: 0.35, ease: EASE },
    }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dp-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
        }

        .dp-main-card {
          position: relative;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 28px;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .dp-main-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(540px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.85), rgba(255,255,255,0) 65%);
        }
        .dp-main-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 50px rgba(12,10,9,0.06);
        }
        .dp-main-card:hover::before {
          opacity: 1;
        }

        .dp-nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid ${T.line};
          background: ${T.white};
          color: ${T.ink};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .dp-nav-btn:hover {
          background: ${T.surface};
          border-color: #D6D3D1;
          transform: translateY(-2px);
        }

        .dp-tag {
          font-size: 12px;
          font-weight: 500;
          color: ${T.ink};
          background: ${T.white};
          border: 1px solid ${T.line};
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: -0.01em;
          transition: border-color 0.2s;
        }
        .dp-tag:hover {
          border-color: #D6D3D1;
        }
      `}</style>

      <section className="dp-root" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* Section heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <Pill>Doctor Stories</Pill>
            <WordReveal
              text={"What Our Doctors\nPromise You"}
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 300,
                color: T.ink,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: 14,
              }}
            />
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 15,
                color: T.body,
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Hear directly from the specialists who make CuraLink extraordinary — their commitment, your care.
            </motion.p>
          </motion.div>

          {/* Main Interactive Carousel Card */}
          <div
            ref={cardRef}
            className="dp-main-card"
            onMouseMove={(e) => {
              if (!cardRef.current) return;
              const r = cardRef.current.getBoundingClientRect();
              cardRef.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
              cardRef.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
            }}
            style={{ padding: "clamp(28px, 4.5vw, 56px)" }}
          >
            {/* Iridescent background aura tied to the active doctor */}
            <motion.div
              key={`aura-${current}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 0.45, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{
                position: "absolute",
                top: -80,
                right: -60,
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: doc.orb,
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                  gap: 48,
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Doctor Portrait Column */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      borderRadius: 22,
                      overflow: "hidden",
                      border: `1px solid ${T.line}`,
                      position: "relative",
                      background: T.white,
                    }}
                  >
                    <motion.img
                      src={doc.image}
                      alt={doc.name}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{
                        width: "100%",
                        height: 380,
                        objectFit: "cover",
                        objectPosition: "top",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Rating Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${T.line}`,
                      borderRadius: 16,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow: "0 10px 24px rgba(12,10,9,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: T.surface,
                        border: `1px solid ${T.line}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon d={ICONS.star} size={15} color={T.ink} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: T.ink, lineHeight: 1 }}>{doc.rating}</p>
                      <p style={{ fontSize: 10.5, color: T.muted, fontWeight: 400, marginTop: 2 }}>Patient Rating</p>
                    </div>
                  </motion.div>
                </div>

                {/* Details Column */}
                <div>
                  {/* Specialty Pill */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        color: T.ink,
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        padding: "3px 12px",
                        borderRadius: 20,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <Icon d={ICONS.check} size={11} color={T.ink} />
                      {doc.specialty}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    style={{
                      fontSize: "clamp(22px, 2.8vw, 32px)",
                      fontWeight: 300,
                      color: T.ink,
                      lineHeight: 1.2,
                      letterSpacing: "-0.025em",
                      marginBottom: 20,
                    }}
                  >
                    {doc.title}
                  </h3>

                  {/* Quote text */}
                  <div style={{ position: "relative", marginBottom: 28 }}>
                    <div style={{ position: "absolute", top: -6, left: -6, opacity: 0.12, pointerEvents: "none" }}>
                      <Icon d={ICONS.quote} size={36} color={T.ink} />
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        color: T.body,
                        lineHeight: 1.75,
                        fontStyle: "italic",
                        paddingLeft: 10,
                      }}
                    >
                      "{doc.quote}"
                    </p>
                  </div>

                  {/* Doctor Info Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: doc.orb,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14.5,
                        fontWeight: 500,
                        color: "white",
                        letterSpacing: "-0.01em",
                        boxShadow: "0 6px 18px rgba(12,10,9,0.12)",
                        flexShrink: 0,
                      }}
                    >
                      {doc.initials}
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, color: T.ink, fontSize: 15.5, letterSpacing: "-0.01em" }}>{doc.name}</p>
                      <p style={{ fontSize: 13, color: T.muted, fontWeight: 400, marginTop: 1 }}>{doc.clinic}</p>
                    </div>
                  </div>

                  {/* Experience Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 34 }}>
                    {doc.tags.map((tag, i) => (
                      <span key={i} className="dp-tag">{tag}</span>
                    ))}
                  </div>

                  {/* Carousel Navigation Toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 18, borderTop: `1px solid ${T.line}` }}>
                    <Magnetic strength={0.35}>
                      <button className="dp-nav-btn" onClick={() => go(-1)} aria-label="Previous Doctor">
                        <Icon d={ICONS.chevL} size={15} color={T.ink} />
                      </button>
                    </Magnetic>

                    <Magnetic strength={0.35}>
                      <button className="dp-nav-btn" onClick={() => go(1)} aria-label="Next Doctor">
                        <Icon d={ICONS.chevR} size={15} color={T.ink} />
                      </button>
                    </Magnetic>

                    {/* Progress Dots with Spring Layout */}
                    <div style={{ display: "flex", gap: 7, marginLeft: 8 }}>
                      {DOCTORS.map((_, i) => (
                        <motion.button
                          key={i}
                          onClick={() => {
                            setDirection(i > current ? 1 : -1);
                            setCurrent(i);
                          }}
                          animate={{
                            width: i === current ? 24 : 7,
                            backgroundColor: i === current ? T.ink : "#D6D3D1",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          style={{
                            height: 7,
                            borderRadius: 6,
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                          }}
                          aria-label={`Go to doctor ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Numerical Counter */}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 12.5,
                        fontWeight: 400,
                        color: T.muted,
                        letterSpacing: "-0.01em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(current + 1).padStart(2, "0")} / {String(DOCTORS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Trust Indicators Strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 36,
            }}
          >
            {[
              { icon: ICONS.check,  text: "All doctors are verified & credentialed" },
              { icon: ICONS.shield, text: "HIPAA-compliant consultations" },
              { icon: ICONS.heart,  text: "Patient-first approach guaranteed" },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  borderRadius: 20,
                  padding: "6px 14px",
                }}
              >
                <Icon d={t.icon} size={12} color={T.ink} />
                <span style={{ fontSize: 12.5, fontWeight: 400, color: T.body, letterSpacing: "-0.01em" }}>{t.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default DoctorPromisesSection;