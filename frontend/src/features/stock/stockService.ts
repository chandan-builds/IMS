import axios from 'axios';
import type { Stock, StockTransaction, StockAdjustmentPayload, StockTransferPayload } from './types';

const API_URL = '/api/v1/stock';

export const stockService = {
  getCurrentStock: async (params?: Record<string, any>) => {
    const response = await axios.get<{ items: Stock[], count: number, page: number }>(API_URL, { params });
    return response.data;
  },

  getStockTransactions: async (params?: Record<string, any>) => {
    const response = await axios.get<{ items: StockTransaction[], count: number, page: number }>(`${API_URL}/transactions`, { params });
    return response.data;
  },

  getProductStockDetail: async (productId: string) => {
    const response = await axios.get<{ items: Stock[], count: number, page: number }>(`${API_URL}/${productId}`);
    return response.data;
  },

  adjustStock: async (payload: StockAdjustmentPayload) => {
    const response = await axios.post<{ message: string, data: any }>(`${API_URL}/adjust`, payload);
    return response.data;
  },

  transferStock: async (payload: StockTransferPayload) => {
    const response = await axios.post<{ message: string, data: any }>(`${API_URL}/transfer`, payload);
    return response.data;
  }
};
