import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

// Placeholder Icons (Replace with actual icons)
const MissionIcon = () => (
  <svg
    className="w-12 h-12 text-blue-600 mb-4"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m4 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"></path>
  </svg>
);
const VisionIcon = () => (
  <svg
    className="w-12 h-12 text-indigo-600 mb-4"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>
);
const ValuesIcon = () => (
  <svg
    className="w-12 h-12 text-teal-600 mb-4"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
  </svg>
);
const PatientCareIcon = () => (
  <svg
    className="w-10 h-10 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 1.5A9.5 9.5 0 002.5 11v9.5A2.5 2.5 0 005 23h14a2.5 2.5 0 002.5-2.5V11A9.5 9.5 0 0012 1.5zm0 0V4m0 15v-3.5m0-5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 11.5h2.5m13 0H16"
    ></path>
  </svg>
); // Simplified icon
const SecurityLockIcon = () => (
  <svg
    className="w-10 h-10 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    ></path>
  </svg>
);
const InnovationIcon = () => (
  <svg
    className="w-10 h-10 text-yellow-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 1v2.5m0 17v-2.5m0-12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-7.5 7.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm15 0a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0zm-7.5 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
    ></path>
  </svg>
);

// Placeholder team images
const teamMember1 = "https://via.placeholder.com/150/A78BFA/FFFFFF?text=Evelyn";
const teamMember2 = "https://via.placeholder.com/150/9CA3AF/FFFFFF?text=Alex";
const teamMember3 = "https://via.placeholder.com/150/FBBF24/FFFFFF?text=Priya";
const ourStoryImage =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
const howItWorksImage =
  "https://images.unsplash.com/photo-1581091226809-5c04E0607502?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"; // Replace

