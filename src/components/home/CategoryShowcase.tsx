'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatTenantHref, cleanCategorySlug } from '@/lib/tenant-config';

interface CategoryItem {
  id?: string;
  title?: string;
  name?: string;
  label?: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  href?: string;
  link?: string;
  buttonText?: string;
  badge?: string;
}

interface CategoryShowcaseProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customCategories?: CategoryItem[];
  columnsDesktop?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  contentAlign?: 'left' | 'center' | 'right';
  containerWidth?: 'contained' | 'full' | 'full_width';
  cardBorderRadius?: string;
  aspectRatio?: string;
  paddingTop?: string;
  paddingBottom?: string;
  bgColor?: string;
  textColor?: string;
  tenantSlug?: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'women',
    title: 'Women',
    tagline: 'Fashion-forward styles for every occasion.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    href: '/women',
    buttonText: 'Explore Women',
    badge: 'Bestselling Category',
  },
  {
    id: 'kids',
    title: 'Kids',
    tagline: 'Cute, comfortable and stylish looks.',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
    href: '/kids',
    buttonText: 'Explore Kids',
    badge: 'Organic Fabrics',
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    tagline: 'Fresh styles just added.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    href: '/new-arrivals',
    buttonText: 'Shop New In',
    badge: 'Weekly Drops',
  },
  {
    id: 'sale',
    title: 'Sale',
    tagline: 'Your favorite styles at special prices.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
    href: '/sale',
    buttonText: 'Shop Sale',
    badge: 'Up to 50% Off',
  },
];

export function CategoryShowcase({
  customTitle,
  customSubtitle,
  customBadge,
  customCategories,
  columnsDesktop = 4,
  columnsMobile = 1,
  contentAlign = 'center',
  containerWidth = 'contained',
  cardBorderRadius,
  aspectRatio,
  paddingTop,
  paddingBottom,
  bgColor,
  textColor,
  tenantSlug,
}: CategoryShowcaseProps = {}) {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (customCategories && Array.isArray(customCategories) && customCategories.length > 0) {
      const depts = customCategories.filter(
        (cat: any) => !cat.parentId || cat.parentId === '' || cat.parentId === 'none' || cat.parentId === null
      );
      return depts.length > 0 ? depts : customCategories;
    }
    return [];
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. If explicit custom categories are configured in CMS Visual Studio, prioritize them
    if (customCategories && Array.isArray(customCategories) && customCategories.length > 0) {
      const depts = customCategories.filter(
        (cat: any) => !cat.parentId || cat.parentId === '' || cat.parentId === 'none' || cat.parentId === null
      );
      setCategories(depts.length > 0 ? depts : customCategories);
      setIsLoaded(true);
      return;
    }

    // 2. Resolve active tenant slug
    const currentSlug =
      tenantSlug ||
      (typeof window !== 'undefined'
        ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
          new URLSearchParams(window.location.search).get('tenant') ||
          ''
        : '') ||
      '';

    // 3. Fallback: Fetch categories from API
    fetch(`/api/v1/categories?tenant=${encodeURIComponent(currentSlug || 'demo')}&limit=12`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          const rootCats = json.data.filter(
            (c: any) => !c.parentId || c.parentId === '' || c.parentId === 'none' || c.parentId === null
          );
          setCategories(rootCats.length > 0 ? rootCats : json.data);
        } else if (!currentSlug || currentSlug === 'demo') {
          setCategories(DEFAULT_CATEGORIES);
        } else {
          setCategories([]);
        }
      })
      .catch(() => {
        if (!currentSlug || currentSlug === 'demo') {
          setCategories(DEFAULT_CATEGORIES);
        } else {
          setCategories([]);
        }
      })
      .finally(() => setIsLoaded(true));
  }, [customCategories, tenantSlug]);

  // If no categories exist for this tenant, hide the section completely
  if (categories.length === 0) {
    return null;
  }

  const title = customTitle || 'Shop By Department';
  const subtitle =
    customSubtitle ||
    'Explore our meticulously curated departments tailored for everyday luxury.';
  const badge = customBadge || 'Curated Fashion Universes';

  const isFullWidth = containerWidth === 'full' || containerWidth === 'full_width';
  const containerClass = isFullWidth ? 'w-full px-4 sm:px-8 md:px-12' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const headerAlignClass =
    contentAlign === 'left'
      ? 'text-left max-w-2xl mb-12'
      : contentAlign === 'right'
      ? 'text-right max-w-2xl ml-auto mb-12'
      : 'text-center max-w-2xl mx-auto mb-12';

  const dCols = Math.min(Math.max(columnsDesktop, 1), 6);
  const gridColsClass =
    dCols === 1
      ? 'grid-cols-1'
      : dCols === 2
      ? 'sm:grid-cols-2'
      : dCols === 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : dCols === 5
      ? 'sm:grid-cols-2 lg:grid-cols-5'
      : dCols === 6
      ? 'sm:grid-cols-2 lg:grid-cols-6'
      : 'sm:grid-cols-2 lg:grid-cols-4';
  const mobColsClass = columnsMobile === 2 ? 'grid-cols-2' : 'grid-cols-1';

  const aspectClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : 'aspect-3/4';

  const customBorderRadiusStyle = cardBorderRadius ? { borderRadius: cardBorderRadius } : undefined;

  return (
    <section
      className="py-16 md:py-24 bg-[#FFFDFC] select-none transition-colors duration-200"
      style={{
        paddingTop: paddingTop || undefined,
        paddingBottom: paddingBottom || undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className={containerClass}>
        {/* Section Header */}
        <div className={headerAlignClass}>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1 mb-3" style={{ color: textColor || undefined }}>
            {title}
          </h2>
          {contentAlign === 'center' && <div className="w-12 h-0.5 bg-[#B77A68] mx-auto mb-3" />}
          <p className="text-xs sm:text-sm text-[#777777] font-sans" style={{ color: textColor ? `${textColor}cc` : undefined }}>
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className={`grid ${mobColsClass} ${gridColsClass} gap-6`}>
          {categories.map((cat: any, idx) => {
            const itemTitle = cat.title || cat.name || cat.label || `Category ${idx + 1}`;
            const image =
              cat.imageUrl ||
              cat.image ||
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop';
            const tagline = cat.tagline || cat.description || cat.count || 'Explore Collection';
            let href = cat.href || cat.link || '/collections';
            if (href.includes('?category=')) {
              const matchCat = href.match(/[?&]category=([^&#]+)/);
              if (matchCat && matchCat[1]) {
                href = `/${cleanCategorySlug(decodeURIComponent(matchCat[1]))}`;
              }
            }
            const btnText = cat.buttonText || `Explore ${itemTitle}`;

            return (
              <Link
                key={cat.id || idx}
                href={formatTenantHref(href, tenantSlug)}
                style={customBorderRadiusStyle}
                className={`group relative ${aspectClass} overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] luxury-card-shadow flex flex-col justify-end p-6`}
              >
                {/* Background Image */}
                <Image
                  src={image}
                  alt={itemTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white space-y-1.5 transform transition-transform duration-300 group-hover:-translate-y-1">
                  {cat.badge && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#E8B8B5] bg-black/40 px-2 py-0.5 border border-[#B77A68]/40 mb-1">
                      {cat.badge}
                    </span>
                  )}

                  <h3 className="text-2xl font-serif font-bold tracking-tight text-white">
                    {itemTitle}
                  </h3>

                  <p className="text-xs text-[#E8DED8] line-clamp-2 font-sans font-normal">
                    {tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] group-hover:text-[#E8B8B5] transition-colors">
                    <span>{btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
