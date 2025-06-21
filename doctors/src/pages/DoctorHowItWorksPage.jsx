import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Example Icons (Replace these with actual icons from a library like Heroicons) ---
const RegisterIcon = () => <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L10.828 17H8v-2.828l8.586-8.586z"></path></svg>;
const ProfileSetupIcon = () => <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const CalendarIcon = () => <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const ConsultIcon = () => <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const GrowIcon = () => <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
// --- End Example Icons ---

const stepsData = [
  {
    stepNumber: 1,
    icon: <RegisterIcon />,
    title: 'Register & Verify Your Profile',
    description: "Sign up in minutes. Complete your professional profile and submit necessary documents for our quick verification process. We ensure only qualified doctors join our network.",
    image: "https://images.unsplash.com/photo-1580281658223-9b997053590a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", // Replace
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-600"
  },
  {
    stepNumber: 2,
    icon: <ProfileSetupIcon />,
    title: 'Set Up Your Clinic & Services',
    description: "Add details about your clinic(s), services offered, consultation fees, and upload a professional profile picture to attract patients.",
    image: "https://images.unsplash.com/photo-1551193500-706504063504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80", // Replace
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
    textColor: "text-indigo-600"
  },
  {
    stepNumber: 3,
    icon: <CalendarIcon />,
    title: 'Define Your Availability',
    description: "Use our intuitive calendar to set your available slots for both in-person and secure digital (telemedicine) consultations. Manage your schedule with ease.",
    image: "https://images.unsplash.com/photo-1600841569825-60b7d8f3e8e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80", // Replace
    bgColor: "bg-teal-50",
    borderColor: "border-teal-500",
    textColor: "text-teal-600"
  },
  {
    stepNumber: 4,
    icon: <ConsultIcon />,
    title: 'Start Consulting & Managing Patients',
    description: "Receive appointment bookings, manage your live patient queue for same-day visits, conduct teleconsultations, and (simulated) issue digital prescriptions, all through your CuraLink Doctor Portal.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", // Replace
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
    textColor: "text-purple-600"
  },
  {
    stepNumber: 5,
    icon: <GrowIcon />,
    title: 'Grow Your Practice',
    description: "Leverage CuraLink to enhance your digital presence, connect with a wider patient base, and gain insights to optimize your services. Focus on care, we'll help with the rest.",
    image: "https://images.unsplash.com/photo-1590650153355-8e40995904ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80", // Replace
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-600"
  },
];


const DoctorHowItWorksPage = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.15 } },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12, duration: 0.7 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };
  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };


  return (
    <div className="bg-white text-slate-800">
      {/* Hero Section */}
      <motion.section
        className="py-20 sm:py-28 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-center"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            variants={headerItemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight"
          >
            How <span className="text-blue-600">CuraLink Works</span> for Doctors
          </motion.h1>
          <motion.p
            variants={headerItemVariants}
            className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed"
          >
            Joining CuraLink is simple. Follow these steps to enhance your practice, connect with patients, and leverage our powerful digital tools.
          </motion.p>
        </div>
      </motion.section>

      {/* Steps Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {stepsData.map((step, index) => (
              <motion.div
                key={step.stepNumber}
                className={`flex flex-col gap-8 items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }} // Trigger when 25% of item is in view
                transition={{ staggerChildren: 0.2 }}
              >
                {/* Text Content */}
                <motion.div className="lg:w-1/2" variants={stepVariants}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} shadow-md mb-6`}>
                    {step.icon}
                  </div>
                  <span className={`block text-sm font-semibold ${step.textColor} uppercase tracking-wider mb-2`}>
                    Step {step.stepNumber}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{step.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                    {step.description}
                  </p>
                </motion.div>

                {/* Image */}
                <motion.div className="lg:w-1/2" variants={imageVariants}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-xl shadow-2xl object-cover w-full h-64 sm:h-80 lg:h-96 transform transition-all duration-500 hover:scale-105"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center"
        initial={{opacity:0}}
        whileInView={{opacity:1, transition:{duration:0.7}}}
        viewport={{once:true}}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{y:20, opacity:0}}
            whileInView={{y:0, opacity:1, transition:{delay:0.2, duration:0.5}}}
            viewport={{once:true}}
          >
            Ready to Transform Your Practice?
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed"
            initial={{y:20, opacity:0}}
            whileInView={{y:0, opacity:1, transition:{delay:0.4, duration:0.5}}}
            viewport={{once:true}}
          >
            Join the growing network of forward-thinking doctors on CuraLink.
          </motion.p>
          <motion.div
             initial={{scale:0.8, opacity:0}}
             whileInView={{scale:1, opacity:1, transition:{delay:0.6, duration:0.5}}}
             viewport={{once:true}}
          >
            <Link
              to="/doctor/register"
              className="inline-block bg-white text-blue-600 font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-all duration-300 text-lg transform hover:scale-105"
            >
              Register Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* You can import and use your DoctorFooter component here */}
      {/* <DoctorFooter /> */}
       <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm">
        CuraLink for Doctors - Footer Placeholder
      </div>
    </div>
  );
};

export default DoctorHowItWorksPage;