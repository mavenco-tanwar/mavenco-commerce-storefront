import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export function WomensEditorial() {
  const womensCategories = [
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
      imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=600&auto=format&fit=crop',
      href: '/women?category=bottoms',
    },
    {
      title: 'Bags & Accessories',
      subtitle: 'Rose-Gold Vegan Carryalls',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
      href: '/women?category=accessories',
    },
    {
      title: 'Western Wear',
      subtitle: 'Chic Blazers & Modern Silhouettes',
      imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop',
      href: '/women?category=western-wear',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B77A68] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Women&apos;s Editorial Universe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              For Her
            </h2>
            <p className="text-sm text-[#777777] font-sans mt-1 italic">
              &ldquo;Confidence looks good on you.&rdquo;
            </p>
          </div>

          <Link
            href="/women"
            className="text-xs uppercase font-bold tracking-widest text-[#111111] hover:text-[#B77A68] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Women&apos;s Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8-Card Editorial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {womensCategories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative aspect-4/5 overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] luxury-card-shadow"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300" />

              {/* Text Badge */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#FFFDFC] group-hover:text-[#E8B8B5] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-[#E8DED8] font-sans line-clamp-1 mt-0.5 font-normal">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
