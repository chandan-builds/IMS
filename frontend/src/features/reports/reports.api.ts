import { api } from '../../lib/api';

export const reportApi = {
  getDashboardKPIs: async (shopId?: string) => {
    const params = shopId ? { shopId } : {};
    const response = await api.get('/reports/dashboard', { params });
    return response.data;
  },
  getStockReport: async (shopId?: string) => {
    const params = shopId ? { shopId } : {};
    const response = await api.get('/reports/stock', { params });
    return response.data;
  },
  getSalesReport: async (params?: { shopId?: string; startDate?: string; endDate?: string; productId?: string; categoryId?: string }) => {
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },
  getMonthlySummary: async (shopId?: string) => {
    const params = shopId ? { shopId } : {};
    const response = await api.get('/reports/monthly-summary', { params });
    return response.data;
  },
  getProfitReport: async (params?: { shopId?: string; startDate?: string; endDate?: string }) => {
    const response = await api.get('/reports/profit', { params });
    return response.data;
  },
  getPurchaseReport: async (params?: { shopId?: string; startDate?: string; endDate?: string }) => {
    const response = await api.get('/reports/purchases', { params });
    return response.data;
  }
};
