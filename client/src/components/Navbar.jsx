import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";


const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
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
  home:     ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  about:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4M12 16h.01"],
  contact:  ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  menu:     ["M4 6h16", "M4 12h16", "M4 18h16"],
  close:    ["M18 6L6 18", "M6 6l12 12"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  logout:   ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  chevronD: "M6 9l6 6 6-6",
};

const NAV_LINKS = [
  { to: "/",        label: "Home",    icon: ICONS.home    },
  { to: "/about",   label: "About",   icon: ICONS.about   },
  { to: "/contact", label: "Contact", icon: ICONS.contact },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);


  const authContext = useContext(Authcontext);
  const user = authContext?.user || null;
  const token = authContext?.token || null;
  const logout = authContext?.logout;

  const handleSignOut = () => {
    setProfileDropdown(false);
    setIsOpen(false);
    if (typeof logout === "function") {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileDropdown(false);
  }, [location.pathname]);

  const firstName = user?.name ? user.name.split(" ")[0] : "Account";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .nav-root::before {
          content: '';
          display: block;
          height: 3px;
          background: linear-gradient(90deg, #6366F1, #8B5CF6, #A78BFA, #6366F1);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0%   { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        .nav-inner {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.10);
          transition: box-shadow 0.35s;
        }
        .nav-inner.scrolled {
          box-shadow: 0 4px 32px rgba(99,102,241,0.13);
          background: rgba(255,255,255,0.95);
        }

        .nav-link-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link-item:hover {
          color: #6366F1;
          background: #EEF2FF;
        }
        .nav-link-item.active {
          color: #6366F1;
          background: #EEF2FF;
        }
        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366F1, #8B5CF6);
        }

        .btn-login {
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 700;
          color: #6366F1;
          border: 1.5px solid #C7D2FE;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .btn-login:hover {
          background: #EEF2FF;
          border-color: #6366F1;
        }

        .btn-signup {
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 700;
          color: white;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.30);
          letter-spacing: 0.01em;
        }
        .btn-signup:hover {
          box-shadow: 0 6px 20px rgba(99,102,241,0.42);
          transform: translateY(-1px);
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 999;
          display: flex;
          flex-direction: column;
        }
        .drawer-backdrop {
          position: absolute; inset: 0;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
        }
        .drawer-panel {
          position: absolute;
          top: 0; right: 0;
          width: min(320px, 100vw);
          height: 100%;
          background: white;
          box-shadow: -8px 0 48px rgba(99,102,241,0.18);
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .drawer-header {
          background: linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%);
          padding: 28px 24px 24px;
          position: relative;
          overflow: hidden;
        }
        .drawer-links {
          padding: 16px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: all 0.18s;
        }
        .drawer-link:hover, .drawer-link.active {
          background: #EEF2FF;
          color: #6366F1;
        }
        .drawer-link-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #EEF2FF;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .drawer-link:hover .drawer-link-icon,
        .drawer-link.active .drawer-link-icon {
          background: #C7D2FE;
        }
        .drawer-footer {
          padding: 16px;
          border-top: 1px solid #EEF2FF;
          display: flex;
          flex-direction: column;
          gap: 8px;
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

      {/* ── MAIN NAV ── */}
      <div className="nav-root">
        <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

            {/* ── LOGO ── */}
            <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
                <Icon d={ICONS.cross} size={20} color="white" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  CURA<span style={{ color: "#6366F1" }}>LINK</span>
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>Your Health Hub</span>
              </div>
            </NavLink>

            {/* ── CENTER NAV LINKS (desktop) ── */}
            <nav style={{ gap: 4, flex: 1, justifyContent: "center" }} className="desktop-nav">
              {NAV_LINKS.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
                >
                  <Icon d={icon} size={15} color="currentColor" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* ── RIGHT SIDE (desktop) ── */}
            <div style={{ gap: 10, flexShrink: 0 }} className="desktop-nav">
              {token && user ? (
                /* Logged in: Profile Chip with Dropdown */
                <div ref={profileRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileDropdown(o => !o)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "#EEF2FF", borderRadius: 12, padding: "5px 12px 5px 6px",
                      border: "1px solid #C7D2FE", cursor: "pointer",
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.user} size={15} color="white" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#3730A3" }}>
                      {firstName}
                    </span>
                    <Icon d={ICONS.chevronD} size={14} color="#6366F1" />
                  </button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: "absolute", right: 0, top: "calc(100% + 8px)",
                          width: 200, background: "white", borderRadius: 14,
                          boxShadow: "0 16px 40px rgba(0,0,0,0.12)", border: "1px solid #EEF2FF",
                          overflow: "hidden", zIndex: 1001,
                        }}
                      >
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{user.name || "User"}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>{user.email || ""}</p>
                        </div>
                        <div style={{ padding: "6px" }}>
                          <button
                            onClick={handleSignOut}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: 10,
                              padding: "9px 12px", border: "none", background: "transparent",
                              borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                              color: "#EF4444", textAlign: "left",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <Icon d={ICONS.logout} size={15} color="#EF4444" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
                  <button className="btn-signup" onClick={() => navigate("/signup")}>
                    Get Started &nbsp;→
                  </button>
                </>
              )}
            </div>

            {/* ── HAMBURGER (mobile) ── */}
            <button
              onClick={() => setIsOpen(true)}
              style={{ width: 40, height: 40, borderRadius: 11, background: "#EEF2FF", border: "none", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              className="mobile-toggle"
              aria-label="Open menu"
            >
              <Icon d={ICONS.menu} size={18} color="#6366F1" />
            </button>

          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="mobile-drawer">
            {/* Backdrop */}
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="drawer-panel"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              {/* Header */}
              <div className="drawer-header">
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Icon d={ICONS.close} size={16} color="white" />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.cross} size={18} color="white" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "white", lineHeight: 1 }}>
                      CURA<span style={{ color: "rgba(255,255,255,0.6)" }}>LINK</span>
                    </p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Your Health Hub</p>
                  </div>
                </div>

                {token && user && (
                  <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.user} size={16} color="white" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{user.name || "User"}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{user.email || ""}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="drawer-links">
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 16px 8px" }}>Navigation</p>
                {NAV_LINKS.map(({ to, label, icon }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}>
                    <NavLink
                      to={to}
                      end={to === "/"}
                      className={({ isActive }) => `drawer-link ${isActive ? "active" : ""}`}
                    >
                      <div className="drawer-link-icon">
                        <Icon d={icon} size={16} color="#6366F1" />
                      </div>
                      {label}
                      <Icon d={ICONS.arrow} size={13} color="#CBD5E1" style={{ marginLeft: "auto" }} />
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Footer auth buttons */}
              {!token && (
                <div className="drawer-footer">
                  <button className="btn-login" style={{ width: "100%" }} onClick={() => navigate("/login")}>Login</button>
                  <button className="btn-signup" style={{ width: "100%", padding: "11px 20px", fontSize: 14 }} onClick={() => navigate("/signup")}>
                    Get Started →
                  </button>
                </div>
              )}

              {token && (
                <div className="drawer-footer">
                  <button
                    style={{ width: "100%", padding: "11px 20px", fontSize: 13, fontWeight: 700, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={handleSignOut}
                  >
                    <Icon d={ICONS.logout} size={15} color="#EF4444" />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;