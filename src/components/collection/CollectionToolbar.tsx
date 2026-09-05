'use client';

import React from 'react';
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { SortOption } from '@/types/collection-page.types';

export interface CollectionToolbarProps {
  totalCount: number;
  currentCount: number;
  activeSort: string;
  onSortChange: (newSort: string) => void;
  onOpenMobileFilters: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortOptions?: SortOption[];
  showViewToggle?: boolean;
}

export function CollectionToolbar({
  totalCount,
  currentCount,
  activeSort,
  onSortChange,
  onOpenMobileFilters,
  viewMode,
  onViewModeChange,
  sortOptions = [
    { key: 'featured', label: 'Featured & Best Selling', enabled: true, position: 1 },
    { key: 'newest', label: 'Newest Arrivals', enabled: true, position: 2 },
    { key: 'price_asc', label: 'Price: Low to High', enabled: true, position: 3 },
    { key: 'price_desc', label: 'Price: High to Low', enabled: true, position: 4 },
    { key: 'rating', label: 'Highest Customer Rating', enabled: true, position: 5 },
  ],
  showViewToggle = true,
}: CollectionToolbarProps) {
  const enabledSorts = (sortOptions || []).filter((s) => s && s.enabled !== false);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap bg-[#FAF6F2] dark:bg-slate-900/60 p-3.5 rounded-2xl border border-[#E8DED8] dark:border-slate-800 select-none">
      {/* Left: Mobile Filter Trigger + Product Count */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden px-3.5 py-1.5 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-black text-xs font-bold flex items-center gap-1.5 hover:bg-rose-600 transition-colors shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>

        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{currentCount}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white">{totalCount}</strong> Creations
        </span>
      </div>

      {/* Right: View Mode Toggle + Sort Dropdown */}
      <div className="flex items-center gap-3">
        {showViewToggle && (
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-black'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-black'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Sort:</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E8DED8] dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer shadow-xs focus:ring-2 focus:ring-rose-500"
          >
            {enabledSorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
