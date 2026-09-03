'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Heart,
  User,
  ShoppingBag,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { CategoryService } from '@/services/categories';
import { Category, Collection } from '@/types/category';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileNavigation({ isOpen, onClose, onOpenSearch }: MobileNavigationProps) {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    departments: true,
    collections: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const { user, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    CategoryService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    });
    CategoryService.getCollections().then((res) => {
      if (res.data) setCollections(res.data);
    });
  }, []);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearchClick = () => {
    onClose();
    onOpenSearch();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="left" size="md">
      <div className="flex flex-col h-full bg-[#FFFDFC] text-[#111111] select-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8DED8]">
          <BrandLogo size="sm" />
          <button
            onClick={onClose}
            className="p-2 text-[#777777] hover:text-[#111111] transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input Button */}
        <div className="p-4 border-b border-[#E8DED8] bg-[#FAF6F2]">
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FFFDFC] border border-[#E8DED8] rounded-none text-xs text-[#777777] hover:border-[#B77A68] transition-colors text-left"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#B77A68]" />
              Search boutique collections...
            </span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-[#E8DED8]">
          {/* Categories / Departments Accordions */}
          {categories.map((cat) => (
            <div key={cat.id} className="py-2">
              <button
                onClick={() => toggleAccordion(cat.id)}
                className="w-full flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#111111]"
              >
                <span>{cat.name}</span>
                {openAccordions[cat.id] ? (
                  <ChevronDown className="w-4 h-4 text-[#B77A68]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#777777]" />
                )}
              </button>

              {openAccordions[cat.id] && (
                <div className="pl-3 py-1 space-y-2 text-xs border-l-2 border-[#E8B8B5] mt-1 ml-1 animate-in fade-in duration-200">
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={onClose}
                    className="block font-semibold text-[#B77A68] hover:underline"
                  >
                    View All {cat.name} &rarr;
                  </Link>
                  {(cat.subcategories || []).map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/collections/${sub.slug}`}
                      onClick={onClose}
                      className="block text-[#777777] hover:text-[#111111] transition-colors py-0.5"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quick Primary Links */}
          <div className="py-3 space-y-2">
            <Link
              href="/new-arrivals"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#111111] hover:text-[#B77A68]"
            >
              <span>New In Studio</span>
              <span className="text-[10px] bg-[#B77A68] text-white px-2 py-0.5 font-sans font-semibold">
                NEW
              </span>
            </Link>

            <Link
              href="/sale"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-sm font-serif font-bold uppercase tracking-wider text-[#B77A68]"
            >
              <span>Celebratory Sale</span>
              <span className="text-[10px] bg-[#E8B8B5] text-[#111111] px-2 py-0.5 font-sans font-bold">
                SALE
              </span>
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E8DED8] bg-[#FAF6F2] space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-2.5 bg-[#FFFDFC] border border-[#E8DED8] text-xs font-semibold text-[#111111] hover:border-[#B77A68] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#B77A68]" />
              <span>{isAuthenticated ? 'My Account' : 'Sign In'}</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-2.5 bg-[#FFFDFC] border border-[#E8DED8] text-xs font-semibold text-[#111111] hover:border-[#B77A68] transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#B77A68]" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
