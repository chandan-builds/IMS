import os

# Create directories
dirs = [
    'frontend/src/features/suppliers/api',
    'frontend/src/features/suppliers/components',
    'frontend/src/features/suppliers/types',
    'frontend/src/features/customers/api',
    'frontend/src/features/customers/components',
    'frontend/src/features/customers/types',
    'frontend/src/features/purchases/api',
    'frontend/src/features/purchases/components',
    'frontend/src/features/purchases/types',
    'frontend/src/features/sales/api',
    'frontend/src/features/sales/components',
    'frontend/src/features/sales/types'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

files = {}

# ================= SUPPLIERS =================
files['frontend/src/features/suppliers/types/index.ts'] = """
export interface Supplier {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  gstNumber?: string;
  paymentTerms?: string;
  totalDue: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface SupplierInput extends Omit<Supplier, '_id' | 'totalDue' | 'createdAt'> {}
"""

files['frontend/src/features/suppliers/api/index.ts'] = """
import { api } from '../../../lib/api';
import { Supplier, SupplierInput } from '../types';

export const getSuppliers = async (params?: any) => {
  const { data } = await api.get('/suppliers', { params });
  return data;
};

export const getSupplier = async (id: string) => {
  const { data } = await api.get(`/suppliers/${id}`);
  return data.data as Supplier;
};

export const createSupplier = async (supplier: SupplierInput) => {
  const { data } = await api.post('/suppliers', supplier);
  return data.data as Supplier;
};

export const updateSupplier = async ({ id, data }: { id: string; data: Partial<SupplierInput> }) => {
  const response = await api.put(`/suppliers/${id}`, data);
  return response.data.data as Supplier;
};
"""

files['frontend/src/features/suppliers/components/SupplierList.tsx'] = """
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSuppliers } from '../api';
import { Plus, Search, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const SupplierList = () => {
  const [search, setSearch] = useState('');
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['suppliers', search],
    queryFn: () => getSuppliers({ search })
  });

  if (isLoading) return <div>Loading suppliers...</div>;

  const suppliers = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
        <Button onClick={() => alert('New Supplier modal')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((supplier: any) => (
                <tr key={supplier._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    {supplier.gstNumber && <div className="text-sm text-gray-500">GST: {supplier.gstNumber}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{supplier.phone}</div>
                    <div className="text-sm text-gray-500">{supplier.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{supplier.totalDue || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" onClick={() => alert('Edit ' + supplier._id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
"""

# ================= CUSTOMERS =================
files['frontend/src/features/customers/types/index.ts'] = """
export interface Customer {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  gstNumber?: string;
  type: 'B2B' | 'B2C';
  creditLimit: number;
  totalDue: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CustomerInput extends Omit<Customer, '_id' | 'totalDue' | 'createdAt'> {}
"""

files['frontend/src/features/customers/api/index.ts'] = """
import { api } from '../../../lib/api';
import { Customer, CustomerInput } from '../types';

export const getCustomers = async (params?: any) => {
  const { data } = await api.get('/customers', { params });
  return data;
};

export const getCustomer = async (id: string) => {
  const { data } = await api.get(`/customers/${id}`);
  return data.data as Customer;
};

export const createCustomer = async (customer: CustomerInput) => {
  const { data } = await api.post('/customers', customer);
  return data.data as Customer;
};

export const updateCustomer = async ({ id, data }: { id: string; data: Partial<CustomerInput> }) => {
  const response = await api.put(`/customers/${id}`, data);
  return response.data.data as Customer;
};
"""

files['frontend/src/features/customers/components/CustomerList.tsx'] = """
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../api';
import { Plus, Search, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const CustomerList = () => {
  const [search, setSearch] = useState('');
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: () => getCustomers({ search })
  });

  if (isLoading) return <div>Loading customers...</div>;

  const customers = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <Button onClick={() => alert('New Customer modal')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer: any) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phone}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {customer.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{customer.totalDue || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" onClick={() => alert('Edit ' + customer._id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
"""

# ================= PURCHASES =================
files['frontend/src/features/purchases/components/PurchaseList.tsx'] = """
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Plus, Search, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const PurchaseList = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data } = await api.get('/purchases');
      return data;
    }
  });

  if (isLoading) return <div>Loading purchases...</div>;

  const purchases = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Purchases</h1>
        <Button onClick={() => alert('New Purchase Order')}>
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.map((purchase: any) => (
                <tr key={purchase._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {purchase.purchaseNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{purchase.grandTotal || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
"""

# ================= SALES =================
files['frontend/src/features/sales/components/SaleList.tsx'] = """
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Plus, Search, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const SaleList = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data } = await api.get('/sales');
      return data;
    }
  });

  if (isLoading) return <div>Loading sales...</div>;

  const sales = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
        <Button onClick={() => alert('New Sale Invoice')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale: any) => (
                <tr key={sale._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {sale.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sale.saleType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{sale.grandTotal || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
"""

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
        
print('Frontend scaffolding complete')
