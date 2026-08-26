'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { CartSummary as CartSummaryType } from '@/types/cart';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function CartSummary({ summary }: { summary: CartSummaryType }) {
  const { couponCode, applyCoupon, removeCoupon } = useCart();
  const [inputCoupon, setInputCoupon] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsApplying(true);
    await applyCoupon(inputCoupon.trim());
    setIsApplying(false);
    setInputCoupon('');
  };

  return (
    <div className="bg-[#FAF6F2] border border-[#E8DED8] p-6 lg:p-8 space-y-6 select-none">
      <h3 className="text-lg font-serif font-bold text-[#111111] pb-3 border-b border-[#E8DED8]">
        Order Summary
      </h3>

      {/* Coupon Application Form */}
      <div>
        {couponCode ? (
          <div className="flex items-center justify-between p-3 bg-[#FFFDFC] border border-[#B77A68]/40 text-xs">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#B77A68]" />
              <div>
                <span className="font-bold text-[#111111] uppercase tracking-wider block">
                  {couponCode}
                </span>
                <span className="text-[#777777] text-[11px]">Promo discount applied</span>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs text-[#C98282] font-semibold hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              value={inputCoupon}
              onChange={(e) => setInputCoupon(e.target.value)}
              placeholder="Promo Code (e.g. JQTRENDS10)"
              className="flex-1 px-3 py-2.5 text-xs uppercase bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
            />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={isApplying}
              disabled={!inputCoupon.trim()}
            >
              Apply
            </Button>
          </form>
        )}
      </div>

      {/* Summary Line Items */}
      <div className="space-y-3 text-xs md:text-sm">
        <div className="flex justify-between text-[#777777]">
          <span>Subtotal ({summary.totalItemCount} items)</span>
          <span className="text-[#111111] font-semibold">{formatCurrency(summary.subtotal)}</span>
        </div>

        {summary.discountTotal > 0 && (
          <div className="flex justify-between text-[#C98282] font-semibold">
            <span>Coupon Discount</span>
            <span>- {formatCurrency(summary.discountTotal)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#777777]">
          <span>Shipping Fee</span>
          <span>
            {summary.shippingFee === 0 ? (
              <strong className="text-[#B77A68] uppercase font-bold">FREE</strong>
            ) : (
              formatCurrency(summary.shippingFee)
            )}
          </span>
        </div>

        <div className="flex justify-between text-[#777777]">
          <span>Estimated Taxes (GST)</span>
          <span className="text-[#111111]">Inclusive</span>
        </div>

        <div className="flex justify-between text-base md:text-lg font-bold text-[#111111] pt-3 border-t border-[#E8DED8]">
          <span>Total Payable</span>
          <span>{formatCurrency(summary.grandTotal)}</span>
        </div>
      </div>

      {/* Checkout CTA Button */}
      <div className="pt-2 space-y-3">
        <Link href="/checkout" className="block w-full">
          <Button variant="luxury-gold" size="lg" className="w-full justify-between group">
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <Link href="/women" className="block text-center text-xs text-[#777777] hover:text-[#111111] underline underline-offset-2">
          Continue Shopping
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-[#E8DED8] space-y-2 text-xs text-[#777777]">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#B77A68]" />
          <span>Free delivery on prepaid orders above ₹999</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#B77A68]" />
          <span>7-day easy exchange &amp; return policy</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#B77A68]" />
          <span>100% Secure Checkout with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
