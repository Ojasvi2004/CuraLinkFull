import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
);

const ICONS = {
    calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
    search: ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
    ai: ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
    pill: "M10.5 3.5a4 4 0 0 1 5.657 5.657l-7.07 7.07a4 4 0 0 1-5.658-5.656l7.07-7.07z M14 10l-4 4",
    doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
    bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    heart: ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    chevron: "m9 18 6-6-6-6",
    sun: ["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"],
};

// ─── QUICK LINK DATA ────────────────────────────────────────────────────────────
const quickLinks = [
    {
        title: "My Appointments",
        description: "View and manage upcoming and past consultations with your doctors.",
        icon: ICONS.calendar,
        link: "/my-appointments",
        gradient: "linear-gradient(135deg,#6366F1,#8B5CF6)",
        glow: "rgba(99,102,241,0.28)",
        iconBg: "#EEF2FF",
        iconColor: "#6366F1",
        tag: "Consultations",
    },
    {
        title: "Find Doctors",
        description: "Search our verified network of specialists and book instantly.",
        icon: ICONS.search,
        link: "/find-doctors",
        gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)",
        glow: "rgba(14,165,233,0.25)",
        iconBg: "#E0F2FE",
        iconColor: "#0284C7",
        tag: "Directory",
    },
    {
        title: "AI Symptom Analyzer",
        description: "Get intelligent, real-time guidance on symptoms before your visit.",
        icon: ICONS.ai,
        link: "/symptom-analyzer",
        gradient: "linear-gradient(135deg,#10B981,#34D399)",
        glow: "rgba(16,185,129,0.25)",
        iconBg: "#ECFDF5",
        iconColor: "#059669",
        tag: "AI-Powered",
    },
    //   {
    //     title: "My Prescriptions",
    //     description: "Access, upload, and organise your digital prescription vault.",
    //     icon: ICONS.pill,
    //     link: "/prescriptions",
    //     gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)",
    //     glow: "rgba(245,158,11,0.25)",
    //     iconBg: "#FFFBEB",
    //     iconColor: "#D97706",
    //     tag: "Health Vault",
    //   },
    {
        title: "Health Records",
        description: "Manage your complete health profile, history and lab reports.",
        icon: ICONS.doc,
        link: "/health-records",
        gradient: "linear-gradient(135deg,#EC4899,#F472B6)",
        glow: "rgba(236,72,153,0.25)",
        iconBg: "#FDF2F8",
        iconColor: "#DB2777",
        tag: "Records",
    },
    {
        title: "Notifications",
        description: "Stay updated with appointment reminders and doctor messages.",
        icon: ICONS.bell,
        link: "/notifications",
        gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)",
        glow: "rgba(139,92,246,0.25)",
        iconBg: "#F5F3FF",
        iconColor: "#7C3AED",
        tag: "Updates",
    },
];

// ─── RECENT ACTIVITY (mock — wire to your API) ─────────────────────────────────
const MOCK_ACTIVITY = [
    { id: 1, label: "Appointment booked with Dr. Priya Reddy", time: "2h ago", type: "appointment", icon: ICONS.calendar, color: "#6366F1", bg: "#EEF2FF", link: "/my-appointments" },
    { id: 2, label: "Prescription uploaded — Dermatology", time: "Yesterday", type: "prescription", icon: ICONS.pill, color: "#D97706", bg: "#FFFBEB", link: "/prescriptions" },
    { id: 3, label: "AI Symptom report generated", time: "3 days ago", type: "ai", icon: ICONS.ai, color: "#059669", bg: "#ECFDF5", link: "/symptom-analyzer" },
];

const HEALTH_TIP = "Staying hydrated is one of the simplest ways to support your energy, focus, and immunity. Aim for 8 glasses of water a day — your body will thank you.";

// ─── GREETING ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

