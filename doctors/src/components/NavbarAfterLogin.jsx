import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

/* ─── THEME TOKENS (same as NavbarBeforeLogin, hero, footer and landing page) ─── */
const T = {
    ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
    surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    cross: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
    profile: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
    settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
    logout: ["M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"],
    chevronD: "M6 9l6 6 6-6",
};

/* ─── NAV ITEMS ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
    { label: "Dashboard", to: "/doctor/dashboard" },
    { label: "Appointments", to: "/doctor/appointments" },
    { label: "Patients", to: "/doctor/patients" },
    { label: "Queue", to: "/doctor/queue-management" },
    { label: "Availability", to: "/doctor/availability" },
];

const NOTIFS = [
    { msg: "Rohan Patel checked in for 10:30 AM", time: "2m ago", dot: "#7C8CFF" },
    { msg: "New appointment booked by Priya Kumari", time: "1h ago", dot: "#5FD0A5" },
    { msg: "Tomorrow's schedule: 15 appointments", time: "3h ago", dot: "#FFB36B" },
];

/* ─── SHARED PIECES ─────────────────────────────────────────────────────── */
const Magnetic = ({ children, strength = 0.22 }) => {
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

const LogoMark = () => (
    <span style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
        <motion.span aria-hidden animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
        <span style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.cross} size={17} color="white" />
        </span>
    </span>
);

