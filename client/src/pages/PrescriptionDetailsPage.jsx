import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // To get prescriptionId
import { motion } from "framer-motion";
import PageLayout from "../components/Layout/PageLayout"; // Assuming you have this HOC

// --- Example Icons (Replace with actual icons) ---
const DocumentTextDetailIcon = () => (
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
    className="w-5 h-5 mr-2"
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
const CalendarIcon = () => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ></path>
  </svg>
);
const DoctorIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
); // Simplified doctor icon
const ClipboardListIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    ></path>
  </svg>
);
const LightBulbIcon = () => (
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
      d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 1v2.5m0 17v-2.5m0-12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-7.5 7.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm15 0a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm-7.5 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
    ></path>
  </svg>
);
const TruckIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
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

// Mock Prescriptions Data (same as MyPrescriptionsPage for consistency in demo)
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
        notes: "For affected area only",
      },
      {
        name: "Cetirizine 10mg",
        dosage: "1 tablet at night",
        duration: "5 days",
        notes: "May cause drowsiness",
      },
    ],
    diagnosis: "Allergic Dermatitis",
    advice:
      "Avoid known allergens. Keep skin moisturized. Follow up if no improvement in 1 week.",
    prescriptionImageUrl: null,
    deliveryStatus: "DELIVERED",
  },
  {
    id: "pres002",
    appointmentId: "apt001",
    doctorName: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    date: "2023-08-15",
    medicines: [
      {
        name: "Amlodipine 5mg",
        dosage: "1 tablet daily in the morning",
        duration: "30 days",
      },
      {
        name: "Atorvastatin 10mg",
        dosage: "1 tablet at night",
        duration: "Ongoing",
        notes: "Take after food",
      },
    ],
    diagnosis: "Hypertension Stage 1",
    advice:
      "Monitor blood pressure regularly. Low salt diet. Regular exercise. Follow up in 1 month with new readings.",
    prescriptionImageUrl:
      "https://via.placeholder.com/600x800.png?text=Scanned+Prescription+Example",
    deliveryStatus: "PENDING",
  },
];

const formatDateDisplay = (dateStr) =>
  new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const PrescriptionDetailsPage = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching prescription details
    setIsLoading(true);
    setTimeout(() => {
      const foundPrescription = mockPrescriptionsData.find(
        (p) => p.id === prescriptionId
      );
      setPrescription(foundPrescription);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [prescriptionId]);

  // Animation Variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const sectionVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "circOut", staggerChildren: 0.1 },
    },
  };
  const buttonHover = {
    hover: {
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.97 },
  };

  if (isLoading) {
    return (
      <PageLayout
        pageTitle="Loading Prescription..."
        pageSubtitle="Please wait a moment."
      >
        <div className="text-center py-10">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto"
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
        </div>
      </PageLayout>
    );
  }

  if (!prescription) {
    return (
      <PageLayout
        pageTitle="Prescription Not Found"
        pageSubtitle="We couldn't find the prescription you're looking for."
      >
        <div className="text-center py-10">
          <p className="text-slate-600 mb-6">
            This prescription may have been moved or does not exist.
          </p>
          <Link
            to="/my-prescriptions"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-colors"
          >
            Back to My Prescriptions
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      pageTitle="Prescription Details"
      pageSubtitle={`Issued by ${
        prescription.doctorName
      } on ${formatDateDisplay(prescription.date)}`}
      contentMaxWidth="max-w-4xl" // Wider content card for details
    >
      <motion.div
        className="space-y-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Basic Information Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-3 flex items-center">
            <CalendarIcon />{" "}
            <span className="ml-2">Consultation Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
            <p>
              <strong>Prescription ID:</strong> {prescription.id}
            </p>
            <p>
              <strong>Date Issued:</strong>{" "}
              {formatDateDisplay(prescription.date)}
            </p>
            <p>
              <strong>Prescribed by:</strong>{" "}
              <Link
                to={`/doctors/${prescription.doctorId || "#"}`}
                className="text-blue-600 hover:underline"
              >
                {prescription.doctorName}
              </Link>
            </p>
            <p>
              <strong>Specialty:</strong> {prescription.specialty}
            </p>
            <p>
              <strong>Appointment ID:</strong>{" "}
              <Link
                to={`/appointment-details/${prescription.appointmentId}`}
                className="text-blue-600 hover:underline"
              >
                {prescription.appointmentId}
              </Link>
            </p>
            {prescription.diagnosis && (
              <p className="sm:col-span-2">
                <strong>Diagnosis:</strong> {prescription.diagnosis}
              </p>
            )}
          </div>
        </motion.section>

        {/* Medications Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-3 flex items-center">
            <ClipboardListIcon />{" "}
            <span className="ml-2">Medications Prescribed</span>
          </h2>
          {prescription.medicines && prescription.medicines.length > 0 ? (
            <div className="space-y-4">
              {prescription.medicines.map((med, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <h4 className="font-semibold text-md text-blue-700">
                    {med.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    <strong>Dosage:</strong> {med.dosage}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Duration:</strong> {med.duration}
                  </p>
                  {med.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      Notes: {med.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No medications listed on this prescription.
            </p>
          )}
        </motion.section>

        {/* Doctor's Advice Section */}
        {prescription.advice && (
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-3 flex items-center">
              <LightBulbIcon /> <span className="ml-2">Doctor's Advice</span>
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {prescription.advice}
            </p>
          </motion.section>
        )}

        {/* Scanned Prescription Image Section */}
        {prescription.prescriptionImageUrl && (
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-3">
              Scanned Prescription
            </h2>
            <motion.img
              src={prescription.prescriptionImageUrl}
              alt="Scanned Prescription"
              className="rounded-lg border shadow-md max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
            />
          </motion.section>
        )}

        {/* Delivery Status Section */}
        {prescription.deliveryStatus && (
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-3 flex items-center">
              <TruckIcon />{" "}
              <span className="ml-2">Medicine Delivery Status</span>
            </h2>
            <p
              className={`text-lg font-medium p-3 rounded-md inline-block ${
                prescription.deliveryStatus === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : prescription.deliveryStatus === "DISPATCHED"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {prescription.deliveryStatus.charAt(0) +
                prescription.deliveryStatus
                  .slice(1)
                  .toLowerCase()
                  .replace("_", " ")}
            </p>
            {/* Add more delivery details or tracking link if available */}
          </motion.section>
        )}

        {/* Actions Section */}
        <motion.div
          variants={itemVariants}
          className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start"
        >
          <motion.button
            onClick={() => navigate("/my-prescriptions")}
            className="w-full sm:w-auto order-2 sm:order-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            Back to All Prescriptions
          </motion.button>
          {prescription.prescriptionImageUrl && (
            <motion.a
              href={prescription.prescriptionImageUrl}
              download={`CuraLink_Prescription_${prescription.id}.png`} // Suggest a filename
              className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <DownloadIcon /> Download Scan
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </PageLayout>
  );
};

export default PrescriptionDetailsPage;
