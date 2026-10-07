import React from "react";
import { motion, useReducedMotion } from "framer-motion";

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

const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// Lighter glass: no backdrop-filter (the main source of paint lag)
const glass = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.95)",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(12,10,9,0.07)",
};
const darkGlass = {
  background: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.26)",
};

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
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
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M20 6L9 17l-5-5"],
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  mic:      ["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v3"],
  phone:    ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"],
};

// ─── SMALL SHARED PIECES ─────────────────────────────────────────────────────
const Float = ({ children, d = 0, amp = 6, style = {} }) => (
  <motion.div
    animate={{ y: [0, -amp, 0] }}
    transition={{ duration: 5 + d, repeat: Infinity, ease: "easeInOut", delay: d }}
    style={style}
  >
    {children}
  </motion.div>
);

const OrbDot = ({ size = 28, bg }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0 }} />
);

const Bar = ({ w, h = 7, c = "#E7E5E4" }) => (
  <div style={{ width: w, height: h, borderRadius: 6, background: c }} />
);

// ─── PRODUCT UI VISUALS (one per feature) ────────────────────────────────────
const VSymptom = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "min(310px, 84%)" }}>
    <Float d={0} amp={5} style={{ alignSelf: "flex-end" }}>
      <div style={{ ...glass, borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: 13, color: T.ink, maxWidth: 230 }}>
        Headache for three days, sensitive to light
      </div>
    </Float>
    <Float d={0.7} amp={6}>
      <div style={{ ...glass, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
        <OrbDot size={34} bg={ORBS.violet} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, color: T.muted }}>Suggested specialist</div>
          <div style={{ fontSize: 14.5, color: T.ink, fontWeight: 500, letterSpacing: "-0.01em", margin: "1px 0 7px" }}>Neurologist</div>
          <div style={{ height: 4, borderRadius: 4, background: "#E7E5E4", overflow: "hidden" }}>
            <motion.div
              animate={{ width: ["18%", "94%"] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.2, ease: EASE }}
              style={{ height: "100%", background: T.ink, borderRadius: 4 }}
            />
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>94%</span>
      </div>
    </Float>
  </div>
);

const VSearch = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 9, width: "min(310px, 84%)" }}>
    <div style={{ ...glass, borderRadius: 999, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.body }}>
      <Icon d={ICONS.search} size={15} color={T.muted} /> Cardiologist near me
    </div>
    {[ORBS.sky, ORBS.sun, ORBS.mint].map((o, i) => (
      <Float key={i} d={i * 0.5} amp={4}>
        <div style={{ ...glass, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10, transform: `scale(${1 - i * 0.04})`, opacity: 1 - i * 0.18 }}>
          <OrbDot size={30} bg={o} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <Bar w={92 - i * 10} h={7} c="#D6D3D1" />
            <Bar w={56} h={6} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>4.{9 - i} ★</span>
        </div>
      </Float>
    ))}
  </div>
);

