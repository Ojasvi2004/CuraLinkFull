import React, { useState, useMemo, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";

const API_BASE_URL = "http://localhost:8000";


const buildApi = (token) => ({
  getPrescriptions: async (patientId) => {
    const res = await fetch(`${API_BASE_URL}/api/prescription/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    return res.json();
  },
  uploadPrescription: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/api/prescription`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
  deletePrescription: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/prescription/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Delete failed");
    return res.json();
  },
});

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK = [
  {
    _id: "pres001",
    prescribedBy: { name: "Dr. Priya Reddy", specialization: "Dermatology", hospitalOrClinic: "Apollo Clinic" },
    prescriptionDate: "2024-07-20", uploadDate: "2024-07-21",
    diagnosis: "Allergic Dermatitis",
    medications: [
      { name: "Betamethasone Cream", dosage: "500mg", frequency: "Twice daily", duration: "7 days", instructions: "Apply thin layer" },
      { name: "Cetirizine", dosage: "10mg", frequency: "Once at night", duration: "5 days", instructions: "" },
    ],
    fileURL: null, fileType: "application/pdf", status: "active",
    category: "Specialist", tags: ["dermatology", "allergy"], isVerified: true,
  },
  {
    _id: "pres002",
    prescribedBy: { name: "Dr. Ananya Sharma", specialization: "Cardiology", hospitalOrClinic: "Max Hospital" },
    prescriptionDate: "2024-08-15", uploadDate: "2024-08-16",
    diagnosis: "Hypertension",
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days", instructions: "Morning with water" },
      { name: "Atorvastatin", dosage: "10mg", frequency: "Once at night", duration: "Ongoing", instructions: "" },
    ],
    fileURL: "https://via.placeholder.com/300x400?text=Rx.pdf",
    fileType: "application/pdf", status: "active",
    category: "Specialist", tags: ["cardiology", "bp"], isVerified: true,
  },
  {
    _id: "pres003",
    prescribedBy: { name: "Dr. Vikram Singh", specialization: "General Medicine", hospitalOrClinic: "City Health Centre" },
    prescriptionDate: "2024-05-02", uploadDate: "2024-05-03",
    diagnosis: "Viral Fever",
    medications: [{ name: "Paracetamol Syrup", dosage: "5ml", frequency: "Thrice daily", duration: "3 days", instructions: "After meals" }],
    fileURL: null, fileType: null, status: "completed",
    category: "General", tags: ["fever"], isVerified: false,
  },
];

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  pill: "M10.5 3.5a4 4 0 0 1 5.657 5.657l-7.07 7.07a4 4 0 0 1-5.658-5.656l7.07-7.07z M14 10l-4 4",
  eye: ["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  download: "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  close: "M18 6 6 18M6 6l12 12",
  clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  search: ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  verified: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "m9 12 2 2 4-4"],
};

