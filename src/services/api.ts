import axios from 'axios';
import { authStore } from './auth/authStore';

const API_URL = import.meta.env.VITE_API_URL||'https://community-crisis-full-stack.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  const user = authStore.getUser();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (user?.role) {
      config.headers['X-User-Role'] = user.role;
    }
  }
  return config;
});


// Handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify', { email, otp });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      sessionStorage.removeItem('pendingOTPEmail');
    }
    return response.data;
  },
};

export { api };
