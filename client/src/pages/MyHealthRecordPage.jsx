import { useState, useMemo, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  folder:   "M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2z",
  upload:   "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0L8 8m4-4v12",
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  eye:      ["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  download: "M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  trash:    "M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  pencil:   "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  close:    "M18 6 6 18M6 6l12 12",
  doc:      "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  lab:      ["M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"],
  imaging:  ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  vaccine:  ["M19 9l-7 7-7-7", "M12 3v13M5 20h14"],
  note:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6M16 13H8M16 17H8M10 9H8",
  discharge:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4",
  other:    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4M12 16h.01",
  filter:   "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L16 11.414V17l-4 4v-8.586L3.293 6.707A1 1 0 0 1 3 6V4z",
  plus:     "M12 5v14M5 12h14",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

// ─── RECORD TYPE CONFIG ─────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "Lab Report":       { icon: ICONS.lab,       color: "#2563EB", bg: "#EFF6FF",  dot: "#3B82F6",  gradient: "linear-gradient(135deg,#3B82F6,#60A5FA)" },
  "Discharge Summary":{ icon: ICONS.discharge,  color: "#7C3AED", bg: "#F5F3FF",  dot: "#8B5CF6",  gradient: "linear-gradient(135deg,#8B5CF6,#A78BFA)" },
  "Vaccination":      { icon: ICONS.vaccine,    color: "#059669", bg: "#ECFDF5",  dot: "#10B981",  gradient: "linear-gradient(135deg,#10B981,#34D399)" },
  "Imaging":          { icon: ICONS.imaging,    color: "#D97706", bg: "#FFFBEB",  dot: "#F59E0B",  gradient: "linear-gradient(135deg,#F59E0B,#FCD34D)" },
  "Doctor Note":      { icon: ICONS.note,       color: "#DB2777", bg: "#FDF2F8",  dot: "#EC4899",  gradient: "linear-gradient(135deg,#EC4899,#F9A8D4)" },
  "Other":            { icon: ICONS.other,      color: "#475569", bg: "#F1F5F9",  dot: "#94A3B8",  gradient: "linear-gradient(135deg,#94A3B8,#CBD5E1)" },
};
const getTypeConfig = (t) => TYPE_CONFIG[t] || TYPE_CONFIG["Other"];

const RECORD_TYPES = ["All", ...Object.keys(TYPE_CONFIG)];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getISODate = (date) => date.toISOString().split("T")[0];

// ─── UPLOAD MODAL ──────────────────────────────────────────────────────────────
const UploadModal = ({ onClose, onSubmit }) => {
  const [recordType, setRecordType] = useState("");
  const [file, setFile] = useState(null);

  const isImaging = recordType.toLowerCase().includes("imaging");
  const inputCls = { width: "100%", background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#1E293B", outline: "none" };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{ background: "white", borderRadius: 22, padding: "32px", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#0F172A" }}>Upload Health Record</h2>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Add a new document to your health vault</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "#F1F5F9", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon d={ICONS.close} size={15} color="#64748B" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* File drop */}
          <label style={{ display: "block", cursor: "pointer", borderRadius: 16, border: `2px dashed ${file ? "#6366F1" : "#CBD5E1"}`, padding: "24px 16px", textAlign: "center", background: file ? "#F0F0FF" : "#F8FAFF", transition: "all 0.2s" }}>
            <input type="file" name="uploadFile" accept=".pdf,.jpg,.jpeg,.png" required className="hidden" onChange={e => setFile(e.target.files[0])} />
            <Icon d={ICONS.upload} size={26} color={file ? "#6366F1" : "#94A3B8"} style={{ margin: "0 auto 8px" }} />
            {file ? <p style={{ color: "#4F46E5", fontWeight: 700, fontSize: 13 }}>{file.name}</p> : <>
              <p style={{ color: "#475569", fontWeight: 600, fontSize: 13 }}>Drop your file here or click to browse</p>
              <p style={{ color: "#94A3B8", fontSize: 11, marginTop: 4 }}>PDF, JPG, PNG — up to 10MB</p>
            </>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Record Type *</label>
              <select name="uploadRecordType" required value={recordType} onChange={e => setRecordType(e.target.value)} style={{ ...inputCls }}>
                <option value="">Select type…</option>
                {RECORD_TYPES.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Date *</label>
              <input type="date" name="uploadDate" defaultValue={getISODate(new Date())} required style={inputCls} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Source / Facility *</label>
              <input type="text" name="uploadSource" placeholder="e.g. Apollo Hospital" required style={inputCls} />
            </div>
            <div className="col-span-2">
              <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Tags (comma-separated)</label>
              <input type="text" name="uploadTags" placeholder="blood test, annual checkup, cardiology" style={inputCls} />
            </div>
            {!isImaging && <>
              <div className="col-span-2">
                <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Notes</label>
                <textarea name="uploadNotes" rows={2} placeholder="Optional notes…" style={{ ...inputCls, resize: "none" }} />
              </div>
              <div className="col-span-2">
                <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Metadata Summary</label>
                <input type="text" name="uploadSummary" placeholder="Optional metadata" style={inputCls} />
              </div>
            </>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFF", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon d={ICONS.upload} size={15} color="white" /> Upload Record
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── DELETE CONFIRM MODAL ──────────────────────────────────────────────────────
const DeleteModal = ({ record, onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 380, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon d={ICONS.trash} size={24} color="#DC2626" />
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#0F172A", textAlign: "center" }}>Delete Record?</h3>
      <p style={{ color: "#64748B", fontSize: 13, textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
        <strong style={{ color: "#1E293B" }}>{record?.fileName || record?.recordType}</strong> will be permanently removed from your vault.
      </p>
      <div className="flex gap-3 mt-6">
        <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFF", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Keep It</button>
        <button onClick={() => { onConfirm(record._id); onClose(); }} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#DC2626,#EF4444)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Delete</button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── RECORD CARD ───────────────────────────────────────────────────────────────
const RecordCard = ({ record, onDelete, onEdit }) => {
  const cfg = getTypeConfig(record.recordType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(99,102,241,0.11)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}
    >
      {/* Color top bar */}
      <div style={{ height: 4, background: cfg.gradient }} />

      <div style={{ padding: "20px 22px" }}>
        <div className="flex items-start gap-4">
          {/* Icon bubble */}
          <div style={{ width: 48, height: 48, borderRadius: 14, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={cfg.icon} size={22} color={cfg.color} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span style={{ background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>{record.recordType}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0F172A", lineHeight: 1.25 }}>{record.fileName || record.recordType}</h3>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                  <span style={{ color: "#94A3B8" }}>Source:</span> {record.source}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 11, color: "#94A3B8" }}>Date</p>
                <p style={{ fontSize: 13, color: "#475569", fontWeight: 700, marginTop: 1 }}>{fmtDate(record.date || record.createdAt)}</p>
              </div>
            </div>

            {/* Tags */}
            {record.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {record.tags.map((tag, i) => (
                  <span key={i} style={{ background: "#F1F5F9", color: "#475569", fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon d={ICONS.tag} size={10} color="#94A3B8" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata */}
            {record.metadata && (
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>{record.metadata}</p>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          {record.fileUrl && (
            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(99,102,241,0.28)" }}>
              <Icon d={ICONS.eye} size={13} color="white" /> View File
            </a>
          )}
          {record.fileUrl && (
            <a href={record.fileUrl} download
              style={{ background: "#F8FAFF", color: "#475569", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, border: "1px solid #E2E8F0" }}>
              <Icon d={ICONS.download} size={13} color="#64748B" /> Download
            </a>
          )}
          <button onClick={() => onEdit(record)}
            style={{ background: "#F8FAFF", color: "#475569", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 10, border: "1px solid #E2E8F0", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={ICONS.pencil} size={13} color="#64748B" /> Edit
          </button>
          <button onClick={() => onDelete(record)}
            style={{ background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 10, border: "1px solid #FECACA", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <Icon d={ICONS.trash} size={13} color="#DC2626" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
const MyHealthRecordsPage = () => {
  const { token } = useContext(Authcontext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/user/getHealthRecordsForUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setRecords(res.data.records);
    } catch (e) {
      console.error("Error fetching health records", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/user/deleteUserRecord/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setRecords(prev => prev.filter(r => r._id !== id));
    } catch (e) { console.error("Delete error", e); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("recordType", e.target.uploadRecordType.value);
    fd.append("source", e.target.uploadSource.value);
    fd.append("fileName", e.target.uploadFile.files[0]?.name);
    fd.append("metadata", e.target.uploadSummary?.value || "");
    fd.append("tags", JSON.stringify(
      (e.target.uploadTags.value || "").split(",").map(t => t.trim()).filter(Boolean)
    ));
    fd.append("file", e.target.uploadFile.files[0]);
    try {
      const res = await axios.post("http://localhost:8000/api/user/uploadHealthRecord", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) { fetchRecords(); setShowUpload(false); }
    } catch (e) { console.error("Upload error", e); }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return records
      .filter(r => filterType === "All" || r.recordType === filterType)
      .filter(r => !q || [r.recordType, r.source, r.fileName, ...(r.tags || [])].some(v => v?.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }, [records, filterType, searchTerm]);

  // Stats per type
  const typeCounts = useMemo(() => {
    const counts = {};
    records.forEach(r => { counts[r.recordType] = (counts[r.recordType] || 0) + 1; });
    return counts;
  }, [records]);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Blobs */}
        <div style={{ position: "fixed", top: -80, right: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

          {/* ── HEADER ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}>
                  <Icon d={ICONS.folder} size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Health Vault</p>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>My Health Records</h1>
                </div>
              </div>
              <p style={{ color: "#64748B", fontSize: 14, marginLeft: 2 }}>Securely store and access all your medical documents</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowUpload(true)}
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 14, padding: "13px 24px", borderRadius: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(99,102,241,0.35)", whiteSpace: "nowrap" }}>
              <Icon d={ICONS.plus} size={18} color="white" /> Upload Record
            </motion.button>
          </motion.div>

          {/* ── STATS ROW ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {[
              { label: "Total", value: records.length, color: "#6366F1", bg: "#EEF2FF" },
              ...Object.entries(TYPE_CONFIG).slice(0, 5).map(([t, c]) => ({ label: t.replace(" Summary", "").replace(" Note", ""), value: typeCounts[t] || 0, color: c.color, bg: c.bg }))
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -2 }}
                onClick={() => i > 0 && setFilterType(Object.keys(TYPE_CONFIG)[i - 1])}
                style={{ background: "white", borderRadius: 14, padding: "14px 16px", border: "1px solid #EEF2FF", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: i > 0 ? "pointer" : "default", transition: "all 0.2s" }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── FILTERS ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: 18, padding: "16px 20px", marginBottom: 24, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div style={{ flex: "1 1 220px", position: "relative" }}>
                <Icon d={ICONS.search} size={15} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by type, source, filename, tag…"
                  style={{ width: "100%", background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 12px 10px 36px", fontSize: 13, color: "#1E293B", outline: "none" }} />
              </div>
              {/* Type filter */}
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                style={{ background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#475569", outline: "none" }}>
                {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              {/* Count */}
              <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, marginLeft: "auto" }}>
                {filtered.length} of {records.length} records
              </span>
              {(filterType !== "All" || searchTerm) && (
                <button onClick={() => { setFilterType("All"); setSearchTerm(""); }}
                  style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "none", padding: "8px 14px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Clear</button>
              )}
            </div>

            {/* Type pill tabs */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
              {RECORD_TYPES.map(t => {
                const cfg = t === "All" ? { color: "#6366F1", bg: "#EEF2FF", dot: "#6366F1" } : getTypeConfig(t);
                const active = filterType === t;
                return (
                  <button key={t} onClick={() => setFilterType(t)}
                    style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? cfg.color : "#E2E8F0"}`, background: active ? cfg.bg : "transparent", color: active ? cfg.color : "#64748B", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── LIST ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #EEF2FF", borderTop: "3px solid #6366F1", animation: "spin 0.9s linear infinite" }} />
              <p style={{ color: "#94A3B8", marginTop: 16, fontSize: 14 }}>Loading your health records…</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon d={ICONS.folder} size={36} color="#C7D2FE" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>No records found</h3>
              <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 6 }}>
                {searchTerm || filterType !== "All" ? "Try adjusting your filters." : "Upload your first document to get started."}
              </p>
              {!searchTerm && filterType === "All" && (
                <button onClick={() => setShowUpload(true)}
                  style={{ marginTop: 20, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 600, fontSize: 13, padding: "12px 22px", borderRadius: 12, border: "none", cursor: "pointer" }}>
                  + Upload First Record
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence>
                {filtered.map(record => (
                  <RecordCard key={record._id} record={record} onDelete={setDeleteTarget} onEdit={() => alert(`Edit UI for ${record.fileName} — wire to your PUT endpoint`)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* ── MODALS ── */}
        <AnimatePresence>
          {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSubmit={handleUpload} />}
          {deleteTarget && <DeleteModal record={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MyHealthRecordsPage;