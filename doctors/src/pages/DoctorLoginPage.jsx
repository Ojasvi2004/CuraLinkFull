import React, { useState, useContext, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to dashboard, add-patient, settings, registration) ─── */
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
    mail: ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
    lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
    steth: ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
};

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.94-2.27 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

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

const NeuralArt = ({ reduce, count = 40, style = {}, id = "dl-g" }) => {
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
                    className={reduce ? undefined : "dl-node"} style={{ animationDelay: `${n.d}s` }} />
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

const IconField = ({ label, id, icon, ...rest }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</label>
        <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
                <Icon d={icon} size={15} color={T.muted} />
            </span>
            <input id={id} className="dl-input" {...rest} />
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorLoginPage = () => {
    const reduce = useReducedMotion();
    const navigate = useNavigate();
    const { token, settoken } = useContext(AuthContext);

    const [formdata, setformdata] = useState({ email: "", password: "" });

    const handleChanges = (e) => {
        setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${server}/api/doctors/login`, formdata);

            if (response.data.success) {
                const tokengot = response.data.token;
                console.log("Login Successfull", tokengot);

                settoken(tokengot);
                localStorage.setItem("token", tokengot);

                navigate("/doctor/dashboard");
            } else {
                console.error(`Could not get the response`);
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dl-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .dl-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
        .dl-root ::selection{background:${T.ink};color:#fff}
        .dl-root a{text-decoration:none}
        .dl-link{color:${T.ink};font-weight:500;text-decoration:underline!important;text-underline-offset:3px;text-decoration-color:${T.line}!important;transition:text-decoration-color .2s}
        .dl-link:hover{text-decoration-color:${T.ink}!important}

        .dl-card{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:28px;padding:32px;box-shadow:0 30px 80px rgba(12,10,9,.08)}
        .dl-input{width:100%;padding:13px 18px 13px 44px;border:1px solid ${T.line};border-radius:16px;font-size:14.5px;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .dl-input::placeholder{color:#C4BFBA}
        .dl-input:focus{border-color:${T.ink};background:#fff}

        .dl-check{display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13.5px;color:${T.body}}
        .dl-check input{appearance:none;flex-shrink:0;width:20px;height:20px;border:1px solid #D6D3D1;border-radius:7px;background:#fff;cursor:pointer;display:grid;place-content:center;transition:background .2s,border-color .2s}
        .dl-check input::after{content:"";width:10px;height:6px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translate(1px,-1px) scale(0);transition:transform .15s}
        .dl-check input:checked{background:${T.ink};border-color:${T.ink}}
        .dl-check input:checked::after{transform:rotate(-45deg) translate(1px,-1px) scale(1)}

        .dl-btn-ink{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 32px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;transition:box-shadow .25s,transform .25s}
        .dl-btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .dl-btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:10px;width:100%;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;font-family:inherit;transition:background .25s,border-color .25s,transform .25s}
        .dl-btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .dl-root a:focus-visible,.dl-root button:focus-visible,.dl-check input:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes dl-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .dl-node{transform-box:fill-box;transform-origin:center;animation:dl-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){.dl-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:560px){.dl-card{padding:24px 18px;border-radius:24px}}
        @media (prefers-reduced-motion:reduce){.dl-node{animation:none}.dl-btn-ink,.dl-btn-outline{transition:none}}
      `}</style>

            <div className="dl-root">
                <Section style={{ minHeight: "100vh", padding: "64px 24px 80px", overflow: "hidden", display: "flex", alignItems: "center", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="dl-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="dl-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 40% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, margin: "0 auto" }}>
                        <motion.div variants={fadeUp} style={{ marginBottom: 22 }}>
                            <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                <span style={{ position: "relative", width: 26, height: 26 }}>
                                    <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                    <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon d={ICONS.steth} size={13} color="white" />
                                    </span>
                                </span>
                                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Doctor portal</span>
                            </span>
                        </motion.div>

                        <WordReveal as="h1" text={"Welcome\nback."} style={{ ...H, fontSize: "clamp(38px,6vw,64px)", marginBottom: 14 }} />
                        <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, marginBottom: 32 }}>
                            Sign in to your CuraLink dashboard to manage your practice.
                        </motion.p>

                        <motion.div variants={fadeUp} className="dl-card">
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <IconField label="Email address" id="doctorEmail" icon={ICONS.mail} name="email" type="email"
                                    onChange={handleChanges} autoComplete="email" required placeholder="you@example.com" />
                                <IconField label="Password" id="doctorPassword" icon={ICONS.lock} name="password" type="password"
                                    onChange={handleChanges} autoComplete="current-password" required placeholder="Your password" />

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                                    <label htmlFor="remember-doctor" className="dl-check">
                                        <input id="remember-doctor" name="remember-doctor" type="checkbox" />
                                        Remember me
                                    </label>
                                    <Link to="/doctor/forgot-password" className="dl-link" style={{ fontSize: 13.5 }}>Forgot your password?</Link>
                                </div>

                                <button type="submit" className="dl-btn-ink">
                                    Sign in <Icon d={ICONS.arrow} size={14} color="white" />
                                </button>
                            </form>

                            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
                                <div style={{ flex: 1, height: 1, background: T.line }} />
                                <span style={{ fontSize: 12.5, color: T.muted }}>Or sign in with</span>
                                <div style={{ flex: 1, height: 1, background: T.line }} />
                            </div>

                            <button type="button" className="dl-btn-outline" onClick={() => alert("Google Sign-in for Doctors (UI only)")}>
                                <GoogleIcon /> Sign in with Google
                            </button>
                        </motion.div>

                        <motion.p variants={fadeUp} style={{ marginTop: 28, textAlign: "center", fontSize: 14, color: T.body }}>
                            Not yet part of CuraLink? <Link to="/doctor/register" className="dl-link">Register your practice</Link>
                        </motion.p>
                    </div>
                </Section>
            </div>
        </>
    );
};

export default DoctorLoginPage;