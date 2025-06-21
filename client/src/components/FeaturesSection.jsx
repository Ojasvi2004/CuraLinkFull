import React from "react";
import { motion } from "framer-motion";

const AiIcon = () => (
  <svg
    className="w-8 h-8 text-blue-500"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);
const SearchIcon = () => (
  <svg
    className="w-8 h-8 text-teal-500"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);
const CalendarIcon = () => (
  <svg
    className="w-8 h-8 text-indigo-500"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);
const VideoIcon = () => (
  <svg
    className="w-8 h-8 text-purple-500"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h10M4 10h10M4 14h10M4 18h10"></path>
  </svg>
);
const PrescriptionIcon = () => (
  <svg
    className="w-8 h-8 text-pink-500"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);
const UserIcon = () => (
  <svg
    className="w-8 h-8 text-orange-500"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const featuresData = [
  {
    icon: <AiIcon />,
    title: "AI Symptom Analyzer",
    description:
      "Not sure which specialist to see? Describe your symptoms, and our AI will guide you to the right type of doctor, saving you time and worry.",
    color: "blue",
  },
  {
    icon: <SearchIcon />,
    title: "Comprehensive Doctor Search",
    description:
      "Easily find verified doctors by specialty, location, availability, or patient ratings. Access detailed profiles to make informed decisions.",
    color: "teal",
  },
  {
    icon: <CalendarIcon />,
    title: "Effortless Appointment Booking",
    description:
      "Book in-person or digital consultations in just a few clicks. View real-time availability and manage your appointments seamlessly.",
    color: "indigo",
  },
  {
    icon: <VideoIcon />,
    title: "Secure Telemedicine Platform",
    description:
      "Connect with doctors remotely via high-quality video calls for minor ailments, follow-ups, or when travel is a constraint.",
    color: "purple",
  },
  {
    icon: <PrescriptionIcon />,
    title: "Digital Prescription Management",
    description:
      "(Simulated) Receive and store prescriptions digitally after your online consultation, making them easy to access and share.",
    color: "pink",
  },
  {
    icon: <UserIcon />,
    title: "Personalized Patient Dashboard",
    description:
      "Keep track of your appointments, medical history (simulated), prescriptions, and communication with doctors all in one secure place.",
    color: "orange",
  },
];

const useCasesData = [
  {
    title: "Quick Consultation for Minor Ailments",
    description:
      "Feeling unwell with common symptoms like a cold or rash? Use our AI symptom analyzer, connect with a general physician via telemedicine, and get advice without leaving home.",
    scenario:
      "A busy professional needs quick advice for a recurring headache.",
    benefit: "Saves travel time, provides quick access to medical guidance.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80", // Placeholder
  },
  {
    title: "Finding the Right Specialist",
    description:
      "Experiencing specific or complex symptoms? Our AI guides you to the appropriate specialist (e.g., neurologist, endocrinologist) and helps you book an informed consultation.",
    scenario:
      "A patient has persistent joint pain but is unsure if they need a rheumatologist or an orthopedist.",
    benefit:
      "Reduces misdirected consultations, accelerates path to correct diagnosis.",
    image:
      "https://images.unsplash.com/photo-1584515933487-750f40589918?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80", // Placeholder
  },
  {
    title: "Convenient Follow-Up Appointments",
    description:
      "Need a follow-up after an in-person visit? Schedule a digital consultation for a quick check-in, discuss lab results, or adjust medication with your doctor.",
    scenario:
      "A patient recovering from surgery needs a routine follow-up but lives far from the hospital.",
    benefit: "Improves continuity of care, reduces travel burden for patients.",
    image:
      "https://images.unsplash.com/photo-1622227945605-b54ca7968097?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", // Placeholder
  },
];

const FeaturesSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // Tailwind's shadow-xl
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Part */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-sm font-semibold text-blue-600 uppercase tracking-wider"
          >
            Core Capabilities
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900"
          >
            How CuraLink Empowers Your Health Journey
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-lg sm:text-xl text-slate-600 mx-auto"
          >
            Discover a suite of integrated tools designed to simplify your
            access to quality healthcare, from intelligent guidance to seamless
            digital consultations.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-white p-6 sm:p-8 rounded-xl cursor-pointer shadow-lg border-t-4 border-${feature.color}-500 cursor-default`} // Added cursor-default as cards are not links
            >
              <motion.div
                variants={cardHoverVariants}
                className="flex flex-col h-full"
              >
                {" "}
                {/* Allows hover effect on inner content */}
                <div
                  className={`mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-${feature.color}-100`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Use Cases Part */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center mt-20 sm:mt-28 mb-16 sm:mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-sm font-semibold text-indigo-600 uppercase tracking-wider"
          >
            Real-World Scenarios
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900"
          >
            See CuraLink in Action
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-lg sm:text-xl text-slate-600 mx-auto"
          >
            Explore how CuraLink addresses common healthcare challenges, making
            medical care more accessible and efficient for everyone.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          className="space-y-12 lg:space-y-16"
        >
          {useCasesData.map((useCase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8 lg:gap-12 p-6 sm:p-8 bg-white rounded-xl shadow-xl overflow-hidden`}
            >
              <div className="lg:w-1/2">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <div className="bg-slate-100 p-4 rounded-md">
                  <p className="text-sm font-medium text-slate-700">
                    Example Scenario:
                  </p>
                  <p className="text-sm text-slate-500 italic mb-2">
                    {useCase.scenario}
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    Key Benefit:
                  </p>
                  <p className="text-sm text-slate-500">{useCase.benefit}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
