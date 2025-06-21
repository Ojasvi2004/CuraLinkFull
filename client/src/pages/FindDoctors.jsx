import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios';

// Placeholder Icons
const SearchIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    ></path>
  </svg>
);
const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V17l-4 4v-8.586L3.293 6.707A1 1 0 013 6V4z"
    ></path>
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-slate-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

// // Mock Doctor Data
// const mockDoctors = [
//   {
//     id: 1,
//     name: "Dr. Ananya Sharma",
//     specialty: "Cardiology",
//     location: "Mumbai, MH",
//     rating: 4.5,
//     experience: 12,
//     profilePic: "https://via.placeholder.com/100/A78BFA/FFFFFF?text=AS",
//     availableDigital: true,
//   },
//   {
//     id: 2,
//     name: "Dr. Vikram Singh",
//     specialty: "Pediatrics",
//     location: "Delhi, DL",
//     rating: 4.8,
//     experience: 15,
//     profilePic: "https://via.placeholder.com/100/9CA3AF/FFFFFF?text=VS",
//     availableDigital: true,
//   },
//   {
//     id: 3,
//     name: "Dr. Priya Reddy",
//     specialty: "Dermatology",
//     location: "Bangalore, KA",
//     rating: 4.2,
//     experience: 8,
//     profilePic: "https://via.placeholder.com/100/FBBF24/FFFFFF?text=PR",
//     availableDigital: false,
//   },
//   {
//     id: 4,
//     name: "Dr. Rohan Mehra",
//     specialty: "Orthopedics",
//     location: "Chennai, TN",
//     rating: 4.6,
//     experience: 10,
//     profilePic: "https://via.placeholder.com/100/34D399/FFFFFF?text=RM",
//     availableDigital: true,
//   },
// ];

const FindDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  // Add more filters: availability, rating, etc.

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const cardHover = {
    hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  };

      const[mockDoctors,setmockDoctors]=useState([]);

      const refreshMockDoctors=async(e)=>{


      try {

        const response= await axios.get('http://localhost:8000/api/user/getDoctorList');

        if (response.data.success) 
        {
          setmockDoctors(response.data.doctorList);
          console.log("Successfull fetch.",response.data);  
        }
        
        
      } catch (error) {
        console.log("Error occurred in fetching.",error);
      }
    }

    useEffect(()=>{
      refreshMockDoctors();
    
    },[]);


    const filteredDoctors = mockDoctors.filter(
      (doc) =>
        doc.FullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (specialtyFilter
          ? doc.Speciality.toLowerCase().includes(specialtyFilter.toLowerCase())
          : true) &&
        (locationFilter
          ? doc.ClinicDetails.city.toLowerCase().includes(locationFilter.toLowerCase())
          : true)
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="container mx-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-10 text-center"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            Find Your <span className="text-blue-600">Specialist</span>
          </h1>
          <p className="text-slate-600 mt-3 text-lg max-w-xl mx-auto">
            Search our network of verified doctors and book your consultation
            with ease.
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search by Name */}
            <div>
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Doctor Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Dr. Sharma"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Filter by Specialty */}
            <div>
              <label
                htmlFor="specialtyFilter"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Specialty
              </label>
              <select
                id="specialtyFilter"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                {/* Add more specialties */}
              </select>
            </div>
            {/* Filter by Location */}
            <div>
              <label
                htmlFor="locationFilter"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="locationFilter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="e.g., Mumbai"
                className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* Filter Button (for more advanced filters popup) */}
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-150 h-[42px] mt-4 md:mt-0">
              {" "}
              {/* Matched height */}
              <FilterIcon />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Doctor Listing Grid */}
        {filteredDoctors.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            variants={pageVariants} // Stagger cards
          >
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow:
                    "0 15px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                <img
                  src={doctor.ProfilePicture}
                  alt={doctor.FullName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {doctor.FullName}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {doctor.Speciality}
                  </p>
                  <p className="text-xs text-slate-500 mb-1">
                    {doctor.ClinicDetails.city}
                  </p>
                  <p className="text-xs text-slate-500 mb-1">
                    {doctor.ClinicDetails.state}
                  </p>
                  <div className="flex items-center mb-3">
                    {/* {[...Array()].map((_, i) => (
                      <StarIcon
                        key={i}
                        filled={i < Math.floor(doctor.rating)}
                      />
                    ))} */}
                    {/* <span className="ml-2 text-xs text-slate-500">
                      ({doctor.rating.toFixed(1)})
                    </span> */}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    {doctor.experience} years experience
                  </p>
                  {doctor.availableDigital && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full self-start mb-3">
                      Teleconsultation Available
                    </span>
                  )}
                  <div className="mt-auto pt-3">
                    <Link
                      to={`/doctors/${doctor._id}`} // Example link to doctor profile
                      className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors duration-150"
                    >
                      View Profile & Book
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-10">
            <p className="text-slate-600 text-lg">
              No doctors found matching your criteria.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FindDoctors;
