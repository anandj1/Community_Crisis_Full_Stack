import axios from 'axios';
import { authStore } from './auth/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach token and user role to each request
api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  const user = authStore.getUser();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (user?.role) {
      config.headers['X-User-Role'] = user.role;
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export const crisisService = {
  async getAllCrises(filters = {}) {
    try {
      console.log('Fetching all crises with filters:', filters);
      const response = await api.get('/crisis/all');
      console.log('Crisis response:', response.data);
      
      const crises = Array.isArray(response.data) ? response.data : [];
      console.log('Processed crises:', crises);
      
      return crises;
    } catch (error) {
      console.error('Error fetching crises:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch crises');
    }
  },

  async getMyCrises() {
    try {
      const user = authStore.getUser();
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching user crises for:', user.id);
      const response = await api.get('/crisis/my');
      console.log('My crises response:', response.data);
      
      const crises = Array.isArray(response.data) ? response.data : [];
      console.log('Processed my crises:', crises);
      
      return crises;
    } catch (error) {
      console.error('Error fetching user crises:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch your crises');
    }
  },

  async reportCrisis(data) {
    try {
      const formData = new FormData();
      const user = authStore.getUser();

      if (!user || !user.id) {
        throw new Error('User is not authenticated');
      }

      formData.append('title', data.title.trim());
      formData.append('description', data.description.trim());
      formData.append('location', JSON.stringify(data.location));
      formData.append('severity', data.severity);
      formData.append('reportedBy', user.id);

      if (data.media?.length) {
        data.media.forEach(file => {
          if (file instanceof File) {
            formData.append('media', file);
          }
        });
      }

      const response = await api.post('/crisis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      console.error('Error reporting crisis:', error);
      throw new Error(error.response?.data?.message || 'Failed to report crisis');
    }
  },

  async updateStatus(crisisId, status) {
    try {
      console.log('Updating crisis status:', { crisisId, status });
      const response = await api.patch(`/crisis/${crisisId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  }
};