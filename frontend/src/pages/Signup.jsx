
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Mail, Lock, User, Eye, EyeOff, Sun, Moon, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import logger from '../utils/logger';

const Signup = () => {
  const navigate = useNavigate(); // Uncommented
  // ADD THIS LINE INSTEAD:
  const { isDark, toggleTheme } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  

  // Real-time Validation Logic
  useEffect(() => {
    const newErrors = {};
    
    if (formData.fullName && !/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(formData.fullName)) {
      newErrors.fullName = "Need both capital & small letters";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)) {
      newErrors.password = "Need 6+ chars, 1 Cap, 1 Small, 1 Num";
    }

    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return toast.error("Please fix the validation errors first!");
    }

    const loadingToast = toast.loading("Creating your account...");
    try {
      const response = await api.post('/auth/register', { 
        name: formData.fullName, 
        email: formData.email, 
        password: formData.password 
      });

      if (response.data.success) {
        toast.success("Welcome aboard!", { id: loadingToast });
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-500">
      <button onClick={toggleTheme} type="button" className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-yellow-400">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md">
        <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-2xl overflow-hidden">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.4rem]">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Start Fresh</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Join thousands of thinkers.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.fullName ? 'text-red-400' : 'text-slate-400 group-focus-within:text-purple-500'}`} size={18} />
                  <input 
                    name="fullName" 
                    onChange={handleChange} 
                    type="text" 
                    required 
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 bg-slate-50 dark:bg-slate-950 outline-none dark:text-white transition-all font-medium ${errors.fullName ? 'border-red-400' : 'border-slate-100 dark:border-slate-800 focus:border-purple-500'}`} 
                    placeholder="Areeba Khan" 
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-red-500 font-bold ml-2 animate-pulse">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-purple-500'}`} size={18} />
                  <input 
                    name="email" 
                    onChange={handleChange} 
                    type="email" 
                    required 
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 bg-slate-50 dark:bg-slate-950 outline-none dark:text-white transition-all font-medium ${errors.email ? 'border-red-400' : 'border-slate-100 dark:border-slate-800 focus:border-purple-500'}`} 
                    placeholder="name@domain.com" 
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 font-bold ml-2 animate-pulse">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-purple-500'}`} size={18} />
                  <input 
                    name="password"
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"} 
                    required
                    className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 bg-slate-50 dark:bg-slate-950 outline-none dark:text-white transition-all font-medium ${errors.password ? 'border-red-400' : 'border-slate-100 dark:border-slate-800 focus:border-purple-500'}`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 font-bold ml-2 animate-pulse">{errors.password}</p>}
              </div>

              <button 
                type="submit" 
                disabled={Object.keys(errors).length > 0}
                className={`w-full py-4 mt-2 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${Object.keys(errors).length > 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-700'}`}
              >
                Create Account <UserPlus size={18} />
              </button>

              <p className="text-center mt-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                Already have an account? <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline underline-offset-4 ml-1">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;