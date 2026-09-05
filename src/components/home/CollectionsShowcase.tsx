'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, BookOpen, Layers, Eye } from 'lucide-react';
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
  productIds?: string[];
  productCount?: number;
  type?: string;
  productThumbnails?: string[];
}

interface CollectionsShowcaseProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customCollections?: CollectionItem[];
  tenantSlug?: string;
}

const DEFAULT_LOOKBOOKS: CollectionItem[] = [
  {
    id: 'col_resort_2026',
    title: 'Riviera & Resort Edit',
    slug: 'resort-edit',
    description: 'Breezy handcrafted silhouettes, ivory linen weaves, and effortless luxury ensembles designed for sun-drenched escapes.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80',
    productCount: 8,
  },
  {
    id: 'col_festive_2026',
    title: 'Festive Atelier & Heritage Co-Ords',
    slug: 'festive-elegance',
    description: 'Regal jewel-tone brocades, hand-embroidered borders, and modern heritage co-ords tailored for timeless celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80',
    productCount: 12,
  },
  {
    id: 'col_noir_2026',
    title: 'Midnight Noir Silhouettes',
    slug: 'noir-silhouettes',
    description: 'Architectural monochrome tailoring and contemporary evening cuts draped in sculpted satin and delicate organza.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=80',
    productCount: 6,
  },
];

export function CollectionsShowcase({
  customTitle,
  customSubtitle,
  customBadge,
  customCollections,
  tenantSlug,
}: CollectionsShowcaseProps) {
  const [collections, setCollections] = useState<CollectionItem[]>(customCollections || []);
  const [loading, setLoading] = useState<boolean>(!customCollections || customCollections.length === 0);

  useEffect(() => {
    if (customCollections && customCollections.length > 0) {
      setCollections(customCollections);
      setLoading(false);
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
              imageUrl: c.imageUrl || c.bannerImage || c.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80',
              productIds: Array.isArray(c.productIds) ? c.productIds : [],
              productCount: typeof c.productCount === 'number' ? c.productCount : (c.productIds?.length || 0),
              type: c.type || 'manual',
            }));
            setCollections(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('[CollectionsShowcase] Failed to fetch collections:', err);
      }

      if (isMounted) {
        // Use default curated lookbooks if merchant has none configured yet
        setCollections(DEFAULT_LOOKBOOKS);
        setLoading(false);
      }
    };

    fetchCollections();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug, customCollections]);

  const displayCollections = collections.length > 0 ? collections : DEFAULT_LOOKBOOKS;

  return (
    <section className="py-20 bg-slate-900/40 text-slate-100 relative overflow-hidden border-y border-white/5">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{customBadge || 'Catalog Collections & Lookbooks'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              {customTitle || 'Collections & Lookbooks'}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed font-light">
              {customSubtitle ||
                'Curate seasonal edits, attach lookbook products, and organize fashion stories for your boutique.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={formatTenantHref('/collections', tenantSlug)}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-rose-400 hover:text-rose-300 transition-colors group"
            >
              <span>View All Lookbooks</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCollections.map((col, index) => {
            const collectionHref = formatTenantHref(`/collections/${col.slug}`, tenantSlug);
            const count = col.productCount ?? col.productIds?.length ?? 0;

            return (
              <div
                key={col.id || col.slug || index}
                className="group relative flex flex-col bg-slate-800/40 rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/20"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={col.imageUrl || col.bannerImage || col.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80'}
                    alt={col.title || 'Lookbook Collection'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-rose-300 tracking-wider uppercase">
                      <BookOpen className="w-3 h-3" />
                      <span>Lookbook</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-300">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{count > 0 ? `${count} ${count === 1 ? 'Product' : 'Products'}` : 'Curated Edit'}</span>
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors font-serif">
                      {col.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {col.description || 'Curated seasonal assortment of signature boutique garments and coordinated styling.'}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={collectionHref}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-200 group-hover:text-rose-400 transition-colors"
                    >
                      <span>Explore Lookbook</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href={collectionHref}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors"
                      title="View Lookbook"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
