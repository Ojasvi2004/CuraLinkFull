import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";

const BotIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M9 8V6a3 3 0 016 0v2" />
    <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const RecordsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" />
  </svg>
);

const toStr = (v) => {
  if (!v) return null;
  return typeof v === "string" ? v : JSON.stringify(v, null, 2);
};

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

const RichText = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (/^###\s/.test(line))
          return (
            <p key={i} className="font-bold text-slate-800 text-sm mt-3 mb-1">
              {line.replace(/^###\s/, "")}
            </p>
          );
        if (/^\*\*(.+)\*\*$/.test(line.trim()))
          return (
            <p key={i} className="font-semibold text-slate-700 text-sm">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (/^\*\s/.test(line) || /^-\s/.test(line))
          return (
            <div key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="text-blue-500 mt-0.5 shrink-0">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/^[\*\-]\s/, "")
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
            </div>
          );
        if (/^\d+\.\s/.test(line))
          return (
            <div key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="text-blue-500 shrink-0 font-medium">
                {line.match(/^\d+/)[0]}.
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/^\d+\.\s/, "")
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
            </div>
          );
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p
            key={i}
            className="text-sm text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        );
      })}
    </div>
  );
};

const AiAnalyzerPage = () => {
  const { token } = useContext(Authcontext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecordSelector, setShowRecordSelector] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom only when new messages arrive, not on mount
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/user/getHealthRecordsForUser",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setRecords(res.data.records);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const toggleSelect = (record) => {
    setSelectedRecords((prev) =>
      prev.find((r) => r._id === record._id)
        ? prev.filter((r) => r._id !== record._id)
        : [...prev, record]
    );
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question) return;

    setError("");
    const updatedMessages = [...messages, { role: "user", content: question }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Get summaries from selected records (if any)
      const summaries = selectedRecords
        .map((r) => toStr(r.aiProcessing?.aiStandardizedSummary))
        .filter(Boolean);

      const recordSummaries = summaries.length > 0 ? summaries.join("\n\n---\n\n") : "";

      const conversationHistory = updatedMessages
        .slice(0, -1)
        .map((m) => `${m.role === "user" ? "Patient" : "Doctor"}: ${m.content}`)
        .join("\n");

      const payload = {
        question,
        patient: {
          recordSummaries: recordSummaries || "No medical records provided. Answer as general health assistant.",
          conversationHistory: conversationHistory || "",
        },
      };

      const res = await axios.post("http://127.0.0.1:8001/askDrBot", payload);

      const replyText = extractReplyText(res.data);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText },
      ]);
    } catch (err) {
      console.error("Analysis API Error:", err.response?.data ?? err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
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

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  const hasStarted = messages.length > 0;

  const RecordSelectorModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={() => setShowRecordSelector(false)}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Select Health Records (Optional)</h2>
          <button
            onClick={() => setShowRecordSelector(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
          {records.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">
              No health records found.
            </p>
          )}
          {records.map((record) => {
            const isSelected = !!selectedRecords.find(
              (r) => r._id === record._id
            );
            const hasSummary = !!record.aiProcessing?.aiStandardizedSummary;
            return (
              <div
                key={record._id}
                onClick={() => toggleSelect(record)}
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 10 8"
                    >
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {record.fileName}
                  </p>
                  <p className="text-xs text-slate-400">{record.recordType}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    hasSummary
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {hasSummary ? "Ready" : "Processing"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
          <span className="text-xs text-slate-500">
            {selectedRecords.length} selected • Records are optional
          </span>
          <button
            onClick={() => setShowRecordSelector(false)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <BotIcon />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              Dr. Bot AI Assistant
            </h1>
            <p className="text-xs text-blue-600 font-medium">Ask anything about your health</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecordSelector(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border shadow-sm ${
              selectedRecords.length > 0
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <RecordsIcon />
            {selectedRecords.length > 0
              ? `${selectedRecords.length} record${selectedRecords.length > 1 ? "s" : ""}`
              : "Add Records"}
          </button>

          {hasStarted && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors shadow-sm"
              title="Clear chat"
            >
              <TrashIcon />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Selected record chips */}
      <AnimatePresence>
        {selectedRecords.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 bg-white border-b border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="px-4 py-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 shrink-0 font-medium">Context:</span>
              {selectedRecords.map((r) => (
                <span
                  key={r._id}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
                    r.aiProcessing?.aiStandardizedSummary
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-orange-100 text-orange-600 border border-orange-200"
                  }`}
                >
                  {r.fileName}
                  <button
                    onClick={() => toggleSelect(r)}
                    className="hover:opacity-70 ml-0.5"
                  >
                    <CloseIcon />
                  </button>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages - Claude-style centered container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Empty state */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-xl">
                  <BotIcon />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <SparklesIcon />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-sm text-slate-500 max-w-md">
                  Ask me general health questions or select your medical records above for personalized insights.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 w-full max-w-xl">
                {[
                  "What are normal blood pressure ranges?",
                  "How can I improve my sleep?",
                  "Analyze my latest lab results",
                  "Tips for staying healthy",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-left text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message bubbles */}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm shadow-md ${
                    msg.role === "user"
                      ? "bg-slate-700"
                      : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }`}
                >
                  {msg.role === "user" ? <UserIcon /> : <BotIcon />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-md ${
                    msg.role === "user"
                      ? "bg-slate-700 text-white rounded-tr-md"
                      : msg.isError
                      ? "bg-red-50 border-2 border-red-200 rounded-tl-md"
                      : "bg-white border border-slate-200 rounded-tl-md"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <RichText text={msg.content} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <BotIcon />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-md">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error bar */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="shrink-0 max-w-3xl mx-auto w-full px-4 mb-2"
          >
            <div className="flex items-center justify-between bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl shadow-sm">
              <span>{error}</span>
              <button onClick={() => setError("")} className="hover:opacity-70">
                <CloseIcon />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar - Claude-style centered */}
      <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSend}
            className="flex items-end gap-3"
          >
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasStarted
                    ? "Ask a follow-up question…"
                    : "Ask about your health…"
                }
                className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 resize-none outline-none leading-relaxed"
                style={{ maxHeight: "160px" }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SendIcon />
            </motion.button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-2.5">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showRecordSelector && <RecordSelectorModal />}
      </AnimatePresence>
    </div>
  );
};

export default AiAnalyzerPage;