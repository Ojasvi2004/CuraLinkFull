import React from "react";
import { motion } from "framer-motion";

// Example Icons (replace with actual icon components e.g., from Heroicons or React Icons)
// For social media, you'd typically use their brand icons
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.61.823 2.981 2.074 3.798-.768-.024-1.483-.233-2.11-.583v.06c0 2.254 1.607 4.131 3.737 4.564-.39.106-.803.164-1.227.164-.3 0-.593-.028-.877-.082.593 1.844 2.307 3.183 4.341 3.221-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.512 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.603.91-.658 1.7-1.477 2.323-2.41z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4c2.21 0 4 1.791 4 4s-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const linkHoverVariants = {
    hover: { color: "#3b82f6", x: 2, transition: { duration: 0.2 } }, // text-blue-500
  };

  const socialIconHoverVariants = {
    hover: { scale: 1.2, color: "#3b82f6", transition: { duration: 0.2 } }, // text-blue-500
    tap: { scale: 0.9 },
  };

  return (
    <motion.footer
      className="bg-slate-800 text-slate-300 pt-16 pb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: About CuraLink */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-white mb-4">CuraLink</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Connecting you to trusted healthcare professionals with AI-powered
              guidance and seamless digital consultations. Your health,
              simplified.
            </p>
            <div className="mt-6 flex space-x-4">
              <motion.a
                href="#"
                aria-label="Facebook"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                variants={socialIconHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FacebookIcon />
              </motion.a>
              <motion.a
                href="#"
                aria-label="Twitter"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                variants={socialIconHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <TwitterIcon />
              </motion.a>
              <motion.a
                href="#"
                aria-label="LinkedIn"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                variants={socialIconHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <LinkedInIcon />
              </motion.a>
              <motion.a
                href="#"
                aria-label="Instagram"
                className="text-slate-400 hover:text-blue-500 transition-colors"
                variants={socialIconHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <InstagramIcon />
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <motion.a
                  href="#search-doctors"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  Find a Doctor
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#symptom-analyzer"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  AI Symptom Analyzer
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#how-it-works"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  How It Works
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#about-us"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  About Us
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#contact"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  Contact
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: For Patients */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-medium text-white mb-4">
              For Patients
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <motion.a
                  href="/login"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  Patient Login
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="/register"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  Patient Registration
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="/faq"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  FAQ
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="/privacy-policy"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  Privacy Policy
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  Terms of Service
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Contact Us */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-medium text-white mb-4">
              Get In Touch
            </h4>
            <address className="not-italic text-sm space-y-2 text-slate-400">
              <p>123 Health St, Wellness City, HC 12345</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@curalink.com"
                  className="text-blue-400 hover:underline"
                >
                  support@curalink.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+1234567890"
                  className="text-blue-400 hover:underline"
                >
                  (123) 456-7890
                </a>
              </p>
            </address>
            {/* Optional: Newsletter Signup */}
            <form className="mt-6">
              <label htmlFor="footer-email" className="sr-only">
                Email for newsletter
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  id="footer-email"
                  placeholder="Your email for updates"
                  className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-100 border border-slate-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-800"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-slate-700 pt-8 mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { delay: 0.5, duration: 0.5 },
          }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-slate-400">
            © {currentYear} CuraLink. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Designed with care for your well-being.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
