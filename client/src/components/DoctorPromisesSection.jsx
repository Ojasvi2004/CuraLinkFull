import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
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
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
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
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check:   ["M20 6L9 17l-5-5"],
  arrow:   "M17 8l4 4m0 0l-4 4m4-4H3",
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
    tint:      "linear-gradient(150deg,#F1EEFF 0%,#FBEFF8 100%)",
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
    tint:      "linear-gradient(150deg,#EAF3FF 0%,#F1EEFF 100%)",
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
    tint:      "linear-gradient(150deg,#E8F8F0 0%,#EAF3FF 100%)",
    image:     "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=870&q=80",
    tags:      ["Dermatology", "12+ Years", "600+ Patients"],
    rating:    "4.9",
  },
];

const STANDARDS = [
  "All doctors are verified & credentialed",
  "HIPAA-compliant consultations",
  "Patient-first approach guaranteed",
];

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
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

const Pill = ({ children }) => (
  <motion.span variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 500, color: T.muted, marginBottom: 16, letterSpacing: "-0.01em" }}>
    <motion.span animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ display: "inline-flex" }}>
      <Icon d={ICONS.sparkle} size={12} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

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

// Quote that "reads in" word by word whenever the card slides into view
const QuoteWords = ({ text }) => (
  <motion.p
    initial="hidden"
    whileInView="visible"
    viewport={{ amount: 0.6, once: false }}
    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}
    style={{ fontSize: "clamp(19px, 1.9vw, 24px)", fontWeight: 300, color: T.ink, lineHeight: 1.45, letterSpacing: "-0.02em" }}
  >
    {text.split(" ").map((w, i) => (
      <motion.span
        key={i}
        variants={{ hidden: { opacity: 0.1, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
        style={{ display: "inline-block", marginRight: "0.27em" }}
      >
        {w}
      </motion.span>
    ))}
  </motion.p>
);

// Slowly rotating circular text badge holding the rating
const RatingSeal = ({ rating, id }) => (
  <div style={{ position: "relative", width: 104, height: 104 }}>
    <motion.svg
      viewBox="0 0 120 120" width="104" height="104"
      animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs><path id={id} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
      <text fontSize="10" fontWeight="500" fill={T.ink} fontFamily="Inter, sans-serif">
        <textPath href={`#${id}`} textLength="292" lengthAdjust="spacing">PATIENT RATING • PATIENT RATING • </textPath>
      </text>
    </motion.svg>
    <div style={{ position: "absolute", inset: 20, borderRadius: "50%", background: T.white, border: `1px solid ${T.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px rgba(12,10,9,0.08)" }}>
      <Icon d={ICONS.star} size={10} color={T.ink} />
      <span style={{ fontSize: 19, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{rating}</span>
    </div>
  </div>
);

// ─── DOCTOR CARD ─────────────────────────────────────────────────────────────
const DoctorCard = ({ doc, i, progress, cardRef }) => {
  const photoX = useTransform(progress, [0, 1], [46, -46]);
  const [exp, patients] = [doc.tags[1], doc.tags[2]].map((t) => {
    const [num, ...rest] = t.split(" ");
    return { num, label: rest.join(" ") };
  });

  return (
    <article ref={cardRef} className="dp-card" style={{ background: doc.tint }}>
      {/* Oversized outlined numeral */}
      <span aria-hidden className="dp-numeral">0{i + 1}</span>

      <div className="dp-card-grid">
        {/* Arch portrait */}
        <div className="dp-arch-wrap">
          <div className="dp-arch-outline" />
          <div className="dp-arch">
            <motion.img
              src={doc.image}
              alt={doc.name}
              style={{ position: "absolute", left: "-9%", top: 0, width: "118%", height: "100%", objectFit: "cover", objectPosition: "top", x: photoX }}
            />
          </div>
          <div className="dp-seal"><RatingSeal rating={doc.rating} id={`seal-${i}`} /></div>
        </div>

        {/* Words */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: T.body, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: doc.orb }} />
            {doc.specialty} · {doc.clinic}
          </div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>{doc.title}</div>

          <div
            aria-hidden
            style={{ fontSize: 76, lineHeight: 0.7, height: 34, fontWeight: 500, background: doc.orb, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10 }}
          >
            “
          </div>
          <QuoteWords text={doc.quote} />

          <div style={{ height: 1, background: "rgba(12,10,9,0.1)", margin: "26px 0 18px" }} />

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em" }}>{doc.name}</p>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{doc.clinic}</p>
            </div>
            <div style={{ display: "flex" }}>
              {[exp, patients].map((s, k) => (
                <div key={k} style={{ padding: k ? "0 0 0 20px" : "0 20px 0 0", borderLeft: k ? "1px solid rgba(12,10,9,0.12)" : "none" }}>
                  <div style={{ fontSize: 26, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: T.body, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

// ─── INTRO + OUTRO PANELS ────────────────────────────────────────────────────
const IntroPanel = () => (
  <motion.div
    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.4 }} variants={stagger}
    className="dp-panel" style={{ width: "min(440px, 84vw)" }}
  >
    <Pill>Doctor Stories</Pill>
    <WordReveal
      text={"What Our Doctors\nPromise You"}
      style={{ fontSize: "clamp(34px, 4.4vw, 54px)", fontWeight: 300, color: T.ink, lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: 18 }}
    />
    <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, lineHeight: 1.7, maxWidth: 380 }}>
      Hear directly from the specialists who make CuraLink extraordinary — their commitment, your care.
    </motion.p>
    <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 34, fontSize: 13, color: T.ink }}>
      <span style={{ position: "relative", width: 44, height: 1, background: T.line, overflow: "hidden" }}>
        <motion.span
          animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, background: T.ink }}
        />
      </span>
      Keep scrolling
      <Icon d={ICONS.arrow} size={14} color={T.ink} />
    </motion.div>
  </motion.div>
);

const StandardsPanel = () => (
  <motion.div
    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.4 }} variants={stagger}
    className="dp-panel" style={{ width: "min(380px, 84vw)" }}
  >
    <Pill>Our standards</Pill>
    <div>
      {STANDARDS.map((s, i) => (
        <motion.div
          key={i} variants={fadeUp}
          style={{ display: "flex", gap: 16, alignItems: "baseline", padding: "18px 0", borderTop: `1px solid ${T.line}`, borderBottom: i === STANDARDS.length - 1 ? `1px solid ${T.line}` : "none" }}
        >
          <span style={{ fontSize: 12, color: T.muted, fontVariantNumeric: "tabular-nums" }}>0{i + 1}</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: T.ink, letterSpacing: "-0.02em", lineHeight: 1.35, flex: 1 }}>{s}</span>
          <Icon d={ICONS.check} size={15} color={T.ink} />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const DoctorPromisesSection = () => {
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const outerRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const targets = useRef([]);
  const shiftMV = useMotionValue(0);
  const [maxShift, setMaxShift] = useState(1200);
  const [idx, setIdx] = useState(0);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform([smooth, shiftMV], ([p, m]) => -p * m);
  const orbX1 = useTransform(smooth, [0, 1], [0, -320]);
  const orbX2 = useTransform(smooth, [0, 1], [0, -620]);
  const still = useMotionValue(0.5);

  const native = narrow || reduce;

  // Measure the track so 1px of scroll == 1px of horizontal travel
  useLayoutEffect(() => {
    if (native) return;
    const measure = () => {
      if (!trackRef.current || !stageRef.current) return;
      const vw = stageRef.current.clientWidth;
      const m = Math.max(0, trackRef.current.scrollWidth - vw);
      shiftMV.set(m);
      setMaxShift(m);
      targets.current = cardRefs.current.map((c) =>
        c && m ? clamp((c.offsetLeft - (vw - c.offsetWidth) / 2) / m, 0, 1) : 0
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [native, shiftMV]);

  // Which card is closest to the centre right now
  useEffect(() => {
    if (native) return;
    return smooth.on("change", (p) => {
      let best = 0, bd = 9;
      targets.current.forEach((t, i) => { const d = Math.abs(t - p); if (d < bd) { bd = d; best = i; } });
      setIdx(best);
    });
  }, [smooth, native]);

  const goTo = (i) => {
    const n = clamp(i, 0, DOCTORS.length - 1);
    const top = outerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (targets.current[n] || 0) * maxShift, behavior: "smooth" });
  };

  const content = (progress) => (
    <>
      <IntroPanel />
      {DOCTORS.map((d, i) => (
        <DoctorCard key={i} doc={d} i={i} progress={progress} cardRef={(el) => (cardRefs.current[i] = el)} />
      ))}
      <StandardsPanel />
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dp-root { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:${T.white}; color:${T.body}; -webkit-font-smoothing:antialiased;
          position:relative; z-index:0; isolation:isolate; overflow:clip; padding-bottom:clamp(120px,18vh,200px); margin-bottom:clamp(24px,4vh,48px); }

        .dp-panel { flex-shrink:0; }
        .dp-card { position:relative; flex-shrink:0; width:min(940px,88vw); border-radius:36px; border:1px solid rgba(12,10,9,0.06); overflow:hidden; box-shadow:0 30px 70px rgba(12,10,9,0.07); }
        .dp-numeral { position:absolute; right:22px; bottom:-52px; font-size:230px; line-height:1; font-weight:200; letter-spacing:-0.06em; color:transparent; -webkit-text-stroke:1px rgba(12,10,9,0.09); pointer-events:none; user-select:none; }
        .dp-card-grid { position:relative; display:grid; grid-template-columns:0.76fr 1.24fr; gap:clamp(28px,4vw,52px); padding:clamp(24px,3vw,40px); align-items:stretch; }

        .dp-arch-wrap { position:relative; min-height:420px; }
        .dp-arch-outline { position:absolute; inset:0; transform:translate(14px,14px); border:1px solid rgba(12,10,9,0.16); border-radius:999px 999px 28px 28px; }
        .dp-arch { position:absolute; inset:0; overflow:hidden; border-radius:999px 999px 28px 28px; background:${T.white}; }
        .dp-seal { position:absolute; top:7%; right:-30px; z-index:2; }

        .dp-nav-btn { width:44px; height:44px; border-radius:50%; border:1px solid ${T.line}; background:${T.white}; color:${T.ink}; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .2s,border-color .2s,opacity .2s; }
        .dp-nav-btn:hover:not(:disabled) { background:${T.surface}; border-color:#D6D3D1; }
        .dp-nav-btn:disabled { opacity:.35; cursor:default; }
        .dp-nav-btn:focus-visible { outline:2px solid ${T.ink}; outline-offset:2px; }

        /* native horizontal scroller (mobile + reduced motion) */
        .dp-native { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; padding:56px 24px 24px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .dp-native::-webkit-scrollbar { display:none; }
        .dp-native > * { scroll-snap-align:center; }

        @media (max-width:760px) {
          .dp-card-grid { grid-template-columns:1fr; }
          .dp-arch-wrap { min-height:260px; }
          .dp-seal { right:-8px; top:-14px; transform:scale(.78); transform-origin:top right; }
          .dp-numeral { font-size:150px; bottom:-30px; }
        }
      `}</style>

      <section className="dp-root">
        {native ? (
          <div className="dp-native">{content(still)}</div>
        ) : (
          <div ref={outerRef} style={{ position: "relative", height: `calc(100vh + ${maxShift}px)` }}>
            <div
              ref={stageRef}
              style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", paddingTop: 72 }}
            >
              {/* Ambient orbs drifting against the scroll */}
              <motion.div style={{ position: "absolute", top: "14%", left: "62%", width: 420, height: 420, borderRadius: "50%", background: ORBS.violet, opacity: 0.22, filter: "blur(60px)", pointerEvents: "none", x: orbX1 }} />
              <motion.div style={{ position: "absolute", bottom: "6%", left: "92%", width: 380, height: 380, borderRadius: "50%", background: ORBS.sky, opacity: 0.2, filter: "blur(60px)", pointerEvents: "none", x: orbX2 }} />

              {/* Horizontal track */}
              <motion.div
                ref={trackRef}
                style={{ x, display: "flex", alignItems: "center", gap: 36, width: "max-content", padding: "0 clamp(24px, 6vw, 96px)", position: "relative", willChange: "transform" }}
              >
                {content(smooth)}
              </motion.div>

              {/* Bottom controls: counter, progress hairline, arrows */}
              <div style={{ position: "absolute", left: "clamp(24px, 6vw, 96px)", right: "clamp(24px, 6vw, 96px)", bottom: 30, display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontVariantNumeric: "tabular-nums", minWidth: 64 }}>
                  <div style={{ height: 30, overflow: "hidden" }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={idx} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: EASE }}
                        style={{ display: "block", fontSize: 26, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em", lineHeight: "30px" }}
                      >
                        0{idx + 1}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span style={{ fontSize: 12.5, color: T.muted }}>/ 0{DOCTORS.length}</span>
                </div>

                <div style={{ flex: 1, height: 1, background: T.line, position: "relative" }}>
                  <motion.div style={{ position: "absolute", inset: 0, background: T.ink, transformOrigin: "0% 50%", scaleX: smooth }} />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <Magnetic strength={0.3}>
                    <button className="dp-nav-btn" onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Previous doctor">
                      <Icon d={ICONS.chevL} size={15} color={T.ink} />
                    </button>
                  </Magnetic>
                  <Magnetic strength={0.3}>
                    <button className="dp-nav-btn" onClick={() => goTo(idx + 1)} disabled={idx === DOCTORS.length - 1} aria-label="Next doctor">
                      <Icon d={ICONS.chevR} size={15} color={T.ink} />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default DoctorPromisesSection;