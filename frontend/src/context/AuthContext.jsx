import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Function to refresh user data globally
  const refreshUser = (newDetails) => {
    setUserData(newDetails);
    // Sync with localStorage so it survives page refreshes
    localStorage.setItem('user', JSON.stringify(newDetails));
  };



  return (
    <AuthContext.Provider value={{ userData,isDark, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
  
};


export const useAuth = () => useContext(AuthContext);