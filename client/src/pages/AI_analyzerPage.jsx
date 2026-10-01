import React, { useState, useEffect, useContext, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

const Dr_bot_api_url = import.meta.env.VITE_DR_BOT_ORIGIN;
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
  send:    ["M22 2L11 13", "M22 2L15 22 11 13 2 9 22 2"],
  trash:   ["M3 6h18", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M10 11v6M14 11v6", "M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1z"],
  close:   "M18 6 6 18M6 6l12 12",
  records: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6M9 17h4"],
  check:   "m9 11 3 3L22 4",
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  user:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  arrow:   "M17 8l4 4m0 0l-4 4m4-4H3",
};

// ─── AVATAR PRIMITIVES ───────────────────────────────────────────────────────
const BotAvatar = ({ size = 34 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: ORBS.violet,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 18px rgba(12,10,9,0.12)",
      flexShrink: 0,
      border: `1.5px solid ${T.white}`,
    }}
  >
    <Icon d={ICONS.sparkle} size={size * 0.48} color="white" />
  </div>
);

const UserAvatar = ({ size = 34 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: T.ink,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon d={ICONS.user} size={size * 0.46} color="white" />
  </div>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const toStr = (v) => (!v ? null : typeof v === "string" ? v : JSON.stringify(v, null, 2));

const extractReplyText = (data) => {
  const payload = data?.result ?? data;
  if (typeof payload === "string") return payload;
  const blocks = payload?.raw_output ?? payload?.raw_ouput;
  if (Array.isArray(blocks)) {
    const text = blocks
      .filter((b) => b?.type === "text")
      .map((b) => b.text)
      .join("\n\n");
    if (text) return text;
  }
  return JSON.stringify(payload, null, 2);
};

// ─── RICH TEXT MARKDOWN RENDERER ─────────────────────────────────────────────
const RichText = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {lines.map((line, i) => {
        if (/^###\s/.test(line))
          return (
            <p
              key={i}
              style={{
                fontWeight: 500,
                color: T.ink,
                fontSize: 14.5,
                marginTop: 10,
                marginBottom: 2,
                letterSpacing: "-0.01em",
              }}
            >
              {line.replace(/^###\s/, "")}
            </p>
          );
        if (/^\*\*(.+)\*\*$/.test(line.trim()))
          return (
            <p key={i} style={{ fontWeight: 500, color: T.ink, fontSize: 13.5 }}>
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (/^[\*\-]\s/.test(line))
          return (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: T.body }}>
              <span style={{ color: T.ink, flexShrink: 0, marginTop: 1 }}>•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/^[\*\-]\s/, "")
                    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${T.ink}; font-weight:500;">$1</strong>`),
                }}
              />
            </div>
          );
        if (/^\d+\.\s/.test(line))
          return (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: T.body }}>
              <span style={{ color: T.ink, flexShrink: 0, fontWeight: 500 }}>
                {line.match(/^\d+/)[0]}.
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/^\d+\.\s/, "")
                    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${T.ink}; font-weight:500;">$1</strong>`),
                }}
              />
            </div>
          );
        if (line.trim() === "") return <div key={i} style={{ height: 4 }} />;
        return (
          <p
            key={i}
            style={{ fontSize: 13.5, color: T.body, lineHeight: 1.68 }}
            dangerouslySetInnerHTML={{
              __html: line.replace(
                /\*\*(.+?)\*\*/g,
                `<strong style="color:${T.ink}; font-weight:500;">$1</strong>`
              ),
            }}
          />
        );
      })}
    </div>
  );
};

// ─── 3D TILT PROMPT CARD ──────────────────────────────────────────────────────
const TiltPromptCard = ({ children, onClick, max = 5 }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className="prompt-card"
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
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
    >
      {children}
    </motion.button>
  );
};

