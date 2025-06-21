import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Example Icons (Replace with actual icons from a library like Heroicons) ---
const CalendarDaysIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const VideoCameraIcon = () => <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h10M4 10h10M4 14h10M4 18h10"></path></svg>;
const BuildingOfficeIcon = () => <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>;
const ChevronLeftIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ChevronRightIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
const FilterIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V17l-4 4v-8.586L3.293 6.707A1 1 0 013 6V4z"></path></svg>;
// --- End Example Icons ---


// Mock Appointments Data - Replace with actual data fetched from API
const allMockAppointments = [
  { id: 'apt001', patientName: 'Rohan Patel', time: '10:30 AM', date: '2023-10-28', type: 'DIGITAL', status: 'Scheduled', notesPreview: 'Follow-up for hypertension...', clinicName: 'CuraLink Telehealth' },
  { id: 'apt002', patientName: 'Priya Kumari', time: '11:00 AM', date: '2023-10-28', type: 'PHYSICAL', status: 'Scheduled', notesPreview: 'Annual checkup.', clinicName: 'City Clinic, Andheri' },
  { id: 'apt003', patientName: 'Amit Singh', time: '11:30 AM', date: '2023-10-28', type: 'PHYSICAL', status: 'Checked-In', notesPreview: 'Knee pain assessment.', clinicName: 'City Clinic, Andheri' },
  { id: 'apt004', patientName: 'Sneha Iyer', time: '02:00 PM', date: '2023-10-28', type: 'DIGITAL', status: 'Scheduled', notesPreview: 'Discuss lab results.', clinicName: 'CuraLink Telehealth' },
  { id: 'apt005', patientName: 'Vijay Kumar', time: '09:00 AM', date: '2023-10-29', type: 'PHYSICAL', status: 'Scheduled', notesPreview: 'New patient consultation.', clinicName: 'Wellness Center, Bandra' },
  { id: 'apt006', patientName: 'Zara Khan', time: '04:00 PM', date: '2023-10-27', type: 'DIGITAL', status: 'Completed', notesPreview: 'Medication review complete.', clinicName: 'CuraLink Telehealth' },
  { id: 'apt007', patientName: 'Arjun Mehta', time: '03:00 PM', date: '2023-10-27', type: 'PHYSICAL', status: 'Completed', notesPreview: 'Post-op checkup fine.', clinicName: 'City Clinic, Andheri' },
];

// Helper to format date for display and comparison
const formatDate = (dateStr) => new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
const getISODate = (dateObj) => dateObj.toISOString().split('T')[0];


const DoctorAppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'upcoming', 'past'
  const [filterType, setFilterType] = useState('all'); // 'all', 'PHYSICAL', 'DIGITAL'

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
  const appointmentCardHover = {
    hover: { scale: 1.015, y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.08)", transition:{type:"spring", stiffness:400, damping:15} }
  };

  const handleDateChange = (offset) => {
    const currentDateObj = new Date(selectedDate + 'T00:00:00');
    currentDateObj.setDate(currentDateObj.getDate() + offset);
    setSelectedDate(getISODate(currentDateObj));
    setActiveTab('date'); // Switch to date view when navigating
  };

  const appointmentsToDisplay = useMemo(() => {
    let filtered = [];
    const todayISO = getISODate(new Date());

    if (activeTab === 'today') {
      filtered = allMockAppointments.filter(apt => apt.date === todayISO);
    } else if (activeTab === 'upcoming') {
      filtered = allMockAppointments.filter(apt => apt.date > todayISO && apt.status === 'Scheduled');
    } else if (activeTab === 'past') {
      filtered = allMockAppointments.filter(apt => apt.date < todayISO || (apt.date === todayISO && ['Completed', 'Cancelled', 'No-Show'].includes(apt.status)));
    } else { // 'date' tab
      filtered = allMockAppointments.filter(apt => apt.date === selectedDate);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(apt => apt.type === filterType);
    }
    return filtered.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
  }, [activeTab, selectedDate, filterType]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
              Manage <span className="text-blue-600">Appointments</span>
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              View your schedule, manage bookings, and prepare for consultations.
            </p>
          </div>
          <Link
            to="/doctor/availability"
            className="mt-4 sm:mt-0 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center self-start sm:self-center"
          >
            <CalendarDaysIcon/> <span className="ml-2">Set Availability</span>
          </Link>
        </motion.div>

        {/* Date Navigation & Filters */}
        <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <button onClick={() => handleDateChange(-1)} title="Previous Day" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeftIcon /></button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {setSelectedDate(e.target.value); setActiveTab('date');}}
                className="px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white w-40 text-center"
              />
              <button onClick={() => handleDateChange(1)} title="Next Day" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><ChevronRightIcon /></button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border border-slate-200 rounded-lg p-1 bg-slate-100">
              {['today', 'upcoming', 'past'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'today') setSelectedDate(getISODate(new Date()));
                  }}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
                                ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
                <FilterIcon/>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="py-2 px-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                    <option value="all">All Types</option>
                    <option value="PHYSICAL">In-Person</option>
                    <option value="DIGITAL">Digital</option>
                </select>
            </div>
          </div>
        </motion.div>

        {/* Selected Date/Tab Info */}
        <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl font-semibold text-slate-700">
                {activeTab === 'date' ? `Appointments for ${formatDate(selectedDate)}` :
                 activeTab === 'today' ? `Today's Appointments (${formatDate(selectedDate)})` :
                 activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Appointments"}
                 {filterType !== 'all' && ` (${filterType})`}
            </h2>
        </motion.div>


        {/* Appointments List */}
        {appointmentsToDisplay.length > 0 ? (
          <motion.div
            key={activeTab + selectedDate + filterType} // Re-trigger animation when data source changes
            className="space-y-5"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {appointmentsToDisplay.map((apt) => (
              <motion.div
                key={apt.id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              >
                <motion.div variants={appointmentCardHover} className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{apt.patientName}</h3>
                      <p className="text-xs text-slate-500">ID: {apt.id}</p>
                    </div>
                    <span
                      className={`whitespace-nowrap mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full
                                        ${apt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' : ''}
                                        ${apt.status === 'Checked-In' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                                        ${apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                                      `}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3 mb-4">
                    <div className="flex items-center">
                      <ClockIcon /> {apt.time} {activeTab !== 'today' && `on ${formatDate(apt.date)}`}
                    </div>
                    <div className="flex items-center">
                      {apt.type === 'DIGITAL' ? <VideoCameraIcon /> : <BuildingOfficeIcon />}
                      {apt.type === 'DIGITAL' ? 'Digital Consultation' : apt.clinicName || 'Clinic Not Specified'}
                    </div>
                  </div>
                  {apt.notesPreview && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-md mb-4 border border-slate-200">
                      Notes: {apt.notesPreview}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/doctor/appointment/${apt.id}`} // Link to specific appointment details
                      className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-3.5 py-2 rounded-md font-medium transition-colors"
                    >
                      View Details
                    </Link>
                    {apt.status === 'Scheduled' && apt.type === 'DIGITAL' && (
                      <Link to={`/doctor/start-call/${apt.id}`} className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-md font-medium transition-colors">Start Video Call</Link>
                    )}
                    {apt.status === 'Scheduled' && apt.type === 'PHYSICAL' && (
                      <button onClick={() => alert(`Marking ${apt.patientName} as Checked-In (UI Only)`)} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3.5 py-2 rounded-md font-medium transition-colors">Mark as Checked-In</button>
                    )}
                    {/* Add more actions like "Cancel", "Reschedule", "Add Notes" */}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-16 bg-white rounded-xl shadow-lg">
            <svg className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-800">No appointments found</h3>
            <p className="mt-1 text-sm text-slate-500">
              There are no appointments matching your current view or filters.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorAppointmentsPage;