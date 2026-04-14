import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { usePurchaseReport } from './hooks';
import { exportToExcel } from '../../utils/exportToExcel';
import { ShoppingCart, Download, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const PurchaseReportPage: React.FC = () => {
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const defaultEnd = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const { data, isLoading } = usePurchaseReport({ startDate, endDate });

  const totalCost = data?.reduce((s: number, r: any) => s + (r.grandTotal ?? 0), 0) ?? 0;
  const totalPurchases = data?.length ?? 0;

  // Group by date for chart
  const chartData = React.useMemo(() => {
    if (!data) return [];
    const grouped: Record<string, number> = {};
    data.forEach((p: any) => {
      const d = new Date(p.purchaseDate || p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      grouped[d] = (grouped[d] ?? 0) + (p.grandTotal ?? 0);
    });
    return Object.entries(grouped).map(([date, cost]) => ({ date, cost }));
  }, [data]);

  const handleExport = () => {
    const rows = (data ?? []).map((p: any) => ({
      'PO #': p.purchaseNumber,
      'Date': new Date(p.purchaseDate || p.createdAt).toLocaleDateString(),
      'Supplier': p.supplierId?.name ?? '—',
      'Subtotal': p.subtotal,
      'Tax': p.taxTotal,
      'Grand Total': p.grandTotal,
      'Payment Status': p.paymentStatus,
    }));
    exportToExcel(rows, `Purchase_Report_${startDate}_to_${endDate}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Purchase Report</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Procurement spending and supplier activity</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-bg-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <span className="text-[var(--color-text-muted)] text-sm">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-bg-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Purchases', value: totalPurchases, suffix: 'purchase orders', icon: ShoppingCart, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Total Spend', value: `₹${totalCost.toLocaleString()}`, suffix: 'purchase cost', icon: TrendingDown, bg: 'bg-red-50', color: 'text-red-500' },
          { label: 'Avg. PO Value', value: totalPurchases > 0 ? `₹${(totalCost / totalPurchases).toFixed(0)}` : '₹0', suffix: 'per order', icon: ShoppingCart, bg: 'bg-indigo-50', color: 'text-indigo-600' },
        ].map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg}`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">{s.label}</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{s.suffix}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {!isLoading && chartData.length > 0 && (
        <Card title="Daily Purchase Spend">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Spend']}
                />
                <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : !data || data.length === 0 ? (
          <EmptyState icon={<ShoppingCart />} title="No purchases found" message="No purchase records match the selected date range." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['PO #', 'Date', 'Supplier', 'Grand Total', 'Payment'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((purchase: any) => (
                  <tr key={purchase._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-page)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-primary)]">{purchase.purchaseNumber}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">
                      {new Date(purchase.purchaseDate || purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)]">{purchase.supplierId?.name ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">₹{(purchase.grandTotal ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        purchase.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        purchase.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {purchase.paymentStatus}
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
