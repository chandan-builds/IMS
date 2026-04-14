import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useSalesReport } from './hooks';
import { exportToExcel } from '../../utils/exportToExcel';
import { Receipt, Download, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const SalesReportPage: React.FC = () => {
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const defaultEnd = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const { data, isLoading } = useSalesReport({ startDate, endDate });

  const totalRevenue = data?.reduce((s: number, r: any) => s + (r.grandTotal ?? 0), 0) ?? 0;
  const totalSales = data?.length ?? 0;

  // Group by date for chart
  const chartData = React.useMemo(() => {
    if (!data) return [];
    const grouped: Record<string, number> = {};
    data.forEach((sale: any) => {
      const d = new Date(sale.saleDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      grouped[d] = (grouped[d] ?? 0) + (sale.grandTotal ?? 0);
    });
    return Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }));
  }, [data]);

  const handleExport = () => {
    const rows = (data ?? []).map((s: any) => ({
      'Invoice #': s.invoiceNumber,
      'Date': new Date(s.saleDate).toLocaleDateString(),
      'Customer': s.customerId?.name ?? 'Walk-in',
      'Type': s.saleType,
      'Subtotal': s.subtotal,
      'Tax': s.taxTotal,
      'Grand Total': s.grandTotal,
      'Payment Status': s.paymentStatus,
    }));
    exportToExcel(rows, `Sales_Report_${startDate}_to_${endDate}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Sales Report</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Revenue and sales performance overview</p>
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Sales', value: totalSales, suffix: 'transactions', icon: Receipt, bg: 'bg-indigo-50', color: 'text-indigo-600' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, suffix: 'gross revenue', icon: TrendingUp, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Avg. Order Value', value: totalSales > 0 ? `₹${(totalRevenue / totalSales).toFixed(0)}` : '₹0', suffix: 'per transaction', icon: TrendingUp, bg: 'bg-purple-50', color: 'text-purple-600' },
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
        <Card title="Daily Revenue">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
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
          <EmptyState icon={<Receipt />} title="No sales found" message="No sales records match the selected date range." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Invoice #', 'Date', 'Customer', 'Type', 'Grand Total', 'Payment'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((sale: any) => (
                  <tr key={sale._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-page)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-primary)]">{sale.invoiceNumber}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)]">{sale.customerId?.name ?? 'Walk-in'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sale.saleType === 'B2B' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                        {sale.saleType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">₹{(sale.grandTotal ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        sale.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.paymentStatus}
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
