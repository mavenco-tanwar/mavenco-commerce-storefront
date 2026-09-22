'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductService } from '@/services/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';

interface TrendingSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customLimit?: number;
  customCtaText?: string;
  customCtaUrl?: string;
  querySource?: string;
  columnsDesktop?: number;
  columnsMobile?: number;
  contentAlign?: 'left' | 'center' | 'right';
  containerWidth?: 'contained' | 'full' | 'full_width';
  paddingTop?: string;
  paddingBottom?: string;
  bgColor?: string;
  textColor?: string;
  // Typography
  headingFontFamily?: string;
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  headingLetterSpacing?: string;
  headingLineHeight?: string;
  headingTextTransform?: string;

  subtitleFontFamily?: string;
  subtitleColor?: string;
  subtitleFontSize?: string;
  subtitleFontWeight?: string;
  subtitleLetterSpacing?: string;
  subtitleLineHeight?: string;

  badgeFontFamily?: string;
  badgeColor?: string;
  badgeBgColor?: string;
  badgeFontSize?: string;
  badgeFontWeight?: string;
  badgeLetterSpacing?: string;
  badgeTextTransform?: string;

  btnFontFamily?: string;
  btnFontSize?: string;
  btnFontWeight?: string;
  btnLetterSpacing?: string;
  btnTextTransform?: string;
  tenantSlug?: string;
}

