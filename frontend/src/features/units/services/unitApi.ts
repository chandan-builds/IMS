import { api } from '../../../lib/api';
import type { Unit, CreateUnitDto, UpdateUnitDto } from '../types/unit.types';

export const unitApi = {
  getAll: async () => {
    const { data } = await api.get<{ data: Unit[] }>('/units');
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<{ data: Unit }>(`/units/${id}`);
    return data.data;
  },
  create: async (unit: CreateUnitDto) => {
    const { data } = await api.post<{ data: Unit }>('/units', unit);
    return data.data;
  },
  update: async (id: string, unit: UpdateUnitDto) => {
    const { data } = await api.put<{ data: Unit }>(`/units/${id}`, unit);
    return data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/units/${id}`);
  }
};
