'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { usePathname, useSearchParams } from 'next/navigation';
import { resolveTenant, resolveActiveTenantSlug, formatProductHref } from '@/lib/tenant-config';
import { ProductCardConfig } from '@/types/product-card.types';
import { useProductCardConfig } from '@/context/ProductCardConfigContext';

export interface ProductCardProps {
  product: Product;
  config?: Partial<ProductCardConfig>;
  className?: string;
}

export function ProductCard({ product, config: customConfig, className = '' }: ProductCardProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);

  const productTenant = (product as any).tenantSlug || (product as any).storeSlug;
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, productTenant);
  const activeTenant = resolveTenant(activeTenantSlug);
  const rawCategory = product.category || (product as any).categorySlug || (product as any).department;
  const productUrl = formatProductHref(product.slug, rawCategory, activeTenant.slug);

  // Consume live published product card config from context / API
  const { config: liveConfig } = useProductCardConfig(activeTenant.slug);

  const cfg: ProductCardConfig = {
    ...liveConfig,
    ...(customConfig || {}),
    image: {
      ...liveConfig.image,
      ...(customConfig?.image || {}),
    },
    badges: {
      ...liveConfig.badges,
      ...(customConfig?.badges || {}),
    },
    wishlist: {
      ...liveConfig.wishlist,
      ...(customConfig?.wishlist || {}),
    },
    quickView: {
      ...liveConfig.quickView,
      ...(customConfig?.quickView || {}),
    },
    brand: {
      ...liveConfig.brand,
      ...(customConfig?.brand || {}),
    },
    title: {
      ...liveConfig.title,
      ...(customConfig?.title || {}),
    },
    price: {
      ...liveConfig.price,
      ...(customConfig?.price || {}),
    },
    rating: {
      ...liveConfig.rating,
      ...(customConfig?.rating || {}),
    },
    variants: {
      ...liveConfig.variants,
      ...(customConfig?.variants || {}),
    },
    addToCart: {
      ...liveConfig.addToCart,
      ...(customConfig?.addToCart || {}),
    },
    card: {
      ...liveConfig.card,
      ...(customConfig?.card || {}),
    },
    layout: {
      ...liveConfig.layout,
      ...(customConfig?.layout || {}),
    },
  };

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);

  const getImageUrl = (item: any): string => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.url || item.src || '';
  };

  const imagesList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : Array.isArray((product as any).media) && (product as any).media.length > 0
    ? (product as any).media
    : [];

  const primaryImage =
    activeImageOverride ||
    getImageUrl(imagesList[0]) ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
  const secondaryImage = getImageUrl(imagesList[1]) || primaryImage;
  const isSecondImageHover =
    cfg.image?.hoverEffect === 'second_image' &&
    cfg.image?.showSecondaryImage !== false &&
    secondaryImage !== primaryImage;

  const handleQuickAdd = (size: string) => {
    addItem(product, selectedColor || product.colors?.[0]?.name || 'Standard', size, 1);
    setShowQuickSizes(false);
  };

  const handleSwatchClick = (c: any) => {
    setSelectedColor(c.name);
    if (cfg.variants?.allowImageSwap) {
      if (c.imageUrl) {
        setActiveImageOverride(c.imageUrl);
      } else if (typeof c.imageIndex === 'number' && imagesList[c.imageIndex]) {
        setActiveImageOverride(getImageUrl(imagesList[c.imageIndex]));
      }
    }
  };

  // Convert aspect ratio (e.g. "3/4" or "3:4") into standard CSS aspect-ratio
  const aspectRatioStr = (cfg.image?.aspectRatio || '3/4').replace(':', '/');

  const productName = product.name || (product as any).title || 'Product';

  // Add to cart variant styling
  const variantClasses: Record<string, string> = {
    primary:
      'bg-[var(--theme-btn-primary-bg,var(--theme-color-primary,#111111))] text-[var(--theme-btn-primary-text,#FFFFFF)] hover:bg-[var(--theme-btn-primary-hover-bg,var(--theme-color-primary-hover,#000000))] hover:text-[var(--theme-btn-primary-hover-text,#FFFFFF)]',
    secondary:
      'bg-[var(--theme-btn-secondary-bg,var(--theme-color-surface-secondary,#F5F5F4))] text-[var(--theme-btn-secondary-text,var(--theme-color-text,#1C1917))] hover:bg-[var(--theme-btn-secondary-hover-bg,var(--theme-color-border,#E7E5E4))] border border-[var(--theme-btn-secondary-border,var(--theme-color-border,#E7E5E4))]',
    outline:
      'bg-transparent text-[var(--theme-color-heading,#111111)] border border-[var(--theme-color-heading,#111111)] hover:bg-[var(--theme-btn-primary-bg,var(--theme-color-primary,#111111))] hover:text-[var(--theme-btn-primary-text,#FFFFFF)]',
    accent:
      'bg-[var(--theme-color-accent,#10B981)] text-white hover:bg-[var(--theme-color-accent-hover,#059669)]',
  };
  const cartVariantClass = variantClasses[cfg.addToCart?.variant || 'primary'] || variantClasses.primary;

  return (
    <div
      className={`group flex flex-col transition-all duration-300 relative select-none ${
        cfg.card?.hoverLift ? 'hover:-translate-y-1' : ''
      } ${className}`}
      style={{
        backgroundColor: cfg.card?.background || 'var(--theme-card-bg, #FFFFFF)',
        borderRadius: cfg.card?.borderRadius || '12px',
        borderColor: cfg.card?.borderColor || 'var(--theme-card-border, #F4F4F5)',
        borderWidth: cfg.card?.borderWidth || '1px',
        borderStyle: (cfg.card?.border as any) || 'solid',
        boxShadow: isHovered && cfg.card?.hoverShadow ? cfg.card.hoverShadow : (cfg.card?.shadow || 'var(--theme-card-shadow, 0 1px 3px rgba(0,0,0,0.05))'),
        padding: cfg.layout?.padding || '14px',
        gap: cfg.layout?.gap || '12px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Top Media Container */}
      <div
        className="relative w-full overflow-hidden bg-[#FAF6F2] mb-1"
        style={{
          aspectRatio: aspectRatioStr,
          borderRadius: cfg.image?.borderRadius || '8px',
        }}
      >
        <Link href={productUrl} className="relative block w-full h-full">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ease-out ${
              isHovered && isSecondImageHover
                ? 'opacity-0'
                : isHovered && cfg.image?.hoverEffect === 'zoom'
                ? 'scale-110'
                : isHovered && cfg.image?.hoverEffect === 'fade'
                ? 'opacity-70'
                : 'opacity-100 group-hover:scale-103'
            }`}
          />

          {/* Secondary Swap Image on Hover */}
          {isSecondImageHover && (
            <Image
              src={secondaryImage}
              alt={`${productName} alternate`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ease-out ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Badges Overlay */}
        {cfg.badges?.enabled && (
          <div
            className={`absolute z-10 flex flex-col gap-1 pointer-events-none ${
              cfg.badges.position === 'top-left'
                ? 'top-2.5 left-2.5'
                : cfg.badges.position === 'top-right'
                ? 'top-2.5 right-2.5'
                : cfg.badges.position === 'bottom-left'
                ? 'bottom-2.5 left-2.5'
                : 'bottom-2.5 right-2.5'
            }`}
          >
            {/* Discount Badge */}
            {cfg.badges.showDiscount && product.compareAtPrice && product.compareAtPrice > product.price && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[var(--theme-color-error,#E11D48)] text-white shadow-xs ${
                  cfg.badges.style === 'pill'
                    ? 'rounded-full'
                    : cfg.badges.style === 'glass'
                    ? 'backdrop-blur-md bg-rose-600/85 rounded'
                    : 'rounded'
                }`}
              >
                {cfg.badges.discountFormat === 'amount'
                  ? `-₹${product.compareAtPrice - product.price}`
                  : `-${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%`}
              </span>
            )}

            {/* New Badge */}
            {cfg.badges.showNew && (product.isNewArrival || (product as any).isNew || product.badge === 'NEW') && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[var(--theme-color-primary,#111827)] text-white shadow-xs ${
                  cfg.badges.style === 'pill' ? 'rounded-full' : 'rounded'
                }`}
              >
                NEW
              </span>
            )}

            {/* Sold Out Badge */}
            {cfg.badges.showSoldOut && (product as any).inStock === false && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-zinc-600 text-white shadow-xs ${
                  cfg.badges.style === 'pill' ? 'rounded-full' : 'rounded'
                }`}
              >
                SOLD OUT
              </span>
            )}

            {/* Custom Badges */}
            {(cfg.badges.customBadges || []).map((cb) => (
              <span
                key={cb.id}
                className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs ${
                  cfg.badges.style === 'pill' ? 'rounded-full' : 'rounded'
                }`}
                style={{ backgroundColor: cb.bgColor, color: cb.textColor }}
              >
                {cb.text}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        {cfg.wishlist?.enabled && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-black/10 flex items-center justify-center transition-all shadow-xs hover:scale-110 active:scale-95 cursor-pointer ${
              cfg.wishlist.position === 'top-left'
                ? 'top-2.5 left-2.5'
                : cfg.wishlist.position === 'bottom-right'
                ? 'bottom-2.5 right-2.5'
                : 'top-2.5 right-2.5'
            }`}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            style={{
              color: isSaved ? (cfg.wishlist.activeColor || '#E11D48') : (cfg.wishlist.color || '#111827'),
            }}
          >
            <Heart
              className="w-4 h-4 transition-colors"
              style={{
                fill: isSaved ? (cfg.wishlist.activeColor || '#E11D48') : 'transparent',
                color: isSaved ? (cfg.wishlist.activeColor || '#E11D48') : (cfg.wishlist.color || '#111827'),
              }}
            />
          </button>
        )}

        {/* Floating Add to Cart Button (When style === 'floating') */}
        {cfg.addToCart?.enabled && cfg.addToCart.style === 'floating' && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, selectedColor || product.colors?.[0]?.name || 'Standard', 'M', 1);
            }}
            className={`absolute bottom-3 inset-x-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer ${cartVariantClass} ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
            style={{ borderRadius: cfg.addToCart.borderRadius || '8px' }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{cfg.addToCart.text || 'Add to Bag'}</span>
          </button>
        )}

        {/* Quick Sizes Bottom Reveal Drawer */}
        {showQuickSizes && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 z-20 border-t border-black/10 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Select Size</span>
              <button
                onClick={() => setShowQuickSizes(false)}
                className="text-slate-500 hover:text-black text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(product.sizes || []).map((sObj) => {
                const sName = typeof sObj === 'string' ? sObj : sObj.size;
                return (
                  <button
                    key={sName}
                    onClick={() => handleQuickAdd(sName)}
                    className="py-1.5 text-xs font-bold border border-black/15 hover:border-black hover:bg-[var(--theme-btn-primary-bg,var(--theme-color-primary,#111111))] hover:text-white rounded transition-colors text-slate-900 cursor-pointer"
                  >
                    {sName}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        className="flex-1 flex flex-col justify-between space-y-2"
        style={{ textAlign: cfg.layout?.contentAlignment || 'left' }}
      >
        <div className="space-y-1">
          {/* Brand */}
          {cfg.brand?.enabled && (
            <span
              className="text-[10px] font-bold block"
              style={{
                color: cfg.brand.color || '#71717A',
                fontSize: cfg.brand.fontSize || '11px',
                textTransform: cfg.brand.textTransform || 'uppercase',
              }}
            >
              {(product as any).brand || activeTenant.name || 'Store'}
            </span>
          )}

          {/* Title */}
          {cfg.title?.enabled && (
            <Link href={productUrl} className="block group/title">
              <h3
                className={`font-semibold transition-colors ${
                  cfg.title.maxLines === 1
                    ? 'truncate'
                    : cfg.title.maxLines === 2
                    ? 'line-clamp-2'
                    : cfg.title.maxLines === 3
                    ? 'line-clamp-3'
                    : ''
                }`}
                style={{
                  fontSize: cfg.title.fontSize || '14px',
                  fontWeight: cfg.title.fontWeight || '600',
                  color: cfg.title.color || 'var(--theme-color-heading, #18181B)',
                  lineHeight: '1.3',
                }}
                onMouseEnter={(e) => {
                  if (cfg.title.hoverColor) e.currentTarget.style.color = cfg.title.hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = cfg.title.color || 'var(--theme-color-heading, #18181B)';
                }}
              >
                {productName}
              </h3>
            </Link>
          )}

          {/* Ratings */}
          {cfg.rating?.enabled && (
            <div className="flex items-center gap-1.5 text-xs pt-0.5">
              <div className="flex items-center" style={{ color: cfg.rating.starColor || '#F59E0B' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-3 h-3"
                    style={{
                      width: cfg.rating.starSize || '14px',
                      height: cfg.rating.starSize || '14px',
                      fill: s <= Math.round(product.rating || 5) ? (cfg.rating.starColor || '#F59E0B') : 'transparent',
                      color: s <= Math.round(product.rating || 5) ? (cfg.rating.starColor || '#F59E0B') : '#CBD5E1',
                    }}
                  />
                ))}
              </div>
              {cfg.rating.showCount && (
                <span className="text-[11px] text-slate-400 font-sans">
                  ({product.reviewCount || 48})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {cfg.price?.enabled && (
            <div className="pt-0.5">
              <PriceDisplay
                price={product.price}
                compareAtPrice={cfg.price.showCompareAt ? product.compareAtPrice : undefined}
                size="sm"
              />
            </div>
          )}

          {/* Color Swatches */}
          {cfg.variants?.enabled && cfg.variants.displayType === 'color_swatches' && product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.slice(0, cfg.variants.maxVisible || 4).map((c, i) => {
                const shapeClass =
                  cfg.variants?.swatchShape === 'square'
                    ? 'rounded-none'
                    : cfg.variants?.swatchShape === 'rounded'
                    ? 'rounded-sm'
                    : 'rounded-full';

                const isSelected = selectedColor === c.name;
                const swatchSize = cfg.variants?.swatchSize || '14px';

                return (
                  <button
                    key={i}
                    className={`border border-black/20 transition-transform cursor-pointer ${shapeClass} ${
                      isSelected
                        ? 'ring-2 ring-offset-1 ring-[var(--theme-color-accent,#10B981)] scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      width: swatchSize,
                      height: swatchSize,
                    }}
                    title={c.name}
                    onClick={() => handleSwatchClick(c)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button (When not floating) */}
        {cfg.addToCart?.enabled && cfg.addToCart.style !== 'floating' && (
          <div className="pt-2">
            {cfg.addToCart.style === 'icon_only' ? (
              <div className="flex justify-end">
                <button
                  onClick={() => addItem(product, selectedColor || product.colors?.[0]?.name || 'Standard', 'M', 1)}
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${cartVariantClass}`}
                  title={cfg.addToCart.text || 'Add to Bag'}
                  style={{ borderRadius: cfg.addToCart.borderRadius || '9999px' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (cfg.addToCart.style === 'quick_sizes') {
                    setShowQuickSizes(true);
                  } else {
                    addItem(product, selectedColor || product.colors?.[0]?.name || 'Standard', 'M', 1);
                  }
                }}
                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${cartVariantClass}`}
                style={{
                  borderRadius: cfg.addToCart.borderRadius || '8px',
                  fontSize: cfg.addToCart.fontSize,
                  padding: cfg.addToCart.padding,
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{cfg.addToCart.text || 'Add to Bag'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
