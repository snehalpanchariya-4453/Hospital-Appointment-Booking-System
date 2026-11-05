import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hospital_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('hospital_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authService.login({ email, password });
      if (res.data && res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('hospital_token', token);
        localStorage.setItem('hospital_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  // Register
  const register = async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res.data && res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('hospital_token', token);
        localStorage.setItem('hospital_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  // Quick Demo Login helper for 3 roles
  const quickDemoLogin = async (roleName) => {
    if (roleName === 'admin') {
      return await login('admin@blossomhospital.com', 'admin123');
    } else if (roleName === 'doctor') {
      return await login('sarah.jenkins@blossomhospital.com', 'doctor123');
    } else {
      return await login('patient@blossomhospital.com', 'patient123');
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('hospital_token');
    localStorage.removeItem('hospital_user');
    setToken(null);
    setUser(null);
  };

  // Update local user state
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('hospital_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
