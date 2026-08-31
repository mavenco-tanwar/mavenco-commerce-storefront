'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductService } from '@/services/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';

interface TrendingSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customLimit?: number;
  customCtaText?: string;
  customCtaUrl?: string;
}

export function TrendingSection({
  customTitle,
  customSubtitle,
  customBadge,
  customLimit = 8,
  customCtaText = 'Explore All Trending',
  customCtaUrl = '/women',
}: TrendingSectionProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'kids'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const title = customTitle || 'Trending Now';
  const subtitle = customSubtitle || 'Styles everyone is talking about this season.';
  const badge = customBadge || 'Most Coveted Silhouettes';

  useEffect(() => {
    async function loadTrending() {
      setIsLoading(true);
      try {
        const res = await ProductService.getTrending();
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load trending products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrending();
  }, []);

  const filtered = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.department === activeTab;
  });
  const displayedProducts = filtered.length > 0 ? filtered : products;

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F2] border-y border-[#E8DED8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Department Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] mt-1 font-sans">
              {subtitle}
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#FFFDFC] p-1 border border-[#E8DED8]">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all ${
                activeTab === 'all'
                  ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              All Trends
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all ${
                activeTab === 'women'
                  ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => setActiveTab('kids')}
              className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all ${
                activeTab === 'kids'
                  ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Kids
            </button>
          </div>
        </div>

        {/* 4-column Product Grid */}
        <ProductGrid
          products={displayedProducts.slice(0, customLimit)}
          isLoading={isLoading}
          skeletonCount={customLimit}
          columns={4}
        />

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link href={customCtaUrl}>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px] group"
            >
              <span>{customCtaText}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
