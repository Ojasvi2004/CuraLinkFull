import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Authcontext } from "../Context/AuthContext";

const BellIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    ></path>
  </svg>
);
const UserCircleIconPlaceholder = ({ imageUrl, altText }) =>
  imageUrl ? (
    <img
      src={imageUrl}
      alt={altText}
      className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-blue-300 transition-colors"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-semibold group-hover:border-blue-300 border-2 border-transparent transition-colors">
      U
    </div>
  ); // Simple placeholder
const CogIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);
const LogoutIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-600 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    ></path>
  </svg>
);
const UserProfileIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const NavbarAfterLogin = ({
  userName = "Aarav Sharma",
  userProfilePic = "https://via.placeholder.com/40/9CA3AF/FFFFFF?text=AS",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const { token, settoken } = useContext(Authcontext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef]);

  const handleLogout = () => {
    settoken(null);
    localStorage.removeItem("Token");
    console.log("User logged out");
    setIsProfileDropdownOpen(false); // Close dropdown
    navigate("/login"); // Redirect to login
  };

  const navLinkClass =
    "group relative px-3 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors";
  const activeNavLinkClass = "text-blue-600"; // For active NavLink (React Router handles this)

  return (
    <>
      <nav className="relative bg-white shadow-md">
        <div className="container px-4 sm:px-6 py-3 mx-auto flex flex-wrap items-center justify-between">
          {/* Logo & Brand Name */}
          <NavLink to="/" className="flex items-center">
            <img
              className="w-auto h-12 sm:h-14" // Slightly smaller logo
              src="/Health_App-512.webp" // Make sure this path is correct or use an imported image
              alt="CuraLink Logo"
            />
            <span className="ml-2 sm:ml-3 font-bold text-2xl sm:text-3xl text-slate-800">
              CURA<span className="text-blue-600">LINK</span>
            </span>
          </NavLink>

          {/* Toggle Button for Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 hover:text-blue-600 lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Menu - Desktop and Mobile */}
          <div
            className={`${
              isMobileMenuOpen ? "flex shadow-lg rounded-b-lg" : "hidden"
            } flex-col absolute lg:relative top-full left-0 w-full bg-white lg:bg-transparent 
               lg:flex lg:flex-row lg:items-center lg:w-auto lg:mt-0 lg:space-x-2 xl:space-x-4 z-20
               pb-4 lg:pb-0`} // Added padding bottom for mobile dropdown
          >
            {/* Centered Nav Links */}
            <div className="flex flex-col items-center lg:flex-row lg:flex-grow lg:justify-center gap-3 lg:gap-0 mt-4 lg:mt-0 px-4 lg:px-0">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Dashboard
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
              <NavLink
                to="/find-doctors"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Find Doctors
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
              <NavLink
                to="/symptom-analyzer"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                AI Analyzer
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
              <NavLink
                to="/my-appointments"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                My Appointments
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            </div>

            {/* Right Side - Notifications and User Profile Dropdown */}
            <div className="flex items-center gap-3 sm:gap-4 mt-4 lg:mt-0 px-4 lg:pl-4 lg:pr-0">
              {/* Notification Icon (Placeholder) */}
              <button
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
                onClick={() => alert("Notifications clicked (UI only)")}
              >
                <BellIcon />
                {/* Optional: Add a badge for unread notifications */}
                {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span> */}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group"
                  aria-label="User Menu"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <UserCircleIconPlaceholder
                    imageUrl={userProfilePic}
                    altText={userName}
                  />
                  <span className="hidden md:block text-sm font-medium text-slate-700 group-hover:text-blue-600">
                    {userName}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-30 origin-top-right
                               ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {userName}
                      </p>
                      {/* Optional: <p className="text-xs text-slate-500 truncate">user.email@example.com</p> */}
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                      role="menuitem"
                    >
                      <UserProfileIcon /> Your Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                      role="menuitem"
                    >
                      <CogIcon /> Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 group transition-colors"
                      role="menuitem"
                    >
                      <LogoutIcon /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarAfterLogin;
