import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

interface WomensCategoryItem {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
}

interface WomensEditorialProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customImage?: string;
  customCtaText?: string;
  customCtaUrl?: string;
  customCategories?: WomensCategoryItem[];
}

const DEFAULT_WOMENS_CATEGORIES: WomensCategoryItem[] = [
  {
    title: 'Dresses',
    subtitle: 'Midi, Maxi & Tiered Florals',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
    href: '/women?category=dresses',
  },
  {
    title: 'Kurtis & Sets',
    subtitle: 'Chanderi Silk & Zari Work',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    href: '/women?category=kurtis',
  },
  {
    title: 'Co-ords & Sets',
    subtitle: 'Pure Linen & Tailored Fits',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop',
    href: '/women?category=co-ords',
  },
  {
    title: 'Tops & Shirts',
    subtitle: 'Satin Wraps & Linen Blouses',
    imageUrl: 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=600&auto=format&fit=crop',
    href: '/women?category=tops',
  },
  {
    title: 'Ethnic Wear',
    subtitle: 'Anarkalis & Hand-block Mulmul',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    href: '/women?category=ethnic-wear',
  },
  {
    title: 'Bottoms',
    subtitle: 'High-Waisted Wide Trousers',
    imageUrl: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop',
    href: '/women?category=bottoms',
  },
];

export function WomensEditorial({
  customTitle,
  customSubtitle,
  customBadge,
  customImage,
  customCtaText = 'Explore Complete Collection',
  customCtaUrl = '/women',
  customCategories,
}: WomensEditorialProps = {}) {
  const title = customTitle || "Women's Collection";
  const subtitle =
    customSubtitle ||
    'From flowy tiered maxi dresses to royal Chanderi silk kurti sets, our women’s collection celebrates the effortless harmony of modern fashion and timeless poise.';
  const badge = customBadge || "Women's Universe • Studio Edit";
  const bannerImage =
    customImage ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop';
  const categories =
    customCategories && customCategories.length > 0
      ? customCategories
      : DEFAULT_WOMENS_CATEGORIES;

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B77A68] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] max-w-xl font-sans mt-1">
              {subtitle}
            </p>
          </div>

          <Link
            href={formatTenantHref(customCtaUrl)}
            className="text-xs uppercase font-bold tracking-widest text-[#111111] hover:text-[#B77A68] flex items-center gap-1.5 transition-colors group"
          >
            <span>{customCtaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Category Sub-tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={formatTenantHref(cat.href || '/women')}
              className="group flex flex-col bg-[#FAF6F2] border border-[#E8DED8] p-3 luxury-card-shadow transition-all duration-300 hover:border-[#B77A68]"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F8F1EA] mb-3">
                <Image
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop'}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <h4 className="text-sm font-serif font-bold text-[#111111] group-hover:text-[#B77A68] transition-colors leading-tight">
                {cat.title}
              </h4>
              <p className="text-[11px] text-[#777777] font-sans truncate mt-0.5">
                {cat.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
