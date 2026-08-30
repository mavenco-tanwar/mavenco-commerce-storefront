'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, Grid2X2 } from 'lucide-react';
import { Product, FilterState, SortOption, Department } from '@/types/product';
import { ProductService } from '@/services/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from './FilterSidebar';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { ActiveFilterTags } from './ActiveFilterTags';
import { SortDropdown } from './SortDropdown';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';

export interface ProductListingViewProps {
  department?: Department;
  initialCategory?: string;
  isNewArrivalsOnly?: boolean;
  isOnSaleOnly?: boolean;
  pageTitle: string;
  pageSubtitle?: string;
  bannerImage?: string;
  breadcrumbs: BreadcrumbItem[];
  availableCategories: { slug: string; name: string; count?: number }[];
}

export function ProductListingView({
  department,
  initialCategory,
  isNewArrivalsOnly = false,
  isOnSaleOnly = false,
  pageTitle,
  pageSubtitle,
  bannerImage,
  breadcrumbs,
  availableCategories,
}: ProductListingViewProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search') || '';
  const urlSort = (searchParams.get('sort') as SortOption) || 'recommended';

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  const [sort, setSort] = useState<SortOption>(urlSort);
  const [filters, setFilters] = useState<FilterState>({
    departments: department ? [department] : [],
    categories: urlCategory ? [urlCategory] : initialCategory ? [initialCategory] : [],
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    minRating: null,
    onlyInStock: false,
    onSaleOnly: isOnSaleOnly,
    isNewOnly: isNewArrivalsOnly,
  });

  useEffect(() => {
    if (urlCategory) {
      setFilters((prev: FilterState) => ({ ...prev, categories: [urlCategory] }));
    }
  }, [urlCategory]);

  useEffect(() => {
    async function loadFilteredProducts() {
      setIsLoading(true);
      try {
        const res = await ProductService.getProducts({
          department,
          category: filters.categories.length === 1 ? filters.categories[0] : undefined,
          search: urlSearch,
          isSale: filters.onSaleOnly,
          isNewArrival: filters.isNewOnly,
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
          sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
          colors: filters.colors.length > 0 ? filters.colors : undefined,
          sort,
        });

        setProducts(res.data.products);
        setTotalCount(res.data.total);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFilteredProducts();
  }, [department, filters, sort, urlSearch]);

  const handleResetFilters = () => {
    setFilters({
      departments: department ? [department] : [],
      categories: [],
      priceRange: [0, 10000],
      sizes: [],
      colors: [],
      minRating: null,
      onlyInStock: false,
      onSaleOnly: false,
      isNewOnly: false,
    });
  };

  return (
    <div className="bg-[#FFFDFC] pb-20 select-none">
      {/* Category Banner */}
      {bannerImage && (
        <div className="relative h-44 sm:h-64 bg-[#111111] overflow-hidden flex items-center justify-center text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 max-w-xl px-4 space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#FFFDFC] tracking-tight">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="text-xs sm:text-sm text-[#E8DED8] font-sans max-w-md mx-auto">
                {pageSubtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {!bannerImage && (
          <div className="pt-2 pb-6 border-b border-[#E8DED8] mb-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="text-xs text-[#777777] font-sans mt-1">
                {pageSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Main 2-Column PLP Layout: Sidebar (Desktop) + Products Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          {/* Desktop Left Sidebar (1 col) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-[#FAF6F2] border border-[#E8DED8] p-6">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                availableCategories={availableCategories}
              />
            </div>
          </aside>

          {/* Right Product Grid Area (3 cols) */}
          <main className="lg:col-span-3 space-y-4">
            {/* Top Controls Bar (Sort, Item Count, Mobile Filter Button, Layout Grid toggle) */}
            <div className="flex items-center justify-between gap-4 p-3 bg-[#FAF6F2] border border-[#E8DED8]">
              {/* Left: Product count & Mobile filter trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-white text-xs uppercase font-bold tracking-wider"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter &amp; Sort</span>
                </button>

                <span className="text-xs text-[#777777] font-semibold">
                  Showing <strong className="text-[#111111]">{products.length}</strong> of{' '}
                  <strong className="text-[#111111]">{totalCount}</strong> styles
                </span>
              </div>

              {/* Right: Sorting dropdown & Desktop Grid layout switch */}
              <div className="flex items-center gap-3">
                <SortDropdown currentSort={sort} onSortChange={setSort} />

                {/* Desktop Grid Switcher */}
                <div className="hidden sm:flex items-center border border-[#E8DED8] bg-white">
                  <button
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 ${
                      gridColumns === 3 ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
                    }`}
                    title="3 Columns"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 ${
                      gridColumns === 4 ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
                    }`}
                    title="4 Columns"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            <ActiveFilterTags
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />

            {/* Product Grid or Empty State */}
            {products.length === 0 && !isLoading ? (
              <EmptyState
                title="No Styles Match Your Criteria"
                description="Try adjusting your category, price range, or color filters to explore more of our collection."
                actionText="Reset All Filters"
                onActionClick={handleResetFilters}
              />
            ) : (
              <ProductGrid
                products={products}
                isLoading={isLoading}
                skeletonCount={6}
                columns={gridColumns}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter & Sort Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        availableCategories={availableCategories}
        productCount={products.length}
      />
    </div>
  );
}