// ─── RECORD CONTEXT SELECTOR MODAL ───────────────────────────────────────────
const RecordSelectorModal = ({ records, selectedRecords, onToggle, onClose }) => (
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
        width: "100%",
        maxWidth: 480,
        overflow: "hidden",
        border: `1px solid ${T.line}`,
        boxShadow: "0 25px 60px rgba(12,10,9,0.15)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${T.line}`, background: T.surface2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
              Medical Records Context
            </h2>
            <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
              Select repository reports to inform clinical AI triage
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: T.white,
              border: `1px solid ${T.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon d={ICONS.close} size={13} color={T.ink} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {records.length === 0 ? (
          <p style={{ textAlign: "center", color: T.muted, fontSize: 13.5, padding: "40px 24px" }}>
            No records in your vault.
          </p>
        ) : (
          records.map((record) => {
            const isSelected = !!selectedRecords.find((r) => r._id === record._id);
            const hasAI = !!record.aiProcessing?.aiStandardizedSummary;
            return (
              <div
                key={record._id}
                onClick={() => onToggle(record)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 24px",
                  cursor: "pointer",
                  borderBottom: `1px solid ${T.line}`,
                  background: isSelected ? T.surface : "white",
                  transition: "background 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1px solid ${isSelected ? T.ink : T.line}`,
                    background: isSelected ? T.ink : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Icon d={ICONS.check} size={11} color="white" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {record.fileName}
                  </p>
                  <p style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{record.recordType}</p>
                </div>

                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: hasAI ? T.white : T.surface2,
                    border: `1px solid ${T.line}`,
                    color: hasAI ? T.ink : T.muted,
                    flexShrink: 0,
                  }}
                >
                  {hasAI ? "Standardized" : "Raw"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: `1px solid ${T.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: T.surface2,
        }}
      >
        <span style={{ fontSize: 12.5, color: T.muted }}>
          {selectedRecords.length} record{selectedRecords.length !== 1 ? "s" : ""} active
        </span>
        <button
          onClick={onClose}
          style={{
            background: T.ink,
            color: "white",
            fontWeight: 500,
            fontSize: 13,
            padding: "8px 20px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
          }}
        >
          Confirm Context
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const SUGGESTIONS = [
  "What are normal clinical blood pressure parameters?",
  "How can I improve REM sleep architecture?",
  "Analyze my most recent laboratory findings",
  "Evidence-based guidelines for cardiovascular diet",
  "What does my diagnosis signify clinically?",
  "Non-pharmacological strategies to mitigate cortisol",
];

// ─── MAIN AI ANALYZER PAGE ───────────────────────────────────────────────────
const AiAnalyzerPage = () => {
  const { token } = useContext(Authcontext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecordSelector, setShowRecordSelector] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Mouse parallax for ambient aura
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 45, damping: 20 });
  const smy = useSpring(my, { stiffness: 45, damping: 20 });
  const mouseOrbX = useTransform(smx, [-0.5, 0.5], [-35, 35]);
  const mouseOrbY = useTransform(smy, [-0.5, 0.5], [-25, 25]);

  useEffect(() => {
    if (messages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`${server}/api/user/getHealthRecordsForUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setRecords(res.data.records);
      } catch (e) {
        console.error("Records fetch error", e);
      }
    };
    fetchRecords();
  }, [token]);

  const toggleSelect = (record) =>
    setSelectedRecords((prev) =>
      prev.find((r) => r._id === record._id) ? prev.filter((r) => r._id !== record._id) : [...prev, record]
    );

  const handleSend = async (e) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;
    setError("");

    const updatedMessages = [...messages, { role: "user", content: question }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const summaries = selectedRecords
        .map((r) => toStr(r.aiProcessing?.aiStandardizedSummary))
        .filter(Boolean);

      const payload = {
        question,
        patient: {
          recordSummaries:
            summaries.join("\n\n---\n\n") ||
            "No medical records provided. Answer as general health assistant.",
          conversationHistory: updatedMessages
            .slice(0, -1)
            .map((m) => `${m.role === "user" ? "Patient" : "Doctor"}: ${m.content}`)
            .join("\n"),
        },
        session_id: sessionId,
      };

      const res = await axios.post(Dr_bot_api_url, payload);
      setMessages((prev) => [...prev, { role: "assistant", content: extractReplyText(res.data) }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err.response?.data?.detail ||
            err.message ||
            "An error occurred while connecting with Dr. Bot.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasStarted = messages.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .chat-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .prompt-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 18px;
          padding: 16px 18px;
          text-align: left;
          font-size: 13px;
          color: ${T.body};
          cursor: pointer;
          line-height: 1.5;
          transition: border-color 0.25s, box-shadow 0.25s;
          will-change: transform;
          font-family: 'Inter', sans-serif;
        }
        .prompt-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.92), rgba(255,255,255,0) 60%);
        }
        .prompt-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 10px 24px rgba(12,10,9,0.04);
        }
        .prompt-card:hover::before {
          opacity: 1;
        }

        .chat-textarea-box {
          flex: 1;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 20px;
          padding: 14px 18px;
          transition: border-color 0.2s, background 0.2s;
        }
        .chat-textarea-box:focus-within {
          border-color: ${T.ink};
          background: ${T.white};
        }

        .chat-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-size: 14px;
          color: ${T.ink};
          line-height: 1.6;
          max-height: 140px;
          font-family: 'Inter', sans-serif;
        }
        .chat-textarea::placeholder {
          color: ${T.muted};
        }

        .send-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: ${T.ink};
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .send-btn:not(:disabled):hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="chat-root"
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
      >
        {/* Ambient Iridescent Background Orbs */}
        <motion.div
          style={{
            position: "fixed",
            top: -100,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.28,
            filter: "blur(70px)",
            pointerEvents: "none",
            x: mouseOrbX,
            y: mouseOrbY,
          }}
        />
        <motion.div
          style={{
            position: "fixed",
            bottom: -80,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.22,
            filter: "blur(65px)",
            pointerEvents: "none",
          }}
        />

        {/* ──────────────── 1. OBSERVATORY TOP BAR ──────────────── */}
        <div
          style={{
            flexShrink: 0,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${T.line}`,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BotAvatar size={38} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>
                  Dr. Bot
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: T.surface2, border: `1px solid ${T.line}`, padding: "2px 8px", borderRadius: 20, fontSize: 11, color: T.ink }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} /> Online
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>
                Clinical Diagnostic Assistant · CuraLink Engine
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Context Selector Trigger */}
            <button
              onClick={() => setShowRecordSelector(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 16px",
                borderRadius: 999,
                border: `1px solid ${selectedRecords.length > 0 ? T.ink : T.line}`,
                background: selectedRecords.length > 0 ? T.ink : T.white,
                color: selectedRecords.length > 0 ? "white" : T.body,
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Icon d={ICONS.records} size={13} color={selectedRecords.length > 0 ? "white" : T.muted} />
              {selectedRecords.length > 0
                ? `${selectedRecords.length} Context File${selectedRecords.length > 1 ? "s" : ""}`
                : "Add Records Context"}
            </button>

            {hasStarted && (
              <button
                onClick={() => setMessages([])}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: `1px solid ${T.line}`,
                  background: T.white,
                  color: T.muted,
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <Icon d={ICONS.trash} size={12} color={T.muted} /> Clear Session
              </button>
            )}
          </div>
        </div>

        {/* ──────────────── 2. CONTEXT CHIPS STRIP ──────────────── */}
        <AnimatePresence>
          {selectedRecords.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                flexShrink: 0,
                background: T.surface2,
                borderBottom: `1px solid ${T.line}`,
                overflow: "hidden",
                zIndex: 9,
              }}
            >
              <div style={{ padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Active Context:
                </span>
                {selectedRecords.map((r) => (
                  <span
                    key={r._id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 400,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: T.white,
                      color: T.ink,
                      border: `1px solid ${T.line}`,
                    }}
                  >
                    {r.fileName}
                    <button
                      onClick={() => toggleSelect(r)}
                      style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", color: T.muted }}
                    >
                      <Icon d={ICONS.close} size={11} color="currentColor" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──────────────── 3. MESSAGES CHAT STREAM ──────────────── */}
        <div style={{ flex: 1, overflowY: "auto", zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Empty State / Welcome Canvas */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "55vh",
                  textAlign: "center",
                  gap: 18,
                }}
              >
                <div style={{ position: "relative" }}>
                  <BotAvatar size={68} />
                </div>

                <div>
                  <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.03em" }}>
                    How can I assist your health journey today?
                  </h2>
                  <p style={{ color: T.body, fontSize: 14.5, marginTop: 8, maxWidth: 460 }}>
                    Inquire about clinical symptoms, lab findings, or medical guidance. Attach records above for personalized, context-aware analysis.
                  </p>
                </div>

                {/* Prompt Suggestions Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, width: "100%", maxWidth: 620, marginTop: 14 }}>
                  {SUGGESTIONS.map((s) => (
                    <TiltPromptCard key={s} onClick={() => setInput(s)}>
                      {s}
                    </TiltPromptCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Render Messages */}
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  style={{
                    display: "flex",
                    gap: 12,
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                  }}
                >
                  {msg.role === "user" ? <UserAvatar size={34} /> : <BotAvatar size={34} />}

                  <div
                    style={{
                      maxWidth: "80%",
                      borderRadius: 20,
                      padding: "14px 18px",
                      background: msg.role === "user" ? T.ink : msg.isError ? "#FEF2F2" : T.surface,
                      color: msg.role === "user" ? "white" : T.body,
                      border: msg.role === "user" ? "none" : `1px solid ${msg.isError ? "#FECACA" : T.line}`,
                      boxShadow: msg.role === "user" ? "0 8px 24px rgba(12,10,9,0.15)" : "none",
                    }}
                  >
                    {msg.role === "user" ? (
                      <p style={{ fontSize: 13.5, color: "white", lineHeight: 1.6 }}>{msg.content}</p>
                    ) : (
                      <RichText text={msg.content} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Real-time Typing Pulse Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", gap: 12, alignItems: "center" }}
              >
                <BotAvatar size={34} />
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.line}`,
                    borderRadius: 20,
                    padding: "12px 18px",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: T.ink }}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ──────────────── 4. ERROR NOTICE BAR ──────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ flexShrink: 0, maxWidth: 780, margin: "0 auto", width: "100%", padding: "0 24px 8px", zIndex: 10 }}
            >
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                  fontSize: 12.5,
                  padding: "10px 16px",
                  borderRadius: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{error}</span>
                <button onClick={() => setError("")} style={{ border: "none", background: "none", cursor: "pointer" }}>
                  <Icon d={ICONS.close} size={13} color="#DC2626" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──────────────── 5. CONVERSATION INPUT BAR ──────────────── */}
        <div
          style={{
            flexShrink: 0,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${T.line}`,
            padding: "16px 24px 20px",
            zIndex: 10,
          }}
        >
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <form onSubmit={handleSend} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              
              {/* Textarea Console */}
              <div className="chat-textarea-box">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasStarted ? "Inquire further about your health…" : "Ask Dr. Bot clinical or symptom questions…"}
                  className="chat-textarea"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="send-btn"
                aria-label="Send Message"
              >
                <Icon d={ICONS.send} size={16} color="white" />
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 11.5, color: T.muted, marginTop: 10 }}>
              Return to dispatch · Shift + Return for line breaks · Informational support only, not an emergency diagnostic service
            </p>
          </div>
        </div>

        {/* ──────────────── MODAL ──────────────── */}
        <AnimatePresence>
          {showRecordSelector && (
            <RecordSelectorModal
              records={records}
              selectedRecords={selectedRecords}
              onToggle={toggleSelect}
              onClose={() => setShowRecordSelector(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AiAnalyzerPage;