import axios from 'axios';
import { authStore } from './auth/authStore';
import { Status, Severity } from '../types/status';

interface Crisis {
  id: string;
  title: string;
  description: string;
  status: Status;
  severity: Severity;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrisisFormData {
  title: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  severity: Severity;
  media?: File[];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token and role to requests
api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  const user = authStore.getUser();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (user?.email === 'admin@example.com') {
      config.headers['X-User-Role'] = 'admin';
    } else if (user?.role) {
      config.headers['X-User-Role'] = user.role;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.clearAuth();
      window.location.href = '/';
    }
    throw error;
  }
);

export const crisisService = {
  async reportCrisis(data: CrisisFormData) {
    try {
      const formData = new FormData();
      
      formData.append('crisisData', JSON.stringify({
        title: data.title,
        description: data.description,
        location: data.location,
        severity: data.severity,
      }));
      
      if (data.media?.length) {
        data.media.forEach((file) => {
          formData.append('media', file);
        });
      }

      const response = await api.post('/crisis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error reporting crisis:', error);
      throw error;
    }
  },

  async getAllCrises(filters?: { severity?: Severity; status?: Status }) {
    try {
      const response = await api.get('/crisis/all', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching all crises:', error);
      throw error;
    }
  },

  async getMyCrises() {
    try {
      const response = await api.get('/crisis/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching user crises:', error);
      throw error;
    }
  },

  async updateStatus(crisisId: string, status: Status): Promise<Crisis> {
    const user = authStore.getUser();
    
    if (user?.email === 'admin@example.com' || (user?.role === 'admin')) {
      try {
        const response = await api.patch<Crisis>(`/crisis/${crisisId}/status`, { 
          status,
          updatedAt: new Date().toISOString(),
        });
        
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Update status error:', error.response?.data);
          const message = error.response?.data?.message || 'Failed to update status';
          throw new Error(message);
        }
        throw error;
      }
    } else {
      throw new Error('Only admins can update status');
    }
  }
};