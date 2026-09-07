'use client';

import React, { useState } from 'react';
import { Gift, Sparkles, Send, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GiftCardsSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  denominations?: number[];
  allowCustomAmount?: boolean;
  ctaText?: string;
  tenantSlug?: string;
}

const DEFAULT_DENOMINATIONS = [500, 1000, 2000, 5000];

export function GiftCardsSection({
  customTitle = 'Give the Gift of Atelier Style',
  customSubtitle = 'Ideal for celebratory moments, weddings, and anniversaries. Delivered instantaneously via email with personalized styling privileges.',
  customBadge = 'DIGITAL GIFT VOUCHERS',
  denominations = DEFAULT_DENOMINATIONS,
  allowCustomAmount = true,
  ctaText = 'Purchase Gift Voucher',
}: GiftCardsSectionProps) {
  const activeDenoms = Array.isArray(denominations) && denominations.length > 0 ? denominations : DEFAULT_DENOMINATIONS;
  const [selectedAmount, setSelectedAmount] = useState<number>(activeDenoms[1] || 1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [isPurchased, setIsPurchased] = useState<boolean>(false);

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPurchased(true);
    setTimeout(() => setIsPurchased(false), 4000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="bg-[#FAF6F2] border border-[#E8DED8] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8DED8] rounded-full shadow-2xs">
              <Gift className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                {customBadge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111111]">
            {customTitle}
          </h2>
          {customSubtitle && (
            <p className="text-xs sm:text-sm text-[#777777] font-sans leading-relaxed">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* Voucher Configuration Form & Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Live Gift Card Preview Visual */}
          <div className="lg:col-span-5">
            <div className="relative aspect-16/10 rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#2A2356] to-[#111111] text-white p-6 sm:p-7 shadow-xl border border-white/10 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#B77A68]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="font-serif font-bold tracking-widest text-sm text-[#FFFDFC]">JQ TRENDS</div>
                <div className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-wider text-[#E8B8B5]">
                  Atelier Pass
                </div>
              </div>

              <div className="relative z-10 space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#AFA5A0]">Voucher Value</div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFDFC]">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
                <span>For: {recipientName || 'Cherished Recipient'}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#E8B8B5]">NEVER EXPIRES</span>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="lg:col-span-7 bg-white border border-[#E8DED8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <form onSubmit={handlePurchase} className="space-y-5">
              {/* Denomination Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Select Value (INR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {activeDenoms.map((d) => {
                    const isSelected = selectedAmount === d && !customAmount;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(d);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#111111] text-white shadow-xs'
                            : 'bg-[#FAF6F2] border border-[#E8DED8] text-[#444444] hover:border-[#B77A68]'
                        }`}
                      >
                        ₹{d.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              {allowCustomAmount && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#777777]">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#777777]">₹</span>
                    <input
                      type="number"
                      min={500}
                      max={50000}
                      placeholder="e.g. 7500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] rounded-xl text-[#111111] outline-hidden focus:border-[#B77A68]"
                    />
                  </div>
                </div>
              )}

              {/* Recipient Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#777777]">
                  Recipient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meera Kapoor"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF6F2] border border-[#E8DED8] rounded-xl text-[#111111] outline-hidden focus:border-[#B77A68]"
                />
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                variant="luxury-gold"
                size="md"
                className="w-full"
                leftIcon={isPurchased ? <Check className="w-4 h-4 text-emerald-300" /> : <Gift className="w-4 h-4" />}
              >
                {isPurchased ? 'Gift Voucher Added to Bag!' : `${ctaText} (₹${finalAmount.toLocaleString('en-IN')})`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
