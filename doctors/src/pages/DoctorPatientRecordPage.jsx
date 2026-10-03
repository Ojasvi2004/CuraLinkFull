import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/Layout/PageLayout";
const server=import.meta.env.VITE_SERVER; // Assuming HOC


const UserCircleIcon = () => (
  <svg
    className="w-8 h-8 text-blue-600"
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
const DocumentTextIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);
const ClipboardListIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    ></path>
  </svg>
);
const VideoCameraIcon = () => (
  <svg
    className="w-5 h-5 mr-1.5 text-sky-500"
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
const BuildingOfficeIcon = () => (
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
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    ></path>
  </svg>
);
// --- End Example Icons ---

// Mock Patient Data - Replace with actual data fetched from API based on patientId
const mockPatientData = {
  id: "pat001",
  name: "Rohan Patel",
  age: 34,
  gender: "Male",
  profilePic: "https://via.placeholder.com/150/A78BFA/FFFFFF?text=RP",
  contact: {
    email: "rohan.p@example.com",
    phone: "+91 98765 12345",
  },
  medicalInfo: {
    bloodType: "O+",
    allergies: ["Peanuts", "Penicillin"],
    currentMedications: ["Amlodipine 5mg"],
    chronicConditions: ["Hypertension"],
  },
  appointmentHistory: [
    {
      id: "apt001",
      date: "2023-10-28",
      type: "DIGITAL",
      reason: "Follow-up for hypertension",
      status: "Upcoming",
    },
    {
      id: "apt00X",
      date: "2023-08-15",
      type: "PHYSICAL",
      reason: "Initial Consultation",
      status: "Completed",
    },
  ],
  healthRecords: [
    {
      id: "hr001",
      recordType: "Lab Report - Blood Test",
      date: "2023-09-15",
      source: "Metropolis Labs",
      fileUrl: "#",
    },
    {
      id: "hr00Y",
      recordType: "ECG Report",
      date: "2023-08-15",
      source: "Self (Uploaded)",
      fileUrl: "#",
    },
  ],
  prescriptions: [
    {
      id: "pres002",
      date: "2023-08-15",
      medicines: ["Amlodipine 5mg", "Atorvastatin 10mg"],
    },
  ],
};

const DoctorPatientRecordPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(mockPatientData); // Use mock data
  const [isLoading, setIsLoading] = useState(false); // Set to true when fetching
  const [activeTab, setActiveTab] = useState("overview"); // overview, history, records

  // In a real app, you would fetch patient data
  // useEffect(() => {
  //   const fetchPatientData = async () => {
  //     setIsLoading(true);
  //     // const response = await yourApi.get(`/doctor/patient/${patientId}`);
  //     // setPatient(response.data);
  //     setIsLoading(false);
  //   };
  //   fetchPatientData();
  // }, [patientId]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "circOut" },
    },
  };

  const listStagger = {
    visible: { transition: { staggerChildren: 0.07 } },
    hidden: {},
  };

  if (isLoading) return <div>Loading patient data...</div>;
  if (!patient) return <div>Patient not found.</div>;

  return (
    <PageLayout
      pageTitle="Patient Record"
      pageSubtitle={`Viewing details for ${patient.name}`}
      contentMaxWidth="max-w-7xl" // Use a wider layout for this page
    >
      {/* Patient Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200"
      >
        <motion.img
          src={
            patient.profilePic ||
            `https://via.placeholder.com/128/E2E8F0/4A5568?text=${
              patient.name ? patient.name.charAt(0) : "P"
            }`
          }
          alt={patient.name}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.1,
              duration: 0.5,
              type: "spring",
              stiffness: 150,
            },
          }}
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {patient.name}
          </h2>
          <p className="text-slate-600">
            Age: {patient.age}, Gender: {patient.gender}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Patient ID: {patient.id}
          </p>
          <div className="mt-3 flex justify-center sm:justify-start gap-3 text-xs">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Blood Type: {patient.medicalInfo.bloodType}
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Allergies: {patient.medicalInfo.allergies.length}
            </span>
          </div>
        </div>
        <div className="sm:ml-auto mt-4 sm:mt-0 flex flex-wrap gap-2 justify-center">
          <Link
            to={`/doctor/start-chat/${patient.id}`}
            className="text-sm bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Message Patient
          </Link>
          <Link
            to={`/doctor/start-call/${patient.id}`}
            className="text-sm bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            Start Video Call
          </Link>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        className="my-6 flex border-b border-slate-200"
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base transition-colors ${
            activeTab === "overview"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base transition-colors ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Appointment History
        </button>
        <button
          onClick={() => setActiveTab("records")}
          className={`py-3 px-4 sm:px-6 font-medium text-sm sm:text-base transition-colors ${
            activeTab === "records"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Uploaded Records
        </button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-slate-50 p-5 rounded-lg border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  Key Medical Info
                </h3>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Blood Type:</strong>{" "}
                    <span className="text-slate-600">
                      {patient.medicalInfo.bloodType}
                    </span>
                  </li>
                  <li>
                    <strong>Allergies:</strong>{" "}
                    <span className="text-red-600">
                      {patient.medicalInfo.allergies.join(", ")}
                    </span>
                  </li>
                  <li>
                    <strong>Chronic Conditions:</strong>{" "}
                    <span className="text-slate-600">
                      {patient.medicalInfo.chronicConditions.join(", ")}
                    </span>
                  </li>
                  <li>
                    <strong>Current Medications:</strong>{" "}
                    <span className="text-slate-600">
                      {patient.medicalInfo.currentMedications.join(", ")}
                    </span>
                  </li>
                </ul>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-slate-50 p-5 rounded-lg border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  Latest Prescription
                </h3>
                {patient.prescriptions.length > 0 ? (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Date: {patient.prescriptions[0].date}
                    </p>
                    <ul className="list-disc list-inside text-sm text-slate-600">
                      {patient.prescriptions[0].medicines.map((med, i) => (
                        <li key={i}>{med}</li>
                      ))}
                    </ul>
                    <Link
                      to={`/doctor/prescription/${patient.prescriptions[0].id}`}
                      className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                    >
                      View Full Prescription &rarr;
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No prescriptions on record.
                  </p>
                )}
              </motion.div>
            </div>
          )}

          {activeTab === "history" && (
            <motion.div variants={listStagger} className="space-y-4">
              {patient.appointmentHistory.map((apt) => (
                <motion.div
                  key={apt.id}
                  variants={itemVariants}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-800">{apt.reason}</p>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <span>
                        {new Date(apt.date + "T00:00:00Z").toLocaleDateString()}
                      </span>
                      <span className="mx-2">|</span>
                      <span
                        className={`font-medium ${
                          apt.type === "DIGITAL"
                            ? "text-sky-600"
                            : "text-green-600"
                        }`}
                      >
                        {apt.type}
                      </span>
                      <span className="mx-2">|</span>
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          apt.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/doctor/appointment/${apt.id}`}
                    className="text-xs bg-white text-slate-600 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-md font-medium transition-colors"
                  >
                    View Notes
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "records" && (
            <motion.div variants={listStagger} className="space-y-4">
              {patient.healthRecords.map((record) => (
                <motion.div
                  key={record.id}
                  variants={itemVariants}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-800 flex items-center">
                      <DocumentTextIcon />{" "}
                      <span className="ml-1">{record.recordType}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Date:{" "}
                      {new Date(
                        record.date + "T00:00:00Z"
                      ).toLocaleDateString()}{" "}
                      | Source: {record.source}
                    </p>
                  </div>
                  <a
                    href={record.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                  >
                    View Document
                  </a>
                </motion.div>
              ))}
              {patient.healthRecords.length === 0 && (
                <p className="text-slate-500 text-center py-5">
                  Patient has not uploaded any documents.
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
};

export default DoctorPatientRecordPage;