const VBooking = () => (
  <Float amp={5}>
    <div style={{ ...glass, padding: 14, width: "min(300px, 84vw)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        {["M", "T", "W", "T", "F"].map((d, i) => (
          <div key={i} style={{ width: 44, padding: "7px 0", borderRadius: 12, textAlign: "center", background: i === 2 ? T.ink : "transparent", color: i === 2 ? "#fff" : T.body }}>
            <div style={{ fontSize: 10.5, opacity: 0.7 }}>{d}</div>
            <div style={{ fontSize: 15, fontWeight: 500, marginTop: 1 }}>{12 + i}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {["10:00", "10:30", "11:00"].map((t, i) => (
          <div key={t} style={{ flex: 1, textAlign: "center", fontSize: 12, padding: "6px 0", borderRadius: 999, border: `1px solid ${i === 1 ? T.ink : T.line}`, color: T.ink, background: i === 1 ? "#fff" : "transparent", fontWeight: i === 1 ? 500 : 400 }}>{t}</div>
        ))}
      </div>
      <div style={{ background: T.ink, color: "#fff", fontSize: 12.5, fontWeight: 500, textAlign: "center", padding: "9px 0", borderRadius: 999 }}>Confirm appointment</div>
    </div>
  </Float>
);

const VVideo = () => (
  <div style={{ position: "relative", width: "min(290px, 82%)", height: 190 }}>
    <div style={{ position: "absolute", inset: "0 0 26px 0", borderRadius: 20, background: "linear-gradient(160deg,#292524,#0C0A09)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(12,10,9,0.25)" }}>
      <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <OrbDot size={74} bg={ORBS.violet} />
      </motion.div>
      <div style={{ position: "absolute", top: 10, right: 10, width: 54, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <OrbDot size={20} bg={ORBS.sun} />
      </div>
      <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", alignItems: "flex-end", gap: 3, height: 22 }}>
        {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.35, 0.7, 1, 0.5].map((h, i) => (
          <motion.span key={i}
            animate={{ scaleY: [0.25, h, 0.25] }}
            transition={{ duration: 1 + (i % 4) * 0.18, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }}
            style={{ width: 3, height: 22, borderRadius: 3, background: "rgba(255,255,255,0.85)", transformOrigin: "50% 100%" }}
          />
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", gap: 10 }}>
      {[ICONS.mic, ICONS.video].map((ic, i) => (
        <div key={i} style={{ ...glass, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ic} size={16} color={T.ink} /></div>
      ))}
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(220,38,38,0.35)" }}><Icon d={ICONS.phone} size={16} color="#fff" /></div>
    </div>
  </div>
);

const VVault = () => (
  <div style={{ position: "relative", width: 230, height: 180 }}>
    {[{ r: -8, x: -26, y: 14, o: 0.7 }, { r: 7, x: 24, y: 8, o: 0.85 }, { r: 0, x: 0, y: 0, o: 1 }].map((c, i) => (
      <Float key={i} d={i * 0.6} amp={i === 2 ? 6 : 3} style={{ position: "absolute", inset: 0 }}>
        <div style={{ ...glass, position: "absolute", left: 24, top: 0, width: 182, height: 150, padding: 14, transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg)`, opacity: c.o }}>
          {i === 2 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 22, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em" }}>Rx</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 20, padding: "2px 8px" }}><Icon d={ICONS.lock} size={10} color={T.ink} /> Private</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Bar w="86%" /><Bar w="70%" /><Bar w="78%" /><Bar w="44%" />
              </div>
              <div style={{ position: "absolute", right: 12, bottom: 12, width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ICONS.check} size={13} color="#fff" /></div>
            </>
          )}
        </div>
      </Float>
    ))}
  </div>
);

const VDash = () => (
  <Float amp={5}>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "min(300px, 84vw)" }}>
      <div style={{ ...glass, padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginBottom: 10 }}><span>This week</span><span style={{ color: T.ink, fontWeight: 500 }}>3 visits</span></div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 66 }}>
          {[38, 56, 44, 72, 52, 84, 60].map((h, i) => (
            <motion.div key={i}
              animate={{ height: [h * 0.8, h, h * 0.8] }}
              transition={{ duration: 3 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              style={{ width: 24, borderRadius: 7, height: h, background: i === 5 ? ORBS.violet : "#E7E5E4" }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {[["Next visit", "Thu, 10:30"], ["Prescriptions", "3 active"]].map(([a, b]) => (
          <div key={a} style={{ ...glass, flex: 1, padding: "9px 12px" }}>
            <div style={{ fontSize: 11, color: T.muted }}>{a}</div>
            <div style={{ fontSize: 13, color: T.ink, fontWeight: 500, marginTop: 1 }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  </Float>
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: ICONS.ai,       title: "AI Symptom Analyzer",            tag: "AI-Powered",   Visual: VSymptom, orb: ORBS.violet, bg: "linear-gradient(145deg,#EEF0FF 0%,#F8EEFF 100%)", desc: "Not sure which specialist to see? Describe your symptoms and our AI guides you to the right doctor, saving time and worry." },
  { icon: ICONS.search,   title: "Comprehensive Doctor Search",    tag: "Directory",    Visual: VSearch,  orb: ORBS.sky,    bg: "linear-gradient(145deg,#E8F3FF 0%,#EEF0FF 100%)", desc: "Find verified doctors by specialty, location, availability, or ratings. Access detailed profiles to make informed decisions." },
  { icon: ICONS.calendar, title: "Effortless Appointment Booking", tag: "Scheduling",   Visual: VBooking, orb: ORBS.sun,    bg: "linear-gradient(145deg,#FFF1E6 0%,#FFE9F0 100%)", desc: "Book in-person or digital consultations in just a few clicks. View real-time availability and manage your schedule seamlessly." },
  { icon: ICONS.video,    title: "Secure Telemedicine",            tag: "Video Calls",  Visual: VVideo,   orb: ORBS.sky,    bg: "linear-gradient(145deg,#EDEBFF 0%,#E6F0FF 100%)", desc: "Connect with doctors remotely via high-quality video calls for minor ailments, follow-ups, or when travel is a constraint." },
  { icon: ICONS.doc,      title: "Digital Prescription Vault",     tag: "Health Vault", Visual: VVault,   orb: ORBS.mint,   bg: "linear-gradient(145deg,#E9F9F1 0%,#E8F3FF 100%)", desc: "Receive and store prescriptions digitally after consultations — easily accessible, shareable, and always organized." },
  { icon: ICONS.user,     title: "Personalized Dashboard",         tag: "Personal",     Visual: VDash,    orb: ORBS.violet, bg: "linear-gradient(145deg,#F8EEFF 0%,#FFF1E6 100%)", desc: "Track appointments, medical history, prescriptions, and doctor communications — all in one secure, beautifully designed hub." },
];

const USE_CASES = [
  {
    title: "Quick Consultation for Minor Ailments",
    desc:  "Use our AI symptom analyzer, connect with a general physician via telemedicine, and get expert advice without leaving home.",
    scenario: "A busy professional needs quick advice for a recurring headache.",
    benefit:  "Saves travel time, provides rapid access to medical guidance.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
    orb: ORBS.violet,
  },
  {
    title: "Finding the Right Specialist",
    desc:  "Our AI guides you to the appropriate specialist and helps you book an informed, targeted consultation the first time.",
    scenario: "A patient has persistent joint pain but isn't sure whether to see a rheumatologist or orthopedist.",
    benefit:  "Reduces misdirected consultations, accelerates path to correct diagnosis.",
    image: "https://images.unsplash.com/photo-1584515933487-750f40589918?auto=format&fit=crop&w=1400&q=80",
    orb: ORBS.sky,
  },
  {
    title: "Convenient Follow-Up Appointments",
    desc:  "Schedule a digital consultation for a quick check-in, discuss lab results, or adjust medication with your doctor.",
    scenario: "A patient recovering from surgery needs a routine follow-up but lives far from the hospital.",
    benefit:  "Improves continuity of care, reduces travel burden for patients.",
    image: "https://images.unsplash.com/photo-1622227945605-b54ca7968097?auto=format&fit=crop&w=1400&q=80",
    orb: ORBS.sun,
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.26em" }}>
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

// ─── SIMPLE 2D REVEAL CARD ───────────────────────────────────────────────────
// Fades and slides up once as it enters the viewport, lifts slightly on hover.
// Only transform + opacity are animated, so it stays smooth.
const RevealCard = ({ className, children }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.3, ease: EASE } }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

// ─── FEATURE CARD (product-UI card, not icon + text) ─────────────────────────
const FeatureCard = ({ f, i, total }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.white, border: `1px solid ${T.line}`, borderRadius: 28, boxShadow: "0 30px 80px rgba(12,10,9,0.10), 0 2px 0 rgba(255,255,255,0.9) inset", overflow: "hidden" }}>
    <div style={{ position: "relative", flex: 1, minHeight: 0, margin: 10, borderRadius: 20, overflow: "hidden", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: -70, right: -50, width: 240, height: 240, borderRadius: "50%", background: f.orb, opacity: 0.55, filter: "blur(30px)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -50, width: 170, height: 170, borderRadius: "50%", background: ORBS.sun, opacity: 0.18, filter: "blur(30px)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <f.Visual />
      </div>
    </div>
    <div style={{ padding: "8px 26px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: T.muted, fontVariantNumeric: "tabular-nums" }}>0{i + 1} — 0{total}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 500, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 20, padding: "3px 10px" }}>
          <Icon d={f.icon} size={12} color={T.ink} /> {f.tag}
        </span>
      </div>
      <h3 style={{ fontSize: 24, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 8 }}>{f.title}</h3>
      <p style={{ fontSize: 14, color: T.body, lineHeight: 1.65 }}>{f.desc}</p>
    </div>
  </div>
);

const FeatureSide = () => (
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
    <Pill>Core Capabilities</Pill>
    <WordReveal
      text={"How CuraLink Empowers\nYour Health Journey"}
      style={{ fontSize: "clamp(28px, 3.8vw, 44px)", fontWeight: 300, color: T.ink, lineHeight: 1.12, letterSpacing: "-0.035em", marginBottom: 16 }}
    />
    <motion.p className="hide-sm" variants={fadeUp} style={{ fontSize: 15, color: T.body, maxWidth: 440, lineHeight: 1.7 }}>
      A suite of integrated tools designed to simplify access to quality healthcare — from intelligent guidance to seamless consultations.
    </motion.p>
    <motion.ul className="hide-sm" variants={fadeUp} style={{ listStyle: "none", margin: "32px 0 0", padding: 0 }}>
      {FEATURES.map((f, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", color: T.muted }}>
          <span style={{ width: 22, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>0{i + 1}</span>
          <span style={{ width: 10, height: 1, background: "currentColor", display: "block" }} />
          <span style={{ fontSize: 15, letterSpacing: "-0.01em" }}>{f.title}</span>
        </li>
      ))}
    </motion.ul>
  </motion.div>
);

// ─── USE CASE CARD (cinematic, layered, CSS hover zoom) ──────────────────────
const CaseCard = ({ uc, i }) => (
  <div className="case-card" style={{ position: "relative", height: "100%", borderRadius: 32, overflow: "hidden", background: T.ink, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.18)" }}>
    <img className="case-img" src={uc.image} alt={uc.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,10,9,0.28) 0%, rgba(12,10,9,0.10) 32%, rgba(12,10,9,0.88) 100%)" }} />
    <div style={{ position: "absolute", top: -90, right: -60, width: 260, height: 260, borderRadius: "50%", background: uc.orb, opacity: 0.45, filter: "blur(36px)", mixBlendMode: "screen" }} />

    <div style={{ position: "relative", zIndex: 1, height: "100%", padding: "clamp(18px, 3vw, 30px)", display: "flex", flexDirection: "column" }}>
      <span style={{ ...darkGlass, alignSelf: "flex-start", color: "#fff", fontSize: 12, fontWeight: 500, padding: "5px 13px", borderRadius: 999 }}>Scenario 0{i + 1}</span>

      <div className="case-grid" style={{ marginTop: "auto" }}>
        <div>
          <h3 style={{ fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 300, color: "#fff", lineHeight: 1.12, letterSpacing: "-0.035em", marginBottom: 12 }}>{uc.title}</h3>
          <p className="hide-sm" style={{ fontSize: 14.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 440 }}>{uc.desc}</p>
        </div>

        {/* Story bubble + outcome, layered above the photo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ ...darkGlass, borderRadius: "22px 22px 22px 6px", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <OrbDot size={22} bg={uc.orb} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Patient story</span>
            </div>
            <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.55 }}>{uc.scenario}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.94)", borderRadius: 999, padding: "10px 16px 10px 10px", display: "flex", alignItems: "center", gap: 10, marginLeft: 22, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={ICONS.check} size={12} color="#fff" />
            </div>
            <span style={{ fontSize: 13, color: T.ink, lineHeight: 1.4, letterSpacing: "-0.005em" }}>{uc.benefit}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CaseSide = () => (
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
    <Pill>Real-World Scenarios</Pill>
    <WordReveal
      text="See CuraLink in Action"
      style={{ fontSize: "clamp(28px, 3.8vw, 44px)", fontWeight: 300, color: T.ink, lineHeight: 1.1, letterSpacing: "-0.035em" }}
    />
  </motion.div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const FeaturesSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      .feat-root { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:${T.white}; color:${T.body}; -webkit-font-smoothing:antialiased; position:relative; z-index:0; isolation:isolate; overflow:clip; padding:clamp(90px,14vh,140px) 24px clamp(120px,18vh,200px); margin-bottom:clamp(24px,4vh,48px); }
      .wrap        { max-width:1200px; margin:0 auto; position:relative; z-index:1; }
      .deck-grid   { display:grid; grid-template-columns:var(--cols); gap:56px; align-items:start; }
      .sticky-side { position:sticky; top:110px; }
      .stack       { display:flex; flex-direction:column; gap:28px; }
      .box-feature { height:clamp(430px, 62vh, 520px); }
      .box-case    { height:clamp(440px, 60vh, 540px); }
      .case-grid   { display:grid; grid-template-columns:1.1fr 0.9fr; gap:28px; align-items:end; }
      .case-img    { transition:transform 1.2s cubic-bezier(.22,1,.36,1); }
      .case-card:hover .case-img { transform:scale(1.05); }

      @media (max-width: 900px) {
        .deck-grid { grid-template-columns:1fr !important; gap:28px; }
        .sticky-side { position:static; }
        .case-grid { grid-template-columns:1fr; gap:16px; }
        .hide-sm { display:none !important; }
        .box-case { height:min(540px, 72vh); }
      }
    `}</style>

    <div className="feat-root">
      {/* Static ambient orbs (no scroll parallax = no lag) */}
      <div style={{ position: "absolute", top: "8%", right: -120, width: 440, height: 440, borderRadius: "50%", background: ORBS.violet, opacity: 0.26, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: -100, width: 400, height: 400, borderRadius: "50%", background: ORBS.sky, opacity: 0.24, filter: "blur(55px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", right: -80, width: 360, height: 360, borderRadius: "50%", background: ORBS.sun, opacity: 0.2, filter: "blur(50px)", pointerEvents: "none" }} />

      <div className="wrap">
        {/* 1. FEATURES: sticky heading on the left, cards reveal on the right */}
        <div className="deck-grid" style={{ "--cols": "0.85fr 1.15fr" }}>
          <div className="sticky-side"><FeatureSide /></div>
          <div className="stack">
            {FEATURES.map((f, i) => (
              <RevealCard key={i} className="box-feature">
                <FeatureCard f={f} i={i} total={FEATURES.length} />
              </RevealCard>
            ))}
          </div>
        </div>

        {/* Gap between the two sections */}
        <div aria-hidden style={{ height: "clamp(100px, 18vh, 200px)" }} />

        {/* 2. REAL-WORLD USE CASES */}
        <div style={{ marginBottom: 40 }}><CaseSide /></div>
        <div className="stack">
          {USE_CASES.map((uc, i) => (
            <RevealCard key={i} className="box-case">
              <CaseCard uc={uc} i={i} />
            </RevealCard>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default FeaturesSection;