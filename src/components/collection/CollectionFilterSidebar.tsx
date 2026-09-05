'use client';

import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { FilterDefinition } from '@/types/collection-page.types';
import { useCurrency } from '@/lib/currency-context';

export interface FilterState {
  category: string;
  color: string;
  size: string;
  maxPrice: number;
  inStockOnly: boolean;
}

export interface CollectionFilterSidebarProps {
  filterDefs?: FilterDefinition[];
  filterState: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onReset: () => void;
  availableCategories?: Array<{ slug: string; name: string }>;
  availableColors?: Array<{ name: string; hex: string }>;
  availableSizes?: string[];
  maxPriceLimit?: number;
  className?: string;
}

export function CollectionFilterSidebar({
  filterDefs = [],
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
  className = '',
}: CollectionFilterSidebarProps) {
  const { formatPrice } = useCurrency();

  return (
    <aside className={`space-y-6 p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-[#E8DED8] dark:border-slate-800 shadow-xs select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8DED8] dark:border-slate-800 pb-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-[#B77A68] hover:text-[#A36655] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
          Category
        </span>
        <div className="space-y-1">
          {availableCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onFilterChange('category', cat.slug)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                filterState.category === cat.slug
                  ? 'bg-[#F8F1EA] text-[#B77A68] font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{cat.name}</span>
              {filterState.category === cat.slug && <Check className="w-3.5 h-3.5 text-[#B77A68]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatch Filter */}
      <div className="space-y-2.5 pt-2 border-t border-[#E8DED8] dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
          Color Palette
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onFilterChange('color', 'all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              filterState.color === 'all'
                ? 'bg-slate-950 text-white dark:bg-white dark:text-black border-transparent'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All
          </button>
          {availableColors.map((c) => (
            <button
              key={c.name}
              onClick={() => onFilterChange('color', c.name)}
              className={`w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center transition-transform ${
                filterState.color === c.name ? 'ring-2 ring-[#B77A68] scale-110' : ''
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {filterState.color === c.name && <Check className="w-3 h-3 text-white drop-shadow" />}
            </button>
          ))}
        </div>
      </div>

      {/* Size Chips Filter */}
      <div className="space-y-2.5 pt-2 border-t border-[#E8DED8] dark:border-slate-800">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
          Size
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {availableSizes.map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange('size', filterState.size === s ? 'all' : s)}
              className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                filterState.size === s
                  ? 'bg-[#B77A68] text-white border-[#B77A68] shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2.5 pt-2 border-t border-[#E8DED8] dark:border-slate-800">
        <div className="flex justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white">Max Price</span>
          <span className="font-bold text-[#B77A68]">{formatPrice ? formatPrice(filterState.maxPrice) : `₹${filterState.maxPrice}`}</span>
        </div>
        <input
          type="range"
          min="50"
          max={maxPriceLimit}
          step={maxPriceLimit > 2000 ? '100' : '50'}
          value={filterState.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
          className="w-full accent-[#B77A68] cursor-pointer"
        />
      </div>

      {/* In Stock Toggle */}
      <div className="pt-2 border-t border-[#E8DED8] dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-white">In Stock Only</span>
        <input
          type="checkbox"
          checked={filterState.inStockOnly}
          onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
          className="w-4 h-4 accent-[#B77A68] rounded cursor-pointer"
        />
      </div>
    </aside>
  );
}
