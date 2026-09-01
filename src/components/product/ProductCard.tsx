'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);
  const primaryImage = product.images[0]?.url || '';
  const secondaryImage = product.images[1]?.url || primaryImage;

  const handleQuickAdd = (size: string) => {
    addItem(product, selectedColor || product.colors[0]?.name || 'Standard', size, 1);
    setShowQuickSizes(false);
  };

  const getBadgeVariant = (badgeText?: string) => {
    switch (badgeText) {
      case 'Sale':
        return 'sale';
      case 'New':
        return 'new';
      case 'Trending':
        return 'trending';
      case 'Best Seller':
        return 'bestseller';
      case 'Studio Exclusive':
        return 'exclusive';
      default:
        return 'neutral';
    }
  };

  return (
    <div
      className={`group flex flex-col bg-[#FFFDFC] border border-[#E8DED8]/70 hover:border-[#B77A68]/60 luxury-card-shadow luxury-card-shadow-hover relative select-none transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-3/4 overflow-hidden bg-[#FAF6F2]">
        <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name || 'Product Image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.badge && (
            <Badge variant={getBadgeVariant(product.badge)} size="sm">
              {product.badge}
            </Badge>
          )}
          {Boolean(product.discountPercent && product.discountPercent > 0) && !product.badge && (
            <Badge variant="sale" size="sm">
              {product.discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#FFFDFC]/90 backdrop-blur-xs border border-[#E8DED8] flex items-center justify-center text-[#111111] hover:text-[#B77A68] hover:scale-110 active:scale-95 transition-all shadow-xs"
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-[#C98282] text-[#C98282]' : 'text-[#111111]'
            }`}
          />
        </button>

        {/* Desktop Quick Add Bar / Size Reveal */}
        <div className="absolute bottom-0 inset-x-0 z-20 transition-all duration-300">
          {!showQuickSizes ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickSizes(true);
              }}
              className="w-full py-2.5 bg-[#111111]/90 hover:bg-[#111111] text-[#FFFDFC] text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 backdrop-blur-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          ) : (
            <div className="bg-[#FFFDFC] border-t border-[#E8DED8] p-2 animate-in slide-in-from-bottom-2 duration-200">
              <p className="text-[10px] uppercase font-bold text-[#777777] text-center mb-1.5 tracking-wider">
                Select Size
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={!s.inStock}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickAdd(s.size);
                    }}
                    className={`text-[11px] font-bold px-2 py-1 border transition-all ${
                      s.inStock
                        ? 'border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FFFDFC]'
                        : 'border-[#E8DED8] text-[#999999] opacity-40 cursor-not-allowed line-through'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B77A68]">
              {product.categoryName}
            </span>

            {/* Color Swatch Dots */}
            {product.colors.length > 1 && (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(c.name);
                    }}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      selectedColor === c.name
                        ? 'ring-1 ring-offset-1 ring-[#B77A68] border-black scale-110'
                        : 'border-[#E8DED8]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-[#111111] hover:text-[#B77A68] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-1">
            <RatingStars rating={product.rating} size="xs" showCount count={product.reviewCount} />
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-2.5 pt-2 border-t border-[#E8DED8]/60 flex items-center justify-between">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
            showDiscountBadge={false}
          />
        </div>
      </div>
    </div>
  );
}
