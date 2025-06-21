// src/pages/DoctorSettingsPage.js
import React, { useState } from 'react'; // Ensure useState is imported
import { motion } from 'framer-motion';
import PageLayout from '../components/Layout/PageLayout'; // Adjust path
import { Link } from 'react-router-dom';

// ... (Your Icon components remain the same) ...
const BellIconSetting = () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const LockClosedIcon = () => <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;
const LanguageIcon = () => <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9.5A18.022 18.022 0 0117.588 9m-11.176 0A18.022 18.022 0 0112 2.5c4.418 0 8.463 2.012 11.176 5.5m-22.352 0A18.022 18.022 0 0112 21.5c4.418 0 8.463-2.012 11.176-5.5m-22.352 0h22.352"></path></svg>;
const ChevronRightSettingIcon = () => <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;


// Basic Toggle Switch UI component
const ToggleSwitch = ({ enabled, setEnabled, labelId }) => (
    <button
      type="button"
      className={`${
        enabled ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
      aria-labelledby={labelId}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
);


const DoctorSettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [availabilityReminders, setAvailabilityReminders] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');
  const [darkMode, setDarkMode] = useState(false); // <<<<<  THIS LINE WAS MISSING - ADD IT

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut", delay:0.1 } },
  };
  const sectionHeaderClass = "text-lg sm:text-xl font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-6 flex items-center";
  const inputFieldClass = "mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm rounded-md bg-white shadow-sm";
  const settingItemClass = "flex items-center justify-between p-4 bg-slate-50 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors";


  const handleSaveSettings = () => {
      alert("Settings Saved (UI Only)!");
      // API call to save all settings:
      // { emailNotifications, smsReminders, availabilityReminders, selectedLanguage, selectedTimezone, darkMode }
      console.log("Settings to save:", { emailNotifications, smsReminders, availabilityReminders, selectedLanguage, selectedTimezone, darkMode });
  };

  return (
    <PageLayout
      pageTitle="Account Settings"
      pageSubtitle="Manage your notification preferences, security, and platform settings."
      contentMaxWidth="max-w-3xl"
    >
      <div className="space-y-10 sm:space-y-12">
        {/* Notification Settings Section */}
        <motion.section variants={itemVariants}>
          <div className={sectionHeaderClass}>
            <BellIconSetting />
            <span className="ml-3">Notification Preferences</span>
          </div>
          <div className="space-y-5">
            <div className={settingItemClass}>
              <div>
                <label htmlFor="email-notifications-toggle" id="email-label" className="text-sm sm:text-base font-medium text-slate-800">Email Notifications</label>
                <p className="text-xs text-slate-500">Appointment confirmations, cancellations, platform updates.</p>
              </div>
              <ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} labelId="email-label" />
            </div>
            <div className={settingItemClass}>
              <div>
                <label htmlFor="sms-reminders-toggle" id="sms-label" className="text-sm sm:text-base font-medium text-slate-800">SMS Reminders</label>
                <p className="text-xs text-slate-500">Reminders for your upcoming consultations.</p>
              </div>
              <ToggleSwitch enabled={smsReminders} setEnabled={setSmsReminders} labelId="sms-label" />
            </div>
            <div className={settingItemClass}>
              <div>
                <label htmlFor="availability-reminders-toggle" id="avail-label" className="text-sm sm:text-base font-medium text-slate-800">Availability Update Reminders</label>
                <p className="text-xs text-slate-500">Reminders to update your schedule for the upcoming week.</p>
              </div>
              <ToggleSwitch enabled={availabilityReminders} setEnabled={setAvailabilityReminders} labelId="avail-label" />
            </div>
          </div>
        </motion.section>

        {/* Security & Privacy Section */}
        <motion.section variants={itemVariants}>
          <div className={sectionHeaderClass}>
            <LockClosedIcon />
            <span className="ml-3">Security & Privacy</span>
          </div>
          <div className="space-y-3">
            <Link to="/doctor/change-password" className={`${settingItemClass} group cursor-pointer no-underline`}>
                <span className="text-sm sm:text-base font-medium text-slate-700 group-hover:text-blue-600">Change Your Password</span>
                <ChevronRightSettingIcon />
            </Link>
            <Link to="/doctor/privacy-settings" className={`${settingItemClass} group cursor-pointer no-underline`}>
                <span className="text-sm sm:text-base font-medium text-slate-700 group-hover:text-blue-600">Manage Data & Privacy Settings</span>
                <ChevronRightSettingIcon />
            </Link>
          </div>
        </motion.section>

        {/* Preferences Section */}
        <motion.section variants={itemVariants}>
            <div className={sectionHeaderClass}>
              <LanguageIcon/>
              <span className="ml-3">Platform Preferences</span>
            </div>
            <div className="space-y-5">
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">Display Language</label>
                    <select id="language" name="language" value={selectedLanguage} onChange={(e)=> setSelectedLanguage(e.target.value)} className={inputFieldClass}>
                        <option value="en-US">English (United States)</option>
                        <option value="hi-IN">हिन्दी (भारत)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 mb-1">Timezone for Schedule</label>
                    <select id="timezone" name="timezone" value={selectedTimezone} onChange={(e)=>setSelectedTimezone(e.target.value)} className={inputFieldClass}>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                </div>
                <div className={`${settingItemClass} py-3`}>
                    <div>
                        <label htmlFor="dark-mode-toggle-doctor" id="dark-mode-label-doctor" className="text-sm sm:text-base font-medium text-slate-800">Dark Mode Theme</label>
                        <p className="text-xs text-slate-500">Enable dark theme for the doctor portal.</p>
                    </div>
                    <ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} labelId="dark-mode-label-doctor" />
                </div>
            </div>
        </motion.section>

        {/* Account Management Section */}
        <motion.section variants={itemVariants} className="mt-10 sm:mt-12 border-t-2 border-red-200 pt-8">
             <h3 className="text-xl sm:text-2xl font-semibold text-red-600 mb-4">Account Management</h3>
             <p className="text-sm text-slate-600 mb-5">
              If you wish to permanently delete your CuraLink account and all associated data, please proceed with extreme caution. This action cannot be undone.
            </p>
            <motion.button
              onClick={() => { if(window.confirm("Are you absolutely sure you want to delete your account?")) alert("Delete Account Initiated (UI Only)")}}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-lg border border-red-300 transition-colors shadow-sm"
              whileHover={{y:-1}} whileTap={{scale:0.98}}
            >
              Request Account Deletion
            </motion.button>
        </motion.section>

        <div className="pt-12 flex justify-end">
          <motion.button
            type="button"
            className="inline-flex items-center justify-center py-2.5 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            whileHover={{y:-2, boxShadow: "0 5px 15px rgba(59,130,246,0.3)"}} whileTap={{scale:0.98}}
            onClick={handleSaveSettings}
          >
            Save All Settings
          </motion.button>
        </div>
      </div>
    </PageLayout>
  );
};

export default DoctorSettingsPage;