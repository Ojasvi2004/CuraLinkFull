import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Example Icons (Replace with actual icons from a library like Heroicons) ---
const CalendarManageIcon = () => <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm10-10h.01M7 11h.01M17 11h.01M7 15h.01M12 15h.01M17 15h.01"></path></svg>;
const QueueIcon = () => <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
const PatientRecordIcon = () => <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const VideoConsultIcon = () => <svg className="w-12 h-12 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h10M4 10h10M4 14h10M4 18h10"></path></svg>;
const GrowIcon = () => <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
const ProfileIcon = () => <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
// --- End Example Icons ---

const doctorFeatures = [
    { icon: <CalendarManageIcon />, title: "Manage Availability", description: "Easily set and update your consultation slots for both in-person and digital appointments." },
    { icon: <QueueIcon />, title: "Live Patient Queue", description: "Efficiently manage your patient flow with a real-time queue updater, reducing wait times." },
    { icon: <VideoConsultIcon />, title: "Secure Telemedicine", description: "Offer high-quality video consultations directly through our secure platform." },
    { icon: <PatientRecordIcon />, title: "Access Patient History", description: "View relevant (patient-shared) medical history and notes for informed consultations." },
    { icon: <ProfileIcon />, title: "Build Your Digital Presence", description: "Create a professional profile, showcase your expertise, and connect with more patients." },
    { icon: <GrowIcon />, title: "Grow Your Practice", description: "Expand your reach, attract new patients, and streamline your administrative tasks." },
];


const DoctorLandingPage = () => {
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
    };

    const headerItemVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12, duration: 0.7 } },
    };

    const featureCardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    };

    const cardHoverEffect = {
        hover: {
          y: -8,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transition: { type: "spring", stiffness: 300, damping: 15 }
        }
    };

    return (
        <div className="bg-white text-slate-800">
            {/* Hero Section */}
            <motion.section
                className="relative py-20 sm:py-32 lg:py-40 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-center"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('your-doctor-hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div> {/* Replace with a suitable BG */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div variants={headerItemVariants}>
                        <span className="inline-block bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
                            FOR MEDICAL PROFESSIONALS
                        </span>
                    </motion.div>
                    <motion.h1
                        variants={headerItemVariants}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
                    >
                        Elevate Your Practice with <span className="text-blue-600">CuraLink</span>
                    </motion.h1>
                    <motion.p
                        variants={headerItemVariants}
                        className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Join our network of esteemed doctors. Streamline your appointments, expand your reach with telemedicine, and focus on what matters most – your patients.
                    </motion.p>
                    <motion.div variants={headerItemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/doctor/register"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg transform hover:scale-105"
                        >
                            Register Your Clinic/Practice
                        </Link>
                        <Link
                            to="/doctor/login"
                            className="w-full sm:w-auto bg-transparent hover:bg-slate-100 text-blue-600 font-semibold py-3.5 px-8 rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all duration-300 text-lg shadow-sm"
                        >
                            Doctor Login
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section for Doctors */}
            <motion.section
                className="py-16 sm:py-24 bg-slate-50"
                variants={pageVariants} // Re-use page variant for section entry
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <motion.h2 variants={headerItemVariants} className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                            Platform Advantages
                        </motion.h2>
                        <motion.p variants={headerItemVariants} className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                            Tools Designed for Modern Medical Practice
                        </motion.p>
                        <motion.p variants={headerItemVariants} className="mt-4 max-w-2xl text-lg sm:text-xl text-slate-600 mx-auto">
                            CuraLink provides a comprehensive suite of features to help you manage your practice efficiently and connect with patients effectively.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctorFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={featureCardVariants}
                                whileHover="hover"
                                className="bg-white p-6 py-8 rounded-xl shadow-lg border-t-4 border-blue-500 flex flex-col items-center text-center h-full"
                            >
                                <motion.div variants={cardHoverEffect} className="flex flex-col items-center h-full">
                                    <div className={`p-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-5 shadow-inner`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">{feature.description}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* How It Works / Benefits Section */}
            <motion.section
                className="py-16 sm:py-24 bg-white"
                variants={pageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div variants={featureCardVariants}>
                            <img
                                src="https://images.unsplash.com/photo-1584515933487-750f40589918?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" // Replace with relevant image
                                alt="Doctor using CuraLink platform"
                                className="rounded-xl shadow-2xl object-cover w-full"
                            />
                        </motion.div>
                        <motion.div variants={featureCardVariants}>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-5">Streamline Your Practice, Enhance Patient Care</h2>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-xs font-bold">1</span>
                                    <span><strong className="text-slate-700">Easy Onboarding:</strong> Quickly set up your profile and list your clinic(s) and services.</span>
                                ตรฐาน</li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-xs font-bold">2</span>
                                    <span><strong className="text-slate-700">Flexible Scheduling:</strong> Define your physical and teleconsultation hours with our intuitive calendar tools.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-xs font-bold">3</span>
                                    <span><strong className="text-slate-700">Reach More Patients:</strong> Increase your visibility and offer convenient digital consultations to a wider audience.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3 mt-1 text-xs font-bold">4</span>
                                    <span><strong className="text-slate-700">Focus on Care:</strong> Reduce administrative overhead with automated reminders and streamlined workflows.</span>
                                </li>
                            </ul>
                            <Link
                                to="/doctor/register"
                                className="mt-8 inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Get Started Today
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Testimonial/Quote Section (Optional) */}
            <motion.section
                className="py-16 sm:py-24 bg-indigo-700 text-white"
                variants={pageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.blockquote variants={headerItemVariants} className="text-2xl sm:text-3xl italic font-medium max-w-3xl mx-auto leading-relaxed">
                        “CuraLink has transformed how I connect with my patients, offering flexibility and efficiency I didn't have before. The telemedicine feature is a game-changer.”
                    </motion.blockquote>
                    <motion.p variants={headerItemVariants} className="mt-6 text-lg font-semibold text-indigo-200">
                        - Dr. R. Chauhan, General Medicine (Example)
                    </motion.p>
                </div>
            </motion.section>
        </div>
    );
};

export default DoctorLandingPage;