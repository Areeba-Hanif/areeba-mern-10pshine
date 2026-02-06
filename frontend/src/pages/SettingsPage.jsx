import React from 'react';
import axios from 'axios';
import { 
  User, Mail, Shield, Trash2, ArrowLeft, 
  CheckCircle2, Moon, Sun, Bell, Lock , LogOut,
} from 'lucide-react';

const SettingsPage = ({ userData, isDark, toggleTheme, onBack }) => {

const handleLogout = () => {
  // 1. Remove the token from local storage
  localStorage.removeItem('token');
  
  // 2. Optional: Remove user data if you store it in localStorage
  localStorage.removeItem('userData');

  // 3. Redirect to the login page
  // This will refresh the app state and ensure all private data is cleared from memory
  window.location.href = '/login'; 
};

const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure? This is permanent.")) return;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete('http://localhost:5000/api/auth/delete-account', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      alert("Account deleted.");
      localStorage.clear();
      window.location.href = '/login';
    }
  } catch (error) {
    // THIS LINE is the key to finding the bug:
    const message = error.response?.data?.message || "Server connection failed";
    console.error("Backend Error Details:", error.response?.data);
    alert(`Error: ${message}`); 
  }
};

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 text-center shadow-sm">
            <div className="h-24 w-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[24px] flex items-center justify-center text-white text-3xl font-black shadow-xl mx-auto mb-4">
              {userData?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl font-bold">{userData?.name || 'User'}</h3>
            <p className="text-slate-400 text-sm mb-6">{userData?.email}</p>
           
          </div>
        </div>

        {/* Right Column: Settings Options */}
        <div className="md:col-span-2 space-y-6">
          {/* Appearance Section */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Sun size={20} className="text-indigo-500" />
              <h2 className="font-bold uppercase text-xs tracking-widest">Appearance</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold">Dark Mode</p>
                <p className="text-sm text-slate-500">Adjust the app's visual theme</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full transition-all relative ${isDark ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${isDark ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* Account Details Section */}
      {/* Account Details Section */}
<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Shield size={20} className="text-emerald-500" />
      <h2 className="font-bold uppercase text-xs tracking-widest">Account & Security</h2>
    </div>
    {/* Optional: Add an Edit Button here */}
    <button className="text-xs font-bold text-indigo-600 hover:underline">Edit Profile</button>
  </div>
  
  <div className="p-6 space-y-4">
    {/* Email Display */}
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
      <div className="flex items-center gap-4">
        <Mail className="text-slate-400" size={20} />
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400">Email Address</p>
          <p className="font-bold text-sm">{userData?.email}</p>
        </div>
      </div>
      <CheckCircle2 size={16} className="text-emerald-500" />
    </div>

    {/* Logout Button inside Settings */}
    <button 
     onClick={handleLogout}
      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group"
    >
      <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
        <LogOut size={18} />
      </div>
      <p className="font-bold text-sm text-slate-600 dark:text-slate-300">Sign Out of Account</p>
    </button>
  </div>
</section>
          {/* Danger Zone */}
          <section className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[32px] p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-red-600">Delete Account</p>
              <p className="text-sm text-red-500/70">Permanently remove all your notes</p>
            </div>
            <button onClick={handleDeleteAccount} className="px-6 py-3 bg-white dark:bg-slate-900 text-red-600 border border-red-200 dark:border-red-900/50 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
              Delete Forever
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;