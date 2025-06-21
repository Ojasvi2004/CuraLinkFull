import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // Assuming you might link from here

// --- Example Icons (Ensure these are proper React components or SVGs) ---
const CalendarPlusIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM12 18h.01M12 15v3m-3-3v3m6-3v3"></path></svg>;
const ChevronLeftIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ChevronRightIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
const ClockIcon = () => <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const OfficeBuildingIcon = () => <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>;
const VideoCameraIcon = () => <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h10M4 10h10M4 14h10M4 18h10"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const PlusCircleIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
// --- End Example Icons ---

const getISODate = (dateObj) => dateObj.toISOString().split('T')[0];
const formatDisplayDate = (dateStr) => new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); // Added 'Z' for UTC interpretation

const mockExistingSlotsByDate = { // Mock data
  [getISODate(new Date())]: [
    { id: 'slot001', startTime: '10:00', endTime: '10:15', type: 'PHYSICAL', clinicId: 'clinic1', isBooked: true, patientName: "Rohan P." },
    { id: 'slot002', startTime: '10:15', endTime: '10:30', type: 'PHYSICAL', clinicId: 'clinic1', isBooked: false },
  ],
};
const mockClinics = [
  { id: 'clinic1', name: 'City Clinic, Andheri' },
  { id: 'clinic2', name: 'Wellness Center, Bandra' },
];

