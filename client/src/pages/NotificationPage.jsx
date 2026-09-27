import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar:    ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  pill:        "M10.5 3.5a4 4 0 0 1 5.657 5.657l-7.07 7.07a4 4 0 0 1-5.658-5.656l7.07-7.07z M14 10l-4 4",
  ai:          ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  doc:         "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  bell:        ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  message:     ["M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"],
  alert:       ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  check:       ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  checkDouble: ["m3 12 5 5L18 7", "m9 12 5 5L24 7"],
  chevron:     "m9 18 6-6-6-6",
  sparkle:     ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  trash:       ["M3 6h18", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M10 11v6", "M14 11v6"],
  inbox:       ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  flask:       ["M9 2v6.5L4.5 17a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2", "M9 2h6", "M8.5 13h7"],
  dot:         ["M12 12h.01"],
};

// ─── MOCK DATA (wire to your API) ───────────────────────────────────────────────
const FILTERS = [
  { key: "all",           label: "All" },
  { key: "appointment",   label: "Appointments" },
  { key: "prescription",  label: "Prescriptions" },
  { key: "lab",           label: "Lab Results" },
  { key: "message",       label: "Messages" },
  { key: "alert",         label: "Alerts" },
];

const TYPE_META = {
  appointment:  { icon: ICONS.calendar, color: "#6366F1", bg: "#EEF2FF", label: "Appointment" },
  prescription: { icon: ICONS.pill,     color: "#D97706", bg: "#FFFBEB", label: "Prescription" },
  lab:          { icon: ICONS.flask,    color: "#0284C7", bg: "#E0F2FE", label: "Lab Result" },
  message:      { icon: ICONS.message,  color: "#7C3AED", bg: "#F5F3FF", label: "Message" },
  alert:        { icon: ICONS.alert,    color: "#DC2626", bg: "#FEF2F2", label: "Alert" },
  ai:           { icon: ICONS.ai,       color: "#059669", bg: "#ECFDF5", label: "AI Insight" },
};

