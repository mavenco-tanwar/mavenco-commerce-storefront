'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductService } from '@/services/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { formatTenantHref } from '@/lib/tenant-config';

interface BestSellersSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customLimit?: number;
  customCtaText?: string;
  customCtaUrl?: string;
  tenantSlug?: string;
}

export function BestSellersSection({
  customTitle,
  customSubtitle,
  customBadge,
  customLimit = 4,
  customCtaText = 'View All Best Sellers',
  customCtaUrl = '/women?sort=popular',
  tenantSlug,
}: BestSellersSectionProps = {}) {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentSlug =
    tenantSlug ||
    (typeof window !== 'undefined'
      ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
        new URLSearchParams(window.location.search).get('tenant') ||
        ''
      : '') ||
    '';

  const title = customTitle || 'Our Best Sellers';
  const subtitle = customSubtitle || 'The iconic styles our community can\'t get enough of.';
  const badge = customBadge || 'Customer Favorites • High Demand';

  useEffect(() => {
    async function loadBestSellers() {
      try {
        const res = await ProductService.getBestSellers(customLimit, currentSlug || undefined);
        setBestSellers(res.data);
      } catch (err) {
        console.error('Failed to load best sellers', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBestSellers();
  }, [customLimit, currentSlug]);

  if (!isLoading && bestSellers.length === 0 && currentSlug && currentSlug !== 'demo') {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F2] border-b border-[#E8DED8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#C98282] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              {title}
            </h2>
            <p className="text-sm text-[#777777] font-sans mt-1">
              {subtitle}
            </p>
          </div>

          <Link
            href={formatTenantHref(customCtaUrl, currentSlug)}
            className="text-xs uppercase font-bold tracking-widest text-[#111111] hover:text-[#B77A68] flex items-center gap-1.5 transition-colors group"
          >
            <span>{customCtaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid
          products={bestSellers}
          isLoading={isLoading}
          skeletonCount={customLimit}
          columns={4}
        />
      </div>
    </section>
  );
}
