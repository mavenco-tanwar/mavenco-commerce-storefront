'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { resolveTenant } from '@/lib/tenant-config';
import { ProductCardConfig } from '@/types/product-card.types';
import { getDefaultProductCardConfig } from '@/lib/product-card-presets';

export interface ProductCardProps {
  product: Product;
  config?: Partial<ProductCardConfig>;
  className?: string;
}

export function ProductCard({ product, config: customConfig, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const activeTenant = resolveTenant();
  const productUrl = `/products/${product.slug}${
    activeTenant.slug && activeTenant.slug !== 'demo'
      ? `?tenant=${activeTenant.slug}`
      : ''
  }`;

  const cfg: ProductCardConfig = {
    ...getDefaultProductCardConfig(activeTenant.slug || 'lumina'),
    ...(customConfig || {}),
  };

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const handleQuickAdd = (size: string) => {
    addItem(product, selectedColor || product.colors?.[0]?.name || 'Standard', size, 1);
    setShowQuickSizes(false);
  };

  const getAspectClass = (ratio: string) => {
    switch (ratio) {
      case '1/1':
        return 'aspect-square';
      case '4/5':
        return 'aspect-4/5';
      case '3/4':
        return 'aspect-3/4';
      case '4/3':
        return 'aspect-4/3';
      case '16/9':
        return 'aspect-video';
      default:
        return 'aspect-3/4';
    }
  };

  return (
    <div
      className={`group flex flex-col transition-all duration-300 relative select-none ${
        cfg.card.hoverLift ? 'hover:-translate-y-1' : ''
      } ${className}`}
      style={{
        backgroundColor: cfg.card.background || 'var(--theme-card-bg, #FFFFFF)',
        borderRadius: cfg.card.borderRadius || 'var(--theme-card-radius, 12px)',
        borderColor: cfg.card.borderColor || 'var(--theme-card-border, #E8DED8)',
        borderWidth: cfg.card.borderWidth || '1px',
        borderStyle: 'solid',
        boxShadow: cfg.card.shadow || 'var(--theme-card-shadow, 0 1px 3px rgba(0,0,0,0.05))',
        padding: cfg.layout.padding || '14px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Top Media Container */}
      <div
        className={`relative w-full ${getAspectClass(cfg.image.aspectRatio)} overflow-hidden bg-[#FAF6F2] mb-3`}
        style={{ borderRadius: cfg.image.borderRadius || 'var(--theme-radius-md, 8px)' }}
      >
        <Link href={productUrl} className="relative block w-full h-full">
          <Image
            src={isHovered && cfg.image.hoverEffect === 'second_image' ? secondaryImage : primaryImage}
            alt={product.name || 'Product Image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered && cfg.image.hoverEffect === 'zoom' ? 'scale-108' : 'group-hover:scale-104'
            }`}
          />
        </Link>

        {/* Badge Overlay */}
        {cfg.badges.enabled && (
          <div
            className={`absolute z-10 flex flex-col gap-1 ${
              cfg.badges.position === 'top-left'
                ? 'top-2.5 left-2.5'
                : cfg.badges.position === 'top-right'
                ? 'top-2.5 right-2.5'
                : 'bottom-2.5 left-2.5'
            }`}
          >
            {product.badge && (
              <span
                className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  cfg.badges.style === 'pill' ? 'rounded-full' : 'rounded'
                } ${
                  product.badge === 'Sale' || product.badge === 'SALE'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-950 text-white'
                }`}
              >
                {product.badge}
              </span>
            )}
            {Boolean(product.discountPercent && product.discountPercent > 0) && !product.badge && cfg.badges.showDiscount && (
              <span
                className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white ${
                  cfg.badges.style === 'pill' ? 'rounded-full' : 'rounded'
                }`}
              >
                {product.discountPercent}% OFF
              </span>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        {cfg.wishlist.enabled && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#E8DED8] flex items-center justify-center text-[#111111] hover:text-[#B77A68] hover:scale-110 active:scale-95 transition-all shadow-xs"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-rose-600 text-rose-600' : 'text-[#111111]'
              }`}
            />
          </button>
        )}

        {/* Quick Sizes Bottom Reveal Drawer */}
        {showQuickSizes && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 z-20 border-t border-[#E8DED8] animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Select Size</span>
              <button onClick={() => setShowQuickSizes(false)} className="text-[#777777] hover:text-black text-xs font-bold">
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
                    className="py-1.5 text-xs font-bold border border-[#E8DED8] hover:border-[#B77A68] hover:bg-[#B77A68] hover:text-white rounded transition-colors text-[#111111]"
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
      <div className="flex-1 flex flex-col justify-between space-y-2" style={{ textAlign: cfg.layout.contentAlignment }}>
        <div className="space-y-1">
          {/* Brand */}
          {cfg.brand.enabled && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider block"
              style={{ color: cfg.brand.color || '#71717A' }}
            >
              {(product as any).brand || 'Atelier Collection'}
            </span>
          )}

          {/* Title */}
          {cfg.title.enabled && (
            <Link href={productUrl} className="block group/title">
              <h3
                className={`font-semibold text-slate-900 group-hover/title:text-rose-600 transition-colors ${
                  cfg.title.maxLines === 1
                    ? 'truncate'
                    : cfg.title.maxLines === 2
                    ? 'line-clamp-2'
                    : cfg.title.maxLines === 3
                    ? 'line-clamp-3'
                    : ''
                }`}
                style={{ fontSize: cfg.title.fontSize || '14px', lineHeight: '1.3' }}
              >
                {product.name}
              </h3>
            </Link>
          )}

          {/* Rating */}
          {cfg.rating.enabled && (
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= Math.round(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              {cfg.rating.showCount && (
                <span className="text-[11px] text-slate-400 font-sans">({product.reviewCount || 48})</span>
              )}
            </div>
          )}

          {/* Price */}
          {cfg.price.enabled && (
            <div className="pt-0.5">
              <PriceDisplay
                price={product.price}
                compareAtPrice={cfg.price.showCompareAt ? product.compareAtPrice : undefined}
                size="sm"
              />
            </div>
          )}

          {/* Color Swatches */}
          {cfg.variants.enabled && cfg.variants.displayType === 'color_swatches' && product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.slice(0, cfg.variants.maxVisible || 4).map((c, i) => (
                <button
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border border-slate-300 transition-transform ${
                    selectedColor === c.name ? 'ring-2 ring-rose-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  onClick={() => setSelectedColor(c.name)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {cfg.addToCart.enabled && (
          <div className="pt-2">
            <button
              onClick={() => {
                if (cfg.addToCart.style === 'quick_sizes') {
                  setShowQuickSizes(true);
                } else {
                  addItem(product, selectedColor || product.colors?.[0]?.name || 'Standard', 'M', 1);
                }
              }}
              className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              style={{ borderRadius: cfg.addToCart.borderRadius || '8px' }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{cfg.addToCart.text || 'Add to Bag'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