// ─── QUICK LINK CARD ───────────────────────────────────────────────────────────
const QuickCard = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 * index, type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ y: -6, boxShadow: `0 20px 48px ${item.glow}` }}
        style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.25s" }}
    >
        <Link to={item.link} style={{ textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Gradient top bar */}
            <div style={{ height: 4, background: item.gradient }} />

            <div style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="flex items-start justify-between mb-4">
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon d={item.icon} size={22} color={item.iconColor} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.iconColor, background: item.iconBg, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase" }}>{item.tag}</span>
                </div>

                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 6, lineHeight: 1.25 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, flex: 1 }}>{item.description}</p>

                <div className="flex items-center gap-1 mt-4" style={{ color: item.iconColor, fontWeight: 700, fontSize: 12 }}>
                    Go to {item.title} <Icon d={ICONS.arrow} size={13} color={item.iconColor} style={{ marginLeft: 2 }} />
                </div>
            </div>
        </Link>
    </motion.div>
);

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { token, user } = useContext(Authcontext);
    const userName = user?.name || "there";
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(t);

    }, []);

    const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const dateStr = time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

                {/* Blobs */}
                <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

                    {/* ── HERO HEADER ── */}
                    <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                        style={{ background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#A78BFA 100%)", borderRadius: 24, padding: "36px 40px", marginBottom: 32, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(99,102,241,0.35)" }}>

                        {/* Decorative circles inside hero */}
                        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -30, right: 120, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon d={ICONS.sun} size={16} color="rgba(255,255,255,0.8)" />
                                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>{getGreeting()}</p>
                                </div>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                                    {userName}<span style={{ color: "rgba(255,255,255,0.6)" }}>.</span>
                                </h1>
                                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6 }}>Your personal health hub is ready for you.</p>
                            </div>

                            {/* Live clock */}
                            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 18, padding: "16px 24px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center", flexShrink: 0 }}>
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{dateStr}</p>
                                <p style={{ color: "white", fontSize: 26, fontWeight: 800, letterSpacing: "0.04em", marginTop: 4 }}>{timeStr}</p>
                            </div>
                        </div>

                        {/* Mini stat pills */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {[
                                { label: "Next Appointment", value: "Tomorrow 10 AM", icon: ICONS.calendar },
                                // { label: "Active Prescriptions", value: "2 Active", icon: ICONS.pill },
                                { label: "Health Score", value: "Good", icon: ICONS.heart },
                            ].map((s, i) => (
                                <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Icon d={s.icon} size={14} color="rgba(255,255,255,0.85)" />
                                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{s.label}:</span>
                                    <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── SECTION LABEL ── */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-6">
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.sparkle} size={17} color="#6366F1" />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Quick Access</p>
                            <p style={{ fontSize: 13, color: "#64748B", marginTop: 1 }}>Everything you need, one tap away</p>
                        </div>
                    </motion.div>

                    {/* ── QUICK LINKS GRID ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                        {quickLinks.map((item, i) => <QuickCard key={i} item={item} index={i} />)}
                    </div>

                    {/* ── BOTTOM ROW ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Personal Health Snapshot — 3/5 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            style={{
                                gridColumn: "span 3",
                                background: "white",
                                borderRadius: 20,
                                border: "1px solid #EEF2FF",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    padding: "20px 24px 14px",
                                    borderBottom: "1px solid #F1F5F9",
                                }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon d={ICONS.heart} size={17} color="#6366F1" />
                                    <span
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: 17,
                                            fontWeight: 700,
                                            color: "#0F172A",
                                        }}
                                    >
                                        Personal Health Snapshot
                                    </span>
                                </div>

                                <Link
                                    to="/health-records"
                                    style={{
                                        fontSize: 12,
                                        color: "#6366F1",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                >
                                    View Details →
                                </Link>
                            </div>

                            {/* Stats */}
                            <div
                                style={{
                                    padding: 20,
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2,1fr)",
                                    gap: 16,
                                }}
                            >
                                {[
                                    {
                                        title: "Health Records",
                                        value: 14,
                                        icon: ICONS.doc,
                                        color: "#EC4899",
                                        bg: "#FDF2F8",
                                    },
                                    {
                                        title: "Appointments",
                                        value: 2,
                                        icon: ICONS.calendar,
                                        color: "#6366F1",
                                        bg: "#EEF2FF",
                                    },
                                    {
                                        title: "Lab Reports",
                                        value: 5,
                                        icon: ICONS.activity,
                                        color: "#10B981",
                                        bg: "#ECFDF5",
                                    },
                                    {
                                        title: "Health Score",
                                        value: "Good",
                                        icon: ICONS.heart,
                                        color: "#EF4444",
                                        bg: "#FEF2F2",
                                    },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -3 }}
                                        style={{
                                            border: "1px solid #EEF2FF",
                                            borderRadius: 16,
                                            padding: 16,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            background: "#fff",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 46,
                                                height: 46,
                                                borderRadius: 14,
                                                background: item.bg,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Icon d={item.icon} size={20} color={item.color} />
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    fontSize: 12,
                                                    color: "#64748B",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {item.title}
                                            </p>

                                            <p
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                    color: "#0F172A",
                                                }}
                                            >
                                                {item.value}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div
                                style={{
                                    borderTop: "1px solid #F1F5F9",
                                    padding: "14px 20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "#FAFBFF",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: "#64748B",
                                    }}
                                >
                                    Last updated: Today
                                </span>

                                <span
                                    style={{
                                        fontSize: 12,
                                        color: "#10B981",
                                        fontWeight: 600,
                                    }}
                                >
                                    ✓ Profile Healthy
                                </span>
                            </div>
                        </motion.div>

                        {/* Health tip — 2/5 */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                            style={{ gridColumn: "span 2", background: "linear-gradient(145deg,#6366F1 0%,#8B5CF6 100%)", borderRadius: 20, padding: "28px 26px", boxShadow: "0 8px 32px rgba(99,102,241,0.3)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220 }}>
                            <div>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                                    <Icon d={ICONS.sparkle} size={20} color="white" />
                                </div>
                                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Health Tip of the Day</p>
                                <p style={{ color: "white", fontSize: 14, lineHeight: 1.65, fontWeight: 400 }}>{HEALTH_TIP}</p>
                            </div>
                            <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                <Icon d={ICONS.heart} size={14} color="rgba(255,255,255,0.7)" />
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>Stay consistent. Small habits, big results.</span>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;