import apiClient from './api';

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  factory_id?: number;
  branch?: string;
  low_stock?: boolean;
}

export interface CreateInventoryData {
  product_id: number;
  factory_id: number;
  branch: string;
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
}

export interface UpdateStockData {
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
}

export interface BulkUpdateData {
  updates: Array<{
    id: number;
    stock_quantity?: number;
    min_stock_level?: number;
    max_stock_level?: number;
  }>;
}

export const inventoryService = {
  getAll: async (params?: InventoryQueryParams) => {
    const response = await apiClient.get('/inventory', { params });
    return response.data;
  },

  getLowStock: async (params?: { factory_id?: number; branch?: string }) => {
    const response = await apiClient.get('/inventory/low-stock', { params });
    return response.data;
  },

  getByFactory: async (factoryId: number, params?: { branch?: string; low_stock?: boolean }) => {
    const response = await apiClient.get(`/inventory/factory/${factoryId}`, { params });
    return response.data;
  },

  create: async (inventoryData: CreateInventoryData) => {
    const response = await apiClient.post('/inventory', inventoryData);
    return response.data;
  },

  updateStock: async (id: number, stockData: UpdateStockData) => {
    const response = await apiClient.put(`/inventory/${id}/stock`, stockData);
    return response.data;
  },

  bulkUpdate: async (bulkData: BulkUpdateData) => {
    const response = await apiClient.put('/inventory/bulk-update', bulkData);
    return response.data;
  },
};
