import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, Mail, Shield, Trash2, ArrowLeft, 
  CheckCircle2, Moon, Sun, Bell, Lock, LogOut 
} from 'lucide-react';

const SettingsPage = ({ userData, isDark, toggleTheme, onBack, onUpdateUser }) => {
  // --- States ---
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData?.name || '');
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [loading, setLoading] = useState(false);
  
  // Delete Account States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // --- Logic: Update Profile ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const isNameChanged = newName.trim() !== "" && newName !== userData.name;
    const isNewPasswordEntered = passwords.next.trim() !== "";
    const hasEnteredCurrentPassword = passwords.current.trim() !== "";
    // Inside handleUpdateProfile, before the try/catch:
if (isNewPasswordEntered && passwords.next.length < 6) {
  return toast.error("New password must be at least 6 characters long.");
}

    if (!isNameChanged && !isNewPasswordEntered) {
      return toast.error("No changes detected.");
    }

    if (!hasEnteredCurrentPassword) {
      return toast.error("Enter your current password to authorize changes.");
    }

    const loadingToast = toast.loading("Updating profile...");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const updateData = { currentPassword: passwords.current };
      if (isNameChanged) updateData.name = newName;
      if (isNewPasswordEntered) updateData.nextPassword = passwords.next;

      await axios.patch('http://localhost:5000/api/auth/update-profile', 
        updateData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const updatedUser = { ...userData, name: newName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onUpdateUser) onUpdateUser(updatedUser);

      toast.success("Profile updated! ", { id: loadingToast });
      setIsEditing(false);
      setPasswords({ current: '', next: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: Logout ---
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // --- Logic: Delete Account ---
  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error("Password required for deletion.");

    const loadingToast = toast.loading("Deleting account...");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Sending password in the 'data' property for DELETE requests
      await axios.delete('http://localhost:5000/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deletePassword }
      });

      toast.success("Account deleted.", { id: loadingToast });
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect password", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 text-center shadow-sm sticky top-6">
            <div className="h-24 w-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[24px] flex items-center justify-center text-white text-3xl font-black shadow-xl mx-auto mb-4">
              {userData?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl font-bold truncate">{userData?.name || 'User'}</h3>
            <p className="text-slate-400 text-sm mb-6 truncate">{userData?.email}</p>
          </div>
        </div>

        {/* Right: Settings Sections */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Appearance */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Sun size={20} className="text-indigo-500" />
              <h2 className="font-bold uppercase text-xs tracking-widest">Appearance</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold">Dark Mode</p>
                <p className="text-sm text-slate-500">Adjust visual theme</p>
              </div>
              <button onClick={toggleTheme} className={`w-14 h-8 rounded-full transition-all relative ${isDark ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${isDark ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* 2. Account & Security */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-emerald-500" />
                <h2 className="font-bold uppercase text-xs tracking-widest">Account & Security</h2>
              </div>
              <button onClick={() => setIsEditing(!isEditing)} className="text-xs font-bold text-indigo-600 hover:underline">
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="fullName" className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                    <input id="fullName" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="currentPassword" className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Password</label>
                      <input type="password" id="currentPassword" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="newPassword" className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password (Optional)</label>
                      <input id="newPassword" type="password" value={passwords.next} onChange={(e) => setPasswords({...passwords, next: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <Mail className="text-slate-400" size={20} />
                      <div className="truncate">
                        <p className="text-[10px] font-black uppercase text-slate-400">Email Address</p>
                        <p className="font-bold text-sm truncate">{userData?.email}</p>
                      </div>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all group">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                      <LogOut size={18} />
                    </div>
                    <p className="font-bold text-sm text-red-600">Sign Out of Account</p>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 3. Danger Zone */}
          <section className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[32px] p-6">
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-red-600">Delete Account</p>
                  <p className="text-sm text-red-500/70">Permanently remove all your notes</p>
                </div>
                <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-3 bg-white dark:bg-slate-900 text-red-600 border border-red-200 dark:border-red-900/50 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
                  Delete Forever
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <p className="font-bold text-red-600">Confirm Deletion</p>
                <p className="text-sm text-red-500/70">Enter your password to confirm account deletion. This cannot be undone.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="password" 
                    placeholder="Verify Password" 
                    value={deletePassword} 
                    onChange={(e) => setDeletePassword(e.target.value)} 
                    className="flex-1 p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleDeleteAccount} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700">Confirm</button>
                    <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }} className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;