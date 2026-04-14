import os

pages = {
    'frontend/src/pages/SuppliersPage.tsx': """
import React from 'react';
import { SupplierList } from '../features/suppliers/components/SupplierList';

export const SuppliersPage: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Suppliers</h1>
          <p className="text-[var(--color-text-secondary)]">Manage your suppliers</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm overflow-hidden">
        <SupplierList />
      </div>
    </div>
  );
};
""",
    'frontend/src/pages/CustomersPage.tsx': """
import React from 'react';
import { CustomerList } from '../features/customers/components/CustomerList';

export const CustomersPage: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Customers</h1>
          <p className="text-[var(--color-text-secondary)]">Manage your customers</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm overflow-hidden">
        <CustomerList />
      </div>
    </div>
  );
};
""",
    'frontend/src/pages/PurchasesPage.tsx': """
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
""",
    'frontend/src/pages/SalesPage.tsx': """
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
"""
}

for path, content in pages.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
        
print('Pages created')
