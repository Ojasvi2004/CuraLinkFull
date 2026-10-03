import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER;

/* ═══════════════════════════════════════════════════════════════════════════
   API — adjust these two URLs to your routes
   GET  /api/doctors/profile         -> { success, doctor: <Doctor document> }
   PUT  /api/doctors/update-profile  -> JSON body, { success, doctor }
═══════════════════════════════════════════════════════════════════════════ */
const PROFILE_URL = `${server}/api/doctors/profile`;
const UPDATE_URL = `${server}/api/doctors/update-profile`;

const clinicName = (d) => d?.ClinicDetails?.name || "—";

/* ─── THEME TOKENS (identical to the other pages) ─── */
const T = {
    ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
    surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];
const ORB = "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)";
const GLASS = { background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${T.line}` };

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69l3-.15a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.96-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    building: ["M6 22V2l6 2 6-2v20", "M6 12h6", "M12 12h6"],
    briefcase: ["M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z", "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"],
    lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
    save: ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    info: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4m0 4h.01"],
    arrowL: "M19 12H5m7-7-7 7 7 7",
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "dp-g" }) => {
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
                    className={reduce ? undefined : "dp-node"} style={{ animationDelay: `${n.d}s` }} />
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

/* ─── FORM PIECES ───────────────────────────────────────────────────────── */
const Field = ({ label, id, hint, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</label>
        {children}
        {hint && <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>{hint}</p>}
    </div>
);

const SectionHeader = ({ icon, title, subtitle, badge }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26, paddingBottom: 20, borderBottom: `1px solid ${T.line}` }}>
        <IconTile d={icon} />
        <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>{subtitle}</p>}
        </div>
        {badge && <span style={{ ...GLASS, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{badge}</span>}
    </div>
);

const FormCard = ({ children, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.65, ease: EASE }} className="dp-card">
        {children}
    </motion.div>
);

const Locked = ({ label, value }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <span style={{ fontSize: 12.5, color: T.muted }}>{label}</span>
        <span style={{ fontSize: 14.5, color: T.ink, fontWeight: 500, overflowWrap: "anywhere" }}>{value || "—"}</span>
    </div>
);

const Avatar = ({ src, name, size = 96 }) => (
    <span style={{ width: size, height: size, borderRadius: "50%", background: ORB, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, boxShadow: "0 0 24px rgba(124,140,255,0.3)", border: "3px solid #fff" }}>
        {src ? (
            <img src={src} alt={name ? `${name} profile` : "Profile"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
            <span style={{ fontSize: size / 3, fontWeight: 400, color: T.ink, background: "rgba(255,255,255,0.7)", borderRadius: "50%", width: "62%", height: "62%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(name || "?").replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
        )}
    </span>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorProfile = () => {
    const reduce = useReducedMotion();
    const { token } = useContext(AuthContext);
    const [doctor, setDoctor] = useState({});   // current doctor, same shape as the Doctor document
    const [initial, setInitial] = useState({}); // last saved copy (for Discard + dirty check)
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", error: false });

    const showToast = (message, error = false) => {
        setToast({ visible: true, message, error });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
    };

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await axios.get(PROFILE_URL, { headers: { Authorization: `Bearer ${token}` } });
                if (!alive) return;
                if (res.data.success) {
                    setDoctor(res.data.doctor);
                    setInitial(res.data.doctor);
                } else setLoadError(true);
            } catch (err) {
                console.error("profile fetch error:", err.response?.data || err.message);
                if (alive) setLoadError(true);
            }
            if (alive) setLoading(false);
        })();
        return () => { alive = false; };
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("ClinicDetails.")) {
            const key = name.split(".")[1];
            setDoctor((prev) => ({ ...prev, ClinicDetails: { ...prev.ClinicDetails, [key]: value } }));
        } else {
            setDoctor((prev) => ({ ...prev, [name]: value }));
        }
    };

    const dirty = JSON.stringify(doctor) !== JSON.stringify(initial);
    const handleReset = () => setDoctor(initial);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dirty || saving) return;
        setSaving(true);
        try {
            const c = doctor.ClinicDetails || {};
            // body matches UpdateDoctorProfile in the controller
            const body = {
                PhoneNumber: doctor.PhoneNumber,
                Bio: doctor.Bio,
                ServicesOffered: doctor.ServicesOffered,
                InPersonConsultationFees: doctor.InPersonConsultationFees,
                DigitalConsultationFees: doctor.DigitalConsultationFees ?? "",
                clinicStreet: c.address,
                clinicCity: c.city,
                clinicState: c.state,
                clinicPincode: c.pincode,
                clinicPhone: c.clinicContact,
            };
            const res = await axios.put(UPDATE_URL, body, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                const updated = res.data.doctor || doctor;
                setDoctor(updated);
                setInitial(updated);
                showToast("Profile updated");
            } else showToast("Could not update profile", true);
        } catch (err) {
            console.error("profile update error:", err.response?.data || err.message);
            showToast("Could not update profile. Please try again.", true);
        }
        setSaving(false);
    };

    const name = doctor?.FullName;
    const avatarSrc = doctor?.ProfilePicture || null;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dp-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .dp-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .dp-root ::selection{background:${T.ink};color:#fff}
        .dp-root a{text-decoration:none}

        .dp-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:32px;margin-bottom:20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .dp-input{width:100%;padding:13px 18px;border:1px solid ${T.line};border-radius:16px;font-size:14.5px;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .dp-input::placeholder{color:#C4BFBA}
        .dp-input:focus{border-color:${T.ink};background:#fff}
        textarea.dp-input{resize:vertical;min-height:120px;line-height:1.6}
        .dp-pre{position:relative}
        .dp-pre > span{position:absolute;left:18px;top:50%;transform:translateY(-50%);font-size:14.5px;color:${T.muted};pointer-events:none}
        .dp-pre .dp-input{padding-left:36px}

        .dp-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .dp-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .dp-stack{display:flex;flex-direction:column;gap:20px}
        .dp-locked{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:22px}

        .dp-btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 32px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;transition:box-shadow .25s,transform .25s,opacity .25s}
        .dp-btn-ink:hover:not(:disabled){box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .dp-btn-ink:disabled{opacity:.45;cursor:not-allowed}
        .dp-btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;font-family:inherit;transition:background .25s,border-color .25s,transform .25s}
        .dp-btn-outline:hover:not(:disabled){background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .dp-btn-outline:disabled{opacity:.45;cursor:not-allowed}
        .dp-root a:focus-visible,.dp-root button:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes dp-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .dp-node{transform-box:fill-box;transform-origin:center;animation:dp-pulse 4.5s ease-in-out infinite}
        @keyframes dp-spin{to{transform:rotate(360deg)}}

        @media (max-width:900px){.dp-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:700px){.dp-grid-3{grid-template-columns:1fr}}
        @media (max-width:560px){.dp-card{padding:22px 18px;border-radius:24px}.dp-grid-2{grid-template-columns:1fr}}
        @media (prefers-reduced-motion:reduce){.dp-node{animation:none}.dp-btn-ink,.dp-btn-outline{transition:none}}
      `}</style>

            <div className="dp-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="dp-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="dp-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 40% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                            <div>
                                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                        <span style={{ position: "relative", width: 26, height: 26 }}>
                                            <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                            <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon d={ICONS.sparkle} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Your profile</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Edit\nprofile."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    Keep your contact details, bio and services current so patients know what to expect.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp}>
                                <Link to="/doctor/dashboard" className="dp-btn-outline">
                                    <Icon d={ICONS.arrowL} size={14} color={T.ink} /> Back to dashboard
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </Section>

                {/* ── FORM ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>

                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }} role="status" aria-label="Loading profile">
                                <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${T.line}`, borderTopColor: T.ink, animation: reduce ? "none" : "dp-spin 1s linear infinite" }} />
                            </div>
                        ) : loadError ? (
                            <div className="dp-card" style={{ textAlign: "center", padding: "56px 32px" }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><IconTile d={ICONS.info} /></div>
                                <p style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", marginBottom: 6 }}>We couldn't load your profile</p>
                                <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7, marginBottom: 24 }}>Check your connection and try again.</p>
                                <button type="button" className="dp-btn-ink" onClick={() => window.location.reload()}>Reload page</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>

                                {/* Photo + bio */}
                                <FormCard delay={0.1}>
                                    <SectionHeader icon={ICONS.user} title="About you" subtitle="Your profile photo and the bio patients see" />
                                    <div className="dp-stack">
                                        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                                            <Avatar src={avatarSrc} name={name} />
                                            <div>
                                                <p style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{name}</p>
                                                <p style={{ fontSize: 13.5, color: T.body, marginTop: 2, marginBottom: 14 }}>{doctor?.Speciality}</p>
                                            </div>
                                        </div>
                                        <Field label="Short bio" id="Bio" hint="Describe your expertise and approach to patient care.">
                                            <textarea id="Bio" name="Bio" className="dp-input" required rows="5" value={doctor.Bio ?? ""} onChange={handleChange} />
                                        </Field>
                                    </div>
                                </FormCard>

                                {/* Contact */}
                                <FormCard delay={0.16}>
                                    <SectionHeader icon={ICONS.phone} title="Contact details" subtitle="How patients and our team reach you" />
                                    <div className="dp-grid-2">
                                        <Field label="Phone number" id="PhoneNumber" hint="Used for appointment reminders.">
                                            <input id="PhoneNumber" name="PhoneNumber" type="tel" className="dp-input" required placeholder="+91 XXXXXXXXXX" value={doctor.PhoneNumber ?? ""} onChange={handleChange} />
                                        </Field>
                                        <Field label="Clinic contact number" id="clinicPhone">
                                            <input id="clinicPhone" name="ClinicDetails.clinicContact" type="tel" className="dp-input" value={doctor.ClinicDetails?.clinicContact ?? ""} onChange={handleChange} />
                                        </Field>
                                    </div>
                                </FormCard>

                                {/* Clinic */}
                                <FormCard delay={0.22}>
                                    <SectionHeader icon={ICONS.building} title="Clinic address" subtitle={`Where you see patients${clinicName(doctor) !== "—" ? ` at ${clinicName(doctor)}` : ""}`} />
                                    <div className="dp-stack">
                                        <Field label="Street address" id="clinicStreet">
                                            <input id="clinicStreet" name="ClinicDetails.address" className="dp-input" required value={doctor.ClinicDetails?.address ?? ""} onChange={handleChange} />
                                        </Field>
                                        <div className="dp-grid-3">
                                            <Field label="City" id="clinicCity">
                                                <input id="clinicCity" name="ClinicDetails.city" className="dp-input" required value={doctor.ClinicDetails?.city ?? ""} onChange={handleChange} />
                                            </Field>
                                            <Field label="State" id="clinicState">
                                                <input id="clinicState" name="ClinicDetails.state" className="dp-input" required value={doctor.ClinicDetails?.state ?? ""} onChange={handleChange} />
                                            </Field>
                                            <Field label="Pincode" id="clinicPincode">
                                                <input id="clinicPincode" name="ClinicDetails.pincode" className="dp-input" required value={doctor.ClinicDetails?.pincode ?? ""} onChange={handleChange} />
                                            </Field>
                                        </div>
                                    </div>
                                </FormCard>

                                {/* Services */}
                                <FormCard delay={0.28}>
                                    <SectionHeader icon={ICONS.briefcase} title="Services & fees" subtitle="What you offer and what it costs" />
                                    <div className="dp-stack">
                                        <Field label="Services offered" id="ServicesOffered" hint="Comma-separated">
                                            <input id="ServicesOffered" name="ServicesOffered" className="dp-input" required placeholder="e.g. ECG, Consultation, Health Checkup" value={doctor.ServicesOffered ?? ""} onChange={handleChange} />
                                        </Field>
                                        <div className="dp-grid-2">
                                            <Field label="In-person fee (INR)" id="InPersonConsultationFees">
                                                <div className="dp-pre">
                                                    <span aria-hidden>₹</span>
                                                    <input id="InPersonConsultationFees" name="InPersonConsultationFees" type="number" min="0" className="dp-input" required value={doctor.InPersonConsultationFees ?? ""} onChange={handleChange} />
                                                </div>
                                            </Field>
                                            <Field label="Digital fee (INR)" id="DigitalConsultationFees" hint="Leave empty if you don't offer digital consultations.">
                                                <div className="dp-pre">
                                                    <span aria-hidden>₹</span>
                                                    <input id="DigitalConsultationFees" name="DigitalConsultationFees" type="number" min="0" className="dp-input" value={doctor.DigitalConsultationFees ?? ""} onChange={handleChange} />
                                                </div>
                                            </Field>
                                        </div>
                                    </div>
                                </FormCard>

                                {/* Locked info */}
                                <FormCard delay={0.34}>
                                    <SectionHeader icon={ICONS.lock} title="Verified information" subtitle="Checked during verification, so it can't be edited here" badge="Read only" />
                                    <div className="dp-locked">
                                        <Locked label="Full name" value={doctor?.FullName} />
                                        <Locked label="Email address" value={doctor?.Email} />
                                        <Locked label="Medical registration no." value={doctor?.MedicalRegistrationNumber} />
                                        <Locked label="Qualifications" value={doctor?.Qualifications} />
                                        <Locked label="Specialty" value={doctor?.Speciality} />
                                        <Locked label="Years of experience" value={doctor?.Experience} />
                                        <Locked label="Clinic name" value={clinicName(doctor)} />
                                    </div>
                                    <p style={{ fontSize: 13, color: T.muted, marginTop: 24, lineHeight: 1.6 }}>
                                        Something wrong here? Contact CuraLink support and we'll update it after re-verification.
                                    </p>
                                </FormCard>

                                {/* Actions */}
                                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap", marginTop: 8 }}>
                                    <button type="button" className="dp-btn-outline" onClick={handleReset} disabled={!dirty || saving}>Discard changes</button>
                                    <button type="submit" className="dp-btn-ink" disabled={!dirty || saving}>
                                        <Icon d={ICONS.save} size={15} color="white" /> {saving ? "Saving…" : "Save changes"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Toast */}
                <AnimatePresence>
                    {toast.visible && (
                        <motion.div role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.35, ease: EASE }}
                            style={{ position: "fixed", bottom: 28, right: 28, zIndex: 300, background: T.ink, color: "#fff", padding: "13px 22px 13px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 500, boxShadow: "0 18px 50px rgba(12,10,9,.25)", display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: toast.error ? "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)" : "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)" }} />
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default DoctorProfile;