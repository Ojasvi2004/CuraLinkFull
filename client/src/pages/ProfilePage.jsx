import React, { useEffect, useState, useContext, useRef } from "react";
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
  edit:     ["M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5", "m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  camera:   ["M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z", "M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  mail:     ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "m22 6-10 7L2 6"],
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  cake:     ["M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8", "M4 16s.5-1 2-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2-1 2-1", "M12 2v4", "M9 7h6"],
  gender:   ["M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 15v7", "M9 19h6"],
  map:      ["M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z", "M8 2v16", "M16 6v16"],
  x:        "M18 6 6 18M6 6l12 12",
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  building: ["M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18", "M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1", "M2 22h20"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
};

// ─── ANIMATION PRIMITIVES ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
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
  const lines = (text || "").split("\n");
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
      marginBottom: 12,
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
      className={`profile-tilt-card ${className}`}
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

// ─── REFINED AVATAR ──────────────────────────────────────────────────────────
const Avatar = ({ imageUrl, altText, onUploadClick }) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    <div
      style={{
        width: 104,
        height: 104,
        borderRadius: "50%",
        overflow: "hidden",
        border: `3px solid ${T.white}`,
        boxShadow: "0 10px 30px rgba(12,10,9,0.08)",
        background: ORBS.violet,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText || "User Avatar"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: 32, fontWeight: 300, color: "white" }}>
          {altText ? altText.charAt(0).toUpperCase() : "U"}
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={onUploadClick}
      aria-label="Change profile picture"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: T.white,
        border: `1px solid ${T.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(12,10,9,0.08)",
      }}
    >
      <Icon d={ICONS.camera} size={14} color={T.ink} />
    </button>
  </div>
);

// ─── ARCHITECTURAL INFO FIELD ────────────────────────────────────────────────
const InfoField = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        background: T.white,
        border: `1px solid ${T.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon d={icon} size={16} color={T.ink} />
    </div>

    <div>
      <p style={{ fontSize: 11.5, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ fontSize: 14.5, color: T.ink, fontWeight: 400, marginTop: 2 }}>
        {value || "—"}
      </p>
    </div>
  </div>
);

