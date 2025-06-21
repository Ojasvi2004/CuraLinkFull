import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Example Icons (Replace these with a proper icon library like Heroicons or React Icons) ---
const CalendarIcon = () => (
  <svg
    className="w-10 h-10 text-indigo-500"
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
const SearchDoctorIcon = () => (
  <svg
    className="w-10 h-10 text-teal-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    ></path>
  </svg>
);
const AiAnalyzerIcon = () => (
  <svg
    className="w-10 h-10 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);
const HealthRecordIcon = () => (
  <svg
    className="w-10 h-10 text-purple-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);
const PrescriptionIcon = () => (
  <svg
    className="w-10 h-10 text-pink-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19.428 15.428a4 4 0 00-5.656 0M14 10l-2.5 2.5M10 14l-2.5 2.5m5.656-5.656a4 4 0 000-5.656M12 3v2m0 14v2m-4.95-14.95l1.414 1.414M5.636 18.364l1.414-1.414m0-11.312l-1.414 1.414M18.364 5.636l-1.414 1.414m1.414 5.656H21m-18 0h2.586m5.828 0h.01"
    ></path>
  </svg>
); // Simple representation
const MessagesIcon = () => (
  <svg
    className="w-10 h-10 text-sky-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    ></path>
  </svg>
);
// --- End Example Icons ---

const Dashboard = ({ userName = "Aarav Sharma" }) => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }, // Custom ease
  };

  const cardHoverEffect = {
    hover: {
      y: -10,
      boxShadow: "0px 20px 30px -10px rgba(0, 0, 0, 0.2)", // Softer, more spread shadow
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  const quickLinks = [
    {
      title: "My Appointments",
      description: "View & manage upcoming and past consultations.",
      icon: <CalendarIcon />,
      link: "/my-appointments",
      color: "indigo",
    },
    {
      title: "Find Doctors",
      description: "Search our extensive network of verified specialists.",
      icon: <SearchDoctorIcon />,
      link: "/find-doctors",
      color: "teal",
    },
    {
      title: "AI Symptom Analyzer",
      description: "Get intelligent guidance on your symptoms.",
      icon: <AiAnalyzerIcon />,
      link: "/symptom-analyzer",
      color: "blue",
    },
    {
      title: "My Prescriptions",
      description: "Access your digital prescriptions (simulated).",
      icon: <PrescriptionIcon />,
      link: "/prescriptions",
      color: "pink",
    },
    {
      title: "Health Records",
      description: "Manage your health profile and history (simulated).",
      icon: <HealthRecordIcon />,
      link: "/health-records",
      color: "purple",
    },
    {
      title: "Messages",
      description: "Communicate securely with your doctors (simulated).",
      icon: <MessagesIcon />,
      link: "/messages",
      color: "sky",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div
          variants={headerVariants}
          className="mb-10 sm:mb-12 text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            Welcome back, <span className="text-blue-600">{userName}!</span>
          </h1>
          <p className="text-slate-600 mt-3 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
            Your personal health hub. Let's get you started for the day.
          </p>
        </motion.div>

        {/* Quick Actions Grid - More Beautiful Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {quickLinks.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants} // Staggering handled by parent
              whileHover="hover"
            >
              <Link to={item.link}>
                <motion.div
                  variants={cardHoverEffect}
                  className={`bg-white p-6 py-8 rounded-xl shadow-lg border-t-4 border-${item.color}-500 flex flex-col items-center text-center h-full transform transition-all duration-300 ease-out group`}
                >
                  <div
                    className={`p-3 rounded-full bg-${item.color}-100 mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-${item.color}-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-grow">
                    {item.description}
                  </p>
                  <span
                    className={`inline-flex items-center text-sm font-medium text-${item.color}-600 group-hover:underline`}
                  >
                    Go to {item.title}
                    <svg
                      className="ml-1.5 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for other dashboard sections - e.g., Recent Activity, Health Tips */}
        <motion.div
          variants={headerVariants} // Re-use for similar section entry
          className="mt-16 sm:mt-20 p-8 bg-white rounded-xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Recent Activity (Placeholder)
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="p-4 bg-slate-50 rounded-lg flex justify-between items-center hover:bg-slate-100 transition-colors"
              >
                <p className="text-slate-700">
                  Upcoming appointment with Dr. Priya Sharma on July 28th.
                </p>
                <Link
                  to="/my-appointments"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
            <p className="text-slate-500 text-sm text-center pt-2">
              No more recent activity.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={headerVariants}
          className="mt-12 sm:mt-16 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-3">Health Tip of the Day</h2>
          <p className="text-blue-100 leading-relaxed">
            Remember to stay hydrated throughout the day! Drinking enough water
            is crucial for overall well-being and energy levels. Aim for at
            least 8 glasses.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
