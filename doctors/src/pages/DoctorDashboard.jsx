import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to HowItWorksPage, FAQ, hero, footer, navbar) ─── */
const T = {
    ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
    surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];
const ORBS = {
    violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
    sun: "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
    sky: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
    mint: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};
const GLASS = { background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${T.line}` };

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
    users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
    settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    sun: ["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"],
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    steth: ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
    pulse: "M22 12h-4l-3 9L9 3l-3 9H2",
    queue: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
    building: ["M6 22V2l6 2 6-2v20", "M6 12h6", "M12 12h6"],
    lock: ["M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: "Good morning", icon: ICONS.sun };
    if (h < 17) return { text: "Good afternoon", icon: ICONS.sun };
    return { text: "Good evening", icon: ICONS.moon };
};

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const quickLinks = [
    { title: "My Schedule", description: "View today's appointments, manage your calendar and set availability slots.", icon: ICONS.calendar, link: "/doctor/appointments", bead: ORBS.violet, tag: "Schedule" },
    { title: "Patient Queue", description: "Monitor live queue status, call next patient, and manage walk-ins.", icon: ICONS.queue, link: "/doctor/queue-management", bead: ORBS.sky, tag: "Live queue" },
    { title: "Teleconsultation", description: "Start or join a secure video consultation with your patient now.", icon: ICONS.video, link: "/doctor/teleconsult", bead: ORBS.mint, tag: "Digital" },
    { title: "Patient Data Access", description: "Request secure access to patient health records for better diagnosis and AI-powered insights. Supports individual and today's appointments.", icon: ICONS.lock, link: "/doctor/permissions", bead: ORBS.violet, tag: "Permissions" },
    { title: "Set Availability", description: "Define your consultation hours, breaks and holiday schedule.", icon: ICONS.settings, link: "/doctor/availability", bead: ORBS.sun, tag: "Availability" },
    { title: "All Patients", description: "Browse your full patient roster, medical records and history.", icon: ICONS.users, link: "/doctor/patients", bead: ORBS.sky, tag: "Records" },
];

const MOCK_APPOINTMENTS = [
    { id: "apt001", patientName: "Rohan Patel", time: "10:30 AM", type: "DIGITAL", status: "upcoming" },
    { id: "apt002", patientName: "Priya Kumari", time: "11:00 AM", type: "PHYSICAL", status: "checked-in" },
    { id: "apt003", patientName: "Amit Singh", time: "11:30 AM", type: "PHYSICAL", status: "upcoming" },
    { id: "apt004", patientName: "Sunita Rao", time: "12:00 PM", type: "DIGITAL", status: "completed" },
];

const QUEUE = { currentServing: "A005", patientsWaiting: 7, avgWaitTime: "15 min" };

/* ─── VARIANTS / SHARED PIECES ──────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const wordChild = { hidden: { y: "115%", rotate: 4 }, visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } } };
const H = { fontWeight: 300, color: T.ink, lineHeight: 1.06, letterSpacing: "-0.04em" };

const Aura = ({ blobs }) => (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {blobs.map((b, i) => (
            <div key={i} style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", width: b.s, height: b.s, background: b.c, opacity: b.o ?? 0.4, top: b.t, left: b.l, right: b.r, bottom: b.b }} />
        ))}
    </div>
);

const Bead = ({ bg, size = 14 }) => (
    <span style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0, boxShadow: "0 0 14px rgba(124,140,255,0.35)", display: "inline-block" }}>
        <span style={{ position: "absolute", top: "18%", left: "22%", width: "30%", height: "30%", borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} />
    </span>
);

const NeuralArt = ({ reduce, count = 46, style = {}, id = "dd-g" }) => {
    const { nodes, edges } = useMemo(() => {
        let s = 7;
        const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
        const nodes = [];
        while (nodes.length < count) {
            const x = rnd() * 2 - 1, y = rnd() * 2 - 1;
            if (x * x + (y * y) / 0.62 > 1) continue;
            if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 0.028)) continue;
            nodes.push({ x, y, r: 2.2 + rnd() * 3, d: rnd() * 5, h: rnd() });
        }
        const edges = [];
        nodes.forEach((a, i) => nodes.forEach((b, j) => {
            if (j > i && (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < 0.13) edges.push([a, b]);
        }));
        return { nodes, edges };
    }, [count]);
    const P = ["#7C8CFF", "#C9B8FF", "#F6A5D8", "#A5D8FF", "#FFB36B"];
    return (
        <svg viewBox="-1.1 -0.85 2.2 1.7" aria-hidden style={{ overflow: "visible", ...style }}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#7C8CFF" /><stop offset="1" stopColor="#F6A5D8" />
                </linearGradient>
            </defs>
            {edges.map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`url(#${id})`} strokeWidth="0.004" opacity="0.6" />)}
            {nodes.map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y} r={n.r / 260} fill={P[(n.h * P.length) | 0]}
                    className={reduce ? undefined : "dd-node"} style={{ animationDelay: `${n.d}s` }} />
            ))}
        </svg>
    );
};

