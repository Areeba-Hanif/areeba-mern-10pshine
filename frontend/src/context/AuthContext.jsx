import React, { createContext, useState, useEffect } from 'react';

// Export the context so useAuth.js can see it
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AuthContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}