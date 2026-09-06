'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface BrandPartnersSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customLogos?: Array<string | { name: string; logoUrl?: string; href?: string }>;
  tenantSlug?: string;
}

const DEFAULT_LOGOS = ['VOGUE', 'HARPER’S BAZAAR', 'ELLE', 'GQ', 'FORBES', 'VANITY FAIR'];

export function BrandPartnersSection({
  customTitle = 'AS FEATURED IN',
  customSubtitle,
  customBadge,
  customLogos,
  tenantSlug,
}: BrandPartnersSectionProps) {
  const logos = customLogos && customLogos.length > 0 ? customLogos : DEFAULT_LOGOS;

  return (
    <section className="py-12 md:py-16 bg-[var(--theme-color-surface-secondary,#F8F1EA)] border-y border-[var(--theme-color-border,#E8DED8)] select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--theme-color-surface,#FFFDFC)] border border-[var(--theme-color-border,#E8DED8)] shadow-xs mb-3 text-[11px] uppercase font-bold tracking-widest text-[var(--theme-color-accent,#B77A68)]">
              <Sparkles className="w-3 h-3" />
              <span>{customBadge}</span>
            </div>
          )}
          <h3 className="text-xs sm:text-sm uppercase font-bold tracking-[0.25em] text-[var(--theme-color-text-secondary,#57534E)]">
            {customTitle}
          </h3>
          {customSubtitle && (
            <p className="text-xs text-[var(--theme-color-text-muted,#777777)] mt-1.5 font-sans">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* Logo Ribbons / Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {logos.map((item, idx) => {
            const name = typeof item === 'string' ? item : item.name;
            const logoUrl = typeof item === 'object' ? item.logoUrl : undefined;
            const href = typeof item === 'object' ? item.href : undefined;

            const content = logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={name}
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ) : (
              <span className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-[0.18em] text-[var(--theme-color-heading,#111111)] opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
                {name}
              </span>
            );

            if (href) {
              return (
                <Link
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-105"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={idx} className="transition-transform duration-300 hover:scale-105">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
