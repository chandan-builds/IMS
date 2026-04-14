import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useProfitReport } from './hooks';
import { exportToExcel } from '../../utils/exportToExcel';
import { DollarSign, Download, TrendingUp, PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const ProfitReportPage: React.FC = () => {
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const defaultEnd = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const { data, isLoading } = useProfitReport({ startDate, endDate });

  const summary = React.useMemo(() => {
    if (!data || data.length === 0) return { revenue: 0, cogs: 0, profit: 0, margin: 0 };
    const rev = data.reduce((s: number, r: any) => s + r.totalRevenue, 0);
    const cogs = data.reduce((s: number, r: any) => s + r.totalCogs, 0);
    const profit = rev - cogs;
    const margin = rev > 0 ? (profit / rev) * 100 : 0;
    return { revenue: rev, cogs, profit, margin };
  }, [data]);

  const handleExport = () => {
    const rows = (data ?? []).map((p: any) => ({
      'Product': p.productName,
      'Qty Sold': `${p.quantity} ${p.unit}`,
      'Revenue (Pre-tax)': p.totalRevenue,
      'COGS': p.totalCogs,
      'Gross Profit': p.grossProfit,
      'Margin %': p.margin.toFixed(2)
    }));
    exportToExcel(rows, `Profit_Report_${startDate}_to_${endDate}`);
  };

  const chartData = (data || [])
    .slice(0, 10)
    .map((p: any) => ({ name: p.productName, profit: p.grossProfit }));

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Gross Profit Report</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Analyze your sales margins and profitability</p>
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
          { label: 'Gross Profit', value: `₹${summary.profit.toLocaleString()}`, suffix: 'Net earnings from sales', icon: TrendingUp, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Net Revenue', value: `₹${summary.revenue.toLocaleString()}`, suffix: 'Revenue excluding tax', icon: DollarSign, bg: 'bg-indigo-50', color: 'text-indigo-600' },
          { label: 'Avg. Margin', value: `${summary.margin.toFixed(1)}%`, suffix: 'Profitability ratio', icon: PieChart, bg: 'bg-purple-50', color: 'text-purple-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card title="Top Products by Gross Profit" className="lg:col-span-2">
          {!isLoading && chartData.length > 0 ? (
            <div className="h-72 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} 
                    axisLine={false} 
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Profit']}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="profit" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : (
             <div className="py-20 flex flex-col items-center opacity-50"><PieChart size={40} className="mb-2" /><p className="text-sm">No data available for chart</p></div>
          )}
        </Card>

        {/* Breakdown Summary */}
        <Card title="Profitability Mix">
           <div className="space-y-4 mt-2">
              <div className="p-4 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Cost of Goods Sold (COGS)</p>
                <p className="text-xl font-bold text-red-500 mt-1">₹{summary.cogs.toLocaleString()}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                  <div 
                    className="bg-red-400 h-1.5 rounded-full" 
                    style={{ width: `${summary.revenue > 0 ? (summary.cogs / summary.revenue) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-2 italic">Representing {(summary.revenue > 0 ? (summary.cogs / summary.revenue) * 100 : 0).toFixed(1)}% of net revenue</p>
              </div>
              
              <div className="p-4 rounded-lg bg-[var(--color-bg-page)] border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Total Revenue</p>
                <p className="text-xl font-bold text-indigo-500 mt-1">₹{summary.revenue.toLocaleString()}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">Breakdown of taxable vs non-taxable sales is available in Sales Report.</p>
              </div>
           </div>
        </Card>
      </div>

      {/* Table */}
      <Card title="Product-wise Profit Breakdown">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : !data || data.length === 0 ? (
          <EmptyState icon={<TrendingUp />} title="No data found" message="Try adjusting your date filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Product', 'Qty Sold', 'Revenue', 'COGS', 'Gross Profit', 'Margin'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((p: any) => (
                  <tr key={p._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-page)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{p.productName}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{p.quantity} {p.unit}</td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)]">₹{p.totalRevenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-500">₹{p.totalCogs.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{p.grossProfit.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.margin > 30 ? 'bg-green-100 text-green-800' :
                        p.margin > 15 ? 'bg-blue-100 text-blue-800' :
                        p.margin > 0 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {p.margin.toFixed(1)}%
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
