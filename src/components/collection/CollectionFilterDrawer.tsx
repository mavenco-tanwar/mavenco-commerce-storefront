'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterState } from './CollectionFilterSidebar';
import { useCurrency } from '@/lib/currency-context';

export interface CollectionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onReset: () => void;
  availableCategories?: Array<{ slug: string; name: string }>;
  availableColors?: Array<{ name: string; hex: string }>;
  availableSizes?: string[];
  maxPriceLimit?: number;
}

export function CollectionFilterDrawer({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onReset,
  availableCategories = [
    { slug: 'all', name: 'All Categories' },
    { slug: 'dresses', name: 'Dresses' },
    { slug: 'co-ords', name: 'Co-Ords & Sets' },
    { slug: 'kurtis', name: 'Kurtis & Tunics' },
    { slug: 'western-wear', name: 'Western Wear' },
  ],
  availableColors = [
    { name: 'Black', hex: '#0A0A0B' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Rose', hex: '#E8B8B5' },
    { name: 'Emerald', hex: '#064E3B' },
    { name: 'Ivory', hex: '#FAF6F2' },
  ],
  availableSizes = ['XS', 'S', 'M', 'L', 'XL'],
  maxPriceLimit = 1000,
}: CollectionFilterDrawerProps) {
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Filter Creations
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-black dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Category</span>
            <div className="space-y-1">
              {availableCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => onFilterChange('category', cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    filterState.category === cat.slug
                      ? 'bg-rose-50 text-rose-600 font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  <span>{cat.name}</span>
                  {filterState.category === cat.slug && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Size</span>
            <div className="grid grid-cols-5 gap-1.5">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onFilterChange('size', filterState.size === s ? 'all' : s)}
                  className={`py-1.5 text-xs font-bold rounded-lg border ${
                    filterState.size === s
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between text-xs font-bold">
              <span>Max Price</span>
              <span className="text-rose-600">{formatPrice ? formatPrice(filterState.maxPrice) : `₹${filterState.maxPrice}`}</span>
            </div>
            <input
              type="range"
              min="50"
              max={maxPriceLimit}
              step={maxPriceLimit > 2000 ? '100' : '50'}
              value={filterState.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
