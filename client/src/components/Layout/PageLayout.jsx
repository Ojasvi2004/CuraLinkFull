import React from 'react';
import { motion } from 'framer-motion';

const PageLayout = ({ pageTitle, pageSubtitle, children }) => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const contentCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1, duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={headerItemVariants} className="mb-8 sm:mb-10 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-slate-600 mt-3 text-lg max-w-xl mx-auto lg:mx-0">
              {pageSubtitle}
            </p>
          )}
        </motion.div>
        <motion.div
          variants={contentCardVariants}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-xl"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PageLayout;