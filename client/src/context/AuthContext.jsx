import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('lms_token');
      if (token) {
        try {
          const u = await api.getMe();
          if (u && u._id) {
            setUser(u);
          } else {
            localStorage.removeItem('lms_token');
          }
        } catch (e) {
          console.error('Failed to restore auth session:', e);
          localStorage.removeItem('lms_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token) {
      localStorage.setItem('lms_token', res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password, role) => {
    const res = await api.register({ name, email, password, role });
    if (res.token) {
      localStorage.setItem('lms_token', res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const u = await api.getMe();
      if (u && u._id) setUser(u);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