const fmtDate = (d) =>
  d ? new Date(d + (d.includes("T") ? "" : "T00:00:00Z"))
    .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const CAT_COLOR = {
  General: { bg: "#EEF2FF", text: "#4338CA", dot: "#6366F1" },
  Specialist: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  Emergency: { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Follow-up": { bg: "#FDF4FF", text: "#7E22CE", dot: "#A855F7" },
  "Lab Report": { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  Other: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
};

const STAT_CFG = {
  active: { label: "Active", color: "#16A34A", bg: "#F0FDF4" },
  completed: { label: "Completed", color: "#2563EB", bg: "#EFF6FF" },
  expired: { label: "Expired", color: "#DC2626", bg: "#FEF2F2" },
  archived: { label: "Archived", color: "#6B7280", bg: "#F9FAFB" },
};

// ─── SHARED INPUT STYLE ────────────────────────────────────────────────────────
const iS = {
  width: "100%", background: "#F8FAFF", border: "1px solid #E2E8F0",
  borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#1E293B", outline: "none",
};

// ─── UPLOAD MODAL ──────────────────────────────────────────────────────────────
const UploadModal = ({ onClose, onSuccess, api }) => {
  const [form, setForm] = useState({
    prescribedByName: "", prescribedBySpec: "", prescribedByHospital: "",
    prescriptionDate: "", diagnosis: "", category: "General",
    patientNotes: "", tags: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please attach a prescription file.");
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prescribedBy", JSON.stringify({
        name: form.prescribedByName,
        specialization: form.prescribedBySpec,
        hospitalOrClinic: form.prescribedByHospital,
      }));
      fd.append("prescriptionDate", form.prescriptionDate);
      fd.append("uploadDate", new Date().toISOString());
      fd.append("diagnosis", form.diagnosis);
      fd.append("category", form.category);
      fd.append("patientNotes", form.patientNotes);
      fd.append("tags", JSON.stringify(form.tags.split(",").map(t => t.trim()).filter(Boolean)));
      const data = await api.uploadPrescription(fd);
      onSuccess(data.prescription || data);
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const Label = ({ children }) => (
    <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{children}</label>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{ background: "white", borderRadius: 22, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: 28 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#0F172A" }}>Upload Prescription</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Add a new record to your health vault</p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "#F1F5F9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS.close} size={15} color="#64748B" />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* File drop */}
            <label style={{ display: "block", cursor: "pointer", borderRadius: 16, border: `2px dashed ${file ? "#6366F1" : "#CBD5E1"}`, padding: "22px 16px", textAlign: "center", background: file ? "#F0F0FF" : "#F8FAFF" }}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setFile(e.target.files[0])} />
              <Icon d={ICONS.upload} size={26} color={file ? "#6366F1" : "#94A3B8"} style={{ margin: "0 auto 8px" }} />
              {file
                ? <p style={{ color: "#4F46E5", fontWeight: 700, fontSize: 13 }}>{file.name}</p>
                : <><p style={{ color: "#475569", fontWeight: 600, fontSize: 13 }}>Drop file or click to browse</p><p style={{ color: "#94A3B8", fontSize: 11, marginTop: 4 }}>PDF, JPG, PNG — up to 5MB</p></>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div style={{ gridColumn: "1/-1" }}><Label>Doctor Name *</Label><input required placeholder="Dr. Full Name" value={form.prescribedByName} onChange={set("prescribedByName")} style={iS} /></div>
              <div><Label>Specialization</Label><input placeholder="Cardiology" value={form.prescribedBySpec} onChange={set("prescribedBySpec")} style={iS} /></div>
              <div><Label>Hospital / Clinic</Label><input placeholder="Hospital name" value={form.prescribedByHospital} onChange={set("prescribedByHospital")} style={iS} /></div>
              <div><Label>Prescription Date *</Label><input required type="date" value={form.prescriptionDate} onChange={set("prescriptionDate")} style={iS} /></div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={set("category")} style={iS}>
                  {["General", "Specialist", "Emergency", "Follow-up", "Lab Report", "Other"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}><Label>Diagnosis</Label><input placeholder="e.g. Hypertension, Viral Fever" value={form.diagnosis} onChange={set("diagnosis")} style={iS} /></div>
              <div style={{ gridColumn: "1/-1" }}><Label>Tags (comma separated)</Label><input placeholder="cardiology, follow-up, bp" value={form.tags} onChange={set("tags")} style={iS} /></div>
              <div style={{ gridColumn: "1/-1" }}><Label>Your Notes</Label><textarea rows={2} placeholder="Any personal notes..." value={form.patientNotes} onChange={set("patientNotes")} style={{ ...iS, resize: "none" }} /></div>
            </div>

            {error && <p style={{ fontSize: 13, color: "#DC2626", background: "#FEF2F2", borderRadius: 10, padding: "8px 12px" }}>{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFF", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: loading ? "#A5B4FC" : "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading
                  ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Uploading…</>
                  : <><Icon d={ICONS.upload} size={15} color="white" /> Upload Record</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── DETAIL MODAL ──────────────────────────────────────────────────────────────
const DetailModal = ({ rx, onClose, onDelete }) => {
  const cat = CAT_COLOR[rx.category] || CAT_COLOR.Other;
  const stat = STAT_CFG[rx.status] || STAT_CFG.active;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{ background: "white", borderRadius: 22, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>

        {/* Gradient header */}
        <div style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: "22px 22px 0 0", padding: "24px 24px 20px" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>{rx.category}</span>
                {rx.isVerified && (
                  <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon d={ICONS.verified} size={11} color="white" /> Verified
                  </span>
                )}
              </div>
              <h2 style={{ color: "white", fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginTop: 6 }}>{rx.prescribedBy?.name}</h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{rx.prescribedBy?.specialization} · {rx.prescribedBy?.hospitalOrClinic}</p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICONS.close} size={15} color="white" />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
            {[["Prescribed", fmtDate(rx.prescriptionDate)], ["Uploaded", fmtDate(rx.uploadDate || rx.createdAt)]].map(([lbl, val], i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.2)" }} />}
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
                  <span style={{ opacity: 0.7 }}>{lbl}</span><br />
                  <strong style={{ fontSize: 13 }}>{val}</strong>
                </div>
              </React.Fragment>
            ))}
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ background: stat.bg, color: stat.color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{stat.label}</span>
          </div>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {rx.diagnosis && (
            <div style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px", borderLeft: "3px solid #6366F1" }}>
              <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Diagnosis</p>
              <p style={{ fontSize: 15, color: "#1E293B", fontWeight: 600, marginTop: 2 }}>{rx.diagnosis}</p>
            </div>
          )}

          {rx.medications?.length > 0 && (
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Medications ({rx.medications.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rx.medications.map((m, i) => (
                  <div key={i} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px", border: "1px solid #E8EEFF" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{m.name}</span>
                      {m.dosage && <span style={{ background: "#EEF2FF", color: "#4338CA", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6 }}>{m.dosage}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 6, marginLeft: 16 }}>
                      {m.frequency && <span style={{ fontSize: 12, color: "#64748B" }}>⏱ {m.frequency}</span>}
                      {m.duration && <span style={{ fontSize: 12, color: "#64748B" }}>📅 {m.duration}</span>}
                    </div>
                    {m.instructions && <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, marginLeft: 16, fontStyle: "italic" }}>{m.instructions}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {rx.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {rx.tags.map((t, i) => (
                <span key={i} style={{ background: "#F1F5F9", color: "#475569", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon d={ICONS.tag} size={11} color="#94A3B8" /> {t}
                </span>
              ))}
            </div>
          )}

          {rx.patientNotes && (
            <div style={{ background: "#FFFBEB", borderRadius: 12, padding: "12px 16px", border: "1px solid #FDE68A" }}>
              <p style={{ fontSize: 11, color: "#B45309", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>My Notes</p>
              <p style={{ fontSize: 13, color: "#78350F", marginTop: 2 }}>{rx.patientNotes}</p>
            </div>
          )}

          {rx.fileURL && (
            <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "12px 16px", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={ICONS.doc} size={18} color="#16A34A" />
                <span style={{ fontSize: 13, color: "#15803D", fontWeight: 600 }}>Prescription file attached</span>
              </div>
              <a href={rx.fileURL} target="_blank" rel="noopener noreferrer" download
                style={{ background: "#16A34A", color: "white", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                <Icon d={ICONS.download} size={13} color="white" /> Download
              </a>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "none", padding: "8px 14px", borderRadius: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon d={ICONS.trash} size={13} color="#DC2626" /> Delete Record
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>Confirm delete?</span>
                <button onClick={() => { onDelete(rx._id); onClose(); }} style={{ fontSize: 12, color: "white", background: "#DC2626", border: "none", padding: "6px 12px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Yes</button>
                <button onClick={() => setConfirmDelete(false)} style={{ fontSize: 12, color: "#64748B", background: "#F1F5F9", border: "none", padding: "6px 12px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>No</button>
              </div>
            )}
            <button onClick={onClose} style={{ fontSize: 13, color: "#64748B", background: "#F1F5F9", border: "none", padding: "10px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── CARD ──────────────────────────────────────────────────────────────────────
const RxCard = ({ rx, onView }) => {
  const cat = CAT_COLOR[rx.category] || CAT_COLOR.Other;
  const stat = STAT_CFG[rx.status] || STAT_CFG.active;
  return (
    <motion.div layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(99,102,241,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", cursor: "pointer" }}
      onClick={() => onView(rx)}>
      <div style={{ height: 4, background: `linear-gradient(90deg,${cat.dot},${cat.dot}88)` }} />
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ background: cat.bg, color: cat.text, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>{rx.category}</span>
              {rx.isVerified && <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3 }}><Icon d={ICONS.verified} size={10} color="#16A34A" /> Verified</span>}
              <span style={{ background: stat.bg, color: stat.color, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{stat.label}</span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{rx.prescribedBy?.name}</h3>
            <p style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, marginTop: 2 }}>{rx.prescribedBy?.specialization}</p>
            {rx.prescribedBy?.hospitalOrClinic && <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{rx.prescribedBy.hospitalOrClinic}</p>}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 11, color: "#94A3B8" }}>Prescribed</p>
            <p style={{ fontSize: 13, color: "#475569", fontWeight: 700, marginTop: 2 }}>{fmtDate(rx.prescriptionDate)}</p>
          </div>
        </div>

        {rx.diagnosis && (
          <div style={{ background: "#F8FAFF", borderRadius: 10, padding: "8px 12px", margin: "14px 0 10px", borderLeft: "3px solid #6366F1" }}>
            <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Diagnosis</p>
            <p style={{ fontSize: 13, color: "#1E293B", fontWeight: 600, marginTop: 1 }}>{rx.diagnosis}</p>
          </div>
        )}

        {rx.medications?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 6 }}>MEDICATIONS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {rx.medications.slice(0, 3).map((m, i) => (
                <span key={i} style={{ background: "#F1F5F9", color: "#334155", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 6 }}>{m.name}{m.dosage ? ` · ${m.dosage}` : ""}</span>
              ))}
              {rx.medications.length > 3 && <span style={{ background: "#EEF2FF", color: "#6366F1", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6 }}>+{rx.medications.length - 3} more</span>}
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {rx.tags?.slice(0, 3).map((t, i) => (
              <span key={i} style={{ fontSize: 10, color: "#94A3B8", background: "#F8FAFF", padding: "2px 8px", borderRadius: 20, border: "1px solid #E2E8F0" }}>#{t}</span>
            ))}
          </div>
          <button style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={ICONS.eye} size={12} color="white" /> View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function MyPrescriptionsPage() {
  const { token, user } = useContext(Authcontext);
  const api = useMemo(() => buildApi(token), [token]);

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [useMock, setUseMock] = useState(true); // ← set false when API ready

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (useMock) {
          await new Promise(r => setTimeout(r, 600));
          setPrescriptions(MOCK);
        } else {
          const patientId = user?._id || localStorage.getItem("userId");
          const data = await api.getPrescriptions(patientId);
          setPrescriptions(data.prescriptions || data);
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [useMock, token]);

  const uniqueDoctors = useMemo(() =>
    [...new Set(prescriptions.map(p => p.prescribedBy?.name).filter(Boolean))],
    [prescriptions]
  );

  const filtered = useMemo(() =>
    prescriptions
      .filter(p => !filterDoctor || p.prescribedBy?.name === filterDoctor)
      .filter(p => !filterCategory || p.category === filterCategory)
      .filter(p => !filterStatus || p.status === filterStatus)
      .filter(p => !search || [p.prescribedBy?.name, p.diagnosis, ...(p.tags || []), ...(p.medications?.map(m => m.name) || [])].some(s => s?.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => {
        const da = new Date(a.prescriptionDate), db = new Date(b.prescriptionDate);
        return sortBy === "desc" ? db - da : da - db;
      }),
    [prescriptions, filterDoctor, filterCategory, filterStatus, search, sortBy]
  );

  const handleDelete = async (id) => {
    setPrescriptions(p => p.filter(r => r._id !== id));
    if (!useMock) {
      try { await api.deletePrescription(id); }
      catch (e) { setError(e.message); }
    }
  };

  const handleUploadSuccess = (newRx) => setPrescriptions(p => [newRx, ...p]);

  const stats = useMemo(() => ({
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === "active").length,
    verified: prescriptions.filter(p => p.isVerified).length,
  }), [prescriptions]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ position: "fixed", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}>
                  <Icon d={ICONS.pill} size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Health Vault</p>
                  <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>My Prescriptions</h1>
                </div>
              </div>
              <p style={{ color: "#64748B", fontSize: 14, marginLeft: 2 }}>Securely manage all your medical records in one place</p>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setShowUpload(true)}
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 14, padding: "13px 24px", borderRadius: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(99,102,241,0.35)", whiteSpace: "nowrap" }}>
              <Icon d={ICONS.plus} size={18} color="white" /> Add Prescription
            </motion.button>
          </motion.div>

          {/* STATS */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Records", value: stats.total, icon: ICONS.doc, color: "#6366F1", bg: "#EEF2FF" },
              { label: "Active", value: stats.active, icon: ICONS.clock, color: "#16A34A", bg: "#F0FDF4" },
              { label: "Verified", value: stats.verified, icon: ICONS.verified, color: "#8B5CF6", bg: "#F5F3FF" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }}
                style={{ background: "white", borderRadius: 18, padding: "18px 20px", border: "1px solid #EEF2FF", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={s.icon} size={18} color={s.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontWeight: 600 }}>{s.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* FILTERS */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: 18, padding: "18px 22px", marginBottom: 24, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="flex flex-wrap gap-3 items-center">
              <div style={{ flex: "1 1 220px", position: "relative" }}>
                <Icon d={ICONS.search} size={15} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by doctor, medicine, diagnosis…"
                  style={{ width: "100%", background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 12px 10px 36px", fontSize: 13, color: "#1E293B", outline: "none" }} />
              </div>
              <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)} style={{ background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#475569", outline: "none" }}>
                <option value="">All Doctors</option>
                {uniqueDoctors.map(d => <option key={d}>{d}</option>)}
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#475569", outline: "none" }}>
                <option value="">All Categories</option>
                {["General", "Specialist", "Emergency", "Follow-up", "Lab Report", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#475569", outline: "none" }}>
                <option value="">All Status</option>
                {["active", "completed", "expired", "archived"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#475569", outline: "none" }}>
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              {(filterDoctor || filterCategory || filterStatus || search) && (
                <button onClick={() => { setFilterDoctor(""); setFilterCategory(""); setFilterStatus(""); setSearch(""); }}
                  style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "none", padding: "10px 14px", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
              )}
            </div>
          </motion.div>

          {/* LIST */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1", animation: "spin 0.9s linear infinite" }} />
              <p style={{ color: "#94A3B8", marginTop: 16, fontSize: 14 }}>Loading your health records…</p>
            </div>
          ) : error ? (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: 24, textAlign: "center" }}>
              <p style={{ color: "#DC2626", fontWeight: 600 }}>Error: {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon d={ICONS.doc} size={36} color="#C7D2FE" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>No prescriptions found</h3>
              <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 6 }}>{search || filterDoctor || filterCategory || filterStatus ? "Try adjusting your filters." : "Upload your first prescription to get started."}</p>
              {!search && !filterDoctor && !filterCategory && !filterStatus && (
                <button onClick={() => setShowUpload(true)} style={{ marginTop: 20, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 600, fontSize: 13, padding: "12px 22px", borderRadius: 12, border: "none", cursor: "pointer" }}>
                  + Add First Prescription
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {filtered.map(rx => <RxCard key={rx._id} rx={rx} onView={setSelected} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {selected && <DetailModal rx={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />}
          {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={handleUploadSuccess} api={api} />}
        </AnimatePresence>
      </div>
    </>
  );
}