import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// --- Example Icons (Replace with actual icons) ---
const MailIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const LockIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.94-2.27 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>;
// --- End Example Icons ---


const DoctorLoginPage = () => {
  const pageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const formContainerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonHover = {
    hover: { y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)"},
    tap: { scale: 0.98 }
  };

  const [formdata,setformdata]= useState({
    email:"",
    password:""
  });

  const navigate=useNavigate();

  const {token,settoken}=useContext(AuthContext);

  const handleChanges=(e)=>{
    setformdata(prev=>(
      {
        ...prev,
        [e.target.name]:e.target.value
      }
    ))
  };


  const handleSubmit =async (e) => {
    e.preventDefault();
    try {

      const response=await axios.post('http://localhost:8000/api/doctors/login',formdata);

      if (response.data.success) 
      {
        const tokengot=response.data.token;
        console.log("Login Successfull",tokengot);

        settoken(tokengot);
        localStorage.setItem('token',tokengot);
        

        navigate('/doctor/dashboard');

      }
      else {
        console.error(`Could not get the response`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        variants={itemVariants} // Animate this block as an item
      >
        <img className="mx-auto h-14 w-auto mb-4" src="/curalink-logo.png" alt="CuraLink" /> {/* Replace */}
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Doctor Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Access your CuraLink dashboard to manage your practice.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={formContainerVariants}
        // No need for initial/animate here if parent has it and staggers
      >
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <label htmlFor="doctorEmail" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  id="doctorEmail"
                  name="email"
                  type="email"
                  onChange={handleChanges}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="doctorPassword" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="doctorPassword"
                  name="password"
                  type="password"
                  onChange={handleChanges}
                  autoComplete="current-password"
                  required
                  placeholder="Your Password"
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-doctor"
                  name="remember-doctor"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-doctor" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/doctor/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
              >
                Sign in
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6">
              <motion.button
                onClick={() => alert("Google Sign-in for Doctors (UI only)")}
                className="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="sr-only">Sign in with Google</span>
                <GoogleIcon />
                <span className="ml-2">Sign in with Google</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-10 text-center text-sm text-slate-600"
      >
        Not yet part of CuraLink?{' '}
        <Link to="/doctor/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
          Register your practice
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default DoctorLoginPage;