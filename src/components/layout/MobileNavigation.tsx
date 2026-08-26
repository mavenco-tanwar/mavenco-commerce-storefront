'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Heart,
  User,
  ShoppingBag,
  Phone,
  Sparkles,
  Search,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { categoriesData, collectionsData } from '@/data/categories';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileNavigation({ isOpen, onClose, onOpenSearch }: MobileNavigationProps) {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    women: true,
    kids: false,
    collections: false,
  });

  const { user, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearchClick = () => {
    onClose();
    onOpenSearch();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      title=""
      headerAction={<BrandLogo size="sm" showTagline={false} />}
    >
      <div className="flex flex-col h-full justify-between -mt-2">
        <div>
          {/* Mobile Search Button */}
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FAF6F2] border border-[#E8DED8] text-xs text-[#777777] mb-6 rounded-none"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#B77A68]" />
              Search dresses, kurtis, kids...
            </span>
            <span className="text-[10px] bg-[#E8DED8] px-1.5 py-0.5 font-bold uppercase text-[#111111]">
              Search
            </span>
          </button>

          {/* Nav Categories */}
          <div className="space-y-1 divide-y divide-[#E8DED8]">
            {/* Women Category Accordion */}
            <div className="py-2">
              <button
                onClick={() => toggleAccordion('women')}
                className="w-full flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#111111]"
              >
                <span>Women&apos;s Fashion</span>
                {openAccordions['women'] ? (
                  <ChevronDown className="w-4 h-4 text-[#B77A68]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#777777]" />
                )}
              </button>

              {openAccordions['women'] && (
                <div className="pl-3 py-1 space-y-2 text-xs border-l-2 border-[#E8B8B5] mt-1 ml-1 animate-in fade-in duration-200">
                  <Link
                    href="/women"
                    onClick={onClose}
                    className="block font-semibold text-[#B77A68] hover:underline"
                  >
                    View All Women &rarr;
                  </Link>
                  {categoriesData[0].subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/women?category=${sub.slug}`}
                      onClick={onClose}
                      className="block text-[#777777] hover:text-[#111111] transition-colors py-0.5"
                    >
                      {sub.name} ({sub.itemCount})
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Kids Category Accordion */}
            <div className="py-2">
              <button
                onClick={() => toggleAccordion('kids')}
                className="w-full flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#111111]"
              >
                <span>Kids Collection</span>
                {openAccordions['kids'] ? (
                  <ChevronDown className="w-4 h-4 text-[#B77A68]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#777777]" />
                )}
              </button>

              {openAccordions['kids'] && (
                <div className="pl-3 py-1 space-y-2 text-xs border-l-2 border-[#E8B8B5] mt-1 ml-1 animate-in fade-in duration-200">
                  <Link
                    href="/kids"
                    onClick={onClose}
                    className="block font-semibold text-[#B77A68] hover:underline"
                  >
                    View All Kids &rarr;
                  </Link>
                  {categoriesData[1].subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/kids?category=${sub.slug}`}
                      onClick={onClose}
                      className="block text-[#777777] hover:text-[#111111] transition-colors py-0.5"
                    >
                      {sub.name} ({sub.itemCount})
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <div className="py-2 space-y-2">
              <Link
                href="/new-arrivals"
                onClick={onClose}
                className="flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#111111] hover:text-[#B77A68]"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B77A68]" />
                  New Arrivals
                </span>
                <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5">FRESH</span>
              </Link>

              <Link
                href="/sale"
                onClick={onClose}
                className="flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#C98282] hover:text-[#111111]"
              >
                <span>Special Sale</span>
                <span className="text-[10px] bg-[#C98282] text-white px-1.5 py-0.5">UP TO 50% OFF</span>
              </Link>
            </div>

            {/* Curated Collections */}
            <div className="py-2">
              <button
                onClick={() => toggleAccordion('collections')}
                className="w-full flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#111111]"
              >
                <span>Curated Lookbooks</span>
                {openAccordions['collections'] ? (
                  <ChevronDown className="w-4 h-4 text-[#B77A68]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#777777]" />
                )}
              </button>

              {openAccordions['collections'] && (
                <div className="pl-3 py-1 space-y-2 text-xs border-l-2 border-[#B77A68] mt-1 ml-1 animate-in fade-in duration-200">
                  {collectionsData.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.slug}`}
                      onClick={onClose}
                      className="block text-[#777777] hover:text-[#111111] transition-colors py-0.5"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-6 border-t border-[#E8DED8] space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#FAF6F2] border border-[#E8DED8] text-xs font-semibold text-[#111111]"
            >
              <Heart className="w-4 h-4 text-[#B77A68]" />
              <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
            </Link>

            <Link
              href={isAuthenticated ? '/account' : '/login'}
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#FAF6F2] border border-[#E8DED8] text-xs font-semibold text-[#111111]"
            >
              <User className="w-4 h-4 text-[#B77A68]" />
              <span>{isAuthenticated ? 'My Account' : 'Sign In'}</span>
            </Link>
          </div>

          {/* Quick Help & Whatsapp */}
          <div className="bg-[#F8F1EA] p-3 border border-[#E8DED8] text-xs text-[#777777]">
            <p className="font-semibold text-[#111111] mb-1">Customer Support</p>
            <div className="flex flex-col gap-1 text-[11px]">
              <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-[#111111]">
                <Phone className="w-3.5 h-3.5 text-[#B77A68]" /> +91 98765 43210
              </a>
              <p>Email: care@jqtrends.com</p>
              <p>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
