import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // If you have a contact page for more questions

// --- Example Icons (Replace with actual icons) ---
const QuestionMarkIcon = () => <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 12.805 14.25 14.158 12.25 15.255c-1.43.755-2.003 1.628-2.003 2.745V19M12 21v.01"></path></svg>;
const ChevronDownIcon = ({ isOpen }) => (
    <svg className={`w-5 h-5 text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);
// --- End Example Icons ---

const faqData = [
  {
    question: "How do I register my clinic and myself on CuraLink?",
    answer: "Registration is simple! Click on the 'Register Your Clinic' button on our doctor's landing page. You'll be guided through a step-by-step process to provide your personal, professional, and clinic details. Our team will then verify your credentials before your profile goes live."
  },
  {
    question: "What kind of verification is required for doctors?",
    answer: "We require standard medical registration proof (e.g., MCI/State Medical Council registration number), degree certificates, and clinic registration documents (if applicable). This ensures that only qualified and verified doctors are listed on our platform, maintaining trust and quality."
  },
  {
    question: "How does the AI Symptom Analyzer benefit my practice?",
    answer: "While the AI Symptom Analyzer primarily guides patients to the *type* of specialist they might need, it can lead to more informed patients arriving at your clinic. For specialists, this can mean patients are more likely to be relevant to your field. We do not use it for direct diagnosis."
  },
  {
    question: "Can I manage multiple clinic locations?",
    answer: "Yes, our Doctor Portal allows you to add and manage multiple clinic locations, each with its own address, timings, and services offered. You can set distinct availability for each location."
  },
  {
    question: "How do I set my availability for appointments?",
    answer: "The Doctor Portal features an intuitive calendar tool where you can easily define your available time slots for both in-person and digital (telemedicine) consultations. You can set recurring availability or manage it day-by-day."
  },
  {
    question: "What are the fees for using CuraLink?",
    answer: "Our fee structure is transparent and designed to be fair. We typically offer different subscription plans with varying features. Please visit our 'Pricing' page or contact our support team for detailed information on current plans."
  },
  {
    question: "How does the telemedicine feature work?",
    answer: "Our secure telemedicine feature allows you to conduct video consultations directly through the CuraLink platform. When a patient books a digital slot, both you and the patient will receive a unique link to join the session at the scheduled time. It's designed to be easy to use and HIPAA-compliant (or compliant with relevant local data privacy laws)."
  },
  {
    question: "Is my patient data secure on CuraLink?",
    answer: "Absolutely. Data security and patient privacy are our top priorities. We employ robust encryption, secure servers, and adhere to strict data protection policies (like DPDPA in India) to safeguard all information. You control what patient information is accessible."
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentVariants = {
    collapsed: { height: 0, opacity: 0, marginTop: 0 },
    open: { height: "auto", opacity: 1, marginTop: "1rem", transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } } // Smooth ease
  };

  return (
    <motion.div className="border-b border-slate-200 last:border-b-0">
      <motion.button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 px-1 text-left text-slate-800 hover:text-blue-600 focus:outline-none"
        aria-expanded={isOpen}
        whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }} // bg-blue-50 with opacity
        transition={{duration:0.2}}
      >
        <span className="text-md sm:text-lg font-medium">{question}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={contentVariants}
            className="overflow-hidden" // Important for height animation
          >
            <p className="pb-5 px-1 text-slate-600 text-sm sm:text-base leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const DoctorFaqPage = () => {
  const [openAccordion, setOpenAccordion] = useState(null); // Store index of open accordion

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12, duration: 0.7 } },
  };

  const accordionContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
  };


  return (
    <div className="bg-white text-slate-800 min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="py-20 sm:py-28 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 text-center"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={headerItemVariants} className="mb-6">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg transform transition-all hover:scale-110">
                <QuestionMarkIcon />
            </div>
          </motion.div>
          <motion.h1
            variants={headerItemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight"
          >
            Frequently Asked <span className="text-blue-600">Questions</span>
          </motion.h1>
          <motion.p
            variants={headerItemVariants}
            className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed"
          >
            Find answers to common questions doctors have about joining and using the CuraLink platform.
          </motion.p>
        </div>
      </motion.section>

      {/* FAQ Accordion Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl"> {/* Constrain width for better readability */}
          <motion.div
            variants={accordionContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openAccordion === index}
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
              />
            ))}
          </motion.div>

          {/* Can't find answer section */}
          <motion.div
            className="mt-16 text-center p-8 bg-slate-50 rounded-xl border border-slate-200"
            initial={{opacity:0, y:30}}
            whileInView={{opacity:1, y:0, transition:{delay:0.5, duration:0.6}}}
            viewport={{once:true}}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              If you can't find the answer you're looking for in our FAQ, please don't hesitate to reach out to our dedicated support team.
            </p>
            <Link
              to="/doctor/contact" // Link to your doctor contact page
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Contact Doctor Support
            </Link>
          </motion.div>
        </div>
      </section>

       {/* Footer Placeholder */}
       <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm">
        CuraLink for Doctors - Footer Placeholder
      </div>
    </div>
  );
};

export default DoctorFaqPage;