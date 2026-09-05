'use client';

import React, { useState } from 'react';
import {
  Heart,
  Share2,
  ShoppingBag,
  Zap,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock,
  Copy,
  Package,
  Sparkles,
} from 'lucide-react';
import {
  PurchasePanelConfig,
  NormalizedProduct,
  PurchaseElementKey,
} from '@/types/pdp-template.types';
import { ProductVariantSelector } from './ProductVariantSelector';
import { PincodeChecker } from '../PincodeChecker';
import { formatCurrency } from '@/lib/utils';

export interface ProductPurchasePanelProps {
  product: NormalizedProduct;
  config: PurchasePanelConfig;
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onOpenSizeGuide?: () => void;
  onAddToCart?: (qty: number) => void;
  onBuyNow?: (qty: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  className?: string;
}

export function ProductPurchasePanel({
  product,
  config,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onOpenSizeGuide,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist,
  className = '',
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Format currency helper
  const formatMoney = (amount: number) => {
    return formatCurrency(amount);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity);
    }
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(quantity);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Curated badges (store badges + discount, up to 4)
  const curatedBadges = (product.badges || []).slice(0, 4);

  // Helper for badge color accents
  const getBadgeStyle = (badge: string) => {
    const lower = badge.toLowerCase();
    if (lower.includes('%') || lower.includes('off') || lower.includes('sale')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (lower.includes('featured')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (lower.includes('new') || lower.includes('drop')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (lower.includes('best') || lower.includes('seller') || lower.includes('popular')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  // Render element by key
  const renderElement = (key: PurchaseElementKey) => {
    switch (key) {
      case 'badges':
        if (config.showBadges === false || curatedBadges.length === 0) return null;
        return (
          <div key="badges" className="flex items-center gap-2 flex-wrap">
            {curatedBadges.map((badge, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${getBadgeStyle(
                  badge
                )}`}
              >
                {badge.toLowerCase().includes('featured') && <Sparkles className="w-3 h-3 text-indigo-600" />}
                {badge.toLowerCase().includes('new') && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />}
                {badge.toLowerCase().includes('best') && <Star className="w-3 h-3 fill-amber-500 text-amber-500" />}
                <span>{badge}</span>
              </span>
            ))}
          </div>
        );

      case 'brand':
        if (!config.showBrand || !product.brand) return null;
        return (
          <div key="brand" className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {product.brand.name}
          </div>
        );

      case 'title':
        if (!config.showTitle) return null;
        return (
          <h1 key="title" className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-snug">
            {product.title}
          </h1>
        );

      case 'rating':
        if (!config.showRating || !product.rating) return null;
        return (
          <div key="rating" className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-900">
              {product.rating}
            </span>
            {config.showReviewCount && product.reviewCount && (
              <span className="text-xs text-slate-400 font-normal">
                ({product.reviewCount} Verified Reviews)
              </span>
            )}
          </div>
        );

      case 'price':
        if (!config.showPrice) return null;
        return (
          <div key="price" className="space-y-2 py-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
                {formatMoney(product.price)}
              </span>

              {config.showComparePrice && product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base line-through text-slate-400 font-sans">
                  {formatMoney(product.compareAtPrice)}
                </span>
              )}

              {config.showDiscount && product.discountPercent && product.discountPercent > 0 && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  {config.discountFormat === 'percentage'
                    ? `${product.discountPercent}% OFF`
                    : `Save ${formatMoney((product.compareAtPrice || 0) - product.price)}`}
                </span>
              )}
            </div>

            {/* Product Short Description */}
            {(product.shortDescription || product.subtitle) && (
              <p className="text-sm text-slate-600 leading-relaxed font-normal pt-0.5">
                {product.shortDescription || product.subtitle}
              </p>
            )}
          </div>
        );

      case 'discount':
        // Rendered together with price
        return null;

      case 'colorSwatches':
      case 'sizeSelector':
      case 'sizeGuide':
        if (key === 'colorSwatches') {
          return (
            <ProductVariantSelector
              key="variants"
              colors={product.colors}
              sizes={product.sizes}
              variants={product.variants}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={onColorChange}
              onSizeChange={onSizeChange}
              onOpenSizeGuide={onOpenSizeGuide}
              colorDisplayType={config.colorDisplayType}
              sizeDisplayType={config.sizeDisplayType}
              showSizeGuide={true}
            />
          );
        }
        return null;

      case 'stockUrgency':
        if (!config.showLowStockWarning) return null;
        if (product.stockCount <= config.lowStockThreshold && product.stockCount > 0) {
          return (
            <div key="stockUrgency" className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {config.lowStockMessage.replace('{{quantity}}', String(product.stockCount))}
              </span>
            </div>
          );
        }
        return null;

      case 'quantity':
        if (!config.showQuantitySelector) return null;
        return (
          <div key="quantity" className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quantity
            </span>
            <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors font-bold cursor-pointer"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold text-slate-900 font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        );

      case 'addToCart':
      case 'buyNow':
        if (key === 'addToCart') {
          return (
            <div key="actions" className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {config.showAddToCart && (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isAddedToCart
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0A0D14] hover:bg-rose-600 text-white'
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                )}

                {config.showBuyNow && (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Instant Buy</span>
                  </button>
                )}
              </div>

              {/* Wishlist and Share */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {config.showWishlist && onToggleWishlist && (
                  <button
                    type="button"
                    onClick={onToggleWishlist}
                    className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'text-rose-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                )}

                {config.showShare && (
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                )}
              </div>
            </div>
          );
        }
        return null;

      case 'shipping':
        if (config.showShippingInfo === false) return null;
        return (
          <div key="shipping" className="space-y-3 pt-3 border-t border-[#EFE8E2]">
            {config.deliveryEstimatorEnabled && <PincodeChecker />}

            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {config.shippingText
                  ? config.shippingText.replace(/\$100/g, "₹999").replace(/\$50/g, "₹499")
                  : "Free express shipping on all orders above ₹999"}
              </span>
            </div>

            {/* Product Shipping Details */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#EFE8E2]">
                <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Package Weight</span>
                  <span className="font-bold text-slate-900">
                    {product.shipping?.weightKg ? `${product.shipping.weightKg} kg` : '0.4 kg'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#EFE8E2]">
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Delivery Mode</span>
                  <span className="font-bold text-emerald-700">
                    {product.shipping?.isExpressAvailable !== false ? 'Express Air (24h)' : 'Standard (48h)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'returns':
        if (!config.showReturnsInfo) return null;
        return (
          <div key="returns" className="flex items-center gap-2.5 text-xs text-slate-600">
            <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{config.returnPolicyText}</span>
          </div>
        );

      case 'sku':
        if (!config.showSKU || !product.sku) return null;
        return (
          <div key="sku" className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200">
            SKU: {product.sku}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`space-y-5 p-7 rounded-3xl bg-[#FAF7F5] border border-[#EFE8E2] text-slate-900 shadow-xs ${
        config.stickyDesktop ? 'sticky top-24' : ''
      } ${className}`}
    >
      {/* Ordered Elements Pipeline */}
      {config.elementsOrder.map((key) => renderElement(key))}

      {/* Trust Badges */}
      {config.trustBadges && config.trustBadges.filter((b) => b.enabled).length > 0 && (
        <div className="pt-4 border-t border-[#EFE8E2] grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.trustBadges
            .filter((b) => b.enabled)
            .map((b) => (
              <div key={b.id} className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Share this Creation</h3>
            <p className="text-xs text-slate-500">{product.title}</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="w-full px-3 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200 text-slate-700 font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(false)}
              className="w-full py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
