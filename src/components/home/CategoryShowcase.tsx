import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function CategoryShowcase() {
  const categories = [
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

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            Curated Fashion Universes
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1 mb-3">
            Shop By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#B77A68] mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-[#777777] font-sans">
            Handpicked collections tailored for everyday comfort, grand celebrations, and playful moments.
          </p>
        </div>

        {/* Categories Grid (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative aspect-3/4 overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] luxury-card-shadow flex flex-col justify-end p-6"
            >
              {/* Background Image with Zoom on Hover */}
              <Image
                src={cat.imageUrl}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />

              {/* Content Overlay */}
              <div className="relative z-10 text-white space-y-1.5 transform transition-transform duration-300 group-hover:-translate-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#E8B8B5] bg-black/40 px-2 py-0.5 border border-[#B77A68]/40 mb-1">
                  {cat.badge}
                </span>

                <h3 className="text-2xl font-serif font-bold tracking-tight text-white">
                  {cat.title}
                </h3>

                <p className="text-xs text-[#E8DED8] line-clamp-2 font-sans font-normal">
                  {cat.tagline}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] group-hover:text-[#E8B8B5] transition-colors">
                  <span>{cat.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
