import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // For linking to appointment or doctor

// --- Example Icons (Replace with actual icons from a library like Heroicons) ---
const DocumentTextIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);
const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    ></path>
  </svg>
);
const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    ></path>
  </svg>
);
const TruckIcon = () => (
  <svg
    className="w-4 h-4"
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
    <path
      d="M9 20L6 17m0 0l3-3m-3 3h12M3 10h2M5 4v4M9 4v4M13 4v4M17 4v4M21 10h-2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
);
// --- End Example Icons ---

// Mock Prescriptions Data - Replace with actual data fetched from API
const mockPrescriptionsData = [
  {
    id: "pres001",
    appointmentId: "apt003",
    doctorName: "Dr. Priya Reddy",
    specialty: "Dermatology",
    date: "2023-07-20",
    medicines: [
      {
        name: "Betamethasone Cream",
        dosage: "Apply thin layer twice daily",
        duration: "7 days",
      },
      {
        name: "Cetirizine 10mg",
        dosage: "1 tablet at night",
        duration: "5 days",
      },
    ],
    diagnosis: "Allergic Dermatitis",
    advice: "Avoid known allergens. Keep skin moisturized.",
    prescriptionImageUrl: null, // URL to scanned prescription if uploaded
    deliveryStatus: "DELIVERED",
  },
  {
    id: "pres002",
    appointmentId: "apt001",
    doctorName: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    date: "2023-08-15",
    medicines: [
      { name: "Amlodipine 5mg", dosage: "1 tablet daily", duration: "30 days" },
      {
        name: "Atorvastatin 10mg",
        dosage: "1 tablet at night",
        duration: "Ongoing",
      },
    ],
    diagnosis: "Hypertension",
    advice:
      "Monitor blood pressure regularly. Low salt diet. Follow up in 1 month.",
    prescriptionImageUrl: "https://via.placeholder.com/300x400?text=RxScan.pdf",
    deliveryStatus: "PENDING",
  },
  {
    id: "pres003",
    appointmentId: "apt00X", // Example of an older one
    doctorName: "Dr. Vikram Singh",
    specialty: "Pediatrics",
    date: "2023-05-02",
    medicines: [
      {
        name: "Paracetamol Syrup",
        dosage: "5ml thrice daily",
        duration: "3 days",
      },
      {
        name: "Saline Nasal Drops",
        dosage: "2 drops per nostril as needed",
        duration: "5 days",
      },
    ],
    diagnosis: "Viral Fever",
    advice: "Ensure good hydration. Monitor temperature.",
    prescriptionImageUrl: null,
    deliveryStatus: null, // No delivery for this one
  },
];

const MyPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptionsData);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [sortByDate, setSortByDate] = useState("desc"); // 'asc' or 'desc'
  const [selectedPrescription, setSelectedPrescription] = useState(null); // For modal view

  // Animation Variants
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
  const listVariants = {
    visible: { transition: { staggerChildren: 0.07 } },
    hidden: {},
  };
  const cardHover = {
    hover: {
      scale: 1.015,
      y: -3,
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
      transition: { type: "spring", stiffness: 350, damping: 15 },
    },
  };
  const modalOuterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
  };
  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const uniqueDoctors = useMemo(() => {
    const doctorNames = prescriptions.map((p) => p.doctorName);
    return [...new Set(doctorNames)];
  }, [prescriptions]);

  const filteredAndSortedPrescriptions = useMemo(() => {
    let filtered = prescriptions;
    if (filterDoctor) {
      filtered = filtered.filter((p) => p.doctorName === filterDoctor);
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDate === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [prescriptions, filterDoctor, sortByDate]);

  const openDetailsModal = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closeDetailsModal = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-10 text-center lg:text-left"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
                My <span className="text-blue-600">Prescriptions</span>
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Access and manage your digital prescriptions from CuraLink
                consultations.
              </p>
            </div>
            {/* Optional: Button to link to a page about understanding prescriptions */}
            <Link
              to="/health-info/understanding-prescriptions" // Placeholder
              className="mt-4 lg:mt-0 whitespace-nowrap bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center self-center lg:self-auto"
            >
              <DocumentTextIcon />{" "}
              <span className="ml-2">How to Read a Prescription</span>
            </Link>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <label
                htmlFor="filterDoctor"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Filter by Doctor
              </label>
              <select
                id="filterDoctor"
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="py-2 px-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
              >
                <option value="">All Doctors</option>
                {uniqueDoctors.map((docName) => (
                  <option key={docName} value={docName}>
                    {docName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="sortByDate"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Sort by Date
              </label>
              <select
                id="sortByDate"
                value={sortByDate}
                onChange={(e) => setSortByDate(e.target.value)}
                className="py-2 px-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Prescriptions List */}
        {filteredAndSortedPrescriptions.length > 0 ? (
          <motion.div
            key={filterDoctor + sortByDate} // Re-trigger list animation on filter/sort change
            className="space-y-5"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedPrescriptions.map((rx) => (
              <motion.div
                key={rx.id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              >
                <motion.div variants={cardHover} className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Prescription from {rx.doctorName}
                      </h3>
                      <p className="text-xs text-blue-600 font-medium">
                        {rx.specialty}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 sm:mt-0 whitespace-nowrap">
                      Date:{" "}
                      {new Date(rx.date + "T00:00:00Z").toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4 border-t border-slate-100 pt-3">
                    <h4 className="text-sm font-medium text-slate-700 mb-1.5">
                      Medications:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 pl-4">
                      {rx.medicines.slice(0, 2).map(
                        (
                          med,
                          i // Show first 2 meds, more in details
                        ) => (
                          <li key={i}>
                            {med.name} - {med.dosage} ({med.duration})
                          </li>
                        )
                      )}
                      {rx.medicines.length > 2 && (
                        <li>...and {rx.medicines.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  {rx.deliveryStatus && (
                    <div
                      className={`text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-full mb-3
                        ${
                          rx.deliveryStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : rx.deliveryStatus === "DISPATCHED"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      <TruckIcon />{" "}
                      <span className="ml-1.5">
                        Delivery:{" "}
                        {rx.deliveryStatus.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => openDetailsModal(rx)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-2 rounded-md font-medium transition-colors flex items-center"
                    >
                      <EyeIcon /> <span className="ml-1.5">View Details</span>
                    </button>
                    {rx.prescriptionImageUrl && (
                      <a
                        href={rx.prescriptionImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-3.5 py-2 rounded-md font-medium transition-colors flex items-center"
                      >
                        <DownloadIcon />{" "}
                        <span className="ml-1.5">Download Scan</span>
                      </a>
                    )}
                    {/* Add Track Delivery Button if status is PENDING or DISPATCHED */}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 bg-white rounded-xl shadow-lg"
          >
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-800">
              No prescriptions found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {filterDoctor || sortByDate !== "desc"
                ? "No prescriptions match your current filters."
                : "You do not have any prescriptions yet."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Prescription Details Modal */}
      <AnimatePresence>
        {selectedPrescription && (
          <motion.div
            key="prescriptionModal"
            variants={modalOuterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={closeDetailsModal}
          >
            <motion.div
              variants={modalContentVariants}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-xl font-semibold text-slate-800">
                  Prescription Details
                </h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
              <div className="text-sm space-y-3">
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedPrescription.date}
                </p>
                <p>
                  <strong>Doctor:</strong> {selectedPrescription.doctorName} (
                  {selectedPrescription.specialty})
                </p>
                <p>
                  <strong>Appointment ID:</strong>{" "}
                  <Link
                    to={`/appointment-details/${selectedPrescription.appointmentId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedPrescription.appointmentId}
                  </Link>
                </p>
                <div className="mt-3">
                  <h4 className="font-medium text-slate-700 mb-1">
                    Medications:
                  </h4>
                  <ul className="list-none space-y-2 pl-2 border-l-2 border-blue-200">
                    {selectedPrescription.medicines.map((med, i) => (
                      <li key={i} className="text-slate-600">
                        <strong className="text-slate-800">{med.name}</strong>:{" "}
                        {med.dosage} ({med.duration})
                        {med.notes && (
                          <span className="block text-xs italic text-slate-500">
                            {" "}
                            - {med.notes}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedPrescription.diagnosis && (
                  <p className="mt-3">
                    <strong>Diagnosis:</strong> {selectedPrescription.diagnosis}
                  </p>
                )}
                {selectedPrescription.advice && (
                  <p className="mt-1">
                    <strong>Doctor's Advice:</strong>{" "}
                    {selectedPrescription.advice}
                  </p>
                )}
                {selectedPrescription.prescriptionImageUrl && (
                  <div className="mt-3">
                    <p className="font-medium text-slate-700 mb-1">
                      Scanned Prescription:
                    </p>
                    <img
                      src={selectedPrescription.prescriptionImageUrl}
                      alt="Scanned Prescription"
                      className="rounded-md border max-w-xs mx-auto"
                    />
                  </div>
                )}
                {selectedPrescription.deliveryStatus && (
                  <p className="mt-3">
                    <strong>Delivery Status:</strong>{" "}
                    <span
                      className={`font-medium ${
                        selectedPrescription.deliveryStatus === "DELIVERED"
                          ? "text-green-600"
                          : selectedPrescription.deliveryStatus === "DISPATCHED"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {selectedPrescription.deliveryStatus}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <Link to={`/prescriptions/${selectedPrescription.id}`}
                 className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    More Details
                </Link>
                {selectedPrescription.prescriptionImageUrl && (
                  <a
                    href={selectedPrescription.prescriptionImageUrl}
                    download
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    Download Scan
                  </a>
                )}
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Placeholder */}
      <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm mt-16">
        CuraLink - Patient Portal Footer
      </div>
    </div>
  );
};

export default MyPrescriptionsPage;
