'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

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
  tenantSlug,
}: CategoryShowcaseProps = {}) {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (customCategories && Array.isArray(customCategories) && customCategories.length > 0) {
      return customCategories;
    }
    return [];
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. If explicit custom categories are configured in CMS Visual Studio, prioritize them
    if (customCategories && Array.isArray(customCategories) && customCategories.length > 0) {
      setCategories(customCategories);
      setIsLoaded(true);
      return;
    }

    // 2. Resolve active tenant slug
    const effectiveSlug =
      tenantSlug ||
      (typeof window !== 'undefined'
        ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
          new URLSearchParams(window.location.search).get('tenant') ||
          ''
        : '') ||
      '';

    if (!effectiveSlug) {
      setIsLoaded(true);
      return;
    }

    // 3. Dynamically fetch the store's real categories from MongoDB API
    fetch(`/api/v1/categories?tenant=${encodeURIComponent(effectiveSlug)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: CategoryItem[] = res.data.map((cat: any) => ({
            id: cat.id || cat.slug,
            title: cat.name || cat.title || 'Category',
            tagline: cat.description || cat.tagline || 'Explore Collection',
            imageUrl:
              cat.imageUrl ||
              cat.image ||
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
            href: `/collections?category=${encodeURIComponent(cat.slug || cat.id)}`,
            buttonText: `Explore ${cat.name || 'Category'}`,
            badge: cat.badge || cat.department || 'Curated Department',
          }));
          setCategories(mapped);
        } else if (effectiveSlug === 'demo' || effectiveSlug === 'jq-trends') {
          // Flagship reference store fallback
          setCategories(DEFAULT_CATEGORIES);
        } else {
          // New/custom tenant with 0 categories: hide section completely
          setCategories([]);
        }
      })
      .catch((err) => {
        console.warn('[CategoryShowcase] Failed to load tenant categories:', err);
        if (effectiveSlug === 'demo' || effectiveSlug === 'jq-trends') {
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

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1 mb-3">
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-[#B77A68] mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-[#777777] font-sans">
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat: any, idx) => {
            const itemTitle = cat.title || cat.name || cat.label || `Category ${idx + 1}`;
            const image =
              cat.imageUrl ||
              cat.image ||
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop';
            const tagline = cat.tagline || cat.description || cat.count || 'Explore Collection';
            const href = cat.href || cat.link || '/collections';
            const btnText = cat.buttonText || `Explore ${itemTitle}`;

            return (
              <Link
                key={cat.id || idx}
                href={formatTenantHref(href, tenantSlug)}
                className="group relative aspect-3/4 overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] luxury-card-shadow flex flex-col justify-end p-6"
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
