import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success("Success! Check your inbox.");
    } catch (err) {
      toast.error("User not found or error sending mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-xl">
        <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-6 font-bold transition-all">
          <ArrowLeft size={18}/> Back to Login
        </Link>
        <h2 className="text-3xl font-black mb-2">Lost your way?</h2>
        <p className="text-slate-500 mb-8">No worries. Enter your email and we'll send a recovery link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
            {loading ? "Sending..." : "Send Recovery Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;