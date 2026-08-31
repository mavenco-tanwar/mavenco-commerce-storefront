'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstInr: number; // e.g. 1 USD = 87.5 INR -> rate = 1 / 87.5
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rateAgainstInr: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateAgainstInr: 1 / 87.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateAgainstInr: 1 / 94.2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateAgainstInr: 1 / 111.0 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateAgainstInr: 1 / 23.8 },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyInfo: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (inrPrice: number) => string;
  convertPrice: (inrPrice: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  currencyInfo: CURRENCIES.INR,
  setCurrency: () => {},
  formatPrice: (p) => `₹${p.toLocaleString('en-IN')}`,
  convertPrice: (p) => p,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mavenco_preferred_currency') as CurrencyCode;
      if (stored && CURRENCIES[stored]) {
        setCurrencyState(stored);
      }
    } catch {}
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem('mavenco_preferred_currency', code);
    } catch {}
  };

  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  const convertPrice = (inrPrice: number): number => {
    if (currency === 'INR') return inrPrice;
    const converted = inrPrice * currencyInfo.rateAgainstInr;
    return Math.round(converted);
  };

  const formatPrice = (inrPrice: number): string => {
    const converted = convertPrice(inrPrice);
    if (currency === 'INR') {
      return `₹${inrPrice.toLocaleString('en-IN')}`;
    }
    if (currency === 'USD') {
      return `$${converted.toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      return `€${converted.toLocaleString('de-DE')}`;
    }
    if (currency === 'GBP') {
      return `£${converted.toLocaleString('en-GB')}`;
    }
    if (currency === 'AED') {
      return `AED ${converted.toLocaleString('en-US')}`;
    }
    return `${currencyInfo.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyInfo,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
