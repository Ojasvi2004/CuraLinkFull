import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER;

/* ─── THEME TOKENS (identical to dashboard, add-patient, HowItWorks, FAQ) ─── */
const T = {
    ink: "#0C0A09", body: "#57534E", muted: "#A8A29E", line: "#ECEAE6",
    surface: "#F5F4F2", surface2: "#FAFAF9", white: "#FFFFFF",
};
const EASE = [0.22, 1, 0.36, 1];
const ORBS = {
    violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
    sun: "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
    sky: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
    mint: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};
const ORB_LIST = Object.values(ORBS);
const GLASS = { background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", border: `1px solid ${T.line}` };

/* ─── ICONS ─────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const ICONS = {
    lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
    clock: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    sort: "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12",
    plus: ["M12 5v14", "M5 12h14"],
    x: ["M18 6 6 18", "m6 6 12 12"],
    check: "M20 6 9 17l-5-5",
    pulse: "M22 12h-4l-3 9L9 3l-3 9H2",
    info: ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4m0 4h.01"],
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
    bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
    send: ["M22 2L11 13", "M22 2L15 22 11 13 2 9l20-7z"],
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    chevD: "m6 9 6 6 6-6",
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
};

/* ─── CONSTANTS / HELPERS ───────────────────────────────────────────────── */
const getOrb = (name = "") => ORB_LIST[name.charCodeAt(0) % ORB_LIST.length];
const getInitials = (name = "") => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const getTodayISO = () => new Date().toISOString().split("T")[0];

const TABS = [
    { key: "all", label: "All patients" },
    { key: "today", label: "Today's appointments" },
    { key: "granted", label: "Access granted" },
    { key: "pending", label: "Pending" },
];
const SCOPE_OPTIONS = [
    { value: "full", label: "Full record", desc: "All history, labs, vitals" },
    { value: "recent", label: "Recent visits", desc: "Last 6 months only" },
    { value: "labs", label: "Lab reports", desc: "Pathology & imaging" },
    { value: "meds", label: "Medications", desc: "Prescriptions & allergies" },
];
const STATUS = {
    granted: { label: "Access granted", dot: "#5FD0A5" },
    pending: { label: "Pending", dot: "#FFB36B" },
    today: { label: "Today", dot: "#7C8CFF" },
    none: { label: "No access", dot: T.muted },
};

/* ─── VARIANTS / SHARED PIECES ──────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const wordChild = { hidden: { y: "115%", rotate: 4 }, visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } } };
const H = { fontWeight: 300, color: T.ink, lineHeight: 1.06, letterSpacing: "-0.04em" };

const Aura = ({ blobs }) => (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {blobs.map((b, i) => (
            <div key={i} style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", width: b.s, height: b.s, background: b.c, opacity: b.o ?? 0.4, top: b.t, left: b.l, right: b.r, bottom: b.b }} />
        ))}
    </div>
);

const Bead = ({ bg, size = 14 }) => (
    <span style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: bg, flexShrink: 0, boxShadow: "0 0 14px rgba(124,140,255,0.35)", display: "inline-block" }}>
        <span style={{ position: "absolute", top: "18%", left: "22%", width: "30%", height: "30%", borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} />
    </span>
);

const NeuralArt = ({ reduce, count = 40, style = {}, id = "pa-g" }) => {
    const { nodes, edges } = useMemo(() => {
        let s = 7;
        const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
        const nodes = [];
        while (nodes.length < count) {
            const x = rnd() * 2 - 1, y = rnd() * 2 - 1;
            if (x * x + (y * y) / 0.62 > 1) continue;
            if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < 0.028)) continue;
            nodes.push({ x, y, r: 2.2 + rnd() * 3, d: rnd() * 5, h: rnd() });
        }
        const edges = [];
        nodes.forEach((a, i) => nodes.forEach((b, j) => {
            if (j > i && (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < 0.13) edges.push([a, b]);
        }));
        return { nodes, edges };
    }, [count]);
    const P = ["#7C8CFF", "#C9B8FF", "#F6A5D8", "#A5D8FF", "#FFB36B"];
    return (
        <svg viewBox="-1.1 -0.85 2.2 1.7" aria-hidden style={{ overflow: "visible", ...style }}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#7C8CFF" /><stop offset="1" stopColor="#F6A5D8" />
                </linearGradient>
            </defs>
            {edges.map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`url(#${id})`} strokeWidth="0.004" opacity="0.6" />)}
            {nodes.map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y} r={n.r / 260} fill={P[(n.h * P.length) | 0]}
                    className={reduce ? undefined : "pa-node"} style={{ animationDelay: `${n.d}s` }} />
            ))}
        </svg>
    );
};

const Section = ({ children, style = {}, ...rest }) => (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger} style={{ position: "relative", ...style }} {...rest}>
        {children}
    </motion.section>
);

const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
    const Tag = motion[as];
    return (
        <Tag variants={wordParent} style={style} {...rest}>
            {text.split("\n").map((line, li, arr) => (
                <React.Fragment key={li}>
                    {line.split(" ").map((w, i) => (
                        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.24em" }}>
                            <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
                        </span>
                    ))}
                    {li < arr.length - 1 && <br />}
                </React.Fragment>
            ))}
        </Tag>
    );
};

const IconTile = ({ d, size = 48, dark = false }) => (
    <div style={{ width: size, height: size, borderRadius: 14, background: dark ? T.ink : T.surface, border: `1px solid ${dark ? T.ink : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={d} size={size > 40 ? 22 : 15} color={dark ? "#fff" : T.ink} />
    </div>
);

const StatusBadge = ({ status, isToday }) => {
    const s = STATUS[status === "none" && isToday ? "today" : status] || STATUS.none;
    return (
        <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 500, color: T.ink, padding: "4px 12px 4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />{s.label}
        </span>
    );
};

const Toast = ({ message, type = "success", visible }) => (
    <AnimatePresence>
        {visible && (
            <motion.div role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.35, ease: EASE }}
                style={{ position: "fixed", bottom: 28, right: 28, zIndex: 300, background: T.ink, color: "#fff", padding: "13px 22px 13px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 500, boxShadow: "0 18px 50px rgba(12,10,9,.25)", display: "flex", alignItems: "center", gap: 10 }}>
                <Bead bg={type === "warning" ? ORBS.sun : type === "info" ? ORBS.violet : ORBS.mint} size={18} />
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

/* ─── MODAL SHELL ───────────────────────────────────────────────────────── */
const ModalShell = ({ icon, title, onClose, maxWidth = 480, children }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: "fixed", inset: 0, background: "rgba(12,10,9,0.35)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 200 }}>
        <motion.div role="dialog" aria-modal="true" aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.35, ease: EASE }}
            style={{ background: T.white, borderRadius: 28, width: "100%", maxWidth, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.18)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", borderBottom: `1px solid ${T.line}` }}>
                <IconTile d={icon} size={44} />
                <p style={{ flex: 1, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>{title}</p>
                <button type="button" onClick={onClose} aria-label="Close" className="pa-close"><Icon d={ICONS.x} size={15} color={T.ink} /></button>
            </div>
            {children}
        </motion.div>
    </motion.div>
);

const Note = ({ icon = ICONS.shield, children }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: T.surface2, borderRadius: 16, padding: "14px 16px", border: `1px solid ${T.line}` }}>
        <Icon d={icon} size={16} color={T.ink} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13, color: T.body, lineHeight: 1.6 }}>{children}</p>
    </div>
);

