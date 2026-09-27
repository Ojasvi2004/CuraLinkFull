// src/pages/ProfilePage.js
import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Authcontext } from "../Context/AuthContext";
import axios from 'axios';
const server = import.meta.env.VITE_SERVER;


const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
);

const ICONS = {
    edit: ["M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5", "m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"],
    doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
    plus: "M12 5v14M5 12h14",
    clip: ["M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L10.13 17.1a2 2 0 0 1-2.83-2.83l8.49-8.48"],
    camera: ["M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z", "M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
    mail: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "m22 6-10 7L2 6"],
    phone: ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
    cake: ["M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8", "M4 16s.5-1 2-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2-1 2-1", "M12 2v4", "M9 7h6"],
    gender: ["M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 15v7", "M9 19h6"],
    map: ["M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z", "M8 2v16", "M16 6v16"],
    x: "M18 6 6 18M6 6l12 12",
    upload: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
    trash: ["M3 6h18", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M10 11v6", "M14 11v6"],
    sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
    shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
    inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
    stethoscope: ["M4.8 2.3A.3.3 0 1 0 5.4 2 .3.3 0 0 0 4.8 2.3z", "M8 2v6a4 4 0 0 0 4 4a4 4 0 0 0 4-4V2", "M12 12v3a6 6 0 0 1-6 6", "M19.4 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
    building: ["M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18", "M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1", "M2 22h20"],
};


const Avatar = ({ imageUrl, altText, onUploadClick }) => (
    <div style={{ position: "relative", flexShrink: 0 }} className="group">
        {imageUrl ? (
            <img src={imageUrl} alt={altText || "Avatar"} style={{ width: 108, height: 108, borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }} />
        ) : (
            <div style={{ width: 108, height: 108, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "4px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 38, fontWeight: 700, fontFamily: "'Playfair Display', serif", backdropFilter: "blur(6px)" }}>
                {altText ? altText.charAt(0).toUpperCase() : "U"}
            </div>
        )}
        <button
            onClick={onUploadClick}
            aria-label="Change profile picture"
            style={{ position: "absolute", bottom: 0, right: 0, width: 34, height: 34, borderRadius: "50%", background: "white", border: "3px solid #8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
        >
            <Icon d={ICONS.camera} size={14} color="#6366F1" />
        </button>
    </div>
);

const cardStyle = { background: "white", borderRadius: 20, border: "1px solid #EEF2FF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "26px 28px", marginBottom: 22 };

const sectionHeader = (icon, title, action) => (
    <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-3">
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icon} size={18} color="#6366F1" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#0F172A" }}>{title}</h3>
        </div>
        {action}
    </div>
);

const EditToggleButton = ({ editing, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-1.5"
        style={{ fontSize: 12.5, fontWeight: 700, color: editing ? "#DC2626" : "#6366F1", background: editing ? "#FEF2F2" : "#EEF2FF", padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer" }}>
        <Icon d={editing ? ICONS.x : ICONS.edit} size={13} color={editing ? "#DC2626" : "#6366F1"} />
        {editing ? "Cancel" : "Edit"}
    </button>
);

const InfoField = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F8FAFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            <Icon d={icon} size={15} color="#8B5CF6" />
        </div>
        <div>
            <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
            <p style={{ fontSize: 14, color: "#1E293B", fontWeight: 600, marginTop: 2 }}>{value || "—"}</p>
        </div>
    </div>
);

const inputCls = "themed-input";
const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 };

const PrimaryButton = ({ children, ...props }) => (
    <motion.button whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(99,102,241,0.35)" }} whileTap={{ scale: 0.98 }}
        style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, fontSize: 13, padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 6px 16px rgba(99,102,241,0.28)" }}
        {...props}>
        {children}
    </motion.button>
);

const GhostButton = ({ children, ...props }) => (
    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
        style={{ background: "#F1F5F9", color: "#475569", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer" }}
        {...props}>
        {children}
    </motion.button>
);

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const ProfilePage = () => {
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
    const { user, token } = useContext(Authcontext);

    const [userProfile, setUserProfile] = useState({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        profilePictureUrl: "",
        address: { street: "", city: "", state: "", pincode: "", country: "" },
    });

    useEffect(() => {
        if (token) {
            getProfileDataHandler();
        }
    }, [token]);

    const getProfileDataHandler = async () => {
        try {
            const response = await axios.get(`${server}/api/user/getProfile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log(response.data);
                const data = response.data.userData || {};
                
                setUserProfile({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    dob: data.dob || "",
                    gender: data.gender || "",
                    profilePictureUrl: data.profilePictureUrl || "",
                    address: {
                        street: data.address?.street || "",
                        city: data.address?.city || "",
                        state: data.address?.state || "",
                        pincode: data.address?.pincode || "",
                        country: data.address?.country || ""
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }


    const HandleEditProfile = async () => {
        try {
            const response = await axios.post(
                `${server}/api/user/editPersonalInfo`,
                {
                    fullname: userProfile.fullName,
                    phone: userProfile.phone,
                    dob: userProfile.dob,
                    gender: userProfile.gender
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                return true;
            }

            return false;

        } catch (error) {
            console.error("Error updating:", error);
            return false;
        }
    };

    const HandleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const HandleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({
            ...prev,
            address: {
                ...(prev.address || {}),
                [name]: value
            }
        }))
    }

    const HandleEditAddress = async () => {
        try {
            const response = await axios.post(`${server}/api/user/editUserAddress`, {
                street: userProfile.address?.street || "",
                city: userProfile.address?.city || "",
                state: userProfile.address?.state || "",
                pincode: userProfile.address?.pincode || "",
                country: userProfile.address?.country || ""
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error updating:', error);
        }
    }

    const [medicalRecords, setMedicalRecords] = useState([
        { id: "rec001", type: "General Checkup", date: "2023-05-10", doctor: "Dr. R. Verma", facility: "City Hospital", files: [{ name: "checkup_report_may23.pdf", url: "#" }], notes: "Annual physical, all clear." },
        { id: "rec002", type: "Visa Medical", date: "2023-01-20", doctor: "Dr. S. Khan", facility: "Visa Clinic Center", files: [{ name: "visa_medical_jan23.pdf", url: "#" }, { name: "vaccination_cert.pdf", url: "#" }], notes: "For UK student visa." },
    ]);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.08 * i, ease: "easeOut" } }),
    };

    const handleProfilePictureUpload = () => alert("Initiate profile picture upload (UI only)");

    const memberSince = "2022";

    const AddRecordModal = () => (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}
            onClick={() => setIsAddRecordModalOpen(false)}
        >
            <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 16 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                style={{ background: "white", borderRadius: 22, padding: "30px 32px", width: "100%", maxWidth: 520, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between" style={{ marginBottom: 22 }}>
                    <div className="flex items-center gap-3">
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon d={ICONS.doc} size={18} color="#6366F1" />
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#0F172A" }}>Add Medical Record</h2>
                    </div>
                    <button onClick={() => setIsAddRecordModalOpen(false)} style={{ background: "#F1F5F9", border: "none", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Icon d={ICONS.x} size={14} color="#64748B" />
                    </button>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Record Save (UI Only)"); setIsAddRecordModalOpen(false); }}>
                    <div>
                        <label style={labelStyle} htmlFor="recordType">Record Type</label>
                        <input className={inputCls} type="text" id="recordType" placeholder="e.g., Visa Medical, Annual Checkup" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label style={labelStyle} htmlFor="recordDate">Date of Record</label>
                            <input className={inputCls} type="date" id="recordDate" />
                        </div>
                        <div>
                            <label style={labelStyle} htmlFor="recordDoctor">Doctor / Specialist</label>
                            <input className={inputCls} type="text" id="recordDoctor" placeholder="Dr. John Doe" />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="recordFacility">Hospital / Clinic</label>
                        <input className={inputCls} type="text" id="recordFacility" placeholder="City General Hospital" />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="recordFiles">Upload Files (PDF, JPG)</label>
                        <label htmlFor="recordFiles" style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px dashed #C7D2FE", borderRadius: 14, padding: "16px 18px", cursor: "pointer", background: "#F8FAFF" }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon d={ICONS.upload} size={15} color="#6366F1" />
                            </div>
                            <span style={{ fontSize: 12.5, color: "#64748B" }}>Click to upload, or drag files here</span>
                        </label>
                        <input type="file" id="recordFiles" multiple style={{ display: "none" }} />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="recordNotes">Notes (Optional)</label>
                        <textarea className={inputCls} id="recordNotes" rows="3" placeholder="Any relevant notes..." style={{ resize: "vertical" }} />
                    </div>
                    <div className="flex justify-end gap-3" style={{ paddingTop: 8 }}>
                        <GhostButton type="button" onClick={() => setIsAddRecordModalOpen(false)}>Cancel</GhostButton>
                        <PrimaryButton type="submit">Save Record</PrimaryButton>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .themed-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #1E293B;
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .themed-input:focus {
          border-color: #8B5CF6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .themed-input[readonly] {
          background: #F1F5F9;
          color: #94A3B8;
          cursor: not-allowed;
        }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily: "'DM Sans', sans-serif" }}>

                {/* Blobs */}
                <div style={{ position: "fixed", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "fixed", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

                <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

                    {/* ── HERO / PROFILE HEADER ── */}
                    <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                        style={{ background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#A78BFA 100%)", borderRadius: 24, padding: "36px 40px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(99,102,241,0.35)" }}>

                        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -30, right: 120, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <Avatar imageUrl={userProfile.profilePictureUrl} altText={userProfile.fullName} onUploadClick={handleProfilePictureUpload} />
                            <div className="text-center sm:text-left" style={{ flex: 1 }}>
                                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                                    <Icon d={ICONS.sparkle} size={14} color="rgba(255,255,255,0.8)" />
                                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12.5, fontWeight: 600 }}>My Profile</p>
                                </div>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, color: "white", lineHeight: 1.15 }}>{userProfile.fullName}</h1>
                                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13.5, marginTop: 6 }}>{userProfile.email} · {userProfile.phone}</p>

                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-5">
                                    {[
                                        { label: "Member Since", value: memberSince, icon: ICONS.shield },
                                        { label: "Gender", value: userProfile.gender, icon: ICONS.gender },
                                    ].map((s, i) => (
                                        <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                                            <Icon d={s.icon} size={13} color="rgba(255,255,255,0.85)" />
                                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{s.label}:</span>
                                            <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── PERSONAL INFORMATION ── */}
                    <motion.section custom={0} initial="hidden" animate="visible" variants={fadeUp} style={cardStyle}>
                        {sectionHeader(ICONS.edit, "Personal Information", <EditToggleButton editing={isEditingPersonalInfo} onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)} />)}

                        <AnimatePresence mode="wait">
                            {isEditingPersonalInfo ? (
                                <motion.form
                                    key="edit"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={async (e) => {
                                        e.preventDefault();

                                        const success = await HandleEditProfile();

                                        if (success) {
                                            setIsEditingPersonalInfo(false);
                                        }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                                >
                                    <div>
                                        <label style={labelStyle} htmlFor="editFullName">
                                            Full Name
                                        </label>

                                        <input
                                            className={inputCls}
                                            type="text"
                                            name="fullName"
                                            id="editFullName"
                                            value={userProfile.fullName || ""}
                                            onChange={HandleProfileChange}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle} htmlFor="editEmail">
                                            Email (cannot change)
                                        </label>

                                        <input
                                            className={inputCls}
                                            type="email"
                                            name="email"
                                            id="editEmail"
                                            value={userProfile.email || ""}
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle} htmlFor="editPhoneNumber">
                                            Phone Number
                                        </label>

                                        <input
                                            className={inputCls}
                                            type="tel"
                                            name="phone"
                                            id="editPhoneNumber"
                                            value={userProfile.phone || ""}
                                            onChange={HandleProfileChange}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle} htmlFor="editDob">
                                            Date of Birth
                                        </label>

                                        <input
                                            className={inputCls}
                                            type="date"
                                            name="dob"
                                            id="editDob"
                                            value={userProfile.dob || ""}
                                            onChange={HandleProfileChange}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle} htmlFor="editGender">
                                            Gender
                                        </label>

                                        <select
                                            className={inputCls}
                                            name="gender"
                                            id="editGender"
                                            value={userProfile.gender || ""}
                                            onChange={HandleProfileChange}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">
                                                Prefer not to say
                                            </option>
                                        </select>
                                    </div>

                                    <div
                                        className="md:col-span-2 flex justify-end"
                                        style={{ paddingTop: 8 }}
                                    >
                                        <PrimaryButton type="submit">
                                            Save Changes
                                        </PrimaryButton>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <InfoField icon={ICONS.edit} label="Full Name" value={userProfile.fullName} />
                                    <InfoField icon={ICONS.mail} label="Email" value={userProfile.email} />
                                    <InfoField icon={ICONS.phone} label="Phone" value={userProfile.phone} />
                                    <InfoField icon={ICONS.cake} label="Date of Birth" value={userProfile.dob} />
                                    <InfoField icon={ICONS.gender} label="Gender" value={userProfile.gender} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>

                    {/* ── ADDRESS INFORMATION ── */}
                    <motion.section custom={1} initial="hidden" animate="visible" variants={fadeUp} style={cardStyle}>
                        {sectionHeader(ICONS.map, "Address Information", <EditToggleButton editing={isEditingAddress} onClick={() => setIsEditingAddress(!isEditingAddress)} />)}

                        <AnimatePresence mode="wait">
                            {isEditingAddress ? (
                                <motion.form key="edit" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                    onSubmit={(e) => { e.preventDefault(); alert("Address Save "); setIsEditingAddress(false); }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label style={labelStyle} htmlFor="editStreet">Street Address</label><input className={inputCls} type="text" name="street" id="editStreet" onChange={HandleAddressChange} value={userProfile.address?.street || ""} /></div>
                                    <div><label style={labelStyle} htmlFor="editCity">City</label><input className={inputCls} type="text" name="city" id="editCity" onChange={HandleAddressChange} value={userProfile.address?.city || ""} /></div>
                                    <div><label style={labelStyle} htmlFor="editState">State / Province</label><input className={inputCls} type="text" name="state" id="editState" onChange={HandleAddressChange} value={userProfile.address?.state || ""} /></div>
                                    <div><label style={labelStyle} htmlFor="editPincode">Pincode</label><input className={inputCls} type="text" name="pincode" id="editPincode" onChange={HandleAddressChange} value={userProfile.address?.pincode || ""} /></div>
                                    <div className="md:col-span-2 flex justify-end" style={{ paddingTop: 8 }}>
                                        <PrimaryButton type="submit" onClick={() => HandleEditAddress()} >Save Address</PrimaryButton>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <InfoField icon={ICONS.building} label="Street" value={userProfile.address?.street} />
                                    <InfoField icon={ICONS.map} label="City" value={userProfile.address?.city} />
                                    <InfoField icon={ICONS.map} label="State" value={userProfile.address?.state} />
                                    <InfoField icon={ICONS.map} label="Pincode" value={userProfile.address?.pincode} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>

                </div>
            </div>
        </>
    );
};

export default ProfilePage;