const AboutUsPage = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.99],
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "circOut" },
    },
  };

  const imageZoomVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99] },
    },
  };

  return (
    <div className="bg-white text-slate-800 overflow-x-hidden">
      {/* Hero Section for About Page */}
      <section className="relative h-[80vh] sm:h-[90vh] lg:h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Subtle static background pattern if not using an image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('your-subtle-abstract-light-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <motion.div
          className="relative z-10 container mx-auto px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                delay: 0.2,
                duration: 0.7,
                type: "spring",
                stiffness: 100,
              },
            }}
          >
            About <span className="text-blue-600">CuraLink</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.4, duration: 0.7, ease: "easeOut" },
            }}
          >
            Pioneering a future where intelligent technology and compassionate
            healthcare converge for everyone, making quality medical support
            accessible and understandable.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <motion.section
        className="py-16 sm:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={itemVariants}>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 inline-block">
              Our Genesis
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              The Journey to Simplify Your Healthcare
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              CuraLink was born from a deeply personal observation: navigating
              the healthcare system can often feel like a maze – complex,
              fragmented, and overwhelming. We saw patients struggling to
              identify the right specialists, enduring long waits, and feeling
              lost in a sea of medical jargon. This wasn't just an
              inconvenience; it was a barrier to timely and effective care.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Driven by a desire to make a tangible difference, our founding
              team—a collective of passionate technologists, experienced
              healthcare advocates, and user-centric design thinkers—embarked on
              a mission. Our shared vision was clear: to build an intelligent,
              empathetic bridge connecting patients directly to the quality care
              they deserve, irrespective of their location or medical literacy.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We believe that technology, when thoughtfully applied, can
              humanize healthcare, not complicate it. Every feature within
              CuraLink, from our AI-powered symptom analyzer to our seamless
              telemedicine capabilities, is meticulously crafted with the
              patient's journey and well-being at its absolute core.
            </p>
          </motion.div>
          <motion.div variants={imageZoomVariants} className="mt-10 lg:mt-0">
            <img
              src={ourStoryImage}
              alt="Diverse team collaborating or a patient having a positive interaction"
              className="rounded-xl shadow-2xl object-cover w-full h-auto max-h-[500px]"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values Section */}
      <motion.section
        className="py-16 sm:py-24 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-slate-900"
            >
              Our Guiding Principles
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <motion.div
              variants={itemVariants}
              className="p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <MissionIcon />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                Our Mission
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To empower every individual by providing intuitive, AI-driven
                access to a network of trusted healthcare professionals and
                services, fostering informed decisions and ultimately leading to
                better health outcomes for all.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                <VisionIcon />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                Our Vision
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To be the most trusted and comprehensive digital health
                platform, seamlessly integrating cutting-edge technology with
                compassionate, patient-first care, making proactive healthcare
                universally accessible and deeply personalized.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="inline-block p-3 bg-teal-100 rounded-full mb-4">
                <ValuesIcon />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                Our Core Values
              </h3>
              <ul className="text-slate-600 leading-relaxed space-y-1.5 text-left sm:text-center list-none sm:list-disc sm:list-inside">
                <li>Patient-Centricity Above All</li>
                <li>Unwavering Pursuit of Innovation</li>
                <li>Absolute Trust & Transparency</li>
                <li>Commitment to Accessibility</li>
                <li>Empathy in Every Interaction</li>
                <li>Excellence in Service Delivery</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* NEW: "Our Commitment to You" Section */}
      <motion.section
        className="py-16 sm:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-slate-900"
            >
              Our Commitment to You
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
            >
              At CuraLink, we're not just building a platform; we're fostering a
              community built on trust and dedicated to your well-being.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-3 bg-green-100 rounded-full mb-4">
                <PatientCareIcon />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Exceptional Patient Care
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your health journey is unique. We strive to provide tools and
                connections that respect your individuality and support your
                specific needs with empathy and professionalism.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-3 bg-red-100 rounded-full mb-4">
                <SecurityLockIcon />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Data Security & Privacy
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                We understand the sensitivity of health information. CuraLink is
                built with robust security measures to protect your data and
                ensure your privacy at every step.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-3 bg-yellow-100 rounded-full mb-4">
                {" "}
                <InnovationIcon />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Continuous Innovation
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                The world of healthcare and technology is always evolving. We
                are committed to continuous learning, improvement, and
                integrating the latest advancements to better serve you.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* NEW: "How CuraLink Works" Section */}
      <motion.section
        className="py-16 sm:py-24 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-slate-900"
            >
              Getting Started is Easy
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Experience a new era of healthcare access in just a few simple
              steps.
            </motion.p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={itemVariants} className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Tell Us Your Symptoms (Optional)",
                  description:
                    "Use our intuitive AI Symptom Analyzer to get intelligent guidance on which type of specialist might be best for you.",
                  icon: "💡",
                },
                {
                  step: 2,
                  title: "Find Your Doctor",
                  description:
                    "Search our comprehensive directory of verified doctors. Filter by specialty, location, insurance, ratings, and more.",
                  icon: "🔍",
                },
                {
                  step: 3,
                  title: "Book with Ease",
                  description:
                    "View doctor availability and book your in-person or digital consultation in a few simple clicks.",
                  icon: "🗓️",
                },
                {
                  step: 4,
                  title: "Consult & Connect",
                  description:
                    "Attend your appointment, whether it's a face-to-face visit or a secure video call directly through CuraLink.",
                  icon: "💬",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mr-4 shadow-md">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-1">
                      {item.icon} {item.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={imageZoomVariants} className="mt-10 lg:mt-0">
              <img
                src={howItWorksImage}
                alt="Illustrative image of CuraLink platform usage"
                className="rounded-xl shadow-2xl object-cover w-full h-auto max-h-[550px]"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Meet The Team Section (Potentially more detail here if needed) */}
      <motion.section
        className="py-16 sm:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            Meet Our Core Team
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-600 max-w-xl mx-auto mb-12 sm:mb-16"
          >
            A dedicated group of innovators passionate about transforming
            healthcare through technology and empathy.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                name: "Dr. Evelyn Reed",
                role: "Chief Medical Officer",
                img: teamMember1,
                bio: "With over 20 years in clinical practice, Dr. Reed ensures CuraLink's medical guidance is sound, ethical, and patient-first. Passionate about integrating clinical expertise with cutting-edge technology.",
              },
              {
                name: "Alex Chen",
                role: "Lead AI Engineer",
                img: teamMember2,
                bio: "Alex spearheads our AI development, focusing on creating intelligent systems that are both powerful and easy to understand. Driving innovation to make healthcare smarter.",
              },
              {
                name: "Priya Sharma",
                role: "Head of Product & UX",
                img: teamMember3,
                bio: "Priya is obsessed with the user. She leads the design and product strategy, ensuring CuraLink is intuitive, accessible, and truly solves patient and doctor needs.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group"
              >
                <motion.img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto mb-5 object-cover border-4 border-transparent group-hover:border-blue-300 transition-all duration-300"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 0.1 + index * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                  viewport={{ once: true }}
                />
                <h4 className="text-xl font-semibold text-slate-800 mb-1">
                  {member.name}
                </h4>
                <p className="text-blue-600 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed px-2">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section (As before) */}
      <motion.section
        className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 0.7 } }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.2, duration: 0.5 },
            }}
            viewport={{ once: true }}
          >
            Ready to Experience Smarter Healthcare?
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.4, duration: 0.5 },
            }}
            viewport={{ once: true }}
          >
            Join CuraLink today and take the first step towards a more connected
            and empowered health journey.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{
              scale: 1,
              opacity: 1,
              transition: { delay: 0.6, duration: 0.5 },
            }}
            viewport={{ once: true }}
          >
            <NavLink
              to={'/signup'}
              className="inline-block bg-white text-blue-600 font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-all duration-300 text-lg transform hover:scale-105"
            >
              Get Started with CuraLink
            </NavLink>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
