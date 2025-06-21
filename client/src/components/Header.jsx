import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Example: Using Heroicons (npm install @heroicons/react)
// import { MagnifyingGlassIcon, LightBulbIcon, CheckBadgeIcon, ChatBubbleLeftRightIcon, UsersIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityRange = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.1, 0.3, 0.3, 0]
  );

  const viewportVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.99],
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "circOut" },
    }, // Changed ease
  };

  const buttonHoverVariants = {
    hover: { y: -3, transition: { duration: 0.2, ease: "easeInOut" } },
    tap: { scale: 0.97, y: 0 },
  };

  // Placeholder for icons - replace with actual icon components
  const SearchIcon = () => <span className="mr-2">🔍</span>;
  const LightBulbIcon = () => <span className="mr-2">💡</span>;
  const VerifiedIcon = () => <span className="text-blue-500 mr-1.5">✓</span>; // Example
  const EasyAppointmentsIcon = () => (
    <span className="text-blue-500 mr-1.5">🗓️</span>
  );
  const DigitalConsultationsIcon = () => (
    <span className="text-blue-500 mr-1.5">💬</span>
  );

  return (
    <div>
      <section
        className="relative bg-cover bg-white h-screen flex items-center overflow-hidden" // Assuming white BG image, or just white color
        // style={{ backgroundImage: "url('wmremove-transformed.jpeg')" }} // If using an image
      >
        {/* Optional: Subtle decorative background elements for depth */}
        <motion.div
          style={{ y: yRange, opacity: opacityRange }}
          className="absolute top-1/4 -left-16 w-48 h-48 bg-blue-50 rounded-full -z-10 hidden lg:block filter blur-xl"
          aria-hidden="true"
        ></motion.div>
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 80]),
            opacity: opacityRange,
          }}
          className="absolute bottom-1/4 -right-20 w-56 h-56 bg-indigo-50 rounded-3xl transform rotate-12 -z-10 hidden lg:block filter blur-xl"
          aria-hidden="true"
        ></motion.div>

        {/* Content Container */}
        <motion.div
          className="relative z-10 w-full px-4 sm:px-8 lg:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={viewportVariants}
        >
          <div className="mx-auto text-center max-w-2xl xl:max-w-3xl py-12 sm:py-20">
            <motion.div variants={itemVariants}>
              <span
                className="
                  inline-block bg-gradient-to-r from-blue-50 to-indigo-100
                  text-blue-700 text-xs sm:text-sm font-semibold
                  px-4 py-2 rounded-full mb-6 sm:mb-8
                  shadow-sm border border-blue-200
                "
              >
                Your Health, Connected.
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="
                text-4xl sm:text-5xl lg:text-6xl
                font-bold sm:font-extrabold /* Adjusted font weight for clarity */
                mb-5 sm:mb-6
                text-slate-900 /* Rich dark for heading */
                leading-tight sm:leading-tight
              "
            >
              Find Your Doctor, <br className="hidden sm:inline" />
              Get <span className="text-blue-600">AI-Powered Guidance</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="
                text-md sm:text-lg lg:text-xl
                mb-10 sm:mb-12
                text-slate-600 /* Softer dark gray for paragraph */
                max-w-lg sm:max-w-xl mx-auto leading-relaxed
              "
            >
              CuraLink helps you effortlessly connect with trusted medical
              professionals. Use our smart symptom analyzer or search directly
              to find the care you need.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <motion.a
                href="#search-doctors"
                className="
                  w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-3.5
                  text-base sm:text-lg font-medium
                  text-white bg-blue-600
                      rounded-full
                  hover:bg-blue-700
                  transition-all duration-200 ease-in-out
                  shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  flex items-center justify-center
                "
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <SearchIcon /> {/* Replace with actual icon */}
                Search Doctors
              </motion.a>
              <motion.a
                href="#symptom-analyzer"
                className="
                  w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-3.5
                  text-base sm:text-lg font-medium
                  text-blue-600 bg-white
                  border-2 border-blue-500 
                  rounded-full
                  hover:bg-blue-50 hover:border-blue-600
                  transition-all duration-200 ease-in-out
                  shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  flex items-center justify-center
                "
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <LightBulbIcon /> {/* Replace with actual icon */}
                Analyze Symptoms (AI)
              </motion.a>
            </motion.div>

            {/* Trust Indicators - Enhanced Styling */}
            <motion.div
              variants={itemVariants}
              className="mt-16 sm:mt-20 text-slate-700 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-x-10"
            >
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <VerifiedIcon />
                Verified Doctors
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <EasyAppointmentsIcon />
                Easy Appointments
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <DigitalConsultationsIcon />
                Digital Consultations
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Header;
