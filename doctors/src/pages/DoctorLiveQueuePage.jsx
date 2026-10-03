import React, { useState, useContext, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to HowItWorksPage, FAQ, dashboard, navbars) ─── */
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
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    x: ["M18 6 6 18", "m6 6 12 12"],
    search: ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
    pulse: "M22 12h-4l-3 9L9 3l-3 9H2",
    refresh: ["M23 4v6h-6", "M20.49 15a9 9 0 1 1-2.12-9.36L23 10"],
};

/* ─── SECTION CONFIG (keys, labels and statuses unchanged) ──────────────── */
const SECTIONS = [
    { key: "upcoming", label: "Upcoming", dot: "#7C8CFF", bead: ORBS.violet },
    { key: "no_show", label: "On Hold", dot: "#FFB36B", bead: ORBS.sun },
    { key: "completed", label: "Completed", dot: "#5FD0A5", bead: ORBS.mint },
    { key: "cancelled", label: "Cancelled", dot: "#F6A5D8", bead: ORBS.sky },
];

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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "lq-g" }) => {
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
                    className={reduce ? undefined : "lq-node"} style={{ animationDelay: `${n.d}s` }} />
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

/* ─── AVATAR ────────────────────────────────────────────────────────────── */
const Avatar = ({ name, dark = false }) => {
    const initials = name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";
    return (
        <div style={{ width: 40, height: 40, borderRadius: 14, background: dark ? T.ink : T.surface, border: `1px solid ${dark ? T.ink : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5, fontWeight: 500, color: dark ? "#fff" : T.ink, flexShrink: 0 }}>
            {initials}
        </div>
    );
};

/* ─── ACTION BUTTON ─────────────────────────────────────────────────────── */
const ActionBtn = ({ icon, title, onClick, tone = "light" }) => (
    <button className={`lq-act lq-act-${tone}`} onClick={onClick} title={title} aria-label={title}>
        <Icon d={icon} size={14} color={tone === "ink" ? "#fff" : T.ink} />
    </button>
);

/* ─── PATIENT CARD ──────────────────────────────────────────────────────── */
const PatientCard = ({ appt, sec, onMark }) => (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }}
        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }} className="lq-patient">
        <Avatar name={appt.name} dark={appt.status === "completed"} />
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.name}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                <Icon d={ICONS.clock} size={12} color={T.muted} />
                <p style={{ fontSize: 12.5, color: T.muted }}>{appt.time}</p>
            </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
            {appt.status === "upcoming" && (
                <>
                    <ActionBtn icon={ICONS.check} title="Mark completed" tone="ink" onClick={() => onMark(appt.id, "completed")} />
                    <ActionBtn icon={ICONS.clock} title="Put on hold" onClick={() => onMark(appt.id, "no_show")} />
                    <ActionBtn icon={ICONS.x} title="Cancel" onClick={() => onMark(appt.id, "cancelled")} />
                </>
            )}
            {appt.status === "no_show" && (
                <ActionBtn icon={ICONS.check} title="Patient arrived — complete" tone="ink" onClick={() => onMark(appt.id, "completed")} />
            )}
        </div>
    </motion.div>
);

/* ─── COLUMN ────────────────────────────────────────────────────────────── */
const Column = ({ sec, appointments, onMark, index }) => {
    const [search, setSearch] = useState("");
    const filtered = appointments.filter((a) => a.status === sec.key && a.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: index * 0.08 }} className="lq-col">
            <div style={{ padding: "22px 20px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Bead bg={sec.bead} size={18} />
                        <span style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{sec.label}</span>
                    </div>
                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 500, color: T.ink, padding: "3px 12px 3px 9px", borderRadius: 20 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: sec.dot }} />{filtered.length}
                    </span>
                </div>

                <label className="lq-search">
                    <Icon d={ICONS.search} size={14} color={T.muted} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${sec.label.toLowerCase()}…`} aria-label={`Search ${sec.label.toLowerCase()} patients`} />
                </label>
            </div>

            <div className="lq-cards">
                <AnimatePresence>
                    {filtered.length > 0
                        ? filtered.map((a) => <PatientCard key={a.id} appt={a} sec={sec} onMark={onMark} />)
                        : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "36px 16px" }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                    <Icon d={ICONS.user} size={19} color={T.muted} />
                                </div>
                                <p style={{ fontSize: 13.5, color: T.muted }}>No patients here</p>
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorLiveQueuePage = () => {
    const { token } = useContext(AuthContext);
    const reduce = useReducedMotion();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const getISODate = (d) => d.toISOString().split("T")[0];

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const todayISO = getISODate(new Date()) + "T00:00:00.000+00:00";
            const response = await axios.post(
                `${server}/api/doctors/gettodayAppointment`,
                { dateISO: todayISO },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setAppointments(response.data.DayAppointment.map((el) => ({
                    id: el._id, name: el.patientName, time: el.time.start, status: el.status,
                })));
            }
        } catch (e) { console.error(e); }
        setLoading(false);
        setLastRefresh(new Date());
    };

    useEffect(() => { fetchAppointments(); }, []);

    const handleStatus = async (id, newstatus) => {
        try {
            await axios.post(`${server}/api/doctors/handleAppointment`, { id, newstatus }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (e) { console.error(e); }
    };

    const handleMark = async (id, newStatus) => {
        await handleStatus(id, newStatus);
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    };

    const counts = SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: appointments.filter((a) => a.status === s.key).length }), {});

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .lq-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .lq-root *{box-sizing:border-box;margin:0;padding:0}
        .lq-root ::selection{background:${T.ink};color:#fff}

        .lq-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .lq-stat{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:22px;padding:18px 20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .lq-board{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:start}

        .lq-col{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;box-shadow:0 18px 50px rgba(12,10,9,.04);display:flex;flex-direction:column;min-height:400px;overflow:hidden;transition:border-color .3s,box-shadow .3s}
        .lq-col:hover{border-color:#D6D3D1;box-shadow:0 30px 80px rgba(12,10,9,.07)}
        .lq-cards{padding:0 12px 14px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;max-height:55vh}

        .lq-search{display:flex;align-items:center;gap:8px;background:${T.surface};border:1px solid ${T.line};border-radius:999px;padding:9px 14px;transition:border-color .25s,background .25s;cursor:text}
        .lq-search:focus-within{background:#fff;border-color:${T.ink}}
        .lq-search input{background:transparent;border:0;outline:0;font-size:13px;color:${T.ink};width:100%;font-family:inherit}
        .lq-search input::placeholder{color:${T.muted}}

        .lq-patient{display:flex;align-items:center;gap:12px;padding:12px;background:#fff;border:1px solid ${T.line};border-radius:20px;transition:border-color .25s,box-shadow .25s}
        .lq-patient:hover{border-color:#D6D3D1;box-shadow:0 12px 30px rgba(12,10,9,.06)}

        .lq-act{width:32px;height:32px;border-radius:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit;transition:background .2s,border-color .2s,transform .2s}
        .lq-act-light{background:${T.surface};border:1px solid ${T.line}}
        .lq-act-light:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .lq-act-ink{background:${T.ink};border:1px solid ${T.ink}}
        .lq-act-ink:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(12,10,9,.25)}

        .lq-refresh{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:13px 24px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;transition:box-shadow .25s,transform .25s}
        .lq-refresh:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .lq-refresh:disabled{opacity:.6;cursor:default;transform:none;box-shadow:none}
        .lq-root button:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes lq-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .lq-node{transform-box:fill-box;transform-origin:center;animation:lq-pulse 4.5s ease-in-out infinite}

        @media (max-width:1100px){.lq-board{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:900px){.lq-stats{grid-template-columns:1fr 1fr}.lq-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:640px){.lq-board{grid-template-columns:1fr}.lq-cards{max-height:none}}
        @media (prefers-reduced-motion:reduce){.lq-node{animation:none}.lq-col,.lq-patient,.lq-act,.lq-refresh{transition:none}}
      `}</style>

            <div className="lq-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="lq-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="lq-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 40% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
                            <div>
                                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                        <span style={{ position: "relative", width: 26, height: 26 }}>
                                            <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                            <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon d={ICONS.pulse} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Live queue</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Patient queue\ntoday."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    Manage live patient flow, update statuses and track your day.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                                <button className="lq-refresh" onClick={fetchAppointments} disabled={loading}>
                                    <motion.span animate={loading && !reduce ? { rotate: 360 } : { rotate: 0 }}
                                        transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }} style={{ display: "flex" }}>
                                        <Icon d={ICONS.refresh} size={15} color="white" />
                                    </motion.span>
                                    Refresh
                                </button>
                                <p style={{ fontSize: 12.5, color: T.muted }}>
                                    Last updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                </p>
                            </motion.div>
                        </div>

                        <motion.div variants={stagger} className="lq-stats">
                            {SECTIONS.map((s) => (
                                <motion.div key={s.key} variants={fadeUp} className="lq-stat">
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot }} />
                                        <p style={{ fontSize: 12.5, color: T.muted }}>{s.label}</p>
                                    </div>
                                    <p style={{ fontSize: 34, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em" }}>{loading ? "—" : counts[s.key]}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── BOARD ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
                        {loading ? (
                            <div role="status" aria-label="Loading appointments" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16, height: 300 }}>
                                <motion.div animate={reduce ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${T.line}`, borderTopColor: T.ink }} />
                                <p style={{ fontSize: 13.5, color: T.muted }}>Loading today's queue…</p>
                            </div>
                        ) : (
                            <div className="lq-board">
                                {SECTIONS.map((sec, i) => (
                                    <Column key={sec.key} sec={sec} index={i} appointments={appointments} onMark={handleMark} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
};

export default DoctorLiveQueuePage;