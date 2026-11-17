import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('trident_user');
    return savedUser
      ? JSON.parse(savedUser)
      : {
          _id: 'default_judge_id',
          name: 'Dr. Zaid Al-Mansoor (Chief Evaluator)',
          email: 'judge@trident.hec',
          role: 'Judge/Admin',
          badgeNumber: 'JUDGE-01',
          department: 'Tactical Evaluation Board'
        };
  });
  const [token, setToken] = useState(() => localStorage.getItem('trident_token') || 'demo_token_judge');
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem('trident_demo_role') || 'Judge/Admin');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('trident_demo_role', currentRole);
  }, [currentRole]);

  const switchDemoRole = async (newRole) => {
    setLoading(true);
    try {
      const res = await authAPI.demoLogin(newRole);
      if (res.data?.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        setCurrentRole(newRole);
        localStorage.setItem('trident_token', res.data.token);
        localStorage.setItem('trident_user', JSON.stringify(res.data.user));
        localStorage.setItem('trident_demo_role', newRole);
      }
    } catch (err) {
      // Local fallback for offline/instant evaluation
      const fallbackUser = {
        _id: `user_${newRole.toLowerCase().slice(0, 3)}`,
        name: `Officer (${newRole})`,
        email: `${newRole.toLowerCase().replace(/[^a-z]/g, '')}@trident.hec`,
        role: newRole,
        badgeNumber: `TRI-${newRole.slice(0, 3).toUpperCase()}`,
        department: 'Tactical Wildlife Command'
      };
      setUser(fallbackUser);
      setCurrentRole(newRole);
      localStorage.setItem('trident_user', JSON.stringify(fallbackUser));
      localStorage.setItem('trident_demo_role', newRole);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        setCurrentRole(res.data.user.role);
        localStorage.setItem('trident_token', res.data.token);
        localStorage.setItem('trident_user', JSON.stringify(res.data.user));
        localStorage.setItem('trident_demo_role', res.data.user.role);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      if (res.data?.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        setCurrentRole(res.data.user.role);
        localStorage.setItem('trident_token', res.data.token);
        localStorage.setItem('trident_user', JSON.stringify(res.data.user));
        localStorage.setItem('trident_demo_role', res.data.user.role);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trident_token');
    localStorage.removeItem('trident_user');
    localStorage.removeItem('trident_demo_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        currentRole,
        loading,
        isAuthenticated: !!token,
        switchDemoRole,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
