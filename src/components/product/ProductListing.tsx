'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Check, Search, RotateCcw } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductGrid } from './ProductGrid';
import { ProductCardConfig } from '@/types/product-card.types';

export interface ProductListingProps {
  initialProducts: Product[];
  title?: string;
  subtitle?: string;
  config?: Partial<ProductCardConfig>;
  categories?: Array<{ id: string; name: string }>;
  availableColors?: Array<{ name: string; hex: string }>;
  availableSizes?: string[];
}

export function ProductListing({
  initialProducts,
  title = 'All Creations',
  subtitle = 'Discover handcrafted essentials engineered for timeless elegance.',
  config,
  categories = [],
  availableColors = [
    { name: 'Black', hex: '#0A0A0B' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Rose', hex: '#E8B8B5' },
    { name: 'Emerald', hex: '#064E3B' },
    { name: 'White', hex: '#FFFFFF' },
  ],
  availableSizes = ['XS', 'S', 'M', 'L', 'XL'],
}: ProductListingProps) {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase() || p.department?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedColor !== 'all') {
      result = result.filter((p) => p.colors?.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase()));
    }

    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes?.some((s) => (typeof s === 'string' ? s : s.size) === selectedSize));
    }

    if (inStockOnly) {
      result = result.filter((p) => p.sizes?.some((s) => (typeof s === 'string' ? true : s.inStock)));
    }

    result = result.filter((p) => p.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case 'price_low_high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => ((b as any).createdAt ? new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime() : 0));
        break;
      default:
        break;
    }

    return result;
  }, [initialProducts, selectedCategory, selectedColor, selectedSize, inStockOnly, priceRange, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setPriceRange(1000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white">{title}</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {/* 2. Top Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{displayedProducts.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> Creations
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
          >
            <option value="featured">Featured &amp; Best Selling</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* 3. Main Workspace: Filter Sidebar (Left) + Product Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Color Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Color Palette
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                  selectedColor === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center transition-transform ${
                    selectedColor === c.name ? 'ring-2 ring-rose-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.name && <Check className="w-3 h-3 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Size
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? 'all' : s)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    selectedSize === s
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Max Price</span>
              <span className="font-bold text-rose-600">${priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded"
            />
          </div>
        </aside>

        {/* Product Grid Area (9 Cols) */}
        <main className="lg:col-span-9 space-y-8">
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No creations match your filters.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your filters or adjusting your maximum price range.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={displayedProducts} columns={3} />

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-8 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white transition-all shadow-sm"
                  >
                    Load More Creations ({filteredProducts.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 4. Mobile Filter Drawer Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Filters</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Size Filter */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Size</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? 'all' : s)}
                      className={`py-1.5 text-xs font-bold rounded-lg border ${
                        selectedSize === s ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
