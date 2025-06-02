// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Leemos el estado inicial de localStorage (si hubo sesión anterior)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  });

  // Cada vez que cambie isAuthenticated, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
