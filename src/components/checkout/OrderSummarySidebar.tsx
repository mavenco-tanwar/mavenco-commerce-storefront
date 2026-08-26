'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, ShieldCheck } from 'lucide-react';
import { CartItem, CartSummary } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export interface OrderSummarySidebarProps {
  items: CartItem[];
  summary: CartSummary;
}

export function OrderSummarySidebar({ items, summary }: OrderSummarySidebarProps) {
  const { couponCode, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  return (
    <div className="bg-[#FAF6F2] border border-[#E8DED8] p-6 lg:p-8 space-y-6 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
        <h3 className="text-base font-serif font-bold text-[#111111]">
          Order Summary ({summary.totalItemCount} items)
        </h3>
      </div>

      {/* Items Mini List */}
      <div className="divide-y divide-[#E8DED8] max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex gap-3">
            <div className="relative w-14 aspect-3/4 bg-[#FFFDFC] border border-[#E8DED8] overflow-hidden shrink-0">
              {item.product.images[0] && (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              )}
              <span className="absolute top-0 right-0 bg-[#111111] text-white text-[9px] font-bold px-1 rounded-bl-sm">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-semibold text-[#111111] truncate">
                {item.product.name}
              </h5>
              <p className="text-[11px] text-[#777777]">
                {item.selectedSize} • {item.selectedColor}
              </p>
              <p className="text-xs font-bold text-[#111111] mt-0.5">
                {formatCurrency(item.totalPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <div>
        {couponCode ? (
          <div className="flex items-center justify-between p-2.5 bg-[#FFFDFC] border border-[#B77A68]/40 text-xs">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#B77A68]" />
              <span>
                Code <strong className="text-[#B77A68] uppercase">{couponCode}</strong> applied
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
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Promo Code"
              className="flex-1 px-3 py-2 text-xs uppercase bg-[#FFFDFC] border border-[#E8DED8] focus:outline-none focus:border-[#B77A68]"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              isLoading={isApplying}
              disabled={!couponInput.trim()}
            >
              Apply
            </Button>
          </form>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-xs pt-3 border-t border-[#E8DED8]">
        <div className="flex justify-between text-[#777777]">
          <span>Subtotal</span>
          <span className="text-[#111111] font-semibold">{formatCurrency(summary.subtotal)}</span>
        </div>

        {summary.discountTotal > 0 && (
          <div className="flex justify-between text-[#C98282] font-semibold">
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

        <div className="flex justify-between text-[#777777]">
          <span>Estimated GST</span>
          <span className="text-[#111111]">Inclusive</span>
        </div>

        <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#E8DED8]">
          <span>Grand Total</span>
          <span className="text-[#111111]">{formatCurrency(summary.grandTotal)}</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#777777]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#B77A68]" />
        <span>Guaranteed safe &amp; secure boutique checkout</span>
      </div>
    </div>
  );
}
