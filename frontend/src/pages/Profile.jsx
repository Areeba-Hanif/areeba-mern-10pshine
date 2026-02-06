import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, LogOut, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me'); // Adjust path to your "get user" route
        if (response.data.success) setUserData(response.data.user);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
  // Clear everything from local storage
  localStorage.removeItem("token"); 
  localStorage.clear(); 
  
  toast.success("Logged out successfully");
  
  // Redirect to login
  navigate('/login');
};

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation / Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 mb-4">
              <User size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{userData?.name}</h1>
            <p className="text-slate-500">Member since {new Date(userData?.createdAt).getFullYear()}</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center gap-4">
              <Mail className="text-indigo-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Email Address</p>
                <p className="font-bold">{userData?.email}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center gap-4">
              <ShieldCheck className="text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Account Status</p>
                <p className="font-bold">Verified Free Account</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-10 py-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;