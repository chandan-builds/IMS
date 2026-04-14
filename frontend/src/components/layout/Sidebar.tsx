import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package,
  Box,
  Users, 
  Settings,
  ChevronLeft,
  Menu,
  Scale,
  Tags,
  Users2,
  Building2,
  ShoppingCart,
  Receipt,
  BarChart2,
  PackageSearch,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

interface NavSection {
  section?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
    ]
  },
  {
    section: 'Operations',
    items: [
      { name: 'Products', path: '/products', icon: Box, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
      { name: 'Stock', path: '/stock', icon: Package, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
      { name: 'Purchases', path: '/purchases', icon: ShoppingCart, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
      { name: 'Sales', path: '/sales', icon: Receipt, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
    ]
  },
  {
    section: 'Reports',
    items: [
      { name: 'Stock Report', path: '/reports/stock', icon: PackageSearch, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
      { name: 'Sales Report', path: '/reports/sales', icon: TrendingUp, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
      { name: 'Purchase Report', path: '/reports/purchases', icon: BarChart2, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
      { name: 'Profit Report', path: '/reports/profit', icon: Receipt, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'STAFF'] },
    ]
  },
  {
    section: 'Management',
    items: [
      { name: 'Units', path: '/units', icon: Scale, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
      { name: 'Categories', path: '/categories', icon: Tags, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
      { name: 'Suppliers', path: '/suppliers', icon: Building2, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
      { name: 'Customers', path: '/customers', icon: Users2, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
      { name: 'Users', path: '/users', icon: Users, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
      { name: 'Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
      { name: 'Super Admin', path: '/super-admin', icon: LayoutDashboard, roles: ['SUPER_ADMIN'] },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const userRole = (user?.role || '').toUpperCase();

  return (
    <aside 
      className={cn(
        "flex flex-col bg-[var(--color-bg-sidebar)] text-slate-300 transition-all duration-300 z-20 shrink-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50 shrink-0">
        {isOpen && (
          <span className="font-bold text-xl truncate text-white">
            IMS
          </span>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0",
            !isOpen && "mx-auto"
          )}
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_SECTIONS.map((section, si) => {
          const filteredItems = section.items.filter(item => item.roles.includes(userRole));
          if (filteredItems.length === 0) return null;
          return (
            <div key={si} className="mb-2">
              {isOpen && section.section && (
                <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {section.section}
                </p>
              )}
              <ul className="space-y-0.5 px-2">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => cn(
                          "flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                          isActive 
                            ? "bg-[var(--color-primary)] text-white" 
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                        title={!isOpen ? item.name : undefined}
                      >
                        <Icon size={18} className={cn("min-w-[18px] shrink-0", isOpen && "mr-3")} />
                        {isOpen && <span className="truncate text-sm font-medium">{item.name}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      
      {isOpen && (
        <div className="p-4 border-t border-slate-700/50 shrink-0">
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Logged in as
            </p>
            <p className="text-sm font-medium text-white truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize mt-0.5">
              {user?.role?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};