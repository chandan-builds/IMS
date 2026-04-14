import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import type { Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export const SuperAdminPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orgs, isLoading } = useQuery({
    queryKey: ['admin_orgs'],
    queryFn: async () => {
      const res = await api.get('/admin/organizations');
      return res.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.put(`/admin/organizations/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin_orgs'] });
    },
    onError: () => toast.error('Failed to update status')
  });

  const columns: Column<any>[] = [
    { header: 'Organization', accessor: 'name' },
    { header: 'Type', accessor: 'businessType' },
    { header: 'Created', accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { 
      header: 'Plan', 
      accessor: (row: any) => (
        <Badge variant={row.subscription?.plan === 'pro' || row.subscription?.plan === 'enterprise' ? 'success' : 'info'} className="uppercase">
          {row.subscription?.plan || 'free'}
        </Badge>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <Select 
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
            { label: 'Trial', value: 'trial' }
          ]}
          value={row.status}
          onChange={(newStatus) => updateStatusMutation.mutate({ id: row._id, status: newStatus as string })}
          className="w-32"
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Super Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage all organizations across the platform.</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader /></div>
        ) : (
          <Table 
            columns={columns} 
            data={orgs || []} 
          />
        )}
      </Card>
    </div>
  );
};