// src/services/api.js
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
  console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (email, password) => api.post('/register', { email, password })
};

export const imageApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const title = file.name.replace(/\.[^/.]+$/, '');
    formData.append('title', title);
    console.log('Uploading file:', file.name);
    return api.post('/images', formData);
  },
  
  // ✅ НОВЫЙ МЕТОД: обработка по ID изображения (без повторной загрузки файла)
  processWithImageId: (endpoint, imageId, params = {}) => {
    const formData = new FormData();
    formData.append('image_id', imageId);
    
    // Название для обработанного изображения
    const title = `processed_${imageId}_${Date.now()}`;
    formData.append('title', title);
    
    // Передаём style ТОЛЬКО для style_transfer
    if (endpoint === 'style_transfer' || endpoint === 'basic_style_transfer') {
      const style = params.style || 'vangogh';
      formData.append('style', style);
    }
    
    // Для upscale добавляем scale
    if (endpoint === 'upscale' && params.scale) {
      formData.append('scale', params.scale.toString());
    }
    
    // Для enhance (restore_portrait) добавляем параметры
    if (endpoint === 'enhance') {
    if (params.fidelity_weight !== undefined) {
        formData.append('fidelity_weight', params.fidelity_weight.toString());
    }
    if (params.postprocess !== undefined) {
        formData.append('postprocess', params.postprocess.toString());
    }
  
    if (params.colorize !== undefined) {
        console.log('Adding colorize:', params.colorize);  // ← добавить для отладки
        formData.append('colorize', params.colorize.toString());
    }
}
    
    // Для postprocess добавляем параметры
    if (endpoint === 'postprocess') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }
    
    console.log('🔍 Sending to backend:');
    console.log('  endpoint:', endpoint);
    console.log('  image_id:', imageId);
    console.log('  params:', params);
    
    // Выведите содержимое FormData
    for (let pair of formData.entries()) {
        console.log('  formData:', pair[0], pair[1]);
    }
    
    console.log(`Processing ${endpoint} with image_id: ${imageId}, params:`, params);
    return api.post(`/ml/${endpoint}`, formData);
  },
  
  // Старый метод (оставляем для обратной совместимости, но лучше использовать processWithImageId)
  process: (endpoint, file, params = {}) => {
    const formData = new FormData();
    formData.append('image', file);
    const title = file.name.replace(/\.[^/.]+$/, '') + '_processed';
    formData.append('title', title);
    
    if (endpoint === 'style_transfer' || endpoint === 'basic_style_transfer') {
      const style = params.style || 'vangogh';
      formData.append('style', style);
    }
    
    if (endpoint === 'upscale' && params.scale) {
      formData.append('scale', params.scale.toString());
    }
    
    if (endpoint === 'enhance') {
    if (params.fidelity_weight !== undefined) {
      formData.append('fidelity_weight', params.fidelity_weight.toString());
    }
    if (params.postprocess !== undefined) {
      formData.append('postprocess', params.postprocess.toString());
    }
    
    if (params.colorize !== undefined) {
      formData.append('colorize', params.colorize.toString());
    }
  }
    
    if (endpoint === 'postprocess') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }
    
    console.log(`Processing ${endpoint} with params:`, params);
    return api.post(`/ml/${endpoint}`, formData);
  },
  
  getGallery: () => api.get('/images')
};

export default api;