'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

export interface CollectionItem {
  id: string;
  title?: string;
  name?: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerImage?: string;
  image?: string;
  productImage?: string;
  assignedProductImages?: string[];
  productIds?: string[];
  productCount?: number;
  type?: string;
}

interface CollectionsShowcaseProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customCtaText?: string;
  customCtaUrl?: string;
  customBannerImage?: string;
  customCollections?: CollectionItem[];
  tenantSlug?: string;
}

const DEFAULT_DEMO_LOOKBOOKS: CollectionItem[] = [
  {
    id: 'col_festive',
    title: 'Festive Atelier & Heritage Co-Ords',
    slug: 'festive-elegance',
    description: 'Regal jewel-tone brocades, hand-embroidered borders, and modern heritage co-ords tailored for timeless celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80',
    productCount: 8,
  },
  {
    id: 'col_resort',
    title: 'Riviera & Resort Edit',
    slug: 'resort-edit',
    description: 'Breezy handcrafted silhouettes, ivory linen weaves, and effortless luxury ensembles designed for sun-drenched escapes.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80',
    productCount: 6,
  },
  {
    id: 'col_noir',
    title: 'Midnight Noir Silhouettes',
    slug: 'noir-silhouettes',
    description: 'Architectural monochrome tailoring and contemporary evening cuts draped in sculpted satin.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=80',
    productCount: 4,
  },
];

