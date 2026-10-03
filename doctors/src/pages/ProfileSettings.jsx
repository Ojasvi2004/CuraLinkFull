import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
const server=import.meta.env.VITE_SERVER;

// ─── ICON SYSTEM ─────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  bell:     ["M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"],
  lock:     ["M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"],
  globe:    ["M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9.5A18.022 18.022 0 0 1 17.588 9m-11.176 0A18.022 18.022 0 0 1 12 2.5c4.418 0 8.463 2.012 11.176 5.5m-22.352 0A18.022 18.022 0 0 1 12 21.5c4.418 0 8.463-2.012 11.176-5.5m-22.352 0h22.352"],
  moon:     "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  chevron:  "m9 18 6-6-6-6",
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  trash:    ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"],
  save:     ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  sms:      ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  key:      ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"],
  privacy:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M12 8v4m0 4h.01"],
};

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onToggle, label, desc, icon, iconBg, iconColor }) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(99,102,241,0.1)" }}
    style={{
      background: "white", borderRadius: 18, border: "1.5px solid",
      borderColor: enabled ? "#C7D2FE" : "#EEF2FF",
      padding: "18px 22px", display: "flex", alignItems: "center", gap: 14,
      transition: "border-color 0.2s",
    }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 13, background: enabled ? iconBg : "#F1F5F9",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      transition: "background 0.2s",
    }}>
      <Icon d={icon} size={20} color={enabled ? iconColor : "#94A3B8"} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{label}</p>
      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{desc}</p>
    </div>
    {/* Toggle pill */}
    <button
      onClick={onToggle}
      style={{
        width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
        background: enabled ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "#E2E8F0",
        position: "relative", transition: "all 0.25s", flexShrink: 0,
        boxShadow: enabled ? "0 2px 8px rgba(99,102,241,0.4)" : "none",
      }}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          position: "absolute", top: 3, left: 0,
          width: 20, height: 20, borderRadius: "50%",
          background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  </motion.div>
);

// ─── SETTINGS CARD ────────────────────────────────────────────────────────────
const SettingsCard = ({ title, subtitle, icon, iconBg, iconColor, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 240, damping: 22 }}
    style={{
      background: "white", borderRadius: 24, border: "1px solid #EEF2FF",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 20,
    }}
  >
    <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={icon} size={20} color={iconColor} />
      </div>
      <div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
    <div style={{ padding: "22px 28px" }}>
      {children}
    </div>
  </motion.div>
);

// ─── NAV LINK ROW ─────────────────────────────────────────────────────────────
const NavRow = ({ icon, iconBg, iconColor, label, to }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <motion.div
      whileHover={{ x: 4, background: "#F8FAFF" }}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
        borderRadius: 16, border: "1.5px solid #EEF2FF", background: "white",
        marginBottom: 10, cursor: "pointer", transition: "all 0.2s",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={icon} size={18} color={iconColor} />
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#334155" }}>{label}</span>
      <Icon d={ICONS.chevron} size={16} color="#CBD5E1" />
    </motion.div>
  </Link>
);

// ─── SELECT FIELD ─────────────────────────────────────────────────────────────
const SelectField = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>{label}</label>
    <div style={{ position: "relative" }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "12px 40px 12px 16px", borderRadius: 14,
          border: "1.5px solid #EEF2FF", background: "#F8FAFF", fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", color: "#0F172A", outline: "none",
          appearance: "none", cursor: "pointer", transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "#6366F1"}
        onBlur={e => e.target.style.borderColor = "#EEF2FF"}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon d="m6 9 6 6 6-6" size={14} color="#6366F1" />
      </div>
    </div>
  </div>
);

