import { api } from '../../../lib/api';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export const categoryApi = {
  getAll: async () => {
    const { data } = await api.get<{ data: Category[] }>('/categories');
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<{ data: Category }>(`/categories/${id}`);
    return data.data;
  },
  create: async (category: CreateCategoryDto) => {
    const { data } = await api.post<{ data: Category }>('/categories', category);
    return data.data;
  },
  update: async (id: string, category: UpdateCategoryDto) => {
    const { data } = await api.put<{ data: Category }>(`/categories/${id}`, category);
    return data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/categories/${id}`);
  }
};
