import apiClient from './api';

export interface AnalyticsParams {
  period?: number;
  type?: 'days' | 'weeks' | 'months';
  groupBy?: 'day' | 'week' | 'month';
  factory_id?: number;
}

export const analyticsService = {
  getOverview: async (params?: AnalyticsParams) => {
    const response = await apiClient.get('/analytics/overview', { params });
    return response.data;
  },

  getFactoryAnalytics: async (factoryId: number, params?: AnalyticsParams) => {
    const response = await apiClient.get(`/analytics/factory/${factoryId}`, { params });
    return response.data;
  },

  getRevenue: async (params?: AnalyticsParams) => {
    const response = await apiClient.get('/analytics/revenue', { params });
    return response.data;
  },

  getProducts: async (params?: AnalyticsParams) => {
    const response = await apiClient.get('/analytics/products', { params });
    return response.data;
  },
};
