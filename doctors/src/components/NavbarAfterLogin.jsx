import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ─── ICONS ──────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  dashboard:  ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  calendar:   ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  users:      ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  queue:      ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  avail:      ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z", "M12 18h.01"],
  bell:       ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  profile:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  settings:   ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout:     ["M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"],
  chevronD:   "M6 9l6 6 6-6",
  menu:       ["M4 6h16", "M4 12h16", "M4 18h16"],
  close:      ["M18 6L6 18", "M6 6l12 12"],
};

// ─── NAV ITEMS ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",    to: "/doctor/dashboard",        icon: ICONS.dashboard },
  { label: "Appointments", to: "/doctor/appointments",     icon: ICONS.calendar  },
  { label: "Patients",  to: "/doctor/patients",         icon: ICONS.users     },
  { label: "Queue",   to: "/doctor/queue-management", icon: ICONS.queue     },
  { label: "Availability", to: "/doctor/availability",     icon: ICONS.avail     },
];

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const Avatar = ({ imageUrl, name, size = 36 }) => {
  const initials = name ? name.replace("Dr. ", "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "DR";
  return imageUrl
    ? <img src={imageUrl} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
    : (
      <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>
        {initials}
      </div>
    );
};


// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const DoctorNavbar = ({ doctorName = "Dr. Ananya Sharma", doctorProfilePic = "", onLogout }) => {
  const {token,settoken}=useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    // Clear token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("doctorToken");
    // Call external logout handler if provided
    if (typeof onLogout === "function") onLogout();
    navigate("/doctor/login");
  };

  const navLinkStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: 7, padding: "8px 14px",
    borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none",
    transition: "all 0.18s",
    background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
    color: isActive ? "#6366F1" : "#475569",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .nav-link:hover { background: rgba(99,102,241,0.07) !important; color: #6366F1 !important; }
        .mobile-link:hover { background: rgba(99,102,241,0.08) !important; color: #6366F1 !important; }
        .drop-item:hover { background: #F8FAFF !important; }
        .drop-item-danger:hover { background: #FEF2F2 !important; color: #DC2626 !important; }
      `}</style>

      {/* Main Navbar */}
      <nav style={{ background: "white", boxShadow: "0 1px 0 #EEF2FF, 0 4px 24px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 100, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* Logo */}
          <NavLink to="/doctor/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#1E3A5F,#3B5CB8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                CURA<span style={{ color: "#6366F1" }}>LINK</span>
              </span>
              <span style={{ display: "inline-block", marginLeft: 6, fontSize: 9, fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 6, letterSpacing: "0.06em", verticalAlign: "middle" }}>PRO</span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} className="nav-link"
                style={({ isActive }) => navLinkStyle(isActive)}>
                <Icon d={item.icon} size={15} color="currentColor" />
                <span style={{ display: window.innerWidth < 1024 ? "none" : "inline" }}>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setNotifOpen(o => !o)}
                style={{ width: 38, height: 38, borderRadius: 11, border: "1.5px solid #EEF2FF", background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Icon d={ICONS.bell} size={17} color="#6366F1" />
                <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: "1.5px solid white" }} />
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.18 }}
                    style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 300, background: "white", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #EEF2FF", zIndex: 200, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F1F5F9" }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Notifications</p>
                    </div>
                    {[
                      { msg: "Rohan Patel checked in for 10:30 AM", time: "2m ago", color: "#6366F1" },
                      { msg: "New appointment booked by Priya Kumari", time: "1h ago", color: "#059669" },
                      { msg: "Tomorrow's schedule: 15 appointments", time: "3h ago", color: "#D97706" },
                    ].map((n, i) => (
                      <div key={i} style={{ padding: "12px 20px", borderBottom: i < 2 ? "1px solid #F8FAFF" : "none", cursor: "pointer" }}
                        className="drop-item">
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, lineHeight: 1.4 }}>{n.msg}</p>
                            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setDropdownOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 12, border: "1.5px solid #EEF2FF", background: "#F8FAFF", cursor: "pointer" }}>
                <Avatar imageUrl={doctorProfilePic} name={doctorName} size={32} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: window.innerWidth < 768 ? "none" : "inline" }}>
                  {doctorName}
                </span>
                <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <Icon d={ICONS.chevronD} size={14} color="#94A3B8" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.18 }}
                    style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 240, background: "white", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.13)", border: "1px solid #EEF2FF", zIndex: 200, overflow: "hidden" }}>

                    {/* Doctor info header */}
                    <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar imageUrl={doctorProfilePic} name={doctorName} size={40} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doctorName}</p>
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Doctor Account</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: "8px 0" }}>
                      <NavLink to="/doctor/profile" onClick={() => setDropdownOpen(false)} style={{ textDecoration: "none" }}>
                        <div className="drop-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", cursor: "pointer", transition: "all 0.15s" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.profile} size={15} color="#6366F1" />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>My Profile</span>
                        </div>
                      </NavLink>

                      <NavLink to="/doctor/settings" onClick={() => setDropdownOpen(false)} style={{ textDecoration: "none" }}>
                        <div className="drop-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", cursor: "pointer", transition: "all 0.15s" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.settings} size={15} color="#7C3AED" />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Account Settings</span>
                        </div>
                      </NavLink>
                    </div>

                    <div style={{ height: 1, background: "#F1F5F9", margin: "0 12px" }} />

                    <div style={{ padding: "8px 0 8px" }}>
                      <button onClick={handleLogout} className="drop-item-danger"
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", cursor: "pointer", background: "transparent", border: "none", transition: "all 0.15s" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon d={ICONS.logout} size={15} color="#DC2626" />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger (mobile) */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(o => !o)}
              style={{ width: 38, height: 38, borderRadius: 11, border: "1.5px solid #EEF2FF", background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={mobileOpen ? ICONS.close : ICONS.menu} size={18} color="#6366F1" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ borderTop: "1px solid #EEF2FF", background: "white", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_ITEMS.map(item => (
                  <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="mobile-link"
                    style={({ isActive }) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 14, transition: "all 0.15s", background: isActive ? "rgba(99,102,241,0.1)" : "transparent", color: isActive ? "#6366F1" : "#475569" })}>
                    <Icon d={item.icon} size={16} color="currentColor" />
                    {item.label}
                  </NavLink>
                ))}
                <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0" }} />
                <NavLink to="/doctor/profile" onClick={() => setMobileOpen(false)} className="mobile-link"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 14, color: "#475569", transition: "all 0.15s" }}>
                  <Icon d={ICONS.profile} size={16} color="currentColor" /> My Profile
                </NavLink>
                <NavLink to="/doctor/settings" onClick={() => setMobileOpen(false)} className="mobile-link"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 14, color: "#475569", transition: "all 0.15s" }}>
                  <Icon d={ICONS.settings} size={16} color="currentColor" /> Account Settings
                </NavLink>
                <button onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, fontWeight: 600, fontSize: 14, color: "#DC2626", background: "#FEF2F2", border: "none", cursor: "pointer", width: "100%", textAlign: "left", marginTop: 4 }}>
                  <Icon d={ICONS.logout} size={16} color="#DC2626" /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default DoctorNavbar;