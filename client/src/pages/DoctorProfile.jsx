import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // To get doctorId from URL
import { motion } from "framer-motion";
import axios from "axios";

// --- Example Icons (Replace with actual icons) ---
const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-slate-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m6 0H8m6 0H8m6 0H8M10 6h4M10 10h4m-4 4h4m5-10v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 001.414 0l1.414-1.414A1 1 0 0113.414 4H16z"
    ></path>
  </svg>
);
const AcademicCapIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l9-5-9-5-9 5 9 5z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
    ></path>
  </svg>
);
const LocationMarkerIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);
const VideoCameraIcon = () => (
  <svg
    className="w-5 h-5 mr-1.5 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h10M4 10h10M4 14h10M4 18h10"
    ></path>
  </svg>
);

// const DoctorDetails = {
//   id: 1,
//   name: "Dr. Ananya Sharma",
//   specialty: "Cardiology",
//   profilePic: "https://via.placeholder.com/150/A78BFA/FFFFFF?text=AS",
//   bio: "Dr. Ananya Sharma is a renowned cardiologist with over 12 years of experience specializing in interventional cardiology and preventative heart care. She is committed to providing patient-centered care with the latest medical advancements.",
//   qualifications: [
//     "MBBS, King's College London",
//     "MD, Cardiology, AIIMS Delhi",
//     "Fellowship in Interventional Cardiology, USA",
//   ],
//   experienceYears: 12,
//   languages: ["English", "Hindi", "Marathi"],
//   rating: 4.8,
//   totalReviews: 185,
//   clinics: [
//     {
//       id: "clinic1",
//       name: "MedHeart Clinic, Andheri West",
//       address: "123 Cardiac Road, Andheri (W), Mumbai",
//       timings: "Mon-Fri: 10 AM - 1 PM, Sat: 10 AM - 12 PM",
//       type: "PHYSICAL",
//     },
//     {
//       id: "clinic2",
//       name: "CuraLink Telehealth Platform",
//       address: "Online Video Consultation",
//       timings: "Mon, Wed, Fri: 3 PM - 5 PM",
//       type: "DIGITAL",
//     },
//   ],
//   services: [
//     "ECG",
//     "Echocardiogram",
//     "Angioplasty Consultation",
//     "Preventive Cardiology",
//     "Hypertension Management",
//   ],
// };

// Mock Availability Slots - Fetch this based on doctorId and selected date
// const mockAvailability = {
//   "2023-10-26": [
//     // YYYY-MM-DD
//     {
//       time: "10:00 AM",
//       type: "PHYSICAL",
//       clinicId: "clinic1",
//       available: true,
//     },
//     {
//       time: "10:30 AM",
//       type: "PHYSICAL",
//       clinicId: "clinic1",
//       available: false,
//     },
//     {
//       time: "11:00 AM",
//       type: "PHYSICAL",
//       clinicId: "clinic1",
//       available: true,
//     },
//     { time: "03:00 PM", type: "DIGITAL", clinicId: "clinic2", available: true },
//     { time: "03:30 PM", type: "DIGITAL", clinicId: "clinic2", available: true },
//   ],
//   "2023-10-27": [
//     {
//       time: "10:00 AM",
//       type: "PHYSICAL",
//       clinicId: "clinic1",
//       available: true,
//     },
//     // ... more slots
//   ],
// };



