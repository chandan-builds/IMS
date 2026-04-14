import React from 'react';
import { useProductViewModel } from '../hooks/useProductViewModel';
import { useProductFilters } from '../hooks/useProductFilters';
import { Table } from '../../../components/ui/Table';
import type { Column } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import type { Product } from '../types/product.types';
import { Plus, Download, Upload } from 'lucide-react';

interface ProductListProps {
  onCreateClick: () => void;
  onEditClick: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onCreateClick, onEditClick }) => {
  const { filters, updateFilter } = useProductFilters();
  const { products, pagination, isLoading, exportExcel, isExporting } = useProductViewModel(filters);

  const columns: Column<Product>[] = [
    {
      header: 'Name',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-200">{row.name}</p>
          <p className="text-xs text-slate-500">{row.sku}</p>
        </div>
      ),
      id: 'name',
    },
    {
      header: 'Category',
      // Depending on if populate returns object or just ID
      accessor: (row) => typeof row.categoryId === 'object' ? (row.categoryId as any).name : row.categoryId,
    },
    {
      header: 'Price',
      accessor: (row) => `$${row.salePrice.toFixed(2)}`,
    },
    {
      header: 'Stock',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.minStock} {row.baseUnitSymbol}</span>
          {row.minStock <= (row.reorderLevel || 0) && (
            <Badge variant="warning">Low</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'default' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => onEditClick(row)}>
            Edit
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar 
          value={filters.search || ''} 
          onChange={(val) => updateFilter('search', val)} 
          placeholder="Search products..."
          className="w-full sm:w-72"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => exportExcel(undefined)} loading={isExporting}>
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button variant="outline">
            <Upload size={16} className="mr-2" /> Import
          </Button>
          <Button variant="default" onClick={onCreateClick}>
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader /></div>
      ) : (
        <Table<Product>
          columns={columns}
          data={products}
          onRowClick={onEditClick}
        />
      )}

      {!isLoading && pagination.pages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => updateFilter('page', page)}
          />
        </div>
      )}
    </div>
  );
};
