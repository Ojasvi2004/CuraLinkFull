// src/pages/ProfilePage.js
import React, { useState } from 'react'; // useState for simple UI toggles like modal
import { motion } from 'framer-motion';
import PageLayout from '../components/Layout/PageLayout'; // Adjust path if needed

// --- Example Icons (Replace these with actual icons) ---
const UserEditIcon = () => <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L10.828 17H8v-2.828l8.586-8.586z"></path></svg>;
const MedicalRecordIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>;
const PaperClipIcon = () => <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3zm0 1.5a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-3 0V7A1.5 1.5 0 018 5.5z" clipRule="evenodd"></path><path d="M9 11.25V15.5a.75.75 0 001.5 0V11.25a.75.75 0 00-1.5 0z"></path></svg>;

const UserAvatarPlaceholder = ({ imageUrl, altText, onUploadClick }) => (
    <div className="relative group flex-shrink-0">
        {imageUrl ? (
            <img src={imageUrl} alt={altText} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md" />
        ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-semibold border-4 border-white shadow-md">
                {altText ? altText.charAt(0).toUpperCase() : 'U'}
            </div>
        )}
        <button
            onClick={onUploadClick}
            className="absolute inset-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Change profile picture"
        >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
    </div>
);
// --- End Example Icons ---


const ProfilePage = () => {
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  // Mock user data - replace with actual data from context/API
  const [userProfile, setUserProfile] = useState({
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phoneNumber: "+91 98765 43210",
    dob: "1990-05-15",
    gender: "Male",
    profilePictureUrl: "", // "https://via.placeholder.com/150/9CA3AF/FFFFFF?text=AS",
    address: { street: "123 Health St", city: "Wellness City", state: "MH", pincode: "400001", country: "India" }
  });

  // Mock medical records data
  const [medicalRecords, setMedicalRecords] = useState([
    { id: 'rec001', type: 'General Checkup', date: '2023-05-10', doctor: 'Dr. R. Verma', facility: 'City Hospital', files: [{ name: 'checkup_report_may23.pdf', url: '#' }], notes: 'Annual physical, all clear.' },
    { id: 'rec002', type: 'Visa Medical', date: '2023-01-20', doctor: 'Dr. S. Khan', facility: 'Visa Clinic Center', files: [{ name: 'visa_medical_jan23.pdf', url: '#'}, {name: 'vaccination_cert.pdf', url:'#'}], notes: 'For UK student visa.' },
  ]);

  const itemVariants = { // For inner sections/items
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut", delay:0.1 } },
  };
  const cardHover = {
    hover: { y: -3, boxShadow: "0 5px 15px rgba(0,0,0,0.07)", transition:{type: "spring", stiffness: 300} }
  }

  const handleProfilePictureUpload = () => {
    alert("Initiate profile picture upload (UI only)");
  };

  const AddRecordModal = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        onClick={() => setIsAddRecordModalOpen(false)} // Close on backdrop click
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y:20 }} animate={{ scale: 1, opacity: 1, y:0 }} exit={{ scale: 0.9, opacity: 0, y:20 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Add New Medical Record</h2>
            <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); alert("Record Save (UI Only)"); setIsAddRecordModalOpen(false);}}>
                <div><label htmlFor="recordType" className="block text-sm font-medium text-slate-700">Record Type</label><input type="text" name="recordType" id="recordType" placeholder="e.g., Visa Medical, Annual Checkup" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
                <div><label htmlFor="recordDate" className="block text-sm font-medium text-slate-700">Date of Record</label><input type="date" name="recordDate" id="recordDate" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
                <div><label htmlFor="recordDoctor" className="block text-sm font-medium text-slate-700">Doctor/Specialist</label><input type="text" name="recordDoctor" id="recordDoctor" placeholder="Dr. John Doe" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
                <div><label htmlFor="recordFacility" className="block text-sm font-medium text-slate-700">Hospital/Clinic</label><input type="text" name="recordFacility" id="recordFacility" placeholder="City General Hospital" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
                <div><label htmlFor="recordFiles" className="block text-sm font-medium text-slate-700">Upload Files (PDF, JPG)</label><input type="file" name="recordFiles" id="recordFiles" multiple className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/></div>
                <div><label htmlFor="recordNotes" className="block text-sm font-medium text-slate-700">Notes (Optional)</label><textarea name="recordNotes" id="recordNotes" rows="3" placeholder="Any relevant notes..." className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea></div>
                <div className="flex justify-end gap-3 pt-4">
                    <motion.button type="button" onClick={() => setIsAddRecordModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" whileHover={{y:-1}} whileTap={{scale:0.98}}>Cancel</motion.button>
                    <motion.button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors" whileHover={{y:-1}} whileTap={{scale:0.98}}>Save Record</motion.button>
                </div>
            </form>
        </motion.div>
    </motion.div>
  );

  return (
    <PageLayout
      pageTitle="My Profile"
      pageSubtitle="View and manage your personal details, address, and health records."
    >
      {/* Profile Header with Avatar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 mb-8 sm:mb-10 pb-8 border-b border-slate-200">
        <UserAvatarPlaceholder imageUrl={userProfile.profilePictureUrl} altText={userProfile.fullName} onUploadClick={handleProfilePictureUpload} />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{userProfile.fullName}</h2>
          <p className="text-slate-600">{userProfile.email}</p>
          <p className="text-slate-500 text-sm">{userProfile.phoneNumber}</p>
        </div>
      </motion.div>

      {/* Personal Information Section */}
      <motion.section variants={itemVariants} className="mb-8 sm:mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">Personal Information</h3>
          <button onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <UserEditIcon /> {isEditingPersonalInfo ? 'Cancel Edit' : 'Edit Info'}
          </button>
        </div>
        {isEditingPersonalInfo ? (
          <form onSubmit={(e) => {e.preventDefault(); alert("Personal Info Save (UI Only)"); setIsEditingPersonalInfo(false);}} className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label htmlFor="editFullName" className="block text-sm font-medium text-slate-700">Full Name</label><input type="text" id="editFullName" defaultValue={userProfile.fullName} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/></div>
              <div><label htmlFor="editEmail" className="block text-sm font-medium text-slate-700">Email (Cannot Change)</label><input type="email" id="editEmail" defaultValue={userProfile.email} readOnly className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md bg-slate-100 text-slate-500 sm:text-sm cursor-not-allowed"/></div>
              <div><label htmlFor="editPhoneNumber" className="block text-sm font-medium text-slate-700">Phone Number</label><input type="tel" id="editPhoneNumber" defaultValue={userProfile.phoneNumber} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/></div>
              <div><label htmlFor="editDob" className="block text-sm font-medium text-slate-700">Date of Birth</label><input type="date" id="editDob" defaultValue={userProfile.dob} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/></div>
              <div><label htmlFor="editGender" className="block text-sm font-medium text-slate-700">Gender</label><select id="editGender" defaultValue={userProfile.gender} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option><option>Prefer not to say</option></select></div>
            </div>
            <div className="pt-3 flex justify-end"><motion.button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg text-sm" whileHover={{y:-1}} whileTap={{scale:0.98}}>Save Changes</motion.button></div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm p-4 bg-slate-50 rounded-lg">
            <div><strong className="text-slate-700">Full Name:</strong> <span className="text-slate-600">{userProfile.fullName}</span></div>
            <div><strong className="text-slate-700">Email:</strong> <span className="text-slate-600">{userProfile.email}</span></div>
            <div><strong className="text-slate-700">Phone:</strong> <span className="text-slate-600">{userProfile.phoneNumber}</span></div>
            <div><strong className="text-slate-700">Date of Birth:</strong> <span className="text-slate-600">{userProfile.dob}</span></div>
            <div><strong className="text-slate-700">Gender:</strong> <span className="text-slate-600">{userProfile.gender}</span></div>
          </div>
        )}
      </motion.section>

      {/* Address Information Section */}
      <motion.section variants={itemVariants} className="mb-8 sm:mb-12">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">Address Information</h3>
            <button onClick={() => setIsEditingAddress(!isEditingAddress)} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <UserEditIcon /> {isEditingAddress ? 'Cancel Edit' : 'Edit Address'}
            </button>
        </div>
        {isEditingAddress ? (
             <form onSubmit={(e) => {e.preventDefault(); alert("Address Save (UI Only)"); setIsEditingAddress(false);}} className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Street, City, State, Pincode, Country input fields */}
                    <div><label htmlFor="editStreet" className="block text-sm font-medium text-slate-700">Street Address</label><input type="text" name="editStreet" id="editStreet" defaultValue={userProfile.address.street} className="mt-1 block w-full input-style"/></div>
                    <div><label htmlFor="editCity" className="block text-sm font-medium text-slate-700">City</label><input type="text" name="editCity" id="editCity" defaultValue={userProfile.address.city} className="mt-1 block w-full input-style"/></div>
                    <div><label htmlFor="editState" className="block text-sm font-medium text-slate-700">State/Province</label><input type="text" name="editState" id="editState" defaultValue={userProfile.address.state} className="mt-1 block w-full input-style"/></div>
                    <div><label htmlFor="editPincode" className="block text-sm font-medium text-slate-700">Pincode</label><input type="text" name="editPincode" id="editPincode" defaultValue={userProfile.address.pincode} className="mt-1 block w-full input-style"/></div>
                </div>
                <style jsx>{`.input-style { @apply px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm; }`}</style>
                <div className="pt-3 flex justify-end">
                    <motion.button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg text-sm" whileHover={{y:-1}} whileTap={{scale:0.98}}>Save Address</motion.button>
                </div>
             </form>
        ) : (
            <div className="text-sm text-slate-600 p-4 bg-slate-50 rounded-lg">
                <p>{userProfile.address.street}</p>
                <p>{userProfile.address.city}, {userProfile.address.state} - {userProfile.address.pincode}</p>
                <p>{userProfile.address.country}</p>
            </div>
        )}
      </motion.section>


      {/* My Health Records Section */}
      <motion.section variants={itemVariants}>
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-center">
              <MedicalRecordIcon /> My Health Records
            </h3>
            <motion.button
              onClick={() => setIsAddRecordModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 sm:px-5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-150 flex items-center"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon /> Add Record
            </motion.button>
        </div>
        {medicalRecords.length > 0 ? (
        <div className="space-y-4">
          {medicalRecords.map((record) => (
            <motion.div
              key={record.id}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
              whileHover="hover" // Uses the cardHover defined in the parent component if needed, or define local
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
                  <h4 className="text-md font-semibold text-blue-700">{record.type}</h4>
                  <span className="text-xs text-slate-500 mt-1 sm:mt-0">Date: {record.date}</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Doctor: <span className="font-medium">{record.doctor}</span></p>
              <p className="text-sm text-slate-600 mb-3">Facility: <span className="font-medium">{record.facility}</span></p>
              {record.notes && <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-md mb-3 border border-slate-100">Notes: {record.notes}</p>}
              {record.files && record.files.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-xs font-medium text-slate-700 mb-1">Attached Files:</h5>
                  <ul className="list-none space-y-1">
                    {record.files.map((file, index) => (
                      <li key={index} className="text-xs">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                          <PaperClipIcon /> {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex gap-3 border-t border-slate-200 pt-3">
                  <button className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
                  <button className="text-xs text-red-600 hover:underline font-medium">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
        ) : (
            <p className="text-center text-slate-500 py-8">
              You haven't added any medical records yet. Click "Add New Record" to get started.
            </p>
        )}
      </motion.section>

      {isAddRecordModalOpen && <AddRecordModal />}
    </PageLayout>
  );
};

export default ProfilePage; // Changed from { ProfilePage }