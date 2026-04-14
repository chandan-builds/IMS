import { api } from '../../../lib/api';
import type { Supplier, SupplierInput } from '../types';

export const getSuppliers = async (params?: any) => {
  const { data } = await api.get('/suppliers', { params });
  return data;
};

export const getSupplier = async (id: string) => {
  const { data } = await api.get(`/suppliers/${id}`);
  return data.data as Supplier;
};

export const createSupplier = async (supplier: SupplierInput) => {
  const { data } = await api.post('/suppliers', supplier);
  return data.data as Supplier;
};

export const updateSupplier = async ({ id, data }: { id: string; data: Partial<SupplierInput> }) => {
  const response = await api.put(`/suppliers/${id}`, data);
  return response.data.data as Supplier;
};