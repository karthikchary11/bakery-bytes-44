import apiClient from './api';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  factory_id?: number;
}

export const usersService = {
  getAll: async (params?: UserQueryParams) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getPending: async () => {
    const response = await apiClient.get('/users/pending');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: any) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  update: async (id: number, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  approve: async (id: number) => {
    const response = await apiClient.put(`/users/${id}/approve`);
    return response.data;
  },

  reject: async (id: number) => {
    const response = await apiClient.put(`/users/${id}/reject`);
    return response.data;
  },
};