const Avatar = ({ imageUrl, name, size = 32 }) => {
    const initials = name
        ? name.replace(/^Dr\.\s*/i, "").trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        : "DR";
    if (imageUrl) {
        return <img src={imageUrl} alt={name || "Avatar"} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `1px solid ${T.line}`, flexShrink: 0 }} />;
    }
    return (
        <div style={{ width: size, height: size, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.max(11, Math.floor(size * 0.38)), fontWeight: 500, color: "#fff", flexShrink: 0 }}>
            {initials || "DR"}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════ */
const DoctorNavbar = () => {
    const { logout, doctor } = useContext(AuthContext) || {};
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [hover, setHover] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const reduce = useReducedMotion();
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const lastY = useRef(0);
    const lockRef = useRef(false);

    const doctorName = doctor?.name || doctor?.doctorName || "Doctor";
    const doctorEmail = doctor?.email || doctor?.doctorEmail || "doctor@curalink.pro";
    const doctorImage = doctor?.image || doctor?.profilePic || doctor?.avatar || null;

    lockRef.current = mobileOpen || dropdownOpen || notifOpen;

    // scroll state: compact when scrolled, tucks away going down, returns going up
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const y = window.scrollY, d = y - lastY.current;
                setScrolled(y > 24);
                if (y < 160 || d < -6) setHidden(false);
                else if (d > 6 && !lockRef.current) setHidden(true);
                if (Math.abs(d) > 6) lastY.current = y;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
    }, []);

    // outside clicks
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // close everything on route change, Escape, or growing past the breakpoint
    useEffect(() => {
        setMobileOpen(false); setDropdownOpen(false); setNotifOpen(false);
    }, [location.pathname]);
    useEffect(() => {
        const closeAll = () => { setMobileOpen(false); setDropdownOpen(false); setNotifOpen(false); };
        const onKey = (e) => e.key === "Escape" && closeAll();
        const onResize = () => window.innerWidth > 900 && setMobileOpen(false);
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
    }, []);
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleLogout = () => {
        setDropdownOpen(false);
        setMobileOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("doctor");
        if (logout) logout();
        navigate("/doctor/login");
    };

    const activeIdx = NAV_ITEMS.findIndex((l) => location.pathname === l.to || location.pathname.startsWith(l.to + "/"));
    const lit = hover ?? (activeIdx >= 0 ? activeIdx : null);
    const menuOpen = mobileOpen || dropdownOpen || notifOpen;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .nv-root { position:sticky; top:0; z-index:100; height:84px; pointer-events:none; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; -webkit-font-smoothing:antialiased; }
        .nv-root *, .nv-root *::before, .nv-root *::after { box-sizing:border-box; }
        .nv-pill {
          pointer-events:auto; position:relative; margin:14px auto 0; width:calc(100% - 32px); max-width:1120px; height:58px;
          display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:0 10px 0 16px;
          background:rgba(255,255,255,0.7); backdrop-filter:blur(18px) saturate(1.4); -webkit-backdrop-filter:blur(18px) saturate(1.4);
          border:1px solid ${T.line}; border-radius:999px; box-shadow:0 8px 30px rgba(12,10,9,0.03);
          transition:max-width .6s cubic-bezier(.22,1,.36,1), background .3s, box-shadow .3s, border-color .3s;
        }
        .nv-pill[data-scrolled="true"] { max-width:980px; background:rgba(255,255,255,0.88); border-color:#E7E5E4; box-shadow:0 18px 50px rgba(12,10,9,0.09); }
        .nv-pill[data-open="true"] { background:rgba(255,255,255,0.96); }

        .nv-brand { display:flex; align-items:center; gap:10px; text-decoration:none; justify-self:start; border-radius:999px; }
        .nv-word { font-size:20px; font-weight:500; letter-spacing:-0.04em; color:${T.ink}; line-height:1; }
        .nv-tag { font-size:11.5px; font-weight:500; color:${T.body}; background:${T.surface}; border:1px solid ${T.line}; padding:3px 10px; border-radius:999px; }

        .nv-links { display:flex; align-items:center; gap:2px; position:relative; }
        .nv-link { position:relative; display:inline-flex; align-items:center; padding:9px 15px; font-size:14px; font-weight:500; color:${T.body}; text-decoration:none; border-radius:999px; transition:color .2s; }
        .nv-link[data-lit="true"] { color:${T.ink}; }
        .nv-hi { position:absolute; inset:0; border-radius:999px; background:${T.surface}; border:1px solid ${T.line}; z-index:0; }
        .nv-link span.nv-t { position:relative; z-index:1; }

        .nv-right { display:flex; align-items:center; gap:8px; justify-self:end; }
        .nv-icon-btn { position:relative; width:40px; height:40px; border-radius:50%; border:1px solid ${T.line}; background:rgba(255,255,255,0.85); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s, border-color .2s; }
        .nv-icon-btn:hover, .nv-icon-btn[aria-expanded="true"] { background:#fff; border-color:#D6D3D1; }
        .nv-dot { position:absolute; top:9px; right:10px; width:8px; height:8px; border-radius:50%; background:${T.ink}; border:2px solid #fff; }
        .nv-profile { display:flex; align-items:center; gap:8px; padding:4px 10px 4px 4px; height:40px; border-radius:999px; border:1px solid ${T.line}; background:rgba(255,255,255,0.85); cursor:pointer; font-family:inherit; transition:background .2s, border-color .2s; }
        .nv-profile:hover, .nv-profile[aria-expanded="true"] { background:#fff; border-color:#D6D3D1; }
        .nv-name { font-size:13.5px; font-weight:500; color:${T.ink}; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .nv-pop { pointer-events:auto; position:absolute; right:0; top:calc(100% + 12px); background:rgba(255,255,255,0.95); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid ${T.line}; border-radius:28px; box-shadow:0 30px 80px rgba(12,10,9,0.14); overflow:hidden; z-index:200;
          background-image:radial-gradient(ellipse 70% 50% at 100% 0%, rgba(201,184,255,0.28), transparent 70%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(255,217,184,0.32), transparent 70%); }
        .nv-pop-head { padding:18px 20px 12px; border-bottom:1px solid ${T.line}; }
        .nv-item { display:flex; align-items:center; gap:12px; width:100%; padding:10px 12px; border-radius:18px; text-decoration:none; background:none; border:0; cursor:pointer; font-family:inherit; text-align:left; transition:background .2s; }
        .nv-item:hover { background:${T.surface}; }
        .nv-item-t { font-size:14px; font-weight:500; color:${T.ink}; }
        .nv-tile { width:34px; height:34px; border-radius:11px; background:${T.surface}; border:1px solid ${T.line}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

        .nv-btn-ink { display:inline-flex; align-items:center; gap:8px; background:${T.ink}; color:#fff; font-weight:500; font-size:13.5px; padding:11px 22px; border-radius:999px; text-decoration:none; border:0; cursor:pointer; font-family:inherit; transition:box-shadow .25s, transform .25s; white-space:nowrap; }
        .nv-btn-ink:hover { box-shadow:0 12px 30px rgba(12,10,9,0.25); transform:translateY(-1px); }

        .nv-burger { display:none; width:42px; height:42px; border-radius:50%; border:1px solid ${T.line}; background:rgba(255,255,255,0.85); cursor:pointer; align-items:center; justify-content:center; position:relative; }
        .nv-burger i { position:absolute; left:13px; right:13px; height:1.6px; background:${T.ink}; border-radius:2px; transition:transform .35s cubic-bezier(.22,1,.36,1), opacity .2s; }
        .nv-burger i:nth-child(1) { transform:translateY(-4px); }
        .nv-burger i:nth-child(2) { transform:translateY(4px); }
        .nv-burger[aria-expanded="true"] i:nth-child(1) { transform:rotate(45deg); }
        .nv-burger[aria-expanded="true"] i:nth-child(2) { transform:rotate(-45deg); }

        .nv-sheet {
          pointer-events:auto; position:absolute; left:16px; right:16px; top:calc(100% - 20px); max-width:520px; margin:0 auto; max-height:calc(100vh - 110px); overflow:auto;
          background:rgba(255,255,255,0.94); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          border:1px solid ${T.line}; border-radius:32px; padding:10px; box-shadow:0 30px 80px rgba(12,10,9,0.14);
          background-image:radial-gradient(ellipse 70% 50% at 100% 0%, rgba(201,184,255,0.35), transparent 70%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(255,217,184,0.4), transparent 70%);
        }
        .nv-m-link { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-radius:22px; text-decoration:none; font-size:26px; font-weight:300; letter-spacing:-0.04em; color:${T.ink}; transition:background .2s; }
        .nv-m-link:hover, .nv-m-link[aria-current="page"] { background:${T.surface}; }
        .nv-m-sub { display:flex; align-items:center; gap:12px; padding:12px 20px; border-radius:20px; text-decoration:none; font-size:15px; font-weight:500; color:${T.ink}; background:none; border:0; width:100%; cursor:pointer; font-family:inherit; text-align:left; transition:background .2s; }
        .nv-m-sub:hover { background:${T.surface}; }

        .nv-root a:focus-visible, .nv-root button:focus-visible { outline:2px solid ${T.ink}; outline-offset:3px; }

        @media (max-width: 900px) {
          .nv-pill { grid-template-columns:1fr auto; }
          .nv-links, .nv-name, .nv-chev { display:none; }
          .nv-profile { padding:4px; }
          .nv-burger { display:flex; }
          .nv-pop { position:fixed; left:16px; right:16px; top:84px; width:auto !important; }
        }
        @media (max-width: 520px) { .nv-tag { display:none; } }
        @media (prefers-reduced-motion: reduce) { .nv-pill, .nv-burger i, .nv-btn-ink, .nv-item, .nv-icon-btn, .nv-profile { transition:none; } }
      `}</style>

            <header className="nv-root">
                <motion.nav
                    className="nv-pill"
                    data-scrolled={scrolled}
                    data-open={menuOpen}
                    aria-label="Main"
                    initial={{ y: -90, opacity: 0 }}
                    animate={{ y: hidden && !menuOpen ? -100 : 0, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: hidden ? 0.35 : 0.7, ease: EASE }}
                >
                    {/* brand */}
                    <Link to="/doctor/dashboard" className="nv-brand" aria-label="CuraLink Pro, dashboard">
                        <LogoMark />
                        <span className="nv-word">CuraLink</span>
                        <span className="nv-tag">Pro</span>
                    </Link>

                    {/* links with a pill that glides between items */}
                    <div className="nv-links" onMouseLeave={() => setHover(null)}>
                        {NAV_ITEMS.map((l, i) => (
                            <Link key={l.to} to={l.to} className="nv-link" data-lit={lit === i}
                                aria-current={activeIdx === i ? "page" : undefined}
                                onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
                                {lit === i && (
                                    <motion.span layoutId="nv-hi" className="nv-hi"
                                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} />
                                )}
                                <span className="nv-t">{l.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* right controls */}
                    <div className="nv-right">

                        {/* notifications */}
                        <div ref={notifRef} style={{ position: "relative" }}>
                            <button className="nv-icon-btn" aria-label="Notifications" aria-expanded={notifOpen} aria-haspopup="true"
                                onClick={() => { setNotifOpen((p) => !p); setDropdownOpen(false); setMobileOpen(false); }}>
                                <Icon d={ICONS.bell} size={17} color={T.ink} />
                                <span className="nv-dot" />
                            </button>
                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div className="nv-pop" style={{ width: 320 }}
                                        initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.3, ease: EASE }}>
                                        <div className="nv-pop-head">
                                            <p style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>Notifications</p>
                                        </div>
                                        <div style={{ padding: 8 }}>
                                            {NOTIFS.map((n, i) => (
                                                <div key={i} className="nv-item" style={{ alignItems: "flex-start", cursor: "default" }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: n.dot, marginTop: 6, flexShrink: 0 }} />
                                                    <div>
                                                        <p style={{ fontSize: 13.5, color: T.ink, fontWeight: 500, lineHeight: 1.45 }}>{n.msg}</p>
                                                        <p style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* profile */}
                        <div ref={dropdownRef} style={{ position: "relative" }}>
                            <button className="nv-profile" aria-label="Account menu" aria-expanded={dropdownOpen} aria-haspopup="true"
                                onClick={() => { setDropdownOpen((p) => !p); setNotifOpen(false); setMobileOpen(false); }}>
                                <Avatar imageUrl={doctorImage} name={doctorName} size={30} />
                                <span className="nv-name">{doctorName}</span>
                                <motion.span className="nv-chev" animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ display: "flex" }}>
                                    <Icon d={ICONS.chevronD} size={14} color={T.muted} />
                                </motion.span>
                            </button>
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div className="nv-pop" style={{ width: 270 }}
                                        initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.3, ease: EASE }}>
                                        <div className="nv-pop-head" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <Avatar imageUrl={doctorImage} name={doctorName} size={40} />
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <p style={{ fontSize: 14.5, fontWeight: 500, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doctorName}</p>
                                                <p style={{ fontSize: 12, color: T.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doctorEmail}</p>
                                            </div>
                                        </div>
                                        <div style={{ padding: 8 }}>
                                            <Link to="/doctor/profile" className="nv-item" onClick={() => setDropdownOpen(false)}>
                                                <span className="nv-tile"><Icon d={ICONS.profile} size={15} color={T.ink} /></span>
                                                <span className="nv-item-t">My profile</span>
                                            </Link>
                                            <Link to="/doctor/settings" className="nv-item" onClick={() => setDropdownOpen(false)}>
                                                <span className="nv-tile"><Icon d={ICONS.settings} size={15} color={T.ink} /></span>
                                                <span className="nv-item-t">Account settings</span>
                                            </Link>
                                        </div>
                                        <div style={{ height: 1, background: T.line, margin: "0 16px" }} />
                                        <div style={{ padding: 8 }}>
                                            <button className="nv-item" onClick={handleLogout}>
                                                <span className="nv-tile" style={{ background: T.ink, borderColor: T.ink }}><Icon d={ICONS.logout} size={15} color="#fff" /></span>
                                                <span className="nv-item-t">Sign out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* mobile toggle */}
                        <button className="nv-burger" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}
                            aria-controls="nv-sheet"
                            onClick={() => { setMobileOpen((o) => !o); setDropdownOpen(false); setNotifOpen(false); }}>
                            <i /><i />
                        </button>
                    </div>

                    {/* mobile sheet */}
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.div id="nv-sheet" className="nv-sheet"
                                initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.3, ease: EASE }}>
                                {NAV_ITEMS.map((l, i) => (
                                    <motion.div key={l.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}>
                                        <Link to={l.to} className="nv-m-link" aria-current={activeIdx === i ? "page" : undefined}>
                                            {l.label} <Icon d={ICONS.arrow} size={18} color={T.muted} />
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.32, duration: 0.5, ease: EASE }}
                                    style={{ borderTop: `1px solid ${T.line}`, margin: "8px 10px 0", paddingTop: 8 }}>
                                    <Link to="/doctor/profile" className="nv-m-sub"><Icon d={ICONS.profile} size={17} color={T.ink} /> My profile</Link>
                                    <Link to="/doctor/settings" className="nv-m-sub"><Icon d={ICONS.settings} size={17} color={T.ink} /> Account settings</Link>
                                    <div style={{ padding: "10px 0 6px" }}>
                                        <button className="nv-btn-ink" onClick={handleLogout} style={{ width: "100%", justifyContent: "center", padding: "15px 22px", fontSize: 14.5 }}>
                                            <Icon d={ICONS.logout} size={16} color="white" /> Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </header>
        </>
    );
};

export default DoctorNavbar;