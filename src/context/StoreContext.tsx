'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreConfig } from '@/types/store';
import { defaultStoreConfig } from '@/data/storeConfig';
import { StoreService } from '@/services/store';

interface StoreContextType {
  storeConfig: StoreConfig;
  isLoading: boolean;
  currencySymbol: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(defaultStoreConfig);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await StoreService.getStoreConfig();
        setStoreConfig(res.data);
      } catch (err) {
        console.error('Failed to load store config', err);
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
        currencySymbol: storeConfig.currency.symbol,
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
