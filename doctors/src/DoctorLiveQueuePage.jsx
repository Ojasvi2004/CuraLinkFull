import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Example Icons (Replace with actual icons) ---
const PlayIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>;
const PauseIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 100-2H9V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 100-2h-1V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>;
const StopIcon = () => <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>;
const NextIcon = () => <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
const SkipIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7m7-14l-7 7 7 7"></path></svg>; // Double arrow for skip
const NoShowIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const UserCircleSmIcon = () => <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>;
// --- End Example Icons ---

// Mock Data - Replace with actual data fetched from API & updated via WebSockets
const initialQueueData = {
  queueId: 'q20231028dr001',
  doctorId: 'dr001',
  clinicId: 'clinic1',
  date: new Date().toISOString().split('T')[0],
  queueItems: [
    { appointmentId: 'apt001', patientId: 'pat001', patientName: 'Rohan Patel', tokenNumber: 'A001', nominalStartTime: '10:00 AM', status: 'WAITING' },
    { appointmentId: 'apt002', patientId: 'pat002', patientName: 'Priya Kumari', tokenNumber: 'A002', nominalStartTime: '10:15 AM', status: 'WAITING' },
    { appointmentId: 'apt003', patientId: 'pat003', patientName: 'Amit Singh', tokenNumber: 'A003', nominalStartTime: '10:30 AM', status: 'WAITING' },
    { appointmentId: 'apt004', patientId: 'pat004', patientName: 'Sneha Iyer', tokenNumber: 'A004', nominalStartTime: '10:45 AM', status: 'WAITING' },
    { appointmentId: 'apt005', patientId: 'pat005', patientName: 'Vijay Kumar', tokenNumber: 'A005', nominalStartTime: '11:00 AM', status: 'WAITING' },
  ],
  currentServingToken: null,
  status: 'NOT_STARTED', // NOT_STARTED, ACTIVE, PAUSED, ENDED
  estimatedWaitTimeMinutes: 0, // This would be dynamically calculated or set
  sessionStartTime: '09:00 AM',
  sessionEndTime: '01:00 PM',
};


