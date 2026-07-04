// src/pages/SettingsPage.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  bell:      ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  lock:      ["M12 15v2", "M6 20h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z", "M16 10V7a4 4 0 0 0-8 0v3"],
  globe:     ["M3 5h12", "M9 3v2", "M10.05 12.5A18.02 18.02 0 0 1 6.41 9", "M13.5 18.5A18.02 18.02 0 0 1 17.6 9", "M6.4 9A18.02 18.02 0 0 1 12 2.5c4.42 0 8.46 2.01 11.18 5.5", "M0.82 8h22.35"],
  chevron:   "m9 18 6-6-6-6",
  key:       ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3-3.5 3.5z"],
  shield:    ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  moon:      "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  danger:    ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  save:      ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
  sparkle:   ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
};

// ─── TOGGLE SWITCH ─────────────────────────────────────────────────────────────
const ToggleSwitch = ({ enabled, setEnabled, labelId }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-labelledby={labelId}
    onClick={() => setEnabled(!enabled)}
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      width: 46,
      height: 26,
      borderRadius: 999,
      border: "none",
      cursor: "pointer",
      flexShrink: 0,
      padding: 0,
      background: enabled ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "#E2E8F0",
      transition: "background 0.25s ease",
      boxShadow: enabled ? "0 4px 12px rgba(99,102,241,0.35)" : "none",
    }}
  >
    <span className="sr-only">Use setting</span>
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      style={{
        position: "absolute",
        top: 3,
        left: enabled ? 23 : 3,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}
    />
  </button>
);

// ─── SHARED STYLE HELPERS ────────────────────────────────────────────────────────
const cardStyle = { background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "26px 28px", marginBottom: 22 };

const sectionHeader = (icon, iconBg, iconColor, title, subtitle) => (
  <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
    <div style={{ width: 38, height: 38, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon d={icon} size={18} color={iconColor} />
    </div>
    <div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#0F172A" }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 1 }}>{subtitle}</p>}
    </div>
  </div>
);

const SettingRow = ({ label, description, labelId, control, bordered = true }) => (
  <div className="flex items-center justify-between gap-4" style={{ padding: "16px 4px", borderTop: bordered ? "1px solid #F1F5F9" : "none" }}>
    <div>
      <label id={labelId} style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{label}</label>
      {description && <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 3, lineHeight: 1.5 }}>{description}</p>}
    </div>
    {control}
  </div>
);

const NavLinkRow = ({ to, icon, label, isLast }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div className="flex items-center justify-between"
      style={{ padding: "14px 6px", borderBottom: isLast ? "none" : "1px solid #F1F5F9", borderRadius: 10, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div className="flex items-center gap-3">
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={icon} size={14} color="#6366F1" />
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>{label}</span>
      </div>
      <Icon d={ICONS.chevron} size={16} color="#CBD5E1" />
    </div>
  </Link>
);

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.08 * i, ease: "easeOut" } }),
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Delete Account Initiated (UI Only)");
    }
  };

  const handleSave = () => {
    alert("Settings Save (UI Only)");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO HEADER ── */}
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{ background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#A78BFA 100%)", borderRadius: 24, padding: "36px 40px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(99,102,241,0.35)" }}>

            <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, right: 120, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <div className="flex items-center gap-2 mb-2">
              <Icon d={ICONS.sparkle} size={16} color="rgba(255,255,255,0.8)" />
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>Account</p>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
              Settings<span style={{ color: "rgba(255,255,255,0.6)" }}>.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6 }}>Manage your notifications, security, and preferences.</p>
          </motion.div>

          {/* ── NOTIFICATIONS ── */}
          <motion.section custom={0} initial="hidden" animate="visible" variants={fadeUp} style={cardStyle}>
            {sectionHeader(ICONS.bell, "#EEF2FF", "#6366F1", "Notifications", "How we reach you about your care")}
            <div>
              <SettingRow
                labelId="email-label"
                label="Email Notifications"
                description="Receive updates about appointments and platform news via email."
                bordered={false}
                control={<ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} labelId="email-label" />}
              />
              <SettingRow
                labelId="sms-label"
                label="SMS Reminders"
                description="Get text message reminders for your upcoming appointments."
                control={<ToggleSwitch enabled={smsReminders} setEnabled={setSmsReminders} labelId="sms-label" />}
              />
            </div>
          </motion.section>

          {/* ── SECURITY & PRIVACY ── */}
          <motion.section custom={1} initial="hidden" animate="visible" variants={fadeUp} style={cardStyle}>
            {sectionHeader(ICONS.lock, "#FEF2F2", "#DC2626", "Security & Privacy", "Keep your account safe")}
            <div>
              <NavLinkRow to="/change-password" icon={ICONS.key} label="Change Your Password" />
              <NavLinkRow to="/privacy-settings" icon={ICONS.shield} label="Manage Privacy Settings" />
              <NavLinkRow to="/account-activity" icon={ICONS.activity} label="View Account Activity" isLast />
            </div>
          </motion.section>

          {/* ── PREFERENCES ── */}
          <motion.section custom={2} initial="hidden" animate="visible" variants={fadeUp} style={cardStyle}>
            {sectionHeader(ICONS.globe, "#ECFDF5", "#059669", "Preferences", "Tailor the app to how you work")}
            <div>
              <div style={{ padding: "4px 4px 16px" }}>
                <label htmlFor="language" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Language</label>
                <select
                  id="language"
                  name="language"
                  defaultValue="en-US"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#1E293B", background: "white", outline: "none" }}
                >
                  <option value="en-US">English (United States)</option>
                  <option value="hi-IN">हिन्दी (भारत)</option>
                </select>
              </div>
              <SettingRow
                labelId="dark-mode-label"
                label="Dark Mode"
                description="Toggle dark theme for the application."
                control={<ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} labelId="dark-mode-label" />}
              />
            </div>
          </motion.section>

          {/* ── ACCOUNT MANAGEMENT / DANGER ZONE ── */}
          <motion.section custom={3} initial="hidden" animate="visible" variants={fadeUp}
            style={{ ...cardStyle, background: "#FFF7F7", border: "1px solid #FECACA" }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d={ICONS.danger} size={18} color="#DC2626" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#B91C1C" }}>Account Management</h3>
            </div>
            <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, marginBottom: 16 }}>
              If you wish to permanently delete your CuraLink account and all associated data, please proceed with caution. This action cannot be undone.
            </p>
            <motion.button
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              onClick={handleDeleteAccount}
              style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", background: "white", border: "1.5px solid #FCA5A5", padding: "10px 20px", borderRadius: 12, cursor: "pointer" }}
            >
              Delete My Account
            </motion.button>
          </motion.section>

          {/* ── SAVE BAR ── */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="flex justify-end" style={{ marginTop: 28 }}>
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(99,102,241,0.35)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(99,102,241,0.3)" }}
            >
              <Icon d={saved ? ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"] : ICONS.save} size={16} color="white" />
              {saved ? "Saved" : "Save Settings"}
            </motion.button>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default SettingsPage;