import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Example Icons (Replace with actual icons) ---
const ChatBubbleLeftRightIcon = () => <svg className="w-10 h-10 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const PaperAirplaneIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 011-1h4.571a1 1 0 00.832-.445l-1.428-5L10.894 2.553zM12 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const ArrowLeftIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>;
// --- End Example Icons ---


const mockConversations = [ // Same mock data as before
  { id: 'convo001', doctorId: 'dr001', doctorName: 'Dr. Ananya Sharma', doctorProfilePic: 'https://via.placeholder.com/80/A78BFA/FFFFFF?text=AS', lastMessage: 'Yes, please continue the medication for another week and let me know how you feel.', lastMessageTimestamp: '2023-10-28T10:30:00Z', unreadCount: 0, messages: [{ id: 'msg1', sender: 'patient', text: 'Hello Dr. Sharma, I had a follow-up question about my medication.', timestamp: '2023-10-27T09:15:00Z' }, { id: 'msg2', sender: 'doctor', text: 'Hi Aarav, sure, what is your question?', timestamp: '2023-10-27T09:18:00Z' }, { id: 'msg3', sender: 'patient', text: 'Should I continue with the Atorvastatin even if I feel fine?', timestamp: '2023-10-27T09:20:00Z' }, { id: 'msg4', sender: 'doctor', text: 'Yes, please continue the medication for another week and let me know how you feel.', timestamp: '2023-10-28T10:30:00Z' }, ]},
  { id: 'convo002', doctorId: 'dr002', doctorName: 'Dr. Vikram Singh', doctorProfilePic: 'https://via.placeholder.com/80/9CA3AF/FFFFFF?text=VS', lastMessage: 'The fever should subside. Keep monitoring.', lastMessageTimestamp: '2023-10-27T15:45:00Z', unreadCount: 1, messages: [{ id: 'msg5', sender: 'patient', text: 'Dr. Singh, my child still has a slight fever after the consultation yesterday evening. Is that normal?', timestamp: '2023-10-27T14:00:00Z' }, { id: 'msg6', sender: 'doctor', text: 'The fever should subside. Keep monitoring. If it goes above 102°F or persists beyond 3 days, please bring him in.', timestamp: '2023-10-27T15:45:00Z' }]},
  { id: 'convo003', doctorId: 'dr003', doctorName: 'Dr. Priya Reddy', doctorProfilePic: '', lastMessage: 'Okay, sounds good. See you then!', lastMessageTimestamp: '2023-07-21T11:00:00Z', unreadCount: 0, messages: [{ id: 'msg7', sender: 'doctor', text: 'Okay, sounds good. See you then!', timestamp: '2023-07-21T11:00:00Z' }]}
];

const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return formatTime(timestamp); // Show time if today
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};


const PatientMessagesPage = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Start with no conversation selected on mobile
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // On larger screens, select the first conversation by default
  useEffect(() => {
    if (window.innerWidth >= 768 && mockConversations.length > 0 && !selectedConversationId) { // 768px is Tailwind's 'md' breakpoint
        setSelectedConversationId(mockConversations[0].id);
    }
  }, []);


  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  const sidebarVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.3, ease: "easeIn" } },
  };
  const chatAreaVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut", delay: 0.1 } },
    exit: { opacity: 0, x: "100%", transition: { duration: 0.3, ease: "easeIn" } },
  };
  const messageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const selectedConvo = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConvo?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;
    const newMsg = { id: `msg${Date.now()}`, sender: 'patient', text: newMessage, timestamp: new Date().toISOString() };
    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === selectedConversationId
          ? { ...convo, messages: [...convo.messages, newMsg], lastMessage: newMessage, lastMessageTimestamp: newMsg.timestamp, unreadCount: 0 }
          : convo
      ).sort((a,b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)) // Keep sorted by last message
    );
    setNewMessage('');
  };

  const handleSelectConversation = (convoId) => {
    setSelectedConversationId(convoId);
    // Potentially mark messages as read here via API call
    setConversations(prev => prev.map(c => c.id === convoId ? {...c, unreadCount: 0} : c));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 flex flex-col overflow-hidden"> {/* Prevent outer scroll */}
      <motion.div
        className="flex-grow container mx-auto py-0 md:py-6 lg:py-8 px-0 md:px-4 flex h-[calc(100vh-var(--navbar-height,4rem))] md:h-[calc(100vh-var(--navbar-height,5rem)-3rem)]" // Adjust based on your actual navbar height
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sidebar: Conversation List */}
        {/* On mobile, show sidebar if no conversation selected, or allow toggle */}
        <AnimatePresence>
        {(!selectedConversationId || window.innerWidth >= 768) && ( // Show sidebar if no convo selected on mobile, or always on md+
          <motion.aside
            key="sidebar"
            variants={sidebarVariants}
            initial="hidden" animate="visible" exit="exit"
            className={`w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-white md:rounded-l-xl shadow-xl flex flex-col h-full
                        ${selectedConversationId && window.innerWidth < 768 ? 'hidden' : 'flex'}`} // Hide on mobile if convo selected
          >
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">My Chats</h2>
              <div className="relative mt-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <SearchIcon /> </div>
                <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {conversations.sort((a,b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)).map(convo => (
                <motion.div
                  key={convo.id}
                  onClick={() => handleSelectConversation(convo.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer border-b border-slate-100 hover:bg-slate-100 transition-colors
                                  ${selectedConversationId === convo.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                  whileHover={{ x: window.innerWidth >= 768 ? 2 : 0 }} // Subtle hover on desktop
                  initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}
                >
                  {convo.doctorProfilePic ? (
                    <img src={convo.doctorProfilePic} alt={convo.doctorName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold flex-shrink-0">
                      {convo.doctorName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">{convo.doctorName}</h3>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{formatDate(convo.lastMessageTimestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500 truncate pr-1">{convo.lastMessage}</p>
                      {convo.unreadCount > 0 && (
                        <span className="ml-1 text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{convo.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
        </AnimatePresence>


        {/* Main Chat Area */}
        {/* On mobile, show chat area if a conversation IS selected */}
        <AnimatePresence>
        {(selectedConversationId || window.innerWidth >= 768) && selectedConvo && (
          <motion.main
            key="chatArea"
            variants={chatAreaVariants}
            initial="hidden" animate="visible" exit="exit"
            className={`flex-grow bg-white md:rounded-r-xl shadow-xl flex flex-col h-full
                        ${!selectedConversationId && window.innerWidth < 768 ? 'hidden' : 'flex'}`} // Hide on mobile if no convo selected
          >
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center gap-3 sticky top-0 bg-white z-10">
                {/* Back button for mobile */}
                {window.innerWidth < 768 && (
                    <button onClick={() => setSelectedConversationId(null)} className="p-1 text-slate-500 hover:text-blue-600 md:hidden">
                        <ArrowLeftIcon/>
                    </button>
                )}
                {selectedConvo.doctorProfilePic ? (
                  <img src={selectedConvo.doctorProfilePic} alt={selectedConvo.doctorName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                   <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold">
                    {selectedConvo.doctorName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-md sm:text-lg font-semibold text-slate-800">{selectedConvo.doctorName}</h2>
                  <p className="text-xs text-green-500">Online</p> {/* Placeholder status */}
                </div>
              </div>

              {/* Messages Display */}
              <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50">
                <AnimatePresence initial={false}>
                  {selectedConvo.messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      layout
                      variants={messageVariants}
                      initial="initial" animate="animate" exit="exit"
                      className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] sm:max-w-[65%] md:max-w-[60%] p-2.5 sm:p-3 rounded-xl shadow-sm
                                          ${msg.sender === 'patient' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}
                      >
                        <p className="text-sm leading-snug">{msg.text}</p>
                        <p className={`text-[10px] sm:text-xs mt-1 ${msg.sender === 'patient' ? 'text-blue-100 text-right' : 'text-slate-500 text-left'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Area */}
              <motion.div
                initial={{opacity:0, y:10}} animate={{opacity:1, y:0, transition:{delay:0.1}}}
                className="p-3 sm:p-4 border-t border-slate-200 bg-white sticky bottom-0"
              >
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
                  {/* Optional: Add attachment button here */}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-2.5 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
                  />
                  <motion.button
                    type="submit"
                    className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-md disabled:bg-slate-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!newMessage.trim()}
                  >
                    <PaperAirplaneIcon />
                  </motion.button>
                </form>
              </motion.div>
          </motion.main>
        )}
        </AnimatePresence>

        {/* Placeholder for when no conversation is selected on desktop */}
        {window.innerWidth >= 768 && !selectedConvo && conversations.length > 0 && (
            <motion.div
                key="noConvoSelectedDesktop"
                variants={chatAreaVariants} initial="hidden" animate="visible" exit="exit"
                className="flex-grow bg-white md:rounded-r-xl shadow-xl flex flex-col items-center justify-center text-center p-8 h-full"
            >
                <ChatBubbleLeftRightIcon />
                <h2 className="mt-4 text-xl font-semibold text-slate-700">Select a Conversation</h2>
                <p className="text-slate-500 text-sm mt-1">Choose a chat from the left panel to view messages.</p>
            </motion.div>
        )}
         {conversations.length === 0 && (
             <motion.div
                key="noConversations"
                variants={chatAreaVariants} initial="hidden" animate="visible" exit="exit"
                className="flex-grow bg-white md:rounded-xl shadow-xl flex flex-col items-center justify-center text-center p-8 h-full w-full"
            >
                <ChatBubbleLeftRightIcon />
                <h2 className="mt-4 text-xl font-semibold text-slate-700">No Chats Yet</h2>
                <p className="text-slate-500 text-sm mt-1">You can start a conversation with a doctor after a consultation.</p>
                <Link to="/find-doctors" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md">Find a Doctor</Link>
            </motion.div>
         )}


      </motion.div>
        <style jsx global>{`
        /* Simple CSS variable for navbar height - set this in your global CSS or layout if navbar is outside */
        :root {
          --navbar-height: 4rem; /* Adjust if your navbar height is different */
        }
        /* Custom scrollbar for chat areas */
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; /* slate-50 */ }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; /* slate-300 */ border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; /* slate-400 */ }
      `}</style>
    </div>
  );
};

export default PatientMessagesPage;