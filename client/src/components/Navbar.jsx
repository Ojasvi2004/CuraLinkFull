import React, { useState } from "react";
import { NavLink,Navigate, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();

  return (
    <>
      <nav className="relative bg-white shadow ">
        <div className="container px-6 py-3 mx-auto flex flex-wrap items-center justify-between">
          {/* Logo */}
          <span>
            <img
              className="w-auto h-14 sm:h-14"
              src="Health_App-512.webp"
              alt="Logo"
            />
          </span>
          <span className=" pl-5 font-bold  text-4xl">
            CURA <span className=" text-blue-600" >LINK</span>
          </span>

          {/* Toggle Button for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 dark:text-gray-200 lg:hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
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
                  d="M4 8h16M4 16h16"
                />
              </svg>
            )}
          </button>

          {/* Menu */}
          <div
            className={`${
              isOpen ? "flex" : "hidden"
            } flex-col w-full mt-4 lg:flex lg:flex-row lg:items-center lg:w-auto lg:mt-0 lg:space-x-6 lg:justify-between flex-grow`}
          >
            {/* Centered Nav Links */}
            <div className="flex roboto flex-col items-center justify-center gap-10 max-sm:gap-4 lg:flex-row lg:flex-grow lg:justify-center">
              <NavLink
                to={"/"}
                className="group relative px-3 py-2 text-gray-700 font-semibold"
              >
                Home
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>

              <NavLink
                to={"/about"}
                className="group relative px-3 py-2 text-gray-700 font-semibold"
              >
                About
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>

              <NavLink
                to={"/contact"}
                className="group relative px-3 py-2 text-gray-700 font-semibold"
              >
                Contact
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
{/* 
              <NavLink
                to={"/team"}
                className="group relative px-3 py-2 text-gray-700 font-semibold"
              >
                Team
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
              </NavLink> */}
            </div>

            {/* Right Side - Search and Buttons */}
            <div className="flex flex-col items-center gap-4 mt-4 lg:flex-row lg:mt-0">
              {/* Search */}
              {/* <div className="relative w-full lg:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full py-2 pl-10 pr-4  bg-white text-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div> */}

              {/* Auth Buttons */}
              <div className="flex gap-2">
                <button onClick={()=>navigate('/login')} className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                  Login
                </button>
                <button onClick={()=>navigate('/signup')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
