'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { ProductService } from '@/services/products';
import { Product } from '@/types/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { formatTenantHref, formatProductHref, resolveTenant, resolveActiveTenantSlug } from '@/lib/tenant-config';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug?: string;
}

const POPULAR_SEARCHES = [
  { label: 'Floral Dresses', query: 'dress' },
  { label: 'Chanderi Kurti Sets', query: 'kurti' },
  { label: 'Linen Co-ords', query: 'linen' },
  { label: 'Girls Frocks', query: 'girls' },
  { label: 'Boys Nehru Jackets', query: 'boys' },
  { label: 'Rose Gold Bags', query: 'bag' },
];

export function SearchOverlay({ isOpen, onClose, tenantSlug: propTenantSlug }: SearchOverlayProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);
  const activeTenant = resolveTenant(activeTenantSlug);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await ProductService.search(query, 8, activeTenant.slug);
        setResults(res.data);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative bg-[#FFFDFC] border-b border-[#E8DED8] shadow-2xl z-10 animate-in slide-in-from-top duration-300 max-h-[85vh] flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DED8]">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B77A68]">
              Search Store Catalog
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F8F1EA] transition-colors flex items-center gap-1 text-xs"
            >
              <span className="hidden sm:inline">ESC</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center mt-4">
            <Search className="absolute left-4 w-6 h-6 text-[#777777]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, category, fabric, style (e.g. linen dress, kurti, kids frock)..."
              className="w-full pl-14 pr-12 py-4 bg-[#F8F1EA]/60 border border-[#E8DED8] text-base md:text-lg text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#B77A68] focus:bg-[#FFFDFC] transition-all font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body Content: Results or Suggestions */}
          <div className="mt-6 overflow-y-auto max-h-[50vh] pr-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#777777]">
                <Loader2 className="w-6 h-6 animate-spin text-[#B77A68] mb-2" />
                <span className="text-xs tracking-wider">Searching fashion collection...</span>
              </div>
            ) : query.trim() && results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
                    Found {results.length} styles
                  </span>
                  <Link
                    href={formatTenantHref(`/women?search=${encodeURIComponent(query)}`)}
                    onClick={onClose}
                    className="text-xs font-bold text-[#B77A68] hover:underline flex items-center gap-1"
                  >
                    View all results <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={formatProductHref(product.slug, product.category, activeTenant.slug)}
                      onClick={onClose}
                      className="group flex flex-col bg-[#FAF6F2] border border-[#E8DED8] p-2 hover:border-[#B77A68] transition-all"
                    >
                      <div className="relative aspect-3/4 w-full overflow-hidden bg-white mb-2">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="200px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-[#B77A68] uppercase font-bold tracking-wider">
                        {product.categoryName}
                      </span>
                      <h4 className="text-xs font-semibold text-[#111111] line-clamp-1 group-hover:text-[#B77A68] transition-colors mt-0.5">
                        {product.name}
                      </h4>
                      <div className="mt-1">
                        <PriceDisplay
                          price={product.price}
                          compareAtPrice={product.compareAtPrice}
                          size="sm"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : query.trim() && results.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm font-medium text-[#111111] mb-1">
                  No styles found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[#777777]">
                  Try searching for popular terms like &ldquo;Dresses&rdquo;, &ldquo;Kurtis&rdquo;, or &ldquo;Linen&rdquo;.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#777777]">
                  <TrendingUp className="w-4 h-4 text-[#B77A68]" />
                  <span>Popular Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(item.query)}
                      className="text-xs bg-[#F8F1EA] hover:bg-[#EFE4D9] text-[#111111] px-3 py-1.5 border border-[#E8DED8] transition-colors rounded-none font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-[#E8DED8] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <Link
                    href={formatTenantHref('/women')}
                    onClick={onClose}
                    className="p-3 bg-[#FAF6F2] hover:bg-[#F8F1EA] border border-[#E8DED8] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Shop Women
                    </span>
                    <span className="text-[11px] text-[#777777]">Dresses, Kurtis, Co-ords</span>
                  </Link>

                  <Link
                    href={formatTenantHref('/kids')}
                    onClick={onClose}
                    className="p-3 bg-[#FAF6F2] hover:bg-[#F8F1EA] border border-[#E8DED8] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Shop Kids
                    </span>
                    <span className="text-[11px] text-[#777777]">Girls & Boys Fashion</span>
                  </Link>

                  <Link
                    href={formatTenantHref('/new-arrivals')}
                    onClick={onClose}
                    className="p-3 bg-[#FAF6F2] hover:bg-[#F8F1EA] border border-[#E8DED8] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                      New In Studio
                    </span>
                    <span className="text-[11px] text-[#777777]">Fresh Season Drops</span>
                  </Link>

                  <Link
                    href={formatTenantHref('/sale')}
                    onClick={onClose}
                    className="p-3 bg-[#FAF6F2] hover:bg-[#F8F1EA] border border-[#E8DED8] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#C98282] uppercase tracking-wider">
                      Special Sale
                    </span>
                    <span className="text-[11px] text-[#777777]">Up to 40% Off</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
