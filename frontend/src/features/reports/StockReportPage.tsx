import React from 'react';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useStockReport } from './hooks';
import { exportToExcel } from '../../utils/exportToExcel';
import { Package, Download, AlertTriangle } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  ok: 'bg-green-100 text-green-800',
  low_stock: 'bg-amber-100 text-amber-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  ok: 'OK',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

export const StockReportPage: React.FC = () => {
  const { data, isLoading } = useStockReport();

  const handleExport = () => {
    if (!data) return;
    const rows = data.map((item: any) => ({
      'Product': item.productName,
      'SKU': item.sku,
      'Base Quantity': item.baseQuantity,
      'Display Unit': item.displayUnit || 'base units',
      'Min Stock': item.minStock,
      'Status': STATUS_LABELS[item.status] ?? item.status,
    }));
    exportToExcel(rows, 'Stock_Report');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Stock Report</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Current inventory levels across all products</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>

      {/* Summary cards */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Products',
              value: data.length,
              icon: Package,
              bg: 'bg-blue-50',
              color: 'text-blue-600',
            },
            {
              label: 'Low Stock',
              value: data.filter((d: any) => d.status === 'low_stock').length,
              icon: AlertTriangle,
              bg: 'bg-amber-50',
              color: 'text-amber-600',
            },
            {
              label: 'Out of Stock',
              value: data.filter((d: any) => d.status === 'out_of_stock').length,
              icon: AlertTriangle,
              bg: 'bg-red-50',
              color: 'text-red-600',
            },
          ].map((s) => (
            <Card key={s.label}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${s.bg}`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">{s.label}</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">{s.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<Package />}
            title="No stock data"
            message="Once you add products and make purchases, stock data will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Product', 'SKU', 'Quantity', 'Unit', 'Min Stock', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-page)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{item.productName}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)] font-semibold">{item.baseQuantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{item.displayUnit || '—'}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{item.minStock}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[item.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
