import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// --- Example Icons (Replace with actual icons from a library like Heroicons) ---
const CalendarDaysIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ></path>
  </svg>
);
const UsersIcon = () => (
  <svg
    className="w-8 h-8 text-teal-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    ></path>
  </svg>
);
const VideoCameraIcon = () => (
  <svg
    className="w-8 h-8 text-sky-500"
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
const UserCircleIcon = () => (
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
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const ChartBarIcon = () => (
  <svg
    className="w-8 h-8 text-purple-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m4 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"
    ></path>
  </svg>
);
const CogIcon = () => (
  <svg
    className="w-8 h-8 text-orange-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);
// --- End Example Icons ---

// Mock Data - Replace with actual data fetched from API
const mockDoctorName = "Dr. Ananya Sharma";
const mockUpcomingAppointments = [
  {
    id: "apt001",
    patientName: "Rohan Patel",
    time: "10:30 AM",
    type: "DIGITAL",
    status: "Scheduled",
  },
  {
    id: "apt002",
    patientName: "Priya Kumari",
    time: "11:00 AM",
    type: "PHYSICAL",
    status: "Scheduled",
  },
  {
    id: "apt003",
    patientName: "Amit Singh",
    time: "11:30 AM",
    type: "PHYSICAL",
    status: "Checked-In",
  },
];
const mockQueueStatus = {
  currentServing: "A005",
  patientsWaiting: 7,
  avgWaitTime: "15 mins",
};
const mockStats = {
  todayAppointments: 15,
  digitalConsultsToday: 6,
  totalPatients: 235,
};

const DoctorDashboardPage = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "circOut" },
    },
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 },
    },
  };

  const cardHover = {
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            Welcome back,{" "}
            <span className="text-blue-600">{mockDoctorName}!</span>
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Here's an overview of your practice today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 sm:mb-10"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Stagger children
        >
          {[
            {
              title: "Today's Appointments",
              value: mockStats.todayAppointments,
              icon: <CalendarDaysIcon />,
              color: "indigo",
            },
            {
              title: "Digital Consults Today",
              value: mockStats.digitalConsultsToday,
              icon: <VideoCameraIcon />,
              color: "sky",
            },
            {
              title: "Total Patients",
              value: mockStats.totalPatients,
              icon: <UsersIcon />,
              color: "teal",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statCardVariants}
              className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${stat.color}-500 flex items-center justify-between`}
            >
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Dashboard Sections (e.g., Live Queue, Upcoming Appointments) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Patient Queue */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5 border-b border-slate-200 pb-3">
              Live Patient Queue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">
                  CURRENTLY SERVING
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockQueueStatus.currentServing || "N/A"}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-xs text-yellow-700 font-medium">
                  PATIENTS WAITING
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockQueueStatus.patientsWaiting}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-xs text-green-700 font-medium">
                  AVG. WAIT TIME
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {mockQueueStatus.avgWaitTime}
                </p>
              </div>
            </div>
            {/* Add actions like "Call Next Patient", "Pause Queue" here */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert("Call Next Patient (UI Only)")}
              >
                Call Next Patient
              </motion.button>
              <motion.button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert("Pause Queue (UI Only)")}
              >
                Pause Queue
              </motion.button>
            </div>
            <Link
              to="/doctor/queue-management"
              className="block text-center mt-4 text-sm text-blue-600 hover:underline"
            >
              Manage Full Queue →
            </Link>
          </motion.section>

          {/* Quick Links / Actions */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">
              Quick Actions
            </h2>
            {[
              {
                title: "Manage Availability",
                link: "/doctor/availability",
                icon: <CalendarDaysIcon />,
                color: "indigo",
              },
              {
                title: "View All Appointments",
                link: "/doctor/appointments",
                icon: <UsersIcon />,
                color: "teal",
              },
              {
                title: "Start Teleconsultation",
                link: "/doctor/teleconsult",
                icon: <VideoCameraIcon />,
                color: "sky",
              },
              {
                title: "Practice Analytics",
                link: "/doctor/analytics",
                icon: <ChartBarIcon />,
                color: "purple",
              },
              {
                title: "Profile & Settings",
                link: "/doctor/settings",
                icon: <CogIcon />,
                color: "orange",
              },
            ].map((item, index) => (
              <Link key={index} to={item.link}>
                <motion.div
                  className={`p-4 rounded-lg flex items-center bg-${item.color}-50 border border-${item.color}-200 hover:bg-${item.color}-100 hover:shadow-md transition-all duration-200 cursor-pointer`}
                  whileHover={{
                    x: 5,
                    transition: { type: "spring", stiffness: 400, damping: 12 },
                  }}
                >
                  <div className={`p-2 rounded-full bg-${item.color}-100 mr-4`}>
                    {item.icon}
                  </div>
                  <span className={`font-medium text-${item.color}-700`}>
                    {item.title}
                  </span>
                  <svg
                    className={`w-5 h-5 text-${item.color}-500 ml-auto transform transition-transform group-hover:translate-x-1`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </motion.div>
              </Link>
            ))}
          </motion.section>
        </div>

        {/* Upcoming Appointments List */}
        <motion.section
          variants={itemVariants}
          className="mt-8 sm:mt-10 bg-white p-6 rounded-xl shadow-xl"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5 border-b border-slate-200 pb-3">
            Today's Upcoming Appointments
          </h2>
          {mockUpcomingAppointments.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {" "}
              {/* Scrollable list */}
              {mockUpcomingAppointments.map((apt) => (
                <motion.div
                  key={apt.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:border-blue-300 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.3,
                      delay: apt.id.slice(-1) * 0.05,
                    },
                  }} // Simple stagger
                  whileHover="hover"
                >
                  <motion.div variants={cardHover}>
                    <div className="flex items-center mb-1 sm:mb-0">
                      <UserCircleIcon />
                      <span className="text-sm font-medium text-slate-700">
                        {apt.patientName}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-1 sm:mt-0 sm:ml-6">
                      <ClockIcon /> {apt.time} -
                      <span
                        className={`ml-1.5 font-medium ${
                          apt.type === "DIGITAL"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {apt.type}
                      </span>
                    </div>
                  </motion.div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Link
                      to={`/doctor/patient/${apt.id}/record`}
                      className="text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1.5 rounded-md font-medium"
                    >
                      View Record
                    </Link>
                    {apt.type === "DIGITAL" && (
                      <Link
                        to={`/doctor/start-call/${apt.id}`}
                        className="text-xs bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1.5 rounded-md font-medium"
                      >
                        Start Call
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-5">
              No upcoming appointments for today yet.
            </p>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/doctor/appointments"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View Full Schedule →
            </Link>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default DoctorDashboardPage;
