import apiClient from './api';

export interface FactoryQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  is_active?: boolean;
}

export interface AnalyticsParams {
  period?: number;
  type?: 'days' | 'weeks' | 'months';
  date_from?: string;
  date_to?: string;
}

export const factoriesService = {
  getAll: async (params?: FactoryQueryParams) => {
    const response = await apiClient.get('/factories', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/factories/${id}`);
    return response.data;
  },

  create: async (factoryData: any) => {
    const response = await apiClient.post('/factories', factoryData);
    return response.data;
  },

  update: async (id: number, factoryData: any) => {
    const response = await apiClient.put(`/factories/${id}`, factoryData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/factories/${id}`);
    return response.data;
  },

  getOrders: async (factoryId: number, params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get(`/factories/${factoryId}/orders`, { params });
    return response.data;
  },

  getAnalytics: async (factoryId: number, params?: AnalyticsParams) => {
    const response = await apiClient.get(`/factories/${factoryId}/analytics`, { params });
    return response.data;
  },
};
