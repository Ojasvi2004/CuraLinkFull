import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  pin:       ["M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z","M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  brief:     ["M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m8 0H8m8 0H8"],
  cap:       ["M12 14l9-5-9-5-9 5 9 5z","M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 1 12 20.055a11.952 11.952 0 0 1-6.824-5.998 12.078 12.078 0 0 1 .665-6.479L12 14z"],
  video:     ["M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"],
  clock:     ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 6v6l4 2"],
  check:     "m9 11 3 3L22 4",
  calendar:  ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chat:      ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  arrow:     "M5 12h14M12 5l7 7-7 7",
  stethoscope:["M4.5 11a7.5 7.5 0 0 0 15 0V5.5","M19.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z","M12 18.5v3M9 21.5h6"],
  verified:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z","m9 12 2 2 4-4"],
  tag:       "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  lang:      ["M5 8l6 6","M4 14l6-6 2-3","M2 5h12","M7 2h1","M22 22l-5-10-5 10","M14 18h6"],
  rupee:     ["M6 3h12","M6 8h12","M6 13l8.5 8","M6 13h3a4 4 0 0 0 0-8"],
};

// ─── SPECIALTY COLORS ──────────────────────────────────────────────────────────
const SPEC_COLORS = {
  Cardiology:{ color:"#DC2626",bg:"#FEF2F2",gradient:"linear-gradient(135deg,#DC2626,#EF4444)" },
  Dermatology:{ color:"#EC4899",bg:"#FDF2F8",gradient:"linear-gradient(135deg,#EC4899,#F472B6)" },
  Pediatrics:{ color:"#D97706",bg:"#FFFBEB",gradient:"linear-gradient(135deg,#D97706,#FBBF24)" },
  Orthopedics:{ color:"#2563EB",bg:"#EFF6FF",gradient:"linear-gradient(135deg,#2563EB,#60A5FA)" },
  Neurology:{ color:"#7C3AED",bg:"#F5F3FF",gradient:"linear-gradient(135deg,#7C3AED,#A78BFA)" },
  default:{ color:"#6366F1",bg:"#EEF2FF",gradient:"linear-gradient(135deg,#6366F1,#8B5CF6)" },
};
const getSpec = (s) => SPEC_COLORS[s] || SPEC_COLORS.default;

