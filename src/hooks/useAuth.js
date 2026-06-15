// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      console.log('🔍 Проверка авторизации...', { 
        hasToken: !!token, 
        userId 
      });
      
      if (!token || !userId) {
        console.log('❌ Нет токена или userId');
        setLoading(false);
        return;
      }
      
      try {
        // Проверяем валидность токена
        const response = await api.get('/images?page=1&limit=1');
        console.log('✅ Токен валиден!', response.status);
        setUser({ id: userId, token });
      } catch (error) {
        console.log('❌ Токен невалиден:', error.response?.status);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('📤 Отправка запроса на /login');
      const response = await api.post('/login', { email, password });
      console.log('✅ Ответ:', response.data);
      
      const { token, user_id } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user_id);
      setUser({ id: user_id, token });
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка входа:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Ошибка входа');
    }
  };

  const register = async (email, password) => {
    try {
      console.log('📤 Отправка запроса на /register');
      const response = await api.post('/register', { email, password });
      console.log('✅ Ответ:', response.data);
      
      const { token, user_id } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user_id);
      setUser({ id: user_id, token });
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Ошибка регистрации');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return { user, loading, login, register, logout };
};