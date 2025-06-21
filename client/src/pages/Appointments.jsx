import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Placeholder Icons
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
const LocationMarkerIcon = () => (
  <svg
    className="w-5 h-5 mr-1.5 text-green-500"
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
const ClockIcon = () => (
  <svg
    className="w-5 h-5 mr-1.5 text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

// Mock Appointments Data
const mockAppointments = {
  upcoming: [
    {
      id: "apt001",
      doctorName: "Dr. Ananya Sharma",
      specialty: "Cardiology",
      type: "DIGITAL",
      date: "2023-08-15",
      time: "10:30 AM",
      status: "Scheduled",
      clinicName: "CuraLink Telehealth",
    },
    {
      id: "apt002",
      doctorName: "Dr. Vikram Singh",
      specialty: "Pediatrics",
      type: "PHYSICAL",
      date: "2023-08-18",
      time: "02:00 PM",
      status: "Scheduled",
      clinicName: "TinyCare Hospital, Delhi",
    },
  ],
  past: [
    {
      id: "apt003",
      doctorName: "Dr. Priya Reddy",
      specialty: "Dermatology",
      type: "DIGITAL",
      date: "2023-07-20",
      time: "11:00 AM",
      status: "Completed",
      clinicName: "CuraLink Telehealth",
    },
    {
      id: "apt004",
      doctorName: "Dr. Ananya Sharma",
      specialty: "Cardiology",
      type: "PHYSICAL",
      date: "2023-07-05",
      time: "09:00 AM",
      status: "Completed",
      clinicName: "MedHeart Clinic, Mumbai",
    },
  ],
};

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'

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

  const listVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
    hidden: {},
  };

  const appointmentCardHover = {
    hover: { scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" },
  };

  const appointmentsToDisplay =
    activeTab === "upcoming"
      ? mockAppointments.upcoming
      : mockAppointments.past;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 text-center sm:text-left">
            My <span className="text-blue-600">Appointments</span>
          </h1>
          <p className="text-slate-600 mt-3 text-lg text-center sm:text-left max-w-xl">
            Keep track of your upcoming and past medical consultations.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex border-b border-slate-200"
        >
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base transition-colors duration-150
                        ${
                          activeTab === "upcoming"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
          >
            Upcoming ({mockAppointments.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base transition-colors duration-150
                        ${
                          activeTab === "past"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
          >
            Past ({mockAppointments.past.length})
          </button>
        </motion.div>

        {/* Appointments List */}
        {appointmentsToDisplay.length > 0 ? (
          <motion.div
            key={activeTab} // Re-trigger animation when tab changes
            className="space-y-6"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {appointmentsToDisplay.map((apt) => (
              <motion.div
                key={apt.id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
              >
                <motion.div
                  variants={appointmentCardHover}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                    <h3 className="text-xl font-semibold text-slate-800 mb-1 sm:mb-0">
                      {apt.specialty} with {apt.doctorName}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full
                                        ${
                                          apt.status === "Scheduled" &&
                                          activeTab === "upcoming"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : ""
                                        }
                                        ${
                                          apt.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : ""
                                        }
                                        ${
                                          apt.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : ""
                                        }
                                      `}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center">
                      <ClockIcon /> {apt.date} at {apt.time}
                    </div>
                    <div className="flex items-center">
                      {apt.type === "DIGITAL" ? (
                        <VideoCameraIcon />
                      ) : (
                        <LocationMarkerIcon />
                      )}
                      {apt.type === "DIGITAL"
                        ? "Digital Consultation"
                        : apt.clinicName}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {activeTab === "upcoming" && apt.type === "DIGITAL" && (
                      <Link
                        to={`/consultation/${apt.id}`} // Example link to join call
                        className="w-full sm:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Join Video Call
                      </Link>
                    )}
                    {activeTab === "upcoming" && (
                      <button className="w-full sm:w-auto text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors border border-slate-300">
                        Reschedule
                      </button>
                    )}
                    <Link
                      to={`/appointment-details/${apt.id}`}
                      className="w-full sm:w-auto text-center bg-transparent hover:bg-slate-50 text-slate-600 font-medium py-2 px-4 rounded-lg text-sm transition-colors border border-slate-300"
                    >
                      View Details
                    </Link>
                    {activeTab === "past" && (
                      <Link
                        to={`/review/${apt.doctorId}/${apt.id}`}
                        className="w-full sm:w-auto text-center bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Leave a Review
                      </Link>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-800">
              No {activeTab} appointments
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "upcoming"
                ? "You don't have any upcoming appointments scheduled."
                : "You have no past appointment history."}
            </p>
            {activeTab === "upcoming" && (
              <div className="mt-6">
                <Link
                  to="/find-doctors"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book a New Appointment
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Appointments;
