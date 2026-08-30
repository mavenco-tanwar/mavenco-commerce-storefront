'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterState } from '@/types/product';
import { Button } from '@/components/ui/Button';

export interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  availableCategories: { slug: string; name: string; count?: number }[];
  isMobile?: boolean;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2-3Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y'];
const AVAILABLE_COLORS = [
  { name: 'Blush Pink', hex: '#E8B8B5' },
  { name: 'Dusty Rose', hex: '#C98282' },
  { name: 'Rose Gold', hex: '#B77A68' },
  { name: 'Ivory Cream', hex: '#F8F1EA' },
  { name: 'Obsidian Black', hex: '#111111' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 10000 },
  { label: 'Under ₹999', min: 0, max: 999 },
  { label: '₹1,000 - ₹1,499', min: 1000, max: 1499 },
  { label: '₹1,500 - ₹2,199', min: 1500, max: 2199 },
  { label: '₹2,200 & Above', min: 2200, max: 10000 },
];

export function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  availableCategories,
}: FilterSidebarProps) {
  const toggleCategory = (catSlug: string) => {
    const exists = filters.categories.includes(catSlug);
    const updated = exists
      ? filters.categories.filter((c: string) => c !== catSlug)
      : [...filters.categories, catSlug];
    onFilterChange({ ...filters, categories: updated });
  };

  const toggleSize = (size: string) => {
    const exists = filters.sizes.includes(size);
    const updated = exists
      ? filters.sizes.filter((s: string) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const toggleColor = (colorName: string) => {
    const exists = filters.colors.includes(colorName);
    const updated = exists
      ? filters.colors.filter((c: string) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: updated });
  };

  const setPriceRange = (min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: [min, max] });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000 ||
    filters.onSaleOnly ||
    filters.isNewOnly;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
        <h4 className="text-xs uppercase font-bold tracking-widest text-[#111111]">
          Filters
        </h4>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[#C98282] hover:underline font-semibold"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. Category */}
      {availableCategories.length > 0 && (
        <div className="space-y-2.5 pb-5 border-b border-[#E8DED8]">
          <h5 className="text-xs uppercase font-bold tracking-wider text-[#111111]">
            Categories
          </h5>
          <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
            {availableCategories.map((cat) => {
              const isChecked = filters.categories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className="flex items-center justify-between text-xs text-[#777777] hover:text-[#111111] cursor-pointer py-0.5"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat.slug)}
                      className="rounded-none border-[#E8DED8] text-[#B77A68] focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>{cat.name}</span>
                  </span>
                  {cat.count !== undefined && (
                    <span className="text-[10px] text-[#999999]">({cat.count})</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Price Range */}
      <div className="space-y-2.5 pb-5 border-b border-[#E8DED8]">
        <h5 className="text-xs uppercase font-bold tracking-wider text-[#111111]">
          Price Range
        </h5>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, idx) => {
            const isSelected =
              filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
            return (
              <label
                key={idx}
                className="flex items-center gap-2 text-xs text-[#777777] hover:text-[#111111] cursor-pointer py-0.5"
              >
                <input
                  type="radio"
                  name="priceRangeRadio"
                  checked={isSelected}
                  onChange={() => setPriceRange(range.min, range.max)}
                  className="text-[#B77A68] focus:ring-0 w-3.5 h-3.5"
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Size */}
      <div className="space-y-2.5 pb-5 border-b border-[#E8DED8]">
        <h5 className="text-xs uppercase font-bold tracking-wider text-[#111111]">
          Size
        </h5>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`min-w-[36px] h-8 px-2 text-[11px] font-bold uppercase tracking-wider border transition-all ${
                  isSelected
                    ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                    : 'border-[#E8DED8] bg-[#FFFDFC] text-[#777777] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Color Palette */}
      <div className="space-y-2.5 pb-5 border-b border-[#E8DED8]">
        <h5 className="text-xs uppercase font-bold tracking-wider text-[#111111]">
          Color
        </h5>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map((col) => {
            const isSelected = filters.colors.includes(col.name);
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => toggleColor(col.name)}
                title={col.name}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-[#B77A68] border-black scale-110'
                    : 'border-[#E8DED8] hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      col.name === 'Obsidian Black' ? 'text-white' : 'text-black'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Special Toggles */}
      <div className="space-y-2 pt-1">
        <label className="flex items-center gap-2 text-xs text-[#777777] hover:text-[#111111] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, onSaleOnly: e.target.checked })
            }
            className="rounded-none border-[#E8DED8] text-[#C98282] focus:ring-0 w-3.5 h-3.5"
          />
          <span className="font-medium text-[#C98282]">On Sale Only</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-[#777777] hover:text-[#111111] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isNewOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, isNewOnly: e.target.checked })
            }
            className="rounded-none border-[#E8DED8] text-[#B77A68] focus:ring-0 w-3.5 h-3.5"
          />
          <span className="font-medium text-[#111111]">New Arrivals Only</span>
        </label>
      </div>
    </div>
  );
}