const ModalActions = ({ onClose, onConfirm, busy, label, busyLabel, icon }) => (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button type="button" className="pa-btn-outline" onClick={onClose}>Cancel</button>
        <button type="button" className="pa-btn-ink" onClick={onConfirm} disabled={busy}>
            <Icon d={icon || ICONS.send} size={14} color="white" />{busy ? busyLabel : label}
        </button>
    </div>
);

/* ─── REQUEST ACCESS MODAL ──────────────────────────────────────────────── */
const RequestModal = ({ patients, preselectedId, onClose, onSubmit }) => {
    const [selectedPatient, setSelectedPatient] = useState(preselectedId || "");
    const [scope, setScope] = useState("full");
    const [reason, setReason] = useState("");
    const [duration, setDuration] = useState("24h");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedPatient) return alert("Please select a patient.");
        setSubmitting(true);
        await onSubmit({ patientId: selectedPatient, scope, reason, duration });
        setSubmitting(false);
    };

    const lbl = { fontSize: 13, fontWeight: 500, color: T.ink, marginBottom: 8, display: "block" };

    return (
        <ModalShell icon={ICONS.lock} title="Request record access" onClose={onClose} maxWidth={540}>
            <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 20, maxHeight: "70vh", overflowY: "auto" }}>
                <div>
                    <label htmlFor="pa-patient" style={lbl}>Patient</label>
                    <div style={{ position: "relative" }}>
                        <select id="pa-patient" className="pa-input" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                            <option value="">Select patient</option>
                            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                        <span className="pa-chev"><Icon d={ICONS.chevD} size={14} color={T.muted} /></span>
                    </div>
                </div>
                <div>
                    <span style={lbl}>Access scope</span>
                    <div className="pa-scope">
                        {SCOPE_OPTIONS.map((opt) => {
                            const on = scope === opt.value;
                            return (
                                <button type="button" key={opt.value} onClick={() => setScope(opt.value)} aria-pressed={on}
                                    style={{ textAlign: "left", cursor: "pointer", fontFamily: "inherit", padding: "13px 16px", borderRadius: 16, border: `1px solid ${on ? T.ink : T.line}`, background: on ? T.white : T.surface2, boxShadow: on ? "0 0 0 1px " + T.ink : "none", transition: "border-color .2s, background .2s" }}>
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13.5, fontWeight: 500, color: T.ink }}>
                                        {opt.label}{on && <Icon d={ICONS.check} size={14} color={T.ink} />}
                                    </span>
                                    <span style={{ display: "block", fontSize: 12, color: T.muted, marginTop: 2 }}>{opt.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label htmlFor="pa-reason" style={lbl}>Reason for access</label>
                    <textarea id="pa-reason" className="pa-input" value={reason} onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Review prior cardiac history before today's consultation…" style={{ resize: "none", height: 84 }} />
                </div>
                <div>
                    <label htmlFor="pa-duration" style={lbl}>Duration</label>
                    <div style={{ position: "relative" }}>
                        <select id="pa-duration" className="pa-input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                            <option value="6h">6 hours</option>
                            <option value="24h">24 hours</option>
                            <option value="48h">48 hours</option>
                            <option value="7d">7 days (extended care)</option>
                        </select>
                        <span className="pa-chev"><Icon d={ICONS.chevD} size={14} color={T.muted} /></span>
                    </div>
                </div>
                <Note>The patient will be notified of this request. Access is logged and auditable per DPDP Act guidelines.</Note>
                <ModalActions onClose={onClose} onConfirm={handleSubmit} busy={submitting} label="Send request" busyLabel="Sending request…" />
            </div>
        </ModalShell>
    );
};

/* ─── SINGLE CONSENT MODAL ──────────────────────────────────────────────── */
const ConsentModal = ({ patient, onClose, onConfirm, sending }) => (
    <ModalShell icon={ICONS.bell} title="Ask for consent" onClose={onClose} maxWidth={440}>
        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>
                A consent notification will be sent to <strong style={{ color: T.ink, fontWeight: 500 }}>{patient?.name}</strong> requesting permission to access their health records for today's consultation.
            </p>
            <Note>The patient can approve or decline from the app. You'll be notified once they respond.</Note>
            <ModalActions onClose={onClose} onConfirm={onConfirm} busy={sending} label="Send consent request" busyLabel="Sending…" />
        </div>
    </ModalShell>
);

/* ─── BULK CONSENT MODAL ────────────────────────────────────────────────── */
const BulkConsentModal = ({ todayPatients, onClose, onConfirm, sending }) => (
    <ModalShell icon={ICONS.zap} title="Bulk consent request" onClose={onClose} maxWidth={500}>
        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>
                Send consent notifications to all <strong style={{ color: T.ink, fontWeight: 500 }}>{todayPatients.length} patient{todayPatients.length !== 1 ? "s" : ""}</strong> scheduled for today who don't already have access granted.
            </p>
            <div style={{ background: T.surface2, border: `1px solid ${T.line}`, borderRadius: 18, maxHeight: 190, overflowY: "auto" }}>
                {todayPatients.map((p, i) => (
                    <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < todayPatients.length - 1 ? `1px solid ${T.line}` : "none" }}>
                        <Bead bg={getOrb(p.name)} size={22} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: T.ink, flex: 1 }}>{p.name}</span>
                        <span style={{ fontSize: 12, color: T.muted }}>{p.appointmentTime || "Today"}</span>
                    </div>
                ))}
            </div>
            <Note icon={ICONS.info}>Each patient receives an individual notification. Patients with granted or pending access are skipped.</Note>
            <ModalActions onClose={onClose} onConfirm={onConfirm} busy={sending} label={`Send to all ${todayPatients.length}`} busyLabel="Sending…" />
        </div>
    </ModalShell>
);

