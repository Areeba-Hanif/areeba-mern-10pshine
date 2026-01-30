import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sun, Moon, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-500">
      {/* Theme Switcher */}
      <button 
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-yellow-400 hover:scale-110 transition-all"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md group">
        <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-2xl overflow-hidden">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.4rem] transition-colors duration-500">
           <div className="mb-8 text-center">
  <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Start Fresh</h1>
  <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Join thousands of thinkers and creators.</p>
</div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input type="text" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-purple-500 outline-none dark:text-white transition-all font-medium" placeholder="Areeba Khan" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input type="email" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-purple-500 outline-none dark:text-white transition-all font-medium" placeholder="name@domain.com" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-purple-500 outline-none dark:text-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="w-full py-4 mt-2 bg-slate-900 dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 group/btn transition-all shadow-lg active:scale-95">
                Create Account
                <UserPlus size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Already have an account? <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline underline-offset-4">Log in</Link>
              </p>
            


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;