import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
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
  chevronD:  "M19 9l-7 7-7-7",
  menu:      "M4 6h16M4 12h16M4 18h16",
  close:     "M18 6L6 18M6 6l12 12",
  cross:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  arrow:     "M17 8l4 4m0 0l-4 4m4-4H3",
  profile:   ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  dot:       "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
};

const NAV_LINKS = [
  { to: "/dashboard",        label: "Dashboard",      icon: ICONS.dashboard },
  { to: "/find-doctors",     label: "Find Doctors",   icon: ICONS.doctors   },
  { to: "/symptom-analyzer", label: "AI Analyzer",    icon: ICONS.ai        },
  { to: "/my-appointments",  label: "Appointments",   icon: ICONS.appts     },
];

// Notification mock data
const MOCK_NOTIFS = [
  { id: 1, text: "Dr. Priya Reddy confirmed your appointment", time: "2h ago", unread: true,  color: "#6366F1", bg: "#EEF2FF", icon: ICONS.appts  },
  { id: 2, text: "New prescription uploaded successfully",      time: "Yesterday", unread: true,  color: "#D97706", bg: "#FFFBEB", icon: ICONS.cross  },
  { id: 3, text: "AI symptom report is ready to view",         time: "3d ago",  unread: false, color: "#059669", bg: "#ECFDF5", icon: ICONS.ai     },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const NavbarAfterLogin = ({
  userName: propUserName = "Aarav Sharma",
  userProfilePic = null,
}) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token, settoken, user } = useContext(Authcontext);

  const displayName = user?.name || propUserName;
  const initials    = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const [scrolled,         setScrolled]         = useState(false);
  const [mobileOpen,       setMobileOpen]        = useState(false);
  const [profileOpen,      setProfileOpen]       = useState(false);
  const [notifOpen,        setNotifOpen]         = useState(false);
  const [unreadCount,      setUnreadCount]       = useState(MOCK_NOTIFS.filter(n => n.unread).length);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); setNotifOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    settoken(null);
    localStorage.removeItem("Token");
    setProfileOpen(false);
    navigate("/login");
  };

  const handleNotifOpen = () => {
    setNotifOpen(o => !o);
    setProfileOpen(false);
    setUnreadCount(0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .anl-root {
          position: sticky; top: 0; z-index: 1000;
          font-family: 'DM Sans', sans-serif;
        }
        .anl-root::before {
          content: '';
          display: block; height: 3px;
          background: linear-gradient(90deg,#6366F1,#8B5CF6,#A78BFA,#6366F1);
          background-size: 200% 100%;
          animation: anl-shimmer 3s linear infinite;
        }
        @keyframes anl-shimmer { 0%{background-position:0%} 100%{background-position:200%} }

        .anl-bar {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.10);
          transition: box-shadow 0.3s, background 0.3s;
        }
        .anl-bar.scrolled {
          box-shadow: 0 4px 32px rgba(99,102,241,0.13);
          background: rgba(255,255,255,0.97);
        }

        /* Nav links */
        .anl-link {
          position: relative;
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 10px;
          font-size: 13.5px; font-weight: 600;
          color: #475569; text-decoration: none;
          transition: color 0.18s, background 0.18s;
          white-space: nowrap;
        }
        .anl-link:hover { color: #6366F1; background: #EEF2FF; }
        .anl-link.active { color: #6366F1; background: #EEF2FF; }
        .anl-link.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 18px; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg,#6366F1,#8B5CF6);
        }

        /* Icon buttons */
        .anl-icon-btn {
          width: 38px; height: 38px; border-radius: 11px;
          background: transparent; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748B; transition: background 0.18s, color 0.18s;
          position: relative;
        }
        .anl-icon-btn:hover { background: #EEF2FF; color: #6366F1; }

        /* Notification badge */
        .anl-badge {
          position: absolute; top: 5px; right: 5px;
          width: 16px; height: 16px; border-radius: 50%;
          background: linear-gradient(135deg,#6366F1,#8B5CF6);
          border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 800; color: white;
          line-height: 1;
        }

        /* Avatar button */
        .anl-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 12px; border: 1.5px solid #E2E8F0;
          background: transparent; cursor: pointer;
          transition: all 0.18s;
        }
        .anl-avatar-btn:hover {
          border-color: #C7D2FE; background: #EEF2FF;
        }
        .anl-avatar {
          width: 30px; height: 30px; border-radius: 9px;
          background: linear-gradient(135deg,#6366F1,#8B5CF6);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: white;
          overflow: hidden; flex-shrink: 0;
        }
        .anl-avatar img { width: 100%; height: 100%; object-fit: cover; }

        /* Dropdown panel */
        .anl-dropdown {
          position: absolute; right: 0; top: calc(100% + 10px);
          background: white; border-radius: 18px;
          border: 1px solid #EEF2FF;
          box-shadow: 0 16px 48px rgba(99,102,241,0.16), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden; z-index: 50;
        }

        /* Profile dropdown items */
        .anl-menu-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 11px 16px;
          font-size: 13px; font-weight: 600;
          color: #334155; background: transparent; border: none;
          cursor: pointer; text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .anl-menu-item:hover { background: #EEF2FF; color: #6366F1; }
        .anl-menu-item.danger:hover { background: #FEF2F2; color: #EF4444; }

        /* Mobile drawer */
        .anl-backdrop {
          position: fixed; inset: 0; z-index: 998;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
        }
        .anl-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(310px,100vw); z-index: 999;
          background: white;
          box-shadow: -8px 0 48px rgba(99,102,241,0.18);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .anl-drawer-header {
          background: linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%);
          padding: 28px 22px 22px; position: relative; overflow: hidden;
        }
        .anl-drawer-header::before {
          content:''; position:absolute; top:-30px; right:-30px;
          width:120px; height:120px; border-radius:50%;
          background:rgba(255,255,255,0.08);
        }
        .anl-drawer-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 14px;
          font-size: 13.5px; font-weight: 600;
          color: #475569; text-decoration: none;
          transition: all 0.18s;
        }
        .anl-drawer-link:hover, .anl-drawer-link.active {
          background: #EEF2FF; color: #6366F1;
        }
        .anl-drawer-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #EEF2FF; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.18s;
        }
        .anl-drawer-link:hover .anl-drawer-icon,
        .anl-drawer-link.active .anl-drawer-icon { background: #C7D2FE; }
      `}</style>

      <div className="anl-root">
        <div className={`anl-bar ${scrolled ? "scrolled" : ""}`}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

            {/* ── LOGO ── */}
            <NavLink to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
                <Icon d={ICONS.cross} size={19} color="white" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                CURA<span style={{ color: "#6366F1" }}>LINK</span>
              </span>
            </NavLink>

            {/* ── CENTER NAV (desktop) ── */}
            <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }} className="hidden lg:flex">
              {NAV_LINKS.map(({ to, label, icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `anl-link ${isActive ? "active" : ""}`}>
                  <Icon d={icon} size={14} color="currentColor" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* ── RIGHT SIDE (desktop) ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} className="hidden lg:flex">

              {/* Notification bell */}
              <div style={{ position: "relative" }} ref={notifRef}>
                <button className="anl-icon-btn" onClick={handleNotifOpen} aria-label="Notifications">
                  <Icon d={ICONS.bell} size={18} />
                  {unreadCount > 0 && <span className="anl-badge">{unreadCount}</span>}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div className="anl-dropdown" style={{ width: 320 }}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}>
                      {/* Header */}
                      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Notifications</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", cursor: "pointer" }}>Mark all read</span>
                      </div>
                      {/* Items */}
                      {MOCK_NOTIFS.map((n, i) => (
                        <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 18px", background: n.unread ? "#FAFBFF" : "white", borderBottom: i < MOCK_NOTIFS.length - 1 ? "1px solid #F8FAFF" : "none", cursor: "pointer", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F5F7FF"}
                          onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#FAFBFF" : "white"}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <Icon d={n.icon} size={15} color={n.color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12.5, color: "#1E293B", fontWeight: 600, lineHeight: 1.45 }}>{n.text}</p>
                            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 3, fontWeight: 500 }}>{n.time}</p>
                          </div>
                          {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366F1", flexShrink: 0, marginTop: 6 }} />}
                        </div>
                      ))}
                      <div style={{ padding: "10px 18px" }}>
                        <button onClick={() => navigate("/messages")} style={{ width: "100%", padding: "9px", fontSize: 12, fontWeight: 700, color: "#6366F1", background: "#EEF2FF", border: "none", borderRadius: 10, cursor: "pointer" }}>
                          View all notifications →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 24, background: "#E2E8F0", margin: "0 4px" }} />

              {/* Profile dropdown */}
              <div style={{ position: "relative" }} ref={profileRef}>
                <button className="anl-avatar-btn" onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}>
                  <div className="anl-avatar">
                    {userProfilePic ? <img src={userProfilePic} alt={displayName} /> : initials}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#334155", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayName.split(" ")[0]}
                  </span>
                  <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <Icon d={ICONS.chevronD} size={13} color="#94A3B8" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div className="anl-dropdown" style={{ width: 230, right: 0 }}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}>

                      {/* User info header */}
                      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="anl-avatar" style={{ width: 36, height: 36, borderRadius: 11, fontSize: 13 }}>
                            {userProfilePic ? <img src={userProfilePic} alt={displayName} /> : initials}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</p>
                            <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginTop: 1 }}>{user?.email || "patient"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: "6px" }}>
                        <NavLink to="/profile" className="anl-menu-item" style={{ borderRadius: 10 }} onClick={() => setProfileOpen(false)}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.profile} size={14} color="#6366F1" />
                          </div>
                          Your Profile
                        </NavLink>
                        <NavLink to="/settings" className="anl-menu-item" style={{ borderRadius: 10 }} onClick={() => setProfileOpen(false)}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.cog} size={14} color="#6366F1" />
                          </div>
                          Settings
                        </NavLink>
                        <div style={{ height: 1, background: "#F1F5F9", margin: "6px 0" }} />
                        <button className="anl-menu-item danger" style={{ borderRadius: 10 }} onClick={handleLogout}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.logout} size={14} color="#EF4444" />
                          </div>
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── MOBILE: bell + hamburger ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="lg:hidden">
              <button className="anl-icon-btn" onClick={handleNotifOpen} style={{ position: "relative" }}>
                <Icon d={ICONS.bell} size={18} />
                {unreadCount > 0 && <span className="anl-badge">{unreadCount}</span>}
              </button>
              <button className="anl-icon-btn" onClick={() => setMobileOpen(true)}>
                <Icon d={ICONS.menu} size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="anl-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />

            <motion.div className="anl-drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}>

              {/* Drawer header */}
              <div className="anl-drawer-header">
                <button onClick={() => setMobileOpen(false)}
                  style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Icon d={ICONS.close} size={15} color="white" />
                </button>

                {/* User info in drawer */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", overflow: "hidden", flexShrink: 0 }}>
                    {userProfilePic ? <img src={userProfilePic} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "white" }}>{displayName}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2, fontWeight: 500 }}>{user?.email || "Patient Account"}</p>
                  </div>
                </div>
              </div>

              {/* Drawer links */}
              <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px 8px" }}>Navigation</p>
                {NAV_LINKS.map(({ to, label, icon }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <NavLink to={to} className={({ isActive }) => `anl-drawer-link ${isActive ? "active" : ""}`}>
                      <div className="anl-drawer-icon"><Icon d={icon} size={15} color="#6366F1" /></div>
                      {label}
                      <Icon d={ICONS.arrow} size={13} color="#CBD5E1" style={{ marginLeft: "auto" }} />
                    </NavLink>
                  </motion.div>
                ))}

                <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0" }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px 8px" }}>Account</p>

                <NavLink to="/profile" className="anl-drawer-link" onClick={() => setMobileOpen(false)}>
                  <div className="anl-drawer-icon"><Icon d={ICONS.profile} size={15} color="#6366F1" /></div>
                  Your Profile
                  <Icon d={ICONS.arrow} size={13} color="#CBD5E1" style={{ marginLeft: "auto" }} />
                </NavLink>
                <NavLink to="/settings" className="anl-drawer-link" onClick={() => setMobileOpen(false)}>
                  <div className="anl-drawer-icon"><Icon d={ICONS.cog} size={15} color="#6366F1" /></div>
                  Settings
                  <Icon d={ICONS.arrow} size={13} color="#CBD5E1" style={{ marginLeft: "auto" }} />
                </NavLink>
              </div>

              {/* Drawer footer */}
              <div style={{ padding: "12px 12px 20px", borderTop: "1px solid #EEF2FF" }}>
                <button onClick={handleLogout}
                  style={{ width: "100%", padding: "11px", fontSize: 13, fontWeight: 700, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Icon d={ICONS.logout} size={15} color="#EF4444" />
                  Sign Out
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarAfterLogin;