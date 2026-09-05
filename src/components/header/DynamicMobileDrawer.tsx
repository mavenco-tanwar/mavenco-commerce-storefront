'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Heart,
  ShoppingBag,
  User,
  Phone,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { NavigationItem } from '@/lib/header-config';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency-context';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatTenantHref } from '@/lib/tenant-config';

interface DynamicMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigationMenu: NavigationItem[];
  tenantSlug: string;
  drawerSettings?: {
    background?: string;
    textColor?: string;
    accentColor?: string;
    showSocialIcons?: boolean;
    showCurrency?: boolean;
    promoCard?: {
      enabled: boolean;
      image: string;
      heading: string;
      description: string;
      ctaText: string;
      ctaUrl: string;
    };
    socialLinks?: {
      instagram?: string;
      tiktok?: string;
      whatsapp?: string;
      facebook?: string;
    };
    quickActions?: {
      showPhone: boolean;
      showWhatsApp: boolean;
      showStoreLocator: boolean;
    };
  };
  onOpenSearch?: () => void;
}

export function DynamicMobileDrawer({
  isOpen,
  onClose,
  navigationMenu = [],
  tenantSlug,
  drawerSettings,
  onOpenSearch,
}: DynamicMobileDrawerProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const { currency, setCurrency } = useCurrency();
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  const bg = drawerSettings?.background || '#FFFDFC';
  const textColor = drawerSettings?.textColor || '#111111';
  const accentColor = drawerSettings?.accentColor || '#E11D48';

  const toggleAccordion = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-xs sm:max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-300 animate-in slide-in-from-left"
        style={{ backgroundColor: bg, color: textColor }}
      >
        {/* Top: Header with Close button */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              {tenantSlug.substring(0, 2).toUpperCase()}
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">{tenantSlug}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Action */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-xs text-left"
          >
            <Search className="w-4 h-4 opacity-60" />
            <span className="opacity-75 font-medium">Search catalogue...</span>
          </button>
        </div>

        {/* Primary Navigation Links with Multi-Level Dropdowns */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {(navigationMenu || [])
            .filter((item) => item && item.enabled !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item) => {
              const hasMega = !!item.megaMenu?.enabled;
              const hasChildren = !!(item.children && item.children.length > 0);
              const isExpanded = expandedItemId === item.id;

              return (
                <div key={item.id} className="rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between">
                    <Link
                      href={formatTenantHref(item.url, tenantSlug)}
                      onClick={onClose}
                      className="flex-1 px-3 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-75 transition-opacity flex items-center gap-2"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase text-white"
                          style={{ backgroundColor: item.badge.bg || accentColor }}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </Link>

                    {(hasMega || hasChildren) && (
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.id)}
                        className="p-2.5 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 opacity-60 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 opacity-100' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mega Menu Accordion Links */}
                  {hasMega && isExpanded && item.megaMenu && (
                    <div className="pl-4 pr-2 py-2 space-y-3 bg-black/3 rounded-lg my-1">
                      {item.megaMenu.columns.map((col) => (
                        <div key={col.id} className="space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                            {col.title}
                          </p>
                          {col.links?.map((link, idx) => (
                            <Link
                              key={idx}
                              href={formatTenantHref(link.url, tenantSlug)}
                              onClick={onClose}
                              className="block py-1 text-xs opacity-80 hover:opacity-100 transition-opacity"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Children Links */}
                  {!hasMega && hasChildren && isExpanded && item.children && (
                    <div className="pl-6 pr-2 py-1 space-y-1 bg-black/3 rounded-lg my-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={formatTenantHref(child.url, tenantSlug)}
                          onClick={onClose}
                          className="block py-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Featured Promo Card inside Mobile Drawer */}
          {drawerSettings?.promoCard?.enabled !== false && drawerSettings?.promoCard?.heading && (
            <div className="mt-4 p-3 rounded-2xl bg-black/5 border border-black/10 space-y-2">
              {drawerSettings.promoCard.image && (
                <div className="relative h-28 w-full rounded-xl overflow-hidden">
                  <img
                    src={drawerSettings.promoCard.image}
                    alt={drawerSettings.promoCard.heading}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Featured Drop</span>
                <h4 className="text-xs font-bold leading-snug">{drawerSettings.promoCard.heading}</h4>
                {drawerSettings.promoCard.description && (
                  <p className="text-[11px] opacity-70 line-clamp-2">{drawerSettings.promoCard.description}</p>
                )}
                {drawerSettings.promoCard.ctaText && (
                  <Link
                    href={formatTenantHref(drawerSettings.promoCard.ctaUrl || '/women', tenantSlug)}
                    onClick={onClose}
                    className="inline-block mt-1 text-xs font-bold underline uppercase tracking-wider hover:opacity-80"
                    style={{ color: accentColor }}
                  >
                    {drawerSettings.promoCard.ctaText} →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Utility & Social Menu */}
        <div className="p-4 border-t space-y-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              href={formatTenantHref('/wishlist', tenantSlug)}
              onClick={onClose}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <Link
              href={formatTenantHref('/cart', tenantSlug)}
              onClick={onClose}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({summary.itemCount})</span>
            </Link>
          </div>

          {/* Social Links inside Mobile Drawer */}
          {drawerSettings?.socialLinks && Object.values(drawerSettings.socialLinks).some(Boolean) && (
            <div className="pt-2 flex items-center justify-center gap-4 text-xs opacity-75">
              {drawerSettings.socialLinks.instagram && (
                <a href={drawerSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                  Instagram
                </a>
              )}
              {drawerSettings.socialLinks.tiktok && (
                <a href={drawerSettings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                  TikTok
                </a>
              )}
              {drawerSettings.socialLinks.whatsapp && (
                <a href={`https://wa.me/${drawerSettings.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 text-emerald-600 font-bold">
                  WhatsApp
                </a>
              )}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs border-t border-black/5">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <span className="font-bold truncate">{user?.name || 'Customer'}</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href={formatTenantHref('/login', tenantSlug)}
                onClick={onClose}
                className="flex items-center gap-1.5 font-bold hover:opacity-80 transition-opacity"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
