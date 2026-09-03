'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CategoryService } from '@/services/categories';
import { CmsApiService, CmsMenuItem } from '@/services/api/cms';
import { Category, Collection } from '@/types/category';

import { resolveTenant, TenantBrandConfig } from '@/lib/tenant-config';

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tenant, setTenant] = useState<TenantBrandConfig>(resolveTenant());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [menuItems, setMenuItems] = useState<CmsMenuItem[]>([
    { id: 'nav_1', label: 'Women', url: '/women', isVisible: true },
    { id: 'nav_2', label: 'Kids', url: '/kids', isVisible: true },
    { id: 'nav_3', label: 'New In', url: '/new-arrivals', isVisible: true },
    { id: 'nav_4', label: 'Collections', url: '/collections/festive-elegance', isVisible: true },
    { id: 'nav_5', label: 'Sale', url: '/sale', isVisible: true },
  ]);

  useEffect(() => {
    const t = resolveTenant();
    setTenant(t);
    CmsApiService.getMenu('header-menu').then((items) => {
      if (items && items.length > 0) {
        setMenuItems(items);
      }
    });
    CategoryService.getCategories().then((res) => {
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    });
    CategoryService.getCollections().then((res) => {
      if (res.data && res.data.length > 0) {
        setCollections(res.data);
      }
    });
  }, [pathname, searchParams]);

  // Render tenant-configured custom navigation if provided
  if (tenant.navLinks && tenant.navLinks.length > 0) {
    return (
      <nav suppressHydrationWarning className="hidden md:flex items-center justify-center gap-7 lg:gap-10 text-xs uppercase tracking-widest font-semibold select-none">
        {tenant.navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            suppressHydrationWarning
            className="hover:opacity-75 transition-opacity flex items-center gap-1.5"
            style={{ color: tenant.theme.primaryColor }}
          >
            <span suppressHydrationWarning>{link.label}</span>
            {link.badge && (
              <span
                suppressHydrationWarning
                className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: tenant.theme.accentColor }}
              >
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    );
  }

  const womenCat = categories.find((c) => c.slug === 'women') || categories[0];
  const kidsCat = categories.find((c) => c.slug === 'kids') || categories[1];

  return (
    <nav
      className="hidden md:flex items-center justify-center gap-7 lg:gap-10 text-xs uppercase tracking-widest font-semibold text-[#111111] select-none"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {menuItems.map((item) => {
        const lowerLabel = item.label.toLowerCase();
        const url = item.url || '/';

        // 1. WOMEN MEGA MENU
        if (url.includes('/women') || lowerLabel === 'women') {
          return (
            <div
              key={item.id}
              className="relative py-4"
              onMouseEnter={() => setActiveMenu('women')}
            >
              <Link
                href={url}
                className={`transition-colors flex items-center gap-1 ${
                  activeMenu === 'women' ? 'text-[#B77A68]' : 'hover:text-[#B77A68]'
                }`}
              >
                {item.label}
              </Link>

              {/* Mega Dropdown */}
              {activeMenu === 'women' && womenCat && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#FFFDFC] border border-[#E8DED8] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                      Ethnic &amp; Festive
                    </h4>
                    <ul className="space-y-2 text-xs font-normal normal-case">
                      <li>
                        <Link
                          href="/women?category=kurtis"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Chanderi Kurti Sets
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/women?category=kurtis"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Anarkalis &amp; Suit Sets
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/women?category=dresses"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Floral Tiered Dresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/women?category=co-ords"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Linen Co-ord Sets
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                      Modern Western
                    </h4>
                    <ul className="space-y-2 text-xs font-normal normal-case">
                      <li>
                        <Link
                          href="/women?category=dresses"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Midi &amp; Maxi Dresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/women?category=tops"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Schiffli Cotton Tops
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/women?category=co-ords"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Blazer &amp; Trouser Sets
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/women"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Resort &amp; Vacation Wear
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Editorial Feature Card */}
                  <div className="relative aspect-4/5 bg-[#FAF6F2] overflow-hidden border border-[#E8DED8] p-4 flex flex-col justify-end text-white">
                    <Image
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
                      alt="Women's Collection"
                      fill
                      sizes="250px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                        Featured Edit
                      </span>
                      <h5 className="text-sm font-serif font-bold text-white normal-case">
                        Summer Linen &amp; Florals
                      </h5>
                      <Link
                        href="/women"
                        className="text-[10px] uppercase tracking-wider text-white font-bold inline-flex items-center gap-1 hover:underline pt-1"
                      >
                        Shop Now &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // 2. KIDS MEGA MENU
        if (url.includes('/kids') || lowerLabel === 'kids') {
          return (
            <div
              key={item.id}
              className="relative py-4"
              onMouseEnter={() => setActiveMenu('kids')}
            >
              <Link
                href={url}
                className={`transition-colors flex items-center gap-1 ${
                  activeMenu === 'kids' ? 'text-[#B77A68]' : 'hover:text-[#B77A68]'
                }`}
              >
                {item.label}
              </Link>

              {/* Kids Dropdown */}
              {activeMenu === 'kids' && kidsCat && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-[#FFFDFC] border border-[#E8DED8] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                      Girls Wear
                    </h4>
                    <ul className="space-y-2 text-xs font-normal normal-case">
                      <li>
                        <Link
                          href="/kids?category=girls"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Princess Party Frocks
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/kids?category=girls"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Cotton Casual Dresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/kids?category=girls"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Lehenga Choli Sets
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-[#B77A68] tracking-widest uppercase mb-3 pb-1 border-b border-[#E8DED8]">
                      Boys Wear
                    </h4>
                    <ul className="space-y-2 text-xs font-normal normal-case">
                      <li>
                        <Link
                          href="/kids?category=boys"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Artisanal Kurta Pajama
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/kids?category=boys"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Printed Cotton Shirts
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/kids?category=boys"
                          className="text-[#777777] hover:text-[#111111] hover:font-medium transition-colors"
                        >
                          Nehru Jacket Sets
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Kids Feature Card */}
                  <div className="relative aspect-4/5 bg-[#FAF6F2] overflow-hidden border border-[#E8DED8] p-4 flex flex-col justify-end text-white">
                    <Image
                      src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop"
                      alt="Kids Collection"
                      fill
                      sizes="250px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                        Little Royals
                      </span>
                      <h5 className="text-sm font-serif font-bold text-white normal-case">
                        Partywear &amp; Occasion Sets
                      </h5>
                      <Link
                        href="/kids"
                        className="text-[10px] uppercase tracking-wider text-white font-bold inline-flex items-center gap-1 hover:underline pt-1"
                      >
                        Explore Kids &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // 3. COLLECTIONS DROPDOWN
        if (url.includes('/collections') || lowerLabel === 'collections') {
          return (
            <div
              key={item.id}
              className="relative py-4"
              onMouseEnter={() => setActiveMenu('collections')}
            >
              <button
                type="button"
                className={`transition-colors uppercase tracking-widest font-semibold flex items-center gap-1 ${
                  activeMenu === 'collections' ? 'text-[#B77A68]' : 'hover:text-[#B77A68]'
                }`}
              >
                {item.label}
              </button>

              {activeMenu === 'collections' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-[#FFFDFC] border border-[#E8DED8] shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#B77A68] pb-1 border-b border-[#E8DED8]">
                    Curated Studio Lookbooks
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.slug}`}
                        className="p-2.5 bg-[#FAF6F2] hover:bg-[#F3ECE6] transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <h5 className="text-xs font-bold font-serif text-[#111111] normal-case">
                            {col.name}
                          </h5>
                          <p className="text-[11px] text-[#777777] font-sans normal-case line-clamp-1">
                            {col.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-[#B77A68] group-hover:translate-x-1 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        // 4. SALE HIGHLIGHT LINK
        if (url.includes('/sale') || lowerLabel === 'sale') {
          return (
            <Link
              key={item.id}
              href={url}
              className="py-4 text-[#C98282] hover:text-[#A75F5F] font-bold transition-colors"
            >
              {item.label}
            </Link>
          );
        }

        // 5. STANDARD / CUSTOM LINK
        return (
          <Link
            key={item.id}
            href={url}
            className="py-4 hover:text-[#B77A68] transition-colors relative flex items-center gap-1"
          >
            <span>{item.label}</span>
            {lowerLabel.includes('new') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C98282]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
