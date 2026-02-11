import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sun,StickyNote, Moon, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import api from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        toast.success("Account created! Please login.");
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* LEFT SIDE: SAME FEATURE SHOWCASE FOR CONSISTENCY */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 dark:bg-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-xl"><StickyNote className="text-indigo-600" size={24} /></div>
            <span className="text-white font-black text-2xl tracking-tight">BrainDump</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-6">Start your <br /> <span className="text-indigo-200">digital legacy.</span></h2>
          <div className="space-y-6 mt-12">
            <div className="flex gap-4 items-start bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="text-indigo-200 mt-1" size={20}/>
              <div><h4 className="text-white font-bold">Free Forever</h4><p className="text-indigo-100 text-sm">Core features will always be free for students.</p></div>
            </div>
            <div className="flex gap-4 items-start bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <Shield className="text-indigo-200 mt-1" size={20}/>
              <div><h4 className="text-white font-bold">Data Sovereignty</h4><p className="text-indigo-100 text-sm">You own your data. Export it anytime.</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <button onClick={toggleTheme} className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-yellow-400">
          {isDark ? <Sun size={20} /> : <Moon size={20} className="text-slate-800"/>}
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Join thousands of thinkers today.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
         {/* Full Name Field */}
<div className="space-y-1">
  <label htmlFor="full-name" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
    Full Name
  </label>
  <div className="relative group">
    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
    <input 
      id="full-name"
      name="name" 
      type="text" 
      required 
      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all" 
      placeholder="John Doe" 
    />
  </div>
</div>

{/* Email Field */}
<div className="space-y-1">
  <label htmlFor="email-address" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
    Email
  </label>
  <div className="relative group">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
    <input 
      id="email-address"
      name="email" 
      type="email" 
      required 
      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all" 
      placeholder="name@domain.com" 
    />
  </div>
</div>

{/* Password Field */}
<div className="space-y-1">
  <label htmlFor="password-field" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
    Password
  </label>
  <div className="relative group">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
    <input 
      id="password-field"
      name="password" 
      type={showPassword ? "text" : "password"} 
      required 
      className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all" 
      placeholder="••••••••" 
    />
    <button 
      type="button" 
      onClick={() => setShowPassword(!showPassword)} 
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none mt-4">
              Get Started <ArrowRight size={18} />
            </button>

            <p className="text-center mt-6 text-slate-500 dark:text-slate-400 font-medium text-sm">
              Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;