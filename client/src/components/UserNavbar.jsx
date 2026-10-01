import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

// ─── THEME TOKENS (shared with the Navbar & About page) ───────────────────────
const T = {
  ink:      "#0C0A09",
  body:     "#57534E",
  muted:    "#A8A29E",
  line:     "#ECEAE6",
  surface:  "#F5F4F2",
  surface2: "#FAFAF9",
  white:    "#FFFFFF",
};

const EASE = [0.22, 1, 0.36, 1];

const ORB_VIOLET = "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)";
const ORB_SUN    = "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)";

const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const ICONS = {
  dashboard: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  doctors:   ["M22 12h-4l-3 9L9 3l-3 9H2"],
  ai:        ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  appts:     ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  bell:      ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  user:      ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  cog:       ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout:    ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  chevronD:  "M6 9l6 6 6-6",
  menu:      ["M4 8h16", "M4 16h16"],
  close:     ["M18 6L6 18", "M6 6l12 12"],
  cross:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  arrow:     "M17 8l4 4m0 0l-4 4m4-4H3",
};

const NAV_LINKS = [
  { to: "/dashboard",        label: "Dashboard",    icon: ICONS.dashboard },
  { to: "/find-doctors",     label: "Find Doctors", icon: ICONS.doctors   },
  { to: "/symptom-analyzer", label: "AI Analyzer",  icon: ICONS.ai        },
  { to: "/my-appointments",  label: "Appointments", icon: ICONS.appts     },
];

