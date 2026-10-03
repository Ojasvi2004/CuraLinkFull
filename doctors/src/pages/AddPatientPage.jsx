import React, { useState, useContext, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    mail: ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69l3-.15a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.29 6.29l.96-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    notes: ["M9 12h6", "M9 16h6", "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M9 7h6"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    arrowL: "M19 12H5m7-7-7 7 7 7",
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    plus: ["M12 5v14", "M5 12h14"],
    info: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4m0 4h.01"],
    chevD: "m6 9 6 6 6-6",
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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "ad-g" }) => {
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
                    className={reduce ? undefined : "ad-node"} style={{ animationDelay: `${n.d}s` }} />
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
const InputField = ({ label, hint, htmlFor, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor={htmlFor} style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</label>
        {children}
        {hint && <p style={{ fontSize: 12.5, color: T.muted }}>{hint}</p>}
    </div>
);

const SectionHeader = ({ icon, title, subtitle, step }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26, paddingBottom: 20, borderBottom: `1px solid ${T.line}` }}>
        <IconTile d={icon} />
        <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>{subtitle}</p>}
        </div>
        <span style={{ ...GLASS, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Step {step}</span>
    </div>
);

const FormCard = ({ children, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.65, ease: EASE }} className="ad-card">
        {children}
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorAddPatientPage = () => {
    const navigate = useNavigate();
    const reduce = useReducedMotion();
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        patientFullName: "", patientGender: "", patientDob: "",
        patientEmail: "", patientPhone: "",
        primaryConcern: "", allergies: "", chronicConditions: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/api/doctors/add-patient`,
                { formData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setSubmitted(true);
                setTimeout(() => navigate("/doctor/patients"), 1600);
            }
        } catch (error) {
            console.log(error);
            navigate("/doctor/patients");
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .ad-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .ad-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .ad-root ::selection{background:${T.ink};color:#fff}
        .ad-root a{text-decoration:none}

        .ad-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:32px;margin-bottom:20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .ad-input{width:100%;padding:13px 18px;border:1px solid ${T.line};border-radius:16px;font-size:14.5px;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .ad-input::placeholder{color:#C4BFBA}
        .ad-input:focus{border-color:${T.ink};background:#fff}
        select.ad-input{appearance:none;cursor:pointer;padding-right:42px}
        .ad-icon-in{padding-left:44px}
        .ad-field-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);pointer-events:none}

        .ad-grid-3{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}
        .ad-grid-2{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
        .ad-grid-half{display:grid;grid-template-columns:1fr 1fr;gap:20px}

        .ad-btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 32px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;transition:box-shadow .25s,transform .25s}
        .ad-btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .ad-btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;font-family:inherit;transition:background .25s,border-color .25s,transform .25s}
        .ad-btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .ad-root a:focus-visible,.ad-root button:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes ad-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .ad-node{transform-box:fill-box;transform-origin:center;animation:ad-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.ad-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:560px){.ad-card{padding:22px 18px;border-radius:24px}.ad-grid-half{grid-template-columns:1fr}}
        @media (prefers-reduced-motion:reduce){.ad-node{animation:none}.ad-btn-ink,.ad-btn-outline{transition:none}}
      `}</style>

            <div className="ad-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="ad-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="ad-g1" style={{ width: "100%" }} />
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
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Patient management</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Add new\npatient."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    Create a patient profile in your practice. An invitation to join CuraLink will be sent to their email address.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp}>
                                <Link to="/doctor/patients" className="ad-btn-outline">
                                    <Icon d={ICONS.arrowL} size={14} color={T.ink} /> Back to patients
                                </Link>
                            </motion.div>
                        </div>

                        {/* Steps */}
                        <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}>
                            {["Basic info", "Contact", "Clinical notes"].map((step, i) => (
                                <span key={step} style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500, color: T.ink, padding: "8px 18px 8px 10px", borderRadius: 999 }}>
                                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: T.ink, color: "#fff", fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                                    {step}
                                </span>
                            ))}
                        </motion.div>
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

                        {/* Success */}
                        {submitted && (
                            <motion.div role="status" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}
                                className="ad-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 26px" }}>
                                <IconTile d={ICONS.check} dark />
                                <div>
                                    <p style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>Patient profile created</p>
                                    <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>Redirecting to your patient roster…</p>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Section 1 */}
                            <FormCard delay={0.1}>
                                <SectionHeader icon={ICONS.user} step={1} title="Basic information" subtitle="Legal name, gender and date of birth" />
                                <div className="ad-grid-3">
                                    <InputField label="Full name" htmlFor="ad-name">
                                        <input id="ad-name" className="ad-input" type="text" name="patientFullName" required
                                            placeholder="Firstname Lastname" value={formData.patientFullName} onChange={handleChange} />
                                    </InputField>
                                    <InputField label="Gender" htmlFor="ad-gender">
                                        <div style={{ position: "relative" }}>
                                            <select id="ad-gender" className="ad-input" name="patientGender" required value={formData.patientGender} onChange={handleChange}>
                                                <option value="">Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Non-binary">Non-binary</option>
                                                <option value="Other">Other</option>
                                                <option value="Prefer not to say">Prefer not to say</option>
                                            </select>
                                            <span className="ad-field-icon" style={{ left: "auto", right: 16 }}><Icon d={ICONS.chevD} size={14} color={T.muted} /></span>
                                        </div>
                                    </InputField>
                                    <InputField label="Date of birth" htmlFor="ad-dob">
                                        <input id="ad-dob" className="ad-input" type="date" name="patientDob" required value={formData.patientDob} onChange={handleChange} />
                                    </InputField>
                                </div>
                            </FormCard>

                            {/* Section 2 */}
                            <FormCard delay={0.16}>
                                <SectionHeader icon={ICONS.mail} step={2} title="Contact details" subtitle="Email invitation and phone for reminders" />
                                <div className="ad-grid-2">
                                    <InputField label="Email address" htmlFor="ad-email" hint="An invitation to create their account will be sent here.">
                                        <div style={{ position: "relative" }}>
                                            <span className="ad-field-icon"><Icon d={ICONS.mail} size={15} color={T.muted} /></span>
                                            <input id="ad-email" className="ad-input ad-icon-in" type="email" name="patientEmail" required
                                                placeholder="patient@example.com" value={formData.patientEmail} onChange={handleChange} />
                                        </div>
                                    </InputField>
                                    <InputField label="Phone number" htmlFor="ad-phone" hint="Used for appointment reminders.">
                                        <div style={{ position: "relative" }}>
                                            <span className="ad-field-icon"><Icon d={ICONS.phone} size={15} color={T.muted} /></span>
                                            <input id="ad-phone" className="ad-input ad-icon-in" type="tel" name="patientPhone" required
                                                placeholder="+91 98765 43210" value={formData.patientPhone} onChange={handleChange} />
                                        </div>
                                    </InputField>
                                </div>
                            </FormCard>

                            {/* Section 3 */}
                            <FormCard delay={0.22}>
                                <SectionHeader icon={ICONS.notes} step={3} title="Initial clinical notes" subtitle="Optional — can be updated anytime from the patient record" />
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    <InputField label="Primary concern / reason for visit" htmlFor="ad-concern">
                                        <input id="ad-concern" className="ad-input" type="text" name="primaryConcern"
                                            placeholder="e.g. Hypertension, Routine Checkup, Knee Pain" value={formData.primaryConcern} onChange={handleChange} />
                                    </InputField>
                                    <div className="ad-grid-half">
                                        <InputField label="Known allergies" htmlFor="ad-allergies" hint="Comma-separated">
                                            <input id="ad-allergies" className="ad-input" type="text" name="allergies"
                                                placeholder="e.g. Penicillin, Peanuts" value={formData.allergies} onChange={handleChange} />
                                        </InputField>
                                        <InputField label="Chronic conditions" htmlFor="ad-chronic" hint="Comma-separated">
                                            <input id="ad-chronic" className="ad-input" type="text" name="chronicConditions"
                                                placeholder="e.g. Diabetes, Asthma" value={formData.chronicConditions} onChange={handleChange} />
                                        </InputField>
                                    </div>
                                </div>
                            </FormCard>

                            {/* Info card */}
                            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.65, ease: EASE }}
                                style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.08)", padding: "26px 28px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 16,
                                    background: `radial-gradient(ellipse 70% 70% at 60% 30%, rgba(201,184,255,0.45), rgba(165,216,255,0.2) 60%, rgba(255,255,255,0) 85%), radial-gradient(ellipse 50% 50% at 10% 100%, rgba(255,217,184,0.5), rgba(255,255,255,0) 70%), ${T.white}` }}>
                                <IconTile d={ICONS.info} dark />
                                <div>
                                    <p style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", marginBottom: 4 }}>Account invitation</p>
                                    <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7 }}>
                                        Once you create this profile, the patient will receive a secure email invitation to set up their CuraLink account and access their records, prescriptions, and appointment history.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Actions */}
                            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.65, ease: EASE }}
                                style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Link to="/doctor/patients" className="ad-btn-outline">Cancel</Link>
                                <button type="submit" className="ad-btn-ink">
                                    <Icon d={ICONS.plus} size={15} color="white" /> Create patient profile
                                </button>
                            </motion.div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DoctorAddPatientPage;