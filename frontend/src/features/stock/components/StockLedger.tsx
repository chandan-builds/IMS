import React, { useState } from 'react';
import { useStockLedger } from '../hooks';
import { Table } from '../../../components/ui/Table';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/ui/Pagination';
import { Loader } from '../../../components/ui/Loader';
import { Badge } from '../../../components/ui/Badge';
import type { StockTransaction } from '../types';

interface StockLedgerProps {
  productId?: string;
  shopId?: string;
}

const StockLedger: React.FC<StockLedgerProps> = ({ productId, shopId }) => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, isError } = useStockLedger({ productId, shopId, page, limit });

  if (isLoading) return <Loader size="lg" />;
  if (isError) return <div className="text-red-500">Failed to load ledger</div>;

  const columns = [
    { header: 'Date', accessor: (row: StockTransaction) => new Date(row.createdAt).toLocaleString() },
    { header: 'Type', accessor: (row: StockTransaction) => (
        <Badge 
          variant={
            ['purchase', 'return', 'transfer_in'].includes(row.type) ? 'info' :
            ['sale', 'damage', 'transfer_out'].includes(row.type) ? 'warning' : 'default'
          }
        >
          {row.type.toUpperCase().replace('_', ' ')}
        </Badge>
      )
    },
    { header: 'Item', accessor: (row: StockTransaction) => row.productId?.name || 'Unknown' },
    { header: 'Qty', accessor: (row: StockTransaction) => `${row.quantity} ${row.unit}` },
    { header: 'Balance (Base)', accessor: (row: StockTransaction) => row.balanceAfter },
    { header: 'By', accessor: (row: StockTransaction) => row.createdBy?.name || 'System' }
  ];

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  return (
    <Card title="Stock Ledger">
      <Table columns={columns} data={data?.items || []} />
      <div className="mt-4 flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </Card>
  );
};

export default StockLedger;
