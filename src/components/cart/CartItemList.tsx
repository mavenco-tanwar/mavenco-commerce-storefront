'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Heart } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { formatTenantHref, formatProductHref } from '@/lib/tenant-config';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export function CartItemList({ items }: { items: CartItem[] }) {
  const { removeItem, updateQuantity } = useCart();
  const { toggleWishlist } = useWishlist();

  const handleMoveToWishlist = (item: CartItem) => {
    toggleWishlist(item.product);
    removeItem(item.id);
  };

  return (
    <div className="divide-y divide-[#E8DED8] border-y border-[#E8DED8]">
      {items.map((item) => (
        <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 group">
          {/* Thumbnail */}
          <Link
            href={formatProductHref(item.product.slug, item.product.category)}
            className="relative w-24 sm:w-28 aspect-3/4 bg-[#FAF6F2] border border-[#E8DED8] overflow-hidden shrink-0"
          >
            {item.product.images[0] && (
              <Image
                src={item.product.images[0].url}
                alt={item.product.name}
                fill
                sizes="120px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </Link>

          {/* Details & Actions */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                    {item.product.categoryName}
                  </span>
                  <Link
                    href={formatProductHref(item.product.slug, item.product.category)}
                    className="block text-sm sm:text-base font-serif font-bold text-[#111111] hover:text-[#B77A68] transition-colors mt-0.5"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-[#777777] mt-1 font-sans">
                    <span>Size: <strong className="text-[#111111]">{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-[#111111]">{item.selectedColor}</strong></span>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:text-right">
                  <PriceDisplay
                    price={item.unitPrice}
                    compareAtPrice={item.product.compareAtPrice}
                    size="md"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Controls & Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8DED8]/60">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#777777] hidden sm:inline">
                  Qty:
                </span>
                <QuantitySelector
                  quantity={item.quantity}
                  onChange={(qty) => updateQuantity(item.id, qty)}
                  size="sm"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <button
                  onClick={() => handleMoveToWishlist(item)}
                  className="text-[#777777] hover:text-[#B77A68] flex items-center gap-1.5 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Save for Later</span>
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#777777] hover:text-[#C98282] flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
