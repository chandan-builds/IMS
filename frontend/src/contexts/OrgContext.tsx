import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface Shop {
  _id: string;
  name: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  isDefault: boolean;
}

export interface Organization {
  _id: string;
  name: string;
  businessType: string;
  currency: {
    code: string;
    symbol: string;
  };
  shops: Shop[];
}

interface OrgContextType {
  organization: Organization | null;
  currentShop: Shop | null;
  setCurrentShop: (shop: Shop) => void;
  isLoading: boolean;
  refreshOrg: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentShop, setCurrentShopState] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setCurrentShop = (shop: Shop) => {
    setCurrentShopState(shop);
    localStorage.setItem('shopId', shop._id);
    // Update axios default header
    api.defaults.headers.common['x-shop-id'] = shop._id;
  };

  const refreshOrg = async () => {
    try {
      // Check if user is authenticated before fetching org
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await api.get('/org');
      const orgData = response.data.data;
      setOrganization(orgData);

      if (orgData && orgData.shops && orgData.shops.length > 0) {
        const savedShopId = localStorage.getItem('shopId');
        const foundShop = savedShopId ? orgData.shops.find((s: Shop) => s._id === savedShopId) : null;
        const defaultShop = orgData.shops.find((s: Shop) => s.isDefault) || orgData.shops[0];
        
        const activeShop = foundShop || defaultShop;
        setCurrentShopState(activeShop);
        api.defaults.headers.common['x-shop-id'] = activeShop._id;
        localStorage.setItem('shopId', activeShop._id);
      }
    } catch (error) {
      console.error('Failed to load organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshOrg();
  }, []);

  useEffect(() => {
    if (organization && (organization as any).settings?.themeColor) {
      document.documentElement.style.setProperty('--color-primary', (organization as any).settings.themeColor);
    } else {
      document.documentElement.style.setProperty('--color-primary', '#4F46E5');
    }
  }, [organization]);

  return (
    <OrgContext.Provider value={{ organization, currentShop, setCurrentShop, isLoading, refreshOrg }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
};
