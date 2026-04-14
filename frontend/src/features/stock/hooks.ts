import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from './stockService';
import type { StockAdjustmentPayload, StockTransferPayload } from './types';

export const useStockList = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['stock', params],
    queryFn: () => stockService.getCurrentStock(params),
  });
};

export const useStockLedger = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['stockLedger', params],
    queryFn: () => stockService.getStockTransactions(params),
  });
};

export const useStockAdjustment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockAdjustmentPayload) => stockService.adjustStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['stockLedger'] });
    },
  });
};

export const useStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockTransferPayload) => stockService.transferStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['stockLedger'] });
    },
  });
};
