'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

interface PromoBadgeConfig {
  label: string;
  color?: string;
  rule?: string;
  value?: any;
  description?: string;
}

interface PromoTagsSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  badges?: PromoBadgeConfig[];
  tenantSlug?: string;
}

const DEFAULT_BADGES: PromoBadgeConfig[] = [
  {
    label: 'New Atelier Drops',
    color: '#22C55E',
    description: 'Fresh arrivals crafted in the studio within the last 14 days.',
  },
  {
    label: 'Festive Privileges',
    color: '#EF4444',
    description: 'Special seasonal price privileges and promotional sets.',
  },
  {
    label: 'Limited Haute Edition',
    color: '#F59E0B',
    description: 'Numbered atelier pieces with limited garment production runs.',
  },
  {
    label: 'Signature Silks',
    color: '#8B5CF6',
    description: 'Pure Chanderi, Banarasi, and Mulberry silk handweaves.',
  },
];

export function PromoTagsSection({
  customTitle = 'Curated Badges & Atelier Collections',
  customSubtitle = 'Discover hand-tagged seasonal edits, limited production runs, and exclusive private offerings.',
  customBadge = 'PROMO TAG ENGINE',
  badges = DEFAULT_BADGES,
  tenantSlug,
}: PromoTagsSectionProps) {
  const activeBadges = Array.isArray(badges) && badges.length > 0 ? badges : DEFAULT_BADGES;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F2] border border-[#E8DED8] rounded-full shadow-2xs">
              <Tag className="w-3.5 h-3.5 text-[#B77A68]" />
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

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeBadges.map((badgeItem, idx) => {
            const badgeColor = badgeItem.color || '#B77A68';
            return (
              <div
                key={idx}
                className="group relative bg-[#FFFDFC] border border-[#E8DED8] hover:border-[#B77A68] rounded-2xl p-6 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Badge Header Tag */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-white uppercase shadow-2xs"
                      style={{ backgroundColor: badgeColor }}
                    >
                      <Sparkles className="w-3 h-3" />
                      {badgeItem.label}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#999999] tracking-wider">
                      Verified
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#555555] font-sans leading-relaxed">
                    {badgeItem.description ||
                      `Explore all luxury designs bearing our certified ${badgeItem.label} standard.`}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-6 mt-4 border-t border-[#E8DED8]/60 flex items-center justify-between">
                  <Link
                    href={formatTenantHref(
                      `/collections?tag=${encodeURIComponent(badgeItem.label.toLowerCase())}`,
                      tenantSlug
                    )}
                    className="text-xs font-bold text-[#111111] group-hover:text-[#B77A68] flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Edit</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-[10px] text-[#999999] font-mono">LIVE ATELIER</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
