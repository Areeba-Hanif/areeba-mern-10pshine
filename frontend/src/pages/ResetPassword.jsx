import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams(); // Extracts the token from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      // 2. Call the backend API
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      
      if (response.data.success) {
        toast.success("Password updated! You can now login.");
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800">
        
        {/* Icon Header */}
        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-200 dark:shadow-none">
          <ShieldCheck size={32} />
        </div>
        
        <h2 className="text-3xl font-black mb-2 dark:text-white text-slate-900">New Password</h2>
        <p className="text-slate-500 mb-8 font-medium">Please enter your new secure password below.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="New Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <><CheckCircle size={20}/> Update Password</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all">
            <ArrowLeft size={18}/> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;