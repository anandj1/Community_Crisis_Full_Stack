import { api } from './config';
import type { Crisis, CrisisFormData } from '../../types';

export const crisisApi = {
  async reportCrisis(data: CrisisFormData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please sign in to report a crisis');
      }

      const formData = new FormData();
      
      const crisisData = {
        title: data.title.trim(),
        description: data.description.trim(),
        location: {
          ...data.location,
          address: data.location.address.trim()
        },
        severity: data.severity
      };
      
      formData.append('crisisData', JSON.stringify(crisisData));
      
      if (data.media?.length) {
        data.media.forEach(file => {
          formData.append('media', file);
        });
      }

      const response = await api.post<{ message: string; crisis: Crisis }>(
        '/crisis',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async getAllCrises(filters?: { severity?: string; status?: string }) {
    const response = await api.get<Crisis[]>('/crisis/all', { params: filters });
    return response.data;
  },

  async getMyCrises() {
    const response = await api.get<Crisis[]>('/crisis/my');
    return response.data;
  },

  async updateStatus(crisisId: string, status: string) {
    try {
      // Explicitly set method to PATCH and include the Content-Type header
      const response = await api.patch<Crisis>(`/crisis/${crisisId}/status`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update crisis status. Admin access required.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
};