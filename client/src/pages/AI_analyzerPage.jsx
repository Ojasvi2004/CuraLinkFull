import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";
const Dr_bot_api_url=import.meta.env.VITE_DR_BOT_ORIGIN
const server=import.meta.env.VITE_SERVER

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
);
const SvgRaw = ({ children, size = 20, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {children}
    </svg>
);

const ICONS = {
    send: ["M22 2L11 13", "M22 2L15 22 11 13 2 9 22 2"],
    trash: ["M3 6h18", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M10 11v6M14 11v6", "M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1z"],
    close: "M18 6 6 18M6 6l12 12",
    records: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6M9 17h4"],
    check: "m9 11 3 3L22 4",
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v3M3 5h3M19 18v3M17 20h3"],
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    wand: ["M15 4V2", "M15 16v-2", "M8 9h2", "M20 9h2", "M17.8 11.8L19.2 13.2", "M15 9h.01", "M17.8 6.2L19.2 4.8", "M3 21l9-9", "M12.2 6.2L10.8 4.8"],
};

// Bot SVG (custom shape — not icon system)
const BotAvatar = ({ size = 32 }) => (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(99,102,241,0.4)", flexShrink: 0 }}>
        <SvgRaw size={size * 0.55} style={{ color: "white" }}>
            <rect x="3" y="8" width="18" height="12" rx="2" stroke="white" fill="none" />
            <path d="M9 8V6a3 3 0 016 0v2" stroke="white" fill="none" />
            <circle cx="9" cy="14" r="1.5" fill="white" stroke="none" />
            <circle cx="15" cy="14" r="1.5" fill="white" stroke="none" />
        </SvgRaw>
    </div>
);

const UserAvatar = ({ size = 32 }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#0F172A,#334155)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={ICONS.user} size={size * 0.5} color="white" />
    </div>
);

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const toStr = (v) => (!v ? null : typeof v === "string" ? v : JSON.stringify(v, null, 2));

const extractReplyText = (data) => {
    const payload = data?.result ?? data;
    if (typeof payload === "string") return payload;
    const blocks = payload?.raw_output ?? payload?.raw_ouput;
    if (Array.isArray(blocks)) {
        const text = blocks.filter(b => b?.type === "text").map(b => b.text).join("\n\n");
        if (text) return text;
    }
    return JSON.stringify(payload, null, 2);
};

// ─── RICH TEXT RENDERER ────────────────────────────────────────────────────────
const RichText = ({ text }) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {lines.map((line, i) => {
                if (/^###\s/.test(line))
                    return <p key={i} style={{ fontWeight: 700, color: "#0F172A", fontSize: 14, marginTop: 10, marginBottom: 2, fontFamily: "'Playfair Display', serif" }}>{line.replace(/^###\s/, "")}</p>;
                if (/^\*\*(.+)\*\*$/.test(line.trim()))
                    return <p key={i} style={{ fontWeight: 700, color: "#1E293B", fontSize: 13 }}>{line.replace(/\*\*/g, "")}</p>;
                if (/^[\*\-]\s/.test(line))
                    return (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#334155" }}>
                            <span style={{ color: "#6366F1", marginTop: 2, flexShrink: 0 }}>•</span>
                            <span dangerouslySetInnerHTML={{ __html: line.replace(/^[\*\-]\s/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                        </div>
                    );
                if (/^\d+\.\s/.test(line))
                    return (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#334155" }}>
                            <span style={{ color: "#6366F1", flexShrink: 0, fontWeight: 600 }}>{line.match(/^\d+/)[0]}.</span>
                            <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                        </div>
                    );
                if (line.trim() === "") return <div key={i} style={{ height: 4 }} />;
                return (
                    <p key={i} style={{ fontSize: 13, color: "#334155", lineHeight: 1.65 }}
                        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                );
            })}
        </div>
    );
};

// ─── RECORD SELECTOR MODAL ──────────────────────────────────────────────────────
const RecordSelectorModal = ({ records, selectedRecords, onToggle, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{ background: "white", borderRadius: 22, width: "100%", maxWidth: 460, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}
        >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", padding: "20px 24px" }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "white" }}>Health Records</h2>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>Select records to give Dr. Bot context</p>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Icon d={ICONS.close} size={14} color="white" />
                    </button>
                </div>
            </div>

            <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {records.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "40px 24px" }}>No health records found.</p>
                ) : records.map(record => {
                    const isSelected = !!selectedRecords.find(r => r._id === record._id);
                    const hasAI = !!record.aiProcessing?.aiStandardizedSummary;
                    return (
                        <div key={record._id} onClick={() => onToggle(record)}
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", cursor: "pointer", borderBottom: "1px solid #F1F5F9", background: isSelected ? "#F0F0FF" : "white", transition: "background 0.15s" }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${isSelected ? "#6366F1" : "#CBD5E1"}`, background: isSelected ? "#6366F1" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                                {isSelected && <Icon d={ICONS.check} size={11} color="white" />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{record.fileName}</p>
                                <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{record.recordType}</p>
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: hasAI ? "#F0FDF4" : "#FFFBEB", color: hasAI ? "#16A34A" : "#D97706", flexShrink: 0 }}>
                                {hasAI ? "Ready" : "Processing"}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "14px 24px", borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFBFF" }}>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{selectedRecords.length} record{selectedRecords.length !== 1 ? "s" : ""} selected</span>
                <button onClick={onClose} style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 13, padding: "9px 22px", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                    Done
                </button>
            </div>
        </motion.div>
    </motion.div>
);

// ─── SUGGESTION PILL ───────────────────────────────────────────────────────────
const SUGGESTIONS = [
    "What are normal blood pressure ranges?",
    "How can I improve my sleep quality?",
    "Analyze my latest lab results",
    "Tips for a heart-healthy diet",
    "What does my diagnosis mean?",
    "How to manage stress effectively?",
];

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
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
            } catch (e) { console.error("Records fetch error", e); }
        };
        fetchRecords();
        console.log(Dr_bot_api_url);
    }, []);

    const toggleSelect = (record) =>
        setSelectedRecords(prev =>
            prev.find(r => r._id === record._id) ? prev.filter(r => r._id !== record._id) : [...prev, record]
        );


    const [sessionId] = useState(() => crypto.randomUUID());

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
            const summaries = selectedRecords.map(r => toStr(r.aiProcessing?.aiStandardizedSummary)).filter(Boolean);
            const payload = {
                question,
                patient: {
                    recordSummaries: summaries.join("\n\n---\n\n") || "No medical records provided. Answer as general health assistant.",
                    conversationHistory: updatedMessages.slice(0, -1).map(m => `${m.role === "user" ? "Patient" : "Doctor"}: ${m.content}`).join("\n"),
                },
                session_id: sessionId
            };
            const res = await axios.post(Dr_bot_api_url, payload);
            setMessages(prev => [...prev, { role: "assistant", content: extractReplyText(res.data) }]);
        } catch (err) {
            console.log(err);

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Response:", err.response.data);
            } else if (err.request) {
                console.log("No response received");
            } else {
                console.log(err.message);
            }

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        err.response?.data?.detail ||
                        err.message ||
                        "Something went wrong.",
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const hasStarted = messages.length > 0;

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

            <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

                {/* Background blobs */}
                <div style={{ position: "fixed", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "fixed", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

                {/* ── TOP BAR ── */}
                <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid #EEF2FF", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10, boxShadow: "0 2px 16px rgba(99,102,241,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <BotAvatar size={40} />
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Dr. Bot</p>
                                <span style={{ background: "#F0FDF4", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: "1px solid #BBF7D0" }}>● Online</span>
                            </div>
                            <p style={{ fontSize: 11, color: "#6366F1", fontWeight: 600, marginTop: 1 }}>AI Health Assistant · Powered by CuraLink</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => setShowRecordSelector(true)}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12, border: `1px solid ${selectedRecords.length > 0 ? "#6366F1" : "#E2E8F0"}`, background: selectedRecords.length > 0 ? "#EEF2FF" : "white", color: selectedRecords.length > 0 ? "#4338CA" : "#64748B", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                            <Icon d={ICONS.records} size={14} color={selectedRecords.length > 0 ? "#6366F1" : "#94A3B8"} />
                            {selectedRecords.length > 0 ? `${selectedRecords.length} Record${selectedRecords.length > 1 ? "s" : ""}` : "Add Records"}
                        </button>
                        {hasStarted && (
                            <button onClick={() => setMessages([])}
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12, border: "1px solid #E2E8F0", background: "white", color: "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                                <Icon d={ICONS.trash} size={13} color="#94A3B8" /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ── CONTEXT CHIPS ── */}
                <AnimatePresence>
                    {selectedRecords.length > 0 && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            style={{ flexShrink: 0, background: "rgba(255,255,255,0.7)", borderBottom: "1px solid #EEF2FF", overflow: "hidden", zIndex: 9 }}>
                            <div style={{ padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, color: "#6366F1", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Context:</span>
                                {selectedRecords.map(r => (
                                    <span key={r._id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: r.aiProcessing?.aiStandardizedSummary ? "#EEF2FF" : "#FFFBEB", color: r.aiProcessing?.aiStandardizedSummary ? "#4338CA" : "#D97706", border: `1px solid ${r.aiProcessing?.aiStandardizedSummary ? "#C7D2FE" : "#FDE68A"}` }}>
                                        {r.fileName}
                                        <button onClick={() => toggleSelect(r)} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", opacity: 0.7 }}>
                                            <Icon d={ICONS.close} size={11} color="currentColor" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── MESSAGES ── */}
                <div style={{ flex: 1, overflowY: "auto", zIndex: 1 }}>
                    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Empty state */}
                        {!hasStarted && (
                            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", textAlign: "center", gap: 20 }}>
                                <div style={{ position: "relative" }}>
                                    <BotAvatar size={72} />
                                    <div style={{ position: "absolute", top: -4, right: -4, width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#FBBF24)", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon d={ICONS.sparkle} size={11} color="white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#0F172A" }}>How can I help you today?</h2>
                                    <p style={{ color: "#64748B", fontSize: 14, marginTop: 8, maxWidth: 440 }}>Ask me any health question. Select your health records above for personalised, context-aware answers.</p>
                                </div>

                                {/* Suggestion grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, width: "100%", maxWidth: 560, marginTop: 8 }}>
                                    {SUGGESTIONS.map(s => (
                                        <motion.button key={s} whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(99,102,241,0.12)" }}
                                            onClick={() => setInput(s)}
                                            style={{ textAlign: "left", fontSize: 12, color: "#475569", background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: "12px 14px", cursor: "pointer", lineHeight: 1.5, transition: "all 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                            {s}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Message bubbles */}
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-end" }}>

                                    {msg.role === "user" ? <UserAvatar size={34} /> : <BotAvatar size={34} />}

                                    <div style={{
                                        maxWidth: "78%", borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                                        padding: "13px 16px",
                                        background: msg.role === "user"
                                            ? "linear-gradient(135deg,#6366F1,#8B5CF6)"
                                            : msg.isError ? "#FEF2F2" : "white",
                                        border: msg.role === "user" ? "none" : msg.isError ? "1px solid #FECACA" : "1px solid #EEF2FF",
                                        boxShadow: msg.role === "user" ? "0 4px 16px rgba(99,102,241,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
                                    }}>
                                        {msg.role === "user"
                                            ? <p style={{ fontSize: 13, color: "white", lineHeight: 1.6 }}>{msg.content}</p>
                                            : <RichText text={msg.content} />}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator */}
                        {isLoading && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                                <BotAvatar size={34} />
                                <div style={{ background: "white", border: "1px solid #EEF2FF", borderRadius: "4px 18px 18px 18px", padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                                    <div style={{ display: "flex", gap: 5, alignItems: "center", height: 18 }}>
                                        {[0, 1, 2].map(i => (
                                            <motion.div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366F1" }}
                                                animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14 }} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* ── ERROR BAR ── */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{ flexShrink: 0, maxWidth: 760, margin: "0 auto", width: "100%", padding: "0 24px 8px", zIndex: 10 }}>
                            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 12, padding: "10px 16px", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {error}
                                <button onClick={() => setError("")} style={{ border: "none", background: "none", cursor: "pointer" }}><Icon d={ICONS.close} size={13} color="#DC2626" /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── INPUT BAR ── */}
                <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderTop: "1px solid #EEF2FF", padding: "16px 24px 20px", zIndex: 10, boxShadow: "0 -4px 24px rgba(99,102,241,0.06)" }}>
                    <div style={{ maxWidth: 760, margin: "0 auto" }}>
                        <form onSubmit={handleSend} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            {/* Textarea wrapper */}
                            <div style={{ flex: 1, background: "white", border: "1.5px solid #E2E8F0", borderRadius: 18, padding: "12px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", transition: "border-color 0.15s, box-shadow 0.15s" }}
                                onFocus={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                                onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}>
                                <textarea ref={textareaRef} rows={1} value={input}
                                    onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                    placeholder={hasStarted ? "Ask a follow-up question…" : "Ask Dr. Bot anything about your health…"}
                                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 13, color: "#1E293B", lineHeight: 1.6, maxHeight: 140, fontFamily: "'DM Sans', sans-serif" }} />
                            </div>

                            {/* Send button */}
                            <motion.button type="submit" disabled={isLoading || !input.trim()}
                                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                                style={{ width: 46, height: 46, borderRadius: 14, background: input.trim() ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "#F1F5F9", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: input.trim() ? "0 4px 14px rgba(99,102,241,0.35)" : "none", transition: "all 0.2s" }}>
                                <Icon d={ICONS.send} size={18} color={input.trim() ? "white" : "#CBD5E1"} />
                            </motion.button>
                        </form>
                        <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 8 }}>Enter to send · Shift+Enter for new line · Not a substitute for professional medical advice</p>
                    </div>
                </div>

                {/* ── MODALS ── */}
                <AnimatePresence>
                    {showRecordSelector && (
                        <RecordSelectorModal records={records} selectedRecords={selectedRecords} onToggle={toggleSelect} onClose={() => setShowRecordSelector(false)} />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default AiAnalyzerPage;