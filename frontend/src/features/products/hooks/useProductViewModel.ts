import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/productApi';
import type { UpdateProductDto, ProductQueryParams } from '../types/product.types';

export function useProductViewModel(filters: ProductQueryParams) {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const exportExcelMutation = useMutation({
    mutationFn: productApi.exportExcel,
    onSuccess: (data) => {
      // create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_export_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });

  const importExcelMutation = useMutation({
    mutationFn: productApi.importExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: productsQuery.data?.data || [],
    pagination: productsQuery.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0 },
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    exportExcel: exportExcelMutation.mutateAsync,
    importExcel: importExcelMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isExporting: exportExcelMutation.isPending,
    isImporting: importExcelMutation.isPending,
  };
}