const DoctorSetAvailabilityPage = () => {
  const [selectedDate, setSelectedDate] = useState(getISODate(new Date()));
  const [availabilityForSelectedDate, setAvailabilityForSelectedDate] = useState([]);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);

  const [newBlock, setNewBlock] = useState({
    startTime: '09:00',
    endTime: '12:00',
    slotDuration: '15',
    type: 'PHYSICAL',
    clinicId: mockClinics.length > 0 ? mockClinics[0].id : '',
  });

  useEffect(() => {
    setAvailabilityForSelectedDate(mockExistingSlotsByDate[selectedDate] || []);
  }, [selectedDate]);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut" } },
  };
  const slotCardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };
  const modalOuterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay:0.1 } },
  };
  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
  };
  const buttonHover = {
    hover: { y: -2, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.97 }
  };
  const inputLabelClass = "block text-sm font-medium text-slate-700 mb-1";
  const inputFieldClass = "mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors";


  const handleDateChange = (offset) => {
    const currentDateObj = new Date(selectedDate + 'T00:00:00Z'); // Use Z for UTC
    currentDateObj.setUTCDate(currentDateObj.getUTCDate() + offset);
    setSelectedDate(getISODate(currentDateObj));
  };

  const handleNewBlockChange = (e) => {
    const { name, value } = e.target;
    setNewBlock(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAvailabilityBlock = (e) => {
    e.preventDefault();
    const newSlots = [];
    let currentTime = new Date(`${selectedDate}T${newBlock.startTime}:00Z`); // Ensure seconds and Z for UTC
    const blockEndTime = new Date(`${selectedDate}T${newBlock.endTime}:00Z`);
    const duration = parseInt(newBlock.slotDuration);

    if (currentTime >= blockEndTime) {
        alert("Start time must be before end time.");
        return;
    }
    if (!duration || duration <=0) {
        alert("Invalid slot duration.");
        return;
    }

    while (currentTime < blockEndTime) {
      const slotStartTimeStr = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
      if (slotEndTime > blockEndTime) break;
      const slotEndTimeStr = slotEndTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

      newSlots.push({
        id: `newslot_${Date.now()}_${newSlots.length}`,
        startTime: slotStartTimeStr,
        endTime: slotEndTimeStr,
        type: newBlock.type,
        clinicId: newBlock.type === 'PHYSICAL' ? newBlock.clinicId : null,
        isBooked: false,
      });
      currentTime = slotEndTime;
    }
    setAvailabilityForSelectedDate(prev => [...prev, ...newSlots].sort((a,b) => a.startTime.localeCompare(b.startTime)));
    setShowAddBlockModal(false);
  };

  const handleDeleteSlot = (slotId) => {
    if (window.confirm("Are you sure you want to delete this unbooked slot?")) {
        alert(`Deleting slot ${slotId} (UI Only)`);
        setAvailabilityForSelectedDate(prev => prev.filter(slot => slot.id !== slotId));
    }
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
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
                    Manage Your <span className="text-blue-600">Availability</span>
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                    Set your consultation slots for physical and digital appointments.
                </p>
            </div>
            <motion.button
                onClick={() => setShowAddBlockModal(true)}
                className="mt-4 lg:mt-0 whitespace-nowrap bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center self-center lg:self-auto"
                variants={buttonHover} whileHover="hover" whileTap="tap"
            >
                <PlusCircleIcon/> Add Availability Block
            </motion.button>
          </div>
        </motion.div>

        {/* Date Selector */}
        <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
          <motion.button onClick={() => handleDateChange(-1)} title="Previous Day" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors" variants={buttonHover} whileHover="hover" whileTap="tap"><ChevronLeftIcon /></motion.button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-700">
              {formatDisplayDate(selectedDate)}
            </h2>
            <label htmlFor="date-picker-input" className="sr-only">Select Date</label>
            <input
              id="date-picker-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 text-center border-none focus:ring-0 text-sm text-slate-500 bg-transparent"
            />
          </div>
           <motion.button onClick={() => handleDateChange(1)} title="Next Day" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors" variants={buttonHover} whileHover="hover" whileTap="tap"><ChevronRightIcon /></motion.button>
        </motion.div>

        {/* Availability Display */}
        <motion.div variants={itemVariants} className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-3">
            Slots for {new Date(selectedDate + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>
          {availabilityForSelectedDate.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              <AnimatePresence> {/* For exit animations of slots */}
                {availabilityForSelectedDate.map((slot) => (
                  <motion.div
                    key={slot.id}
                    layout // Enable layout animation
                    variants={slotCardVariants}
                    initial="initial" animate="animate" exit="exit"
                    whileHover={{ scale: 1.03, y: -2, boxShadow: "0 5px 10px rgba(0,0,0,0.1)" }}
                    className={`p-3 rounded-lg border text-center cursor-default relative
                                  ${slot.isBooked ? 'bg-red-100 border-red-300 text-red-700 line-through'
                                                : slot.type === 'DIGITAL' ? 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100'
                                                                        : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'}`}
                  >
                    <p className="font-semibold text-sm sm:text-base">{slot.startTime} - {slot.endTime}</p>
                    <div className="flex items-center justify-center text-xs opacity-80 mt-0.5">
                        {slot.type === 'DIGITAL' ? <VideoCameraIcon /> : <OfficeBuildingIcon />}
                        <span className="ml-1">{slot.type}</span>
                    </div>
                    {slot.clinicId && mockClinics.find(c=>c.id === slot.clinicId) &&
                        <p className="text-[10px] opacity-60 truncate mt-0.5">{mockClinics.find(c=>c.id === slot.clinicId).name.split(',')[0]}</p>
                    }
                    {slot.isBooked && slot.patientName &&
                        <p className="text-[10px] text-red-600 font-medium mt-0.5 truncate">Booked: {slot.patientName}</p>
                    }
                    {!slot.isBooked && (
                        <motion.button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="absolute -top-1.5 -right-1.5 bg-white p-0.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 shadow transition-all"
                            title="Delete Slot"
                            whileHover={{scale:1.2}} whileTap={{scale:0.9}}
                            initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.5}}
                        >
                            <TrashIcon />
                        </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p variants={itemVariants} className="text-slate-500 text-center py-10">
              No availability set for this date. Click "Add Availability Block" to create slots.
            </motion.p>
          )}
        </motion.div>
      </motion.div>

        {/* Modal for Adding Availability Block */}
        <AnimatePresence>
        {showAddBlockModal && (
            <motion.div
                key="addBlockModal"
                variants={modalOuterVariants}
                initial="hidden" animate="visible" exit="exit"
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                onClick={() => setShowAddBlockModal(false)}
            >
            <motion.div
                variants={modalContentVariants}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold text-slate-800 mb-6">Add New Availability Block</h2>
                <form onSubmit={handleAddAvailabilityBlock} className="space-y-4">
                    <div>
                        <label htmlFor="blockDate" className={inputLabelClass}>Date</label>
                        <input type="text" id="blockDate" value={formatDisplayDate(selectedDate)} readOnly className={`${inputFieldClass} bg-slate-100 cursor-not-allowed`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startTimeModal" className={inputLabelClass}>Start Time</label>
                            <input type="time" name="startTime" id="startTimeModal" value={newBlock.startTime} onChange={handleNewBlockChange} required className={`${inputFieldClass} bg-white`} />
                        </div>
                        <div>
                            <label htmlFor="endTimeModal" className={inputLabelClass}>End Time</label>
                            <input type="time" name="endTime" id="endTimeModal" value={newBlock.endTime} onChange={handleNewBlockChange} required className={`${inputFieldClass} bg-white`} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="slotDuration" className={inputLabelClass}>Slot Duration (minutes)</label>
                        <select name="slotDuration" id="slotDuration" value={newBlock.slotDuration} onChange={handleNewBlockChange} required className={`${inputFieldClass} bg-white`}>
                            <option value="10">10 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="20">20 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="blockType" className={inputLabelClass}>Consultation Type</label>
                        <select name="type" id="blockType" value={newBlock.type} onChange={handleNewBlockChange} required className={`${inputFieldClass} bg-white`}>
                            <option value="PHYSICAL">In-Person (Physical)</option>
                            <option value="DIGITAL">Digital (Telemedicine)</option>
                        </select>
                    </div>
                    {newBlock.type === 'PHYSICAL' && (
                        <div>
                            <label htmlFor="clinicIdModal" className={inputLabelClass}>Clinic Location</label>
                            <select name="clinicId" id="clinicIdModal" value={newBlock.clinicId} onChange={handleNewBlockChange} required={newBlock.type === 'PHYSICAL'} className={`${inputFieldClass} bg-white`}>
                                <option value="">Select Clinic</option>
                                {mockClinics.map(clinic => (
                                    <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                                ))}
                                {mockClinics.length === 0 && <option disabled>No clinics added yet</option>}
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-5">
                        <motion.button type="button" onClick={() => setShowAddBlockModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" variants={buttonHover} whileHover="hover" whileTap="tap">Cancel</motion.button>
                        <motion.button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors" variants={buttonHover} whileHover="hover" whileTap="tap">Create Slots</motion.button>
                    </div>
                </form>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

      {/* Footer Placeholder */}
      <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm mt-16">
        CuraLink for Doctors - Footer Placeholder
      </div>
    </div>
  );
};

export default DoctorSetAvailabilityPage;