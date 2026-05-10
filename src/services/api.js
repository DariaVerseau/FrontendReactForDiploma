import axios from 'axios';

const API_BASE = '/api/v1'; 

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Добавляем токен из localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (email, password) => api.post('/register', { email, password })
};

export const imageApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/images', formData);
  },
  process: (endpoint, file, params = {}) => {
    const formData = new FormData();
    formData.append('image', file);
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    return api.post(`/ml/${endpoint}`, formData);
  },
  getGallery: () => api.get('/images')
};