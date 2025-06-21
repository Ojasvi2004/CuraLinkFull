// src/pages/SettingsPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../components/Layout/PageLayout'; // Adjust path if needed
import { Link } from 'react-router-dom'; // For navigation links

// --- Example Icons ---
const BellIconSetting = () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const LockClosedIcon = () => <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;
const LanguageIcon = () => <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9.5A18.022 18.022 0 0117.588 9m-11.176 0A18.022 18.022 0 0112 2.5c4.418 0 8.463 2.012 11.176 5.5m-22.352 0A18.022 18.022 0 0112 21.5c4.418 0 8.463-2.012 11.176-5.5m-22.352 0h22.352"></path></svg>;
// --- End Example Icons ---

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


const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Example theme setting

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "circOut", delay:0.1 } },
  };

  return (
    <PageLayout
      pageTitle="Account Settings"
      pageSubtitle="Manage your notification preferences, password, and other account settings."
    >
      <div className="space-y-10 sm:space-y-12">
        {/* Notification Settings Section */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center border-b border-slate-200 pb-3 mb-6">
            <BellIconSetting />
            <h2 className="ml-3 text-xl sm:text-2xl font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-5 bg-slate-50 p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between py-3">
              <div>
                <label htmlFor="email-notifications-toggle" id="email-label" className="text-sm sm:text-base font-medium text-slate-800">Email Notifications</label>
                <p className="text-xs text-slate-500">Receive updates about appointments and platform news via email.</p>
              </div>
              <ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} labelId="email-label" />
            </div>
            <div className="flex items-center justify-between py-3 border-t border-slate-200">
              <div>
                <label htmlFor="sms-reminders-toggle" id="sms-label" className="text-sm sm:text-base font-medium text-slate-800">SMS Reminders</label>
                <p className="text-xs text-slate-500">Get text message reminders for your upcoming appointments.</p>
              </div>
              <ToggleSwitch enabled={smsReminders} setEnabled={setSmsReminders} labelId="sms-label" />
            </div>
            {/* Add more notification preferences here */}
          </div>
        </motion.section>

        {/* Security Settings Section */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center border-b border-slate-200 pb-3 mb-6">
            <LockClosedIcon />
            <h2 className="ml-3 text-xl sm:text-2xl font-semibold text-slate-800">Security & Privacy</h2>
          </div>
          <div className="space-y-3 bg-slate-50 p-4 sm:p-6 rounded-lg shadow-sm">
            <Link to="/change-password" className="block text-sm sm:text-base text-blue-600 hover:text-blue-700 hover:underline p-2 rounded-md hover:bg-blue-50 transition-colors">Change Your Password</Link>
            <Link to="/privacy-settings" className="block text-sm sm:text-base text-blue-600 hover:text-blue-700 hover:underline p-2 rounded-md hover:bg-blue-50 transition-colors">Manage Privacy Settings</Link>
            <Link to="/account-activity" className="block text-sm sm:text-base text-blue-600 hover:text-blue-700 hover:underline p-2 rounded-md hover:bg-blue-50 transition-colors">View Account Activity</Link>
          </div>
        </motion.section>

        {/* Preferences Section */}
        <motion.section variants={itemVariants}>
            <div className="flex items-center border-b border-slate-200 pb-3 mb-6">
              <LanguageIcon/>
              <h2 className="ml-3 text-xl sm:text-2xl font-semibold text-slate-800">Preferences</h2>
            </div>
            <div className="space-y-5 bg-slate-50 p-4 sm:p-6 rounded-lg shadow-sm">
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                    <select id="language" name="language" defaultValue="en-US" className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white shadow-sm">
                        <option value="en-US">English (United States)</option>
                        <option value="hi-IN">हिन्दी (भारत)</option> {/* Example Hindi */}
                        {/* Add more languages */}
                    </select>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-slate-200">
                    <div>
                        <label htmlFor="dark-mode-toggle" id="dark-mode-label" className="text-sm sm:text-base font-medium text-slate-800">Dark Mode</label>
                        <p className="text-xs text-slate-500">Toggle dark theme for the application.</p>
                    </div>
                    <ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} labelId="dark-mode-label" />
                </div>
            </div>
        </motion.section>

        {/* Account Management Section */}
        <motion.section variants={itemVariants} className="mt-10 sm:mt-12 border-t border-red-200 pt-8">
             <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-4">Account Management</h2>
             <p className="text-sm text-slate-600 mb-5">
              If you wish to permanently delete your CuraLink account and all associated data, please proceed with caution. This action cannot be undone.
            </p>
            <button
              onClick={() => { if(window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) alert("Delete Account Initiated (UI Only)")}}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-md border border-red-300 transition-colors"
            >
              Delete My Account
            </button>
        </motion.section>

        <div className="pt-10 flex justify-end">
          <motion.button
            type="button" // This would trigger your settings save logic
            className="inline-flex items-center justify-center py-2.5 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            whileHover={{y:-2, boxShadow: "0 5px 15px rgba(59,130,246,0.3)"}} whileTap={{scale:0.98}}
            onClick={(e) => {e.preventDefault(); alert("Settings Save (UI Only)")}}
          >
            Save Settings
          </motion.button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage; // Changed from { SettingsPage }