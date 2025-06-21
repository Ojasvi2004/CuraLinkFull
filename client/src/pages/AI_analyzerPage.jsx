import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // For linking to Find Doctors

// --- Example Icons (Replace with actual icons from a library like Heroicons) ---
const LightBulbIcon = () => (
  <svg
    className="w-12 h-12 text-blue-500"
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
const StethoscopeIcon = () => (
  <svg
    className="w-6 h-6 text-blue-600 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 10h.01M15 10h.01M12 6v4m-3 4h6m6 4H5a2 2 0 01-2-2V9a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 001.414 0l1.414-1.414A1 1 0 0116.414 7H19a2 2 0 012 2v9a2 2 0 01-2 2h-2.586a1 1 0 01-.707-.293l-1.414-1.414a1 1 0 00-1.414 0l-1.414 1.414A1 1 0 017.586 21H5z"
    ></path>
  </svg>
);
const InformationCircleIcon = () => (
  <svg
    className="w-6 h-6 text-yellow-500 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
// --- End Example Icons ---

const AiAnalyzerPage = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const resultCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "circOut", delay: 0.2 },
    },
  };

  const handleAnalyzeSymptoms = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError("Please describe your symptoms.");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError("");

    // --- SIMULATE API CALL to Perplexity Sonar / OpenAI API ---
    // In a real app, you would make an API call here with the 'symptoms'
    // and the carefully crafted prompt we discussed.
    console.log("Sending to AI for analysis:", symptoms);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

    // Mocked response structure based on the refined approach
    // This would come from your backend which calls the LLM API
    let mockResponse = {
      recommendedSpecialties: [
        {
          name: "General Physician",
          reason:
            "Often the first point of contact for a broad range of initial symptoms.",
        },
      ],
      potentialAreas: ["General viral infection", "Stress-related fatigue"],
      disclaimer:
        "This information is AI-generated based on general knowledge and is for informational purposes only. It is NOT a medical diagnosis or advice. Symptoms can be caused by many different conditions. Please consult a qualified medical professional for an accurate diagnosis and personalized treatment plan. If your symptoms are severe or rapidly worsening, seek immediate medical attention.",
    };

    if (
      symptoms.toLowerCase().includes("chest pain") &&
      symptoms.toLowerCase().includes("breath")
    ) {
      mockResponse.recommendedSpecialties = [
        {
          name: "Cardiologist",
          reason:
            "Chest pain and shortness of breath can be related to heart conditions.",
        },
        {
          name: "Pulmonologist",
          reason: "These symptoms can also indicate respiratory issues.",
        },
        {
          name: "General Physician",
          reason: "Good for an initial overall assessment.",
        },
      ];
      mockResponse.potentialAreas = [
        "Cardiovascular concerns",
        "Respiratory issues",
        "Acute anxiety",
      ];
    } else if (
      symptoms.toLowerCase().includes("skin") ||
      symptoms.toLowerCase().includes("rash")
    ) {
      mockResponse.recommendedSpecialties = [
        { name: "Dermatologist", reason: "Specializes in skin conditions." },
      ];
      mockResponse.potentialAreas = [
        "Allergic reaction",
        "Skin infection",
        "Eczema/Psoriasis (general categories)",
      ];
    }
    // --- End Simulation ---

    setAnalysisResult(mockResponse);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
      <motion.div
        className="container mx-auto max-w-2xl w-full text-center"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6 transform transition-all hover:scale-110">
            <LightBulbIcon />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            AI Symptom <span className="text-blue-600">Guidance</span>
          </h1>
          <p className="text-slate-600 mt-4 text-md sm:text-lg leading-relaxed max-w-xl mx-auto">
            Describe your symptoms below. Our AI will provide information on
            potential medical specialties to consult and general areas of
            concern.
          </p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleAnalyzeSymptoms}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6"
        >
          <div>
            <label
              htmlFor="symptoms"
              className="block text-sm font-medium text-slate-700 mb-2 text-left"
            >
              How are you feeling? (e.g., "persistent headache and dizziness for
              2 days")
            </label>
            <textarea
              id="symptoms"
              rows="5"
              value={symptoms}
              onChange={(e) => {
                setSymptoms(e.target.value);
                setError("");
              }}
              placeholder="The more details you provide, the better our AI can guide you..."
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-shadow"
              aria-describedby="symptoms-description"
            />
            <p
              id="symptoms-description"
              className="mt-2 text-xs text-slate-500 text-left"
            >
              This tool does not provide medical diagnosis. Always consult a
              doctor for health concerns.
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-600 text-left -mt-2">{error}</p>
          )}
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-base
                        ${
                          isLoading
                            ? "bg-slate-400 cursor-not-allowed text-slate-700"
                            : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        }`}
            whileHover={
              !isLoading
                ? { y: -2, boxShadow: "0 8px 15px rgba(59,130,246,0.3)" }
                : {}
            }
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                Analyzing Symptoms...
              </div>
            ) : (
              "Get AI Guidance"
            )}
          </motion.button>
        </motion.form>

        {analysisResult && (
          <motion.div
            key={JSON.stringify(analysisResult)} // Re-trigger animation on new result
            variants={resultCardVariants}
            className="mt-10 bg-white p-6 sm:p-8 rounded-xl shadow-xl text-left"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5 border-b pb-3">
              AI Guidance Report
            </h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium text-slate-700 mb-2 flex items-center">
                <StethoscopeIcon /> Recommended Specialties to Consider:
              </h4>
              <ul className="list-none space-y-2 pl-0">
                {analysisResult.recommendedSpecialties.map(
                  (specialty, index) => (
                    <li
                      key={index}
                      className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md"
                    >
                      <strong className="text-blue-700">
                        {specialty.name}:
                      </strong>
                      <span className="text-sm text-slate-600 ml-1">
                        {specialty.reason}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium text-slate-700 mb-2 flex items-center">
                <InformationCircleIcon /> Potential Areas for Discussion with a
                Doctor:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 pl-5">
                {analysisResult.potentialAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mt-2">
                These are general categories and not specific diagnoses. Many
                conditions can share symptoms.
              </p>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-yellow-800 text-sm">
              <strong className="font-semibold">Important Disclaimer:</strong>
              <p className="mt-1">{analysisResult.disclaimer}</p>
            </div>

            <div className="mt-8 text-center">
              <Link
                to={`/find-doctors?specialty=${
                  analysisResult.recommendedSpecialties[0]?.name || ""
                }`}
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-150 text-base"
              >
                Find a{" "}
                {analysisResult.recommendedSpecialties[0]?.name || "Doctor"}
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AiAnalyzerPage;
