import React, { useState, useMemo, useEffect, useContext, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

const server = import.meta.env.VITE_SERVER;

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  ink:      "#0C0A09",
  body:     "#57534E",
  muted:    "#A8A29E",
  line:     "#ECEAE6",
  surface:  "#F5F4F2",
  surface2: "#FAFAF9",
  white:    "#FFFFFF",
};

const EASE = [0.22, 1, 0.36, 1];

// Iridescent gradient orbs
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  folder:    "M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2z",
  upload:    "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0L8 8m4-4v12",
  search:    ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  eye:       ["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  download:  "M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  trash:     "M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  pencil:    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  tag:       "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  close:     "M18 6 6 18M6 6l12 12",
  lab:       ["M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"],
  imaging:   ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  vaccine:   ["M19 9l-7 7-7-7", "M12 3v13M5 20h14"],
  note:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6M16 13H8M16 17H8M10 9H8",
  discharge: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4",
  other:     "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4M12 16h.01",
  plus:      "M12 5v14M5 12h14",
  sparkle:   ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"],
  check:     ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

const TYPE_CONFIG = {
  "Lab Report":        { icon: ICONS.lab,       orb: ORBS.sky    },
  "Discharge Summary": { icon: ICONS.discharge, orb: ORBS.violet },
  "Vaccination":       { icon: ICONS.vaccine,   orb: ORBS.mint   },
  "Imaging":           { icon: ICONS.imaging,   orb: ORBS.sun    },
  "Doctor Note":       { icon: ICONS.note,      orb: ORBS.violet },
  "Other":             { icon: ICONS.other,     orb: ORBS.sky    },
};
const getTypeConfig = (t) => TYPE_CONFIG[t] || TYPE_CONFIG["Other"];

const RECORD_TYPES = ["All", ...Object.keys(TYPE_CONFIG)];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getISODate = (date) => date.toISOString().split("T")[0];

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE } },
};

const WordReveal = ({ text, as = "h1", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                paddingBottom: "0.14em",
                marginBottom: "-0.14em",
                marginRight: "0.24em",
              }}
            >
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>
                {w}
              </motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

const Pill = ({ children }) => (
  <motion.span
    variants={fadeUp}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      fontWeight: 500,
      color: T.muted,
      marginBottom: 14,
      letterSpacing: "-0.01em",
    }}
  >
    <motion.span
      animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-flex" }}
    >
      <Icon d={ICONS.sparkle} size={12} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

// ─── 3D TILT CARD ─────────────────────────────────────────────────────────────
const TiltCard = ({ children, style = {}, max = 3, className = "", ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      layout
      variants={fadeUp}
      className={`vault-card ${className}`}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, ...style }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
const Magnetic = ({ children, strength = 0.25 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

// ─── SCROLL PROGRESS ─────────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: T.ink,
        transformOrigin: "0% 50%",
        scaleX,
        zIndex: 100,
      }}
    />
  );
};

