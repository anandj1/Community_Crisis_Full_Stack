import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token and role to every request
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // Add user role if available
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role) {
          config.headers['X-User-Role'] = user.role;
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }
  
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };