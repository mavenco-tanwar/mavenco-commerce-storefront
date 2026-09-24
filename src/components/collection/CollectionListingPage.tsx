'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';
import { CollectionPageConfig } from '@/types/collection-page.types';
import { getDefaultCollectionPageConfig } from '@/lib/collection-page-presets';
import { CollectionHero } from './CollectionHero';
import { CollectionBreadcrumbs } from './CollectionBreadcrumbs';
import { CollectionToolbar } from './CollectionToolbar';
import { CollectionFilterSidebar, FilterState } from './CollectionFilterSidebar';
import { CollectionFilterDrawer } from './CollectionFilterDrawer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getTenantConfig, resolveActiveTenantSlug, formatTenantHref } from '@/lib/tenant-config';

export interface CollectionListingPageProps {
  initialProducts: Product[];
  collectionTitle?: string;
  collectionDescription?: string;
  collectionBannerImage?: string;
  totalProductsCount?: number;
  templateOverride?: Partial<CollectionPageConfig>;
  initialConfig?: CollectionPageConfig;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  availableCategories?: Array<{ slug: string; name: string }>;
  tenantSlug?: string;
}

function CollectionListingPageContent({
  initialProducts,
  collectionTitle = 'All Collections',
  collectionDescription,
  collectionBannerImage,
  totalProductsCount,
  templateOverride,
  initialConfig,
  breadcrumbs = [{ label: 'Collections', href: '/collections' }],
  availableCategories,
  tenantSlug: propTenantSlug,
}: CollectionListingPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);
  const activeTenant = getTenantConfig(activeTenantSlug);

  const isPreview = searchParams.get('preview') === 'draft';

  // Load Base Configuration from initialConfig (DB) or category preset
  const [config, setConfig] = useState<CollectionPageConfig>(() => ({
    ...(initialConfig || getDefaultCollectionPageConfig(activeTenant.slug || propTenantSlug || 'demo')),
    ...(templateOverride || {}),
  }));

  const fetchingRef = useRef(false);
  const fetchedSlugRef = useRef<string | null>(initialConfig ? (activeTenant.slug || propTenantSlug || null) : null);

  // Fetch Live Published / Draft Configuration from API
  const loadTemplate = useCallback(async (force = false) => {
    const slug = activeTenant.slug || 'demo';
    if (!force && fetchingRef.current) return;
    if (!force && fetchedSlugRef.current === slug && !isPreview) return;

    fetchingRef.current = true;
    try {
      const previewParam = isPreview ? '&preview=draft' : '';
      const cacheBust = isPreview || force ? `&_t=${Date.now()}` : '';
      const res = await fetch(
        `/api/v1/content/collection-page?tenant=${encodeURIComponent(slug)}${previewParam}${cacheBust}`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      if (json.success && json.data) {
        setConfig((prev) => ({
          ...prev,
          ...json.data,
          ...(templateOverride || {}),
        }));
        fetchedSlugRef.current = slug;
      }
    } catch (err) {
      console.warn('Failed to load published PLP template, using fallback config:', err);
    } finally {
      fetchingRef.current = false;
    }
  }, [activeTenant.slug, isPreview, templateOverride]);

  // Initial fetch and draft check
  useEffect(() => {
    if (typeof window !== 'undefined' && isPreview) {
      try {
        const cachedDraft = localStorage.getItem(`jq_collection_page_${activeTenant.slug}`);
        if (cachedDraft) {
          const parsed = JSON.parse(cachedDraft);
          if (parsed && typeof parsed === 'object') {
            setConfig((prev) => ({ ...prev, ...parsed, ...(templateOverride || {}) }));
          }
        }
      } catch {}
    }

    loadTemplate();
  }, [loadTemplate, isPreview, activeTenant.slug, templateOverride]);

  // Real-time live preview synchronization with Visual PLP Builder Studio iframe and storage
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
          setConfig((prev) => ({ ...prev, ...incoming, ...(templateOverride || {}) }));
        } else {
          loadTemplate();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_collection_page_updated' ||
        event.key === `jq_collection_page_${activeTenant.slug}`
      ) {
        if (event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (parsed && typeof parsed === 'object') {
              setConfig((prev) => ({ ...prev, ...parsed, ...(templateOverride || {}) }));
              return;
            }
          } catch {}
        }
        loadTemplate();
      } else if (event.key === 'jq_active_tenant' && event.newValue && event.newValue !== activeTenant.slug) {
        loadTemplate();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [activeTenant.slug, loadTemplate, templateOverride]);

  // Compute Dynamic Max Price from Loaded Products
  const maxProductPrice = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return 5000;
    const max = Math.max(...initialProducts.map((p) => Number(p.price) || 0));
    return Math.max(Math.ceil(max * 1.25), 1000);
  }, [initialProducts]);

  // URL State Initialization
  const initialCategory = searchParams.get('category') || 'all';
  const initialColor = searchParams.get('color') || 'all';
  const initialSize = searchParams.get('size') || 'all';
  const initialMaxPrice = Number(searchParams.get('maxPrice')) || maxProductPrice;
  const initialInStock = searchParams.get('inStock') === 'true';
  const initialSort = searchParams.get('sort') || config.sorting.defaultSort || 'featured';
  const initialView = (searchParams.get('view') as 'grid' | 'list') || config.toolbar.defaultView || 'grid';

  const [filterState, setFilterState] = useState<FilterState>({
    category: initialCategory,
    color: initialColor,
    size: initialSize,
    maxPrice: initialMaxPrice,
    inStockOnly: initialInStock,
  });

  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialView);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(config.pagination.productsPerPage || 24);

  // Sync State with URL Query Params
  const updateUrlState = (newFilters: FilterState, newSort: string, newView: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.category && newFilters.category !== 'all') params.set('category', newFilters.category);
    else params.delete('category');

    if (newFilters.color && newFilters.color !== 'all') params.set('color', newFilters.color);
    else params.delete('color');

    if (newFilters.size && newFilters.size !== 'all') params.set('size', newFilters.size);
    else params.delete('size');

    if (newFilters.maxPrice && newFilters.maxPrice < maxProductPrice) params.set('maxPrice', String(newFilters.maxPrice));
    else params.delete('maxPrice');

    if (newFilters.inStockOnly) params.set('inStock', 'true');
    else params.delete('inStock');

    if (newSort && newSort !== 'featured') params.set('sort', newSort);
    else params.delete('sort');

    if (newView && newView !== 'grid') params.set('view', newView);
    else params.delete('view');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const nextState = { ...filterState, [key]: value };
    setFilterState(nextState);
    updateUrlState(nextState, sortBy, viewMode);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateUrlState(filterState, newSort, viewMode);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    updateUrlState(filterState, sortBy, mode);
  };

  const handleResetFilters = () => {
    const resetState: FilterState = {
      category: 'all',
      color: 'all',
      size: 'all',
      maxPrice: maxProductPrice,
      inStockOnly: false,
    };
    setFilterState(resetState);
    updateUrlState(resetState, sortBy, viewMode);
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = Array.isArray(initialProducts) ? [...initialProducts] : [];

    if (filterState.category !== 'all') {
      const target = filterState.category.toLowerCase().trim();
      result = result.filter((p) => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pDept = (p.department || '').toLowerCase().trim();
        const pSlug = ((p as any).categorySlug || '').toLowerCase().trim();
        const pName = ((p as any).categoryName || '').toLowerCase().trim();
        const inIds = Array.isArray((p as any).categoryIds) && (p as any).categoryIds.some((id: string) => {
          const clean = id.toLowerCase().replace(/^cat_/, '').replace(/_[a-z0-9-]+$/, '');
          return clean === target || id.toLowerCase() === target;
        });
        return pCat === target || pDept === target || pSlug === target || pName === target || inIds;
      });
    }

    if (filterState.color !== 'all') {
      result = result.filter((p) =>
        p.colors?.some((c) => c.name.toLowerCase() === filterState.color.toLowerCase())
      );
    }

    if (filterState.size !== 'all') {
      result = result.filter((p) =>
        p.sizes?.some((s) => (typeof s === 'string' ? s : s.size) === filterState.size)
      );
    }

    if (filterState.inStockOnly) {
      result = result.filter((p) =>
        p.sizes?.some((s) => (typeof s === 'string' ? true : s.inStock))
      );
    }

    if (filterState.maxPrice && filterState.maxPrice < maxProductPrice) {
      result = result.filter((p) => (Number(p.price) || 0) <= filterState.maxPrice);
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
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
  }, [initialProducts, filterState, sortBy, maxProductPrice]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const categoriesToUse = useMemo(() => {
    if (availableCategories && availableCategories.length > 0) return availableCategories;
    const cats: Array<{ slug: string; name: string }> = [{ slug: 'all', name: 'All in Collection' }];
    const seen = new Set<string>();
    for (const p of initialProducts) {
      const rawCat = p.category || (p as any).categorySlug || '';
      const catSlug = String(rawCat).toLowerCase().trim();
      const catName = (p as any).categoryName || p.category || catSlug;
      if (catSlug && !seen.has(catSlug)) {
        seen.add(catSlug);
        cats.push({
          slug: catSlug,
          name: String(catName).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        });
      }
    }
    return cats;
  }, [availableCategories, initialProducts]);

  const colorsToUse = useMemo(() => {
    const list: Array<{ name: string; hex: string }> = [];
    const seen = new Set<string>();
    for (const p of initialProducts) {
      if (Array.isArray(p.colors)) {
        for (const c of p.colors) {
          if (c?.name && !seen.has(c.name.toLowerCase())) {
            seen.add(c.name.toLowerCase());
            list.push({ name: c.name, hex: c.hex || '#B77A68' });
          }
        }
      }
    }
    return list.length > 0 ? list : undefined;
  }, [initialProducts]);

  const sizesToUse = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();
    for (const p of initialProducts) {
      if (Array.isArray(p.sizes)) {
        for (const s of p.sizes) {
          const sName = typeof s === 'string' ? s : s?.size;
          if (sName && !seen.has(sName)) {
            seen.add(sName);
            list.push(sName);
          }
        }
      }
    }
    return list.length > 0 ? list : undefined;
  }, [initialProducts]);

  return (
    <div
      data-plp-builder="true"
      className="min-h-screen pb-20 space-y-8 transition-colors duration-200"
      style={{
        backgroundColor: config.styles?.backgroundColor || 'var(--theme-color-background, #FFFDFC)',
        color: config.styles?.textColor || 'var(--theme-color-text, #111111)',
        fontFamily: config.styles?.bodyFont ? `${config.styles.bodyFont}, sans-serif` : undefined,
        ['--plp-grid-columns' as any]: config.grid?.desktopColumns || 4,
        ['--plp-grid-gap' as any]: config.grid?.gap || '24px',
        ['--theme-color-heading' as any]: config.styles?.headingColor || '#111111',
        ['--theme-color-primary' as any]: config.styles?.buttonBackgroundColor || '#111111',
        ['--theme-btn-primary-bg' as any]: config.styles?.buttonBackgroundColor || '#111111',
        ['--theme-btn-primary-text' as any]: config.styles?.buttonTextColor || '#FFFFFF',
        ['--theme-color-accent' as any]: config.styles?.accentColor || '#B77A68',
        ['--card-bg' as any]: config.styles?.cardBackgroundColor || '#FFFFFF',
        ['--filter-bg' as any]: config.styles?.filterBackgroundColor || '#FAF6F2',
        ['--toolbar-bg' as any]: config.styles?.toolbarBackgroundColor || config.styles?.filterBackgroundColor || '#FAF6F2',
        ['--card-radius' as any]: config.styles?.borderRadius || '16px',
      }}
    >
      {/* 1. Hero Section */}
      <CollectionHero
        config={config.hero}
        titleOverride={collectionTitle}
        descriptionOverride={collectionDescription}
        imageOverride={collectionBannerImage}
        tenantSlug={activeTenantSlug}
        styles={config.styles}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 2. Breadcrumbs */}
        {config.breadcrumbs?.enabled && (
          <CollectionBreadcrumbs
            items={breadcrumbs}
            separator={config.breadcrumbs.separator}
            tenantSlug={activeTenantSlug}
          />
        )}

        {/* 2.1 Optional Collection Header if enabled AND hero is disabled (prevents duplicate title) */}
        {config.header?.enabled && !config.hero?.enabled && (
          <div
            className={`space-y-1 text-${
              config.header.alignment === 'center'
                ? 'center'
                : config.header.alignment === 'right'
                ? 'right'
                : 'left'
            }`}
          >
            <h1
              className="text-2xl sm:text-3xl font-serif font-bold"
              style={{
                color: config.styles?.headingColor || 'var(--theme-color-heading, #111111)',
                fontFamily: config.styles?.headingFont ? `${config.styles.headingFont}, serif` : undefined,
              }}
            >
              {collectionTitle}
            </h1>
            {config.header.showDescription && collectionDescription && (
              <p
                className="text-xs sm:text-sm font-sans max-w-xl"
                style={{ color: config.styles?.textColor || 'var(--theme-color-text-secondary, #57534E)' }}
              >
                {collectionDescription}
              </p>
            )}
            {config.header.showCount && (
              <span className="text-xs text-[var(--theme-color-text-muted,#777777)] font-medium">
                {filteredProducts.length} Items Available
              </span>
            )}
          </div>
        )}

        {/* 3. Product Toolbar */}
        <CollectionToolbar
          totalCount={filteredProducts.length}
          currentCount={displayedProducts.length}
          activeSort={sortBy}
          onSortChange={handleSortChange}
          onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          sortOptions={config.sorting?.items}
          showViewToggle={config.toolbar?.showViewToggle}
          styles={config.styles}
        />

        {/* 4. Main Catalog Grid & Filter Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          {config.filters?.position !== 'none' && (
            <div
              className={`hidden lg:block lg:col-span-3 ${
                config.filters?.sticky ? 'sticky top-24' : ''
              }`}
            >
              <CollectionFilterSidebar
                filterDefs={config.filters?.items || []}
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                availableCategories={categoriesToUse}
                availableColors={colorsToUse}
                availableSizes={sizesToUse}
                maxPriceLimit={maxProductPrice}
                styles={config.styles}
              />
            </div>
          )}

          {/* Product Grid Area */}
          <div
            className={
              config.filters?.position !== 'none'
                ? 'lg:col-span-9 space-y-8'
                : 'lg:col-span-12 space-y-8'
            }
          >
            {displayedProducts.length === 0 ? (
              <div className="py-24 text-center rounded-2xl bg-[var(--theme-color-surface-secondary,#FAF6F2)] border border-[var(--theme-color-border,#E8DED8)] space-y-4">
                <h3 className="text-base font-serif font-bold text-[var(--theme-color-heading,#111111)]">
                  No creations found matching your filter criteria.
                </h3>
                <p className="text-xs text-[var(--theme-color-text-muted,#777777)] max-w-sm mx-auto">
                  Try adjusting your price range or clearing active color and size selections.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[var(--theme-color-primary,#111111)] hover:bg-[var(--theme-color-accent,#B77A68)] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={displayedProducts}
                  columns={(config.grid?.desktopColumns as 2 | 3 | 4) || 4}
                  gap={config.grid?.gap}
                  tenantSlug={activeTenantSlug}
                />

                {/* Promotional Insert Tile */}
                {config.promo?.enabled &&
                  displayedProducts.length >= (config.promo.insertAfterIndex || 4) && (
                    <div className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#1A1625] text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                      <div className="space-y-1.5 max-w-lg">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                          Atelier Exclusives
                        </span>
                        <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                          {config.promo.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300">
                          {config.promo.subtitle}
                        </p>
                      </div>

                      <Link
                        href={formatTenantHref(config.promo.ctaLink || '/about', activeTenantSlug)}
                        style={{
                          backgroundColor: config.styles?.buttonBackgroundColor || '#C5A880',
                          color: config.styles?.buttonTextColor || '#111111',
                        }}
                        className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md hover:opacity-95"
                      >
                        {config.promo.ctaText}
                      </Link>
                    </div>
                  )}

                {/* Pagination Controls */}
                {(config.pagination?.type === 'load_more' ||
                  config.pagination?.type === 'infinite_scroll') &&
                  visibleCount < filteredProducts.length && (
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() =>
                          setVisibleCount(
                            (prev) => prev + (config.pagination.productsPerPage || 24)
                          )
                        }
                        style={{
                          backgroundColor: config.styles?.buttonBackgroundColor || 'var(--theme-color-primary,#111111)',
                          color: config.styles?.buttonTextColor || '#FFFFFF',
                        }}
                        className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:opacity-90"
                      >
                        Load More Creations ({filteredProducts.length - visibleCount} Remaining)
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. Mobile Filter Drawer */}
      <CollectionFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        availableCategories={categoriesToUse}
        availableColors={colorsToUse}
        availableSizes={sizesToUse}
        maxPriceLimit={maxProductPrice}
      />
    </div>
  );
}

export function CollectionListingPage(props: CollectionListingPageProps) {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-slate-400">Loading Collection...</div>}>
      <CollectionListingPageContent {...props} />
    </Suspense>
  );
}
