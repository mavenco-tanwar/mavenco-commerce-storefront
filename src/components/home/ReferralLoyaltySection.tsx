'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Copy, Check, Gift, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoyaltyTier {
  name: string;
  minPoints?: number;
  benefit: string;
}

interface ReferralLoyaltySectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  pointsPerRupee?: number;
  tiers?: LoyaltyTier[];
  referralBonusPoints?: number;
  tenantSlug?: string;
}

const DEFAULT_TIERS: LoyaltyTier[] = [
  { name: 'Silver Atelier', minPoints: 0, benefit: '5% Cashback in Atelier credits on every order' },
  { name: 'Gold Couturier', minPoints: 2000, benefit: '10% Cashback + 24-hr early access to festive drops' },
  { name: 'Platinum Haute', minPoints: 5000, benefit: '15% Cashback + complimentary express courier & dedicated stylist' },
];

export function ReferralLoyaltySection({
  customTitle = 'Atelier Privileges & Referral Rewards',
  customSubtitle = 'Earn rewards with every garment acquisition and share exclusive ₹500 welcome privileges with friends.',
  customBadge = 'LOYALTY & REWARDS',
  pointsPerRupee = 1,
  tiers = DEFAULT_TIERS,
  referralBonusPoints = 500,
}: ReferralLoyaltySectionProps) {
  const activeTiers = Array.isArray(tiers) && tiers.length > 0 ? tiers : DEFAULT_TIERS;
  const [copied, setCopied] = useState(false);

  const referralCode = 'ATELIER-VIP-2026';
  const referralLink = `https://jqtrends.com/invite/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="bg-[#FFFDFC] border border-[#E8DED8] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F2] border border-[#E8DED8] rounded-full shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#B77A68]" />
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

        {/* Tier Hierarchy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTiers.map((tier, idx) => {
            const isHighest = idx === activeTiers.length - 1;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4 border transition-all ${
                  isHighest
                    ? 'bg-[#111111] text-white border-white/20 shadow-md'
                    : 'bg-[#FAF6F2] text-[#111111] border-[#E8DED8]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        isHighest
                          ? 'bg-[#B77A68] text-white'
                          : 'bg-white border border-[#E8DED8] text-[#B77A68]'
                      }`}
                    >
                      Tier {idx + 1}
                    </span>
                    <Award className="w-4 h-4 text-[#B77A68]" />
                  </div>

                  <h3 className="text-xl font-serif font-bold">{tier.name}</h3>
                  <div className="text-xs opacity-75">
                    {typeof tier.minPoints === 'number'
                      ? `${tier.minPoints.toLocaleString('en-IN')}+ Points Required`
                      : 'Complimentary On Sign Up'}
                  </div>

                  <p className="text-xs leading-relaxed pt-2 border-t border-current/15">
                    {tier.benefit}
                  </p>
                </div>

                <div className="text-[11px] font-semibold text-[#B77A68] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{pointsPerRupee} Point per ₹1 Spent</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Friend Referral Share Banner */}
        <div className="bg-[#FAF6F2] border border-[#E8DED8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B77A68] block">
              Give ₹500, Get {referralBonusPoints} Points
            </span>
            <h4 className="font-serif font-bold text-lg text-[#111111]">
              Share Your Private Atelier Pass
            </h4>
            <p className="text-xs text-[#777777]">
              Friends receive ₹500 off their first creation. You receive {referralBonusPoints} reward points when they order.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="px-4 py-2.5 bg-white border border-[#E8DED8] rounded-xl font-mono text-xs text-[#111111] font-bold truncate max-w-[200px] sm:max-w-none">
              {referralCode}
            </div>
            <Button
              type="button"
              variant={copied ? 'luxury-gold' : 'outline'}
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
