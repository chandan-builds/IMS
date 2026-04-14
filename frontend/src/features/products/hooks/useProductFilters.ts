import { useState, useCallback } from 'react';
import type { ProductQueryParams } from '../types/product.types';

export function useProductFilters(initialFilters: ProductQueryParams = { page: 1, limit: 10 }) {
  const [filters, setFilters] = useState<ProductQueryParams>(initialFilters);

  const updateFilter = useCallback(<K extends keyof ProductQueryParams>(key: K, value: ProductQueryParams[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // reset page to 1 when a filter other than page changes
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}
