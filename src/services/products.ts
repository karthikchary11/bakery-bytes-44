import apiClient from './api';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  factory_id?: number;
  is_active?: boolean;
  search?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category: string;
  factory_id: number;
  is_active?: boolean;
}

export const productsService = {
  getAll: async (params?: ProductQueryParams) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },

  getByCategory: async (category: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get(`/products/category/${category}`, { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData: CreateProductData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  update: async (id: number, productData: Partial<CreateProductData>) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
