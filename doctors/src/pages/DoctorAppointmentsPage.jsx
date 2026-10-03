import React, { useState, useContext, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to HowItWorksPage, FAQ, dashboard, navbars) ─── */
const T = {
    ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
    surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];
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
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
    building: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    chevronL: "M15 18l-6-6 6-6",
    chevronR: "m9 18 6-6-6-6",
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
    doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
    empty: ["M9 13h6m-3-3v6m-9 1V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
};

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const getISODate = (d) => d.toISOString().split("T")[0];

const formatDisplayDate = (dateStr) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

const isToday = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "ap-g" }) => {
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
                    className={reduce ? undefined : "ap-node"} style={{ animationDelay: `${n.d}s` }} />
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

/* ─── STATUS BADGE ──────────────────────────────────────────────────────── */
const STATUS = {
    upcoming: { label: "Upcoming", dot: "#FFB36B" },
    completed: { label: "Completed", dot: "#5FD0A5" },
    cancelled: { label: "Cancelled", dot: "#F6A5D8" },
    "checked-in": { label: "Checked in", dot: "#7C8CFF" },
    no_show: { label: "No show", dot: "#C9B8FF" },
};
const StatusBadge = ({ status }) => {
    const s = STATUS[status?.toLowerCase()] || { label: status, dot: T.muted };
    return (
        <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 500, color: T.ink, padding: "4px 12px 4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />{s.label}
        </span>
    );
};

/* ─── TAB BUTTON ────────────────────────────────────────────────────────── */
const TabBtn = ({ label, active, onClick }) => (
    <button className="ap-tab" data-on={active} onClick={onClick} aria-pressed={active}>{label}</button>
);

/* ─── APPOINTMENT CARD ──────────────────────────────────────────────────── */
const AppointmentCard = ({ apt, index }) => {
    const digital = apt.type === "DIGITAL";
    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.6, ease: EASE }} className="ap-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <IconTile d={digital ? ICONS.video : ICONS.building} dark={apt.status === "upcoming"} />
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 19, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{apt.patientName}</p>
                        <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>ID: {apt.id}</p>
                    </div>
                </div>
                <StatusBadge status={apt.status} />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon d={ICONS.clock} size={15} color={T.muted} />
                    <span style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{apt.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon d={digital ? ICONS.video : ICONS.building} size={15} color={T.muted} />
                    <span style={{ fontSize: 14, color: T.body }}>{digital ? "Video consultation" : "In-person visit"}</span>
                </div>
            </div>

            {apt.notesPreview && (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: T.surface2, border: `1px solid ${T.line}`, borderRadius: 18, padding: "12px 16px", marginTop: 16 }}>
                    <Icon d={ICONS.doc} size={15} color={T.muted} style={{ marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 13.5, color: T.body, lineHeight: 1.6 }}>{apt.notesPreview}</p>
                </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.line}` }}>
                {digital && apt.status === "upcoming" && (
                    <Link to={`/doctor/start-call/${apt.id}`} className="ap-btn-ink">
                        <Icon d={ICONS.video} size={14} color="white" /> Start call
                    </Link>
                )}
                <Link to={`/doctor/appointment/${apt.id}`} className="ap-btn-outline">
                    <Icon d={ICONS.doc} size={14} color={T.ink} /> View details
                </Link>
                {apt.status === "upcoming" && (
                    <Link to={`/doctor/patient/${apt.id}/record`} className="ap-btn-outline">
                        <Icon d={ICONS.user} size={14} color={T.ink} /> Patient record
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

/* ─── EMPTY STATE ───────────────────────────────────────────────────────── */
const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="ap-card" style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><IconTile d={ICONS.empty} /></div>
        <p style={{ fontSize: 24, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em", marginBottom: 8 }}>No appointments found</p>
        <p style={{ fontSize: 14.5, color: T.body }}>No appointments match your current filters.</p>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorAppointmentsPage = () => {
    const reduce = useReducedMotion();
    const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
    const [activeTab, setActiveTab] = useState("ALL");
    const [filterType, setFilterType] = useState("all");
    const [appointments, setAppointments] = useState([]);
    const { token, settoken } = useContext(AuthContext);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.post(`${server}/api/doctors/gettodayAppointment`,
                    { dateISO: selectedDate + "T00:00:00.000+00:00" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(res);
                if (res.data.success) {
                    setAppointments(res.data.DayAppointment.map((el) => ({
                        id: el._id, patientName: el.patientName, time: el.time.start,
                        date: el.date, type: el.consultationType, status: el.status,
                        notesPreview: el.notes, clinicName: el.clinicId,
                    })));
                }
            } catch (e) { console.error(e); }
        };
        fetchAppointments();
        setActiveTab("ALL");
    }, [selectedDate]);

    const handleDateOffset = (offset) => {
        const d = new Date(selectedDate + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + offset);
        setSelectedDate(d.toISOString().split("T")[0]);
    };

    const today = isToday(selectedDate);

    const filtered = appointments.filter((apt) => {
        const tabMatch = activeTab === "ALL" || (activeTab === "upcoming" ? apt.status === "upcoming" : ["completed", "cancelled", "no_show"].includes(apt.status));
        const typeMatch = filterType === "all" || apt.type === filterType;
        return tabMatch && typeMatch;
    });

    const counts = {
        ALL: appointments.length,
        upcoming: appointments.filter((a) => a.status === "upcoming").length,
        past: appointments.filter((a) => ["completed", "cancelled", "no_show"].includes(a.status)).length,
    };

    const stats = [
        { label: "Total today", value: counts.ALL, dot: "#7C8CFF" },
        { label: "Upcoming", value: counts.upcoming, dot: "#FFB36B" },
        { label: "Completed", value: counts.past, dot: "#5FD0A5" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .ap-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .ap-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .ap-root ::selection{background:${T.ink};color:#fff}
        .ap-root a{text-decoration:none}

        .ap-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .ap-stat{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:22px;padding:18px 20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}

        .ap-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:26px;box-shadow:0 18px 50px rgba(12,10,9,.04);transition:box-shadow .3s,border-color .3s,background .3s,transform .3s}
        .ap-card:hover{border-color:#D6D3D1;background:rgba(255,255,255,.95);box-shadow:0 30px 80px rgba(12,10,9,.08)}

        .ap-bar{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:14px 18px;box-shadow:0 18px 50px rgba(12,10,9,.04);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px}
        .ap-nav{width:42px;height:42px;border-radius:50%;border:1px solid ${T.line};background:rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}
        .ap-nav:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .ap-input{padding:10px 16px;border:1px solid ${T.line};border-radius:999px;font-size:13.5px;font-weight:500;color:${T.ink};background:${T.surface2};outline:0;cursor:pointer;font-family:inherit;transition:border-color .2s,background .2s}
        .ap-input:focus{border-color:${T.ink};background:#fff}

        .ap-tabs{display:flex;gap:2px;background:${T.surface};border:1px solid ${T.line};border-radius:999px;padding:4px}
        .ap-tab{padding:8px 18px;border-radius:999px;border:0;background:transparent;color:${T.body};font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;transition:background .25s,color .25s,box-shadow .25s}
        .ap-tab:hover{color:${T.ink}}
        .ap-tab[data-on="true"]{background:${T.ink};color:#fff;box-shadow:0 8px 20px rgba(12,10,9,.2)}

        .ap-btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:13.5px;padding:11px 22px;border-radius:999px;transition:box-shadow .25s,transform .25s}
        .ap-btn-ink:hover{box-shadow:0 12px 30px rgba(12,10,9,.25);transform:translateY(-1px)}
        .ap-btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);color:${T.ink};font-weight:500;font-size:13.5px;padding:10px 20px;border-radius:999px;border:1px solid ${T.line};transition:background .25s,border-color .25s,transform .25s}
        .ap-btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .ap-btn-ink svg:last-child{transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .ap-root a:focus-visible,.ap-root button:focus-visible,.ap-root select:focus-visible,.ap-root input:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes ap-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .ap-node{transform-box:fill-box;transform-origin:center;animation:ap-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.ap-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:640px){.ap-stats{grid-template-columns:1fr}.ap-card{padding:20px}.ap-bar{border-radius:24px}}
        @media (prefers-reduced-motion:reduce){.ap-node{animation:none}.ap-card,.ap-btn-ink,.ap-btn-outline,.ap-nav,.ap-tab{transition:none}}
      `}</style>

            <div className="ap-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="ap-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="ap-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 40% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
                            <div>
                                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                        <span style={{ position: "relative", width: 26, height: 26 }}>
                                            <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                            <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon d={ICONS.sparkle} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Appointment manager</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Manage your\nappointments."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    View your schedule, manage bookings and prepare for consultations.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp}>
                                <Link to="/doctor/availability" className="ap-btn-ink" style={{ padding: "14px 28px", fontSize: 14 }}>
                                    <Icon d={ICONS.calendar} size={15} color="white" /> Set availability <Icon d={ICONS.arrow} size={15} color="white" />
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div variants={stagger} className="ap-stats">
                            {stats.map((s) => (
                                <motion.div key={s.label} variants={fadeUp} className="ap-stat">
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot }} />
                                        <p style={{ fontSize: 12.5, color: T.muted }}>{s.label}</p>
                                    </div>
                                    <p style={{ fontSize: 34, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em" }}>{s.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── FILTERS + LIST ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>

                        {/* Filter bar */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE }} className="ap-bar" style={{ marginBottom: 36 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button className="ap-nav" onClick={() => handleDateOffset(-1)} aria-label="Previous day">
                                    <Icon d={ICONS.chevronL} size={16} color={T.ink} />
                                </button>
                                <input className="ap-input" type="date" value={selectedDate} aria-label="Pick a date"
                                    onChange={(e) => { setSelectedDate(e.target.value); setActiveTab("ALL"); }} />
                                <button className="ap-nav" onClick={() => handleDateOffset(+1)} aria-label="Next day">
                                    <Icon d={ICONS.chevronR} size={16} color={T.ink} />
                                </button>
                            </div>

                            {/* Tabs — only show upcoming/past on today */}
                            <div className="ap-tabs">
                                {(today ? ["ALL", "upcoming", "past"] : ["ALL"]).map((tab) => (
                                    <TabBtn key={tab}
                                        label={tab === "ALL" ? `All (${counts.ALL})` : tab === "upcoming" ? `Upcoming (${counts.upcoming})` : `Past (${counts.past})`}
                                        active={activeTab === tab} onClick={() => setActiveTab(tab)} />
                                ))}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Icon d={ICONS.filter} size={16} color={T.muted} />
                                <select className="ap-input" value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label="Filter by consultation type">
                                    <option value="all">All types</option>
                                    <option value="PHYSICAL">In-person</option>
                                    <option value="DIGITAL">Digital</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Date heading */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                            <IconTile d={ICONS.calendar} size={44} />
                            <div>
                                <p style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{today ? "Today" : "Selected date"}</p>
                                <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>{formatDisplayDate(selectedDate)}</p>
                            </div>
                        </motion.div>

                        {/* Cards */}
                        <AnimatePresence mode="wait">
                            {filtered.length > 0 ? (
                                <motion.div key={activeTab + selectedDate + filterType}
                                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {filtered.map((apt, i) => <AppointmentCard key={apt.id} apt={apt} index={i} />)}
                                </motion.div>
                            ) : (
                                <EmptyState key="empty" />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DoctorAppointmentsPage;