import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  location: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  chevR:    "M9 18l6-6-6-6",
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

// Social icons (filled, brand style)
const SocialIcons = {
  Facebook:  () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>,
  Twitter:   () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.61.823 2.981 2.074 3.798-.768-.024-1.483-.233-2.11-.583v.06c0 2.254 1.607 4.131 3.737 4.564-.39.106-.803.164-1.227.164-.3 0-.593-.028-.877-.082.593 1.844 2.307 3.183 4.341 3.221-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.512 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.603.91-.658 1.7-1.477 2.323-2.41z"/></svg>,
  LinkedIn:  () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>,
  Instagram: () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4c2.21 0 4 1.791 4 4s-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
};

const SOCIALS = [
  { label: "Facebook",  color: "#6366F1", bg: "#EEF2FF",  C: SocialIcons.Facebook  },
  { label: "Twitter",   color: "#0EA5E9", bg: "#E0F2FE",  C: SocialIcons.Twitter   },
  { label: "LinkedIn",  color: "#8B5CF6", bg: "#F5F3FF",  C: SocialIcons.LinkedIn  },
  { label: "Instagram", color: "#EC4899", bg: "#FDF2F8",  C: SocialIcons.Instagram },
];

const QUICK_LINKS = [
  { label: "Find a Doctor",       to: "/find-doctors"     },
  { label: "AI Symptom Analyzer", to: "/symptom-analyzer" },
  { label: "How It Works",        to: "/about"            },
  { label: "About Us",            to: "/about"            },
  { label: "Contact",             to: "/contact"          },
];

const PATIENT_LINKS = [
  { label: "Patient Login",       to: "/login"            },
  { label: "Register",            to: "/signup"           },
  { label: "My Appointments",     to: "/my-appointments"  },
  { label: "Privacy Policy",      to: "/privacy-policy"   },
  { label: "Terms of Service",    to: "/terms"            },
];

const TRUST_ITEMS = [
  { icon: ICONS.shield, color: "#6366F1", label: "256-bit SSL"     },
  { icon: ICONS.check,  color: "#059669", label: "HIPAA Compliant" },
  { icon: ICONS.heart,  color: "#EC4899", label: "Patient-First"   },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

// ─── FOOTER LINK ROW ─────────────────────────────────────────────────────────
const FooterLink = ({ to, children }) => (
  <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
    <Link to={to} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "rgba(255,255,255,0.55)", fontWeight: 500, textDecoration: "none", padding: "4px 0", transition: "color 0.18s" }}
      onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.95)"}
      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
      <Icon d={ICONS.chevR} size={12} color="rgba(99,102,241,0.7)" />
      {children}
    </Link>
  </motion.li>
);

// ─── COLUMN HEADING ───────────────────────────────────────────────────────────
const ColHeading = ({ children }) => (
  <div style={{ marginBottom: 20 }}>
    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>{children}</h4>
    <div style={{ width: 24, height: 2, borderRadius: 2, background: "linear-gradient(90deg,#6366F1,#8B5CF6)" }} />
  </div>
);

// ─── MAIN FOOTER ─────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .footer-root { font-family:'DM Sans',sans-serif; }
        .footer-input {
          flex:1; height:44px; padding:0 14px;
          background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.12);
          border-radius:11px 0 0 11px; color:white; font-size:13px;
          font-family:'DM Sans',sans-serif; outline:none;
          transition:border-color 0.18s, background 0.18s;
        }
        .footer-input::placeholder { color:rgba(255,255,255,0.35); }
        .footer-input:focus { border-color:rgba(99,102,241,0.6); background:rgba(255,255,255,0.12); }
        .footer-sub-btn {
          height:44px; padding:0 16px; border:none; cursor:pointer;
          background:linear-gradient(135deg,#6366F1,#8B5CF6);
          border-radius:0 11px 11px 0; color:white;
          font-size:13px; font-weight:800; font-family:'DM Sans',sans-serif;
          transition:opacity 0.18s;
        }
        .footer-sub-btn:hover { opacity:0.88; }
        .footer-social-btn {
          width:36px; height:36px; border-radius:10px; border:none;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.2s;
        }
        .footer-social-btn:hover { transform:translateY(-3px); }
      `}</style>

      <footer className="footer-root" style={{ background: "linear-gradient(160deg,#0F172A 0%,#1E1B4B 60%,#0F172A 100%)", position: "relative", overflow: "hidden" }}>

        {/* Ambient blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* ── TOP CTA STRIP ── */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(99,102,241,0.38)", flexShrink: 0 }}>
                <Icon d={ICONS.cross} size={22} color="white" />
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1 }}>
                  CURA<span style={{ color: "#A78BFA" }}>LINK</span>
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Your Personal Health Hub</p>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TRUST_ITEMS.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20, padding: "5px 12px" }}>
                  <Icon d={t.icon} size={12} color={t.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN COLUMNS ── */}
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "40px 32px" }}>

          {/* Col 1 — Brand */}
          <motion.div variants={fadeUp}>
            <ColHeading>About CuraLink</ColHeading>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.50)", lineHeight: 1.8, marginBottom: 22 }}>
              Connecting you to trusted healthcare professionals with AI-powered guidance and seamless digital consultations. Your health, simplified.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map(({ label, color, bg, C }) => (
                <motion.button key={label} aria-label={label} className="footer-social-btn"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
                  whileHover={{ y: -3, backgroundColor: bg, color }}
                  whileTap={{ scale: 0.93 }}>
                  <C />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Col 2 — Quick Links */}
          <motion.div variants={fadeUp}>
            <ColHeading>Quick Links</ColHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {QUICK_LINKS.map(l => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
            </ul>
          </motion.div>

          {/* Col 3 — For Patients */}
          <motion.div variants={fadeUp}>
            <ColHeading>For Patients</ColHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {PATIENT_LINKS.map(l => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
            </ul>
          </motion.div>

          {/* Col 4 — Contact + Newsletter */}
          <motion.div variants={fadeUp}>
            <ColHeading>Get In Touch</ColHeading>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { icon: ICONS.location, text: "123 Health St, Wellness City" },
                { icon: ICONS.mail,     text: "support@curalink.com",   href: "mailto:support@curalink.com" },
                { icon: ICONS.phone,    text: "(123) 456-7890",          href: "tel:+1234567890" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon d={c.icon} size={13} color="#A78BFA" />
                  </div>
                  {c.href
                    ? <a href={c.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.18s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#A78BFA"}
                        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>{c.text}</a>
                    : <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{c.text}</span>
                  }
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                <Icon d={ICONS.sparkle} size={11} color="#A78BFA" style={{ display: "inline", marginRight: 5 }} />
                Health Updates
              </p>
              {subscribed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 0" }}>
                  <Icon d={ICONS.check} size={15} color="#10B981" />
                  <span style={{ fontSize: 13, color: "#10B981", fontWeight: 700 }}>You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex" }}>
                  <input type="email" className="footer-input" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                  <button type="submit" className="footer-sub-btn">
                    <Icon d={ICONS.arrow} size={14} color="white" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </motion.div>

        {/* ── BOTTOM BAR ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
              © {year} CuraLink. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 5 }}>
              Designed with <Icon d={ICONS.heart} size={11} color="#EC4899" style={{ display: "inline" }} /> for your well-being.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                <Link key={l} to={`/${l.toLowerCase().replace(/ /g, "-")}`}
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: 500, transition: "color 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#A78BFA"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
                  {l}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

      </footer>
    </>
  );
};

export default Footer;