'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search as SearchIcon,
  Sliders,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  Sparkles,
  X,
  Check,
  CheckCircle2,
  Tag,
  Eye,
  Star,
  Layers,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { formatTenantHref, formatProductHref } from '@/lib/tenant-config';
import { SearchProductHit, SearchFacet } from '@/types/search-commerce.types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [products, setProducts] = useState<SearchProductHit[]>([]);
  const [facets, setFacets] = useState<SearchFacet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('relevance');

  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      let url = `/api/v1/search?tenant=lumina&q=${encodeURIComponent(searchTerm)}&sort=${sort}`;
      if (selectedCategory !== 'all') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (inStockOnly) url += `&inStock=true`;

      if (selectedPriceRange === '0-1000') url += `&minPrice=0&maxPrice=1000`;
      else if (selectedPriceRange === '1000-2000') url += `&minPrice=1000&maxPrice=2000`;
      else if (selectedPriceRange === '2000-99999') url += `&minPrice=2000`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.redirectUrl) {
        router.push(json.redirectUrl);
        return;
      }

      if (json.success) {
        setProducts(json.products || []);
        setFacets(json.facets || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveQuery(initialQuery);
    setQuery(initialQuery);
    performSearch(initialQuery);
  }, [initialQuery, selectedCategory, selectedPriceRange, inStockOnly, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleQuickAdd = async (hit: SearchProductHit) => {
    const mockProduct: any = {
      id: hit.id,
      name: hit.name,
      slug: hit.slug,
      price: hit.price,
      images: hit.images,
      sku: hit.sku,
    };
    await addItem(mockProduct, 'Rose', 'M', 1);
    showToast(`Added ${hit.name} to your shopping bag!`, 'success');
  };

  return (
    <div className="bg-[#FFFDFC] py-8 sm:py-12 select-none min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Search Discovery' }]} className="mb-2" />

        {/* 1. SEARCH HERO HEADER */}
        <div className="p-6 sm:p-8 bg-[#FAF7F5] border border-[#EFE8E2] rounded-3xl space-y-4 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search silk gowns, linen blazers, festive co-ords..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-[#EFE8E2] text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:border-rose-400 shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {activeQuery && (
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                Results for <strong className="text-slate-900">&quot;{activeQuery}&quot;</strong> — {products.length} garments discovered
              </span>
            </div>
          )}
        </div>

        {/* 2. MAIN 2-COLUMN SEARCH LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Facets Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-6 bg-[#FAF7F5] border border-[#EFE8E2] p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-rose-600" />
                <span>Filter Discovery</span>
              </h3>
              {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || inStockOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPriceRange('all');
                    setInStockOnly(false);
                  }}
                  className="text-[11px] text-rose-600 font-bold hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Facet */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Garment Category</h4>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-slate-950 text-white font-bold'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {facets
                  .find((f) => f.id === 'category')
                  ?.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedCategory(opt.value)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex justify-between ${
                        selectedCategory === opt.value
                          ? 'bg-slate-950 text-white font-bold'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-[10px] opacity-70 font-mono">({opt.count})</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Price Range Facet */}
            <div className="space-y-2 pt-3 border-t border-[#EFE8E2]">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Price Range</h4>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex justify-between ${
                    selectedPriceRange === 'all'
                      ? 'bg-slate-950 text-white font-bold'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>All Prices</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange('0-1000')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex justify-between ${
                    selectedPriceRange === '0-1000'
                      ? 'bg-slate-950 text-white font-bold'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>Under $1,000</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange('1000-2000')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex justify-between ${
                    selectedPriceRange === '1000-2000'
                      ? 'bg-slate-950 text-white font-bold'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>$1,000 - $2,000</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange('2000-99999')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex justify-between ${
                    selectedPriceRange === '2000-99999'
                      ? 'bg-slate-950 text-white font-bold'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>Above $2,000</span>
                </button>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-3 border-t border-[#EFE8E2] flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">In-Stock Only</span>
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                  inStockOnly ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    inStockOnly ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Results Product Grid (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            {/* Sort Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
              <span className="text-xs text-slate-500 font-medium">
                Showing <strong>{products.length}</strong> luxury garments
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#EFE8E2] text-slate-900 font-bold focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="py-20 text-center text-slate-400">Discovering matching luxury garments...</div>
            ) : products.length === 0 ? (
              <div className="p-12 bg-[#FAF7F5] border border-[#EFE8E2] rounded-3xl text-center space-y-4">
                <Sparkles className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-slate-900">No Direct Matches Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We couldn&apos;t find any garments matching &quot;{activeQuery}&quot;. Try checking your spelling or explore our trending collections.
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                  {['Floral Dress', 'Linen Blazer', 'Evening Gowns', 'Silk Co-ords'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setQuery(t);
                        router.push(`/search?q=${encodeURIComponent(t)}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EFE8E2] text-xs font-bold text-slate-800 hover:border-rose-400 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => {
                  const isWish = isInWishlist(p.id);
                  return (
                    <div
                      key={p.id}
                      className="group bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-3/4 bg-slate-200 overflow-hidden">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                        )}

                        {p.isPinned && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-600 text-white shadow-md">
                            Featured Match
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            toggleWishlist({
                              id: p.id,
                              name: p.name,
                              slug: p.slug,
                              price: p.price,
                              images: p.images,
                              sku: p.sku,
                            } as any);
                            showToast(isWish ? 'Removed from Wishlist' : 'Saved to Wishlist!', 'info');
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors cursor-pointer ${
                            isWish ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-slate-700 hover:text-rose-600'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Info & Actions */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                            {p.category}
                          </span>
                          <Link href={formatProductHref(p.slug || p.id, p.category)}>
                            <h4 className="text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors line-clamp-1">
                              {p.name}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-slate-900">${p.price.toLocaleString()}</span>
                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                              <span className="text-xs text-slate-400 line-through font-mono">
                                ${p.compareAtPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(p)}
                          className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
