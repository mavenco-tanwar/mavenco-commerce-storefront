'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';

interface SplitEditorialStoryProps {
  customTitle?: string;
  customSubtitle?: string;
  customDescription?: string;
  customBadge?: string;
  customImage?: string;
  imagePosition?: 'left' | 'right';
  customBtnText?: string;
  customBtnLink?: string;
  tenantSlug?: string;
}

export function SplitEditorialStory({
  customTitle = 'Artisanal Craftsmanship & Ethical Textiles',
  customSubtitle,
  customDescription = 'Each piece is cut and assembled by master artisans using organic chanderi silk and sustainably sourced linen. Designed to embody effortless contemporary poise and timeless durability.',
  customBadge = 'OUR HERITAGE',
  customImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
  imagePosition = 'left',
  customBtnText = 'READ OUR STORY',
  customBtnLink = '/about',
  tenantSlug,
}: SplitEditorialStoryProps) {
  const isImageRight = imagePosition === 'right';

  return (
    <section className="py-16 md:py-24 bg-[var(--theme-color-surface,#FFFDFC)] select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div
            className={`lg:col-span-6 relative ${
              isImageRight ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <div className="relative aspect-4/5 sm:aspect-3/4 w-full overflow-hidden border border-[var(--theme-color-border,#E8DED8)] bg-[var(--theme-color-surface-secondary,#F8F1EA)] shadow-xl">
              <Image
                src={customImage}
                alt={customTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Decorative Corner Frame Accent */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[var(--theme-color-accent,#B77A68)]/40 -z-1 pointer-events-none" />
          </div>

          {/* Narrative Story Content Column */}
          <div
            className={`lg:col-span-6 space-y-6 ${
              isImageRight ? 'lg:order-1 lg:pr-6' : 'lg:order-2 lg:pl-6'
            }`}
          >
            {customBadge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--theme-color-surface-secondary,#F8F1EA)] border border-[var(--theme-color-border,#E8DED8)] text-[11px] uppercase font-bold tracking-widest text-[var(--theme-color-accent,#B77A68)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{customBadge}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--theme-color-heading,#111111)] leading-[1.15]">
              {customTitle}
            </h2>

            {customSubtitle && (
              <p className="text-sm sm:text-base font-serif italic text-[var(--theme-color-text-secondary,#57534E)]">
                {customSubtitle}
              </p>
            )}

            <div className="w-16 h-0.5 bg-[var(--theme-color-accent,#B77A68)]" />

            <div className="text-xs sm:text-sm md:text-base text-[var(--theme-color-text-secondary,#57534E)] font-sans leading-relaxed space-y-4">
              <p>{customDescription}</p>
            </div>

            <div className="pt-4">
              <Link href={formatTenantHref(customBtnLink, tenantSlug)}>
                <Button
                  variant="primary"
                  size="lg"
                  className="min-w-[180px] group shadow-sm"
                >
                  <span>{customBtnText}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
