// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authApi } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ id: userId, token });
    }
  }, []);

   const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const userData = response.data;
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userId', userData.user_id);
      setUser({ id: userData.user_id, token: userData.token });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      const errorStatus = error.response?.status;
      console.error('Login error:', errorStatus, errorMessage);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (email, password) => {
    try {
      const response = await authApi.register(email, password);
      const userData = response.data;
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userId', userData.user_id);
      setUser({ id: userData.user_id, token: userData.token });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      const errorStatus = error.response?.status;
      console.error('Register error:', errorStatus, errorMessage);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return { user, login, register, logout }; // ← добавлен register
};