import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring,
} from "framer-motion";

/* ─── THEME TOKENS (identical to HowItWorksPage, hero, footer, navbar) ─── */
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
const ORB_LIST = [ORBS.violet, ORBS.mint, ORBS.sun, ORBS.sky];
const GLASS = { background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${T.line}` };

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    help: ["M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5", "M12 18.5v.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"],
    plus: ["M12 5v14", "M5 12h14"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    steth: ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
};

/* ─── DATA (content unchanged, stray markdown asterisks removed) ────────── */
const faqData = [
    {
        question: "How do I register my clinic and myself on CuraLink?",
        answer: "Registration is simple! Click on the 'Register Your Clinic' button on our doctor's landing page. You'll be guided through a step-by-step process to provide your personal, professional, and clinic details. Our team will then verify your credentials before your profile goes live.",
    },
    {
        question: "What kind of verification is required for doctors?",
        answer: "We require standard medical registration proof (e.g., MCI/State Medical Council registration number), degree certificates, and clinic registration documents (if applicable). This ensures that only qualified and verified doctors are listed on our platform, maintaining trust and quality.",
    },
    {
        question: "How does the AI Symptom Analyzer benefit my practice?",
        answer: "While the AI Symptom Analyzer primarily guides patients to the type of specialist they might need, it can lead to more informed patients arriving at your clinic. For specialists, this can mean patients are more likely to be relevant to your field. We do not use it for direct diagnosis.",
    },
    {
        question: "Can I manage multiple clinic locations?",
        answer: "Yes, our Doctor Portal allows you to add and manage multiple clinic locations, each with its own address, timings, and services offered. You can set distinct availability for each location.",
    },
    {
        question: "How do I set my availability for appointments?",
        answer: "The Doctor Portal features an intuitive calendar tool where you can easily define your available time slots for both in-person and digital (telemedicine) consultations. You can set recurring availability or manage it day-by-day.",
    },
    {
        question: "What are the fees for using CuraLink?",
        answer: "Our fee structure is transparent and designed to be fair. We typically offer different subscription plans with varying features. Please visit our 'Pricing' page or contact our support team for detailed information on current plans.",
    },
    {
        question: "How does the telemedicine feature work?",
        answer: "Our secure telemedicine feature allows you to conduct video consultations directly through the CuraLink platform. When a patient books a digital slot, both you and the patient will receive a unique link to join the session at the scheduled time. It's designed to be easy to use and HIPAA-compliant (or compliant with relevant local data privacy laws).",
    },
    {
        question: "Is my patient data secure on CuraLink?",
        answer: "Absolutely. Data security and patient privacy are our top priorities. We employ robust encryption, secure servers, and adhere to strict data protection policies (like DPDPA in India) to safeguard all information. You control what patient information is accessible.",
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

const NeuralArt = ({ reduce, count = 46, style = {}, id = "fq-g", live = true }) => {
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
                    className={reduce || !live ? undefined : "fq-node"} style={{ animationDelay: `${n.d}s` }} />
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

const IconTile = ({ d, size = 48, dark = false }) => (
    <div style={{ width: size, height: size, borderRadius: 14, background: dark ? T.ink : T.surface, border: `1px solid ${dark ? T.ink : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={d} size={size > 40 ? 22 : 15} color={dark ? "#fff" : T.ink} />
    </div>
);

/* ─── ACCORDION ITEM ────────────────────────────────────────────────────── */
const FaqItem = ({ faq, i, isOpen, onToggle }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div variants={fadeUp} className={`fq-item${isOpen ? " fq-open" : ""}`}>
            <button
                className="fq-q"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-btn-${i}`}
            >
                <Bead bg={ORB_LIST[i % ORB_LIST.length]} size={16} />
                <span className="fq-qtext">{faq.question}</span>
                <span className="fq-toggle" aria-hidden>
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                        style={{ display: "flex" }}
                    >
                        <Icon d={ICONS.plus} size={15} color={isOpen ? "#fff" : T.ink} />
                    </motion.span>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                        style={{ overflow: "hidden" }}
                    >
                        <p className="fq-a">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorFaqPage = () => {
    const reduce = useReducedMotion();
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .fq-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip}
        .fq-root *{box-sizing:border-box;margin:0;padding:0}
        .fq-root ::selection{background:${T.ink};color:#fff}

        .fq-list{display:flex;flex-direction:column;gap:12px}
        .fq-item{background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border:1px solid ${T.line};border-radius:24px;box-shadow:0 18px 50px rgba(12,10,9,.03);transition:box-shadow .3s,border-color .3s,background .3s}
        .fq-item:hover{border-color:#D6D3D1;background:rgba(255,255,255,.92)}
        .fq-item.fq-open{border-color:#D6D3D1;background:#fff;box-shadow:0 30px 80px rgba(12,10,9,.08)}
        .fq-q{display:flex;align-items:center;gap:16px;width:100%;padding:22px 24px;background:none;border:0;border-radius:24px;text-align:left;cursor:pointer;font-family:inherit}
        .fq-qtext{flex:1;font-size:clamp(15px,2vw,17px);font-weight:400;color:${T.ink};letter-spacing:-0.02em;line-height:1.4}
        .fq-toggle{width:34px;height:34px;border-radius:12px;background:${T.surface};border:1px solid ${T.line};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .3s,border-color .3s}
        .fq-open .fq-toggle{background:${T.ink};border-color:${T.ink}}
        .fq-a{padding:0 24px 26px 56px;font-size:clamp(14.5px,2vw,15.5px);line-height:1.75;color:${T.body};max-width:640px}
        .fq-q:focus-visible{outline:2px solid ${T.ink};outline-offset:2px}

        .fq-root .btn-ink{display:inline-flex;align-items:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;transition:box-shadow .25s,transform .25s}
        .fq-root .btn-ink:hover{box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .fq-root .btn-ink svg{transition:transform .3s cubic-bezier(.22,1,.36,1)}
        .fq-root .btn-ink:hover svg:last-child{transform:translateX(4px)}
        .fq-root .btn-outline{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 28px;border-radius:999px;text-decoration:none;border:1px solid ${T.line};transition:background .25s,border-color .25s,transform .25s}
        .fq-root .btn-outline:hover{background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .fq-root a:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        @keyframes fq-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .fq-node{transform-box:fill-box;transform-origin:center;animation:fq-pulse 4.5s ease-in-out infinite}

        @media (max-width:900px){
          .fq-neural{opacity:.35!important;width:100%!important}
        }
        @media (max-width:560px){
          .fq-q{padding:18px 16px;gap:12px}
          .fq-a{padding:0 16px 22px 44px}
        }
        @media (prefers-reduced-motion:reduce){.fq-node{animation:none}.fq-item,.fq-toggle{transition:none}}
      `}</style>

            <ScrollProgress />
            <div className="fq-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "72px 24px 110px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 480, t: "-18%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 440, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 380, b: "-20%", l: "30%", o: 0.45 },
                    ]} />
                    <div className="fq-neural" aria-hidden style={{ position: "absolute", top: "4%", right: "2%", width: "min(50vw,620px)", opacity: 0.8, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={44} id="fq-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 50% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.28) 58%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
                        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
                            <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                <span style={{ position: "relative", width: 26, height: 26 }}>
                                    <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                    <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon d={ICONS.help} size={13} color="white" />
                                    </span>
                                </span>
                                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Doctor FAQ</span>
                            </span>
                        </motion.div>

                        <WordReveal as="h1" text={"Frequently asked\nquestions."} style={{ ...H, fontSize: "clamp(40px,6.5vw,84px)", lineHeight: 1.05, marginBottom: 24 }} />

                        <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                            Find answers to common questions doctors have about joining and using the CuraLink platform.
                        </motion.p>
                    </div>
                </Section>

                {/* ── ACCORDION ── */}
                <div style={{ position: "relative", padding: "110px 24px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 420, t: "10%", r: "-10%", o: 0.22 },
                        { c: "#A5D8FF", s: 460, t: "50%", l: "-12%", o: 0.3 },
                        { c: "#FFD9B8", s: 420, b: "4%", r: "-8%", o: 0.34 },
                    ]} />
                    <Section style={{ zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
                        <motion.div variants={stagger} className="fq-list">
                            {faqData.map((faq, i) => (
                                <FaqItem
                                    key={faq.question}
                                    faq={faq}
                                    i={i}
                                    isOpen={openIndex === i}
                                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                                />
                            ))}
                        </motion.div>
                    </Section>
                </div>

                {/* ── CTA ── */}
                <Section style={{ padding: "0 24px 110px" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <motion.div variants={scaleIn} style={{ position: "relative", overflow: "hidden", borderRadius: 32, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.08)", padding: "clamp(44px,6vw,84px) clamp(28px,6vw,72px)", transform: "translateZ(0)", background: `radial-gradient(ellipse 60% 70% at 50% 40%, rgba(201,184,255,0.5), rgba(165,216,255,0.22) 55%, rgba(255,255,255,0) 80%), radial-gradient(ellipse 40% 50% at 12% 100%, rgba(255,217,184,0.5), rgba(255,255,255,0) 70%), ${T.white}` }}>
                            <div aria-hidden style={{ position: "absolute", inset: "-10% 4%", opacity: 0.5, pointerEvents: "none" }}>
                                <NeuralArt reduce={reduce} live={false} count={52} id="fq-g3" style={{ width: "100%", height: "100%" }} />
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
                                    <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Doctor support</span>
                                </motion.div>
                                <WordReveal text={"Still have\nquestions?"} style={{ ...H, fontSize: "clamp(34px,5.6vw,68px)", lineHeight: 1.05, marginBottom: 20 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.7 }}>
                                    If you can't find the answer you're looking for, our dedicated support team is happy to help.
                                </motion.p>
                                <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                                    <Magnetic><Link to="/doctor/contact" className="btn-ink">Contact doctor support <Icon d={ICONS.arrow} size={15} color="white" /></Link></Magnetic>
                                    <Magnetic><Link to="/doctor/how-it-works" className="btn-outline">See how it works</Link></Magnetic>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </Section>

            </div>
        </>
    );
};

export default DoctorFaqPage;