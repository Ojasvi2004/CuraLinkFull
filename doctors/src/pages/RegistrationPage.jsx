import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to dashboard, add-patient, settings, data-access) ─── */
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
    building: ["M6 22V2l6 2 6-2v20", "M6 12h6", "M12 12h6"],
    briefcase: ["M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z", "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"],
    lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
    doc: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M12 18v-6", "M9 15h6"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    chevD: "m6 9 6 6 6-6",
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "dr-g" }) => {
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
                    className={reduce ? undefined : "dr-node"} style={{ animationDelay: `${n.d}s` }} />
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

const TextInput = ({ id, label, hint, type = "text", ...rest }) => (
    <Field label={label} id={id} hint={hint}>
        <input id={id} name={id} type={type} className="dr-input" {...rest} />
    </Field>
);

const FileInput = ({ id, label, hint, ...rest }) => (
    <Field label={label} id={id} hint={hint}>
        <input id={id} name={id} type="file" className="dr-input dr-file" {...rest} />
    </Field>
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
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.65, ease: EASE }} className="dr-card">
        {children}
    </motion.div>
);

const Check = ({ id, children, required }) => (
    <label htmlFor={id} className="dr-check">
        <input id={id} name={id} type="checkbox" required={required} />
        <span>{children}</span>
    </label>
);

