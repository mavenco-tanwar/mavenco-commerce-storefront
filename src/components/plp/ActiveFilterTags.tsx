'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FilterState } from '@/types/product';

export interface ActiveFilterTagsProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export function ActiveFilterTags({
  filters,
  onFilterChange,
  onReset,
}: ActiveFilterTagsProps) {
  const removeCategory = (catSlug: string) => {
    onFilterChange({
      ...filters,
      categories: filters.categories.filter((c) => c !== catSlug),
    });
  };

  const removeSize = (size: string) => {
    onFilterChange({
      ...filters,
      sizes: filters.sizes.filter((s) => s !== size),
    });
  };

  const removeColor = (colorName: string) => {
    onFilterChange({
      ...filters,
      colors: filters.colors.filter((c) => c !== colorName),
    });
  };

  const removePriceRange = () => {
    onFilterChange({ ...filters, priceRange: [0, 10000] });
  };

  const hasActivePrice = filters.priceRange[0] > 0 || filters.priceRange[1] < 10000;
  const hasActive =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    hasActivePrice ||
    filters.onSaleOnly ||
    filters.isNewOnly;

  if (!hasActive) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 select-none animate-in fade-in duration-200">
      <span className="text-[11px] uppercase font-bold text-[#777777] tracking-wider">
        Active Filters:
      </span>

      {filters.categories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F1EA] border border-[#E8DED8] text-xs font-semibold text-[#111111]"
        >
          <span>{cat}</span>
          <button
            onClick={() => removeCategory(cat)}
            className="hover:text-[#C98282]"
            aria-label={`Remove filter ${cat}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.sizes.map((size) => (
        <span
          key={size}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F1EA] border border-[#E8DED8] text-xs font-semibold text-[#111111]"
        >
          <span>Size: {size}</span>
          <button
            onClick={() => removeSize(size)}
            className="hover:text-[#C98282]"
            aria-label={`Remove filter size ${size}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.colors.map((color) => (
        <span
          key={color}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F1EA] border border-[#E8DED8] text-xs font-semibold text-[#111111]"
        >
          <span>{color}</span>
          <button
            onClick={() => removeColor(color)}
            className="hover:text-[#C98282]"
            aria-label={`Remove filter color ${color}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {hasActivePrice && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F1EA] border border-[#E8DED8] text-xs font-semibold text-[#111111]">
          <span>
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </span>
          <button
            onClick={removePriceRange}
            className="hover:text-[#C98282]"
            aria-label="Remove price filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.onSaleOnly && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7EBEA] border border-[#C98282]/40 text-xs font-bold text-[#C98282]">
          <span>On Sale</span>
          <button
            onClick={() => onFilterChange({ ...filters, onSaleOnly: false })}
            className="hover:text-[#111111]"
            aria-label="Remove sale only filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.isNewOnly && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6F2] border border-[#B77A68]/40 text-xs font-bold text-[#111111]">
          <span>New Arrivals</span>
          <button
            onClick={() => onFilterChange({ ...filters, isNewOnly: false })}
            className="hover:text-[#C98282]"
            aria-label="Remove new arrivals filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        onClick={onReset}
        className="text-xs text-[#C98282] hover:underline font-bold ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
