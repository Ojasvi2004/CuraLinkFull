import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to dashboard, add-patient, data-access) ─── */
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
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9",
    globe: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    chevron: "m9 18 6-6-6-6",
    chevD: "m6 9 6 6 6-6",
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
    save: ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
    mail: ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
    sms: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4",
    privacy: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M12 8v4m0 4h.01"],
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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "st-g" }) => {
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
                    className={reduce ? undefined : "st-node"} style={{ animationDelay: `${n.d}s` }} />
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

/* ─── SETTINGS PIECES ───────────────────────────────────────────────────── */
const Toggle = ({ enabled, onToggle, label, desc, icon }) => (
    <div className="st-row">
        <IconTile d={icon} size={44} dark={enabled} />
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14.5, fontWeight: 500, color: T.ink }}>{label}</p>
            <p style={{ fontSize: 13, color: T.muted, marginTop: 2, lineHeight: 1.5 }}>{desc}</p>
        </div>
        <button type="button" role="switch" aria-checked={enabled} aria-label={label} onClick={onToggle}
            className="st-switch" style={{ background: enabled ? T.ink : "#E7E5E4" }}>
            <motion.span animate={{ x: enabled ? 22 : 0 }} transition={{ duration: 0.3, ease: EASE }}
                style={{ position: "absolute", top: 3, left: 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
        </button>
    </div>
);

const SettingsCard = ({ id, title, subtitle, icon, children, danger = false }) => (
    <motion.section id={id} variants={fadeUp} className="st-card" style={{ scrollMarginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${T.line}` }}>
            <IconTile d={icon} dark={danger} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{title}</h2>
                {subtitle && <p style={{ fontSize: 13.5, color: T.body, marginTop: 2 }}>{subtitle}</p>}
            </div>
        </div>
        {children}
    </motion.section>
);

const NavRow = ({ icon, label, to }) => (
    <Link to={to} className="st-row st-nav">
        <IconTile d={icon} size={38} />
        <span style={{ flex: 1, fontSize: 14.5, fontWeight: 500, color: T.ink }}>{label}</span>
        <Icon d={ICONS.chevron} size={16} color={T.muted} />
    </Link>
);

const SelectField = ({ id, label, value, onChange, options }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</label>
        <div style={{ position: "relative" }}>
            <select id={id} className="st-input" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
                <Icon d={ICONS.chevD} size={14} color={T.muted} />
            </span>
        </div>
    </div>
);

const NAV_PILLS = [
    { label: "Notifications", id: "st-notifications" },
    { label: "Security", id: "st-security" },
    { label: "Preferences", id: "st-preferences" },
    { label: "Danger zone", id: "st-danger" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorSettingsPage = () => {
    const reduce = useReducedMotion();
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsReminders, setSmsReminders] = useState(false);
    const [availReminders, setAvailReminders] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("en-US");
    const [timezone, setTimezone] = useState("Asia/Kolkata");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .st-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .st-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .st-root ::selection{background:${T.ink};color:#fff}
        .st-root a{text-decoration:none;color:inherit}

        .st-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:32px;box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .st-row{display:flex;align-items:center;gap:14px;padding:14px 12px;border-radius:20px;transition:background .2s}
        .st-row:hover{background:${T.surface}}
        .st-row + .st-row{margin-top:4px}
        .st-nav{cursor:pointer}
        .st-nav svg:last-child{transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .st-nav:hover svg:last-child{transform:translateX(4px)}
        .st-switch{position:relative;width:48px;height:26px;border-radius:999px;border:0;cursor:pointer;flex-shrink:0;transition:background .25s}

        .st-input{width:100%;padding:13px 42px 13px 18px;border:1px solid ${T.line};border-radius:16px;font-size:14.5px;color:${T.ink};background:${T.surface2};outline:0;appearance:none;cursor:pointer;transition:border-color .2s,background .2s}
        .st-input:focus{border-color:${T.ink};background:#fff}
        .st-grid-half{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:12px}

        .st-btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 32px;border-radius:999px;border:0;cursor:pointer;transition:box-shadow .25s,transform .25s}
        .st-btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .st-btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;transition:background .25s,border-color .25s,transform .25s}
        .st-btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .st-pill{display:inline-flex;align-items:center;font-size:13px;font-weight:500;color:${T.ink};padding:8px 18px;border-radius:999px;border:1px solid ${T.line};background:rgba(255,255,255,.78);backdrop-filter:blur(14px);cursor:pointer;transition:background .25s,border-color .25s}
        .st-pill:hover{background:#fff;border-color:#D6D3D1}
        .st-root a:focus-visible,.st-root button:focus-visible,.st-root select:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes st-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .st-node{transform-box:fill-box;transform-origin:center;animation:st-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.st-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:560px){.st-card{padding:22px 18px;border-radius:24px}.st-grid-half{grid-template-columns:1fr}}
        @media (prefers-reduced-motion:reduce){.st-node{animation:none}.st-btn-ink,.st-btn-outline,.st-pill,.st-row,.st-switch{transition:none}}
      `}</style>

            <div className="st-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="st-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="st-g1" style={{ width: "100%" }} />
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
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Account management</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text="Settings." style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 480 }}>
                                    Manage notifications, security, and platform preferences.
                                </motion.p>
                            </div>

                            <AnimatePresence>
                                {saved && (
                                    <motion.div role="status" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4, ease: EASE }}
                                        style={{ ...GLASS, borderRadius: 999, padding: "10px 20px 10px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                                        <IconTile d={ICONS.check} size={30} dark />
                                        <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Settings saved</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}>
                            {NAV_PILLS.map((p) => (
                                <button key={p.id} type="button" className="st-pill" onClick={() => scrollTo(p.id)}>{p.label}</button>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── SETTINGS ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <Section style={{ zIndex: 1, maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

                        <SettingsCard id="st-notifications" title="Notification preferences" subtitle="Control how and when CuraLink contacts you" icon={ICONS.bell}>
                            <Toggle enabled={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} icon={ICONS.mail}
                                label="Email notifications" desc="Appointment confirmations, cancellations, and platform updates." />
                            <Toggle enabled={smsReminders} onToggle={() => setSmsReminders(!smsReminders)} icon={ICONS.sms}
                                label="SMS reminders" desc="Reminders for your upcoming consultations sent by text." />
                            <Toggle enabled={availReminders} onToggle={() => setAvailReminders(!availReminders)} icon={ICONS.clock}
                                label="Availability update reminders" desc="Weekly prompts to update your schedule before the new week." />
                        </SettingsCard>

                        <SettingsCard id="st-security" title="Security & privacy" subtitle="Manage your credentials and data access controls" icon={ICONS.shield}>
                            <NavRow icon={ICONS.key} label="Change your password" to="/doctor/change-password" />
                            <NavRow icon={ICONS.privacy} label="Manage data & privacy settings" to="/doctor/privacy-settings" />
                            <NavRow icon={ICONS.shield} label="Two-factor authentication" to="/doctor/2fa" />
                        </SettingsCard>

                        <SettingsCard id="st-preferences" title="Platform preferences" subtitle="Language, timezone, and display settings" icon={ICONS.globe}>
                            <div className="st-grid-half">
                                <SelectField id="st-lang" label="Display language" value={language} onChange={setLanguage}
                                    options={[{ value: "en-US", label: "English (United States)" }, { value: "hi-IN", label: "हिन्दी (भारत)" }]} />
                                <SelectField id="st-tz" label="Timezone for schedule" value={timezone} onChange={setTimezone}
                                    options={[{ value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" }, { value: "America/New_York", label: "America/New_York (EST)" }]} />
                            </div>
                            <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} icon={ICONS.moon}
                                label="Dark mode theme" desc="Switch the doctor portal to a dark colour scheme." />
                        </SettingsCard>

                        <SettingsCard id="st-danger" title="Danger zone" subtitle="Irreversible account actions" icon={ICONS.trash} danger>
                            <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7, marginBottom: 20, maxWidth: 560 }}>
                                Permanently delete your CuraLink account and all associated patient records, appointment history, and analytics data. This action <strong style={{ color: T.ink, fontWeight: 500 }}>cannot be undone</strong>.
                            </p>
                            <button type="button" className="st-btn-outline"
                                onClick={() => window.confirm("Are you absolutely sure? This cannot be undone.") && alert("Account deletion initiated.")}>
                                <Icon d={ICONS.trash} size={14} color={T.ink} /> Request account deletion
                            </button>
                        </SettingsCard>

                        <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                            <button type="button" className="st-btn-ink" onClick={handleSave}>
                                <Icon d={ICONS.save} size={15} color="white" /> Save all settings
                            </button>
                        </motion.div>
                    </Section>
                </div>

            </div>
        </>
    );
};

export default DoctorSettingsPage;