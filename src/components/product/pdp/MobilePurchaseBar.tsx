'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Zap } from 'lucide-react';
import { NormalizedProduct } from '@/types/pdp-template.types';

export interface MobilePurchaseBarProps {
  product: NormalizedProduct;
  selectedColor?: string;
  selectedSize?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  enabled?: boolean;
}

export function MobilePurchaseBar({
  product,
  selectedColor,
  selectedSize,
  onAddToCart,
  onBuyNow,
  enabled = true,
}: MobilePurchaseBarProps) {
  if (!enabled) return null;

  const thumb = product.media[0]?.url || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl safe-bottom">
      <div className="flex items-center justify-between gap-3">
        {/* Product Thumbnail + Price Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-13 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100">
            <Image
              src={thumb}
              alt={product.title}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {product.title}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                ${product.price.toLocaleString()}
              </span>
              {(selectedColor || selectedSize) && (
                <span className="text-[10px] text-slate-400 truncate">
                  {[selectedColor, selectedSize].filter(Boolean).join(' / ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddToCart}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={onBuyNow}
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
