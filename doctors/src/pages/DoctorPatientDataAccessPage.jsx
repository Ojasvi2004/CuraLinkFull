import React, { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  users:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  search:   ["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],
  sort:     ["M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"],
  plus:     ["M12 5v14", "M5 12h14"],
  x:        ["M18 6 6 18", "m6 6 12 12"],
  check:    ["M20 6 9 17l-5-5"],
  pulse:    "M22 12h-4l-3 9L9 3l-3 9H2",
  info:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4", "M12 16h.01"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  file:     ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  flask:    ["M9 3h6m-5 0v6l-4.5 9A1 1 0 0 0 6.4 19.5h11.2a1 1 0 0 0 .9-1.5L14 9V3"],
  bell:     ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  send:     ["M22 2L11 13", "M22 2L15 22 11 13 2 9l20-7z"],
  zap:      ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "linear-gradient(135deg,#0EA5E9,#38BDF8)",
  "linear-gradient(135deg,#10B981,#34D399)",
  "linear-gradient(135deg,#F59E0B,#FBBF24)",
  "linear-gradient(135deg,#EC4899,#F472B6)",
  "linear-gradient(135deg,#8B5CF6,#A78BFA)",
];
const getGradient = (name = "") => AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
const getInitials = (name = "") => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
const getTodayISO = () => new Date().toISOString().split("T")[0];

const TABS = [
  { key: "all",     label: "All Patients"         },
  { key: "today",   label: "Today's Appointments" },
  { key: "granted", label: "Access Granted"       },
  { key: "pending", label: "Pending"              },
];

const SCOPE_OPTIONS = [
  { value: "full",   label: "Full Record",   desc: "All history, labs, vitals" },
  { value: "recent", label: "Recent Visits", desc: "Last 6 months only"        },
  { value: "labs",   label: "Lab Reports",   desc: "Pathology & imaging"       },
  { value: "meds",   label: "Medications",   desc: "Prescriptions & allergies" },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, isToday }) => {
  const map = {
    granted: { bg: "#DCFCE7", color: "#15803D", label: "Access Granted" },
    pending: { bg: "#FEF9C3", color: "#A16207", label: "Pending"        },
    none: isToday
      ? { bg: "#EEF2FF", color: "#4F46E5", label: "Today"     }
      : { bg: "#F1F5F9", color: "#475569", label: "No Access" },
  };
  const s = map[status] || map.none;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em",
      textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type = "success", visible }) => {
  const colors = {
    success: { bg: "linear-gradient(135deg,#10B981,#34D399)", shadow: "rgba(16,185,129,0.4)" },
    info:    { bg: "linear-gradient(135deg,#6366F1,#8B5CF6)", shadow: "rgba(99,102,241,0.4)" },
    warning: { bg: "linear-gradient(135deg,#F59E0B,#FBBF24)", shadow: "rgba(245,158,11,0.4)" },
  };
  const c = colors[type] || colors.success;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          style={{ position: "fixed", bottom: 32, right: 32, background: c.bg, color: "white",
            padding: "14px 22px", borderRadius: 16, fontSize: 13, fontWeight: 700,
            boxShadow: `0 8px 24px ${c.shadow}`, zIndex: 300,
            display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d={ICONS.check} size={15} color="white" /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── REQUEST ACCESS MODAL ─────────────────────────────────────────────────────
const RequestModal = ({ patients, preselectedId, onClose, onSubmit }) => {
  const [selectedPatient, setSelectedPatient] = useState(preselectedId || "");
  const [scope,     setScope]     = useState("full");
  const [reason,    setReason]    = useState("");
  const [duration,  setDuration]  = useState("24h");
  const [submitting,setSubmitting]= useState(false);

  const handleSubmit = async () => {
    if (!selectedPatient) return alert("Please select a patient.");
    setSubmitting(true);
    await onSubmit({ patientId: selectedPatient, scope, reason, duration });
    setSubmitting(false);
  };

  const inputStyle = { width: "100%", padding: "11px 14px", border: "1.5px solid #EEF2FF",
    borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#1E293B", background: "#F8FAFF",
    outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6,
    display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 520,
          boxShadow: "0 30px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#1E3A5F,#2D4E8A)", padding: "24px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>New Request</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "white" }}>
              Request Health Record Access
            </p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.x} size={16} color="white" />
          </motion.button>
        </div>
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20,
          maxHeight: "70vh", overflowY: "auto" }}>
          <div>
            <label style={labelStyle}>Patient</label>
            <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)} style={inputStyle}>
              <option value="">— Select Patient —</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Access Scope</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SCOPE_OPTIONS.map(opt => (
                <motion.div key={opt.value} whileHover={{ y: -1 }} onClick={() => setScope(opt.value)}
                  style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 14px",
                    borderRadius: 12, cursor: "pointer", transition: "all 0.15s",
                    border: `2px solid ${scope === opt.value ? "#C7D2FE" : "#EEF2FF"}`,
                    background: scope === opt.value ? "#EEF2FF" : "#F8FAFF" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 700,
                      color: scope === opt.value ? "#4F46E5" : "#334155" }}>{opt.label}</span>
                    {scope === opt.value && <Icon d={ICONS.check} size={13} color="#4F46E5" />}
                  </div>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>{opt.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Reason for Access</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              placeholder="e.g. Review prior cardiac history before today's consultation…"
              style={{ ...inputStyle, resize: "none", height: 80 }} />
          </div>
          <div>
            <label style={labelStyle}>Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle}>
              <option value="6h">6 hours</option>
              <option value="24h">24 hours</option>
              <option value="48h">48 hours</option>
              <option value="7d">7 days (extended care)</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10,
            background: "#ECFDF5", borderRadius: 12, padding: "12px 14px", border: "1px solid #86EFAC" }}>
            <Icon d={ICONS.shield} size={16} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "#047857", lineHeight: 1.5 }}>
              Patient will be notified of this request. Access is logged and auditable per DPDP Act guidelines.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
              style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #EEF2FF",
                background: "#F8FAFF", color: "#64748B", fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Cancel
            </motion.button>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={handleSubmit} disabled={submitting}
              style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none",
                background: submitting ? "#C7D2FE" : "linear-gradient(135deg,#6366F1,#8B5CF6)",
                color: "white", fontWeight: 700, fontSize: 13,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: submitting ? "none" : "0 6px 18px rgba(99,102,241,0.3)" }}>
              {submitting ? "Sending request…" : "✦ Send Request"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── SINGLE CONSENT MODAL ─────────────────────────────────────────────────────
const ConsentModal = ({ patient, onClose, onConfirm, sending }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.22 }}
      style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 420,
        boxShadow: "0 30px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg,#7C3AED,#6366F1)", padding: "22px 26px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon d={ICONS.bell} size={18} color="white" />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "white" }}>
            Ask for Consent
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.15)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICONS.x} size={14} color="white" />
        </motion.button>
      </div>
      <div style={{ padding: "24px 26px" }}>
        <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>
          A consent notification will be sent to{" "}
          <strong style={{ color: "#0F172A" }}>{patient?.name}</strong>{" "}
          requesting permission to access their health records for today's consultation.
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10,
          background: "#F5F3FF", borderRadius: 12, padding: "12px 14px",
          border: "1px solid #DDD6FE", marginBottom: 20 }}>
          <Icon d={ICONS.shield} size={15} color="#7C3AED" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#6D28D9", lineHeight: 1.5 }}>
            The patient can approve or decline via the app. You will be notified once they respond.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #EEF2FF",
              background: "#F8FAFF", color: "#64748B", fontWeight: 700, fontSize: 13,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </motion.button>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm} disabled={sending}
            style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none",
              background: sending ? "#DDD6FE" : "linear-gradient(135deg,#7C3AED,#6366F1)",
              color: "white", fontWeight: 700, fontSize: 13,
              cursor: sending ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: sending ? "none" : "0 6px 18px rgba(124,58,237,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Icon d={ICONS.send} size={14} color="white" />
            {sending ? "Sending…" : "Send Consent Request"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── BULK CONSENT MODAL ───────────────────────────────────────────────────────
const BulkConsentModal = ({ todayPatients, onClose, onConfirm, sending }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.22 }}
      style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 480,
        boxShadow: "0 30px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg,#0F172A,#1E3A5F)", padding: "22px 26px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon d={ICONS.zap} size={18} color="#FBBF24" />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "white" }}>
            Bulk Consent Request
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.12)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICONS.x} size={14} color="white" />
        </motion.button>
      </div>
      <div style={{ padding: "24px 26px" }}>
        <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, marginBottom: 16 }}>
          Send consent notifications to all{" "}
          <strong style={{ color: "#0F172A" }}>
            {todayPatients.length} patient{todayPatients.length !== 1 ? "s" : ""}
          </strong>{" "}
          scheduled for today who don't already have access granted.
        </p>
        <div style={{ background: "#F8FAFF", border: "1px solid #EEF2FF", borderRadius: 14,
          overflow: "hidden", marginBottom: 16, maxHeight: 180, overflowY: "auto" }}>
          {todayPatients.map((p, i) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px",
              borderBottom: i < todayPatients.length - 1 ? "1px solid #EEF2FF" : "none" }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: getGradient(p.name),
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>{getInitials(p.name)}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 10, color: "#94A3B8", background: "#F1F5F9",
                padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                {p.appointmentTime || "Today"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10,
          background: "#FFFBEB", borderRadius: 12, padding: "12px 14px",
          border: "1px solid #FDE68A", marginBottom: 20 }}>
          <Icon d={ICONS.info} size={15} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
            Each patient receives an individual notification. Already-granted or pending patients are skipped.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #EEF2FF",
              background: "#F8FAFF", color: "#64748B", fontWeight: 700, fontSize: 13,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </motion.button>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm} disabled={sending}
            style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none",
              background: sending ? "#94A3B8" : "linear-gradient(135deg,#0F172A,#1E3A5F)",
              color: "white", fontWeight: 700, fontSize: 13,
              cursor: sending ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: sending ? "none" : "0 6px 18px rgba(15,23,42,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Icon d={ICONS.send} size={14} color="white" />
            {sending ? "Sending…" : `Send to All ${todayPatients.length} Patients`}
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── PATIENT ROW ──────────────────────────────────────────────────────────────
const PatientRow = ({ patient, index, onRequest, onRevoke, onView, onAskConsent, consentSending }) => {
  const gradient = getGradient(patient.name);
  const initials  = getInitials(patient.name);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(99,102,241,0.14)" }}
      style={{ background: "white", borderRadius: 16, border: "1px solid #EEF2FF",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        transition: "box-shadow 0.2s", position: "relative", overflow: "hidden" }}>

      {/* Today accent stripe */}
      {patient.isToday && (
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: "linear-gradient(180deg,#6366F1,#8B5CF6)", borderRadius: "16px 0 0 16px" }} />
      )}

      {/* Avatar */}
      <div style={{ width: 46, height: 46, borderRadius: 14, background: gradient,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: "0 4px 12px rgba(99,102,241,0.2)", marginLeft: patient.isToday ? 6 : 0 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 800, color: "white" }}>
          {initials}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {patient.name}
        </p>
        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
          {patient.primaryConcern || "General"}
          {patient.appointmentTime
            ? ` · ${patient.appointmentTime} · ${patient.appointmentType === "DIGITAL" ? "Video Call" : "In-Person"}`
            : " · Returning Patient"}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
        <StatusBadge status={patient.accessStatus} isToday={patient.isToday} />

        {/* Ask Consent — today's patients with no access */}
        {patient.isToday && patient.accessStatus === "none" && (
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => onAskConsent(patient)}
            disabled={consentSending === patient._id}
            style={{ padding: "8px 14px", borderRadius: 10, border: "none",
              background: consentSending === patient._id
                ? "#DDD6FE" : "linear-gradient(135deg,#7C3AED,#6366F1)",
              color: "white", fontSize: 12, fontWeight: 700,
              cursor: consentSending === patient._id ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 5,
              boxShadow: "0 3px 10px rgba(124,58,237,0.25)" }}>
            <Icon d={ICONS.bell} size={12} color="white" />
            {consentSending === patient._id ? "Sending…" : "Ask Consent"}
          </motion.button>
        )}

        {patient.accessStatus === "granted" && (
          <>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={() => onView(patient)}
              style={{ padding: "8px 14px", borderRadius: 10, border: "none",
                background: "#EEF2FF", color: "#4F46E5", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: 5 }}>
              <Icon d={ICONS.eye} size={12} color="#4F46E5" /> View Records
            </motion.button>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={() => onRevoke(patient)}
              style={{ padding: "8px 14px", borderRadius: 10, border: "none",
                background: "#FEE2E2", color: "#B91C1C", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Revoke
            </motion.button>
          </>
        )}

        {patient.accessStatus === "pending" && (
          <button disabled
            style={{ padding: "8px 16px", borderRadius: 10, border: "none",
              background: "#F1F5F9", color: "#94A3B8", fontSize: 12, fontWeight: 700,
              cursor: "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
            Awaiting consent…
          </button>
        )}

        {/* Request Access — non-today patients with no access */}
        {patient.accessStatus === "none" && !patient.isToday && (
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => onRequest(patient._id)}
            style={{ padding: "8px 16px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 3px 10px rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", gap: 5 }}>
            <Icon d={ICONS.lock} size={12} color="white" /> Request Access
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// ─── ACTIVITY LOG ITEM ────────────────────────────────────────────────────────
const ActivityItem = ({ item, index }) => {
  const dotColors = { granted: "#10B981", pending: "#F59E0B", revoked: "#EF4444", expired: "#6366F1", consent: "#7C3AED" };
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 24px",
        borderBottom: index < 4 ? "1px solid #F8FAFF" : "none", transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFF"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <div style={{ width: 8, height: 8, borderRadius: "50%",
        background: dotColors[item.type] || "#94A3B8", marginTop: 5, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 13, color: "#334155", fontWeight: 500, lineHeight: 1.5 }}>{item.text}</p>
        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{item.time}</p>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorPatientDataAccessPage = () => {
  const { token } = useContext(AuthContext);

  const [patients,    setPatients]    = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("all");
  const [searchTerm,  setSearchTerm]  = useState("");
  const [sortBy,      setSortBy]      = useState("name");

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [preselectedId,   setPreselectedId]   = useState(null);
  const [consentTarget,   setConsentTarget]   = useState(null);
  const [showBulkConsent, setShowBulkConsent] = useState(false);
  const [consentSending,  setConsentSending]  = useState(null);
  const [bulkSending,     setBulkSending]     = useState(false);

  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  };

  // ── FETCH ───────────────────────────────────────────────────────────────────
  // Uses the same call pattern as DoctorAppointmentsPage (confirmed working).
  // All secondary endpoints (permissions, activity) are optional — failures are
  // caught individually so they never block the patient list from rendering.
  const fetchData = useCallback(async () => {
    setLoading(true);
    const headers  = { Authorization: `Bearer ${token}` };
    const todayISO = getTodayISO() + "T00:00:00.000+00:00";

    // 1. Today's appointments — exact same call as DoctorAppointmentsPage ─────
    // Shape: { DayAppointment: [{ patientName, time: { start }, consultationType, notes, status }] }
    const todayNameMap = {}; // keyed by patientName (matches how appointments store patients)
    try {
      const res = await axios.post(
        "http://localhost:8000/api/doctors/gettodayAppointment",
        { dateISO: todayISO },
        { headers }
      );
      if (res.data.success) {
        (res.data.DayAppointment || []).forEach(apt => {
          todayNameMap[apt.patientName] = {
            appointmentTime: apt.time?.start      || null,
            appointmentType: apt.consultationType || null,
            primaryConcern:  apt.notes            || "General",
          };
        });
      }
    } catch (err) {
      console.error("gettodayAppointment error:", err.response?.data || err.message);
    }

    // 2. Patient list ──────────────────────────────────────────────────────────
    // Shape: { patient: [{ _id, name, ... }] }
    let patientList = [];
    try {
      const res = await axios.get(
        "http://localhost:8000/api/doctors/get-patients",
        { headers }
      );
      if (res.data.success) {
        patientList = res.data.patient || [];
      }
    } catch (err) {
      console.error("get-patients error:", err.response?.data || err.message);
    }

    // 3. Permissions map (optional) ───────────────────────────────────────────
    const permMap = {};
    try {
      const res = await axios.get(
        "http://localhost:8000/api/doctors/permissions/status",
        { headers }
      );
      if (res.data.success) {
        (res.data.permissions || []).forEach(p => { permMap[p.patientId] = p.status; });
      }
    } catch (_) { /* endpoint may not exist yet — silently skip */ }

    // 4. Activity log (optional) ──────────────────────────────────────────────
    try {
      const res = await axios.get(
        "http://localhost:8000/api/doctors/permissions/activity",
        { headers }
      );
      if (res.data.success) setActivityLog(res.data.activity || []);
    } catch (_) { /* silently skip */ }

    // 5. Merge: match each patient to today's appointment by name ─────────────
    setPatients(patientList.map(p => {
      const todayInfo = todayNameMap[p.name] || null;
      return {
        ...p,
        accessStatus:    permMap[p._id]             || "none",
        isToday:         !!todayInfo,
        appointmentTime: todayInfo?.appointmentTime || null,
        appointmentType: todayInfo?.appointmentType || null,
        primaryConcern:  todayInfo?.primaryConcern  || p.primaryConcern || "General",
      };
    }));

    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── HANDLERS ────────────────────────────────────────────────────────────────
  const handleRequestAccess = (patientId) => {
    setPreselectedId(patientId);
    setShowAccessModal(true);
  };

  const handleSubmitRequest = async ({ patientId, scope, reason, duration }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/doctors/permissions/request",
        { patientId, scope, reason, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPatients(prev => prev.map(p => p._id === patientId ? { ...p, accessStatus: "pending" } : p));
        const p = patients.find(x => x._id === patientId);
        setActivityLog(prev => [{ text: `Request sent — ${p?.name}`, time: "Just now", type: "pending" }, ...prev]);
        setShowAccessModal(false);
        showToast("Access request sent successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send request. Please try again.");
    }
  };

  const handleRevoke = async (patient) => {
    if (!window.confirm(`Revoke health record access for ${patient.name}?`)) return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/doctors/permissions/revoke",
        { patientId: patient._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPatients(prev => prev.map(p => p._id === patient._id ? { ...p, accessStatus: "none" } : p));
        setActivityLog(prev => [{ text: `Access revoked — ${patient.name}`, time: "Just now", type: "revoked" }, ...prev]);
        showToast("Access revoked.");
      }
    } catch (err) { console.error(err); }
  };

  const handleViewRecord = (patient) => {
    window.location.href = `/doctor/patient-record/${patient._id}`;
  };

  // single consent
  const handleAskConsent = (patient) => setConsentTarget(patient);

  const handleConfirmSingleConsent = async () => {
    if (!consentTarget) return;
    setConsentSending(consentTarget._id);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/doctors/permissions/request-consent",
        { patientId: consentTarget._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setPatients(prev => prev.map(p =>
          p._id === consentTarget._id ? { ...p, accessStatus: "pending" } : p
        ));
        setActivityLog(prev => [
          { text: `Consent request sent — ${consentTarget.name}`, time: "Just now", type: "consent" },
          ...prev,
        ]);
        showToast(`Consent request sent to ${consentTarget.name}!`, "info");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to send consent request.", "warning");
    }
    setConsentSending(null);
    setConsentTarget(null);
  };

  // bulk consent
  const todayNeedingConsent = patients.filter(p => p.isToday && p.accessStatus === "none");

  const handleBulkConsent = () => {
    if (todayNeedingConsent.length === 0) {
      showToast("All today's patients already have access or pending requests!", "info");
      return;
    }
    setShowBulkConsent(true);
  };

  const handleConfirmBulkConsent = async () => {
    setBulkSending(true);
    let successCount = 0;
    for (const patient of todayNeedingConsent) {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/doctors/permissions/request-consent",
          { patientId: patient._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          successCount++;
          setPatients(prev => prev.map(p =>
            p._id === patient._id ? { ...p, accessStatus: "pending" } : p
          ));
        }
      } catch (err) {
        console.error(`Consent failed for ${patient.name}:`, err);
      }
    }
    setActivityLog(prev => [
      { text: `Bulk consent sent to ${successCount} patient(s)`, time: "Just now", type: "consent" },
      ...prev,
    ]);
    setBulkSending(false);
    setShowBulkConsent(false);
    showToast(`Consent requests sent to ${successCount} patient${successCount !== 1 ? "s" : ""}!`, "info");
  };

  // ── FILTER + SORT ────────────────────────────────────────────────────────────
  const visiblePatients = patients
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab =
        activeTab === "all"     ? true :
        activeTab === "today"   ? p.isToday :
        activeTab === "granted" ? p.accessStatus === "granted" :
        activeTab === "pending" ? p.accessStatus === "pending" : true;
      return matchSearch && matchTab;
    })
    .sort((a, b) => {
      if (sortBy === "name")   return a.name.localeCompare(b.name);
      if (sortBy === "status") {
        const ord = { granted: 0, pending: 1, none: 2 };
        return (ord[a.accessStatus] ?? 3) - (ord[b.accessStatus] ?? 3);
      }
      if (sortBy === "time")
        return (a.appointmentTime || "ZZ").localeCompare(b.appointmentTime || "ZZ");
      return 0;
    });

  const grantedCount = patients.filter(p => p.accessStatus === "granted").length;
  const pendingCount = patients.filter(p => p.accessStatus === "pending").length;
  const todayCount   = patients.filter(p => p.isToday).length;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #94A3B8; }
        select option { color: #0F172A; }
        input:focus, select:focus, textarea:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
      `}</style>

      <div style={{ minHeight: "100vh",
        background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)",
        fontFamily: "'DM Sans', sans-serif" }}>

        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)",
          pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)",
          pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px",
          position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)",
              borderRadius: 24, padding: "36px 40px", marginBottom: 32,
              position: "relative", overflow: "hidden",
              boxShadow: "0 16px 48px rgba(30,58,95,0.4)" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 240, height: 240,
              borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start",
              justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon d={ICONS.lock} size={15} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>
                    Permissions & Data Access
                  </p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34,
                  fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Patient Data Access<span style={{ color: "rgba(255,255,255,0.45)" }}>.</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 5, fontWeight: 500 }}>
                  Request secure access to patient health records for AI-powered diagnosis insights.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={handleBulkConsent}
                  style={{ display: "flex", alignItems: "center", gap: 9,
                    background: "rgba(251,191,36,0.15)", border: "1.5px solid rgba(251,191,36,0.4)",
                    borderRadius: 14, padding: "13px 20px", cursor: "pointer",
                    color: "#FCD34D", fontWeight: 700, fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                    backdropFilter: "blur(8px)" }}>
                  <Icon d={ICONS.zap} size={15} color="#FCD34D" />
                  Consent All Today ({todayNeedingConsent.length})
                </motion.button>
                <motion.button
                  whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setPreselectedId(null); setShowAccessModal(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 9,
                    background: "linear-gradient(135deg,#10B981,#34D399)", border: "none",
                    borderRadius: 14, padding: "13px 24px", cursor: "pointer",
                    color: "white", fontWeight: 700, fontSize: 14,
                    boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
                    fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                  <Icon d={ICONS.plus} size={16} color="white" /> Request Access
                </motion.button>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {[
                { label: "Access Granted",   value: loading ? "—" : grantedCount,               icon: ICONS.shield   },
                { label: "Pending",          value: loading ? "—" : pendingCount,               icon: ICONS.clock    },
                { label: "Today's Patients", value: loading ? "—" : todayCount,                 icon: ICONS.calendar },
                { label: "Needs Consent",    value: loading ? "—" : todayNeedingConsent.length, icon: ICONS.bell     },
                { label: "AI Insights",      value: "Active",                                    icon: ICONS.sparkle  },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12,
                  padding: "8px 14px", border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon d={s.icon} size={14} color="rgba(255,255,255,0.8)" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{s.label}:</span>
                  <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── INFO BANNER ───────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
              border: "1px solid #C7D2FE", borderRadius: 16, padding: "16px 20px",
              marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <Icon d={ICONS.info} size={20} color="#4F46E5" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 13, color: "#4338CA", lineHeight: 1.6 }}>
              <strong>Consent-first access.</strong> Patient health records are securely encrypted.
              Access requests notify the patient and expire after 24 hours unless renewed.
            </p>
          </motion.div>

          {/* ── TABS ──────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{ display: "flex", gap: 8, background: "white", borderRadius: 16,
              border: "1px solid #EEF2FF", padding: 6, marginBottom: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {TABS.map(tab => (
              <motion.button key={tab.key} whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.key)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  background: activeTab === tab.key
                    ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "transparent",
                  color: activeTab === tab.key ? "white" : "#64748B",
                  boxShadow: activeTab === tab.key ? "0 4px 14px rgba(99,102,241,0.3)" : "none" }}>
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* ── SEARCH + SORT ─────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "16px 20px",
              marginBottom: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <div style={{ position: "absolute", left: 13, top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none" }}>
                <Icon d={ICONS.search} size={16} color="#94A3B8" />
              </div>
              <input type="text" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search patients by name…"
                style={{ width: "100%", paddingLeft: 40, paddingRight: 16,
                  paddingTop: 10, paddingBottom: 10, border: "1.5px solid #EEF2FF",
                  borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  color: "#0F172A", outline: "none", background: "#F8FAFF",
                  transition: "border-color 0.2s" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#EEF2FF",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={ICONS.sort} size={15} color="#6366F1" />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ border: "1.5px solid #EEF2FF", borderRadius: 12, padding: "9px 14px",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
                  background: "#F8FAFF", outline: "none", cursor: "pointer", fontWeight: 600 }}>
                <option value="name">Name (A–Z)</option>
                <option value="status">Status</option>
                <option value="time">Appt. Time</option>
              </select>
            </div>
          </motion.div>

          {/* ── PATIENT LIST ──────────────────────────────────────────────────── */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <motion.div animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: 40, height: 40, borderRadius: "50%",
                  border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1" }} />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {visiblePatients.length > 0 ? (
                <motion.div key={activeTab + searchTerm + sortBy}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {visiblePatients.map((patient, i) => (
                    <PatientRow key={patient._id} patient={patient} index={i}
                      onRequest={handleRequestAccess} onRevoke={handleRevoke}
                      onView={handleViewRecord} onAskConsent={handleAskConsent}
                      consentSending={consentSending} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: "white", borderRadius: 24, border: "1px solid #EEF2FF",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "72px 40px", textAlign: "center", marginBottom: 32 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: "#EEF2FF",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon d={ICONS.users} size={28} color="#6366F1" />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22,
                    fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>No patients found</h3>
                  <p style={{ fontSize: 14, color: "#64748B", maxWidth: 320 }}>
                    {searchTerm ? "No patients match your search." : "No patients in this category."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ── ACTIVITY LOG ─────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #F1F5F9",
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={ICONS.pulse} size={17} color="#6366F1" />
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17,
                  fontWeight: 700, color: "#0F172A" }}>Access Activity Log</span>
              </div>
              <span style={{ fontSize: 11, color: "#6366F1", fontWeight: 700,
                background: "#EEF2FF", padding: "3px 10px", borderRadius: 20 }}>LAST 24 HRS</span>
            </div>
            {activityLog.length > 0 ? (
              activityLog.slice(0, 8).map((item, i) => <ActivityItem key={i} item={item} index={i} />)
            ) : (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#94A3B8" }}>No recent activity.</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* ── MODALS ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAccessModal && (
          <RequestModal patients={patients} preselectedId={preselectedId}
            onClose={() => setShowAccessModal(false)} onSubmit={handleSubmitRequest} />
        )}
        {consentTarget && (
          <ConsentModal patient={consentTarget}
            onClose={() => setConsentTarget(null)}
            onConfirm={handleConfirmSingleConsent}
            sending={consentSending === consentTarget._id} />
        )}
        {showBulkConsent && (
          <BulkConsentModal todayPatients={todayNeedingConsent}
            onClose={() => setShowBulkConsent(false)}
            onConfirm={handleConfirmBulkConsent}
            sending={bulkSending} />
        )}
      </AnimatePresence>

      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </>
  );
};

export default DoctorPatientDataAccessPage;