export function TrendingSection({
  customTitle,
  customSubtitle,
  customBadge,
  customLimit = 8,
  customCtaText = 'Explore All',
  customCtaUrl = '/collections',
  querySource,
  columnsDesktop = 4,
  columnsMobile = 2,
  contentAlign = 'left',
  containerWidth = 'contained',
  paddingTop,
  paddingBottom,
  bgColor,
  textColor,
  headingFontFamily,
  headingColor,
  headingFontSize,
  headingFontWeight,
  headingLetterSpacing,
  headingLineHeight,
  headingTextTransform,
  subtitleFontFamily,
  subtitleColor,
  subtitleFontSize,
  subtitleFontWeight,
  subtitleLetterSpacing,
  subtitleLineHeight,
  badgeFontFamily,
  badgeColor,
  badgeBgColor,
  badgeFontSize,
  badgeFontWeight,
  badgeLetterSpacing,
  badgeTextTransform,
  btnFontFamily,
  btnFontSize,
  btnFontWeight,
  btnLetterSpacing,
  btnTextTransform,
  tenantSlug,
}: TrendingSectionProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'kids'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const currentSlug =
    tenantSlug ||
    (typeof window !== 'undefined'
      ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
        new URLSearchParams(window.location.search).get('tenant') ||
        ''
      : '') ||
    '';

  const title = customTitle || 'Trending Now';
  const subtitle = customSubtitle || 'Styles everyone is talking about this season.';
  const badge = customBadge || 'Featured Catalog';

  const headingStyle: React.CSSProperties = {
    fontFamily: headingFontFamily ? `"${headingFontFamily}", serif` : undefined,
    color: headingColor || textColor || undefined,
    fontSize: headingFontSize || undefined,
    fontWeight: headingFontWeight || undefined,
    letterSpacing: headingLetterSpacing || undefined,
    lineHeight: headingLineHeight || undefined,
    textTransform: (headingTextTransform as any) || undefined,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: subtitleFontFamily ? `"${subtitleFontFamily}", sans-serif` : undefined,
    color: subtitleColor || (textColor ? `${textColor}cc` : undefined),
    fontSize: subtitleFontSize || undefined,
    fontWeight: subtitleFontWeight || undefined,
    letterSpacing: subtitleLetterSpacing || undefined,
    lineHeight: subtitleLineHeight || undefined,
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: badgeFontFamily ? `"${badgeFontFamily}", sans-serif` : undefined,
    color: badgeColor || undefined,
    backgroundColor: badgeBgColor || undefined,
    fontSize: badgeFontSize || undefined,
    fontWeight: badgeFontWeight || undefined,
    letterSpacing: badgeLetterSpacing || undefined,
    textTransform: (badgeTextTransform as any) || undefined,
  };

  const btnStyle: React.CSSProperties = {
    fontFamily: btnFontFamily ? `"${btnFontFamily}", sans-serif` : undefined,
    fontSize: btnFontSize || undefined,
    fontWeight: btnFontWeight || undefined,
    letterSpacing: btnLetterSpacing || undefined,
    textTransform: (btnTextTransform as any) || undefined,
  };

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        let res: { data: Product[] };
        if (querySource === 'best_sellers' || querySource === 'bestseller') {
          res = await ProductService.getBestSellers(customLimit, currentSlug || undefined);
        } else if (querySource === 'new_arrivals' || querySource === 'new') {
          res = await ProductService.getNewArrivals(customLimit, currentSlug || undefined);
        } else {
          res = await ProductService.getTrending(undefined, customLimit, currentSlug || undefined);
        }

        // If specific filtered list has 0 items, fallback to any published products for this store
        if ((!res.data || res.data.length === 0) && currentSlug) {
          const fallbackRes = await ProductService.getProducts({ limit: customLimit, tenant: currentSlug });
          setProducts(fallbackRes.data.products || []);
        } else {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load products for grid', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [customLimit, currentSlug, querySource]);

  const filtered = (products || []).filter((p) => {
    if (!p) return false;
    if (activeTab === 'all') return true;
    return p.department === activeTab || p.category === activeTab;
  });
  const displayedProducts = filtered.length > 0 ? filtered : (products || []);

  if (!isLoading && products.length === 0 && currentSlug && currentSlug !== 'demo') {
    return null;
  }

  const isFullWidth = containerWidth === 'full' || containerWidth === 'full_width';
  const containerClass = isFullWidth ? 'w-full px-4 sm:px-8 md:px-12' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <section
      className="py-16 md:py-24 bg-[#FAF6F2] border-y border-[#E8DED8] select-none transition-colors duration-200"
      style={{
        paddingTop: paddingTop || undefined,
        paddingBottom: paddingBottom || undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className={containerClass}>
        {/* Header strictly following contentAlign */}
        {contentAlign === 'center' ? (
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]" style={badgeStyle}>
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1" style={headingStyle}>
              {title}
            </h2>
            <div className="w-12 h-0.5 bg-[#B77A68] mx-auto my-3" />
            <p className="text-xs sm:text-sm text-[#777777] font-sans" style={subtitleStyle}>
              {subtitle}
            </p>

            {/* Department Filter Tabs Centered */}
            <div className="flex items-center gap-2 mt-6 bg-[#FFFDFC] p-1 border border-[#E8DED8]">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                All Trends
              </button>
              <button
                onClick={() => setActiveTab('women')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'women'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                Women
              </button>
              <button
                onClick={() => setActiveTab('kids')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'kids'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                Kids
              </button>
            </div>
          </div>
        ) : contentAlign === 'right' ? (
          <div className="flex flex-col items-end text-right max-w-2xl ml-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]" style={badgeStyle}>
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1" style={headingStyle}>
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] mt-1 font-sans" style={subtitleStyle}>
              {subtitle}
            </p>

            {/* Department Filter Tabs Right-Aligned */}
            <div className="flex items-center gap-2 mt-4 bg-[#FFFDFC] p-1 border border-[#E8DED8]">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                All Trends
              </button>
              <button
                onClick={() => setActiveTab('women')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'women'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                Women
              </button>
              <button
                onClick={() => setActiveTab('kids')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'kids'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                Kids
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]" style={badgeStyle}>
                {badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1" style={headingStyle}>
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] mt-1 font-sans" style={subtitleStyle}>
                {subtitle}
              </p>
            </div>

            {/* Department Filter Tabs Left/Natural */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-[#FFFDFC] p-1 border border-[#E8DED8]">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                All Trends
              </button>
              <button
                onClick={() => setActiveTab('women')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'women'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                Women
              </button>
              <button
                onClick={() => setActiveTab('kids')}
                className={`text-xs uppercase font-bold tracking-wider px-4 py-2 transition-all cursor-pointer ${
                  activeTab === 'kids'
                    ? 'bg-[#111111] text-[#FFFDFC] shadow-xs'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                Kids
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={displayedProducts.slice(0, customLimit)}
          isLoading={isLoading}
          skeletonCount={customLimit}
          columns={columnsDesktop}
          columnsMobile={columnsMobile}
          tenantSlug={currentSlug}
        />

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link href={formatTenantHref(customCtaUrl, currentSlug)}>
            <Button
              variant="outline"
              size="lg"
              style={btnStyle}
              className="min-w-[200px] group cursor-pointer"
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

