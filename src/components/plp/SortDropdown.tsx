'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SortOption } from '@/types/product';

export interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Best Customer Rating' },
];

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  return (
    <div className="relative inline-flex items-center select-none">
      <span className="text-xs text-[#777777] uppercase font-bold tracking-wider mr-2 hidden sm:inline">
        Sort By:
      </span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-[#FFFDFC] border border-[#E8DED8] px-3.5 py-2 pr-8 text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#B77A68] rounded-none cursor-pointer tracking-wide font-sans"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#777777] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
