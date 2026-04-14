import React from 'react';
import { SaleList } from '../features/sales/components/SaleList';

export const SalesPage: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Sales</h1>
          <p className="text-[var(--color-text-secondary)]">Manage sales invoices</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm overflow-hidden">
        <SaleList />
      </div>
    </div>
  );
};