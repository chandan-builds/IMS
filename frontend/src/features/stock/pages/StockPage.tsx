import React, { useState } from 'react';
import { useStockList } from '../hooks';
import { Table } from '../../../components/ui/Table';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/ui/Pagination';
import { Loader } from '../../../components/ui/Loader';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import StockBadge from '../../../components/shared/StockBadge';
import StockAdjustmentForm from '../components/StockAdjustmentForm';
import StockLedger from '../components/StockLedger';
import type { Stock } from '../types';

const StockPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [selectedProduct, setSelectedProduct] = useState<{ productId: string, shopId: string } | null>(null);
  const [isAdjustModalOpen, setAdjustModalOpen] = useState(false);
  const [isLedgerModalOpen, setLedgerModalOpen] = useState(false);

  const { data, isLoading, isError } = useStockList({ page, limit });

  if (isLoading) return <div className="p-6"><Loader size="lg" /></div>;
  if (isError) return <div className="text-red-500 p-6">Failed to load stock list</div>;

  const columns = [
    { header: 'Product', accessor: (row: Stock) => row.productId?.name || 'Unknown' },
    { header: 'SKU', accessor: (row: Stock) => row.productId?.sku || 'N/A' },
    { header: 'Shop', accessor: (row: Stock) => row.shopId?.name || 'Main' },
    { header: 'Base Qty', accessor: (row: Stock) => `${row.baseQuantity} (base)` },
    { header: 'Status', accessor: (row: Stock) => <StockBadge quantity={row.baseQuantity} /> },
    { header: 'Actions', accessor: (row: Stock) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => {
            setSelectedProduct({ productId: row.productId?._id, shopId: row.shopId?._id });
            setAdjustModalOpen(true);
          }}>
            Adjust
          </Button>
          <Button size="sm" variant="secondary" onClick={() => {
            setSelectedProduct({ productId: row.productId?._id, shopId: row.shopId?._id });
            setLedgerModalOpen(true);
          }}>
            Ledger
          </Button>
        </div>
      ) 
    }
  ];

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-text">Stock Management</h1>
      </div>

      <Card>
        <Table columns={columns} data={data?.items || []} />
        <div className="mt-4 flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      <Modal isOpen={isAdjustModalOpen} onClose={() => setAdjustModalOpen(false)} title="Adjust Stock" size="md">
        {selectedProduct && (
          <StockAdjustmentForm 
            productId={selectedProduct.productId} 
            shopId={selectedProduct.shopId} 
            onSuccess={() => setAdjustModalOpen(false)}
            onCancel={() => setAdjustModalOpen(false)}
          />
        )}
      </Modal>

      <Modal isOpen={isLedgerModalOpen} onClose={() => setLedgerModalOpen(false)} title="Stock Ledger" size="lg">
        {selectedProduct && (
          <StockLedger productId={selectedProduct.productId} shopId={selectedProduct.shopId} />
        )}
      </Modal>
    </div>
  );
};

export default StockPage;
