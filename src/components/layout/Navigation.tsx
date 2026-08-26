'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categoriesData, collectionsData } from '@/data/categories';

export function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const womenCat = categoriesData.find((c) => c.slug === 'women');
  const kidsCat = categoriesData.find((c) => c.slug === 'kids');

  return (
    <nav
      className="hidden md:flex items-center justify-center gap-7 lg:gap-10 text-xs uppercase tracking-widest font-semibold text-[#111111] select-none"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* 1. WOMEN */}
      <div
        className="relative py-4"
        onMouseEnter={() => setActiveMenu('women')}
      >
        <Link
          href="/women"
          className={`transition-colors flex items-center gap-1 ${
            activeMenu === 'women' ? 'text-[#B77A68]' : 'hover:text-[#B77A68]'
          }`}
        >
          Women
        </Link>

        {/* Mega Dropdown */}
        {activeMenu === 'women' && womenCat && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#FFFDFC] border border-[#E8DED8] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-3 gap-6">
            {/* Subcategories Column 1 */}
            <div>
              <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                Ethnic & Fusion
              </h4>
              <ul className="space-y-2 text-xs font-normal normal-case">
                <li>
                  <Link
                    href="/women?category=kurtis"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Kurtis & Suit Sets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women?category=ethnic-wear"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Anarkalis & Festive Wear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women?category=dresses"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Ethnic Maxi Dresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women?category=accessories"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Dupattas & Bags
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subcategories Column 2 */}
            <div>
              <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                Western & Contemporary
              </h4>
              <ul className="space-y-2 text-xs font-normal normal-case">
                <li>
                  <Link
                    href="/women?category=dresses"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Floral Midi & Maxi Dresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women?category=co-ords"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Linen Co-ords & Matching Sets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women?category=tops"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Satin Tops & Blouses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women?category=bottoms"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Tailored Wide-Leg Trousers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Featured Image Card */}
            <div className="relative aspect-4/5 overflow-hidden bg-[#F8F1EA] border border-[#E8DED8] group">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
                alt="Women's New In"
                fill
                sizes="240px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white normal-case">
                <span className="text-[10px] text-[#E8B8B5] font-bold uppercase tracking-widest">
                  Trending Now
                </span>
                <p className="text-xs font-serif font-bold text-white mb-2">
                  Summer Linen Essentials
                </p>
                <Link
                  href="/women"
                  className="text-[11px] font-bold text-[#FFFDFC] flex items-center gap-1 hover:underline uppercase tracking-wider"
                >
                  Explore Collection <ArrowRight className="w-3 h-3 text-[#B77A68]" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. KIDS */}
      <div
        className="relative py-4"
        onMouseEnter={() => setActiveMenu('kids')}
      >
        <Link
          href="/kids"
          className={`transition-colors flex items-center gap-1 ${
            activeMenu === 'kids' ? 'text-[#B77A68]' : 'hover:text-[#B77A68]'
          }`}
        >
          Kids
        </Link>

        {/* Mega Dropdown */}
        {activeMenu === 'kids' && kidsCat && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-[#FFFDFC] border border-[#E8DED8] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-3 gap-6">
            <div>
              <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                Girls Collection (2 - 12Y)
              </h4>
              <ul className="space-y-2 text-xs font-normal normal-case">
                <li>
                  <Link
                    href="/kids?category=girls"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Ruffle Frocks & Party Dresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kids?category=casual-wear"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Cotton Dungaree Sets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kids?category=ethnic-wear"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Girls Lehenga & Kurti Sets
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                Boys Collection (2 - 12Y)
              </h4>
              <ul className="space-y-2 text-xs font-normal normal-case">
                <li>
                  <Link
                    href="/kids?category=boys"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Nehru Jackets & Kurta Sets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kids?category=casual-wear"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Linen Resort Shirts & Shorts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kids?category=tops"
                    className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                  >
                    Printed Tees & Shirts
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative aspect-4/5 overflow-hidden bg-[#F8F1EA] border border-[#E8DED8] group">
              <Image
                src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop"
                alt="Kids Special"
                fill
                sizes="240px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white normal-case">
                <span className="text-[10px] text-[#E8B8B5] font-bold uppercase tracking-widest">
                  Adorable Comfort
                </span>
                <p className="text-xs font-serif font-bold text-white mb-2">
                  100% Organic Cotton Lining
                </p>
                <Link
                  href="/kids"
                  className="text-[11px] font-bold text-[#FFFDFC] flex items-center gap-1 hover:underline uppercase tracking-wider"
                >
                  Shop Kids <ArrowRight className="w-3 h-3 text-[#B77A68]" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. NEW ARRIVALS */}
      <Link
        href="/new-arrivals"
        className="py-4 hover:text-[#B77A68] transition-colors flex items-center gap-1.5"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
        New Arrivals
      </Link>

      {/* 4. BEST SELLERS */}
      <Link
        href="/women?sort=popular"
        className="py-4 hover:text-[#B77A68] transition-colors"
      >
        Best Sellers
      </Link>

      {/* 5. LOOKBOOKS / COLLECTIONS */}
      <div
        className="relative py-4"
        onMouseEnter={() => setActiveMenu('collections')}
      >
        <button
          className={`transition-colors flex items-center gap-1 uppercase tracking-widest font-semibold ${
            activeMenu === 'collections' ? 'text-[#B77A68]' : 'hover:text-[#B77A68]'
          }`}
        >
          Collections
        </button>

        {activeMenu === 'collections' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-[#FFFDFC] border border-[#E8DED8] shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-4">
              {collectionsData.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group block text-center"
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-[#FAF6F2] border border-[#E8DED8] mb-2">
                    <Image
                      src={col.bannerImage}
                      alt={col.name}
                      fill
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h5 className="text-[11px] font-bold text-[#111111] group-hover:text-[#B77A68] transition-colors normal-case">
                    {col.name}
                  </h5>
                  <span className="text-[9px] text-[#777777] uppercase tracking-wider block">
                    {col.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. SALE */}
      <Link
        href="/sale"
        className="py-4 text-[#C98282] hover:text-[#111111] font-bold transition-colors"
      >
        Sale
      </Link>
    </nav>
  );
}
