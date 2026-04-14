import { api } from '../../../lib/api';
import type { Product, CreateProductDto, UpdateProductDto, ProductQueryParams, PaginatedProductResponse } from '../types/product.types';

export const productApi = {
  getAll: async (params?: ProductQueryParams) => {
    const { data } = await api.get<{ data: Product[], pagination: any }>('/products', { params });
    // Assuming backend returns { success: true, data: [...], pagination: {...} }
    return { data: data.data, pagination: data.pagination } as PaginatedProductResponse;
  },
  getById: async (id: string) => {
    const { data } = await api.get<{ data: Product }>(`/products/${id}`);
    return data.data;
  },
  create: async (product: CreateProductDto) => {
    const { data } = await api.post<{ data: Product }>('/products', product);
    return data.data;
  },
  update: async (id: string, product: UpdateProductDto) => {
    const { data } = await api.put<{ data: Product }>(`/products/${id}`, product);
    return data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
  exportExcel: async (params?: ProductQueryParams) => {
    const response = await api.get('/products/export/excel', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
  importExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/products/import/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
};
