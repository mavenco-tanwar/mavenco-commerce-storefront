import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

interface KidsCategoryItem {
  title: string;
  tagline: string;
  imageUrl: string;
  href: string;
  badge?: string;
}

interface KidsEditorialProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customCtaText?: string;
  customCtaUrl?: string;
  customCategories?: KidsCategoryItem[];
}

const DEFAULT_KIDS_CATEGORIES: KidsCategoryItem[] = [
  {
    title: 'Girls Collection',
    tagline: 'Tiered Frocks & Twirl Sets',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop',
    href: '/kids?category=girls',
    badge: '100% Organic Lining',
  },
  {
    title: 'Boys Collection',
    tagline: 'Nehru Jackets & Linen Sets',
    imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600&auto=format&fit=crop',
    href: '/kids?category=boys',
    badge: 'Festive & Crisp',
  },
  {
    title: 'Kids Ethnic Wear',
    tagline: 'Festive Lehengas & Kurtas',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop',
    href: '/kids?category=ethnic-wear',
    badge: 'Royal Heritage',
  },
  {
    title: 'Casual & Playwear',
    tagline: 'Pastel Dungarees & Cotton Tees',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop',
    href: '/kids?category=casual-wear',
    badge: 'Super Soft Cotton',
  },
];

export function KidsEditorial({
  customTitle,
  customSubtitle,
  customBadge,
  customCtaText = 'Explore All Kids Styles',
  customCtaUrl = '/kids',
  customCategories,
}: KidsEditorialProps = {}) {
  const title = customTitle || 'Little Looks, Big Style';
  const subtitle = customSubtitle || '“Comfort meets adorable.”';
  const badge = customBadge || 'Kids Universe • Ages 2 to 12 Years';
  const categories =
    customCategories && customCategories.length > 0
      ? customCategories
      : DEFAULT_KIDS_CATEGORIES;

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B77A68] mb-1">
              <Heart className="w-3.5 h-3.5 fill-[#B77A68]" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              {title}
            </h2>
            <p className="text-sm text-[#777777] font-sans mt-1 italic">
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

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={formatTenantHref(cat.href || '/kids')}
              className="group relative aspect-4/5 overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] luxury-card-shadow"
            >
              <Image
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop'}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300" />

              <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
                <span className="text-[10px] text-[#E8B8B5] font-bold uppercase tracking-widest block mb-0.5">
                  {cat.badge || '100% Organic Lining'}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#FFFDFC] group-hover:text-[#E8B8B5] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#E8DED8] font-sans mt-1">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
