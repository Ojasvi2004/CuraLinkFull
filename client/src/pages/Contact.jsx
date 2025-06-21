import React from "react";
import { motion } from "framer-motion";

// Example Icons (Replace with actual icon components e.g., from Heroicons)
const MailIcon = () => (
  <svg
    className="w-6 h-6 text-blue-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);
const PhoneIcon = () => (
  <svg
    className="w-6 h-6 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.308 1.154a11.034 11.034 0 005.37 5.37l1.154-2.308a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    ></path>
  </svg>
);
const LocationIcon = () => (
  <svg
    className="w-6 h-6 text-purple-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);
const FaqIcon = () => (
  <svg
    className="w-6 h-6 text-orange-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 12.805 14.25 14.158 12.25 15.255c-1.43.755-2.003 1.628-2.003 2.745V19M12 21v.01"
    ></path>
  </svg>
);

const Contact = () => {
  // Removed form state (formData, isSubmitted, submitError)
  // Removed handleChange and handleSubmit functions

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

  return (
    <div className="bg-white text-slate-800 overflow-x-hidden">
      {/* Hero Section for Contact Page */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 text-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('your-subtle-contact-bg.png')",
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
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6"
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
            Get In <span className="text-blue-600">Touch</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.4, duration: 0.7, ease: "easeOut" },
            }}
          >
            We're here to help and answer any question you might have. We look
            forward to hearing from you!
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Form and Information Section */}
      <motion.section
        className="py-16 sm:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Contact Form UI */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-50 p-6 sm:p-8 lg:p-10 rounded-xl shadow-xl"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                Send Us a Message
              </h2>
              {/* Add your onSubmit handler to the form tag */}
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    "Form submitted (UI only)"
                  ); /* Your submit logic here */
                }}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    // Add value and onChange if you manage state outside or with a form library
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    placeholder="Reason for your message"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    required
                    placeholder="Your message here..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  ></textarea>
                </div>
                {/* Placeholder for error/success messages - you'll manage this with your form logic */}
                {/* <p className="text-sm text-red-600">[Error message placeholder]</p> */}
                {/* <p className="text-sm text-green-600">[Success message placeholder]</p> */}
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information & Support */}
            <motion.div variants={itemVariants} className="mt-10 lg:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-8">
                <motion.div
                  className="flex items-start p-4 bg-blue-50 rounded-lg"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full mr-4">
                    <MailIcon />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Email Us
                    </h4>
                    <p className="text-slate-600 text-sm">
                      For general inquiries, support, or feedback.
                    </p>
                    <a
                      href="mailto:support@curalink.com"
                      className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium"
                    >
                      support@curalink.com
                    </a>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start p-4 bg-green-50 rounded-lg"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 p-2 bg-green-100 rounded-full mr-4">
                    <PhoneIcon />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Call Us
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Our support team is available during business hours.
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="text-green-600 hover:text-green-700 hover:underline text-sm font-medium"
                    >
                      (123) 456-7890
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      Mon - Fri, 9 AM - 6 PM (Your Timezone)
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start p-4 bg-purple-50 rounded-lg"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full mr-4">
                    <LocationIcon />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Our Office
                    </h4>
                    <p className="text-slate-600 text-sm">
                      123 Health St, Wellness City, HC 12345
                    </p>
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-700 hover:underline text-sm font-medium mt-1 inline-block"
                    >
                      Get Directions (Opens Map)
                    </a>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start p-4 bg-orange-50 rounded-lg"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 p-2 bg-orange-100 rounded-full mr-4">
                    <FaqIcon />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Frequently Asked Questions
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Have a question? Our FAQ section might have the answer.
                    </p>
                    <a
                      href="/faq"
                      className="text-orange-600 hover:text-orange-700 hover:underline text-sm font-medium mt-1 inline-block"
                    >
                      Visit FAQ Page
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Optional: Map Section - Placeholder */}
      <motion.section
        className="py-16 sm:py-20 bg-slate-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 0.7, delay: 0.2 } }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Find Us On The Map
            </h2>
            <p className="mt-2 text-slate-600">
              Visit our main office or explore our service areas.
            </p>
          </div>
          <div className="bg-slate-300 h-80 sm:h-96 rounded-xl shadow-lg flex items-center justify-center text-slate-500">
            [ Embedded Map Placeholder - e.g., Google Maps iframe ]
          </div>
        </div>
      </motion.section>

      {/* Footer (Placeholder for your actual Footer component) */}
      <div className="text-center py-10 bg-slate-800 text-slate-400 text-sm">
        This is where your standard site footer would go.
      </div>
    </div>
  );
};

export default Contact;
