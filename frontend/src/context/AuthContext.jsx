import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, logoutApi, getMeApi, updateProfileApi } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('brew_haven_token');
      if (token) {
        try {
          const data = await getMeApi();
          setUser(data.user);
        } catch (error) {
          console.error('Session restoration error:', error);
          localStorage.removeItem('brew_haven_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data.token) {
      localStorage.setItem('brew_haven_token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerApi(userData);
    if (data.token) {
      localStorage.setItem('brew_haven_token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('brew_haven_token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const data = await updateProfileApi(profileData);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
