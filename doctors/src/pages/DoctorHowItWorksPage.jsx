import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
    motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
} from "framer-motion";

/* ─── THEME TOKENS (identical to hero, footer, navbar and landing page) ─── */
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
const GRAD = "linear-gradient(180deg,#7C8CFF,#F6A5D8)";
const GLASS = { background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${T.line}` };

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
    steth: ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
    chart: ["M18 20V10", "M12 20V4", "M6 20v-6"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
    shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
};

/* ─── DATA (content unchanged) ──────────────────────────────────────────── */
const STEPS = [
    {
        num: "01", short: "Register & verify", icon: ICONS.check, bead: ORBS.violet,
        title: "Register & Verify Your Profile",
        desc: "Sign up in minutes and complete your professional profile. Our dedicated verification team reviews your credentials and medical registration within 24 hours — ensuring only qualified doctors join our network.",
        bullets: ["Quick 5-minute signup form", "Secure credential submission", "Verified badge on your profile", "24-hour review turnaround"],
        visual: {
            title: "Profile Verification",
            lines: [
                { label: "MBBS, MD — Cardiology", icon: ICONS.user, done: true },
                { label: "Medical Registration Verified", icon: ICONS.shield, done: true },
                { label: "Hospital Affiliation Confirmed", icon: ICONS.check, done: true },
                { label: "Profile Live on CuraLink", icon: ICONS.sparkle, done: false, pulse: true },
            ],
        },
    },
    {
        num: "02", short: "Set up clinic", icon: ICONS.user, bead: ORBS.mint,
        title: "Set Up Your Clinic & Services",
        desc: "Add details about your clinic locations, services offered, consultation fees, and upload a professional headshot. Build a profile that patients trust and that showcases the full breadth of your expertise.",
        bullets: ["Multiple clinic locations", "Physical & digital consultation types", "Custom consultation fees", "Patient-facing bio and photo"],
        visual: {
            title: "Clinic Setup",
            lines: [
                { label: "Apollo Clinic, Delhi · ₹800", icon: ICONS.steth, done: true },
                { label: "Fortis Hospital · ₹1,200", icon: ICONS.steth, done: true },
                { label: "Video Consult · ₹600", icon: ICONS.video, done: true },
                { label: "Services live & bookable", icon: ICONS.check, done: false, pulse: true },
            ],
        },
    },
    {
        num: "03", short: "Availability", icon: ICONS.calendar, bead: ORBS.sun,
        title: "Define Your Availability",
        desc: "Use our intuitive calendar to set your available slots for in-person and teleconsultation sessions. Block personal time, set recurring schedules, and update your calendar on the fly from any device.",
        bullets: ["Recurring weekly schedules", "Physical and digital slot types", "Holiday & break blocking", "Real-time availability sync"],
        visual: {
            title: "Weekly Schedule",
            slots: [
                { day: "Mon", time: "9 AM–1 PM" },
                { day: "Tue", time: "10 AM–3 PM" },
                { day: "Thu", time: "9 AM–12 PM" },
                { day: "Fri", time: "2 PM–6 PM" },
            ],
        },
    },
    {
        num: "04", short: "Start consulting", icon: ICONS.steth, bead: ORBS.sky,
        title: "Start Consulting & Managing Patients",
        desc: "Receive appointment bookings, manage your live patient queue for same-day visits, conduct secure teleconsultations, and issue digital prescriptions — all from one beautiful dashboard.",
        bullets: ["Live patient queue management", "Secure HD video consultations", "Digital prescription issuing", "Patient record access"],
        visual: {
            title: "Today's Dashboard",
            stats: [
                { label: "Appointments", value: "15" },
                { label: "Waiting", value: "7" },
                { label: "Teleconsults", value: "6" },
                { label: "Avg Wait", value: "15m" },
            ],
        },
    },
    {
        num: "05", short: "Grow practice", icon: ICONS.chart, bead: ORBS.violet,
        title: "Grow Your Practice",
        desc: "Leverage CuraLink's analytics to understand your practice performance, track no-show rates, monitor revenue trends, and identify growth opportunities. Focus on care — we handle the rest.",
        bullets: ["Revenue & volume analytics", "No-show rate tracking", "Patient satisfaction scores", "Practice growth insights"],
        visual: {
            title: "Practice Analytics",
            bars: [
                { label: "Jan", height: 40 }, { label: "Feb", height: 55 }, { label: "Mar", height: 48 },
                { label: "Apr", height: 70 }, { label: "May", height: 62 }, { label: "Jun", height: 85 },
            ],
        },
    },
];

/* ─── VARIANTS / SHARED PIECES ──────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const wordChild = { hidden: { y: "115%", rotate: 4 }, visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } } };
const H = { fontWeight: 300, color: T.ink, lineHeight: 1.06, letterSpacing: "-0.04em" };

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
    return <motion.div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#7C8CFF,#F6A5D8,#FFB36B)", transformOrigin: "0% 50%", scaleX, zIndex: 60 }} />;
};

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

const NeuralArt = ({ reduce, count = 46, style = {}, id = "hw-g", live = true }) => {
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
                    className={reduce || !live ? undefined : "hw-node"} style={{ animationDelay: `${n.d}s` }} />
            ))}
        </svg>
    );
};

const Section = ({ children, style = {}, once = true, ...rest }) => (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once, amount: 0.15 }} variants={stagger} style={{ position: "relative", ...style }} {...rest}>
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

const Magnetic = ({ children, strength = 0.28 }) => {
    const ref = useRef(null);
    const x = useMotionValue(0), y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
    return (
        <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}
            onMouseMove={(e) => {
                const r = ref.current.getBoundingClientRect();
                x.set((e.clientX - (r.left + r.width / 2)) * strength);
                y.set((e.clientY - (r.top + r.height / 2)) * strength);
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}>
            {children}
        </motion.div>
    );
};

const TiltCard = ({ children, style = {}, max = 5, ...rest }) => {
    const ref = useRef(null);
    const rx = useMotionValue(0), ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 180, damping: 18 });
    const sry = useSpring(ry, { stiffness: 180, damping: 18 });
    return (
        <motion.div ref={ref} className="hw-card"
            onMouseMove={(e) => {
                const r = ref.current.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
                ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2);
                ref.current.style.setProperty("--mx", `${px * 100}%`);
                ref.current.style.setProperty("--my", `${py * 100}%`);
            }}
            onMouseLeave={() => { rx.set(0); ry.set(0); }}
            style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, ...style }} {...rest}>
            {children}
        </motion.div>
    );
};

const IconTile = ({ d, size = 48, dark = false }) => (
    <div style={{ width: size, height: size, borderRadius: 14, background: dark ? T.ink : T.surface, border: `1px solid ${dark ? T.ink : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={d} size={size > 40 ? 22 : 15} color={dark ? "#fff" : T.ink} />
    </div>
);

/* ─── STEP VISUALS (glass cards, same language as the hero preview) ─────── */
const VisualTitle = ({ children, bead }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <p style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{children}</p>
        <Bead bg={bead} size={16} />
    </div>
);

const StepVisual = ({ step }) => {
    const { visual, bead } = step;

    if (visual.bars) {
        return (
            <div style={{ padding: "28px" }}>
                <VisualTitle bead={bead}>{visual.title}</VisualTitle>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
                    {visual.bars.map((b, i) => (
                        <motion.div key={i}
                            initial={{ height: 0 }} whileInView={{ height: `${b.height}%` }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
                            style={{ flex: 1, background: GRAD, borderRadius: "10px 10px 4px 4px", minHeight: 8, opacity: 0.55 + (i / visual.bars.length) * 0.45 }} />
                    ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    {visual.bars.map((b, i) => <p key={i} style={{ flex: 1, textAlign: "center", fontSize: 12, color: T.muted }}>{b.label}</p>)}
                </div>
            </div>
        );
    }

    if (visual.stats) {
        return (
            <div style={{ padding: "28px" }}>
                <VisualTitle bead={bead}>{visual.title}</VisualTitle>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {visual.stats.map((s, i) => (
                        <div key={i} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 18, padding: "16px 18px" }}>
                            <p style={{ fontSize: 12, color: T.muted }}>{s.label}</p>
                            <p style={{ fontSize: 32, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em", marginTop: 4 }}>{s.value}</p>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, background: T.ink, color: "#fff", borderRadius: 16, padding: "13px 18px", fontSize: 13, fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: "#5FD0A5" }} /> Queue is live
                </div>
            </div>
        );
    }

    if (visual.slots) {
        return (
            <div style={{ padding: "28px" }}>
                <VisualTitle bead={bead}>{visual.title}</VisualTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {visual.slots.map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                            style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 16, background: T.surface, border: `1px solid ${T.line}` }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, minWidth: 32 }}>{s.day}</span>
                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.line, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: EASE }}
                                    style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#7C8CFF,#F6A5D8)" }} />
                            </div>
                            <span style={{ fontSize: 12.5, color: T.body, whiteSpace: "nowrap" }}>{s.time}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "28px" }}>
            <VisualTitle bead={bead}>{visual.title}</VisualTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {visual.lines.map((line, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 16, background: line.done ? T.surface : T.white, border: `1px solid ${T.line}` }}>
                        <IconTile d={line.icon} size={30} dark={line.done} />
                        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: line.done ? T.ink : T.muted }}>{line.label}</span>
                        {line.pulse ? (
                            <span style={{ position: "relative", width: 10, height: 10 }}>
                                <motion.span animate={{ scale: [1, 2.2], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                    style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                            </span>
                        ) : line.done ? <Icon d={ICONS.check} size={15} color={T.ink} /> : null}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/* ─── ONE STEP ROW (text + 3D-entering visual) ──────────────────────────── */
const StepRow = ({ step, i }) => {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const dir = i % 2 === 0 ? 1 : -1;
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const rotateY = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], reduce ? [0, 0, 0, 0] : [dir * 28, 0, 0, dir * -18]);
    const z = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], reduce ? [0, 0, 0, 0] : [-300, 0, 0, -220]);
    const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3]);

    return (
        <Section id={`step-${i}`} style={{ scrollMarginTop: 110 }}>
            <div ref={ref} className={`hw-row${i % 2 ? " hw-flip" : ""}`} style={{ perspective: 1300, perspectiveOrigin: "50% 40%" }}>
                {/* text */}
                <div className="hw-text">
                    <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                        <IconTile d={step.icon} />
                        <span style={{ ...GLASS, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px", borderRadius: 20 }}>Step {step.num}</span>
                    </motion.div>

                    <WordReveal text={step.title} style={{ ...H, fontSize: "clamp(28px,3.8vw,46px)", marginBottom: 18 }} />
                    <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,16.5px)", color: T.body, lineHeight: 1.75, marginBottom: 28, maxWidth: 520 }}>{step.desc}</motion.p>

                    <motion.div variants={stagger} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {step.bullets.map((b) => (
                            <motion.div key={b} variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ width: 24, height: 24, borderRadius: 8, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Icon d={ICONS.check} size={12} color={T.ink} />
                                </span>
                                <span style={{ fontSize: 14.5, color: T.ink }}>{b}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* visual */}
                <motion.div className="hw-visual" style={{ rotateY, z, opacity, transformStyle: "preserve-3d", position: "relative" }}>
                    <div aria-hidden style={{ position: "absolute", inset: "-8%", borderRadius: "50%", background: step.bead, opacity: 0.18, filter: "blur(60px)", pointerEvents: "none" }} />
                    <TiltCard style={{ position: "relative" }}>
                        <StepVisual step={step} />
                    </TiltCard>
                </motion.div>
            </div>
        </Section>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const goTo = (i) => document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

const DoctorHowItWorksPage = () => {
    const reduce = useReducedMotion();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .hw-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip}
        .hw-root *{box-sizing:border-box;margin:0;padding:0}
        .hw-root ::selection{background:${T.ink};color:#fff}

        .hw-row{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
        .hw-flip .hw-text{order:2}
        .hw-flip .hw-visual{order:1}

        .hw-card{position:relative;isolation:isolate;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border-radius:28px;border:1px solid ${T.line};box-shadow:0 18px 50px rgba(12,10,9,.04);transition:box-shadow .3s,border-color .3s,background .3s;will-change:transform}
        .hw-card::before{content:"";position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(201,184,255,.28),rgba(255,255,255,0) 60%)}
        .hw-card:hover{border-color:#D6D3D1;background:rgba(255,255,255,.92);box-shadow:0 30px 80px rgba(12,10,9,.09)}
        .hw-card:hover::before{opacity:1}

        .hw-pill{display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);border:1px solid ${T.line};border-radius:999px;padding:9px 18px 9px 12px;font-family:inherit;font-size:13px;font-weight:500;color:${T.ink};cursor:pointer;transition:background .25s,border-color .25s,transform .25s}
        .hw-pill:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-2px)}

        .hw-root .btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;transition:box-shadow .25s,transform .25s}
        .hw-root .btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .hw-root .btn-ink svg{transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .hw-root .btn-ink:hover svg:last-child{transform:translateX(4px)}
        .hw-root .btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;text-decoration:none;border:1px solid ${T.line};transition:background .25s,border-color .25s,transform .25s}
        .hw-root .btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .hw-root a:focus-visible,.hw-pill:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes hw-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .hw-node{transform-box:fill-box;transform-origin:center;animation:hw-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){
          .hw-row{grid-template-columns:1fr;gap:36px}
          .hw-flip .hw-text,.hw-flip .hw-visual{order:0}
          .hw-neural{opacity:.35!important;width:100%!important}
        }
        @media (prefers-reduced-motion:reduce){.hw-node{animation:none}.hw-card{transition:none}}
      `}</style>

            <ScrollProgress />
            <div className="hw-root">

                {/* ── HEADER (hero language: aura, badge, light headline, glass pills) ── */}
                <Section style={{ padding: "72px 24px 110px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 480, t: "-18%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 440, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 380, b: "-20%", l: "30%", o: 0.45 },
                    ]} />
                    <div className="hw-neural" aria-hidden style={{ position: "absolute", top: "4%", right: "2%", width: "min(50vw,620px)", opacity: 0.8, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={44} id="hw-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 50% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.28) 58%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
                        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
                            <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                <span style={{ position: "relative", width: 26, height: 26 }}>
                                    <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                    <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon d={ICONS.sparkle} size={13} color="white" />
                                    </span>
                                </span>
                                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>How CuraLink works</span>
                            </span>
                        </motion.div>

                        <WordReveal as="h1" text={"Five steps to a\ntransformed practice."} style={{ ...H, fontSize: "clamp(40px,6.5vw,84px)", lineHeight: 1.05, marginBottom: 24 }} />

                        <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
                            Joining CuraLink is simple. Follow these steps to enhance your practice, connect with patients, and leverage our powerful digital tools.
                        </motion.p>

                        <motion.div variants={fadeUp} style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                            {STEPS.map((s, i) => (
                                <button key={s.num} className="hw-pill" onClick={() => goTo(i)}>
                                    <Bead bg={s.bead} size={16} />
                                    <span style={{ color: T.muted }}>{s.num}</span> {s.short}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── STEPS ── */}
                <div style={{ position: "relative", padding: "110px 24px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 420, t: "12%", r: "-10%", o: 0.22 },
                        { c: "#A5D8FF", s: 460, t: "46%", l: "-12%", o: 0.3 },
                        { c: "#FFD9B8", s: 420, b: "6%", r: "-8%", o: 0.34 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 130 }}>
                        {STEPS.map((step, i) => <StepRow key={step.num} step={step} i={i} />)}
                    </div>
                </div>

                {/* ── CTA (play-once, no scroll-linked transforms) ── */}
                <Section style={{ padding: "0 24px 110px" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <motion.div variants={scaleIn} style={{ position: "relative", overflow: "hidden", borderRadius: 32, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.08)", padding: "clamp(44px,6vw,84px) clamp(28px,6vw,72px)", transform: "translateZ(0)", background: `radial-gradient(ellipse 60% 70% at 50% 40%, rgba(201,184,255,0.5), rgba(165,216,255,0.22) 55%, rgba(255,255,255,0) 80%), radial-gradient(ellipse 40% 50% at 12% 100%, rgba(255,217,184,0.5), rgba(255,255,255,0) 70%), ${T.white}` }}>
                            <div aria-hidden style={{ position: "absolute", inset: "-10% 4%", opacity: 0.5, pointerEvents: "none" }}>
                                <NeuralArt reduce={reduce} live={false} count={52} id="hw-g3" style={{ width: "100%", height: "100%" }} />
                            </div>
                            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />
                            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                                <motion.div variants={fadeUp} style={{ background: "rgba(255,255,255,0.92)", border: `1px solid ${T.line}`, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px", marginBottom: 26 }}>
                                    <span style={{ position: "relative", width: 26, height: 26 }}>
                                        <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                        <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Icon d={ICONS.steth} size={13} color="white" />
                                        </span>
                                    </span>
                                    <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Setup takes less than an hour</span>
                                </motion.div>
                                <WordReveal text={"Ready to transform\nyour practice?"} style={{ ...H, fontSize: "clamp(34px,5.6vw,68px)", lineHeight: 1.05, marginBottom: 20 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.7 }}>
                                    Join thousands of forward-thinking doctors on CuraLink.
                                </motion.p>
                                <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                                    <Magnetic><Link to="/doctor/register" className="btn-ink">Register now <Icon d={ICONS.arrow} size={15} color="white" /></Link></Magnetic>
                                    <Magnetic><Link to="/doctor/features" className="btn-outline">Explore features</Link></Magnetic>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </Section>

            </div>
        </>
    );
};

export default DoctorHowItWorksPage;