// ─── STARS ─────────────────────────────────────────────────────────────────────
const Stars = ({ rating = 0 }) => (
  <div style={{ display:"flex", gap:3 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={16} height={16} viewBox="0 0 20 20"
        fill={i <= Math.round(rating) ? "#F59E0B" : "#E2E8F0"}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

// ─── SUCCESS TOAST ─────────────────────────────────────────────────────────────
const Toast = ({ msg, onClose }) => (
  <motion.div initial={{ opacity:0, y:30, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }}
    exit={{ opacity:0, y:20 }}
    style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#16A34A,#22C55E)", color:"white", borderRadius:16, padding:"14px 24px", display:"flex", alignItems:"center", gap:10, zIndex:100, boxShadow:"0 8px 32px rgba(22,163,74,0.35)", whiteSpace:"nowrap" }}>
    <Icon d={ICONS.check} size={18} color="white" />
    <span style={{ fontSize:14, fontWeight:700 }}>{msg}</span>
  </motion.div>
);

// ─── MAIN ──────────────────────────────────────────────────────────────────────
const DoctorProfile = () => {
  const { doctorId } = useParams();
  const { token } = useContext(Authcontext);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [imgErr, setImgErr] = useState(false);

  // ── Fetch doctor ──
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/user/getDoctorProfile/${doctorId}`);
        if (res.data.success) setDoctor(res.data.doctorProfile);
      } catch (e) { console.error(e); }
      finally { setPageLoading(false); }
    };
    fetch();
  }, [doctorId]);

  // ── Fetch slots ──
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/user/getSlotsOfDoctor",
          { doctorId, date: selectedDate },
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setAvailability(res.data.AllSlots);
      } catch (e) { console.error(e); }
    };
    setSelectedSlot(null);
    fetch();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/user/bookSlot",
        { id: selectedSlot._id },
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (res.data.message === "Selected sot is already booked") {
        setToast("This slot was just booked. Please pick another.");
        setTimeout(() => setToast(""), 3000);
      } else {
        setToast(`Appointment confirmed for ${selectedSlot.Time.Start} on ${selectedDate}!`);
        setTimeout(() => setToast(""), 4000);
        setSelectedSlot(null);
        const r = await axios.post("http://localhost:8000/api/user/getSlotsOfDoctor",
          { doctorId, date: selectedDate },
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (r.data.success) setAvailability(r.data.AllSlots);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  if (pageLoading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(145deg,#F0F4FF,#EFF6FF)", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48, height:48, borderRadius:"50%", border:"3px solid #EEF2FF", borderTop:"3px solid #6366F1", animation:"spin 0.9s linear infinite", margin:"0 auto 16px" }} />
        <p style={{ color:"#94A3B8", fontSize:14 }}>Loading doctor profile…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!doctor) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"#94A3B8" }}>Doctor not found.</p>
    </div>
  );

  const sc = getSpec(doctor.Speciality);
  const quals = doctor.Qualifications?.split(",").map(q => q.trim()).filter(Boolean) || [];
  const services = doctor.ServicesOffered?.split(",").map(s => s.trim()).filter(Boolean) || [];
  const initials = (doctor.FullName || "D").split(" ").filter(Boolean).slice(0,2).map(n=>n[0]).join("").toUpperCase();

  const availableCount = availability.filter(s => !s.isBooked).length;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#F0F4FF 0%,#F8F6FF 40%,#EFF6FF 100%)", fontFamily:"'DM Sans',sans-serif" }}>
        {/* Blobs */}
        <div style={{ position:"fixed", top:-80, right:-80, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px 80px", position:"relative", zIndex:1 }}>

          {/* ── HERO CARD ── */}
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            style={{ background:"white", borderRadius:24, overflow:"hidden", marginBottom:28, border:"1px solid #EEF2FF", boxShadow:"0 4px 24px rgba(99,102,241,0.09)" }}>

            {/* Gradient banner */}
            <div style={{ height:110, background:sc.gradient, position:"relative" }}>
              <div style={{ position:"absolute", bottom:-52, left:32, width:104, height:104, borderRadius:24, border:"4px solid white", overflow:"hidden", boxShadow:"0 8px 28px rgba(0,0,0,0.15)", background:sc.bg }}>
                {doctor.ProfilePicture && !imgErr ? (
                  <img src={doctor.ProfilePicture} alt={doctor.FullName} onError={() => setImgErr(true)}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : (
                  <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:sc.color }}>{initials}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding:"64px 32px 28px" }} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span style={{ background:sc.bg, color:sc.color, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:"0.07em", textTransform:"uppercase" }}>{doctor.Speciality}</span>
                  <span style={{ background:"#F0FDF4", color:"#16A34A", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}>
                    <Icon d={ICONS.verified} size={10} color="#16A34A" /> Verified
                  </span>
                </div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:"#0F172A", lineHeight:1.15, marginBottom:4 }}>{doctor.FullName}</h1>
                {doctor.rating && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <Stars rating={doctor.rating} />
                    <span style={{ fontSize:13, color:"#64748B", fontWeight:600 }}>{Number(doctor.rating).toFixed(1)}{doctor.totalReviews ? ` · ${doctor.totalReviews} reviews` : ""}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 mt-2">
                  {doctor.Experience && (
                    <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#475569" }}>
                      <Icon d={ICONS.brief} size={14} color="#94A3B8" /> {doctor.Experience} yrs experience
                    </span>
                  )}
                  {doctor.ClinicDetails?.city && (
                    <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#475569" }}>
                      <Icon d={ICONS.pin} size={14} color="#94A3B8" /> {doctor.ClinicDetails.city}{doctor.ClinicDetails.state ? `, ${doctor.ClinicDetails.state}` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end", flexShrink:0 }}>
                {/* <Link to={`/start-chat/${doctor._id}`}
                  style={{ display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:700, fontSize:13, padding:"12px 22px", borderRadius:14, textDecoration:"none", boxShadow:"0 6px 20px rgba(99,102,241,0.32)", whiteSpace:"nowrap" }}>
                  <Icon d={ICONS.video} size={16} color="white" /> Chat with Doctor
                </Link> */}
                {doctor.DigitalConsultationFees && (
                  <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", background:"#F8FAFF", borderRadius:10, padding:"6px 12px", border:"1px solid #EEF2FF" }}>
                    <Icon d={ICONS.rupee} size={13} color="#94A3B8" />
                    Teleconsultation fee: <strong style={{ color:"#1E293B" }}>₹{doctor.DigitalConsultationFees}</strong>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── TWO COLUMN ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT — info panels */}
            <div className="lg:col-span-2 space-y-5">

              {/* Bio */}
              {doctor.Bio && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                  style={{ background:"white", borderRadius:20, padding:"24px 28px", border:"1px solid #EEF2FF", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ width:36, height:36, borderRadius:11, background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon d={ICONS.stethoscope} size={17} color="#6366F1" />
                    </div>
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#0F172A" }}>About</h2>
                  </div>
                  <p style={{ fontSize:14, color:"#475569", lineHeight:1.75 }}>{doctor.Bio}</p>
                </motion.div>
              )}

              {/* Qualifications */}
              {quals.length > 0 && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                  style={{ background:"white", borderRadius:20, padding:"24px 28px", border:"1px solid #EEF2FF", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ width:36, height:36, borderRadius:11, background:"#ECFDF5", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon d={ICONS.cap} size={17} color="#059669" />
                    </div>
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#0F172A" }}>Qualifications</h2>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {quals.map((q, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#F8FAFF", borderRadius:12, border:"1px solid #EEF2FF" }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:"#6366F1", flexShrink:0 }} />
                        <span style={{ fontSize:13, color:"#334155", fontWeight:500 }}>{q}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                  style={{ background:"white", borderRadius:20, padding:"24px 28px", border:"1px solid #EEF2FF", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ width:36, height:36, borderRadius:11, background:"#FDF2F8", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon d={ICONS.tag} size={17} color="#DB2777" />
                    </div>
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#0F172A" }}>Services Offered</h2>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {services.map((s, i) => (
                      <span key={i} style={{ background:"#EEF2FF", color:"#4338CA", fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:20, border:"1px solid #C7D2FE" }}>{s}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Languages */}
              {doctor.Languages && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }}
                  style={{ background:"white", borderRadius:20, padding:"20px 28px", border:"1px solid #EEF2FF", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:11, background:"#F5F3FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon d={ICONS.lang} size={17} color="#7C3AED" />
                  </div>
                  <div>
                    <p style={{ fontSize:11, color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Languages</p>
                    <p style={{ fontSize:14, color:"#1E293B", fontWeight:600, marginTop:2 }}>{doctor.Languages}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT — booking panel */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18, type:"spring", stiffness:200, damping:22 }}
              className="lg:col-span-1">
              <div style={{ position:"sticky", top:24, background:"white", borderRadius:22, border:"1px solid #EEF2FF", boxShadow:"0 8px 32px rgba(99,102,241,0.1)", overflow:"hidden" }}>

                {/* Panel header */}
                <div style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", padding:"20px 24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Icon d={ICONS.calendar} size={20} color="white" />
                    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"white" }}>Book Appointment</h2>
                  </div>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:4 }}>Select a date and available slot</p>
                </div>

                <div style={{ padding:"22px 22px 24px" }}>
                  {/* Date picker */}
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:11, color:"#64748B", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:8 }}>Date</label>
                    <input type="date" value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setSelectedDate(e.target.value)}
                      style={{ width:"100%", background:"#F8FAFF", border:"1.5px solid #E2E8F0", borderRadius:12, padding:"11px 14px", fontSize:13, color:"#1E293B", outline:"none" }} />
                  </div>

                  {/* Slot label */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                    <label style={{ fontSize:11, color:"#64748B", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Available Slots</label>
                    {availability.length > 0 && (
                      <span style={{ fontSize:11, color:"#16A34A", fontWeight:700, background:"#F0FDF4", padding:"2px 8px", borderRadius:20 }}>{availableCount} open</span>
                    )}
                  </div>

                  {/* Slots grid */}
                  {availability.length > 0 ? (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:220, overflowY:"auto", paddingRight:2 }}>
                      {availability.map((slot, i) => {
                        const isSelected = selectedSlot?._id === slot._id;
                        const isDigital = slot.type === "DIGITAL";
                        return (
                          <motion.button key={i} onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                            whileHover={!slot.isBooked ? { scale:1.03 } : {}}
                            whileTap={!slot.isBooked ? { scale:0.97 } : {}}
                            style={{
                              padding:"10px 8px", borderRadius:12, border:`1.5px solid ${isSelected ? "#6366F1" : slot.isBooked ? "#F1F5F9" : "#E2E8F0"}`,
                              background: isSelected ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : slot.isBooked ? "#F8FAFF" : "white",
                              cursor: slot.isBooked ? "not-allowed" : "pointer",
                              textAlign:"center", transition:"all 0.15s",
                              boxShadow: isSelected ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                              opacity: slot.isBooked ? 0.5 : 1,
                            }}>
                            <p style={{ fontSize:12, fontWeight:700, color: isSelected ? "white" : slot.isBooked ? "#CBD5E1" : "#1E293B", textDecoration: slot.isBooked ? "line-through" : "none" }}>
                              {slot.Time.Start}
                            </p>
                            <p style={{ fontSize:10, marginTop:2, color: isSelected ? "rgba(255,255,255,0.8)" : isDigital ? "#6366F1" : "#16A34A", fontWeight:600 }}>
                              {isDigital ? "Online" : "In-Person"}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign:"center", padding:"28px 16px", background:"#F8FAFF", borderRadius:14, border:"1px dashed #E2E8F0" }}>
                      <Icon d={ICONS.clock} size={28} color="#CBD5E1" style={{ margin:"0 auto 8px" }} />
                      <p style={{ fontSize:13, color:"#94A3B8" }}>No slots for this date.<br/>Try another day.</p>
                    </div>
                  )}

                  {/* Selected preview */}
                  <AnimatePresence>
                    {selectedSlot && (
                      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                        style={{ marginTop:14, background:"#F0F0FF", borderRadius:14, padding:"12px 14px", border:"1px solid #C7D2FE", display:"flex", alignItems:"center", gap:10 }}>
                        <Icon d={ICONS.check} size={16} color="#6366F1" />
                        <div>
                          <p style={{ fontSize:12, fontWeight:700, color:"#4338CA" }}>Selected: {selectedSlot.Time.Start} – {selectedSlot.Time.End}</p>
                          <p style={{ fontSize:11, color:"#6366F1", marginTop:1 }}>{selectedSlot.type === "DIGITAL" ? "Online Video Consultation" : "In-Person Visit"}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Book button */}
                  <motion.button onClick={handleBook} disabled={!selectedSlot || isLoading}
                    whileHover={selectedSlot && !isLoading ? { scale:1.02, boxShadow:"0 8px 24px rgba(99,102,241,0.35)" } : {}}
                    whileTap={selectedSlot && !isLoading ? { scale:0.98 } : {}}
                    style={{ width:"100%", marginTop:16, padding:"14px", borderRadius:14, border:"none", background: selectedSlot && !isLoading ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "#F1F5F9", color: selectedSlot && !isLoading ? "white" : "#CBD5E1", fontWeight:700, fontSize:14, cursor: selectedSlot && !isLoading ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s", boxShadow: selectedSlot ? "0 4px 16px rgba(99,102,241,0.3)" : "none" }}>
                    {isLoading ? (
                      <><div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", animation:"spin 0.8s linear infinite" }} /> Confirming…</>
                    ) : (
                      <><Icon d={ICONS.calendar} size={16} color={selectedSlot ? "white" : "#CBD5E1"} /> Confirm Booking</>
                    )}
                  </motion.button>
                  <p style={{ textAlign:"center", fontSize:11, color:"#94A3B8", marginTop:10 }}>Free cancellation up to 2 hours before</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast msg={toast} onClose={() => setToast("")} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DoctorProfile;