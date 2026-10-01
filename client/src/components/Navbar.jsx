import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

// ─── THEME TOKENS (shared with the About page) ───────────────────────────────
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
  home:     ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  about:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4M12 16h.01"],
  contact:  ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  menu:     ["M4 8h16", "M4 16h16"],
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
  const [hovered, setHovered] = useState(null);
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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileDropdown(false);
  }, [location.pathname]);

  // Drawer: close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const firstName = user?.name ? user.name.split(" ")[0] : "Account";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .nav-inner {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-bottom: 1px solid transparent;
          transition: background 0.35s, border-color 0.35s, box-shadow 0.35s;
        }
        .nav-inner.scrolled {
          background: rgba(255,255,255,0.9);
          border-bottom-color: ${T.line};
          box-shadow: 0 8px 30px rgba(12,10,9,0.05);
        }

        .nav-bar {
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
        .nav-inner.scrolled .nav-bar { height: 62px; }

        .nav-link-item {
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
        .nav-link-item:focus-visible,
        .nav-btn:focus-visible,
        .btn-login:focus-visible,
        .btn-signup:focus-visible,
        .drawer-link:focus-visible {
          outline: 2px solid ${T.ink};
          outline-offset: 2px;
        }
        .nav-link-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .nav-hover-bg {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: ${T.surface};
        }
        .nav-active-dot {
          position: absolute;
          bottom: 1px;
          left: 50%;
          width: 4px;
          height: 4px;
          margin-left: -2px;
          border-radius: 50%;
          background: ${T.ink};
        }

        .btn-login {
          padding: 9px 20px;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          color: ${T.ink};
          border: 1px solid ${T.line};
          border-radius: 999px;
          background: ${T.white};
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: -0.005em;
        }
        .btn-login:hover {
          background: ${T.surface};
          border-color: #D6D3D1;
        }

        .btn-signup {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 20px;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          color: ${T.white};
          border: 1px solid ${T.ink};
          border-radius: 999px;
          background: ${T.ink};
          cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s, background 0.2s;
          letter-spacing: -0.005em;
        }
        .btn-signup:hover {
          background: #292524;
          box-shadow: 0 10px 24px rgba(12,10,9,0.22);
          transform: translateY(-1px);
        }
        .btn-signup svg { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .btn-signup:hover svg { transform: translateX(4px); }

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
        .profile-chip:hover { background: ${T.white}; border-color: #D6D3D1; }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .drawer-backdrop {
          position: absolute; inset: 0;
          background: rgba(12,10,9,0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .drawer-panel {
          position: absolute;
          top: 0; right: 0;
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
          width: 38px; height: 38px;
          border-radius: 12px;
          background: ${T.surface};
          border: 1px solid ${T.line};
          display: flex; align-items: center; justify-content: center;
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
        .drawer-footer {
          padding: 16px;
          border-top: 1px solid ${T.line};
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

        @media (prefers-reduced-motion: reduce) {
          .nav-bar, .btn-signup, .btn-signup svg { transition: none; }
        }
      `}</style>

      {/* ── MAIN NAV ── */}
      <div className="nav-root">
        <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-bar">

            {/* ── LOGO ── */}
            <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
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
                <span style={{ fontSize: 10.5, fontWeight: 400, color: T.muted, marginTop: 3 }}>Your Health Hub</span>
              </div>
            </NavLink>

            {/* ── CENTER NAV LINKS (desktop) ── */}
            <nav style={{ gap: 4, flex: 1, justifyContent: "center" }} className="desktop-nav" onMouseLeave={() => setHovered(null)}>
              {NAV_LINKS.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className="nav-link-item"
                  onMouseEnter={() => setHovered(to)}
                  style={({ isActive }) => ({ color: isActive ? T.ink : T.body })}
                >
                  {({ isActive }) => (
                    <>
                      {hovered === to && (
                        <motion.span
                          layoutId="nav-hover"
                          className="nav-hover-bg"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="nav-link-content">
                        <Icon d={icon} size={15} color="currentColor" />
                        {label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="nav-active-dot"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── RIGHT SIDE (desktop) ── */}
            <div style={{ gap: 10, flexShrink: 0 }} className="desktop-nav">
              {token && user ? (
                /* Logged in: Profile Chip with Dropdown */
                <div ref={profileRef} style={{ position: "relative" }}>
                  <button
                    className="profile-chip nav-btn"
                    onClick={() => setProfileDropdown(o => !o)}
                    aria-haspopup="menu"
                    aria-expanded={profileDropdown}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: ORB_VIOLET, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(12,10,9,0.12)" }}>
                      <Icon d={ICONS.user} size={14} color="white" />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>
                      {firstName}
                    </span>
                    <motion.span animate={{ rotate: profileDropdown ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: "inline-flex" }}>
                      <Icon d={ICONS.chevronD} size={14} color={T.muted} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        style={{
                          position: "absolute", right: 0, top: "calc(100% + 10px)",
                          width: 220, background: "white", borderRadius: 18,
                          boxShadow: "0 20px 50px rgba(12,10,9,0.12)", border: `1px solid ${T.line}`,
                          overflow: "hidden", zIndex: 1001, transformOrigin: "top right",
                        }}
                      >
                        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.line}`, background: T.surface2 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>{user.name || "User"}</p>
                          <p style={{ fontSize: 12, color: T.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email || ""}</p>
                        </div>
                        <div style={{ padding: "6px" }}>
                          <button
                            onClick={handleSignOut}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: 10,
                              padding: "10px 12px", border: "none", background: "transparent",
                              borderRadius: 12, cursor: "pointer", fontSize: 13.5, fontWeight: 500,
                              color: "#DC2626", textAlign: "left", fontFamily: "inherit",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <Icon d={ICONS.logout} size={15} color="#DC2626" />
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
                    Get Started
                    <Icon d={ICONS.arrow} size={14} color="white" />
                  </button>
                </>
              )}
            </div>

            {/* ── HAMBURGER (mobile) ── */}
            <button
              onClick={() => setIsOpen(true)}
              style={{ width: 42, height: 42, borderRadius: "50%", background: T.surface, border: `1px solid ${T.line}`, alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              className="mobile-toggle nav-btn"
              aria-label="Open menu"
            >
              <Icon d={ICONS.menu} size={18} color={T.ink} />
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
                {/* Orbs, same language as the page CTA */}
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
                  onClick={() => setIsOpen(false)}
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
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 400, marginTop: 4 }}>Your Health Hub</p>
                  </div>
                </div>

                {token && user && (
                  <div style={{ position: "relative", zIndex: 1, marginTop: 20, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", borderRadius: 16, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: ORB_VIOLET, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICONS.user} size={16} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 500, color: "white" }}>{user.name || "User"}</p>
                      <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email || ""}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="drawer-links">
                <p style={{ fontSize: 12, fontWeight: 500, color: T.muted, padding: "4px 14px 10px" }}>Navigation</p>
                {NAV_LINKS.map(({ to, label, icon }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + 0.07 * i, duration: 0.5, ease: EASE }}>
                    <NavLink
                      to={to}
                      end={to === "/"}
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
              </div>

              {/* Footer auth buttons */}
              {!token && (
                <div className="drawer-footer">
                  <button className="btn-login" style={{ width: "100%", padding: "12px 20px", fontSize: 14 }} onClick={() => navigate("/login")}>Login</button>
                  <button className="btn-signup" style={{ width: "100%", padding: "12px 20px", fontSize: 14 }} onClick={() => navigate("/signup")}>
                    Get Started
                    <Icon d={ICONS.arrow} size={14} color="white" />
                  </button>
                </div>
              )}

              {token && (
                <div className="drawer-footer">
                  <button
                    style={{ width: "100%", padding: "12px 20px", fontSize: 14, fontWeight: 500, fontFamily: "inherit", color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={handleSignOut}
                  >
                    <Icon d={ICONS.logout} size={15} color="#DC2626" />
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