// ─── MODAL: UPLOAD RECORD ─────────────────────────────────────────────────────
const UploadModal = ({ onClose, onSubmit }) => {
  const [recordType, setRecordType] = useState("");
  const [file, setFile] = useState(null);

  const isImaging = recordType.toLowerCase().includes("imaging");

  const inputStyle = {
    width: "100%",
    background: T.surface2,
    border: `1px solid ${T.line}`,
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 13.5,
    color: T.ink,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s ease",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(12,10,9,0.45)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 15, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{
          background: T.white,
          borderRadius: 28,
          padding: "36px",
          width: "100%",
          maxWidth: 540,
          maxHeight: "90vh",
          overflowY: "auto",
          border: `1px solid ${T.line}`,
          boxShadow: "0 25px 60px rgba(12,10,9,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em" }}>
              Upload Health Record
            </h2>
            <p style={{ fontSize: 13.5, color: T.muted, marginTop: 4 }}>
              Add a verified diagnostic report or clinical note to your vault
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.surface,
              border: `1px solid ${T.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon d={ICONS.close} size={14} color={T.ink} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* File Drop Area */}
          <label
            style={{
              display: "block",
              cursor: "pointer",
              borderRadius: 18,
              border: `1.5px dashed ${file ? T.ink : T.line}`,
              padding: "28px 16px",
              textAlign: "center",
              background: file ? T.surface : T.surface2,
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="file"
              name="uploadFile"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Icon d={ICONS.upload} size={24} color={T.ink} style={{ margin: "0 auto 8px" }} />
            {file ? (
              <p style={{ color: T.ink, fontWeight: 500, fontSize: 13.5 }}>{file.name}</p>
            ) : (
              <>
                <p style={{ color: T.ink, fontWeight: 500, fontSize: 13.5 }}>
                  Drop document here or click to select
                </p>
                <p style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>
                  Encrypted storage · PDF, JPG, PNG (Max 10MB)
                </p>
              </>
            )}
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                Record Type *
              </label>
              <select
                name="uploadRecordType"
                required
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select clinical category…</option>
                {RECORD_TYPES.filter((t) => t !== "All").map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                Report Date *
              </label>
              <input
                type="date"
                name="uploadDate"
                defaultValue={getISODate(new Date())}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                Medical Facility / Source *
              </label>
              <input
                type="text"
                name="uploadSource"
                placeholder="e.g. City General Clinic"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="uploadTags"
                placeholder="blood panel, cardiology, baseline"
                style={inputStyle}
              />
            </div>

            {!isImaging && (
              <>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                    Clinical Notes
                  </label>
                  <textarea
                    name="uploadNotes"
                    rows={2}
                    placeholder="Doctor observations or context…"
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 11.5, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                    Metadata Summary
                  </label>
                  <input
                    type="text"
                    name="uploadSummary"
                    placeholder="Reference ID or key biomarkers"
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 999,
                border: `1px solid ${T.line}`,
                background: T.white,
                color: T.body,
                fontWeight: 500,
                fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 999,
                border: "none",
                background: T.ink,
                color: "white",
                fontWeight: 500,
                fontSize: 13.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon d={ICONS.upload} size={15} color="white" />
              Save to Vault
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── MODAL: DELETE CONFIRMATION ───────────────────────────────────────────────
const DeleteModal = ({ record, onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(12,10,9,0.45)", backdropFilter: "blur(12px)" }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.92, y: 15, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      style={{
        background: T.white,
        borderRadius: 24,
        padding: "32px",
        maxWidth: 380,
        width: "100%",
        border: `1px solid ${T.line}`,
        boxShadow: "0 25px 60px rgba(12,10,9,0.15)",
        textAlign: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#FEF2F2",
          border: "1px solid #FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Icon d={ICONS.trash} size={20} color="#DC2626" />
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em" }}>
        Delete Record?
      </h3>

      <p style={{ color: T.body, fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>
        <strong style={{ color: T.ink }}>{record?.fileName || record?.recordType}</strong> will be permanently expunged from your encrypted health repository.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: 999,
            border: `1px solid ${T.line}`,
            background: T.white,
            color: T.body,
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Keep
        </button>
        <button
          onClick={() => {
            onConfirm(record._id);
            onClose();
          }}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: 999,
            border: "none",
            background: "#DC2626",
            color: "white",
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── DOCUMENT RECORD CARD ─────────────────────────────────────────────────────
const RecordCard = ({ record, onDelete, onEdit }) => {
  const cfg = getTypeConfig(record.recordType);

  return (
    <TiltCard style={{ padding: "24px 26px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
        
        {/* Document Category Orb Icon */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: T.white,
            border: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(12,10,9,0.03)",
          }}
        >
          <Icon d={cfg.icon} size={20} color={T.ink} />
        </div>

        {/* Content details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    color: T.ink,
                    fontSize: 10.5,
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: 20,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {record.recordType}
                </span>
                <span style={{ fontSize: 12.5, color: T.muted }}>·</span>
                <span style={{ fontSize: 13, color: T.muted }}>{record.source}</span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                {record.fileName || record.recordType}
              </h3>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontSize: 12.5, color: T.body, fontVariantNumeric: "tabular-nums" }}>
                {fmtDate(record.date || record.createdAt)}
              </span>
            </div>
          </div>

          {/* Tags */}
          {record.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {record.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: T.white,
                    color: T.body,
                    fontSize: 11.5,
                    fontWeight: 400,
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: `1px solid ${T.line}`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icon d={ICONS.tag} size={10} color={T.muted} /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          {record.metadata && (
            <p style={{ fontSize: 13, color: T.muted, marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>
              {record.metadata}
            </p>
          )}

          {/* Actions Toolbar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${T.line}`,
            }}
          >
            {record.fileUrl && (
              <a
                href={record.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: T.ink,
                  color: "white",
                  fontSize: 12.5,
                  fontWeight: 500,
                  padding: "7px 16px",
                  borderRadius: 999,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "opacity 0.2s",
                }}
              >
                <Icon d={ICONS.eye} size={13} color="white" /> View Document
              </a>
            )}

            {record.fileUrl && (
              <a
                href={record.fileUrl}
                download
                style={{
                  background: T.white,
                  color: T.ink,
                  fontSize: 12.5,
                  fontWeight: 400,
                  padding: "7px 14px",
                  borderRadius: 999,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: `1px solid ${T.line}`,
                }}
              >
                <Icon d={ICONS.download} size={13} color={T.ink} /> Download
              </a>
            )}

            <button
              onClick={() => onEdit(record)}
              style={{
                background: T.white,
                color: T.body,
                fontSize: 12.5,
                fontWeight: 400,
                padding: "7px 14px",
                borderRadius: 999,
                border: `1px solid ${T.line}`,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon d={ICONS.pencil} size={13} color={T.muted} /> Edit
            </button>

            <button
              onClick={() => onDelete(record)}
              style={{
                background: "transparent",
                color: "#DC2626",
                fontSize: 12.5,
                fontWeight: 400,
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px dashed #FECACA",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginLeft: "auto",
              }}
            >
              <Icon d={ICONS.trash} size={13} color="#DC2626" /> Expunge
            </button>
          </div>
        </div>

      </div>
    </TiltCard>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const MyHealthRecordsPage = () => {
  const { token } = useContext(Authcontext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const reduce = useReducedMotion();

  const orbA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -180]);
  const orbB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 45, damping: 20 });
  const smy = useSpring(my, { stiffness: 45, damping: 20 });
  const mouseX = useTransform(smx, [-0.5, 0.5], [-35, 35]);
  const mouseY = useTransform(smy, [-0.5, 0.5], [-25, 25]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/api/user/getHealthRecordsForUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setRecords(res.data.records);
    } catch (e) {
      console.error("Error fetching health records", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/api/user/deleteUserRecord/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("recordType", e.target.uploadRecordType.value);
    fd.append("source", e.target.uploadSource.value);
    fd.append("fileName", e.target.uploadFile.files[0]?.name);
    fd.append("metadata", e.target.uploadSummary?.value || "");
    fd.append(
      "tags",
      JSON.stringify(
        (e.target.uploadTags.value || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
    fd.append("file", e.target.uploadFile.files[0]);

    try {
      const res = await axios.post(`${server}/api/user/uploadHealthRecord`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        fetchRecords();
        setShowUpload(false);
      }
    } catch (e) {
      console.error("Upload error", e);
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return records
      .filter((r) => filterType === "All" || r.recordType === filterType)
      .filter(
        (r) =>
          !q ||
          [r.recordType, r.source, r.fileName, ...(r.tags || [])].some((v) =>
            v?.toLowerCase().includes(q)
          )
      )
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }, [records, filterType, searchTerm]);

  // Statistics per document category
  const typeCounts = useMemo(() => {
    const counts = {};
    records.forEach((r) => {
      counts[r.recordType] = (counts[r.recordType] || 0) + 1;
    });
    return counts;
  }, [records]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .vault-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .vault-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 24px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .vault-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.92), rgba(255,255,255,0) 60%);
        }
        .vault-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .vault-card:hover::before {
          opacity: 1;
        }

        .filter-input {
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px 12px 38px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          width: 100%;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .filter-input:focus {
          border-color: ${T.ink};
        }

        .filter-select {
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .summary-cell {
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 18px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .summary-cell:hover {
          background: ${T.white};
          border-color: #D6D3D1;
          transform: translateY(-2px);
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="vault-root"
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
      >
        {/* Ambient Iridescent Background Orbs */}
        <motion.div
          style={{
            position: "fixed",
            top: -120,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.3,
            filter: "blur(70px)",
            pointerEvents: "none",
            y: orbA,
            x: mouseX,
          }}
        />
        <motion.div
          style={{
            position: "fixed",
            bottom: -100,
            left: -80,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.25,
            filter: "blur(65px)",
            pointerEvents: "none",
            y: orbB,
            x: mouseY,
          }}
        />

        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL HEADER ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 44,
            }}
          >
            <div>
              <Pill>Encrypted Health Vault</Pill>
              <WordReveal
                as="h1"
                text={"My Health Records"}
                style={{
                  fontSize: "clamp(32px, 4.8vw, 54px)",
                  fontWeight: 300,
                  color: T.ink,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              />
              <motion.p variants={fadeUp} style={{ fontSize: 15, color: T.body, maxWidth: 500 }}>
                Securely store, organize, and inspect your complete medical history and clinical lab documentation.
              </motion.p>
            </div>

            <motion.div variants={fadeUp}>
              <Magnetic strength={0.28}>
                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  style={{
                    background: T.ink,
                    color: "white",
                    fontWeight: 500,
                    fontSize: 14,
                    padding: "13px 26px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 10px 28px rgba(12,10,9,0.18)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Icon d={ICONS.plus} size={15} color="white" /> Upload Document
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* ──────────────── 2. SUMMARY METRIC CELLS ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 28 }}
          >
            {[
              { label: "All Documents", value: records.length, key: "All" },
              ...Object.entries(TYPE_CONFIG).slice(0, 5).map(([t]) => ({
                label: t.replace(" Summary", "").replace(" Note", ""),
                value: typeCounts[t] || 0,
                key: t,
              })),
            ].map((s, i) => (
              <div
                key={i}
                className="summary-cell"
                onClick={() => setFilterType(s.key)}
                style={{
                  background: filterType === s.key ? T.white : T.surface,
                  borderColor: filterType === s.key ? T.ink : T.line,
                }}
              >
                <p style={{ fontSize: 24, fontWeight: 300, color: T.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 11.5, color: T.muted, marginTop: 6, fontWeight: 400, letterSpacing: "-0.01em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ──────────────── 3. SEARCH & FILTERS BAR ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: T.surface,
              borderRadius: 24,
              padding: "20px 22px",
              marginBottom: 28,
              border: `1px solid ${T.line}`,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              {/* Search input */}
              <div style={{ flex: "1 1 240px", position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon d={ICONS.search} size={15} color={T.muted} />
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by facility, diagnostic category, or filename…"
                  className="filter-input"
                />
              </div>

              {/* Type Dropdown */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              {/* Results count & reset */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
                {(filterType !== "All" || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterType("All");
                      setSearchTerm("");
                    }}
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      background: "transparent",
                      border: `1px dashed ${T.line}`,
                      padding: "6px 14px",
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                )}
                <span style={{ fontSize: 12.5, color: T.muted }}>
                  {filtered.length} of {records.length} files
                </span>
              </div>
            </div>

            {/* Quick Type Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
              {RECORD_TYPES.map((t) => {
                const active = filterType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1px solid ${active ? T.ink : T.line}`,
                      background: active ? T.ink : T.white,
                      color: active ? "white" : T.body,
                      fontSize: 12,
                      fontWeight: active ? 500 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ──────────────── 4. RECORDS ARCHIVE LIST ──────────────── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "100px 0" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `2px solid ${T.line}`,
                  borderTop: `2px solid ${T.ink}`,
                }}
              />
              <p style={{ color: T.muted, marginTop: 18, fontSize: 13.5 }}>
                Decrypting repository records…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center",
                padding: "90px 24px",
                background: T.surface,
                borderRadius: 28,
                border: `1px solid ${T.line}`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Icon d={ICONS.folder} size={24} color={T.ink} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>
                No records located
              </h3>
              <p style={{ color: T.muted, fontSize: 14, maxWidth: 360, margin: "0 auto 20px" }}>
                {searchTerm || filterType !== "All"
                  ? "Adjust search queries or active category filters."
                  : "Begin your personal vault by uploading your first medical report."}
              </p>
              {!searchTerm && filterType === "All" && (
                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  style={{
                    background: T.ink,
                    color: "white",
                    padding: "11px 24px",
                    borderRadius: 999,
                    border: "none",
                    fontSize: 13.5,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  + Upload First Document
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div layout style={{ display: "flex", flexDirection: "column" }}>
              <AnimatePresence>
                {filtered.map((record) => (
                  <RecordCard
                    key={record._id}
                    record={record}
                    onDelete={setDeleteTarget}
                    onEdit={() => alert(`Edit metadata for ${record.fileName}`)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>

        {/* ── MODALS ── */}
        <AnimatePresence>
          {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSubmit={handleUpload} />}
          {deleteTarget && (
            <DeleteModal
              record={deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MyHealthRecordsPage;