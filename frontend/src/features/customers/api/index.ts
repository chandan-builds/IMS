import { api } from '../../../lib/api';
import type { Customer, CustomerInput } from '../types';

export const getCustomers = async (params?: any) => {
  const { data } = await api.get('/customers', { params });
  return data;
};

export const getCustomer = async (id: string) => {
  const { data } = await api.get(`/customers/${id}`);
  return data.data as Customer;
};

export const createCustomer = async (customer: CustomerInput) => {
  const { data } = await api.post('/customers', customer);
  return data.data as Customer;
};

export const updateCustomer = async ({ id, data }: { id: string; data: Partial<CustomerInput> }) => {
  const response = await api.put(`/customers/${id}`, data);
  return response.data.data as Customer;
};