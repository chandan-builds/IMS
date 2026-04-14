import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitApi } from '../services/unitApi';
import type { UpdateUnitDto } from '../types/unit.types';

export function useUnitViewModel() {
  const queryClient = useQueryClient();

  const unitsQuery = useQuery({
    queryKey: ['units'],
    queryFn: unitApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: unitApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUnitDto }) => unitApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: unitApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });

  return {
    units: unitsQuery.data || [],
    isLoading: unitsQuery.isLoading,
    error: unitsQuery.error,
    createUnit: createMutation.mutateAsync,
    updateUnit: updateMutation.mutateAsync,
    deleteUnit: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
