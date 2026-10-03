import React, { useState, useMemo, useEffect, useContext } from "react";
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
const ORBS = [
    "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
    "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
];
const GLASS = { background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${T.line}` };

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    sort: ["M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"],
    plus: ["M12 5v14", "M5 12h14"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    empty: ["M12 4.354a4 4 0 1 1 0 5.292M15 21H3v-1a6 6 0 0 1 12 0v1zm0 0h6v-1a6 6 0 0 0-9-5.197M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"],
};

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const getInitials = (name = "") => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const orbFor = (name = "") => ORBS[name.charCodeAt(0) % ORBS.length];
const fmtDate = (v) => new Date(v + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "mp-g" }) => {
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
                    className={reduce ? undefined : "mp-node"} style={{ animationDelay: `${n.d}s` }} />
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

/* ─── PATIENT CARD ──────────────────────────────────────────────────────── */
const InfoRow = ({ label, value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <IconTile d={ICONS.calendar} size={32} />
        <div>
            <p style={{ fontSize: 12, color: T.muted }}>{label}</p>
            <p style={{ fontSize: 13.5, color: T.ink, fontWeight: 500 }}>{value}</p>
        </div>
    </div>
);

const PatientCard = ({ patient, index }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index, 12) * 0.05, duration: 0.65, ease: EASE }} className="mp-card">
        {patient.profilePic ? (
            <img src={patient.profilePic} alt={patient.name}
                style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", border: `1px solid ${T.line}`, marginBottom: 16 }} />
        ) : (
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 26, fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>{getInitials(patient.name)}</span>
            </div>
        )}

        <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", marginBottom: 4, textAlign: "center" }}>{patient.name}</h3>
        <span style={{ fontSize: 12.5, color: T.muted, marginBottom: 14 }}>ID: {patient._id?.slice(-8) || "N/A"}</span>

        <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px 4px 10px", borderRadius: 20, marginBottom: 20 }}>
            <Bead bg={orbFor(patient.name)} size={12} />{patient.primaryConcern || "General"}
        </span>

        <div style={{ width: "100%", borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, padding: "16px 0", marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <InfoRow label="Last visit" value={patient.lastVisit ? fmtDate(patient.lastVisit) : "N/A"} />
            <InfoRow label="Next appointment" value={patient.nextAppointment ? fmtDate(patient.nextAppointment) : "None scheduled"} />
        </div>

        <Link to={`/doctor/patient-record/${patient._id}`} className="mp-btn-ink" style={{ width: "100%", justifyContent: "center" }}>
            View full record <Icon d={ICONS.arrow} size={14} color="white" />
        </Link>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorMyPatientsPage = () => {
    const reduce = useReducedMotion();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name_asc");
    const [mockPatientsData, setMockPatientsData] = useState([]);
    const { token } = useContext(AuthContext);

    const GetAllPatientsData = async () => {
        try {
            const response = await axios.get(`${server}/api/doctors/get-patients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) setMockPatientsData(response.data.patient);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { GetAllPatientsData(); }, []);

    const filteredAndSortedPatients = useMemo(() => {
        let patients = mockPatientsData.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortBy === "name_asc") patients.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === "name_desc") patients.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortBy === "last_visit_desc") patients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
        else if (sortBy === "last_visit_asc") patients.sort((a, b) => new Date(a.lastVisit) - new Date(b.lastVisit));
        return patients;
    }, [searchTerm, sortBy, mockPatientsData]);

    const stats = [
        { label: "Total patients", value: mockPatientsData.length, dot: "#7C8CFF" },
        { label: "Search results", value: filteredAndSortedPatients.length, dot: "#5FD0A5" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .mp-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .mp-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .mp-root ::selection{background:${T.ink};color:#fff}
        .mp-root a{text-decoration:none}

        .mp-stats{display:grid;grid-template-columns:repeat(2,minmax(0,260px));gap:12px}
        .mp-stat{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:22px;padding:18px 20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}

        .mp-bar{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:14px 18px;box-shadow:0 18px 50px rgba(12,10,9,.04);display:flex;flex-wrap:wrap;gap:14px;align-items:center}
        .mp-search{position:relative;flex:1 1 280px}
        .mp-search svg{position:absolute;left:16px;top:50%;transform:translateY(-50%);pointer-events:none}
        .mp-input{width:100%;padding:12px 18px;border:1px solid ${T.line};border-radius:999px;font-size:14px;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .mp-search .mp-input{padding-left:44px}
        .mp-input::placeholder{color:${T.muted}}
        .mp-input:focus{border-color:${T.ink};background:#fff}
        select.mp-input{width:auto;cursor:pointer;font-weight:500}

        .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px}
        .mp-card{display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:30px 24px 24px;box-shadow:0 18px 50px rgba(12,10,9,.04);transition:box-shadow .3s,border-color .3s,background .3s,transform .3s}
        .mp-card:hover{border-color:#D6D3D1;background:rgba(255,255,255,.95);box-shadow:0 30px 80px rgba(12,10,9,.09);transform:translateY(-4px)}
        .mp-card > a{margin-top:auto}

        .mp-btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 28px;border-radius:999px;transition:box-shadow .25s,transform .25s}
        .mp-btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .mp-btn-ink svg:last-child{transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .mp-btn-ink:hover svg:last-child{transform:translateX(4px)}
        .mp-root a:focus-visible,.mp-root select:focus-visible,.mp-root input:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes mp-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .mp-node{transform-box:fill-box;transform-origin:center;animation:mp-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.mp-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:560px){.mp-stats{grid-template-columns:1fr 1fr}.mp-bar{border-radius:24px}.mp-grid{grid-template-columns:1fr}}
        @media (prefers-reduced-motion:reduce){.mp-node{animation:none}.mp-card,.mp-btn-ink{transition:none}.mp-card:hover{transform:none}}
      `}</style>

            <div className="mp-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="mp-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="mp-g1" style={{ width: "100%" }} />
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
                                                <Icon d={ICONS.sparkle} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Patient management</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"My patients."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    Your complete patient roster — records, history &amp; appointments.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp}>
                                <Link to="/doctor/add-patient" className="mp-btn-ink">
                                    <Icon d={ICONS.plus} size={16} color="white" /> Add new patient
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div variants={stagger} className="mp-stats">
                            {stats.map((s) => (
                                <motion.div key={s.label} variants={fadeUp} className="mp-stat">
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

                {/* ── SEARCH + GRID ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>

                        {/* Search & sort */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE }} className="mp-bar" style={{ marginBottom: 36 }}>
                            <div className="mp-search">
                                <Icon d={ICONS.search} size={16} color={T.muted} />
                                <input className="mp-input" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search patients by name…" aria-label="Search patients by name" />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                                <Icon d={ICONS.sort} size={16} color={T.muted} />
                                <span style={{ fontSize: 13.5, fontWeight: 500, color: T.body }}>Sort by</span>
                                <select className="mp-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort patients">
                                    <option value="name_asc">Name (A–Z)</option>
                                    <option value="name_desc">Name (Z–A)</option>
                                    <option value="last_visit_desc">Last visit (newest)</option>
                                    <option value="last_visit_asc">Last visit (oldest)</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Section label */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                            <IconTile d={ICONS.users} size={44} />
                            <div>
                                <p style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>Patient roster</p>
                                <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>
                                    {filteredAndSortedPatients.length} patient{filteredAndSortedPatients.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                        </motion.div>

                        {/* Grid */}
                        <AnimatePresence mode="wait">
                            {filteredAndSortedPatients.length > 0 ? (
                                <motion.div key={searchTerm + sortBy} className="mp-grid"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {filteredAndSortedPatients.map((patient, i) => (
                                        <PatientCard key={patient._id || i} patient={patient} index={i} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="mp-card" style={{ padding: "72px 32px", textAlign: "center" }}>
                                    <div style={{ marginBottom: 20 }}><IconTile d={ICONS.empty} /></div>
                                    <h3 style={{ fontSize: 26, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em", marginBottom: 8 }}>No patients found</h3>
                                    <p style={{ fontSize: 14.5, color: T.body, maxWidth: 340, lineHeight: 1.7 }}>
                                        {searchTerm ? "No patients match your search. Try a different name." : "Your patient roster is empty. Add your first patient to get started."}
                                    </p>
                                    {!searchTerm && (
                                        <Link to="/doctor/add-patient" className="mp-btn-ink" style={{ marginTop: 24 }}>
                                            <Icon d={ICONS.plus} size={14} color="white" /> Add first patient
                                        </Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DoctorMyPatientsPage;