'use client';

import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { HeaderBlock } from '@/lib/header-config';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency-context';

interface CurrencyBlockProps {
  block: HeaderBlock;
  accentColor?: string;
}

export function CurrencyBlock({ block, accentColor = '#E11D48' }: CurrencyBlockProps) {
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const s = block.settings || {};

  return (
    <div className="relative select-none" onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wider hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: block.styles?.textColor || 'inherit' }}
      >
        <Globe className="w-3.5 h-3.5 opacity-80" />
        <span>
          {currencyInfo.code} ({currencyInfo.symbol})
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-40 bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => {
                setCurrency(curr.code as CurrencyCode);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
            >
              <span>
                {curr.code} ({curr.symbol})
              </span>
              {currency === curr.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
