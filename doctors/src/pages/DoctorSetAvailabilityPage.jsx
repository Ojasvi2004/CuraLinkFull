import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ─── ICONS ──────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chevronL: "M15 18l-6-6 6-6",
  chevronR: "m9 18 6-6-6-6",
  plus: ["M12 5v14", "M5 12h14"],
  trash: ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
  video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 0 0-5V5z"],
  building: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  x: ["M18 6 6 18", "m6 6 12 12"],
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  check: ["M20 6 9 17l-5-5"],
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getISODate = (d) => d.toISOString().split("T")[0];

const formatDisplayDate = (dateStr) =>
  new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

const formatShortDate = (dateStr) =>
  new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-IN", { month: "long", day: "numeric" });

// ─── SLOT CARD ────────────────────────────────────────────────────────────────
const SlotCard = ({ slot, onDelete }) => {
  const isDigital = slot.type === "DIGITAL";
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.92, transition: { duration: 0.18 } }}
      whileHover={{ y: -3, boxShadow: slot.isBooked ? "0 6px 18px rgba(239,68,68,0.12)" : isDigital ? "0 6px 18px rgba(14,165,233,0.18)" : "0 6px 18px rgba(16,185,129,0.18)" }}
      style={{ borderRadius: 14, border: `1.5px solid ${slot.isBooked ? "#FCA5A5" : isDigital ? "#BAE6FD" : "#86EFAC"}`, background: slot.isBooked ? "#FEF2F2" : isDigital ? "#F0F9FF" : "#F0FDF4", padding: "12px 14px", position: "relative", cursor: "default", transition: "box-shadow 0.2s" }}>

      {/* Top accent */}
      <div style={{ height: 3, borderRadius: 4, background: slot.isBooked ? "linear-gradient(90deg,#EF4444,#F87171)" : isDigital ? "linear-gradient(90deg,#0EA5E9,#38BDF8)" : "linear-gradient(90deg,#10B981,#34D399)", marginBottom: 10 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 6 }}>
        <Icon d={isDigital ? ICONS.video : ICONS.building} size={13} color={slot.isBooked ? "#DC2626" : isDigital ? "#0284C7" : "#059669"} />
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: slot.isBooked ? "#DC2626" : isDigital ? "#0284C7" : "#059669" }}>
          {slot.isBooked ? "Booked" : slot.type}
        </span>
      </div>

      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: slot.isBooked ? "#991B1B" : "#0F172A", textAlign: "center", lineHeight: 1.3 }}>
        {slot.Time.Start}
      </p>
      <p style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", marginTop: 2 }}>
        → {slot.Time.End}
      </p>

      {slot.isBooked && slot.patientName && (
        <p style={{ fontSize: 10, color: "#DC2626", textAlign: "center", marginTop: 4, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {slot.patientName}
        </p>
      )}

      {/* Delete button — only for unbooked */}
      {!slot.isBooked && (
        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(slot.id)}
          title="Delete Slot"
          style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "white", border: "1.5px solid #FCA5A5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <Icon d={ICONS.trash} size={10} color="#DC2626" />
        </motion.button>
      )}
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DoctorSetAvailabilityPage = () => {
  const { token } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newBlock, setNewBlock] = useState({
    startTime: "09:00", endTime: "12:00", slotDuration: "15", type: "PHYSICAL", clinicId: "thisClinicId",
  });

  const handleBlockChange = (e) => setNewBlock(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDateOffset = (offset) => {
    const d = new Date(selectedDate + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + offset);
    setSelectedDate(getISODate(d));
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/doctors/GetSlotsOfADate",
        { date: selectedDate }, { headers: { authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setSlots(res.data.AllSlotOfADay.map(slot => ({
          id: slot._id,
          Time: { Start: slot.Time?.Start || "", End: slot.Time?.End || "" },
          type: slot.type, clinicId: slot.clinicId, isBooked: slot.isBooked, patientName: slot.patientName,
        })).sort((a, b) => a.Time.Start.localeCompare(b.Time.Start)));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchSlots(); }, [selectedDate]);

  const handleAddBlock = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post("http://localhost:8000/api/doctors/createSlots",
        { date: selectedDate, ...newBlock }, { headers: { authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setShowModal(false);
        await fetchSlots();
      } else {
        alert(res.data.message || "Could not create slots.");
      }
    } catch (e) { console.error(e); alert("Slot creation failed."); }
    setSubmitting(false);
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    try {
      const res = await axios.post("http://localhost:8000/api/doctors/deleteSingleSlot", { id });
      if (res.data.success) await fetchSlots();
    } catch (e) { console.error(e); }
  };

  const digitalSlots = slots.filter(s => s.type === "DIGITAL");
  const physicalSlots = slots.filter(s => s.type === "PHYSICAL");
  const bookedCount = slots.filter(s => s.isBooked).length;

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1.5px solid #EEF2FF", borderRadius: 12,
    fontSize: 13, fontWeight: 600, color: "#1E293B", background: "#F8FAFF", outline: "none",
    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.15s",
  };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; } input:focus, select:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(30,58,95,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2D4E8A 55%,#3B5CB8 100%)", borderRadius: 24, padding: "32px 40px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(30,58,95,0.4)" }}>

            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Icon d={ICONS.sparkle} size={14} color="rgba(255,255,255,0.7)" />
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Schedule Management</p>
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1.15 }}>
                  Set <span style={{ color: "rgba(255,255,255,0.45)" }}>Availability</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}>Define consultation slots for in-person and digital appointments.</p>
              </div>

              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 9, background: "linear-gradient(135deg,#10B981,#34D399)", border: "none", borderRadius: 14, padding: "12px 22px", cursor: "pointer", color: "white", fontWeight: 700, fontSize: 13, boxShadow: "0 6px 18px rgba(16,185,129,0.35)" }}>
                <Icon d={ICONS.plus} size={16} color="white" />
                Add Availability Block
              </motion.button>
            </div>

            {/* Summary pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
              {[
                { label: "Total Slots", value: slots.length },
                { label: "Physical", value: physicalSlots.length },
                { label: "Digital", value: digitalSlots.length },
                { label: "Booked", value: bookedCount },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "7px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{s.label}:</span>
                  <span style={{ fontSize: 14, color: "white", fontWeight: 800 }}>{loading ? "—" : s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── DATE NAVIGATOR ────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 28px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>

            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDateOffset(-1)}
              style={{ width: 40, height: 40, borderRadius: 12, border: "1.5px solid #EEF2FF", background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={ICONS.chevronL} size={18} color="#6366F1" />
            </motion.button>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>{formatDisplayDate(selectedDate)}</p>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                style={{ marginTop: 4, border: "none", outline: "none", fontSize: 12, color: "#94A3B8", background: "transparent", textAlign: "center", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }} />
            </div>

            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDateOffset(1)}
              style={{ width: 40, height: 40, borderRadius: 12, border: "1.5px solid #EEF2FF", background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={ICONS.chevronR} size={18} color="#6366F1" />
            </motion.button>
          </motion.div>

          {/* ── SLOTS DISPLAY ─────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>

            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.calendar} size={17} color="#6366F1" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Slots for {formatShortDate(selectedDate)}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{loading ? "Loading..." : `${slots.length} slot${slots.length !== 1 ? "s" : ""} configured`}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "24px 28px" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1" }} />
                </div>
              ) : slots.length > 0 ? (
                <>
                  {physicalSlots.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <Icon d={ICONS.building} size={15} color="#059669" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em" }}>In-Person — {physicalSlots.length} slots</span>
                      </div>
                      <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }} layout>
                        <AnimatePresence>
                          {physicalSlots.map(slot => <SlotCard key={slot.id} slot={slot} onDelete={handleDeleteSlot} />)}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  )}

                  {digitalSlots.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <Icon d={ICONS.video} size={15} color="#0284C7" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0284C7", textTransform: "uppercase", letterSpacing: "0.06em" }}>Digital — {digitalSlots.length} slots</span>
                      </div>
                      <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }} layout>
                        <AnimatePresence>
                          {digitalSlots.map(slot => <SlotCard key={slot.id} slot={slot} onDelete={handleDeleteSlot} />)}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Icon d={ICONS.calendar} size={28} color="#6366F1" />
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>No slots set</p>
                  <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 20 }}>Add an availability block to create consultation slots for this date.</p>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", border: "none", borderRadius: 14, padding: "12px 22px", cursor: "pointer", fontWeight: 700, fontSize: 13, boxShadow: "0 6px 18px rgba(99,102,241,0.3)" }}>
                    <Icon d={ICONS.plus} size={15} color="white" /> Add Availability Block
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── ADD BLOCK MODAL ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setShowModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}>

            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 480, boxShadow: "0 30px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}>

              {/* Modal header */}
              <div style={{ background: "linear-gradient(135deg,#1E3A5F,#2D4E8A)", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>New Block</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "white" }}>Add Availability</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowModal(false)}
                  style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.x} size={16} color="white" />
                </motion.button>
              </div>

              <form onSubmit={handleAddBlock} style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Date (read-only) */}
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="text" value={formatDisplayDate(selectedDate)} readOnly
                    style={{ ...inputStyle, background: "#F1F5F9", color: "#64748B", cursor: "not-allowed" }} />
                </div>

                {/* Time range */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Start Time</label>
                    <input type="time" name="startTime" value={newBlock.startTime} onChange={handleBlockChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>End Time</label>
                    <input type="time" name="endTime" value={newBlock.endTime} onChange={handleBlockChange} required style={inputStyle} />
                  </div>
                </div>

                {/* Slot duration */}
                <div>
                  <label style={labelStyle}>Slot Duration (minutes)</label>
                  <select name="slotDuration" value={newBlock.slotDuration} onChange={handleBlockChange} required style={inputStyle}>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label style={labelStyle}>Consultation Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { value: "PHYSICAL", label: "In-Person", icon: ICONS.building, color: "#059669", bg: "#ECFDF5", border: "#86EFAC" },
                      { value: "DIGITAL", label: "Digital", icon: ICONS.video, color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD" },
                    ].map(opt => (
                      <motion.label key={opt.value} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `2px solid ${newBlock.type === opt.value ? opt.border : "#EEF2FF"}`, background: newBlock.type === opt.value ? opt.bg : "#F8FAFF", cursor: "pointer", transition: "all 0.15s" }}>
                        <input type="radio" name="type" value={opt.value} checked={newBlock.type === opt.value} onChange={handleBlockChange} style={{ display: "none" }} />
                        <Icon d={opt.icon} size={16} color={newBlock.type === opt.value ? opt.color : "#94A3B8"} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: newBlock.type === opt.value ? opt.color : "#64748B" }}>{opt.label}</span>
                        {newBlock.type === opt.value && <Icon d={ICONS.check} size={14} color={opt.color} style={{ marginLeft: "auto" }} />}
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #EEF2FF", background: "#F8FAFF", color: "#64748B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Cancel
                  </motion.button>
                  <motion.button type="submit" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} disabled={submitting}
                    style={{ flex: 2, padding: "12px 0", borderRadius: 12, background: submitting ? "#C7D2FE" : "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 6px 18px rgba(99,102,241,0.3)" }}>
                    {submitting ? "Creating slots..." : "✦ Create Slots"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DoctorSetAvailabilityPage;