// ─── MAIN SETTINGS PAGE ───────────────────────────────────────────────────────
const DoctorSettingsPage = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [availReminders, setAvailReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select { appearance: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{
              background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
              borderRadius: 24, padding: "36px 40px", marginBottom: 32,
              position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(30,58,95,0.4)",
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, right: 140, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon d={ICONS.sparkle} size={15} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>Account Management</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Settings<span style={{ color: "rgba(255,255,255,0.45)" }}>.</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 5, fontWeight: 500 }}>
                  Manage notifications, security, and platform preferences.
                </p>
              </div>

              {/* Save confirmation badge */}
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    style={{
                      background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
                      borderRadius: 14, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <Icon d={ICONS.check} size={16} color="#10B981" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>Settings saved!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick nav pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
              {["Notifications", "Security", "Preferences", "Danger Zone"].map((label, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "6px 14px",
                  border: "1px solid rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.7)", cursor: "pointer",
                }}>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── SECTION 1: NOTIFICATIONS ──────────────────────────────────── */}
          <SettingsCard
            title="Notification Preferences"
            subtitle="Control how and when CuraLink contacts you"
            icon={ICONS.bell} iconBg="#EEF2FF" iconColor="#6366F1"
            delay={0.18}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Toggle
                enabled={emailNotif} onToggle={() => setEmailNotif(!emailNotif)}
                label="Email Notifications" desc="Appointment confirmations, cancellations, and platform updates."
                icon={ICONS.mail} iconBg="#EEF2FF" iconColor="#6366F1"
              />
              <Toggle
                enabled={smsReminders} onToggle={() => setSmsReminders(!smsReminders)}
                label="SMS Reminders" desc="Reminders for your upcoming consultations sent by text."
                icon={ICONS.sms} iconBg="#FFFBEB" iconColor="#D97706"
              />
              <Toggle
                enabled={availReminders} onToggle={() => setAvailReminders(!availReminders)}
                label="Availability Update Reminders" desc="Weekly prompts to update your schedule before the new week."
                icon={ICONS.clock} iconBg="#ECFDF5" iconColor="#059669"
              />
            </div>
          </SettingsCard>

          {/* ── SECTION 2: SECURITY ───────────────────────────────────────── */}
          <SettingsCard
            title="Security & Privacy"
            subtitle="Manage your credentials and data access controls"
            icon={ICONS.shield} iconBg="#FDF2F8" iconColor="#DB2777"
            delay={0.24}
          >
            <NavRow icon={ICONS.key} iconBg="#EEF2FF" iconColor="#6366F1" label="Change Your Password" to="/doctor/change-password" />
            <NavRow icon={ICONS.privacy} iconBg="#ECFDF5" iconColor="#059669" label="Manage Data & Privacy Settings" to="/doctor/privacy-settings" />
            <NavRow icon={ICONS.shield} iconBg="#FFFBEB" iconColor="#D97706" label="Two-Factor Authentication" to="/doctor/2fa" />
          </SettingsCard>

          {/* ── SECTION 3: PREFERENCES ────────────────────────────────────── */}
          <SettingsCard
            title="Platform Preferences"
            subtitle="Language, timezone, and display settings"
            icon={ICONS.globe} iconBg="#ECFDF5" iconColor="#059669"
            delay={0.30}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <SelectField
                label="Display Language" value={language} onChange={setLanguage}
                options={[{ value: "en-US", label: "English (United States)" }, { value: "hi-IN", label: "हिन्दी (भारत)" }]}
              />
              <SelectField
                label="Timezone for Schedule" value={timezone} onChange={setTimezone}
                options={[{ value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" }, { value: "America/New_York", label: "America/New_York (EST)" }]}
              />
            </div>
            <Toggle
              enabled={darkMode} onToggle={() => setDarkMode(!darkMode)}
              label="Dark Mode Theme" desc="Switch the doctor portal to a dark colour scheme."
              icon={ICONS.moon} iconBg="#EEF2FF" iconColor="#6366F1"
            />
          </SettingsCard>

          {/* ── SECTION 4: DANGER ZONE ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
            style={{
              background: "white", borderRadius: 24, border: "1.5px solid #FEE2E2",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 32,
            }}
          >
            <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #FEE2E2", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d={ICONS.trash} size={20} color="#EF4444" />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#B91C1C" }}>Danger Zone</h2>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Irreversible account actions</p>
              </div>
            </div>
            <div style={{ padding: "22px 28px" }}>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 20 }}>
                Permanently delete your CuraLink account and all associated patient records, appointment history, and analytics data. This action <strong style={{ color: "#B91C1C" }}>cannot be undone</strong>.
              </p>
              <motion.button
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(239,68,68,0.25)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.confirm("Are you absolutely sure? This cannot be undone.") && alert("Account deletion initiated.")}
                style={{
                  background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FEE2E2",
                  borderRadius: 14, padding: "12px 24px", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <Icon d={ICONS.trash} size={14} color="#DC2626" />
                Request Account Deletion
              </motion.button>
            </div>
          </motion.div>

          {/* ── SAVE BUTTON ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(99,102,241,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              style={{
                background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                color: "white", border: "none", borderRadius: 16,
                padding: "14px 40px", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 6px 24px rgba(99,102,241,0.35)",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <Icon d={ICONS.save} size={16} color="white" />
              Save All Settings
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DoctorSettingsPage;