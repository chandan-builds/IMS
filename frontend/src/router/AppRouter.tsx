import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UnitsPage } from '../pages/UnitsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { ProductsPage } from '../pages/ProductsPage';
import StockPage from '../features/stock/pages/StockPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { CustomersPage } from '../pages/CustomersPage';
import { PurchasesPage } from '../pages/PurchasesPage';
import { SalesPage } from '../pages/SalesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SuperAdminPage } from '../pages/SuperAdminPage';
import { StockReportPage } from '../features/reports/StockReportPage';
import { SalesReportPage } from '../features/reports/SalesReportPage';
import { PurchaseReportPage } from '../features/reports/PurchaseReportPage';
import { ProfitReportPage } from '../features/reports/ProfitReportPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';

export const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
      />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/super-admin" element={<SuperAdminPage />} />
          {/* Reports */}
          <Route path="/reports/stock" element={<StockReportPage />} />
          <Route path="/reports/sales" element={<SalesReportPage />} />
          <Route path="/reports/purchases" element={<PurchaseReportPage />} />
          <Route path="/reports/profit" element={<ProfitReportPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
