import React, { useState } from 'react'; // Added useState here
import { Mail, Lock, Eye, EyeOff, Sun, Moon, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import api from '../services/api'; // Ensure this path is correct
import logger from '../utils/logger'; // Ensure this path is correct

const Login = () => {
  const navigate = useNavigate();

  // --- 1. ALL STATE GOES INSIDE THE COMPONENT ---
  const { isDark, toggleTheme } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  
 const handleLogin = async (e) => {
  e.preventDefault();
  
  // 1. Capture values correctly
  const email = e.target.email.value;
  const password = e.target.password.value;

  logger.info({ email }, "Attempting login...");

  try {
    const response = await api.post('/auth/login', { email, password });
    
    
    console.log("Backend Response:", response.data);

   
    if (response.data.success) {
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      logger.info("Login successful, navigating to dashboard");
      toast.success("Login Successfull");
      navigate('/dashboard');
    }
  } catch (error) {
    
    const message = error.response?.data?.message || "Invalid Credentials";
    logger.error({ err: message }, "Login failed");
  
    toast.error(message);
  }
};

  return (
   
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-500">
      <button 
        onClick={toggleTheme}
        type="button"
        className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-yellow-400 hover:scale-110 transition-all"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md">
        <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-2xl overflow-hidden">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.4rem]">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Capture your thoughts, anywhere.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
                  <input 
                    type="email" 
                    name="email" 
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all" 
                    placeholder="name@domain.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 outline-none dark:text-white transition-all" 
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

              <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                Sign In <ArrowRight size={18} />
              </button>

              <p className="text-center mt-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                New here? <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4 ml-1">Create account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;