import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you use React Router

const NavbarBeforeLogin = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = "px-3 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200";
  // No active class needed for a before-login navbar typically

  return (
    <nav className="  bg-white shadow-md sticky top-0 z-50"> {/* Sticky navbar */}
      <div className="container px-4 sm:px-6 py-3 mx-auto flex flex-wrap items-center justify-between">
        {/* Logo & Brand Name */}
        <Link to="/doctor" className="flex items-center"> {/* Link to doctor landing */}
          <img
            className="w-auto h-12 sm:h-14"
            src="/Health_App-512.webp" // Replace with your logo path
            alt="CuraLink Logo"
          />
          <span className="ml-2 sm:ml-3 font-bold text-2xl sm:text-3xl text-slate-800">
            CURA<span className="text-blue-600">LINK</span>
            <span className="ml-2 text-xs sm:text-sm font-normal text-teal-600 tracking-wider">for Doctors</span>
          </span>
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-600 hover:text-blue-600 lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Menu - Desktop and Mobile */}
        <div
          className={`${
            isMobileMenuOpen ? "flex shadow-lg rounded-b-lg" : "hidden"
          } flex-col absolute lg:relative top-full left-0 w-full bg-white lg:bg-transparent
             lg:flex lg:flex-row lg:items-center lg:w-auto lg:mt-0 lg:space-x-2 xl:space-x-4 z-40
             pb-4 lg:pb-0`}
        >
          {/* Centered Nav Links */}
          <div className="flex flex-col items-center lg:flex-row lg:flex-grow lg:justify-center gap-3 lg:gap-0 mt-4 lg:mt-0 px-4 lg:px-0">
            <Link to="/doctor/features" className={navLinkClass}>Features</Link>
            <Link to="/doctor/how-it-works" className={navLinkClass}>How It Works</Link>
            <Link to="/doctor/faq" className={navLinkClass}>FAQ for Doctors</Link>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 lg:mt-0 px-4 lg:pl-4 lg:pr-0">
            <button
              onClick={() => navigate('/doctor/login')}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Doctor Login
            </button>
            <button
              onClick={() => navigate('/doctor/register')}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Register Your Clinic
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarBeforeLogin;