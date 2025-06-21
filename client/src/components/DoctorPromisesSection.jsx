import React, { useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion

// Sample doctor data - replace with your actual data or fetch from an API
const doctorTestimonials = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    specialty: "Cardiologist, MedHeart Clinic",
    quote:
      "“Your heart health is my priority. I believe in providing compassionate, comprehensive care tailored to each patient, utilizing the latest advancements to ensure the best possible outcomes.”",
    title: "Prioritizing Your Heart Health",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 2,
    name: "Dr. Vikram Singh",
    specialty: "Pediatrician, TinyCare Hospital",
    quote:
      "“Children deserve the best start in life. My commitment is to their well-being, offering expert care with a gentle touch and ensuring parents are informed partners in their child’s health journey.”",
    title: "Dedicated to Children's Well-being",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 3,
    name: "Dr. Priya Reddy",
    specialty: "Dermatologist, SkinGlow Center",
    quote:
      "“Healthy skin reflects overall wellness. I focus on personalized treatments and preventive care to help you achieve and maintain radiant, healthy skin with confidence.”",
    title: "Achieving Radiant, Healthy Skin",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
];

const DoctorPromisesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? doctorTestimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === doctorTestimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentDoctor = doctorTestimonials[currentIndex];

  // Animation variants for Framer Motion
  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, yoyo: Infinity }, // yoyo makes it pulse slightly
    },
    tap: {
      scale: 0.95,
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="relative flex">
        {/* Background decorative elements */}
        <div className="min-h-screen lg:w-1/3"></div>
        <div className="hidden w-3/4 min-h-screen bg-slate-50 lg:block"></div>

        <div className="container flex flex-col justify-center w-full min-h-screen px-6 py-10 mx-auto lg:absolute lg:inset-0">
          <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl text-center lg:text-left">
            What Our <span className="text-blue-500">Doctors Promise</span>{" "}
            <br className="hidden sm:block" /> You
          </h1>

          {/* Key for framer-motion to re-trigger animation on content change */}
          <motion.div
            key={currentIndex} // This is important for re-animating content
            className="mt-10 lg:mt-20 lg:flex lg:items-center lg:gap-12"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <img
              className="object-cover object-center w-full lg:w-[30rem] xl:w-[32rem] rounded-lg h-80 sm:h-96 shadow-xl"
              src={currentDoctor.image}
              alt={`Photo of ${currentDoctor.name}`}
            />

            <div className="mt-8 lg:mt-0">
              <h2 className="text-2xl font-semibold text-gray-800 lg:text-3xl lg:max-w-md">
                {currentDoctor.title}
              </h2>

              <p className="max-w-lg mt-6 text-gray-600 leading-relaxed">
                {currentDoctor.quote}
              </p>

              <h3 className="mt-8 text-lg font-semibold text-blue-500">
                {currentDoctor.name}
              </h3>
              <p className="text-gray-500 text-sm">{currentDoctor.specialty}</p>
            </div>
          </motion.div>

          <div className="flex items-center justify-center lg:justify-start mt-12 gap-4">
            <motion.button
              title="Previous Doctor"
              onClick={handlePrev}
              className="p-3 text-gray-800 transition-colors duration-300 border rounded-full rtl:-scale-x-100 border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <motion.button
              title="Next Doctor"
              onClick={handleNext}
              className="p-3 text-gray-800 transition-colors duration-300 border rounded-full rtl:-scale-x-100 border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorPromisesSection;
