// src/components/Layout/PageLayout.js
import React from 'react';
import { motion } from 'framer-motion';

const PageLayout = ({ pageTitle, pageSubtitle, children, headerMaxWidth = "max-w-xl", contentMaxWidth = "max-w-none" }) => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut", staggerChildren: 0.15 } },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: -25, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }, // A nice ease
    },
  };

  const contentCardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header Section */}
        <motion.div
          variants={headerItemVariants}
          className={`mb-8 sm:mb-12 text-center lg:text-left ${headerMaxWidth} lg:mx-0 mx-auto`}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-slate-600 mt-3 text-lg leading-relaxed">
              {pageSubtitle}
            </p>
          )}
        </motion.div>

        {/* Main Content Card Area */}
        <motion.div
          variants={contentCardVariants}
          className={`bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl ${contentMaxWidth} mx-auto`}
        >
          {children} {/* This is where the specific page content will be rendered */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PageLayout;