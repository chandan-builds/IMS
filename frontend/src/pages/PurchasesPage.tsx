import React from 'react';
import { PurchaseList } from '../features/purchases/components/PurchaseList';

export const PurchasesPage: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Purchases</h1>
          <p className="text-[var(--color-text-secondary)]">Manage purchase orders</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm overflow-hidden">
        <PurchaseList />
      </div>
    </div>
  );
};