const Section = ({ children, style = {}, ...rest }) => (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger} style={{ position: "relative", ...style }} {...rest}>
        {children}
    </motion.section>
);

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
    const Tag = motion[as];
    return (
        <Tag variants={wordParent} style={style} {...rest}>
            {text.split("\n").map((line, li, arr) => (
                <React.Fragment key={li}>
                    {line.split(" ").map((w, i) => (
                        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.24em" }}>
                            <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
                        </span>
                    ))}
                    {li < arr.length - 1 && <br />}
                </React.Fragment>
            ))}
        </Tag>
    );
};

const IconTile = ({ d, size = 48, dark = false }) => (
    <div style={{ width: size, height: size, borderRadius: 14, background: dark ? T.ink : T.surface, border: `1px solid ${dark ? T.ink : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={d} size={size > 40 ? 22 : 15} color={dark ? "#fff" : T.ink} />
    </div>
);

const SectionHead = ({ icon, title, sub, right }) => (
    <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <IconTile d={icon} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{title}</p>
            {sub && <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>{sub}</p>}
        </div>
        {right}
    </motion.div>
);

/* ─── STATUS BADGE ──────────────────────────────────────────────────────── */
const STATUS = {
    upcoming: { label: "Upcoming", dot: "#FFB36B" },
    completed: { label: "Completed", dot: "#5FD0A5" },
    cancelled: { label: "Cancelled", dot: "#F6A5D8" },
    "checked-in": { label: "Checked in", dot: "#7C8CFF" },
};
const StatusBadge = ({ status }) => {
    const s = STATUS[status?.toLowerCase()] || { label: status, dot: T.muted };
    return (
        <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 500, color: T.ink, padding: "4px 12px 4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />{s.label}
        </span>
    );
};

/* ─── QUICK ACTION CARD ─────────────────────────────────────────────────── */
const QuickCard = ({ item }) => (
    <motion.div variants={fadeUp} style={{ height: "100%" }}>
        <Link to={item.link} className="dd-card dd-quick">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <IconTile d={item.icon} />
                <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px 4px 10px", borderRadius: 20 }}>
                    <Bead bg={item.bead} size={12} />{item.tag}
                </span>
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", marginBottom: 8 }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7, flex: 1 }}>{item.description}</p>
            <span className="dd-go">Open <Icon d={item.arrow || ICONS.arrow} size={14} color={T.ink} /></span>
        </Link>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorDashboard = () => {
    const reduce = useReducedMotion();
    const [time, setTime] = useState(new Date());
    const { logout, doctor } = useContext(AuthContext) || {};
    const doctorName = doctor?.name || "Doctor";

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const dateStr = time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
    const greeting = getGreeting();

    const stats = [
        { label: "Today's appointments", value: "15", icon: ICONS.calendar },
        { label: "Digital consults", value: "6", icon: ICONS.video },
        { label: "Patients waiting", value: String(QUEUE.patientsWaiting), icon: ICONS.queue },
        { label: "Avg. wait time", value: QUEUE.avgWaitTime, icon: ICONS.clock },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dd-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .dd-root *{box-sizing:border-box;margin:0;padding:0}
        .dd-root ::selection{background:${T.ink};color:#fff}
        .dd-root a{text-decoration:none;color:inherit}

        .dd-card{position:relative;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border-radius:28px;border:1px solid ${T.line};box-shadow:0 18px 50px rgba(12,10,9,.04);transition:box-shadow .3s,border-color .3s,background .3s,transform .3s}
        .dd-quick{display:flex;flex-direction:column;height:100%;padding:26px}
        .dd-quick:hover{border-color:#D6D3D1;background:rgba(255,255,255,.95);box-shadow:0 30px 80px rgba(12,10,9,.09);transform:translateY(-4px)}
        .dd-go{display:inline-flex;align-items:center;gap:8px;margin-top:20px;font-size:13px;font-weight:500;color:${T.ink}}
        .dd-go svg{transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .dd-quick:hover .dd-go svg{transform:translateX(4px)}

        .dd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
        .dd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .dd-bottom{display:grid;grid-template-columns:3fr 2fr;gap:24px;align-items:stretch}

        .dd-apt{display:flex;align-items:center;gap:14px;padding:12px;border-radius:18px;transition:background .2s}
        .dd-apt:hover{background:${T.surface}}
        .dd-link{font-size:13px;font-weight:500;color:${T.ink};display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;border:1px solid ${T.line};background:rgba(255,255,255,.85);transition:background .25s,border-color .25s}
        .dd-link:hover{background:#fff;border-color:#D6D3D1}
        .dd-root a:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes dd-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .dd-node{transform-box:fill-box;transform-origin:center;animation:dd-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){
          .dd-stats{grid-template-columns:1fr 1fr}
          .dd-bottom{grid-template-columns:1fr}
          .dd-neural{opacity:.3!important;width:100%!important}
        }
        @media (max-width:560px){.dd-grid{grid-template-columns:1fr}}
        @media (prefers-reduced-motion:reduce){.dd-node{animation:none}.dd-card,.dd-apt{transition:none}.dd-quick:hover{transform:none}}
      `}</style>

            <div className="dd-root">

                {/* ── HERO ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="dd-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="dd-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 40% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
                            <div>
                                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                        <span style={{ position: "relative", width: 26, height: 26 }}>
                                            <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                            <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon d={greeting.icon} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>{greeting.text}</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={doctorName} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7 }}>Your practice dashboard is ready.</motion.p>
                            </div>

                            {/* Live clock */}
                            <motion.div variants={fadeUp} style={{ ...GLASS, borderRadius: 24, padding: "18px 28px", textAlign: "center", boxShadow: "0 18px 50px rgba(12,10,9,.04)" }}>
                                <p style={{ fontSize: 12.5, color: T.muted, fontWeight: 500 }}>{dateStr}</p>
                                <p style={{ fontSize: 34, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em", marginTop: 2 }}>{timeStr}</p>
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <motion.div variants={stagger} className="dd-stats">
                            {stats.map((s) => (
                                <motion.div key={s.label} variants={fadeUp} className="dd-card" style={{ borderRadius: 22, padding: "18px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <Icon d={s.icon} size={14} color={T.muted} />
                                        <p style={{ fontSize: 12.5, color: T.muted }}>{s.label}</p>
                                    </div>
                                    <p style={{ fontSize: 34, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em" }}>{s.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── QUICK ACCESS ── */}
                <div style={{ position: "relative", padding: "90px 24px 40px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "8%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "52%", l: "-12%", o: 0.28 },
                    ]} />
                    <Section style={{ zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
                        <SectionHead icon={ICONS.sparkle} title="Quick access" sub="Everything you need, one tap away" />
                        <motion.div variants={stagger} className="dd-grid">
                            {quickLinks.map((item) => <QuickCard key={item.title} item={item} />)}
                        </motion.div>
                    </Section>
                </div>

                {/* ── BOTTOM ROW ── */}
                <div style={{ position: "relative", padding: "40px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[{ c: "#FFD9B8", s: 420, b: "0%", r: "-8%", o: 0.34 }]} />
                    <Section style={{ zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
                        <div className="dd-bottom">

                            {/* Today's appointments */}
                            <motion.div variants={fadeUp} className="dd-card" style={{ padding: "26px 18px 14px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 8px", marginBottom: 14 }}>
                                    <IconTile d={ICONS.pulse} size={44} />
                                    <p style={{ flex: 1, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>Today's appointments</p>
                                    <Link to="/doctor/appointments" className="dd-link">View all <Icon d={ICONS.arrow} size={13} color={T.ink} /></Link>
                                </div>
                                <div>
                                    {MOCK_APPOINTMENTS.map((apt, i) => (
                                        <div key={apt.id}>
                                            <Link to={`/doctor/appointment/${apt.id}`} className="dd-apt">
                                                <IconTile d={apt.type === "DIGITAL" ? ICONS.video : ICONS.building} size={38} dark={apt.status === "checked-in"} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 14.5, color: T.ink, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{apt.patientName}</p>
                                                    <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{apt.time} · {apt.type === "DIGITAL" ? "Video call" : "In-person"}</p>
                                                </div>
                                                <StatusBadge status={apt.status} />
                                            </Link>
                                            {i < MOCK_APPOINTMENTS.length - 1 && <div style={{ height: 1, background: T.line, margin: "0 12px" }} />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Clinical insight */}
                            <motion.div variants={fadeUp} style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.08)", padding: "30px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260, background: `radial-gradient(ellipse 70% 70% at 60% 30%, rgba(201,184,255,0.5), rgba(165,216,255,0.22) 60%, rgba(255,255,255,0) 85%), radial-gradient(ellipse 50% 50% at 10% 100%, rgba(255,217,184,0.5), rgba(255,255,255,0) 70%), ${T.white}` }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                                        <IconTile d={ICONS.steth} dark />
                                        <span style={{ ...GLASS, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px", borderRadius: 20 }}>Clinical insight</span>
                                    </div>
                                    <p style={{ fontSize: "clamp(17px,2vw,20px)", fontWeight: 300, color: T.ink, lineHeight: 1.5, letterSpacing: "-0.02em" }}>
                                        Patients who receive appointment reminders show a 34% reduction in no-shows. Your digital consults are up 18% this week — great momentum.
                                    </p>
                                </div>
                                <div style={{ marginTop: 22, borderTop: `1px solid ${T.line}`, paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                                    <Bead bg={ORBS.violet} size={14} />
                                    <span style={{ fontSize: 13, color: T.body }}>Excellence in care starts with preparation.</span>
                                </div>
                            </motion.div>

                        </div>
                    </Section>
                </div>

            </div>
        </>
    );
};

export default DoctorDashboard;