const STEPS = ["Personal", "Clinic", "Services", "Security", "Documents"];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorRegistrationPage = () => {
    const reduce = useReducedMotion();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = document.getElementById("mainform");
        const data = new FormData(form);

        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }

        try {
            const response = await axios.post(`${server}/api/doctors/register`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                console.log("Successfull Registration ", response.data);
            }
        } catch (error) {
            console.log("Some Error occured in getting response.", error);
        }

        alert("Doctor Registration Submitted (UI Only)!");
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dr-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .dr-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .dr-root ::selection{background:${T.ink};color:#fff}
        .dr-root a{text-decoration:none}
        .dr-link{color:${T.ink};font-weight:500;text-decoration:underline!important;text-underline-offset:3px;text-decoration-color:${T.line}!important;transition:text-decoration-color .2s}
        .dr-link:hover{text-decoration-color:${T.ink}!important}

        .dr-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:32px;margin-bottom:20px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .dr-input{width:100%;padding:13px 18px;border:1px solid ${T.line};border-radius:16px;font-size:14.5px;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .dr-input::placeholder{color:#C4BFBA}
        .dr-input:focus{border-color:${T.ink};background:#fff}
        textarea.dr-input{resize:vertical;min-height:110px;line-height:1.6}
        select.dr-input{appearance:none;cursor:pointer;padding-right:42px}
        .dr-sel{position:relative}
        .dr-sel > span{position:absolute;right:16px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex}
        .dr-file{padding:9px 12px;cursor:pointer;font-size:13.5px;color:${T.body}}
        .dr-file::file-selector-button{margin-right:14px;padding:7px 16px;border-radius:999px;border:1px solid ${T.line};background:#fff;color:${T.ink};font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .2s,border-color .2s}
        .dr-file::file-selector-button:hover{background:${T.surface};border-color:#D6D3D1}

        .dr-check{display:flex;align-items:flex-start;gap:12px;cursor:pointer;font-size:14px;color:${T.body};line-height:1.6}
        .dr-check input{appearance:none;flex-shrink:0;width:20px;height:20px;margin-top:2px;border:1px solid #D6D3D1;border-radius:7px;background:#fff;cursor:pointer;display:grid;place-content:center;transition:background .2s,border-color .2s}
        .dr-check input::after{content:"";width:10px;height:6px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translate(1px,-1px) scale(0);transition:transform .15s}
        .dr-check input:checked{background:${T.ink};border-color:${T.ink}}
        .dr-check input:checked::after{transform:rotate(-45deg) translate(1px,-1px) scale(1)}

        .dr-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .dr-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .dr-stack{display:flex;flex-direction:column;gap:20px}

        .dr-btn-ink{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 32px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;transition:box-shadow .25s,transform .25s}
        .dr-btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .dr-btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;font-family:inherit;transition:background .25s,border-color .25s,transform .25s}
        .dr-btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .dr-root a:focus-visible,.dr-root button:focus-visible,.dr-check input:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes dr-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .dr-node{transform-box:fill-box;transform-origin:center;animation:dr-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.dr-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:700px){.dr-grid-3{grid-template-columns:1fr}}
        @media (max-width:560px){.dr-card{padding:22px 18px;border-radius:24px}.dr-grid-2{grid-template-columns:1fr}}
        @media (prefers-reduced-motion:reduce){.dr-node{animation:none}.dr-btn-ink,.dr-btn-outline{transition:none}}
      `}</style>

            <div className="dr-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="dr-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="dr-g1" style={{ width: "100%" }} />
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
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>CuraLink for doctors</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Join\nCuraLink."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 500 }}>
                                    Expand your practice, connect with patients seamlessly, and use our smart tools.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp}>
                                <Link to="/doctor/login" className="dr-btn-outline">
                                    Sign in <Icon d={ICONS.arrow} size={14} color={T.ink} />
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}>
                            {STEPS.map((step, i) => (
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
                        <form id="mainform" onSubmit={handleSubmit}>

                            {/* Step 1 */}
                            <FormCard delay={0.1}>
                                <SectionHeader icon={ICONS.user} step={1} title="Your personal details" subtitle="How patients and our team will know you" />
                                <div className="dr-stack">
                                    <div className="dr-grid-2">
                                        <TextInput id="doctorFullName" label="Full name" required placeholder="Dr. Firstname Lastname" />
                                        <TextInput id="doctorEmail" label="Email address" type="email" required placeholder="you@example.com" />
                                        <TextInput id="doctorPhone" label="Phone number" type="tel" required placeholder="+91 XXXXXXXXXX" />
                                        <TextInput id="medicalRegNo" label="Medical registration no." required placeholder="Your council reg. no." />
                                    </div>
                                    <TextInput id="qualifications" label="Qualifications" hint="Comma-separated" required placeholder="MBBS, MD (Cardiology), FRCS" />
                                    <TextInput id="experience" label="Years of experience" type="number" min="0" required placeholder="e.g. 10" />
                                    <Field label="Short bio" id="doctorBio">
                                        <textarea id="doctorBio" name="doctorBio" rows="4" required className="dr-input"
                                            placeholder="Briefly describe your expertise and approach to patient care…" />
                                    </Field>
                                    <FileInput id="profilePicture" label="Profile picture" accept="image/*" />
                                </div>
                            </FormCard>

                            {/* Step 2 */}
                            <FormCard delay={0.16}>
                                <SectionHeader icon={ICONS.building} step={2} title="Primary clinic details" subtitle="Where you see patients in person" />
                                <div className="dr-stack">
                                    <TextInput id="clinicName" label="Clinic / hospital name" required />
                                    <TextInput id="clinicStreet" label="Street address" required />
                                    <div className="dr-grid-3">
                                        <TextInput id="clinicCity" label="City" required />
                                        <TextInput id="clinicState" label="State" required />
                                        <TextInput id="clinicPincode" label="Pincode" required />
                                    </div>
                                    <TextInput id="clinicPhone" label="Clinic contact number" type="tel" />
                                </div>
                            </FormCard>

                            {/* Step 3 */}
                            <FormCard delay={0.22}>
                                <SectionHeader icon={ICONS.briefcase} step={3} title="Specialization & services" subtitle="What you offer and what it costs" />
                                <div className="dr-stack">
                                    <Field label="Primary specialty" id="primarySpecialty">
                                        <div className="dr-sel">
                                            <select id="primarySpecialty" name="primarySpecialty" required className="dr-input" defaultValue="">
                                                <option value="">Select specialty</option>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Dermatology">Dermatology</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Orthopedics">Orthopedics</option>
                                                <option value="General Physician">General Physician</option>
                                            </select>
                                            <span><Icon d={ICONS.chevD} size={14} color={T.muted} /></span>
                                        </div>
                                    </Field>
                                    <TextInput id="servicesOffered" label="Services offered" hint="Comma-separated" placeholder="e.g. ECG, Consultation, Health Checkup" />
                                    <div className="dr-grid-2">
                                        <TextInput id="consultFeePhysical" label="In-person fee (INR)" type="number" min="0" placeholder="e.g. 800" />
                                        <TextInput id="consultFeeDigital" label="Digital fee (INR)" type="number" min="0" placeholder="e.g. 500" />
                                    </div>
                                    <Check id="acceptsDigital">I offer digital consultations (telemedicine)</Check>
                                </div>
                            </FormCard>

                            {/* Step 4 */}
                            <FormCard delay={0.28}>
                                <SectionHeader icon={ICONS.lock} step={4} title="Account security" subtitle="Choose a password for your account" />
                                <div className="dr-grid-2">
                                    <TextInput id="doctorPassword" label="Create password" type="password" required />
                                    <TextInput id="doctorConfirmPassword" label="Confirm password" type="password" required />
                                </div>
                            </FormCard>

                            {/* Step 5 */}
                            <FormCard delay={0.34}>
                                <SectionHeader icon={ICONS.doc} step={5} title="Verification documents" subtitle="Our team reviews these for platform security" />
                                <div className="dr-stack">
                                    <FileInput id="MedicalCertificate" label="Medical registration certificate" required accept=".pdf,.jpg,.jpeg,.png"
                                        hint="PDF, JPG or PNG. Please upload a clear copy." />
                                    <FileInput id="ClinicRegistrationCertificate" label="Clinic registration certificate (if applicable)" accept=".pdf,.jpg,.jpeg,.png" />
                                </div>
                            </FormCard>

                            {/* Terms + submit */}
                            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.65, ease: EASE }}
                                style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "stretch" }}>
                                <Check id="termsAgreement" required>
                                    I agree to CuraLink's <Link to="/doctor/terms" className="dr-link">Terms of Service</Link> and <Link to="/doctor/privacy" className="dr-link">Privacy Policy</Link> for professionals.
                                </Check>
                                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                                    <button type="submit" className="dr-btn-ink">
                                        <Icon d={ICONS.check} size={15} color="white" /> Complete registration & request verification
                                    </button>
                                </div>
                                <p style={{ textAlign: "center", fontSize: 14, color: T.body }}>
                                    Already have an account? <Link to="/doctor/login" className="dr-link">Sign in here</Link>
                                </p>
                            </motion.div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DoctorRegistrationPage;