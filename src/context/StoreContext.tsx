'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreConfig } from '@/types/store';
import { StoreService } from '@/services/store';

interface StoreContextType {
  storeConfig: StoreConfig;
  isLoading: boolean;
  currencySymbol: string;
}

const INITIAL_EMPTY_CONFIG: StoreConfig = {
  storeId: '',
  storeName: '',
  tagline: '',
  subTitle: '',
  logo: { src: '', alt: '', width: 180, height: 50 },
  favicon: '/favicon.ico',
  currency: { code: 'USD', symbol: '$', locale: 'en-US' },
  theme: {
    primaryColor: '#111827',
    accentColor: '#B77A68',
    creamColor: '#FAF6F2',
    blushColor: '#E8B8B5',
    roseGoldColor: '#B77A68',
    fontSerif: 'Playfair Display, serif',
    fontSans: 'Plus Jakarta Sans, sans-serif',
  },
  policies: {
    freeShippingThreshold: 0,
    returnWindowDays: 14,
    supportEmail: '',
    supportPhone: '',
    whatsappNumber: '',
    businessAddress: '',
  },
  announcements: [],
  socialLinks: [],
  brandPromises: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(INITIAL_EMPTY_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await StoreService.getStoreConfig();
        if (res.data) {
          setStoreConfig(res.data);
        }
      } catch (err) {
        console.error('[StoreProvider] Failed to load store config:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        storeConfig,
        isLoading,
        currencySymbol: storeConfig.currency?.symbol || '$',
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
