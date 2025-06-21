import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 
import axios from 'axios';



const UserCircleIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);
const MailIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
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
    className="w-5 h-5 text-slate-400"
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
const LockIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
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
const AcademicCapIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l9-5-9-5-9 5 9 5z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
    ></path>
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m6 0H8m6 0H8m6 0H8M10 6h4M10 10h4m-4 4h4m5-10v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 001.414 0l1.414-1.414A1 1 0 0113.414 4H16z"
    ></path>
  </svg>
);
const GlobeIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.093A1 1 0 018.414 3h7.172a1 1 0 01.707 1.707l-1.414 1.414A1 1 0 0016 6.586V8H8V6.586a1 1 0 00-1.293-.707L5.293 4.293A1 1 0 017.707 4.093zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);
const DocumentAddIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);


const DoctorRegistrationPage = () => {
 

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.2 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'circOut' },
    },
  };

  const inputFieldClass =
    'mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors';
  const inputLabelClass = 'block text-sm font-medium text-slate-700 mb-1';
  const sectionHeaderClass =
    'text-xl sm:text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-6 flex items-center';
  const buttonHover = {
    hover: {
      y: -2,
      boxShadow:
        '0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)',
    },
    tap: { scale: 0.98 },
  };

  // const [formData,setformData]=useState({
  //   doctorFullName:" ",
  //   doctorEmail:" ",
  //   doctorPhone:" ",
  //   medicalRegNo:" ",
  //   qualifications:" ",
  //   experience:" ",
  //   doctorBio:" ",
  //   clinicName:" ",
  //   clinicStreet:" ",
  //   clinicCity:" ",
  //   clinicState:" ",
  //   clinicPincode:" ",
  //   clinicPhone:" ",
  //   primarySpecialty:" ",
  //   servicesOffered:" ",
  //   consultFeePhysical:" ",
  //   consultFeeDigital:" ",

  //   acceptsDigital:" ",

  //   doctorPassword:" ",
  //   doctorConfirmPassword:" ",
  //   medicalRegCertificate:" ",

  //   clinicRegCertificate:" ",




  // });

  const HandleChanges=(e)=>{
    setformData((prev)=>(
      {
        ...prev,
        [e.target.name]:e.target.value
      }
    ))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form=document.getElementById('mainform');
    const data=new FormData(form);

    for(let [key,value] of data.entries() )
    {
      console.log(key, value);
    }

    try {

      const response=await axios.post('http://localhost:8000/api/doctors/register',data,{
        headers:{
           "Content-Type": "multipart/form-data",
        }
      });

     if (response.data.success) 
    {
       console.log("Successfull Registration ",response.data);  
     }
      
    } catch (error) {
      console.log("Some Error occured in getting response.",error);
    }

    alert('Doctor Registration Submitted (UI Only)!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="container mx-auto max-w-3xl"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={sectionVariants}
          className="text-center mb-10 sm:mb-12"
        >
          <img
            className="mx-auto h-14 w-auto mb-4"
            src="/curalink-logo.png"
            alt="CuraLink"
          />{' '}
          {/* Replace */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Join <span className="text-blue-600">CuraLink</span> for Doctors
          </h1>
          <p className="mt-3 text-md sm:text-lg text-slate-600 max-w-xl mx-auto">
            Expand your practice, connect with patients seamlessly, and leverage
            our smart tools.
          </p>
        </motion.div>

        <motion.form
          id='mainform'
          variants={sectionVariants}
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl space-y-10"
        >
          {/* Section 1: Personal Information */}
          <motion.fieldset variants={sectionVariants} className="space-y-6">
            <legend className={sectionHeaderClass}>
              <UserCircleIcon />
              <span className="ml-2">Your Personal Details</span>
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="doctorFullName" className={inputLabelClass}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="doctorFullName"
                  id="doctorFullName"
                  required
                  className={inputFieldClass}
                  placeholder="Dr. Firstname Lastname"
                />
              </div>
              <div>
                <label htmlFor="doctorEmail" className={inputLabelClass}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="doctorEmail"
                  id="doctorEmail"
                  required
                  className={inputFieldClass}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="doctorPhone" className={inputLabelClass}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="doctorPhone"
                  id="doctorPhone"
                  required
                  className={inputFieldClass}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div>
                <label htmlFor="medicalRegNo" className={inputLabelClass}>
                  Medical Registration No.
                </label>
                <input
                  type="text"
                  name="medicalRegNo"
                  id="medicalRegNo"
                  required
                  className={inputFieldClass}
                  placeholder="Your Council Reg. No."
                />
              </div>
            </div>
            <div>
              <label htmlFor="qualifications" className={inputLabelClass}>
                Qualifications (comma-separated)
              </label>
              <input
                type="text"
                name="qualifications"
                id="qualifications"
                required
                className={inputFieldClass}
                placeholder="MBBS, MD (Cardiology), FRCS"
              />
            </div>
            <div>
              <label htmlFor="experience" className={inputLabelClass}>
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                id="experience"
                required
                className={inputFieldClass}
                placeholder="e.g., 10"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="doctorBio" className={inputLabelClass}>
                Short Bio / About Yourself
              </label>
              <textarea
                name="doctorBio"
                id="doctorBio"
                rows="4"
                required
                className={inputFieldClass}
                placeholder="Briefly describe your expertise and approach to patient care..."
              ></textarea>
            </div>
            <div>
              <label htmlFor="profilePicture" className={inputLabelClass}>
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </motion.fieldset>

          {/* Section 2: Clinic Information (Can be repeatable in a real app) */}
          <motion.fieldset
            variants={sectionVariants}
            className="space-y-6 pt-6 border-t border-slate-200"
          >
            <legend className={sectionHeaderClass}>
              <GlobeIcon />
              <span className="ml-2">Primary Clinic Details</span>
            </legend>
            <div>
              <label htmlFor="clinicName" className={inputLabelClass}>
                Clinic/Hospital Name
              </label>
              <input
                type="text"
                name="clinicName"
                id="clinicName"
                required
                className={inputFieldClass}
              />
            </div>
            <div>
              <label htmlFor="clinicStreet" className={inputLabelClass}>
                Street Address
              </label>
              <input
                type="text"
                name="clinicStreet"
                id="clinicStreet"
                required
                className={inputFieldClass}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="clinicCity" className={inputLabelClass}>
                  City
                </label>
                <input
                  type="text"
                  name="clinicCity"
                  id="clinicCity"
                  required
                  className={inputFieldClass}
                />
              </div>
              <div>
                <label htmlFor="clinicState" className={inputLabelClass}>
                  State
                </label>
                <input
                  type="text"
                  name="clinicState"
                  id="clinicState"
                  required
                  className={inputFieldClass}
                />
              </div>
              <div>
                <label htmlFor="clinicPincode" className={inputLabelClass}>
                  Pincode
                </label>
                <input
                  type="text"
                  name="clinicPincode"
                  id="clinicPincode"
                  required
                  className={inputFieldClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="clinicPhone" className={inputLabelClass}>
                Clinic Contact Number
              </label>
              <input
                type="tel"
                name="clinicPhone"
                id="clinicPhone"
                className={inputFieldClass}
              />
            </div>
            {/* Add button for "Add another clinic location" if needed */}
          </motion.fieldset>

          {/* Section 3: Specialization & Services */}
          <motion.fieldset
            variants={sectionVariants}
            className="space-y-6 pt-6 border-t border-slate-200"
          >
            <legend className={sectionHeaderClass}>
              <BriefcaseIcon />
              <span className="ml-2">Specialization & Services</span>
            </legend>
            <div>
              <label htmlFor="primarySpecialty" className={inputLabelClass}>
                Primary Specialty
              </label>
              <select
                name="primarySpecialty"
                id="primarySpecialty"
                required
                className={`${inputFieldClass} bg-white`}
              >
                <option value="">Select Specialty</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Physician">General Physician</option>
                {/* Add more specialties */}
              </select>
            </div>
            <div>
              <label htmlFor="servicesOffered" className={inputLabelClass}>
                Services Offered (comma-separated)
              </label>
              <input
                type="text"
                name="servicesOffered"
                id="servicesOffered"
                className={inputFieldClass}
                placeholder="e.g., ECG, Consultation, Health Checkup"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="consultFeePhysical" className={inputLabelClass}>
                  In-Person Consultation Fee (INR)
                </label>
                <input
                  type="number"
                  name="consultFeePhysical"
                  id="consultFeePhysical"
                  className={inputFieldClass}
                  placeholder="e.g., 800"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="consultFeeDigital" className={inputLabelClass}>
                  Digital Consultation Fee (INR)
                </label>
                <input
                  type="number"
                  name="consultFeeDigital"
                  id="consultFeeDigital"
                  className={inputFieldClass}
                  placeholder="e.g., 500"
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="acceptsDigital"
                  name="acceptsDigital"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="acceptsDigital"
                  className="font-medium text-slate-700"
                >
                  I offer Digital Consultations (Telemedicine)
                </label>
              </div>
            </div>
          </motion.fieldset>

          {/* Section 4: Account Setup */}
          <motion.fieldset
            variants={sectionVariants}
            className="space-y-6 pt-6 border-t border-slate-200"
          >
            <legend className={sectionHeaderClass}>
              <LockIcon />
              <span className="ml-2">Account Security</span>
            </legend>
            <div>
              <label htmlFor="doctorPassword" className={inputLabelClass}>
                Create Password
              </label>
              <input
                type="password"
                name="doctorPassword"
                id="doctorPassword"
                required
                className={inputFieldClass}
              />
            </div>
            <div>
              <label
                htmlFor="doctorConfirmPassword"
                className={inputLabelClass}
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="doctorConfirmPassword"
                id="doctorConfirmPassword"
                required
                className={inputFieldClass}
              />
            </div>
          </motion.fieldset>

          {/* Section 5: Document Upload (Conceptual) */}
          <motion.fieldset
            variants={sectionVariants}
            className="space-y-6 pt-6 border-t border-slate-200"
          >
            <legend className={sectionHeaderClass}>
              <DocumentAddIcon />
              <span className="ml-2">Verification Documents</span>
            </legend>
            <p className="text-xs text-slate-500 -mt-4 mb-4">
              Please upload clear copies of your Medical Registration
              Certificate and Clinic Registration (if applicable). Our team will
              verify these for platform security.
            </p>
            <div>
              <label
                htmlFor="MedicalCertificate"
                className={inputLabelClass}
              >
                Medical Registration Certificate
              </label>
              <input
                type="file"
                name="MedicalCertificate"
                id="MedicalCertificate"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="ClinicRegistrationCertificate" className={inputLabelClass}>
                Clinic Registration Certificate (if applicable)
              </label>
              <input
                type="file"
                name="ClinicRegistrationCertificate"
                id="ClinicRegistrationCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </motion.fieldset>

          <motion.div
            variants={sectionVariants}
            className="pt-8 border-t border-slate-200"
          >
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="termsAgreement"
                  name="termsAgreement"
                  type="checkbox"
                  required
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="termsAgreement"
                  className="font-medium text-slate-700"
                >
                  I agree to CuraLink's{' '}
                  <Link
                    to="/doctor/terms"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/doctor/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>{' '}
                  for Professionals.
                </label>
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              Complete Registration & Request Verification
            </motion.button>
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/doctor/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default DoctorRegistrationPage;