const MOCK_NOTIFS = [];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const NavbarAfterLogin = ({
  userName: propUserName = "Aarav Sharma",
  userProfilePic = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settoken, user } = useContext(Authcontext);

  const displayName = user?.name || propUserName;
  const initials    = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFS.filter((n) => n.unread).length);
  const [hovered,     setHovered]     = useState(null);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    settoken(null);
    localStorage.removeItem("Token");
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const handleNotifOpen = () => {
    setNotifOpen((o) => !o);
    setProfileOpen(false);
    setUnreadCount(0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        .anl-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .anl-inner {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-bottom: 1px solid transparent;
          transition: background 0.35s, border-color 0.35s, box-shadow 0.35s;
        }
        .anl-inner.scrolled {
          background: rgba(255,255,255,0.9);
          border-bottom-color: ${T.line};
          box-shadow: 0 8px 30px rgba(12,10,9,0.05);
        }

        .anl-bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          transition: height 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .anl-inner.scrolled .anl-bar { height: 62px; }

        .anl-link-item {
          position: relative;
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.005em;
          text-decoration: none;
          transition: color 0.2s;
        }
        .anl-link-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .anl-hover-bg {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: ${T.surface};
        }
        .anl-active-dot {
          position: absolute;
          bottom: 1px;
          left: 50%;
          width: 4px;
          height: 4px;
          margin-left: -2px;
          border-radius: 50%;
          background: ${T.ink};
        }

        .anl-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${T.surface};
          border: 1px solid ${T.line};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${T.ink};
          transition: background 0.2s, border-color 0.2s;
          position: relative;
        }
        .anl-icon-btn:hover {
          background: ${T.white};
          border-color: #D6D3D1;
        }

        .anl-badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 0 2px white;
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${T.surface};
          border-radius: 999px;
          padding: 4px 12px 4px 4px;
          border: 1px solid ${T.line};
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, border-color 0.2s;
        }
        .profile-chip:hover {
          background: ${T.white};
          border-color: #D6D3D1;
        }

        .anl-dropdown-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          background: white;
          border-radius: 18px;
          box-shadow: 0 20px 50px rgba(12,10,9,0.12);
          border: 1px solid ${T.line};
          overflow: hidden;
          z-index: 1001;
          transform-origin: top right;
        }

        .anl-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: ${T.body};
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          border-radius: 12px;
          transition: background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .anl-menu-item:hover {
          background: ${T.surface};
          color: ${T.ink};
        }
        .anl-menu-item.danger {
          color: #DC2626;
        }
        .anl-menu-item.danger:hover {
          background: #FEF2F2;
          color: #DC2626;
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(12,10,9,0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .drawer-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: min(340px, 100vw);
          height: 100%;
          background: ${T.white};
          box-shadow: -8px 0 48px rgba(12,10,9,0.18);
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .drawer-header {
          background: ${T.ink};
          padding: 28px 24px 24px;
          position: relative;
          overflow: hidden;
        }
        .drawer-links {
          padding: 18px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          font-size: 14.5px;
          font-weight: 500;
          color: ${T.body};
          text-decoration: none;
          transition: background 0.18s, color 0.18s;
        }
        .drawer-link:hover, .drawer-link.active {
          background: ${T.surface};
          color: ${T.ink};
        }
        .drawer-link-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: ${T.surface};
          border: 1px solid ${T.line};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s, border-color 0.18s;
        }
        .drawer-link:hover .drawer-link-icon,
        .drawer-link.active .drawer-link-icon {
          background: ${T.ink};
          border-color: ${T.ink};
        }
        .drawer-link:hover .drawer-link-icon svg,
        .drawer-link.active .drawer-link-icon svg {
          stroke: #fff;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
        }
        .mobile-toggle {
          display: none;
        }

        @media (max-width: 868px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>

      {/* ── MAIN NAV BAR ── */}
      <div className="anl-root">
        <div className={`anl-inner ${scrolled ? "scrolled" : ""}`}>
          <div className="anl-bar">

            {/* ── LOGO ── */}
            <NavLink to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ width: 38, height: 38, borderRadius: 12, background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Icon d={ICONS.cross} size={20} color="white" />
              </motion.div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em" }}>
                  CURA<span style={{ color: T.muted, fontWeight: 400 }}>LINK</span>
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 400, color: T.muted, marginTop: 3 }}>Clinical Care Hub</span>
              </div>
            </NavLink>

            {/* ── CENTER NAVIGATION (desktop) ── */}
            <nav style={{ gap: 4, flex: 1, justifyContent: "center" }} className="desktop-nav" onMouseLeave={() => setHovered(null)}>
              {NAV_LINKS.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="anl-link-item"
                  onMouseEnter={() => setHovered(to)}
                  style={({ isActive }) => ({ color: isActive ? T.ink : T.body })}
                >
                  {({ isActive }) => (
                    <>
                      {hovered === to && (
                        <motion.span
                          layoutId="anl-hover"
                          className="anl-hover-bg"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="anl-link-content">
                        <Icon d={icon} size={15} color="currentColor" />
                        {label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="anl-active"
                          className="anl-active-dot"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── RIGHT CONTROLS (desktop) ── */}
            <div style={{ gap: 10, flexShrink: 0 }} className="desktop-nav">
              
              {/* Notification Button */}
              <div style={{ position: "relative" }} ref={notifRef}>
                <button
                  className="anl-icon-btn"
                  onClick={handleNotifOpen}
                  aria-label="Notifications"
                >
                  <Icon d={ICONS.bell} size={16} />
                  {unreadCount > 0 && <span className="anl-badge" />}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      className="anl-dropdown-panel"
                      style={{ width: 320 }}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.line}`, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Notifications</span>
                        <span style={{ fontSize: 11.5, fontWeight: 400, color: T.muted }}>Live Feed</span>
                      </div>

                      <div style={{ padding: "8px 12px" }}>
                        {MOCK_NOTIFS.length === 0 ? (
                          <p style={{ textAlign: "center", fontSize: 13, color: T.muted, padding: "24px 12px" }}>
                            All clinical notifications reviewed
                          </p>
                        ) : (
                          MOCK_NOTIFS.map((n) => (
                            <div key={n.id} style={{ padding: "10px 8px", borderBottom: `1px solid ${T.line}` }}>
                              <p style={{ fontSize: 13, color: T.ink }}>{n.text}</p>
                            </div>
                          ))
                        )}
                        <button
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/notifications");
                          }}
                          style={{
                            width: "100%",
                            padding: "9px",
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: T.ink,
                            background: T.surface,
                            border: `1px solid ${T.line}`,
                            borderRadius: 10,
                            cursor: "pointer",
                            marginTop: 4,
                          }}
                        >
                          Open Notification Console →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Chip with Dropdown */}
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  className="profile-chip"
                  onClick={() => {
                    setProfileOpen((o) => !o);
                    setNotifOpen(false);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: ORB_VIOLET,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(12,10,9,0.12)",
                      overflow: "hidden",
                    }}
                  >
                    {userProfilePic ? (
                      <img src={userProfilePic} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 500, color: "white" }}>{initials}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>
                    {displayName.split(" ")[0]}
                  </span>
                  <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: "inline-flex" }}>
                    <Icon d={ICONS.chevronD} size={14} color={T.muted} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="anl-dropdown-panel"
                      style={{ width: 230 }}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.line}`, background: T.surface2 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>{displayName}</p>
                        <p style={{ fontSize: 11.5, color: T.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user?.email || "Patient Profile"}
                        </p>
                      </div>

                      <div style={{ padding: "6px" }}>
                        <NavLink to="/profile" className="anl-menu-item" onClick={() => setProfileOpen(false)}>
                          <Icon d={ICONS.user} size={14} color={T.muted} />
                          Your Profile
                        </NavLink>
                        <NavLink to="/settings" className="anl-menu-item" onClick={() => setProfileOpen(false)}>
                          <Icon d={ICONS.cog} size={14} color={T.muted} />
                          Settings
                        </NavLink>
                        <div style={{ height: 1, background: T.line, margin: "4px 0" }} />
                        <button className="anl-menu-item danger" onClick={handleLogout}>
                          <Icon d={ICONS.logout} size={14} color="#DC2626" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* ── HAMBURGER (mobile) ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="mobile-toggle">
              {/* <button
                className="anl-icon-btn"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/notifications");
                }}
                aria-label="Notifications"
              >
                <Icon d={ICONS.bell} size={16} />
                {unreadCount > 0 && <span className="anl-badge" />}
              </button> */}

              <button
                onClick={() => setMobileOpen(true)}
                style={{ width: 42, height: 42, borderRadius: "50%", background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                aria-label="Open menu"
              >
                <Icon d={ICONS.menu} size={18} color={T.ink} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="mobile-drawer">
            {/* Backdrop */}
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              {/* Header */}
              <div className="drawer-header">
                {/* Embedded Iridescent Orbs */}
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", top: -70, right: -50, width: 220, height: 220, borderRadius: "50%", background: ORB_VIOLET, opacity: 0.6, filter: "blur(22px)", pointerEvents: "none" }}
                />
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{ position: "absolute", bottom: -60, left: -30, width: 150, height: 150, borderRadius: "50%", background: ORB_SUN, opacity: 0.4, filter: "blur(30px)", pointerEvents: "none" }}
                />

                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Icon d={ICONS.close} size={16} color="white" />
                </button>

                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.cross} size={18} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 600, color: "white", lineHeight: 1, letterSpacing: "-0.03em" }}>
                      CURA<span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>LINK</span>
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 400, marginTop: 4 }}>Clinical Hub</p>
                  </div>
                </div>

                {/* User card inside drawer */}
                <div style={{ position: "relative", zIndex: 1, marginTop: 20, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", borderRadius: 16, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: ORB_VIOLET, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {userProfilePic ? <img src={userProfilePic} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: "white" }}>{displayName}</p>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || ""}</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="drawer-links">
                <p style={{ fontSize: 12, fontWeight: 500, color: T.muted, padding: "4px 14px 10px" }}>Console Navigation</p>
                {NAV_LINKS.map(({ to, label, icon }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + 0.05 * i, duration: 0.45, ease: EASE }}>
                    <NavLink
                      to={to}
                      className={({ isActive }) => `drawer-link ${isActive ? "active" : ""}`}
                    >
                      <div className="drawer-link-icon">
                        <Icon d={icon} size={16} color={T.ink} />
                      </div>
                      {label}
                      <Icon d={ICONS.arrow} size={13} color={T.muted} style={{ marginLeft: "auto" }} />
                    </NavLink>
                  </motion.div>
                ))}

                <div style={{ height: 1, background: T.line, margin: "8px 12px" }} />
                <p style={{ fontSize: 12, fontWeight: 500, color: T.muted, padding: "4px 14px 10px" }}>Account</p>

                <NavLink to="/profile" className="drawer-link" onClick={() => setMobileOpen(false)}>
                  <div className="drawer-link-icon"><Icon d={ICONS.user} size={16} color={T.ink} /></div>
                  Your Profile
                  <Icon d={ICONS.arrow} size={13} color={T.muted} style={{ marginLeft: "auto" }} />
                </NavLink>
                <NavLink to="/settings" className="drawer-link" onClick={() => setMobileOpen(false)}>
                  <div className="drawer-link-icon"><Icon d={ICONS.cog} size={16} color={T.ink} /></div>
                  Settings
                  <Icon d={ICONS.arrow} size={13} color={T.muted} style={{ marginLeft: "auto" }} />
                </NavLink>
              </div>

              {/* Footer */}
              <div className="drawer-footer">
                <button
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    color: "#DC2626",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 999,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onClick={handleLogout}
                >
                  <Icon d={ICONS.logout} size={15} color="#DC2626" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarAfterLogin;