'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { formatTenantHref } from '@/lib/tenant-config';
import { Navigation } from './Navigation';
import { MobileNavigation } from './MobileNavigation';
import { SearchOverlay } from './SearchOverlay';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, CURRENCIES } from '@/lib/currency-context';

export function Header() {
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { summary, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFDFC]/95 backdrop-blur-md shadow-sm border-b border-[#E8DED8]'
            : 'bg-[#FFFDFC] border-b border-[#E8DED8]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Left: Mobile Hamburger & Desktop Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#111111] hover:text-[#B77A68] transition-colors -ml-2"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[1.75]" />
              </button>
              <BrandLogo />
            </div>

            {/* Middle: Desktop Main Navigation */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <Navigation />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Multi-Currency FX Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="flex items-center gap-1 py-1 px-2 rounded border border-[#E8DED8] bg-[#FFFDFC] text-[11px] font-mono font-bold text-[#111111] hover:bg-[#F8F1EA] transition-all"
                  title="Change Store Currency"
                >
                  <span>{currencyInfo.flag}</span>
                  <span>{currencyInfo.code}</span>
                  <ChevronDown className="w-3 h-3 text-[#777777]" />
                </button>

                {isCurrencyMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-44 bg-[#FFFDFC] border border-[#E8DED8] shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseLeave={() => setIsCurrencyMenuOpen(false)}
                  >
                    <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#777777]">
                      Global Currency (FX)
                    </div>
                    {Object.values(CURRENCIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors text-left ${
                          currency === c.code
                            ? 'bg-[#F8F1EA] text-[#B77A68] font-bold'
                            : 'text-[#111111] hover:bg-[#F8F1EA]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#777777]">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#111111] hover:text-[#B77A68] hover:bg-[#F8F1EA] transition-colors rounded-none flex items-center gap-1.5"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
                <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider text-[#777777]">
                  Search
                </span>
              </button>

              {/* Wishlist Link */}
              <Link
                href={formatTenantHref('/wishlist')}
                className="relative p-2 text-[#111111] hover:text-[#B77A68] hover:bg-[#F8F1EA] transition-colors rounded-none"
                aria-label="Saved items wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#B77A68] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                onClick={openDrawer}
                className="relative p-2 text-[#111111] hover:text-[#B77A68] hover:bg-[#F8F1EA] transition-colors rounded-none flex items-center gap-1"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {summary.totalItemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#111111] text-[#FFFDFC] text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50">
                    {summary.totalItemCount}
                  </span>
                )}
              </button>

              {/* User Account / Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <button
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-1.5 p-2 text-[#111111] hover:text-[#B77A68] hover:bg-[#F8F1EA] transition-colors text-xs font-semibold"
                    >
                      <User className="w-5 h-5 stroke-[1.75]" />
                      <span className="hidden lg:inline max-w-[90px] truncate">
                        {user?.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 hidden lg:inline text-[#777777]" />
                    </button>

                    {/* Account Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full w-56 bg-[#FFFDFC] border border-[#E8DED8] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-4 py-2 border-b border-[#E8DED8]">
                          <p className="text-xs font-bold text-[#111111] truncate">{user?.name}</p>
                          <p className="text-[11px] text-[#777777] truncate">{user?.email}</p>
                        </div>

                        <div className="py-1 text-xs">
                          <Link
                            href={formatTenantHref('/account')}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#111111] hover:bg-[#F8F1EA] transition-colors"
                          >
                            <Package className="w-4 h-4 text-[#B77A68]" />
                            <span>My Orders & Tracking</span>
                          </Link>

                          <Link
                            href={formatTenantHref('/account?tab=addresses')}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#111111] hover:bg-[#F8F1EA] transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-[#B77A68]" />
                            <span>Saved Addresses</span>
                          </Link>

                          <Link
                            href="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#111111] hover:bg-[#F8F1EA] transition-colors"
                          >
                            <Heart className="w-4 h-4 text-[#B77A68]" />
                            <span>Wishlist ({wishlistCount})</span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-[#E8DED8]">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#C98282] hover:bg-[#F7EBEA] transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={formatTenantHref('/login')}
                    className="p-2 text-[#111111] hover:text-[#B77A68] hover:bg-[#F8F1EA] transition-colors rounded-none flex items-center gap-1.5"
                    aria-label="Sign in"
                  >
                    <User className="w-5 h-5 stroke-[1.75]" />
                    <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider text-[#111111]">
                      Sign In
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Overlays and Drawers */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer />
    </>
  );
}