const DoctorProfile = () => {
  const [DoctorDetails, setDoctorDetails] = useState({});
  const { doctorId } = useParams();

  const GetDoctorDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/getDoctorProfile/${doctorId}`
      );

      if (response.data.success) {
        setDoctor(response.data.doctorProfile);
        console.log("Successfull fetch", response.data);
      }
    } catch (error) {
      console.log("Error occurred fetching data", error);
    }
  };

  useEffect(() => {
    GetDoctorDetails();
  },[doctorId]);
  const [doctor, setDoctor] = useState(DoctorDetails);

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [availability, setAvailability] = useState(
    // mockAvailability[selectedDate] || []
    []
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching availability for the selected date
    // setAvailability(mockAvailability[selectedDate] || []);
    setAvailability([]);
    setSelectedSlot(null);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      alert("Please select an available time slot.");
      return;
    }
    setIsLoading(true);

    console.log(
      "Booking appointment for:",
      doctor.name,
      "on",
      selectedDate,
      "at",
      selectedSlot.time,
      "Type:",
      selectedSlot.type
    );
    setTimeout(() => {
      setIsLoading(false);
      alert(
        `Appointment booked with ${doctor.name} for ${selectedSlot.time} on ${selectedDate}! (UI Demo)`
      );
      // navigate('/my-appointments'); // Optionally navigate to appointments page
      setSelectedSlot(null);
    }, 1500);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  const sectionVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "circOut",
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  if (!doctor)
    return <div className="text-center p-10">Loading doctor details...</div>; // Or a proper loader

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Doctor Header Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-xl mb-8 sm:mb-10"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <motion.img
              src={doctor.ProfilePicture}
              alt={doctor.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { delay: 0.1, duration: 0.5 },
              }}
            />
            <div className="text-center md:text-left flex-1">
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl font-bold text-slate-800"
              >
                {doctor.FullName}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-blue-600 font-semibold mt-1"
              >
                {doctor.Speciality}
              </motion.p>
              {/* <motion.div
                variants={itemVariants}
                className="flex items-center justify-center md:justify-start mt-2"
              >
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < Math.floor(doctor.rating)} />
                ))}
                <span className="ml-2 text-sm text-slate-600">
                  ({doctor.rating.toFixed(1)} - {doctor.totalReviews} reviews)
                </span>
              </motion.div> */}
              <motion.p
                variants={itemVariants}
                className="text-sm text-slate-500 mt-2"
              >
                <BriefcaseIcon /> {doctor.Experience} years of experience
              </motion.p>
              {/* <motion.div
                variants={itemVariants}
                className="mt-3 text-sm text-slate-500"
              >
                Speaks: {doctor.languages.join(", ")}
              </motion.div> */}
            </div>
            <motion.div
              variants={itemVariants}
              className="md:ml-auto flex flex-col items-center md:items-end gap-2 mt-4 md:mt-0"
            >
              <Link
                to={`/start-chat/${doctor._id}`} 
                className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 px-6 rounded-lg text-sm text-center transition-colors"
              >
                Chat with Doctor (Digital)
              </Link>
              <p className="text-xs text-slate-400">
                Teleconsultation fee: ₹{doctor.DigitalConsultationFees || "N/A"}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content - About, Clinics, Services, Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: About, Qualifications, Services */}
          <motion.div
            variants={sectionVariants}
            className="lg:col-span-2 space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b pb-2">
                About Dr. {doctor.FullName}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {doctor.Bio}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b pb-2">
                Qualifications
              </h2>
              <ul className="list-none space-y-2 text-sm text-slate-600">
                {doctor.Qualifications?.split(",").map((q, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <AcademicCapIcon className="w-4 h-4 text-blue-500" />
                    <span>{q.trim()}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">
                Services Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.ServicesOffered?.split(",").map((service, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b pb-2">
                Clinics & Timings
              </h2>
              {/* {doctor.clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="mb-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <h4 className="font-semibold text-slate-700">
                    {clinic.name}
                  </h4>
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <LocationMarkerIcon /> {clinic.address}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Timings: {clinic.timings}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Type:
                    <span
                      className={`ml-1 font-medium ${
                        clinic.type === "DIGITAL"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {clinic.type.charAt(0).toUpperCase() +
                        clinic.type.slice(1).toLowerCase()}
                    </span>
                  </p>
                </div>
              ))} */}
            </motion.div>
          </motion.div>

          {/* Right Column: Appointment Booking */}
          <motion.div variants={sectionVariants} className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-xl sticky top-24">
              {" "}
              {/* Sticky for booking panel */}
              <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
                Book Appointment
              </h2>
              <div>
                <label
                  htmlFor="appointmentDate"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                  onChange={handleDateChange}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                />
              </div>
              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-700 mb-3">
                  Available Slots for{" "}
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                  :
                </h4>
                {availability.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                    {availability.map((slot, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={!slot.available || isLoading}
                        className={`p-2.5 border rounded-md text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
                                          ${
                                            selectedSlot === slot
                                              ? "bg-blue-600 text-white ring-blue-500"
                                              : ""
                                          }
                                          ${
                                            !slot.available
                                              ? "bg-slate-200 text-slate-400 cursor-not-allowed line-through"
                                              : "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-500 focus:ring-blue-500"
                                          }
                                        `}
                        whileHover={slot.available ? { scale: 1.05 } : {}}
                        whileTap={slot.available ? { scale: 0.95 } : {}}
                      >
                        {slot.time}
                        <span className="block text-[10px] opacity-70">
                          {slot.type}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No slots available for this date. Please select another
                    date.
                  </p>
                )}
              </div>
              {selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-3 bg-indigo-50 rounded-md border border-indigo-200 text-center"
                >
                  <p className="text-sm font-medium text-indigo-700">
                    Selected: {selectedSlot.time} ({selectedSlot.type})
                  </p>
                  <p className="text-xs text-indigo-500">
                    Clinic:{" "}
                    {doctor.clinics.find((c) => c.id === selectedSlot.clinicId)
                      ?.name || "N/A"}
                  </p>
                </motion.div>
              )}
              <motion.button
                onClick={handleBookAppointment}
                disabled={!selectedSlot || isLoading}
                className={`w-full mt-8 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-base
                                ${
                                  !selectedSlot || isLoading
                                    ? "bg-slate-400 cursor-not-allowed text-slate-700"
                                    : "bg-green-500 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                }`}
                whileHover={
                  selectedSlot && !isLoading
                    ? { y: -2, boxShadow: "0 8px 15px rgba(34,197,94,0.3)" }
                    : {}
                } // Tailwind green-500
                whileTap={selectedSlot && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Booking...
                  </div>
                ) : (
                  "Book Now"
                )}
              </motion.button>
              <p className="text-xs text-slate-400 mt-3 text-center">
                You will be able to confirm details on the next step.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorProfile;
