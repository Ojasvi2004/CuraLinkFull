import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  menu:    ["M4 6h16M4 12h16M4 18h16"],
  close:   ["M6 18L18 6M6 6l12 12"],
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  arrow:   "M17 8l4 4m0 0l-4 4m4-4H3",
  pulse:   "M22 12h-4l-3 9L9 3l-3 9H2",
  steth:   ["M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3", "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"],
  chevron: "m6 9 6 6 6-6",
};

const NAV_LINKS = [
  { label: "Features", to: "/doctor/features" },
  { label: "How It Works", to: "/doctor/how-it-works" },
  { label: "FAQ", to: "/doctor/faq" },
];

const NavbarBeforeLogin = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 24 }}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid #EEF2FF" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(30,58,95,0.1)" : "none",
          transition: "all 0.3s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* ── LOGO ─────────────────────────────────────────────────────────── */}
          <Link to="/doctor" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg,#1E3A5F,#3B5CB8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(30,58,95,0.3)",
              flexShrink: 0,
            }}>
              <Icon d={ICONS.steth} size={20} color="white" />
            </div>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, color: "#0F172A", letterSpacing: "-0.5px" }}>
                CURA<span style={{ color: "#6366F1" }}>LINK</span>
              </span>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 1 }}>
                for Doctors
              </div>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    style={{
                      padding: "8px 16px", borderRadius: 12,
                      fontSize: 14, fontWeight: 600,
                      color: active ? "#6366F1" : "#475569",
                      background: active ? "#EEF2FF" : "transparent",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F8FAFF"; e.currentTarget.style.color = "#6366F1"; }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; } }}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* ── CTA BUTTONS ───────────────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="desktop-nav">
            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/doctor/login")}
              style={{
                padding: "9px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                color: "#6366F1", background: "#EEF2FF", border: "none",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              Doctor Login
            </motion.button>
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(30,58,95,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/doctor/register")}
              style={{
                padding: "9px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg,#1E3A5F,#3B5CB8)",
                border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(30,58,95,0.35)",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              Register Clinic
              <Icon d={ICONS.arrow} size={13} color="white" />
            </motion.button>
          </div>

          {/* ── MOBILE HAMBURGER ─────────────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            style={{
              width: 40, height: 40, borderRadius: 12, border: "1.5px solid #EEF2FF",
              background: "white", display: "none", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon d={mobileOpen ? ICONS.close : ICONS.menu} size={18} color="#0F172A" />
          </button>
        </div>

        {/* ── MOBILE MENU ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden", borderTop: "1px solid #EEF2FF" }}
            >
              <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link to={link.to} style={{ textDecoration: "none" }}>
                      <div style={{
                        padding: "12px 16px", borderRadius: 14, fontSize: 14, fontWeight: 600,
                        color: location.pathname === link.to ? "#6366F1" : "#475569",
                        background: location.pathname === link.to ? "#EEF2FF" : "#F8FAFF",
                      }}>
                        {link.label}
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0" }} />
                <button
                  onClick={() => navigate("/doctor/login")}
                  style={{
                    padding: "13px", borderRadius: 14, fontSize: 14, fontWeight: 700,
                    color: "#6366F1", background: "#EEF2FF", border: "none",
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Doctor Login
                </button>
                <button
                  onClick={() => navigate("/doctor/register")}
                  style={{
                    padding: "13px", borderRadius: 14, fontSize: 14, fontWeight: 700,
                    color: "white", background: "linear-gradient(135deg,#1E3A5F,#3B5CB8)",
                    border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 4px 16px rgba(30,58,95,0.3)",
                  }}
                >
                  Register Your Clinic
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default NavbarBeforeLogin;