import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- Example Icons (Replace these with actual icons from a library like Heroicons) ---
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const UserCircleIconPlaceholder = ({ imageUrl, altText }) => imageUrl ? <img src={imageUrl} alt={altText} className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-blue-300 transition-colors" /> : <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-semibold group-hover:border-blue-300 border-2 border-transparent transition-colors">DR</div>;
const CogIcon = () => <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const UserProfileIcon = () => <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// --- End Example Icons ---


const NavbarAfterLogin = ({ doctorName = "Dr. Sharma", doctorProfilePic = "", onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef]);

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false); // Close dropdown
    if (onLogout) {
      onLogout(); // Call the passed logout function
    } else {
      console.log("Logout function not provided to navbar");
      navigate("/doctor/login"); // Fallback redirect
    }
  };

  const navLinkBaseClass = "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out";
  const navLinkClass = ({isActive}) =>
    `${navLinkBaseClass} ${isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`;
  const mobileNavLinkClass = ({isActive}) =>
    `${navLinkBaseClass} block w-full text-left ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`;


  return (
    <nav className="relative bg-white shadow-lg sticky top-0 z-50"> {/* Sticky navbar */}
      <div className="container px-4 sm:px-6 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <NavLink to="/doctor/dashboard" className="flex items-center flex-shrink-0">
            <img
              className="w-auto h-10 sm:h-12" // Slightly smaller logo
              src="/Health_App-512.webp" // Make sure this path is correct
              alt="CuraLink Logo"
            />
            <span className="ml-2 font-bold text-xl sm:text-2xl text-slate-800">
              CURA<span className="text-blue-600">LINK</span>
              <span className="ml-1.5 text-xs font-normal text-teal-600 tracking-wider align-middle">PRO</span>
            </span>
          </NavLink>

          {/* Desktop Menu Links (Center) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
            <NavLink to="/doctor/dashboard" className={navLinkClass}>
                <DashboardIcon/> <span className="ml-2">Dashboard</span>
            </NavLink>
            <NavLink to="/doctor/appointments" className={navLinkClass}>
                <CalendarIcon/> <span className="ml-2">Appointments</span>
            </NavLink>
            <NavLink to="/doctor/patients" className={navLinkClass}>
                <UsersIcon/> <span className="ml-2">My Patients</span>
            </NavLink>
            <NavLink to="/doctor/queue-management" className={navLinkClass}>
                {/* Add a specific queue icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l7 3-7 3v7zm3-11l7 3-7 3" /></svg>
                <span className="ml-2">Live Queue</span>
            </NavLink>
             <NavLink to="/doctor/availability" className={navLinkClass}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM12 18h.01" /></svg>
                <span className="ml-2">Set Availability</span>
            </NavLink>
          </div>

          {/* Right Side - Notifications and User Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Notifications"
              onClick={() => alert("Notifications clicked (UI only)")}
            >
              <BellIcon />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group"
                aria-label="User Menu"
                aria-expanded={isProfileDropdownOpen}
              >
                <UserCircleIconPlaceholder imageUrl={doctorProfilePic} altText={doctorName} />
                <span className="hidden md:block text-sm font-medium text-slate-700 group-hover:text-blue-600">{doctorName}</span>
                <svg className={`w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95, transition: {duration: 0.15} }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl py-2 z-30 origin-top-right
                               ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 truncate">{doctorName}</p>
                      <p className="text-xs text-slate-500 truncate">Doctor Profile</p>
                    </div>
                    <NavLink
                      to="/doctor/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                      role="menuitem"
                    >
                      <UserProfileIcon /> My Profile
                    </NavLink>
                    <NavLink
                      to="/doctor/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                      role="menuitem"
                    >
                      <CogIcon /> Account Settings
                    </NavLink>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 group transition-colors"
                      role="menuitem"
                    >
                      <LogoutIcon /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
             {/* Mobile Menu Button - Placed after profile for consistent right alignment */}
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
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden w-full bg-white absolute top-full left-0 right-0 shadow-lg rounded-b-lg overflow-hidden z-40" // Ensure it's below sticky navbar if it overlays
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/doctor/dashboard" className={mobileNavLinkClass} onClick={()=>setIsMobileMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/doctor/appointments" className={mobileNavLinkClass} onClick={()=>setIsMobileMenuOpen(false)}>Appointments</NavLink>
              <NavLink to="/doctor/patients" className={mobileNavLinkClass} onClick={()=>setIsMobileMenuOpen(false)}>My Patients</NavLink>
              <NavLink to="/doctor/queue-management" className={mobileNavLinkClass} onClick={()=>setIsMobileMenuOpen(false)}>Live Queue</NavLink>
              <NavLink to="/doctor/availability" className={mobileNavLinkClass} onClick={()=>setIsMobileMenuOpen(false)}>Set Availability</NavLink>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavbarAfterLogin;