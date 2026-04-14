import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { useDashboardKPIs, useMonthlySummary } from '../features/reports/hooks';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  BarChart2,
  PlusCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Monthly summary moved to useMonthlySummary hook

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
}> = ({ title, value, icon: Icon, iconBg, iconColor, subtitle }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
    </div>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: kpis, isLoading: isKpisLoading } = useDashboardKPIs();
  const { data: trendData, isLoading: isTrendLoading } = useMonthlySummary();

  const isLoading = isKpisLoading || isTrendLoading;

  const stats = [
    {
      title: 'Total Products',
      value: isLoading ? '—' : (kpis?.totalProducts ?? 0),
      icon: Package,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
      subtitle: 'Active products in catalog',
    },
    {
      title: "Revenue Today",
      value: isLoading ? '—' : `₹${(kpis?.revenueToday ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600',
      subtitle: `${kpis?.salesToday ?? 0} sales transactions`,
    },
    {
      title: 'Low Stock Items',
      value: isLoading ? '—' : (kpis?.lowStockCount ?? 0),
      icon: AlertTriangle,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600',
      subtitle: 'Need restocking soon',
    },
    {
      title: 'Total Sales Today',
      value: isLoading ? '—' : (kpis?.salesToday ?? 0),
      icon: ShoppingCart,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600',
      subtitle: 'Completed transactions',
    },
  ];

  const quickActions = [
    { label: 'New Sale', icon: PlusCircle, path: '/sales', color: 'text-[var(--color-primary)]' },
    { label: 'New Purchase', icon: ShoppingCart, path: '/purchases', color: 'text-green-600' },
    { label: 'View Reports', icon: BarChart2, path: '/reports/sales', color: 'text-purple-600' },
    { label: 'Add Product', icon: Package, path: '/products', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Welcome back — here's what's happening today.
          </p>
        </div>
        {!isLoading && (kpis?.lowStockCount ?? 0) > 0 && (
          <button
            onClick={() => navigate('/reports/stock')}
            className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle size={16} />
            {kpis?.lowStockCount} low stock items
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      )}

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card title="Sales vs. Purchases (Last 6 Months)" className="lg:col-span-2">
          <div className="h-64 mt-2">
            {isTrendLoading ? (
               <div className="h-full flex items-center justify-center"><Loader /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="purchaseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, undefined]}
                  />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="#6366f1" strokeWidth={2} fill="url(#salesGrad)" dot={false} />
                  <Area type="monotone" dataKey="purchases" name="Purchases" stroke="#10b981" strokeWidth={2} fill="url(#purchaseGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span className="text-xs text-[var(--color-text-muted)]">Sales Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs text-[var(--color-text-muted)]">Purchase Cost</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-left transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={action.color} />
                    <span className="font-medium text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-dark)]">
                      {action.label}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-[var(--color-text-muted)] group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <button
              onClick={() => navigate('/reports/sales')}
              className="w-full flex items-center justify-center gap-2 text-sm text-[var(--color-primary)] font-medium hover:underline"
            >
              <FileText size={14} />
              View all reports
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};