export function CollectionsShowcase({
  customTitle,
  customSubtitle,
  customBadge,
  customCtaText,
  customCtaUrl,
  customBannerImage,
  customCollections,
  tenantSlug,
}: CollectionsShowcaseProps) {
  const [collections, setCollections] = useState<CollectionItem[]>(customCollections || []);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (customCollections && customCollections.length > 0) {
      setCollections(customCollections);
      setIsLoaded(true);
      return;
    }

    let isMounted = true;
    const currentSlug =
      tenantSlug ||
      (typeof window !== 'undefined'
        ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
          new URLSearchParams(window.location.search).get('tenant') ||
          ''
        : '') ||
      '';

    const fetchCollections = async () => {
      try {
        const query = currentSlug ? `?tenant=${encodeURIComponent(currentSlug)}` : '';
        const res = await fetch(`/api/v1/collections${query}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const items: any[] = json?.data || [];
          if (isMounted && Array.isArray(items) && items.length > 0) {
            const mapped = items.map((c: any) => ({
              id: c.id || c._id,
              title: c.title || c.name || 'Collection',
              slug: c.slug || c.id,
              description: c.description || '',
              imageUrl: (Array.isArray(c.assignedProductImages) && c.assignedProductImages[0]) || c.productImage || c.imageUrl || c.bannerImage || c.image || '',
              assignedProductImages: Array.isArray(c.assignedProductImages) && c.assignedProductImages.length > 0 ? c.assignedProductImages : (c.productImage ? [c.productImage] : (c.imageUrl ? [c.imageUrl] : [])),
              productIds: Array.isArray(c.productIds) ? c.productIds : [],
              productCount: typeof c.productCount === 'number' ? c.productCount : (c.productIds?.length || 0),
              type: c.type || 'manual',
            }));
            setCollections(mapped);
            setIsLoaded(true);
            return;
          }
        }
      } catch (err) {
        console.warn('[CollectionsShowcase] Failed to fetch collections:', err);
      }

      if (isMounted) {
        // Only use demo lookbooks if on demo or jq-trends store, or if customBannerImage is provided
        if (!currentSlug || currentSlug === 'demo' || currentSlug === 'jq-trends' || customBannerImage) {
          if (customBannerImage) {
            setCollections([
              {
                id: 'col_page_builder',
                title: customTitle || 'The Modern Capsule Lookbook',
                slug: 'capsule-lookbook',
                description: customSubtitle || 'A photographic journey into minimalist tailoring, organic textures, and intentional living.',
                imageUrl: customBannerImage,
                productCount: 4,
              },
            ]);
          } else {
            setCollections(DEFAULT_DEMO_LOOKBOOKS);
          }
        } else {
          setCollections([]);
        }
        setIsLoaded(true);
      }
    };

    fetchCollections();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug, customCollections, customBannerImage, customTitle, customSubtitle]);

  // If no collections exist for this store and not demo, don't show empty block
  if (isLoaded && collections.length === 0) {
    return null;
  }

  const title = customTitle || 'Collections & Lookbooks';
  const subtitle =
    customSubtitle ||
    'Curate seasonal edits, attach lookbook products, and organize fashion stories for your boutique.';
  const badge = customBadge || 'Curated Atelier Stories';

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F2] dark:bg-[#12100E] border-t border-[#E8DED8] dark:border-white/10 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-white mt-1.5 mb-3 tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-[#B77A68] mx-auto mb-3.5" />
          <p className="text-xs sm:text-sm text-[#777777] dark:text-slate-400 font-sans leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 1 ITEM: Full-Width Editorial Split Feature */}
        {collections.length === 1 && (
          <div className="max-w-5xl mx-auto bg-[#FFFDFC] dark:bg-[#1A1816] border border-[#E8DED8] dark:border-white/10 overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Image Column */}
              <div className="md:col-span-6 relative min-h-[380px] md:min-h-[480px] bg-[#F5EFEA] dark:bg-black/40 overflow-hidden group">
                <Image
                  src={
                    collections[0].imageUrl ||
                    customBannerImage ||
                    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=80'
                  }
                  alt={collections[0].title || 'Lookbook Collection'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#111111]/85 text-white backdrop-blur-md text-[10px] font-bold tracking-widest uppercase">
                    <BookOpen className="w-3 h-3" />
                    <span>{collections[0].type === 'automated' ? 'Automated' : 'Lookbook'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFDFC]/90 dark:bg-black/80 text-[#111111] dark:text-white border border-[#E8DED8] dark:border-white/10 text-[10px] font-medium">
                    <Layers className="w-3 h-3 text-[#B77A68]" />
                    <span>
                      {collections[0].productCount && collections[0].productCount > 0
                        ? `${collections[0].productCount} ${collections[0].productCount === 1 ? 'Product' : 'Products'}`
                        : 'Curated Edit'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="md:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                <div className="space-y-4">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#B77A68]">
                    Featured Collection
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-white leading-tight">
                    {collections[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#777777] dark:text-slate-400 font-sans leading-relaxed">
                    {collections[0].description ||
                      'Discover our curated seasonal assortment of bespoke luxury garments crafted for timeless elegance.'}
                  </p>

                  {/* Assigned Products Thumbnails */}
                  {collections[0].assignedProductImages && collections[0].assignedProductImages.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
                        Assigned Items ({collections[0].productCount || collections[0].assignedProductImages.length})
                      </span>
                      <div className="flex items-center gap-2">
                        {collections[0].assignedProductImages.slice(0, 5).map((thumb, tIdx) => (
                          <div
                            key={tIdx}
                            className="relative w-12 h-12 rounded border border-[#E8DED8] dark:border-white/10 overflow-hidden bg-[#F5EFEA]"
                          >
                            <Image src={thumb} alt="Assigned Item" fill sizes="48px" className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 mt-8 border-t border-[#E8DED8] dark:border-white/10 flex flex-wrap items-center gap-4">
                  <Link
                    href={formatTenantHref(
                      customCtaUrl || `/collections/${collections[0].slug}`,
                      tenantSlug
                    )}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111111] text-white hover:bg-[#B77A68] transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    <span>{customCtaText || 'Explore Lookbook Collection'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={formatTenantHref('/collections', tenantSlug)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#777777] hover:text-[#111111] dark:hover:text-white transition-colors"
                  >
                    <span>View All Collections</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2 OR MORE ITEMS: Responsive Luxury Cards Grid */}
        {collections.length > 1 && (
          <div
            className={`grid grid-cols-1 ${
              collections.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'
            } gap-8`}
          >
            {collections.map((col, index) => {
              const collectionHref = formatTenantHref(`/collections/${col.slug}`, tenantSlug);
              const count = col.productCount ?? col.productIds?.length ?? 0;

              return (
                <div
                  key={col.id || col.slug || index}
                  className="group flex flex-col bg-[#FFFDFC] dark:bg-[#1A1816] border border-[#E8DED8] dark:border-white/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Media */}
                  <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden bg-[#FAF6F2] dark:bg-black/30">
                    <Image
                      src={
                        col.imageUrl ||
                        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80'
                      }
                      alt={col.title || 'Lookbook Collection'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#111111]/85 text-white backdrop-blur-md text-[10px] font-bold tracking-widest uppercase">
                        <BookOpen className="w-3 h-3" />
                        <span>{col.type === 'automated' ? 'Automated' : 'Manual'}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFDFC]/90 dark:bg-black/80 text-[#111111] dark:text-white border border-[#E8DED8] dark:border-white/10 text-[10px] font-medium">
                        <Layers className="w-3 h-3 text-[#B77A68]" />
                        <span>{count > 0 ? `${count} ${count === 1 ? 'Product' : 'Products'}` : 'Curated Edit'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-[#111111] dark:text-white group-hover:text-[#B77A68] transition-colors leading-snug">
                        {col.title}
                      </h3>
                      <p className="text-xs text-[#777777] dark:text-slate-400 font-sans line-clamp-2 leading-relaxed">
                        {col.description || 'No collection description provided.'}
                      </p>

                      {/* Assigned Items Thumbnails Preview */}
                      {col.assignedProductImages && col.assignedProductImages.length > 0 && (
                        <div className="pt-3 mt-2 border-t border-[#E8DED8]/60 dark:border-white/5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
                            Assigned Items ({count})
                          </span>
                          <div className="flex items-center gap-2">
                            {col.assignedProductImages.slice(0, 4).map((thumb, tIdx) => (
                              <div
                                key={tIdx}
                                className="relative w-10 h-10 rounded border border-[#E8DED8] dark:border-white/10 overflow-hidden bg-[#FAF6F2] shadow-xs"
                              >
                                <Image
                                  src={thumb}
                                  alt="Assigned Product"
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#E8DED8] dark:border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-[#999999] font-mono">
                        /{col.slug}
                      </span>
                      <Link
                        href={collectionHref}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#111111] dark:text-white group-hover:text-[#B77A68] transition-colors"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA for Multi-Collection Catalogs */}
        {collections.length > 1 && (
          <div className="mt-12 text-center">
            <Link
              href={formatTenantHref('/collections', tenantSlug)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#111111] dark:text-white hover:text-[#B77A68] transition-colors"
            >
              <span>View All Collections &amp; Lookbooks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