/* ─── PATIENT ROW ───────────────────────────────────────────────────────── */
const PatientRow = ({ patient, onRequest, onRevoke, onView, onAskConsent, consentSending }) => {
    const sending = consentSending === patient._id;
    return (
        <div className="pa-row">
            <span style={{ position: "relative", width: 46, height: 46, flexShrink: 0 }}>
                <span style={{ width: 46, height: 46, borderRadius: "50%", background: getOrb(patient.name), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(124,140,255,0.25)" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.ink, background: "rgba(255,255,255,0.7)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{getInitials(patient.name)}</span>
                </span>
            </span>

            <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ fontSize: 14.5, color: T.ink, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.name}</p>
                <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
                    {patient.primaryConcern || "General"}
                    {patient.appointmentTime
                        ? ` · ${patient.appointmentTime} · ${patient.appointmentType === "DIGITAL" ? "Video call" : "In-person"}`
                        : " · Returning patient"}
                </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <StatusBadge status={patient.accessStatus} isToday={patient.isToday} />

                {patient.isToday && patient.accessStatus === "none" && (
                    <button type="button" className="pa-btn-ink pa-sm" onClick={() => onAskConsent(patient)} disabled={sending}>
                        <Icon d={ICONS.bell} size={13} color="white" />{sending ? "Sending…" : "Ask consent"}
                    </button>
                )}

                {patient.accessStatus === "granted" && (
                    <>
                        <button type="button" className="pa-btn-outline pa-sm" onClick={() => onView(patient)}>
                            <Icon d={ICONS.eye} size={13} color={T.ink} /> View records
                        </button>
                        <button type="button" className="pa-btn-outline pa-sm" onClick={() => onRevoke(patient)}>Revoke</button>
                    </>
                )}

                {patient.accessStatus === "pending" && (
                    <button type="button" className="pa-btn-outline pa-sm" disabled>Awaiting consent…</button>
                )}

                {patient.accessStatus === "none" && !patient.isToday && (
                    <button type="button" className="pa-btn-ink pa-sm" onClick={() => onRequest(patient._id)}>
                        <Icon d={ICONS.lock} size={13} color="white" /> Request access
                    </button>
                )}
            </div>
        </div>
    );
};

const ACT_DOT = { granted: "#5FD0A5", pending: "#FFB36B", revoked: "#F6A5D8", expired: "#7C8CFF", consent: "#C9B8FF" };

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DoctorPatientDataAccessPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const reduce = useReducedMotion();

    const [patients, setPatients] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const [showAccessModal, setShowAccessModal] = useState(false);
    const [preselectedId, setPreselectedId] = useState(null);
    const [consentTarget, setConsentTarget] = useState(null);
    const [showBulkConsent, setShowBulkConsent] = useState(false);
    const [consentSending, setConsentSending] = useState(null);
    const [bulkSending, setBulkSending] = useState(false);

    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
    };

    /* ── FETCH ── (logic unchanged) */
    const fetchData = useCallback(async () => {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const todayISO = getTodayISO() + "T00:00:00.000+00:00";

        const todayNameMap = {};
        try {
            const res = await axios.post(`${server}/api/doctors/gettodayAppointment`, { dateISO: todayISO }, { headers });
            if (res.data.success) {
                (res.data.DayAppointment || []).forEach((apt) => {
                    todayNameMap[apt.patientName] = {
                        appointmentTime: apt.time?.start || null,
                        appointmentType: apt.consultationType || null,
                        primaryConcern: apt.notes || "General",
                    };
                });
            }
        } catch (err) {
            console.error("gettodayAppointment error:", err.response?.data || err.message);
        }

        let patientList = [];
        try {
            const res = await axios.get(`${server}/api/doctors/get-patients`, { headers });
            if (res.data.success) patientList = res.data.patient || [];
        } catch (err) {
            console.error("get-patients error:", err.response?.data || err.message);
        }

        const permMap = {};
        try {
            const res = await axios.get(`${server}/api/doctors/permissions/status`, { headers });
            if (res.data.success) (res.data.permissions || []).forEach((p) => { permMap[p.patientId] = p.status; });
        } catch (_) { /* optional endpoint */ }

        try {
            const res = await axios.get(`${server}/api/doctors/permissions/activity`, { headers });
            if (res.data.success) setActivityLog(res.data.activity || []);
        } catch (_) { /* optional endpoint */ }

        setPatients(patientList.map((p) => {
            const todayInfo = todayNameMap[p.name] || null;
            return {
                ...p,
                accessStatus: permMap[p._id] || "none",
                isToday: !!todayInfo,
                appointmentTime: todayInfo?.appointmentTime || null,
                appointmentType: todayInfo?.appointmentType || null,
                primaryConcern: todayInfo?.primaryConcern || p.primaryConcern || "General",
            };
        }));
        setLoading(false);
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── HANDLERS ── */
    const handleRequestAccess = (patientId) => { setPreselectedId(patientId); setShowAccessModal(true); };

    const handleSubmitRequest = async ({ patientId, scope, reason, duration }) => {
        try {
            const res = await axios.post(
                `${server}/api/doctors/permissions/request`, // fixed: was `{server}` (missing $)
                { patientId, scope, reason, duration },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setPatients((prev) => prev.map((p) => (p._id === patientId ? { ...p, accessStatus: "pending" } : p)));
                const p = patients.find((x) => x._id === patientId);
                setActivityLog((prev) => [{ text: `Request sent — ${p?.name}`, time: "Just now", type: "pending" }, ...prev]);
                setShowAccessModal(false);
                showToast("Access request sent");
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
                `${server}/api/doctors/permissions/revoke`,
                { patientId: patient._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setPatients((prev) => prev.map((p) => (p._id === patient._id ? { ...p, accessStatus: "none" } : p)));
                setActivityLog((prev) => [{ text: `Access revoked — ${patient.name}`, time: "Just now", type: "revoked" }, ...prev]);
                showToast("Access revoked");
            }
        } catch (err) { console.error(err); }
    };

    const handleViewRecord = (patient) => navigate(`/doctor/patient-record/${patient._id}`);
    const handleAskConsent = (patient) => setConsentTarget(patient);

    const handleConfirmSingleConsent = async () => {
        if (!consentTarget) return;
        setConsentSending(consentTarget._id);
        try {
            const res = await axios.post(
                `${server}/api/doctors/permissions/request-consent`,
                { patientId: consentTarget._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setPatients((prev) => prev.map((p) => (p._id === consentTarget._id ? { ...p, accessStatus: "pending" } : p)));
                setActivityLog((prev) => [{ text: `Consent request sent — ${consentTarget.name}`, time: "Just now", type: "consent" }, ...prev]);
                showToast(`Consent request sent to ${consentTarget.name}`, "info");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to send consent request", "warning");
        }
        setConsentSending(null);
        setConsentTarget(null);
    };

    const todayNeedingConsent = patients.filter((p) => p.isToday && p.accessStatus === "none");

    const handleBulkConsent = () => {
        if (todayNeedingConsent.length === 0) {
            showToast("All of today's patients already have access or a pending request", "info");
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
                    `${server}/api/doctors/permissions/request-consent`,
                    { patientId: patient._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    successCount++;
                    setPatients((prev) => prev.map((p) => (p._id === patient._id ? { ...p, accessStatus: "pending" } : p)));
                }
            } catch (err) {
                console.error(`Consent failed for ${patient.name}:`, err);
            }
        }
        setActivityLog((prev) => [{ text: `Bulk consent sent to ${successCount} patient(s)`, time: "Just now", type: "consent" }, ...prev]);
        setBulkSending(false);
        setShowBulkConsent(false);
        showToast(`Consent requests sent to ${successCount} patient${successCount !== 1 ? "s" : ""}`, "info");
    };

    /* ── FILTER + SORT ── */
    const visiblePatients = patients
        .filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchTab =
                activeTab === "all" ? true :
                activeTab === "today" ? p.isToday :
                activeTab === "granted" ? p.accessStatus === "granted" :
                activeTab === "pending" ? p.accessStatus === "pending" : true;
            return matchSearch && matchTab;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "status") {
                const ord = { granted: 0, pending: 1, none: 2 };
                return (ord[a.accessStatus] ?? 3) - (ord[b.accessStatus] ?? 3);
            }
            if (sortBy === "time") return (a.appointmentTime || "ZZ").localeCompare(b.appointmentTime || "ZZ");
            return 0;
        });

    const grantedCount = patients.filter((p) => p.accessStatus === "granted").length;
    const pendingCount = patients.filter((p) => p.accessStatus === "pending").length;
    const todayCount = patients.filter((p) => p.isToday).length;

    const stats = [
        { label: "Access granted", value: grantedCount, icon: ICONS.shield },
        { label: "Pending", value: pendingCount, icon: ICONS.clock },
        { label: "Today's patients", value: todayCount, icon: ICONS.calendar },
        { label: "Needs consent", value: todayNeedingConsent.length, icon: ICONS.bell },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .pa-root{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:${T.white};color:${T.body};-webkit-font-smoothing:antialiased;overflow-x:clip;min-height:100vh}
        .pa-root *,.pa-modal-root *{box-sizing:border-box;font-family:inherit}
        .pa-root *,.pa-modal-root *{margin:0;padding:0}
        .pa-root ::selection{background:${T.ink};color:#fff}
        .pa-root a{text-decoration:none;color:inherit}

        .pa-card{position:relative;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border-radius:28px;border:1px solid ${T.line};box-shadow:0 18px 50px rgba(12,10,9,.04)}
        .pa-input{width:100%;padding:13px 18px;border:1px solid ${T.line};border-radius:16px;font-size:14.5px;color:${T.ink};background:${T.surface2};outline:0;font-family:inherit;transition:border-color .2s,background .2s}
        .pa-input::placeholder{color:#C4BFBA}
        .pa-input:focus{border-color:${T.ink};background:#fff}
        select.pa-input{appearance:none;cursor:pointer;padding-right:42px}
        .pa-chev{position:absolute;right:16px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex}
        .pa-search{padding-left:44px}
        .pa-search-ic{position:absolute;left:16px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex}

        .pa-btn-ink{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:${T.ink};color:#fff;font-weight:500;font-size:14px;padding:14px 28px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;white-space:nowrap;transition:box-shadow .25s,transform .25s,opacity .25s}
        .pa-btn-ink:hover:not(:disabled){box-shadow:0 16px 36px rgba(12,10,9,.25);transform:translateY(-1px)}
        .pa-btn-ink:disabled{opacity:.55;cursor:not-allowed}
        .pa-btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(8px);color:${T.ink};font-weight:500;font-size:14px;padding:13px 26px;border-radius:999px;border:1px solid ${T.line};cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .25s,border-color .25s,transform .25s}
        .pa-btn-outline:hover:not(:disabled){background:#fff;border-color:#D6D3D1;transform:translateY(-1px)}
        .pa-btn-outline:disabled{color:${T.muted};cursor:not-allowed}
        .pa-sm{font-size:13px;padding:8px 16px}
        .pa-close{width:36px;height:36px;border-radius:50%;border:1px solid ${T.line};background:${T.surface2};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
        .pa-close:hover{background:${T.surface}}
        .pa-root button:focus-visible,.pa-modal-root button:focus-visible,.pa-root a:focus-visible{outline:2px solid ${T.ink};outline-offset:3px}

        .pa-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .pa-tabs{display:flex;gap:6px;padding:6px;overflow-x:auto}
        .pa-tab{flex:1;white-space:nowrap;padding:10px 18px;border-radius:999px;border:0;background:transparent;color:${T.body};font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;transition:background .25s,color .25s}
        .pa-tab:hover{background:${T.surface}}
        .pa-tab[aria-selected="true"]{background:${T.ink};color:#fff}
        .pa-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 16px;border-radius:20px;transition:background .2s}
        .pa-row:hover{background:${T.surface}}
        .pa-scope{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .pa-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}

        @keyframes pa-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.9)}}
        .pa-node{transform-box:fill-box;transform-origin:center;animation:pa-pulse 4.5s ease-in-out infinite}
        @keyframes pa-spin{to{transform:rotate(360deg)}}

        @media (max-width:900px){.pa-stats{grid-template-columns:1fr 1fr}.pa-neural{opacity:.3!important;width:100%!important}}
        @media (max-width:560px){.pa-scope{grid-template-columns:1fr}.pa-card{border-radius:24px}}
        @media (prefers-reduced-motion:reduce){.pa-node{animation:none}.pa-btn-ink,.pa-btn-outline,.pa-row,.pa-tab{transition:none}}
      `}</style>

            <div className="pa-root">

                {/* ── HEADER ── */}
                <Section style={{ padding: "56px 24px 72px", overflow: "hidden", background: `linear-gradient(180deg, ${T.white} 0%, #F4F0FF 100%)` }}>
                    <Aura blobs={[
                        { c: "#C9B8FF", s: 460, t: "-22%", l: "-8%", o: 0.5 },
                        { c: "#A5D8FF", s: 420, t: "0%", r: "-6%", o: 0.42 },
                        { c: "#FFD9B8", s: 360, b: "-24%", l: "34%", o: 0.45 },
                    ]} />
                    <div className="pa-neural" aria-hidden style={{ position: "absolute", top: "0%", right: "2%", width: "min(46vw,560px)", opacity: 0.7, pointerEvents: "none" }}>
                        <NeuralArt reduce={reduce} count={40} id="pa-g1" style={{ width: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 60% at 40% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)" }} />

                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
                            <div>
                                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                                    <span style={{ ...GLASS, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                                        <span style={{ position: "relative", width: 26, height: 26 }}>
                                            <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                                            <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon d={ICONS.lock} size={13} color="white" />
                                            </span>
                                        </span>
                                        <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Permissions & data access</span>
                                    </span>
                                </motion.div>
                                <WordReveal as="h1" text={"Patient data\naccess."} style={{ ...H, fontSize: "clamp(38px,6vw,72px)", marginBottom: 14 }} />
                                <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,17px)", color: T.body, lineHeight: 1.7, maxWidth: 520 }}>
                                    Request secure access to patient health records for AI-powered diagnosis insights.
                                </motion.p>
                            </div>

                            <motion.div variants={fadeUp} className="pa-actions">
                                <button type="button" className="pa-btn-outline" onClick={handleBulkConsent}>
                                    <Icon d={ICONS.zap} size={14} color={T.ink} /> Consent all today ({todayNeedingConsent.length})
                                </button>
                                <button type="button" className="pa-btn-ink" onClick={() => { setPreselectedId(null); setShowAccessModal(true); }}>
                                    <Icon d={ICONS.plus} size={15} color="white" /> Request access
                                </button>
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <motion.div variants={stagger} className="pa-stats">
                            {stats.map((s) => (
                                <motion.div key={s.label} variants={fadeUp} className="pa-card" style={{ borderRadius: 22, padding: "18px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <Icon d={s.icon} size={14} color={T.muted} />
                                        <p style={{ fontSize: 12.5, color: T.muted }}>{s.label}</p>
                                    </div>
                                    <p style={{ fontSize: 34, fontWeight: 300, color: T.ink, letterSpacing: "-0.04em" }}>{loading ? "—" : s.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* ── BODY ── */}
                <div style={{ position: "relative", padding: "72px 24px 110px", overflow: "hidden" }}>
                    <Aura blobs={[
                        { c: "#F6A5D8", s: 400, t: "6%", r: "-10%", o: 0.2 },
                        { c: "#A5D8FF", s: 440, t: "50%", l: "-12%", o: 0.28 },
                        { c: "#FFD9B8", s: 400, b: "2%", r: "-8%", o: 0.32 },
                    ]} />
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Info banner */}
                        <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid ${T.line}`, boxShadow: "0 30px 80px rgba(12,10,9,0.08)", padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 16,
                            background: `radial-gradient(ellipse 70% 70% at 60% 30%, rgba(201,184,255,0.45), rgba(165,216,255,0.2) 60%, rgba(255,255,255,0) 85%), radial-gradient(ellipse 50% 50% at 10% 100%, rgba(255,217,184,0.5), rgba(255,255,255,0) 70%), ${T.white}` }}>
                            <IconTile d={ICONS.info} dark />
                            <div>
                                <p style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", marginBottom: 4 }}>Consent-first access</p>
                                <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7 }}>
                                    Patient health records are securely encrypted. Access requests notify the patient and expire after 24 hours unless renewed.
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="pa-card pa-tabs" role="tablist" style={{ borderRadius: 999 }}>
                            {TABS.map((tab) => (
                                <button key={tab.key} type="button" role="tab" aria-selected={activeTab === tab.key} className="pa-tab" onClick={() => setActiveTab(tab.key)}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search + sort */}
                        <div className="pa-card" style={{ padding: "16px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                            <div style={{ position: "relative", flex: "1 1 260px" }}>
                                <span className="pa-search-ic"><Icon d={ICONS.search} size={15} color={T.muted} /></span>
                                <input type="text" aria-label="Search patients" className="pa-input pa-search" value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search patients by name…" />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                                <IconTile d={ICONS.sort} size={38} />
                                <div style={{ position: "relative" }}>
                                    <select aria-label="Sort patients" className="pa-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 170 }}>
                                        <option value="name">Name (A–Z)</option>
                                        <option value="status">Status</option>
                                        <option value="time">Appointment time</option>
                                    </select>
                                    <span className="pa-chev"><Icon d={ICONS.chevD} size={14} color={T.muted} /></span>
                                </div>
                            </div>
                        </div>

                        {/* Patient list */}
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }} role="status" aria-label="Loading patients">
                                <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${T.line}`, borderTopColor: T.ink, animation: reduce ? "none" : "pa-spin 1s linear infinite" }} />
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {visiblePatients.length > 0 ? (
                                    <motion.div key={activeTab + searchTerm + sortBy} className="pa-card" style={{ padding: 10 }}
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                                        {visiblePatients.map((patient, i) => (
                                            <div key={patient._id}>
                                                <PatientRow patient={patient}
                                                    onRequest={handleRequestAccess} onRevoke={handleRevoke}
                                                    onView={handleViewRecord} onAskConsent={handleAskConsent}
                                                    consentSending={consentSending} />
                                                {i < visiblePatients.length - 1 && <div style={{ height: 1, background: T.line, margin: "0 16px" }} />}
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div key="empty" className="pa-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 32px", textAlign: "center" }}>
                                        <div style={{ marginBottom: 20 }}><IconTile d={ICONS.users} /></div>
                                        <p style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em", marginBottom: 6 }}>No patients found</p>
                                        <p style={{ fontSize: 14, color: T.body, maxWidth: 320, lineHeight: 1.7 }}>
                                            {searchTerm ? "No patients match your search. Try a different name." : "No patients in this category yet."}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                        {/* Activity log */}
                        <div className="pa-card" style={{ padding: "26px 18px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 8px", marginBottom: 12 }}>
                                <IconTile d={ICONS.pulse} size={44} />
                                <p style={{ flex: 1, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: "-0.03em" }}>Access activity</p>
                                <span style={{ ...GLASS, fontSize: 12, fontWeight: 500, color: T.body, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Last 24 hours</span>
                            </div>
                            {activityLog.length > 0 ? (
                                activityLog.slice(0, 8).map((item, i, arr) => (
                                    <div key={i}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 12px" }}>
                                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACT_DOT[item.type] || T.muted, marginTop: 6, flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.5 }}>{item.text}</p>
                                                <p style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{item.time}</p>
                                            </div>
                                        </div>
                                        {i < arr.length - 1 && <div style={{ height: 1, background: T.line, margin: "0 12px" }} />}
                                    </div>
                                ))
                            ) : (
                                <p style={{ padding: "32px 12px 28px", textAlign: "center", fontSize: 14, color: T.muted }}>No recent activity.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* ── MODALS ── */}
            <div className="pa-modal-root">
                <AnimatePresence>
                    {showAccessModal && (
                        <RequestModal patients={patients} preselectedId={preselectedId}
                            onClose={() => setShowAccessModal(false)} onSubmit={handleSubmitRequest} />
                    )}
                    {consentTarget && (
                        <ConsentModal patient={consentTarget} onClose={() => setConsentTarget(null)}
                            onConfirm={handleConfirmSingleConsent} sending={consentSending === consentTarget._id} />
                    )}
                    {showBulkConsent && (
                        <BulkConsentModal todayPatients={todayNeedingConsent} onClose={() => setShowBulkConsent(false)}
                            onConfirm={handleConfirmBulkConsent} sending={bulkSending} />
                    )}
                </AnimatePresence>
            </div>

            <Toast visible={toast.visible} message={toast.message} type={toast.type} />
        </>
    );
};

export default DoctorPatientDataAccessPage;