const MOCK_NOTIFICATIONS = [
//   { id: 1,  type: "appointment",  title: "Appointment confirmed with Dr. Priya Reddy",  detail: "Tomorrow, 10:00 AM · Dermatology · Video Consultation", time: "12m ago",   group: "Today",     unread: true,  link: "/my-appointments" },
//   { id: 2,  type: "alert",        title: "Action needed: reschedule with Dr. Verma",     detail: "Your 3:30 PM slot today has been cancelled by the clinic.", time: "1h ago", group: "Today",     unread: true,  link: "/my-appointments" },
//   { id: 3,  type: "lab",          title: "Lab results are ready",                        detail: "Complete Blood Count (CBC) — reviewed by Dr. Anand Rao", time: "3h ago",   group: "Today",     unread: true,  link: "/health-records" },
//   { id: 4,  type: "message",      title: "New message from Dr. Priya Reddy",             detail: "\u201cPlease continue the ointment for 5 more days...\u201d", time: "5h ago", group: "Today",     unread: false, link: "/messages" },
//   { id: 5,  type: "prescription", title: "Prescription uploaded — Dermatology",          detail: "Added to your Health Vault automatically after visit", time: "Yesterday, 6:40 PM", group: "Yesterday", unread: false, link: "/prescriptions" },
//   { id: 6,  type: "ai",           title: "AI Symptom report generated",                  detail: "Mild seasonal allergy pattern detected — no urgent action needed", time: "Yesterday, 11:02 AM", group: "Yesterday", unread: false, link: "/symptom-analyzer" },
//   { id: 7,  type: "appointment",  title: "Reminder: annual health check-up due",         detail: "It's been 11 months since your last full check-up", time: "2 days ago", group: "Earlier",  unread: false, link: "/find-doctors" },
//   { id: 8,  type: "message",      title: "New message from Dr. Kabir Malhotra",          detail: "Shared your updated diet plan and follow-up notes", time: "4 days ago", group: "Earlier",  unread: false, link: "/messages" },
//   { id: 9,  type: "prescription", title: "Prescription expiring soon",                   detail: "Your Cetirizine 10mg prescription expires in 3 days", time: "5 days ago", group: "Earlier",  unread: false, link: "/prescriptions" },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const groupOrder = ["Today", "Yesterday", "Earlier"];

// ─── NOTIFICATION ROW ──────────────────────────────────────────────────────────
const NotificationRow = ({ item, index, onToggleRead, onDismiss }) => {
  const meta = TYPE_META[item.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
      transition={{ delay: 0.04 * index, type: "spring", stiffness: 260, damping: 24 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "18px 20px",
        borderRadius: 18,
        background: item.unread ? "#F8FAFF" : "white",
        border: item.unread ? "1px solid #E0E7FF" : "1px solid #F1F5F9",
        marginBottom: 10,
        position: "relative",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {item.unread && (
        <span style={{ position: "absolute", top: 18, left: 8, width: 6, height: 6, borderRadius: "50%", background: "#6366F1" }} />
      )}

      <div style={{ width: 44, height: 44, borderRadius: 14, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={meta.icon} size={20} color={meta.color} />
      </div>

      <Link to={item.link} style={{ textDecoration: "none", flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, background: meta.bg, padding: "2px 9px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {meta.label}
          </span>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>{item.time}</span>
        </div>
        <p style={{ fontSize: 14, fontWeight: item.unread ? 700 : 600, color: "#0F172A", lineHeight: 1.4 }}>{item.title}</p>
        <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 3, lineHeight: 1.55, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.detail}</p>
      </Link>

      <div className="flex items-center gap-1" style={{ flexShrink: 0, alignSelf: "center" }}>
        <button
          onClick={() => onToggleRead(item.id)}
          title={item.unread ? "Mark as read" : "Mark as unread"}
          style={{ width: 32, height: 32, borderRadius: 10, border: "none", background: item.unread ? "#EEF2FF" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Icon d={ICONS.check} size={14} color={item.unread ? "#6366F1" : "#94A3B8"} />
        </button>
        <button
          onClick={() => onDismiss(item.id)}
          title="Dismiss"
          style={{ width: 32, height: 32, borderRadius: 10, border: "none", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Icon d={ICONS.trash} size={14} color="#94A3B8" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const Notifications = () => {
  const { user } = useContext(Authcontext);
  const userName = user?.name || "there";

  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = items.filter(i => i.unread).length;
  const todayCount = items.filter(i => i.group === "Today").length;

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter(i => i.type === filter);
  }, [items, filter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(i => {
      if (!map[i.group]) map[i.group] = [];
      map[i.group].push(i);
    });
    return map;
  }, [filtered]);

  const toggleRead = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, unread: !i.unread } : i));
  const dismiss = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, unread: false })));

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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon d={ICONS.bell} size={16} color="rgba(255,255,255,0.8)" />
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>Hi {userName}</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Notifications<span style={{ color: "rgba(255,255,255,0.6)" }}>.</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6 }}>Everything about your care, kept up to date.</p>
              </div>

              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 14, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, cursor: unreadCount === 0 ? "default" : "pointer", opacity: unreadCount === 0 ? 0.5 : 1, flexShrink: 0, backdropFilter: "blur(8px)" }}
              >
                <Icon d={ICONS.checkDouble} size={15} color="white" />
                <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>Mark all as read</span>
              </button>
            </div>

            {/* Mini stat pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { label: "Unread", value: unreadCount, icon: ICONS.dot },
                { label: "Today", value: todayCount, icon: ICONS.calendar },
                { label: "Total", value: items.length, icon: ICONS.inbox },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon d={s.icon} size={14} color="rgba(255,255,255,0.85)" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{s.label}:</span>
                  <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── FILTER TABS ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-2 flex-wrap mb-6">
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 12,
                    border: active ? "1px solid transparent" : "1px solid #E2E8F0",
                    background: active ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "white",
                    color: active ? "white" : "#475569",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: active ? "0 6px 16px rgba(99,102,241,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </motion.div>

          {/* ── NOTIFICATION LIST ── */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "60px 30px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon d={ICONS.inbox} size={24} color="#6366F1" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>You're all caught up</h3>
              <p style={{ fontSize: 13, color: "#64748B" }}>Nothing here for this filter right now.</p>
            </motion.div>
          ) : (
            groupOrder.filter(g => grouped[g]?.length).map((g, gi) => (
              <motion.div key={g} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + gi * 0.05 }} style={{ marginBottom: 22 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 10, paddingLeft: 4 }}>
                  <span style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{g}</span>
                  <div style={{ flex: 1, height: 1, background: "#EEF2FF" }} />
                </div>
                <AnimatePresence initial={false}>
                  {grouped[g].map((item, i) => (
                    <NotificationRow key={item.id} item={item} index={i} onToggleRead={toggleRead} onDismiss={dismiss} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ))
          )}

        </div>
      </div>
    </>
  );
};

export default Notifications;