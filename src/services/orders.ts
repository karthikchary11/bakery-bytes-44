import apiClient from './api';

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  payment_status?: string;
  user_id?: number;
  date_from?: string;
  date_to?: string;
}

export interface CreateOrderData {
  user_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  delivery_date?: string;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: 'pending' | 'confirmed' | 'packed' | 'delivered' | 'cancelled';
  payment_status?: string;
}

export const ordersService = {
  getAll: async (params?: OrderQueryParams) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData: CreateOrderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  updateStatus: async (id: number, statusData: UpdateOrderStatusData) => {
    const response = await apiClient.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  getByFactory: async (factoryId: number, params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get(`/orders/factory/${factoryId}`, { params });
    return response.data;
  },

  getByBranch: async (branch: string, params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get(`/orders/branch/${branch}`, { params });
    return response.data;
  },
};
