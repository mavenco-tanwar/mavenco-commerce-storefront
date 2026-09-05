'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product } from '@/types/product';
import { CollectionPageConfig } from '@/types/collection-page.types';
import { getDefaultCollectionPageConfig } from '@/lib/collection-page-presets';
import { CollectionHero } from './CollectionHero';
import { CollectionBreadcrumbs } from './CollectionBreadcrumbs';
import { CollectionToolbar } from './CollectionToolbar';
import { CollectionFilterSidebar, FilterState } from './CollectionFilterSidebar';
import { CollectionFilterDrawer } from './CollectionFilterDrawer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { resolveTenant, resolveActiveTenantSlug } from '@/lib/tenant-config';

export interface CollectionListingPageProps {
  initialProducts: Product[];
  collectionTitle?: string;
  collectionDescription?: string;
  collectionBannerImage?: string;
  templateOverride?: Partial<CollectionPageConfig>;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  availableCategories?: Array<{ slug: string; name: string }>;
  tenantSlug?: string;
}

function CollectionListingPageContent({
  initialProducts,
  collectionTitle = 'All Collections',
  collectionDescription,
  collectionBannerImage,
  templateOverride,
  breadcrumbs = [{ label: 'Collections', href: '/collections' }],
  availableCategories,
  tenantSlug: propTenantSlug,
}: CollectionListingPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);
  const activeTenant = resolveTenant(activeTenantSlug);

  // Load Base Configuration
  const [config, setConfig] = useState<CollectionPageConfig>(() => ({
    ...getDefaultCollectionPageConfig(activeTenant.slug || 'demo'),
    ...(templateOverride || {}),
  }));

  // Fetch Live Published Configuration from API
  useEffect(() => {
    async function loadTemplate() {
      try {
        const slug = activeTenant.slug || 'demo';
        const res = await fetch(`/api/v1/content/collection-page?tenant=${slug}&template=default_fashion`);
        const json = await res.json();
        if (json.success && json.data) {
          setConfig((prev) => ({
            ...prev,
            ...json.data,
            ...(templateOverride || {}),
          }));
        }
      } catch (err) {
        console.warn('Failed to load published PLP template, using fallback config:', err);
      }
    }
    loadTemplate();
  }, [activeTenant.slug, templateOverride]);

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
    let result = [...initialProducts];

    if (filterState.category !== 'all') {
      const target = filterState.category.toLowerCase().trim();
      result = result.filter((p) => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pDept = (p.department || '').toLowerCase().trim();
        const pSlug = ((p as any).categorySlug || '').toLowerCase().trim();
        const pName = (p.categoryName || '').toLowerCase().trim();
        const inIds = Array.isArray(p.categoryIds) && p.categoryIds.some((id: string) => {
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
    <div className="min-h-screen bg-[#FFFDFC] text-slate-900 pb-20 space-y-8">
      {/* 1. Hero Section */}
      <CollectionHero
        config={config.hero}
        titleOverride={collectionTitle}
        descriptionOverride={collectionDescription}
        imageOverride={collectionBannerImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 2. Breadcrumbs */}
        {config.breadcrumbs.enabled && (
          <CollectionBreadcrumbs
            items={breadcrumbs}
            separator={config.breadcrumbs.separator}
          />
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
          sortOptions={config.sorting.items}
          showViewToggle={config.toolbar.showViewToggle}
        />

        {/* 4. Main Catalog Grid & Filter Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          {config.filters.position !== 'none' && (
            <div className={`hidden lg:block lg:col-span-3 ${config.filters.sticky ? 'sticky top-24' : ''}`}>
              <CollectionFilterSidebar
                filterDefs={config.filters.items}
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                availableCategories={categoriesToUse}
                availableColors={colorsToUse}
                availableSizes={sizesToUse}
                maxPriceLimit={maxProductPrice}
              />
            </div>
          )}

          {/* Product Grid Area */}
          <div className={config.filters.position !== 'none' ? 'lg:col-span-9 space-y-8' : 'lg:col-span-12 space-y-8'}>
            {displayedProducts.length === 0 ? (
              <div className="py-24 text-center rounded-2xl bg-[#FAF6F2] border border-[#E8DED8] space-y-4">
                <h3 className="text-base font-serif font-bold text-slate-900">No creations found matching your filter criteria.</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price range or clearing active color and size selections.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={displayedProducts}
                  columns={config.grid.desktopColumns as any || 4}
                />

                {/* Promotional Insert Tile */}
                {config.promo.enabled && displayedProducts.length >= (config.promo.insertAfterIndex || 4) && (
                  <div className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
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

                    <a
                      href={config.promo.ctaLink || '/about'}
                      className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md"
                    >
                      {config.promo.ctaText}
                    </a>
                  </div>
                )}

                {/* Pagination Controls */}
                {config.pagination.type === 'load_more' && visibleCount < filteredProducts.length && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + (config.pagination.productsPerPage || 24))}
                      className="px-8 py-3 rounded-xl bg-slate-950 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md"
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
