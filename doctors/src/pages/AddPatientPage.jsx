import React from 'react';
import { easeOut, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout'; 
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const UserPlusIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>;
const UserCircleIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const MailIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const PhoneIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.308 1.154a11.034 11.034 0 005.37 5.37l1.154-2.308a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>;



const DoctorAddPatientPage = () => {
    const navigate = useNavigate();

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut" } },
    };

    const buttonHover = {
        hover: { y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)"},
        tap: { scale: 0.98 }
    };
    const inputFieldClass = "mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-colors";
    const inputLabelClass = "block text-sm font-medium text-slate-700 mb-1";
    const sectionHeaderClass = "text-xl sm:text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-6 flex items-center";

    const [formData,setformData]=useState({
        patientFullName:"",
        patientGender:"",
        patientDob:"",
        patientEmail:"",
        patientPhone:"",
        primaryConcern:"",
        allergies:"",
        chronicConditions:""
    });

    const handlechange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;

        setformData((prev)=>({
            ...prev,
            [name]:value
        }));
    };

    const {token,settoken}=useContext(AuthContext);
    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response=await axios.post("http://localhost:8000/api/doctors/add-patient",{
                formData
            },
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        if (response.data.success) 
        {
            console.log("Patient record added",response.data);
        }
            
        } catch (error) {
            console.log(`Error : ${error}`);
        }
        
        navigate('/doctor/patients');
    };

    return (
        <PageLayout
            pageTitle="Add a New Patient"
            pageSubtitle="Manually create a profile for a patient in your practice. An invitation to join CuraLink will be sent to their email."
            contentMaxWidth="max-w-3xl"
        >
            <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-10"
            >
                {/* Section 1: Basic Information */}
                <motion.fieldset variants={itemVariants} className="space-y-6">
                    <legend className={sectionHeaderClass}>
                        <UserCircleIcon /> <span className="ml-2">Patient's Basic Information</span>
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="patientFullName" className={inputLabelClass}>Full Name</label>
                            <input type="text" onChange={handlechange} name="patientFullName" id="patientFullName" required className={inputFieldClass} placeholder="Firstname Lastname" />
                        </div>
                        <div>
                            <label htmlFor="patientGender" className={inputLabelClass}>Gender</label>
                            <select name="patientGender" onChange={handlechange} id="patientGender" required className={`${inputFieldClass} bg-white`}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="patientDob" className={inputLabelClass}>Date of Birth</label>
                            <input type="date" onChange={handlechange} name="patientDob" id="patientDob" required className={inputFieldClass} />
                        </div>
                    </div>
                </motion.fieldset>

       
                <motion.fieldset variants={itemVariants} className="space-y-6 pt-6 border-t border-slate-200">
                    <legend className={sectionHeaderClass}>
                        <MailIcon /> <span className="ml-2">Contact Details</span>
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="patientEmail" className={inputLabelClass}>Email Address</label>
                            <input type="email" onChange={handlechange} name="patientEmail" id="patientEmail" required className={inputFieldClass} placeholder="patient@example.com" />
                            <p className="text-xs text-slate-500 mt-1">An invitation to create their password will be sent here.</p>
                        </div>
                        <div>
                            <label htmlFor="patientPhone" className={inputLabelClass}>Phone Number</label>
                            <input type="tel" onChange={handlechange} name="patientPhone" id="patientPhone" required className={inputFieldClass} placeholder="+91 XXXXXXXXXX" />
                        </div>
                    </div>
                </motion.fieldset>

      
                <motion.fieldset variants={itemVariants} className="space-y-6 pt-6 border-t border-slate-200">
                    <legend className={sectionHeaderClass}>
                      
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="ml-2">Initial Notes (Optional)</span>
                    </legend>
                    <div>
                        <label htmlFor="primaryConcern" className={inputLabelClass}>Primary Concern / Reason for Visit</label>
                        <input type="text" onChange={handlechange} name="primaryConcern" id="primaryConcern" className={inputFieldClass} placeholder="e.g., Hypertension, Routine Checkup" />
                    </div>
                    <div>
                        <label htmlFor="allergies" className={inputLabelClass}>Known Allergies (comma-separated)</label>
                        <input type="text" onChange={handlechange} name="allergies" id="allergies" className={inputFieldClass} placeholder="e.g., Penicillin, Peanuts" />
                    </div>
                    <div>
                        <label htmlFor="chronicConditions" className={inputLabelClass}>Chronic Conditions (comma-separated)</label>
                        <input type="text" name="chronicConditions" onChange={handlechange} id="chronicConditions" className={inputFieldClass} placeholder="e.g., Diabetes, Asthma" />
                    </div>
                </motion.fieldset>

              
                <motion.div variants={itemVariants} className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4">
                    <Link
                        to="/doctor/my-patients"
                        className="w-full sm:w-auto text-center py-2.5 px-6 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </Link>
                    <motion.button
                        type="submit"
                        onSubmit={handleSubmit}
                        className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Create Patient Profile
                    </motion.button>
                </motion.div>
            </motion.form>
        </PageLayout>
    );
};

export default DoctorAddPatientPage;