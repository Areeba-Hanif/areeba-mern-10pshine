import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sun, Moon,StickyNote, Sparkles ,ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import api from '../services/api'; 
import logger from '../utils/logger';

const Login = () => {
  const navigate = useNavigate();

  // --- 1. STATE & CONTEXT ---
 // Add 'login' to your destructuring
const { isDark, toggleTheme, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // --- 2. LOGIN LOGIC (Your original code) ---
const handleLogin = async (e) => {
  e.preventDefault();
  
  const email = e.target.email.value;
  const password = e.target.password.value;

  logger.info({ email }, "Attempting login...");

  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      const { token, user } = response.data.data;

      // REPLACE THE MANUAL SETITEM LINES WITH THIS:
      login(token, user); 

      logger.info("Login successful, navigating to dashboard");
      toast.success("Login Successful");
      
      // Now navigation will work because the Auth State is "true"
      navigate('/dashboard');
    }
  } catch (error) {
    const message = error.response?.data?.message || "Invalid Credentials";
    logger.error({ err: message }, "Login failed");
    toast.error(message);
  }
};

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* --- LEFT SIDE: FEATURE SHOWCASE (The Website Intro) --- */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 dark:bg-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <StickyNote className="text-indigo-600" size={24} />
            </div>
            <span className="text-white font-black text-2xl tracking-tight">BrainDump</span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Your second brain, <br /> 
            <span className="text-indigo-200">perfectly organized.</span>
          </h2>
          
          <div className="space-y-6 mt-12">
            {[
              { icon: <CheckCircle2 size={20}/>, title: "Smart Notes", desc: "Markdown support with instant previews." },
              { icon: <Shield size={20}/>, title: "Private & Secure", desc: "Encrypted storage for your sensitive data." },
              { icon: <Sparkles size={20}/>, title: "Fast Search", desc: "Find any note in milliseconds." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="text-indigo-200 mt-1">{feature.icon}</div>
                <div>
                  <h4 className="text-white font-bold">{feature.title}</h4>
                  <p className="text-indigo-100 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-indigo-200 text-sm font-medium">
          © 2026 BrainDump Notes. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          type="button"
          className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-yellow-400 hover:scale-110 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Please sign in to access your notes.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all shadow-sm" 
                  placeholder="name@domain.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                {/* --- FORGOT PASSWORD LINK --- */}
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all shadow-sm" 
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

            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
              Sign In <ArrowRight size={18} />
            </button>

            <p className="text-center mt-6 text-slate-500 dark:text-slate-400 font-medium text-sm">
              New here? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4 ml-1">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;