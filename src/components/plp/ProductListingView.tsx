'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
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
import { resolveActiveTenantSlug, formatTenantHref } from '@/lib/tenant-config';

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
  tenantSlug?: string;
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
  tenantSlug: propTenantSlug,
}: ProductListingViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);

  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search') || '';
  const urlSort = (searchParams.get('sort') as SortOption) || 'recommended';
  const isPreview = searchParams.get('preview') === 'draft';

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(4);
  const [plpConfig, setPlpConfig] = useState<any>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const previewParam = isPreview ? '&preview=draft' : '';
      const res = await fetch(
        `/api/v1/content/collection-page?tenant=${encodeURIComponent(activeTenantSlug)}${previewParam}&_t=${Date.now()}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        const cfg = json?.data;
        if (cfg) {
          setPlpConfig(cfg);
          if (cfg.grid?.desktopColumns) {
            setGridColumns(cfg.grid.desktopColumns as 2 | 3 | 4);
          }
        }
      }
    } catch {
      // Retain existing state
    }
  }, [activeTenantSlug, isPreview]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Real-time live preview synchronization with visual builder
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (
        data.type === 'PLP_UPDATED' ||
        data.type === 'COLLECTION_PAGE_UPDATED' ||
        data.type === 'COLLECTION_CONFIG_UPDATED' ||
        data.type === 'MAVENCO_COLLECTION_PAGE_PREVIEW' ||
        data.type === 'VISUAL_BUILDER_UPDATE'
      ) {
        const incoming = data.config || data.data;
        if (incoming && typeof incoming === 'object') {
          setPlpConfig((prev: any) => ({ ...prev, ...incoming }));
          if (incoming.grid?.desktopColumns) {
            setGridColumns(incoming.grid.desktopColumns as 2 | 3 | 4);
          }
        } else {
          fetchConfig();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_collection_page_updated' ||
        event.key === `jq_collection_page_${activeTenantSlug}` ||
        event.key === 'jq_active_tenant'
      ) {
        if (event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (parsed && typeof parsed === 'object') {
              setPlpConfig((prev: any) => ({ ...prev, ...parsed }));
              if (parsed.grid?.desktopColumns) {
                setGridColumns(parsed.grid.desktopColumns as 2 | 3 | 4);
              }
              return;
            }
          } catch {}
        }
        fetchConfig();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [activeTenantSlug, fetchConfig]);

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
        const activeCategory =
          filters.categories.length === 1 ? filters.categories[0] : initialCategory || undefined;
        const res = await ProductService.getProducts({
          department: department && department !== activeCategory ? department : undefined,
          category: activeCategory,
          search: urlSearch,
          isSale: filters.onSaleOnly,
          isNewArrival: filters.isNewOnly,
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
          sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
          colors: filters.colors.length > 0 ? filters.colors : undefined,
          sort,
          tenant: activeTenantSlug,
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
  }, [department, filters, sort, urlSearch, activeTenantSlug, initialCategory]);

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

  const effectiveBannerImage =
    bannerImage ||
    plpConfig?.hero?.bgImage ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop';
  const showHero = plpConfig?.hero?.enabled !== false;

  return (
    <div
      data-plp-view="true"
      className="pb-20 select-none transition-colors duration-200"
      style={{
        backgroundColor: 'var(--theme-color-background, #FFFDFC)',
        color: 'var(--theme-color-text, #111111)',
        ['--plp-grid-columns' as any]: gridColumns,
        ['--plp-grid-gap' as any]: plpConfig?.grid?.gap || '24px',
      }}
    >
      {/* Category Banner */}
      {showHero && (
        <div
          data-hero-section="true"
          className="relative w-full overflow-hidden flex items-center justify-center text-center transition-all duration-300 shadow-2xl"
          style={{
            minHeight: plpConfig?.hero?.height?.includes('px')
              ? plpConfig.hero.height
              : plpConfig?.hero?.height === 'large'
              ? '480px'
              : plpConfig?.hero?.height === 'small'
              ? '260px'
              : '380px',
          }}
        >
          {/* High-Resolution Background Image */}
          {effectiveBannerImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={effectiveBannerImage}
                alt={pageTitle}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center brightness-95 contrast-105"
              />
              {/* Dynamic Gradient Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/80 transition-opacity duration-200"
                style={{
                  opacity:
                    plpConfig?.hero?.overlayOpacity !== undefined
                      ? plpConfig.hero.overlayOpacity <= 1
                        ? plpConfig.hero.overlayOpacity
                        : plpConfig.hero.overlayOpacity / 100
                      : 0.45,
                }}
              />
            </div>
          )}

          {/* Hero Content */}
          <div data-hero-content="true" className="relative z-10 max-w-4xl px-4 py-12 space-y-3.5 mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-rose-300 text-[11px] font-bold uppercase tracking-widest mx-auto shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-sm" />
              <span style={{ color: '#FDA4AF' }}>Signature Lookbook</span>
            </div>

            <h1
              data-hero-title="true"
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight drop-shadow-lg"
              style={{ color: 'var(--theme-hero-title, var(--theme-color-heading, #FFFFFF))' }}
            >
              {pageTitle || plpConfig?.hero?.title || 'Collection'}
            </h1>

            {(pageSubtitle || plpConfig?.hero?.description) && (
              <p
                className="text-xs sm:text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium"
                style={{ color: 'var(--theme-hero-subtitle, var(--theme-color-text-secondary, #CBD5E1))' }}
              >
                {pageSubtitle || plpConfig?.hero?.description}
              </p>
            )}

            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mt-4" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {!showHero && (
          <div className="relative overflow-hidden my-6 p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-[#121624] border border-slate-800/80 shadow-2xl transition-all">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span>Curated Boutique Collection</span>
              </div>
              <h1
                data-hero-title="true"
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight drop-shadow-sm"
                style={{ color: 'var(--theme-hero-title, var(--theme-color-heading, #FFFFFF))' }}
              >
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p
                  className="text-xs sm:text-sm md:text-base font-sans leading-relaxed max-w-2xl pt-1"
                  style={{ color: '#CBD5E1' }}
                >
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main 2-Column PLP Layout: Sidebar (Desktop) + Products Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          {/* Desktop Left Sidebar (1 col) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-[var(--theme-color-surface-secondary,#FAF6F2)] border border-[var(--theme-color-border,#E8DED8)] p-6">
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
            <div className="flex items-center justify-between gap-4 p-3 bg-[var(--theme-color-surface-secondary,#FAF6F2)] border border-[var(--theme-color-border,#E8DED8)]">
              {/* Left: Product count & Mobile filter trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-color-primary,#111111)] text-white text-xs uppercase font-bold tracking-wider"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter &amp; Sort</span>
                </button>

                <span className="text-xs text-[var(--theme-color-text-secondary,#57534E)] font-semibold">
                  Showing <strong className="text-[var(--theme-color-heading,#111111)]">{products.length}</strong> of{' '}
                  <strong className="text-[var(--theme-color-heading,#111111)]">{totalCount}</strong> styles
                </span>
              </div>

              {/* Right: Sorting dropdown & Desktop Grid layout switch */}
              <div className="flex items-center gap-3">
                <SortDropdown currentSort={sort} onSortChange={setSort} />

                {/* Desktop Grid Switcher */}
                <div className="hidden sm:flex items-center border border-[var(--theme-color-border,#E8DED8)] bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 ${
                      gridColumns === 3
                        ? 'bg-[var(--theme-color-primary,#111111)] text-white'
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                    title="3 Columns"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 ${
                      gridColumns === 4
                        ? 'bg-[var(--theme-color-primary,#111111)] text-white'
                        : 'text-slate-400 hover:text-slate-900'
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
              <>
                <ProductGrid
                  products={products}
                  isLoading={isLoading}
                  skeletonCount={6}
                  columns={gridColumns}
                  gap={plpConfig?.grid?.gap}
                  tenantSlug={activeTenantSlug}
                />

                {/* Promotional Grid Insert if enabled in builder */}
                {plpConfig?.promo?.enabled && products.length >= (plpConfig.promo.insertAfterIndex || 4) && (
                  <div className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#1A1625] text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-1.5 max-w-lg">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        Atelier Exclusives
                      </span>
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                        {plpConfig.promo.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {plpConfig.promo.subtitle}
                      </p>
                    </div>

                    <Link
                      href={formatTenantHref(plpConfig.promo.ctaLink || '/about', activeTenantSlug)}
                      className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md"
                    >
                      {plpConfig.promo.ctaText}
                    </Link>
                  </div>
                )}
              </>
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
