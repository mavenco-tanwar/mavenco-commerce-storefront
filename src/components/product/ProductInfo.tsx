'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { Product } from '@/types/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { SizeGuideModal } from './SizeGuideModal';
import { PincodeChecker } from './PincodeChecker';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

export interface ProductInfoProps {
  product: Product;
  pdpConfig?: {
    stickyBuyBar?: boolean;
    showStockUrgency?: boolean;
    stockThreshold?: number;
    enableDeliveryEstimator?: boolean;
    defaultEstimatedDays?: string;
    enableSizeGuideModal?: boolean;
    enableFabricCareAccordion?: boolean;
    enableArtisanProvenance?: boolean;
    trustBadges?: Array<{ id: string; title: string; desc: string; enabled: boolean }>;
    showFrequentlyBoughtTogether?: boolean;
    showCustomerReviews?: boolean;
    showRelatedProducts?: boolean;
    accentColor?: string;
  };
}

export function ProductInfo({ product, pdpConfig }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find((s) => s.inStock)?.size || product.sizes[0]?.size || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const router = useRouter();

  const isSaved = isInWishlist(product.id);
  const activeSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = !activeSizeObj || !activeSizeObj.inStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addItem(product, selectedColor, selectedSize, quantity);
    setTimeout(() => setIsAdding(false), 400);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedColor, selectedSize, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard', 'info');
    }
  };

  return (
    <div className="flex flex-col space-y-6 select-none">
      {/* Category, SKU & Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            {product.department}&apos;s {product.categoryName}
          </span>
          <span className="text-[11px] text-[#777777] font-mono">
            SKU: {product.sku}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111111] leading-tight">
          {product.name}
        </h1>

        {/* Rating & Review summary */}
        <div className="flex items-center gap-3 mt-3">
          <RatingStars rating={product.rating} size="sm" showCount count={product.reviewCount} />
          <span className="text-xs text-[#777777]">•</span>
          <span className="text-xs text-[#777777] font-medium">
            100% Verified Boutique Quality
          </span>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="p-4 bg-[#FAF6F2] border border-[#E8DED8] flex items-baseline justify-between flex-wrap gap-4">
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="xl"
          showDiscountBadge={true}
        />
        <span className="text-xs text-[#777777]">Inclusive of all taxes</span>
      </div>

      {/* Short Editorial Blurb */}
      <p className="text-xs md:text-sm text-[#777777] leading-relaxed font-sans">
        {product.shortDescription}
      </p>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#111111]">
              Color: <strong className="text-[#B77A68]">{selectedColor}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {product.colors.map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => setSelectedColor(col.name)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${
                  selectedColor === col.name
                    ? 'border-[#111111] bg-[#FFFDFC] shadow-xs'
                    : 'border-[#E8DED8] bg-[#F8F1EA] hover:border-[#777777]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="font-medium text-[#111111]">{col.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection & Size Guide */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-bold tracking-wider text-[#111111]">
            Select Size: <strong className="text-[#B77A68]">{selectedSize}</strong>
          </span>

          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-xs text-[#B77A68] hover:text-[#9A6050] flex items-center gap-1 font-semibold underline underline-offset-2"
          >
            <Ruler className="w-3.5 h-3.5" />
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s.size}
              type="button"
              disabled={!s.inStock}
              onClick={() => setSelectedSize(s.size)}
              className={`min-w-[48px] h-10 px-3 text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center ${
                selectedSize === s.size
                  ? 'border-[#111111] bg-[#111111] text-[#FFFDFC] shadow-sm'
                  : s.inStock
                  ? 'border-[#E8DED8] bg-[#FFFDFC] text-[#111111] hover:border-[#111111]'
                  : 'border-[#E8DED8] bg-[#F8F1EA] text-[#999999] opacity-40 cursor-not-allowed line-through'
              }`}
            >
              {s.size}
            </button>
          ))}
        </div>

        {activeSizeObj && activeSizeObj.stockCount <= 5 && activeSizeObj.inStock && (
          <p className="text-xs text-[#C98282] font-semibold mt-2 animate-pulse">
            🔥 Hurry! Only {activeSizeObj.stockCount} left in stock for size {selectedSize}
          </p>
        )}
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#111111]">
            Quantity:
          </span>
          <QuantitySelector
            quantity={quantity}
            onChange={setQuantity}
            max={activeSizeObj ? activeSizeObj.stockCount : 10}
            size="md"
          />
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={isAdding}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
            className="w-full"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </Button>

          <Button
            type="button"
            variant="luxury-gold"
            size="lg"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            leftIcon={<Zap className="w-4 h-4" />}
            className="w-full"
          >
            Buy Now
          </Button>
        </div>

        {/* Wishlist & Share Secondary Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#B77A68] transition-colors py-1"
          >
            <Heart
              className={`w-4 h-4 ${
                isSaved ? 'fill-[#C98282] text-[#C98282]' : 'text-[#111111]'
              }`}
            />
            <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#111111] transition-colors py-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Indian PIN Code Delivery Checker */}
      <PincodeChecker />

      {/* Trust Signals */}
      {pdpConfig?.trustBadges && pdpConfig.trustBadges.filter((b) => b.enabled).length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 py-4 border-y border-[#E8DED8]">
          {pdpConfig.trustBadges
            .filter((b) => b.enabled)
            .map((badge) => (
              <div key={badge.id} className="p-2.5 bg-[#FAF6F2] rounded-xl border border-[#E8DED8]/60 space-y-0.5 text-xs">
                <div className="font-bold text-[#111111] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{badge.title}</span>
                </div>
                <p className="text-[10px] text-[#777777] line-clamp-1">{badge.desc}</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#E8DED8] text-center text-[11px] text-[#777777]">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-[#B77A68]" />
            <span className="font-semibold text-[#111111]">Free Shipping</span>
            <span>{pdpConfig?.defaultEstimatedDays || 'Orders over ₹999'}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="w-4 h-4 text-[#B77A68]" />
            <span className="font-semibold text-[#111111]">7 Days Return</span>
            <span>Easy doorstep pickup</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#B77A68]" />
            <span className="font-semibold text-[#111111]">100% Genuine</span>
            <span>Pure luxury fabric</span>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        department={product.department}
      />
    </div>
  );
}
