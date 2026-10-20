import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion,
} from "framer-motion";
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
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  chevronD: "M6 9l6 6 6-6",
};

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const lastY = useRef(0);
  const openRef = useRef(false);
  openRef.current = open;

  const authContext = useContext(Authcontext);
  const user = authContext?.user || null;
  const token = authContext?.token || null;
  const logout = authContext?.logout;
  const loggedIn = !!(token && user);
  const firstName = user?.name ? user.name.split(" ")[0] : "Account";

  const handleSignOut = () => {
    setProfileDropdown(false);
    setOpen(false);
    if (typeof logout === "function") {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login");
  };

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
        else if (d > 6 && !openRef.current) { setHidden(true); setProfileDropdown(false); }
        if (Math.abs(d) > 6) lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // close menus on navigation, Escape, or when growing past the breakpoint
  useEffect(() => { setOpen(false); setProfileDropdown(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); setProfileDropdown(false); } };
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // close profile dropdown on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const activeIdx = NAV_LINKS.findIndex((l) =>
    l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to)
  );
  const lit = hover ?? (activeIdx >= 0 ? activeIdx : null);

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
        .nv-pill[data-scrolled="true"] { max-width:940px; background:rgba(255,255,255,0.88); border-color:#E7E5E4; box-shadow:0 18px 50px rgba(12,10,9,0.09); }
        .nv-pill[data-open="true"] { background:rgba(255,255,255,0.96); }

        .nv-brand { display:flex; align-items:center; gap:10px; text-decoration:none; justify-self:start; border-radius:999px; }
        .nv-word { font-size:20px; font-weight:500; letter-spacing:-0.04em; color:${T.ink}; line-height:1; }
        .nv-tag { font-size:11.5px; font-weight:500; color:${T.body}; background:${T.surface}; border:1px solid ${T.line}; padding:3px 10px; border-radius:999px; }

        .nv-links { display:flex; align-items:center; gap:2px; position:relative; }
        .nv-link { position:relative; display:inline-flex; align-items:center; padding:9px 18px; font-size:14px; font-weight:500; color:${T.body}; text-decoration:none; border-radius:999px; transition:color .2s; }
        .nv-link[data-lit="true"] { color:${T.ink}; }
        .nv-hi { position:absolute; inset:0; border-radius:999px; background:${T.surface}; border:1px solid ${T.line}; z-index:0; }
        .nv-link span.nv-t { position:relative; z-index:1; }

        .nv-actions { display:flex; align-items:center; gap:8px; justify-self:end; }
        .nv-btn-ink { display:inline-flex; align-items:center; gap:8px; background:${T.ink}; color:#fff; font-family:inherit; font-weight:500; font-size:13.5px; padding:11px 22px; border:none; border-radius:999px; text-decoration:none; cursor:pointer; transition:box-shadow .25s, transform .25s; white-space:nowrap; }
        .nv-btn-ink:hover { box-shadow:0 12px 30px rgba(12,10,9,0.25); transform:translateY(-1px); }
        .nv-btn-ink svg { transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .nv-btn-ink:hover svg { transform:translateX(3px); }
        .nv-btn-ghost { display:inline-flex; align-items:center; color:${T.ink}; font-family:inherit; font-weight:500; font-size:13.5px; padding:10px 18px; border:none; background:transparent; border-radius:999px; text-decoration:none; cursor:pointer; transition:background .2s; white-space:nowrap; }
        .nv-btn-ghost:hover { background:${T.surface}; }

        .nv-profile { display:flex; align-items:center; gap:8px; background:${T.surface}; border:1px solid ${T.line}; border-radius:999px; padding:4px 12px 4px 4px; cursor:pointer; font-family:inherit; transition:background .2s, border-color .2s; }
        .nv-profile:hover { background:${T.white}; border-color:#D6D3D1; }

        .nv-menu { position:absolute; right:0; top:calc(100% + 12px); width:230px; background:rgba(255,255,255,0.96); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid ${T.line}; border-radius:24px; box-shadow:0 24px 60px rgba(12,10,9,0.14); overflow:hidden; z-index:5; transform-origin:top right; }
        .nv-menu-head { padding:14px 18px; border-bottom:1px solid ${T.line}; background:${T.surface2}; }
        .nv-menu-item { width:100%; display:flex; align-items:center; gap:10px; padding:11px 14px; border:none; background:transparent; border-radius:999px; cursor:pointer; font-family:inherit; font-size:13.5px; font-weight:500; color:#DC2626; text-align:left; transition:background .15s; }
        .nv-menu-item:hover { background:#FEF2F2; }

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
        .nv-m-link { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-radius:22px; text-decoration:none; font-size:26px; font-weight:300; letter-spacing:-0.04em; color:${T.ink}; transition:background .2s; }
        .nv-m-link:hover, .nv-m-link[aria-current="page"] { background:${T.surface}; }
        .nv-m-user { display:flex; align-items:center; gap:12px; margin:6px 10px 0; padding:12px 14px; border-radius:22px; background:rgba(255,255,255,0.85); border:1px solid ${T.line}; }

        .nv-root a:focus-visible, .nv-root button:focus-visible { outline:2px solid ${T.ink}; outline-offset:3px; }

        @media (max-width: 900px) {
          .nv-pill { grid-template-columns:1fr auto; }
          .nv-links, .nv-actions { display:none; }
          .nv-burger { display:flex; }
        }
        @media (max-width: 520px) { .nv-tag { display:none; } }
        @media (prefers-reduced-motion: reduce) { .nv-pill, .nv-burger i, .nv-btn-ink, .nv-btn-ink svg { transition:none; } }
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
          <Link to="/" className="nv-brand" aria-label="CuraLink, home">
            <LogoMark />
            <span className="nv-word">CuraLink</span>
            <span className="nv-tag">Your Health Hub</span>
          </Link>

          {/* links with a pill that glides between items */}
          <div className="nv-links" onMouseLeave={() => setHover(null)}>
            {NAV_LINKS.map((l, i) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className="nv-link" data-lit={lit === i}
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
            {loggedIn ? (
              <div ref={profileRef} style={{ position: "relative" }}>
                <button className="nv-profile" onClick={() => setProfileDropdown((o) => !o)}
                  aria-haspopup="menu" aria-expanded={profileDropdown}>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: ORB_VIOLET, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(12,10,9,0.12)" }}>
                    <Icon d={ICONS.user} size={14} color="white" />
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>{firstName}</span>
                  <motion.span animate={{ rotate: profileDropdown ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: "inline-flex" }}>
                    <Icon d={ICONS.chevronD} size={14} color={T.muted} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div className="nv-menu" role="menu"
                      initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.25, ease: EASE }}>
                      <div className="nv-menu-head">
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, margin: 0 }}>{user.name || "User"}</p>
                        <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email || ""}</p>
                      </div>
                      <div style={{ padding: 6 }}>
                        <button className="nv-menu-item" role="menuitem" onClick={handleSignOut}>
                          <Icon d={ICONS.logout} size={15} color="#DC2626" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="nv-btn-ghost">Login</Link>
                <Magnetic>
                  <Link to="/signup" className="nv-btn-ink">
                    Get Started <Icon d={ICONS.arrow} size={14} color="white" />
                  </Link>
                </Magnetic>
              </>
            )}
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
                {loggedIn && (
                  <motion.div className="nv-m-user" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03, duration: 0.5, ease: EASE }}>
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: ORB_VIOLET, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon d={ICONS.user} size={16} color="white" />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: T.ink, margin: 0 }}>{user.name || "User"}</p>
                      <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email || ""}</p>
                    </div>
                  </motion.div>
                )}

                {NAV_LINKS.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: EASE }}>
                    <Link to={l.to} className="nv-m-link" aria-current={activeIdx === i ? "page" : undefined}>
                      {l.label} <Icon d={ICONS.arrow} size={18} color={T.muted} />
                    </Link>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
                  style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 10px 10px" }}>
                  {loggedIn ? (
                    <button onClick={handleSignOut} className="nv-btn-ghost"
                      style={{ justifyContent: "center", gap: 8, padding: "14px 22px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", fontSize: 14.5 }}>
                      <Icon d={ICONS.logout} size={15} color="#DC2626" /> Sign Out
                    </button>
                  ) : (
                    <>
                      <Link to="/signup" className="nv-btn-ink" style={{ justifyContent: "center", padding: "15px 22px", fontSize: 14.5 }}>
                        Get Started <Icon d={ICONS.arrow} size={15} color="white" />
                      </Link>
                      <Link to="/login" className="nv-btn-ghost"
                        style={{ justifyContent: "center", padding: "14px 22px", border: `1px solid ${T.line}`, background: "rgba(255,255,255,0.85)", fontSize: 14.5 }}>
                        Login
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </>
  );
};

export default Navbar;