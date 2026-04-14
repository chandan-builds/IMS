import { useQuery } from '@tanstack/react-query';
import { reportApi } from './reports.api';

export const useDashboardKPIs = (shopId?: string) =>
  useQuery({
    queryKey: ['reports', 'dashboard', shopId],
    queryFn: () => reportApi.getDashboardKPIs(shopId),
    staleTime: 30_000,
  });

export const useStockReport = (shopId?: string) =>
  useQuery({
    queryKey: ['reports', 'stock', shopId],
    queryFn: () => reportApi.getStockReport(shopId),
  });

export const useSalesReport = (params?: { shopId?: string; startDate?: string; endDate?: string; productId?: string; categoryId?: string }) =>
  useQuery({
    queryKey: ['reports', 'sales', params],
    queryFn: () => reportApi.getSalesReport(params),
  });

export const useMonthlySummary = (shopId?: string) =>
  useQuery({
    queryKey: ['reports', 'monthly-summary', shopId],
    queryFn: () => reportApi.getMonthlySummary(shopId),
    staleTime: 60_000,
  });

export const useProfitReport = (params?: { shopId?: string; startDate?: string; endDate?: string }) =>
  useQuery({
    queryKey: ['reports', 'profit', params],
    queryFn: () => reportApi.getProfitReport(params),
  });

export const usePurchaseReport = (params?: { shopId?: string; startDate?: string; endDate?: string }) =>
  useQuery({
    queryKey: ['reports', 'purchases', params],
    queryFn: () => reportApi.getPurchaseReport(params),
  });
