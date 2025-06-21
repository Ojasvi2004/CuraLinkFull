import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Example Icons (Replace with actual icons from a library like Heroicons) ---
const UsersGroupIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.235-1.26-.652-1.741M12 12h.01M17 10h.01M7 10h.01M7 17h.01M12 17h.01M17 17h.01M12 20v-2a3 3 0 00-5.356-1.857M12 20H7"></path></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const SortAscendingIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>;
const UserCircleIcon = ({ size = "w-10 h-10" }) => <svg className={`${size} text-slate-400`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>;
// --- End Example Icons ---


// Mock Patient Data - Replace with actual data fetched from API
const mockPatientsData = [
  { id: 'pat001', name: 'Rohan Patel', lastVisit: '2023-10-28', nextAppointment: '2023-11-15', primaryConcern: 'Hypertension', profilePic: 'https://via.placeholder.com/80/A78BFA/FFFFFF?text=RP' },
  { id: 'pat002', name: 'Priya Kumari', lastVisit: '2023-09-10', nextAppointment: null, primaryConcern: 'Routine Checkup', profilePic: 'https://via.placeholder.com/80/9CA3AF/FFFFFF?text=PK' },
  { id: 'pat003', name: 'Amit Singh', lastVisit: '2023-10-28', nextAppointment: '2023-12-01', primaryConcern: 'Knee Pain', profilePic: '' }, // No pic
  { id: 'pat004', name: 'Sneha Iyer', lastVisit: '2023-08-05', nextAppointment: null, primaryConcern: 'Lab Results Discussion', profilePic: 'https://via.placeholder.com/80/FBBF24/FFFFFF?text=SI' },
  { id: 'pat005', name: 'Vijay Kumar', lastVisit: '2023-10-29', nextAppointment: '2023-11-10', primaryConcern: 'New Consultation', profilePic: 'https://via.placeholder.com/80/34D399/FFFFFF?text=VK' },
];

const DoctorMyPatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name_asc'); // e.g., 'name_asc', 'last_visit_desc'

  // Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut" } },
  };
  const listVariants = {
    visible: { transition: { staggerChildren: 0.07 } },
    hidden: {}
  };
  const patientCardHover = {
    hover: { scale: 1.02, y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.08)", transition:{type:"spring", stiffness:350, damping:15} }
  };

  const filteredAndSortedPatients = useMemo(() => {
    let patients = mockPatientsData.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Basic sorting example
    if (sortBy === 'name_asc') {
      patients.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      patients.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'last_visit_desc') {
      patients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    } else if (sortBy === 'last_visit_asc') {
      patients.sort((a, b) => new Date(a.lastVisit) - new Date(b.lastVisit));
    }
    return patients;
  }, [searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
                My <span className="text-blue-600">Patients</span>
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                View and manage your patient roster.
              </p>
            </div>
            <Link
              to="/doctor/add-patient" // Placeholder for adding a new patient manually
              className="mt-4 lg:mt-0 whitespace-nowrap bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center self-center lg:self-auto"
            >
              <UsersGroupIcon /> <span className="ml-2">Add New Patient</span>
            </Link>
          </div>
        </motion.div>

        {/* Search and Sort Bar */}
        <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name..."
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SortAscendingIcon />
              <label htmlFor="sortBy" className="text-sm font-medium text-slate-700 whitespace-nowrap">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 px-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-auto"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="last_visit_desc">Last Visit (Newest)</option>
                <option value="last_visit_asc">Last Visit (Oldest)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Patient List/Grid */}
        {filteredAndSortedPatients.length > 0 ? (
          <motion.div
            key={searchTerm + sortBy} // Re-trigger list animation on filter/sort change
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedPatients.map((patient) => (
              <motion.div
                key={patient.id}
                variants={itemVariants} // Individual card entry
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-200 ease-out"
              >
                <motion.div variants={patientCardHover} className="p-5 sm:p-6 flex flex-col items-center text-center flex-grow">
                  {patient.profilePic ? (
                    <img src={patient.profilePic} alt={patient.name} className="w-20 h-20 rounded-full object-cover mb-4 shadow-md border-2 border-blue-200"/>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4 shadow-md border-2 border-slate-300">
                      <UserCircleIcon size="w-12 h-12" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{patient.name}</h3>
                  <p className="text-xs text-slate-500 mb-1">Patient ID: {patient.id}</p>
                  <p className="text-sm text-blue-600 font-medium mb-3">{patient.primaryConcern || 'General'}</p>

                  <div className="text-xs text-slate-500 space-y-1 my-3 py-3 border-t border-b border-slate-100 w-full">
                    <p><strong>Last Visit:</strong> {patient.lastVisit ? new Date(patient.lastVisit  + 'T00:00:00').toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Next Appointment:</strong> {patient.nextAppointment ? new Date(patient.nextAppointment + 'T00:00:00').toLocaleDateString() : 'None Scheduled'}</p>
                  </div>

                  <div className="mt-auto w-full pt-3">
                    <Link
                      to={`/doctor/patient-record/${patient.id}`} // Link to detailed patient record
                      className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors duration-150 shadow-sm hover:shadow-md"
                    >
                      View Full Record
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-16 bg-white rounded-xl shadow-lg">
            <svg className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-800">No patients found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm ? "No patients match your search term." : "Your patient list is currently empty."}
            </p>
            {/* Optionally add a link/button to "Add New Patient" here too */}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorMyPatientsPage;