import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

/* ─── THEME TOKENS ──────────────────────────────────────────────────────── */
const T = {
  ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
  surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];
const ORB_VIOLET = "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)";

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
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  cog: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  chevronD: "M6 9l6 6 6-6",
};

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/find-doctors", label: "Find Doctors" },
  { to: "/symptom-analyzer", label: "AI Analyzer" },
  { to: "/my-appointments", label: "Appointments" },
];

const MOCK_NOTIFS = [];

// ink mark with a soft pulse
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

const NavbarAfterLogin = ({
  userName: propUserName = "Aarav Sharma",
  userProfilePic = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const { settoken, user } = useContext(Authcontext);

  const displayName = user?.name || propUserName;
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFS.filter((n) => n.unread).length);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const lastY = useRef(0);
  const openRef = useRef(false);
  openRef.current = open;

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
        else if (d > 6 && !openRef.current) { setHidden(true); setProfileOpen(false); setNotifOpen(false); }
        if (Math.abs(d) > 6) lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // close menus on navigation, Escape, or when growing past the breakpoint
  useEffect(() => { setOpen(false); setProfileOpen(false); setNotifOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); setProfileOpen(false); setNotifOpen(false); } };
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // outside click closes dropdowns
  useEffect(() => {
    const onDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = () => {
    settoken(null);
    localStorage.removeItem("Token");
    setProfileOpen(false);
    setOpen(false);
    navigate("/login");
  };

  const handleNotifOpen = () => {
    setNotifOpen((o) => !o);
    setProfileOpen(false);
    setUnreadCount(0);
  };

  const activeIdx = NAV_LINKS.findIndex((l) => location.pathname.startsWith(l.to));
  const lit = hover ?? (activeIdx >= 0 ? activeIdx : null);

  const Avatar = ({ size }) => (
    <span style={{ width: size, height: size, borderRadius: "50%", background: ORB_VIOLET, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(12,10,9,0.12)", overflow: "hidden", flexShrink: 0 }}>
      {userProfilePic ? (
        <img src={userProfilePic} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: size * 0.37, fontWeight: 500, color: "white" }}>{initials}</span>
      )}
    </span>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .nv-root { position:sticky; top:0; z-index:1000; height:84px; pointer-events:none; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; -webkit-font-smoothing:antialiased; }
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
        .nv-tag { font-size:11.5px; font-weight:500; color:${T.body}; background:${T.surface}; border:1px solid ${T.line}; padding:3px 10px; border-radius:999px; white-space:nowrap; }

        .nv-links { display:flex; align-items:center; gap:2px; position:relative; }
        .nv-link { position:relative; display:inline-flex; align-items:center; padding:9px 15px; font-size:14px; font-weight:500; color:${T.body}; text-decoration:none; border-radius:999px; white-space:nowrap; transition:color .2s; }
        .nv-link[data-lit="true"] { color:${T.ink}; }
        .nv-hi { position:absolute; inset:0; border-radius:999px; background:${T.surface}; border:1px solid ${T.line}; z-index:0; }
        .nv-link span.nv-t { position:relative; z-index:1; }

        .nv-actions { display:flex; align-items:center; gap:8px; justify-self:end; }

        .nv-icon-btn { width:40px; height:40px; border-radius:50%; background:${T.surface}; border:1px solid ${T.line}; cursor:pointer; display:flex; align-items:center; justify-content:center; color:${T.ink}; position:relative; transition:background .2s, border-color .2s; }
        .nv-icon-btn:hover { background:${T.white}; border-color:#D6D3D1; }
        .nv-badge { position:absolute; top:5px; right:6px; width:8px; height:8px; border-radius:50%; background:#10B981; box-shadow:0 0 0 2px white; }

        .nv-profile { display:flex; align-items:center; gap:8px; background:${T.surface}; border:1px solid ${T.line}; border-radius:999px; padding:4px 12px 4px 4px; cursor:pointer; font-family:inherit; transition:background .2s, border-color .2s; }
        .nv-profile:hover { background:${T.white}; border-color:#D6D3D1; }

        .nv-menu { position:absolute; right:0; top:calc(100% + 12px); background:rgba(255,255,255,0.96); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid ${T.line}; border-radius:24px; box-shadow:0 24px 60px rgba(12,10,9,0.14); overflow:hidden; z-index:5; transform-origin:top right; }
        .nv-menu-head { padding:14px 18px; border-bottom:1px solid ${T.line}; background:${T.surface2}; }
        .nv-menu-item { width:100%; display:flex; align-items:center; gap:10px; padding:11px 14px; border:none; background:transparent; border-radius:999px; cursor:pointer; font-family:inherit; font-size:13.5px; font-weight:500; color:${T.body}; text-align:left; text-decoration:none; transition:background .15s, color .15s; }
        .nv-menu-item:hover { background:${T.surface}; color:${T.ink}; }
        .nv-menu-item.danger { color:#DC2626; }
        .nv-menu-item.danger:hover { background:#FEF2F2; color:#DC2626; }

        .nv-burger { display:none; justify-self:end; width:42px; height:42px; border-radius:50%; border:1px solid ${T.line}; background:rgba(255,255,255,0.85); cursor:pointer; align-items:center; justify-content:center; position:relative; }
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
        .nv-m-sub { display:flex; align-items:center; justify-content:space-between; padding:11px 20px; border-radius:18px; text-decoration:none; font-size:15px; font-weight:500; color:${T.body}; transition:background .2s, color .2s; }
        .nv-m-sub:hover { background:${T.surface}; color:${T.ink}; }
        .nv-m-sub span { display:inline-flex; align-items:center; gap:10px; }
        .nv-m-user { display:flex; align-items:center; gap:12px; margin:6px 10px 0; padding:12px 14px; border-radius:22px; background:rgba(255,255,255,0.85); border:1px solid ${T.line}; }
        .nv-m-label { font-size:12px; font-weight:500; color:${T.muted}; padding:10px 20px 4px; margin:0; }

        .nv-root a:focus-visible, .nv-root button:focus-visible { outline:2px solid ${T.ink}; outline-offset:3px; }

        @media (max-width: 1040px) { .nv-tag { display:none; } }
        @media (max-width: 900px) {
          .nv-pill { grid-template-columns:1fr auto; }
          .nv-links, .nv-actions { display:none; }
          .nv-burger { display:flex; }
        }
        @media (prefers-reduced-motion: reduce) { .nv-pill, .nv-burger i { transition:none; } }
      `}</style>

      <header className="nv-root">
        <motion.nav
          className="nv-pill"
          data-scrolled={scrolled}
          data-open={open}
          aria-label="Main"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: hidden && !open ? -100 : 0, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: hidden ? 0.35 : 0.7, ease: EASE }}
        >
          {/* brand */}
          <Link to="/dashboard" className="nv-brand" aria-label="CuraLink Clinical Care Hub, dashboard">
            <LogoMark />
            <span className="nv-word">CuraLink</span>
            <span className="nv-tag">Clinical Care Hub</span>
          </Link>

          {/* links with a pill that glides between items */}
          <div className="nv-links" onMouseLeave={() => setHover(null)}>
            {NAV_LINKS.map((l, i) => (
              <NavLink key={l.to} to={l.to} className="nv-link" data-lit={lit === i}
                aria-current={activeIdx === i ? "page" : undefined}
                onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
                {lit === i && (
                  <motion.span layoutId="nv-hi" className="nv-hi"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} />
                )}
                <span className="nv-t">{l.label}</span>
              </NavLink>
            ))}
          </div>

          {/* actions */}
          <div className="nv-actions">
            {/* notifications */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button className="nv-icon-btn" onClick={handleNotifOpen} aria-label="Notifications"
                aria-haspopup="true" aria-expanded={notifOpen}>
                <Icon d={ICONS.bell} size={16} />
                {unreadCount > 0 && <span className="nv-badge" />}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div className="nv-menu" style={{ width: 320 }}
                    initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.25, ease: EASE }}>
                    <div className="nv-menu-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Notifications</span>
                      <span style={{ fontSize: 11.5, color: T.muted }}>Live Feed</span>
                    </div>
                    <div style={{ padding: "8px 12px 12px" }}>
                      {MOCK_NOTIFS.length === 0 ? (
                        <p style={{ textAlign: "center", fontSize: 13, color: T.muted, padding: "24px 12px", margin: 0 }}>
                          All clinical notifications reviewed
                        </p>
                      ) : (
                        MOCK_NOTIFS.map((n) => (
                          <div key={n.id} style={{ padding: "10px 8px", borderBottom: `1px solid ${T.line}` }}>
                            <p style={{ fontSize: 13, color: T.ink, margin: 0 }}>{n.text}</p>
                          </div>
                        ))
                      )}
                      <button
                        onClick={() => { setNotifOpen(false); navigate("/notifications"); }}
                        style={{ width: "100%", padding: "10px", fontSize: 12.5, fontWeight: 500, fontFamily: "inherit", color: T.ink, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 999, cursor: "pointer", marginTop: 6 }}>
                        Open Notification Console
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* profile */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <button className="nv-profile"
                onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
                aria-haspopup="menu" aria-expanded={profileOpen}>
                <Avatar size={30} />
                <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>
                  {displayName.split(" ")[0]}
                </span>
                <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: "inline-flex" }}>
                  <Icon d={ICONS.chevronD} size={14} color={T.muted} />
                </motion.span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div className="nv-menu" role="menu" style={{ width: 240 }}
                    initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.25, ease: EASE }}>
                    <div className="nv-menu-head">
                      <p style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, margin: 0 }}>{displayName}</p>
                      <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user?.email || "Patient Profile"}
                      </p>
                    </div>
                    <div style={{ padding: 6 }}>
                      <NavLink to="/profile" className="nv-menu-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                        <Icon d={ICONS.user} size={14} color={T.muted} /> Your Profile
                      </NavLink>
                      <NavLink to="/settings" className="nv-menu-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                        <Icon d={ICONS.cog} size={14} color={T.muted} /> Settings
                      </NavLink>
                      <div style={{ height: 1, background: T.line, margin: "4px 12px" }} />
                      <button className="nv-menu-item danger" role="menuitem" onClick={handleLogout}>
                        <Icon d={ICONS.logout} size={14} color="#DC2626" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* mobile toggle */}
          <button className="nv-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
            aria-controls="nv-sheet" onClick={() => setOpen((o) => !o)}>
            <i /><i />
          </button>

          {/* mobile sheet */}
          <AnimatePresence>
            {open && (
              <motion.div id="nv-sheet" className="nv-sheet"
                initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.3, ease: EASE }}>
                <motion.div className="nv-m-user" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03, duration: 0.5, ease: EASE }}>
                  <Avatar size={36} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: T.ink, margin: 0 }}>{displayName}</p>
                    <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.email || "Patient Profile"}
                    </p>
                  </div>
                </motion.div>

                {NAV_LINKS.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}>
                    <Link to={l.to} className="nv-m-link" aria-current={activeIdx === i ? "page" : undefined}>
                      {l.label} <Icon d={ICONS.arrow} size={18} color={T.muted} />
                    </Link>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: EASE }}>
                  <p className="nv-m-label">Account</p>
                  <Link to="/notifications" className="nv-m-sub">
                    <span><Icon d={ICONS.bell} size={16} color={T.muted} /> Notifications</span>
                    <Icon d={ICONS.arrow} size={14} color={T.muted} />
                  </Link>
                  <Link to="/profile" className="nv-m-sub">
                    <span><Icon d={ICONS.user} size={16} color={T.muted} /> Your Profile</span>
                    <Icon d={ICONS.arrow} size={14} color={T.muted} />
                  </Link>
                  <Link to="/settings" className="nv-m-sub">
                    <span><Icon d={ICONS.cog} size={16} color={T.muted} /> Settings</span>
                    <Icon d={ICONS.arrow} size={14} color={T.muted} />
                  </Link>
                  <div style={{ padding: "12px 10px 10px" }}>
                    <button onClick={handleLogout}
                      style={{ width: "100%", padding: "14px 22px", fontSize: 14.5, fontWeight: 500, fontFamily: "inherit", color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Icon d={ICONS.logout} size={15} color="#DC2626" /> Sign Out
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

export default NavbarAfterLogin;