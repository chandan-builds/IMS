import React from 'react';
import { Search, Bell, Menu, UserCircle, LogOut, Store } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrg } from '../../contexts/OrgContext';

interface TopbarProps {
  toggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { organization, currentShop, setCurrentShop } = useOrg();

  return (
    <header className="h-16 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] flex items-center justify-between px-4 lg:px-6 z-10 shrink-0">
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex items-center mr-4">
          <div className="relative group inline-block">
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--color-bg-page)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors">
              <Store size={18} className="text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                {currentShop?.name || 'Select Shop'}
              </span>
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-[var(--color-bg-card)] rounded-md shadow-lg py-1 border border-[var(--color-border)] hidden group-hover:block transition-all opacity-0 group-hover:opacity-100 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Available Shops
              </div>
              {organization?.shops.map(shop => (
                <button 
                  key={shop._id}
                  onClick={() => setCurrentShop(shop)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                    currentShop?._id === shop._id 
                      ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium' 
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  <Store size={14} className="mr-2 opacity-70" />
                  {shop.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-md hidden lg:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-[var(--color-text-muted)]" />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="block w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg leading-5 bg-[var(--color-bg-page)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button className="p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] rounded-full border border-[var(--color-bg-card)]"></span>
        </button>
        
        <div className="h-6 w-px bg-[var(--color-border)] hidden sm:block"></div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">{user?.name}</div>
            <div className="text-xs text-[var(--color-text-muted)] capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</div>
          </div>
          
          <div className="relative group inline-block">
            <button className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <UserCircle size={24} />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-card)] rounded-md shadow-lg py-1 border border-[var(--color-border)] hidden group-hover:block transition-all opacity-0 group-hover:opacity-100 z-50">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] flex items-center transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};