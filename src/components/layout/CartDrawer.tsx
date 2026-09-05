'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowRight, Tag, Heart, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { FreeShippingBar } from '@/components/cart/FreeShippingBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { formatTenantHref, formatProductHref, resolveTenant, resolveActiveTenantSlug } from '@/lib/tenant-config';

export function CartDrawer() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams);
  const activeTenant = resolveTenant(activeTenantSlug);

  const {
    items,
    summary,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(inputCoupon.trim());
    setIsApplyingCoupon(false);
    setInputCoupon('');
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    toggleWishlist(item.product);
    removeItem(item.id);
  };

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title="Your Shopping Bag"
      subtitle={summary.totalItemCount > 0 ? `${summary.totalItemCount} items selected` : undefined}
      headerAction={
        summary.totalItemCount > 0 ? (
          <span className="text-xs font-bold px-2 py-0.5 bg-[#F8F1EA] border border-[#E8DED8] text-[#111111]">
            {summary.totalItemCount}
          </span>
        ) : null
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your Bag is Empty"
          description="Looks like you haven't added any beautiful pieces yet. Discover our new arrivals and trending collections."
          actionText="Explore New Arrivals"
          actionHref={formatTenantHref('/new-arrivals', activeTenant.slug)}
          onActionClick={closeDrawer}
        />
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Top: Free shipping meter & items list */}
          <div className="space-y-4">
            <FreeShippingBar
              subtotal={summary.subtotal}
              threshold={summary.freeShippingThreshold}
            />

            {/* Cart Items List */}
            <div className="divide-y divide-[#E8DED8]">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 group">
                  {/* Thumbnail */}
                  <Link
                    href={formatProductHref(item.product.slug, item.product.category, activeTenant.slug)}
                    onClick={closeDrawer}
                    className="relative w-20 aspect-3/4 shrink-0 overflow-hidden bg-[#FAF6F2] border border-[#E8DED8]"
                  >
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </Link>

                  {/* Info & Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={formatProductHref(item.product.slug, item.product.category)}
                          onClick={closeDrawer}
                          className="text-xs md:text-sm font-semibold text-[#111111] hover:text-[#B77A68] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#777777] hover:text-[#C98282] p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#777777]">
                        <span>Size: <strong className="text-[#111111]">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-[#111111]">{item.selectedColor}</strong></span>
                      </div>

                      <div className="mt-1.5">
                        <PriceDisplay
                          price={item.unitPrice}
                          compareAtPrice={item.product.compareAtPrice}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Quantity & Move to Wishlist */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DED8]/40">
                      <QuantitySelector
                        quantity={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                        size="sm"
                      />

                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-[11px] text-[#777777] hover:text-[#B77A68] flex items-center gap-1 font-medium"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Coupon, Totals & Checkout Actions */}
          <div className="mt-6 pt-4 border-t border-[#E8DED8] space-y-4 bg-[#FFFDFC]">
            {/* Coupon input */}
            {couponCode ? (
              <div className="flex items-center justify-between p-2.5 bg-[#FAF6F2] border border-[#B77A68]/40 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#B77A68]" />
                  <span>
                    Code <strong className="text-[#B77A68] uppercase">{couponCode}</strong> applied!
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-[#C98282] font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Coupon code (e.g. JQTRENDS10)"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-[#FAF6F2] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] font-sans"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isApplyingCoupon}
                  disabled={!inputCoupon.trim()}
                >
                  Apply
                </Button>
              </form>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#777777]">
                <span>Bag Subtotal</span>
                <span className="text-[#111111] font-semibold">{formatCurrency(summary.subtotal)}</span>
              </div>

              {summary.discountTotal > 0 && (
                <div className="flex justify-between text-[#C98282] font-medium">
                  <span>Coupon Discount</span>
                  <span>- {formatCurrency(summary.discountTotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#777777]">
                <span>Shipping</span>
                <span>
                  {summary.shippingFee === 0 ? (
                    <strong className="text-[#B77A68] uppercase font-bold">FREE</strong>
                  ) : (
                    formatCurrency(summary.shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm md:text-base font-bold text-[#111111] pt-2 border-t border-[#E8DED8]">
                <span>Estimated Total</span>
                <span className="text-[#111111]">{formatCurrency(summary.grandTotal)}</span>
              </div>
              <p className="text-[10px] text-[#777777]">
                Inclusive of all taxes • Easy 7-day doorstep return
              </p>
            </div>

            {/* Checkout & View Bag CTAs */}
            <div className="space-y-2 pt-1">
              <Link href={formatTenantHref('/checkout')} onClick={closeDrawer} className="block w-full">
                <Button variant="luxury-gold" size="lg" className="w-full justify-between group">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href={formatTenantHref('/cart')} onClick={closeDrawer} className="block w-full">
                <Button variant="outline" size="md" className="w-full">
                  View Full Bag
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777777] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B77A68]" />
              <span>100% Safe & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
