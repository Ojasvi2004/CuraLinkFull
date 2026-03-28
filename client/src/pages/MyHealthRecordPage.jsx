import { useState, useMemo, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { PencilIcon } from '@heroicons/react/24/solid';
import axios from "axios";
import { Authcontext } from "../Context/AuthContext";


const FolderOpenIcon = () => (
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
      d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
    ></path>
  </svg>
);
const UploadIcon = () => (
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
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
    />
  </svg>
);
const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V17l-4 4v-8.586L3.293 6.707A1 1 0 013 6V4z"
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
const DocumentDownloadIcon = () => (
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
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);
const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    ></path>
  </svg>
);




const recordTypes = [
  "All",
  "Lab Report",
  "Discharge Summary",
  "Vaccination",
  "Imaging",
  "Doctor Note",
  "Other",
];

const getISODate = (date) => {
  return date.toISOString().split("T")[0];
}

const MyHealthRecordsPage = () => {
  const { token, settoken } = useContext(Authcontext)
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);


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
  const recordCardHover = {
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

 const filteredRecords = useMemo(() => {
  return records
    .filter((record) => {
      const type = record.recordType || "";
      const source = record.source || "";
      const fileName = record.fileName || "";
      const tags = record.tags || [];

      return (
        (filterType === "All" ||
          type.toLowerCase().includes(filterType.toLowerCase())) &&
        (
          type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tags.some(tag =>
            (tag || "").toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}, [records, filterType, searchTerm]);

  const GetHealthRecords = async (req, res) => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/getHealthRecordsForUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setRecords(response.data.records);
        console.log("Successfull fetch.", response.data);
      }
    } catch (error) {
      console.log("Error occurred in fetching.", error);

    }
  }

  useEffect(() => {
    GetHealthRecords();
  }, [])


const DeleteHealthRecord = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/user/deleteUserRecord/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
    
      setRecords((prev) => prev.filter((record) => record._id !== id));

      console.log("Successfully deleted");
    }
  } catch (error) {
    console.log("Error occurred in deletion.", error);
  }
};
const handleUploadRecord = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("recordType", e.target.uploadRecordType.value);
  formData.append("source", e.target.uploadSource.value);
  formData.append("fileName", e.target.uploadFile.files[0]?.name);
  formData.append("metadata", e.target.uploadSummary.value);

  const tags = e.target.uploadTags.value
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag);

  formData.append("tags", JSON.stringify(tags));

  formData.append("file", e.target.uploadFile.files[0]); // 🔥 IMPORTANT

  try {
    const response = await axios.post(
      "http://localhost:8000/api/user/uploadHealthRecord",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      GetHealthRecords();
      setShowUploadModal(false);
    }
  } catch (error) {
    console.log(error);
  }
};



  const RecordUploadModal = () => {{}
    const [recordType, setRecordType] = useState("");

    const isImaging =
      recordType.toLowerCase().includes("imaging") ||
      recordType.toLowerCase().includes("x-ray");

    return (
      <motion.div
        key="uploadModal"
        variants={modalOuterVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        onClick={() => setShowUploadModal(false)}
      >
        <motion.div
          variants={modalContentVariants}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Upload New Health Record
          </h2>
          <form onSubmit={handleUploadRecord} className="space-y-4">
            {/* Record Type Select */}
            <div>
              <label
                htmlFor="uploadRecordType"
                className="block text-sm font-medium text-slate-700"
              >
                Record Type
              </label>
              <select
                name="uploadRecordType"
                id="uploadRecordType"
                required
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Record Type</option>
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Source */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="uploadDate"
                  className="block text-sm font-medium text-slate-700"
                >
                  Date of Record
                </label>
                <input
                  type="date"
                  name="uploadDate"
                  id="uploadDate"
                  defaultValue={getISODate(new Date())}
                  required
                  className="mt-1 block w-full input-style"
                />
              </div>
              <div>
                <label
                  htmlFor="uploadSource"
                  className="block text-sm font-medium text-slate-700"
                >
                  Source/Facility
                </label>
                <input
                  type="text"
                  name="uploadSource"
                  id="uploadSource"
                  placeholder="e.g., City Hospital, Self"
                  required
                  className="mt-1 block w-full input-style"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="uploadFile"
                className="block text-sm font-medium text-slate-700"
              >
                Select File (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                name="uploadFile"
                id="uploadFile"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="uploadTags"
                className="block text-sm font-medium text-slate-700"
              >
                Tags (comma-separated, optional)
              </label>
              <input
                type="text"
                name="uploadTags"
                id="uploadTags"
                placeholder="e.g., blood test, annual checkup, cardiology"
                className="mt-1 block w-full input-style"
              />
            </div>

            {/* Metadata subform: only show if not Imaging */}
            {!isImaging && (
              <>
                <div>
                  <label
                    htmlFor="uploadNotes"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Notes
                  </label>
                  <textarea
                    name="uploadNotes"
                    id="uploadNotes"
                    placeholder="Optional summary for dr.bot"
                    className="mt-1 block w-full input-style"
                  />
                </div>
                <div>
                  <label
                    htmlFor="uploadSummary"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Metadata Summary
                  </label>
                  <input
                    type="text"
                    name="uploadSummary"
                    id="uploadSummary"
                    placeholder="Optional metadata info"
                    className="mt-1 block w-full input-style"
                  />
                </div>
              </>
            )}

            <style jsx>{`
            .input-style {
              @apply px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
            }
          `}</style>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-5">
              <motion.button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Upload Record
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
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
                My Health <span className="text-blue-600">Records</span>
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Securely store, manage, and access your medical documents and
                reports.
              </p>
            </div>
            <motion.button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 lg:mt-0 whitespace-nowrap bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center self-center lg:self-auto"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <UploadIcon /> <span className="ml-2">Upload New Record</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="relative w-full">
              <label
                htmlFor="searchTermRecords"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Search Records
              </label>
              <div className="absolute inset-y-0 left-0 top-6 pl-3 flex items-center pointer-events-none">
                {/* <SearchIcon /> */}
              </div>
              <input
                type="text"
                id="searchTermRecords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by type, source, filename, tag..."
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="filterRecordType"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Filter by Type
              </label>
              <select
                id="filterRecordType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
              >
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-slate-500 md:col-span-2 lg:col-span-1 lg:text-right pt-5">
              Displaying {filteredRecords.length} of {records.length} records.
            </div>
          </div>
        </motion.div>

        {/* Health Records List */}
        {filteredRecords.length > 0 ? (
          <motion.div
            key={filterType + searchTerm}
            className="space-y-5"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredRecords.map((record) => (
              <motion.div
                key={record._id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              >
                <motion.div variants={recordCardHover} className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700">
                        {record.recordType}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Source: {record.source}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 sm:mt-0 whitespace-nowrap">
                      Date:{" "}
                      {new Date(
                        record.date + "T00:00:00Z"
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-1 font-medium">
                    File:{" "}
                    <span className="font-normal text-slate-600">
                      {record.fileName}
                    </span>
                  </p>
                  {record.tags && record.tags.length > 0 && (
                    <div className="mt-2 mb-3">
                      {record.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full mr-1.5 mb-1 inline-block"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 items-center mt-4 border-t border-slate-100 pt-3">
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium transition-colors flex items-center"
                    >
                      <EyeIcon /> <span className="ml-1.5">View/Download</span>
                    </a>
                    <button
                      onClick={() =>
                        alert(`Editing ${record.fileName} (UI Only)`)
                      }
                      className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center"
                    >
                      < PencilIcon className="w-4 h-4 mr-1" /> Edit Details
                    </button>
                    <button
                      onClick={() =>
                        {alert(`Deleting ${record.fileName}`);
                         DeleteHealthRecord(record._id)}
                      }
                      className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center"
                    >
                      <TrashIcon /> <span className="ml-1">Delete</span>
                    </button>
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
            {/* <FolderOpenIcon /> */}
            <h3 className="mt-4 text-lg font-medium text-slate-800">
              No health records found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm || filterType !== "All"
                ? "No records match your current filters."
                : "Start by uploading your first medical document."}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Record
            </button>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showUploadModal && <RecordUploadModal />}
      </AnimatePresence>

      {/* Footer Placeholder */}
      <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm mt-16">
        CuraLink - Patient Portal Footer
      </div>
    </div>
  );
};

export default MyHealthRecordsPage;