// ─── MAIN PROFILE COMPONENT ──────────────────────────────────────────────────
const ProfilePage = () => {
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
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

  useEffect(() => {
    if (token) {
      getProfileDataHandler();
    }
  }, [token]);

  const getProfileDataHandler = async () => {
    try {
      const response = await axios.get(`${server}/api/user/getProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
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
            country: data.address?.country || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const HandleEditProfile = async () => {
    try {
      const response = await axios.post(
        `${server}/api/user/editPersonalInfo`,
        {
          fullname: userProfile.fullName,
          phone: userProfile.phone,
          dob: userProfile.dob,
          gender: userProfile.gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      [name]: value,
    }));
  };

  const HandleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        [name]: value,
      },
    }));
  };

  const HandleEditAddress = async () => {
    try {
      await axios.post(
        `${server}/api/user/editUserAddress`,
        {
          street: userProfile.address?.street || "",
          city: userProfile.address?.city || "",
          state: userProfile.address?.state || "",
          pincode: userProfile.address?.pincode || "",
          country: userProfile.address?.country || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleProfilePictureUpload = () => alert("Initiate profile picture upload (UI only)");
  const memberSince = "2022";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .profile-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: clip;
        }

        .profile-tilt-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border: 1px solid ${T.line};
          border-radius: 28px;
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .profile-tilt-card::before {
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
        .profile-tilt-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 20px 48px rgba(12,10,9,0.06);
        }
        .profile-tilt-card:hover::before {
          opacity: 1;
        }

        .profile-input {
          width: 100%;
          background: ${T.white};
          border: 1px solid ${T.line};
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: ${T.ink};
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-input:focus {
          border-color: ${T.ink};
        }
        .profile-input[readonly] {
          background: ${T.surface2};
          color: ${T.muted};
          cursor: not-allowed;
        }

        .btn-ink {
          padding: 10px 22px;
          border-radius: 999px;
          background: ${T.ink};
          color: white;
          font-size: 13.5px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: box-shadow 0.25s, transform 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-ink:hover {
          box-shadow: 0 8px 24px rgba(12,10,9,0.2);
          transform: translateY(-1px);
        }

        .btn-toggle-edit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <ScrollProgress />

      <div
        ref={containerRef}
        className="profile-root"
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

        <div style={{ maxWidth: 940, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>

          {/* ──────────────── 1. EDITORIAL PROFILE HERO CONSOLE ──────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{ marginBottom: 36 }}
          >
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.line}`,
                borderRadius: 32,
                padding: "clamp(30px, 4.5vw, 44px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Internal subtle ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: ORBS.violet,
                  opacity: 0.4,
                  filter: "blur(50px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", position: "relative", zIndex: 1 }}>
                
                {/* Avatar with Camera Update Trigger */}
                <Avatar
                  imageUrl={userProfile.profilePictureUrl}
                  altText={userProfile.fullName}
                  onUploadClick={handleProfilePictureUpload}
                />

                {/* Main Information */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  <Pill>Verified Health Passport</Pill>

                  <WordReveal
                    as="h1"
                    text={userProfile.fullName || "User Profile"}
                    style={{
                      fontSize: "clamp(26px, 4vw, 40px)",
                      fontWeight: 300,
                      color: T.ink,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.15,
                      marginBottom: 8,
                    }}
                  />

                  <p style={{ fontSize: 14, color: T.body, lineHeight: 1.6 }}>
                    {userProfile.email} {userProfile.phone ? `· ${userProfile.phone}` : ""}
                  </p>

                  {/* Metadata capsules */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                    <div
                      style={{
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        borderRadius: 20,
                        padding: "5px 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon d={ICONS.shield} size={12} color={T.ink} />
                      <span style={{ fontSize: 12, color: T.muted }}>Member Since:</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>{memberSince}</span>
                    </div>

                    <div
                      style={{
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        borderRadius: 20,
                        padding: "5px 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon d={ICONS.gender} size={12} color={T.ink} />
                      <span style={{ fontSize: 12, color: T.muted }}>Gender:</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>
                        {userProfile.gender || "Unspecified"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* ──────────────── 2. PERSONAL INFORMATION CARD ──────────────── */}
          <TiltCard style={{ padding: "30px 32px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon d={ICONS.edit} size={16} color={T.ink} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                  Personal Information
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
                className="btn-toggle-edit"
                style={{
                  border: `1px solid ${isEditingPersonalInfo ? "#FECACA" : T.line}`,
                  background: isEditingPersonalInfo ? "#FEF2F2" : T.white,
                  color: isEditingPersonalInfo ? "#DC2626" : T.ink,
                }}
              >
                <Icon d={isEditingPersonalInfo ? ICONS.x : ICONS.edit} size={12} color={isEditingPersonalInfo ? "#DC2626" : T.ink} />
                {isEditingPersonalInfo ? "Cancel" : "Edit Profile"}
              </button>
            </div>

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
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Full Name
                    </label>
                    <input
                      className="profile-input"
                      type="text"
                      name="fullName"
                      value={userProfile.fullName || ""}
                      onChange={HandleProfileChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Email Address (Locked)
                    </label>
                    <input
                      className="profile-input"
                      type="email"
                      name="email"
                      value={userProfile.email || ""}
                      readOnly
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Phone Number
                    </label>
                    <input
                      className="profile-input"
                      type="tel"
                      name="phone"
                      value={userProfile.phone || ""}
                      onChange={HandleProfileChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Date of Birth
                    </label>
                    <input
                      className="profile-input"
                      type="date"
                      name="dob"
                      value={userProfile.dob || ""}
                      onChange={HandleProfileChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Gender Designation
                    </label>
                    <select
                      className="profile-input"
                      name="gender"
                      value={userProfile.gender || ""}
                      onChange={HandleProfileChange}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", paddingTop: 10 }}>
                    <Magnetic>
                      <button type="submit" className="btn-ink">
                        Save Personal Info
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px 28px" }}
                >
                  <InfoField icon={ICONS.edit}   label="Full Name"     value={userProfile.fullName} />
                  <InfoField icon={ICONS.mail}   label="Email Address" value={userProfile.email} />
                  <InfoField icon={ICONS.phone}  label="Phone Number"  value={userProfile.phone} />
                  <InfoField icon={ICONS.cake}   label="Date of Birth" value={userProfile.dob} />
                  <InfoField icon={ICONS.gender} label="Gender"        value={userProfile.gender} />
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>

          {/* ──────────────── 3. ADDRESS INFORMATION CARD ──────────────── */}
          <TiltCard style={{ padding: "30px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon d={ICONS.map} size={16} color={T.ink} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.015em" }}>
                  Residential Address
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="btn-toggle-edit"
                style={{
                  border: `1px solid ${isEditingAddress ? "#FECACA" : T.line}`,
                  background: isEditingAddress ? "#FEF2F2" : T.white,
                  color: isEditingAddress ? "#DC2626" : T.ink,
                }}
              >
                <Icon d={isEditingAddress ? ICONS.x : ICONS.edit} size={12} color={isEditingAddress ? "#DC2626" : T.ink} />
                {isEditingAddress ? "Cancel" : "Edit Address"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isEditingAddress ? (
                <motion.form
                  key="edit-address"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await HandleEditAddress();
                    setIsEditingAddress(false);
                  }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Street Address
                    </label>
                    <input
                      className="profile-input"
                      type="text"
                      name="street"
                      value={userProfile.address?.street || ""}
                      onChange={HandleAddressChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      City
                    </label>
                    <input
                      className="profile-input"
                      type="text"
                      name="city"
                      value={userProfile.address?.city || ""}
                      onChange={HandleAddressChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      State / Province
                    </label>
                    <input
                      className="profile-input"
                      type="text"
                      name="state"
                      value={userProfile.address?.state || ""}
                      onChange={HandleAddressChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                      Pincode / Postal Code
                    </label>
                    <input
                      className="profile-input"
                      type="text"
                      name="pincode"
                      value={userProfile.address?.pincode || ""}
                      onChange={HandleAddressChange}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", paddingTop: 10 }}>
                    <Magnetic>
                      <button type="submit" className="btn-ink">
                        Save Address
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view-address"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px 28px" }}
                >
                  <InfoField icon={ICONS.building} label="Street Address" value={userProfile.address?.street} />
                  <InfoField icon={ICONS.map}      label="City"           value={userProfile.address?.city} />
                  <InfoField icon={ICONS.map}      label="State / Region" value={userProfile.address?.state} />
                  <InfoField icon={ICONS.map}      label="Pincode"        value={userProfile.address?.pincode} />
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;