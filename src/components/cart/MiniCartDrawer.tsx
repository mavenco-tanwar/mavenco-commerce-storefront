'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { FreeShippingProgress } from './FreeShippingProgress';

export function MiniCartDrawer() {
  const {
    items,
    summary,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    try {
      const res = await applyCoupon(couponInput.trim());
      if (res.success) {
        setCouponMsg({ type: 'success', text: res.message });
      } else {
        setCouponMsg({ type: 'error', text: res.message });
      }
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDFC] text-slate-900 shadow-2xl flex flex-col justify-between border-l border-[#EFE8E2] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#EFE8E2] flex items-center justify-between bg-[#FAF7F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Shopping Bag
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {summary.totalItemCount} {summary.totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-4 border-b border-[#EFE8E2]">
            <FreeShippingProgress
              subtotal={summary.subtotal}
              threshold={summary.freeShippingThreshold}
            />
          </div>

          {/* Items List (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our curated collections of luxury couture, dresses, and co-ords.
                </p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const imgUrl =
                  typeof item.product?.images?.[0] === 'string'
                    ? item.product.images[0]
                    : item.product?.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] flex gap-3.5 items-start"
                  >
                    <div className="relative w-18 h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image
                        src={imgUrl}
                        alt={item.product?.name || 'Product'}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product?.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                        <span>Color: {item.selectedColor}</span>
                        <span>•</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Increment/Decrement */}
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold font-mono text-slate-900">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout CTAs */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EFE8E2] bg-[#FAF7F5] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. LUMINA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 uppercase font-mono text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>

                {couponMsg && (
                  <p
                    className={`text-[11px] font-bold ${
                      couponMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${summary.subtotal.toLocaleString()}
                  </span>
                </div>

                {summary.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo Discount ({summary.couponCode})</span>
                    <span className="font-mono">
                      -${summary.discountTotal.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-mono font-bold text-slate-900">
                    {summary.shippingFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-bold">FREE</span>
                    ) : (
                      `$${summary.shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base font-black">
                    ${summary.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Proceed to Checkout</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Full Bag</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL 256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