const DoctorLiveQueuePage = () => {
  const [queue, setQueue] = useState(initialQueueData);
  const [isLoadingAction, setIsLoadingAction] = useState(false); // For button loading states

  // Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut" } },
  };
  const queueItemVariants = {
    initial: { opacity: 0, x: -30, height: 0 },
    animate: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 200, damping: 25, duration: 0.4 } },
    exit: { opacity: 0, x: 30, height: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };
  const buttonHover = {
    hover: { y: -2, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.97 }
  };

  // --- SIMULATED QUEUE MANAGEMENT ACTIONS ---
  // In a real app, these would be API calls that also trigger WebSocket updates.
  const handleStartQueue = () => {
    if (queue.status === 'ENDED') {
        // Reset queue if ended, or fetch new queue for the day
        setQueue({...initialQueueData, status: 'ACTIVE', date: new Date().toISOString().split('T')[0]});
        return;
    }
    setQueue(prev => ({ ...prev, status: 'ACTIVE' }));
    // API call to backend
  };
  const handlePauseQueue = () => {
    setQueue(prev => ({ ...prev, status: 'PAUSED' }));
    // API call
  };
  const handleResumeQueue = () => {
    setQueue(prev => ({ ...prev, status: 'ACTIVE' }));
    // API call
  };
  const handleEndQueue = () => {
    setQueue(prev => ({ ...prev, status: 'ENDED', currentServingToken: null }));
    // API call
  };

  const handleCallNext = () => {
    setIsLoadingAction(true);
    setTimeout(() => { // Simulate API call
      setQueue(prev => {
        const newQueue = { ...prev };
        const waitingPatients = newQueue.queueItems.filter(p => p.status === 'WAITING' || p.status === 'DELAYED');

        if (newQueue.currentServingToken) {
          const currentIdx = newQueue.queueItems.findIndex(p => p.tokenNumber === newQueue.currentServingToken);
          if (currentIdx !== -1) newQueue.queueItems[currentIdx].status = 'COMPLETED';
        }

        if (waitingPatients.length > 0) {
          const nextPatientToken = waitingPatients[0].tokenNumber;
          const nextPatientIdx = newQueue.queueItems.findIndex(p => p.tokenNumber === nextPatientToken);
          newQueue.queueItems[nextPatientIdx].status = 'SERVING';
          newQueue.currentServingToken = nextPatientToken;
        } else {
          newQueue.currentServingToken = null; // No more patients
        }
        return newQueue;
      });
      setIsLoadingAction(false);
    }, 700);
  };

  const handlePatientAction = (appointmentId, action) => {
    // action can be "SKIP", "NO_SHOW"
    alert(`${action} patient ${appointmentId} (UI only)`);
    // In real app: API call, then update queue state (likely via WebSocket)
    setQueue(prev => ({
        ...prev,
        queueItems: prev.queueItems.map(item =>
            item.appointmentId === appointmentId ? { ...item, status: action } : item
        )
    }));
    if (action === 'SKIP' && queue.currentServingToken === queue.queueItems.find(p=>p.appointmentId === appointmentId)?.tokenNumber) {
        handleCallNext(); // If skipped current serving patient, call next
    }
  };

  const currentlyServingPatient = queue.queueItems.find(p => p.tokenNumber === queue.currentServingToken && p.status === 'SERVING');
  const waitingList = queue.queueItems.filter(p => p.status === 'WAITING' || p.status === 'DELAYED').sort((a,b) => a.tokenNumber.localeCompare(b.tokenNumber));

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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            Live Patient <span className="text-blue-600">Queue Management</span>
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Manage today's patient flow efficiently and keep patients informed.
          </p>
          <p className="text-sm text-slate-500 mt-1">Date: {new Date(queue.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        {/* Queue Control Buttons */}
        <motion.div variants={itemVariants} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            {queue.status === 'NOT_STARTED' || queue.status === 'ENDED' ? (
              <motion.button onClick={handleStartQueue} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm flex items-center" variants={buttonHover} whileHover="hover" whileTap="tap">
                <PlayIcon /> Start Today's Queue
              </motion.button>
            ) : queue.status === 'ACTIVE' ? (
              <>
                <motion.button onClick={handlePauseQueue} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm flex items-center" variants={buttonHover} whileHover="hover" whileTap="tap">
                  <PauseIcon /> Pause Queue
                </motion.button>
                <motion.button onClick={handleEndQueue} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm flex items-center" variants={buttonHover} whileHover="hover" whileTap="tap">
                  <StopIcon /> End Queue
                </motion.button>
              </>
            ) : queue.status === 'PAUSED' ? (
              <>
                <motion.button onClick={handleResumeQueue} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm flex items-center" variants={buttonHover} whileHover="hover" whileTap="tap">
                  <PlayIcon /> Resume Queue
                </motion.button>
                <motion.button onClick={handleEndQueue} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg text-sm shadow-sm flex items-center" variants={buttonHover} whileHover="hover" whileTap="tap">
                  <StopIcon /> End Queue
                </motion.button>
              </>
            ) : null}
          </div>
          {queue.status !== 'NOT_STARTED' && queue.status !== 'ENDED' && (
            <p className="mt-3 text-xs text-slate-500">Session: {queue.sessionStartTime} - {queue.sessionEndTime}</p>
          )}
        </motion.div>

        {/* Main Queue Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currently Serving */}
          <motion.section variants={itemVariants} className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl h-fit sticky top-24"> {/* Sticky for current patient */}
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Currently Serving</h2>
            <AnimatePresence mode="wait">
              {currentlyServingPatient ? (
                <motion.div
                  key={currentlyServingPatient.tokenNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{duration: 0.3}}
                  className="p-6 bg-blue-500 text-white rounded-lg text-center my-4"
                >
                  <p className="text-sm opacity-80">Token Number</p>
                  <p className="text-5xl font-bold my-2">{currentlyServingPatient.tokenNumber}</p>
                  <p className="font-medium">{currentlyServingPatient.patientName}</p>
                  <p className="text-xs opacity-80">Scheduled: {currentlyServingPatient.nominalStartTime}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="no-patient"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-6 bg-slate-100 text-slate-500 rounded-lg text-center my-4"
                >
                  <p className="text-2xl font-semibold">{(queue.status === 'ACTIVE' || queue.status === 'PAUSED') && waitingList.length === 0 ? 'Queue Clear!' : 'Not Serving'}</p>
                  {(queue.status === 'ACTIVE' || queue.status === 'PAUSED') && waitingList.length === 0 && <p className="text-sm">All patients attended or queue empty.</p>}
                   {queue.status === 'NOT_STARTED' && <p className="text-sm">Queue not started for today.</p>}
                   {queue.status === 'ENDED' && <p className="text-sm">Queue has ended for the day.</p>}
                </motion.div>
              )}
            </AnimatePresence>
            {(queue.status === 'ACTIVE' || (queue.status === 'PAUSED' && currentlyServingPatient)) && (
                 <motion.button
                    onClick={handleCallNext}
                    disabled={isLoadingAction || waitingList.length === 0}
                    className={`w-full mt-4 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out text-base flex items-center justify-center
                                ${isLoadingAction || waitingList.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    variants={buttonHover} whileHover="hover" whileTap="tap"
                >
                    {isLoadingAction ? 'Processing...' : 'Call Next Patient'} <NextIcon />
                </motion.button>
            )}
            {queue.status === 'PAUSED' && !currentlyServingPatient && waitingList.length > 0 && (
                 <p className="text-center text-sm text-yellow-600 mt-4">Queue is paused. Click "Resume Queue" to call next.</p>
            )}
          </motion.section>

          {/* Waiting List */}
          <motion.section variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-5 border-b border-slate-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                Waiting List ({waitingList.length})
                </h2>
                {queue.status === 'ACTIVE' && queue.estimatedWaitTimeMinutes > 0 && (
                    <p className="text-sm text-slate-500">Est. Avg. Wait: ~{queue.estimatedWaitTimeMinutes} mins</p>
                )}
            </div>

            { (queue.status === 'ACTIVE' || queue.status === 'PAUSED') && waitingList.length > 0 ? (
              <motion.div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2" layout>
                <AnimatePresence>
                  {waitingList.map((patient, index) => (
                    <motion.div
                      key={patient.appointmentId}
                      layout // Enables layout animation when items are reordered/removed
                      variants={queueItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`p-3.5 rounded-lg border flex items-center justify-between transition-shadow hover:shadow-md
                                  ${index === 0 && queue.status === 'ACTIVE' ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${index === 0 && queue.status === 'ACTIVE' ? 'bg-green-500' : 'bg-blue-500'} text-white flex items-center justify-center text-sm font-bold mr-3 shadow`}>
                          {patient.tokenNumber}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{patient.patientName}</p>
                          <p className="text-xs text-slate-500">Scheduled: {patient.nominalStartTime} {index === 0 && queue.status === 'ACTIVE' ? <span className="ml-2 text-green-600 font-semibold">(Next)</span> : ''}</p>
                        </div>
                      </div>
                      {queue.status === 'ACTIVE' && index === 0 && ( // Show actions only for the next patient if queue is active
                         <div className="flex gap-1.5">
                            <motion.button title="Skip" onClick={() => handlePatientAction(patient.appointmentId, 'SKIPPED')} className="p-1.5 text-orange-500 hover:bg-orange-100 rounded-full" variants={buttonHover} whileHover="hover" whileTap="tap"><SkipIcon/></motion.button>
                            <motion.button title="No Show" onClick={() => handlePatientAction(patient.appointmentId, 'NO_SHOW')} className="p-1.5 text-red-500 hover:bg-red-100 rounded-full" variants={buttonHover} whileHover="hover" whileTap="tap"><NoShowIcon/></motion.button>
                         </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <p className="text-slate-500 text-center py-10">
                {queue.status === 'NOT_STARTED' ? 'Queue has not started for the day.' :
                 queue.status === 'ENDED' ? 'Queue has ended for the day.' :
                 'Waiting list is currently empty.'}
              </p>
            )}
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorLiveQueuePage;