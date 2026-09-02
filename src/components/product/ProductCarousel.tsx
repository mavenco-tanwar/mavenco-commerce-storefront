'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ProductCardConfig } from '@/types/product-card.types';

export interface ProductCarouselProps {
  products: Product[];
  config?: Partial<ProductCardConfig>;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ProductCarousel({
  products,
  config,
  title,
  subtitle,
  className = '',
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className={`space-y-4 select-none ${className}`}>
      {/* Header with Navigation Controls */}
      {(title || subtitle) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
              aria-label="Next Products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Smooth Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[260px] sm:w-[280px] shrink-0 flex flex-col">
            <ProductCard product={product} config={config} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
