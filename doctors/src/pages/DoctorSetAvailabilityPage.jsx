import React, { useState, useEffect, useContext, useMemo } from "react";
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
    sky: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
    mint: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
    sun: "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
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
    chevronL: "M15 18l-6-6 6-6",
    chevronR: "m9 18 6-6-6-6",
    plus: ["M12 5v14", "M5 12h14"],
    trash: ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
    video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
    building: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    x: ["M18 6 6 18", "m6 6 12 12"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    check: ["M20 6 9 17l-5-5"],
};

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const getISODate = (d) => d.toISOString().split("T")[0];
const formatDisplayDate = (dateStr) =>
    new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const formatShortDate = (dateStr) =>
    new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-IN", { month: "long", day: "numeric" });

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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "av-g" }) => {
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
                    className={reduce ? undefined : "av-node"} style={{ animationDelay: `${n.d}s` }} />
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

/* ─── SLOT CARD ─────────────────────────────────────────────────────────── */
const SlotCard = ({ slot, onDelete }) => {
    const isDigital = slot.type === "DIGITAL";
    const booked = slot.isBooked;
    const dot = isDigital ? "#A5D8FF" : "#5FD0A5";
    return (
        <motion.div layout
            initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92, transition: { duration: 0.18 } }}
            className={`av-slot${booked ? " av-booked" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: booked ? "#fff" : dot }} />
                <Icon d={isDigital ? ICONS.video : ICONS.building} size={13} color={booked ? "#fff" : T.body} />
                <span style={{ fontSize: 11.5, fontWeight: 500, color: booked ? "#fff" : T.body }}>{booked ? "Booked" : isDigital ? "Digital" : "In-person"}</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 400, letterSpacing: "-0.02em", color: booked ? "#fff" : T.ink, textAlign: "center", lineHeight: 1.3 }}>{slot.Time.Start}</p>
            <p style={{ fontSize: 11.5, color: booked ? "rgba(255,255,255,0.6)" : T.muted, textAlign: "center", marginTop: 2 }}>to {slot.Time.End}</p>

            {booked && slot.patientName && (
                <p style={{ fontSize: 11.5, color: "#fff", textAlign: "center", marginTop: 6, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slot.patientName}</p>
            )}

            {!booked && (
                <button className="av-del" onClick={() => onDelete(slot.id)} title="Delete slot" aria-label={`Delete slot ${slot.Time.Start}`}>
                    <Icon d={ICONS.trash} size={11} color={T.ink} />
                </button>
            )}
        </motion.div>
    );
};

const GroupHead = ({ icon, label, count, dot }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <IconTile d={icon} size={34} />
        <span style={{ fontSize: 16, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{label}</span>
        <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 500, color: T.ink, padding: "3px 12px 3px 9px", borderRadius: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot }} />{count} slot{count !== 1 ? "s" : ""}
        </span>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorSetAvailabilityPage = () => {
    const { token } = useContext(AuthContext);
    const reduce = useReducedMotion();
    const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [newBlock, setNewBlock] = useState({
        startTime: "09:00", endTime: "12:00", slotDuration: "15", type: "PHYSICAL", clinicId: "thisClinicId",
    });

    const handleBlockChange = (e) => setNewBlock((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleDateOffset = (offset) => {
        const d = new Date(selectedDate + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + offset);
        setSelectedDate(getISODate(d));
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${server}/api/doctors/GetSlotsOfADate`,
                { date: selectedDate }, { headers: { authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setSlots(res.data.AllSlotOfADay.map((slot) => ({
                    id: slot._id,
                    Time: { Start: slot.Time?.Start || "", End: slot.Time?.End || "" },
                    type: slot.type, clinicId: slot.clinicId, isBooked: slot.isBooked, patientName: slot.patientName,
                })).sort((a, b) => a.Time.Start.localeCompare(b.Time.Start)));
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchSlots(); }, [selectedDate]);

    useEffect(() => {
        if (!showModal) return;
        const onKey = (e) => e.key === "Escape" && setShowModal(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showModal]);

    const handleAddBlock = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${server}/api/doctors/createSlots`,
                { date: selectedDate, ...newBlock }, { headers: { authorization: `Bearer ${token}` } });
            if (res.data.success) {
                setShowModal(false);
                await fetchSlots();
            } else {
                alert(res.data.message || "Could not create slots.");
            }
        } catch (e) { console.error(e); alert("Slot creation failed."); }
        setSubmitting(false);
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Delete this slot?")) return;
        try {
            const res = await axios.post(`${server}/api/doctors/deleteSingleSlot`, { id });
            if (res.data.success) await fetchSlots();
        } catch (e) { console.error(e); }
    };

    const digitalSlots = slots.filter((s) => s.type === "DIGITAL");
    const physicalSlots = slots.filter((s) => s.type === "PHYSICAL");
    const bookedCount = slots.filter((s) => s.isBooked).length;

    const stats = [
        { label: "Total slots", value: slots.length, dot: "#7C8CFF" },
        { label: "In-person", value: physicalSlots.length, dot: "#5FD0A5" },
        { label: "Digital", value: digitalSlots.length, dot: "#A5D8FF" },
        { label: "Booked", value: bookedCount, dot: T.ink },
    ];

    const typeOptions = [
        { value: "PHYSICAL", label: "In-person", icon: ICONS.building },
        { value: "DIGITAL", label: "Digital", icon: ICONS.video },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .av-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .av-root *,.av-modal *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .av-root ::selection{background:${T.ink};color:#fff}

        .av-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .av-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .av-stat{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:22px;padding:18px 20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .av-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:14px}

        .av-slot{position:relative;background:#fff;border:1px solid ${T.line};border-radius:20px;padding:14px 12px;transition:border-color .25s,box-shadow .25s,transform .25s}
        .av-slot:hover{border-color:#D6D3D1;box-shadow:0 12px 30px rgba(12,10,9,.07);transform:translateY(-3px)}
        .av-booked{background:${T.ink};border-color:${T.ink}}
        .av-booked:hover{border-color:${T.ink};box-shadow:0 12px 30px rgba(12,10,9,.25)}
        .av-del{position:absolute;top:-8px;right:-8px;width:26px;height:26px;border-radius:50%;background:#fff;border:1px solid ${T.line};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(12,10,9,.08);transition:transform .2s,border-color .2s}
        .av-del:hover{transform:scale(1.12);border-color:${T.ink}}

        .av-nav{width:44px;height:44px;border-radius:50%;border:1px solid ${T.line};background:rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}
        .av-nav:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .av-date{margin-top:6px;border:0;outline:0;font-size:13px;color:${T.muted};background:transparent;text-align:center;cursor:pointer;font-family:inherit}

        .av-btn-ink{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 28px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;transition:box-shadow .25s,transform .25s}
        .av-btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .av-btn-ink:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
        .av-btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,.85);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;font-family:inherit;transition:background .25s,border-color .25s,transform .25s}
        .av-btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}

        .av-overlay{position:fixed;inset:0;background:rgba(12,10,9,.4);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:200}
        .av-modal{background:rgba(255,255,255,.96);border:1px solid ${T.line};border-radius:32px;width:100%;max-width:480px;max-height:calc(100vh - 48px);overflow:auto;box-shadow:0 30px 80px rgba(12,10,9,.18);
          background-image:radial-gradient(ellipse 70% 40% at 100% 0%,rgba(201,184,255,.32),transparent 70%),radial-gradient(ellipse 60% 40% at 0% 100%,rgba(255,217,184,.38),transparent 70%)}
        .av-label{font-size:13px;font-weight:500;color:${T.ink};margin-bottom:8px;display:block}
        .av-input{width:100%;padding:12px 16px;border:1px solid ${T.line};border-radius:16px;font-size:14px;font-weight:400;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .av-input:focus{border-color:${T.ink};background:#fff}
        .av-input[readonly]{color:${T.body};cursor:not-allowed;background:${T.surface}}
        .av-type{display:flex;align-items:center;gap:10px;padding:13px 16px;border-radius:18px;border:1px solid ${T.line};background:#fff;cursor:pointer;transition:border-color .2s,background .2s}
        .av-type:hover{border-color:#D6D3D1}
        .av-type[data-on="true"]{border-color:${T.ink};background:${T.surface}}
        .av-type:focus-within{outline:2px solid ${T.ink};outline-offset:2px}

        .av-root button:focus-visible,.av-modal button:focus-visible,.av-nav:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes av-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .av-node{transform-box:fill-box;transform-origin:center;animation:av-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.av-stats{grid-template-columns:1fr 1fr}.av-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:560px){.av-pad{padding-left:18px!important;padding-right:18px!important}}
        @media (prefers-reduced-motion:reduce){.av-node{animation:none}.av-slot,.av-btn-ink,.av-btn-outline,.av-nav{transition:none}.av-slot:hover{transform:none}}
      `}</style>

            <div className="av-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="av-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="av-g1" style={{ width: "100%" }} />
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
                                                <Icon d={ICONS.sparkle} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Schedule management</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Set your\navailability."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    Define consultation slots for in-person and digital appointments.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp}>
                                <button className="av-btn-ink" onClick={() => setShowModal(true)}>
                                    <Icon d={ICONS.plus} size={16} color="white" /> Add availability block
                                </button>
                            </motion.div>
                        </div>

                        <motion.div variants={stagger} className="av-stats">
                            {stats.map((s) => (
                                <motion.div key={s.label} variants={fadeUp} className="av-stat">
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot }} />
                                        <p style={{ fontSize: 12.5, color: T.muted }}>{s.label}</p>
                                    </div>
                                    <p style={{ fontSize: 34, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em" }}>{loading ? "—" : s.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── DATE + SLOTS ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Date navigator */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE }}
                            className="av-card" style={{ padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                            <button className="av-nav" onClick={() => handleDateOffset(-1)} aria-label="Previous day">
                                <Icon d={ICONS.chevronL} size={18} color={T.ink} />
                            </button>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.03em" }}>{formatDisplayDate(selectedDate)}</p>
                                <input className="av-date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} aria-label="Pick a date" />
                            </div>
                            <button className="av-nav" onClick={() => handleDateOffset(1)} aria-label="Next day">
                                <Icon d={ICONS.chevronR} size={18} color={T.ink} />
                            </button>
                        </motion.div>

                        {/* Slots */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE, delay: 0.1 }} className="av-card" style={{ overflow: "hidden" }}>
                            <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 14 }}>
                                <IconTile d={ICONS.calendar} size={44} />
                                <div>
                                    <p style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>Slots for {formatShortDate(selectedDate)}</p>
                                    <p style={{ fontSize: 13.5, color: T.muted, marginTop: 2 }}>{loading ? "Loading…" : `${slots.length} slot${slots.length !== 1 ? "s" : ""} configured`}</p>
                                </div>
                            </div>

                            <div className="av-pad" style={{ padding: "28px" }}>
                                {loading ? (
                                    <div role="status" aria-label="Loading slots" style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                                        <motion.div animate={reduce ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${T.line}`, borderTopColor: T.ink }} />
                                    </div>
                                ) : slots.length > 0 ? (
                                    <>
                                        {physicalSlots.length > 0 && (
                                            <div style={{ marginBottom: digitalSlots.length ? 32 : 0 }}>
                                                <GroupHead icon={ICONS.building} label="In-person" count={physicalSlots.length} dot="#5FD0A5" />
                                                <motion.div className="av-grid" layout>
                                                    <AnimatePresence>
                                                        {physicalSlots.map((slot) => <SlotCard key={slot.id} slot={slot} onDelete={handleDeleteSlot} />)}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </div>
                                        )}
                                        {digitalSlots.length > 0 && (
                                            <div>
                                                <GroupHead icon={ICONS.video} label="Digital" count={digitalSlots.length} dot="#A5D8FF" />
                                                <motion.div className="av-grid" layout>
                                                    <AnimatePresence>
                                                        {digitalSlots.map((slot) => <SlotCard key={slot.id} slot={slot} onDelete={handleDeleteSlot} />)}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "40px 24px" }}>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><IconTile d={ICONS.calendar} /></div>
                                        <p style={{ fontSize: 24, fontWeight: 300, color: T.ink, letterSpacing: "-0.03em", marginBottom: 8 }}>No slots set</p>
                                        <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 24px" }}>Add an availability block to create consultation slots for this date.</p>
                                        <button className="av-btn-ink" onClick={() => setShowModal(true)}>
                                            <Icon d={ICONS.plus} size={15} color="white" /> Add availability block
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── ADD BLOCK MODAL ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div className="av-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        onClick={() => setShowModal(false)}>
                        <motion.div className="av-modal" role="dialog" aria-modal="true" aria-labelledby="av-modal-title"
                            initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }}
                            transition={{ duration: 0.35, ease: EASE }} onClick={(e) => e.stopPropagation()}>

                            <div style={{ padding: "28px 28px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                                <div>
                                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px 4px 10px", borderRadius: 20, marginBottom: 14 }}>
                                        <Bead bg={ORBS.violet} size={12} /> New block
                                    </span>
                                    <p id="av-modal-title" style={{ fontSize: 28, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em", lineHeight: 1.1 }}>Add availability</p>
                                </div>
                                <button className="av-nav" type="button" onClick={() => setShowModal(false)} aria-label="Close" style={{ width: 40, height: 40 }}>
                                    <Icon d={ICONS.x} size={16} color={T.ink} />
                                </button>
                            </div>

                            <form onSubmit={handleAddBlock} style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                                <div>
                                    <label className="av-label" htmlFor="av-date">Date</label>
                                    <input id="av-date" className="av-input" type="text" value={formatDisplayDate(selectedDate)} readOnly />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <div>
                                        <label className="av-label" htmlFor="av-start">Start time</label>
                                        <input id="av-start" className="av-input" type="time" name="startTime" value={newBlock.startTime} onChange={handleBlockChange} required />
                                    </div>
                                    <div>
                                        <label className="av-label" htmlFor="av-end">End time</label>
                                        <input id="av-end" className="av-input" type="time" name="endTime" value={newBlock.endTime} onChange={handleBlockChange} required />
                                    </div>
                                </div>

                                <div>
                                    <label className="av-label" htmlFor="av-dur">Slot duration</label>
                                    <select id="av-dur" className="av-input" name="slotDuration" value={newBlock.slotDuration} onChange={handleBlockChange} required>
                                        <option value="10">10 minutes</option>
                                        <option value="15">15 minutes</option>
                                        <option value="20">20 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">60 minutes</option>
                                    </select>
                                </div>

                                <div>
                                    <span className="av-label">Consultation type</span>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        {typeOptions.map((opt) => {
                                            const on = newBlock.type === opt.value;
                                            return (
                                                <label key={opt.value} className="av-type" data-on={on}>
                                                    <input type="radio" name="type" value={opt.value} checked={on} onChange={handleBlockChange}
                                                        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                                                    <Icon d={opt.icon} size={16} color={on ? T.ink : T.muted} />
                                                    <span style={{ fontSize: 14, fontWeight: 500, color: on ? T.ink : T.body }}>{opt.label}</span>
                                                    {on && <Icon d={ICONS.check} size={14} color={T.ink} style={{ marginLeft: "auto" }} />}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                                    <button type="button" className="av-btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="av-btn-ink" style={{ flex: 2 }} disabled={submitting}>
                                        {submitting ? "Creating slots…" : "Create slots"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DoctorSetAvailabilityPage;