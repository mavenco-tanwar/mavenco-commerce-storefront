'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customSettings?: {
    tagline?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    desktopImage?: string;
    tabletImage?: string;
    mobileImage?: string;
    overlayOpacity?: number;
    textAlignment?: 'left' | 'center' | 'right';
  };
}

export function HeroSection({
  customTitle,
  customSubtitle,
  customSettings,
}: HeroSectionProps = {}) {
  const title = customTitle || 'Style That Speaks You';
  const subtitle =
    customSubtitle ||
    'Discover effortlessly stylish, runway-inspired fashion crafted for modern women and adorable kids. Breathable fabrics, pure luxury silhouettes, affordable prices.';
  const tagline = customSettings?.tagline || 'Spring / Summer 2026 Studio Collection';
  const primaryBtnText = customSettings?.primaryBtnText || 'Shop Women';
  const primaryBtnLink = customSettings?.primaryBtnLink || '/women';
  const secondaryBtnText = customSettings?.secondaryBtnText || 'Shop Kids';
  const secondaryBtnLink = customSettings?.secondaryBtnLink || '/kids';
  const desktopImage =
    customSettings?.desktopImage ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop';
  const overlayOpacity = customSettings?.overlayOpacity || 45;

  return (
    <section className="relative overflow-hidden bg-[#F8F1EA] border-b border-[#E8DED8] select-none">
      {/* Background Decorative Gradient Aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8B8B5]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#CF9584]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] lg:min-h-[620px] items-center gap-8 py-10 lg:py-0">
          {/* Left Column: Editorial Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 lg:pr-8 z-10 text-center lg:text-left">
            {/* Season Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFDFC] border border-[#E8DED8] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#111111]">
                {tagline}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#111111] leading-[1.12] tracking-tight">
                {title.includes('You') ? (
                  <>
                    {title.replace(/You/g, '')}
                    <span className="italic font-normal text-[#B77A68]">You</span>
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="text-sm sm:text-base text-[#777777] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href={primaryBtnLink} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[170px] group"
                >
                  <span>{primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href={secondaryBtnLink} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[170px]"
                >
                  {secondaryBtnText}
                </Button>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#777777] border-t border-[#E8DED8]/80">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77A68]" />
                <span>Express Doorstep Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77A68]" />
                <span>100% Breathable Fabrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77A68]" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Fashion Visuals (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-3/4 luxury-card-shadow bg-[#FAF6F2] overflow-hidden border-2 border-[#FFFDFC]">
              <Image
                src={desktopImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
              />

              {/* Subtle Bottom Vignette */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                style={{ opacity: overlayOpacity / 100 }}
              />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDFC]/95 backdrop-blur-md p-4 border border-[#E8DED8] shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                    New Season Drop
                  </span>
                  <h4 className="text-xs font-serif font-bold text-[#111111]">
                    Linen Co-ords &amp; Chanderi Silks
                  </h4>
                  <p className="text-[11px] text-[#777777]">Starting from ₹899</p>
                </div>

                <Link
                  href="/women"
                  className="px-3 py-1.5 bg-[#111111] text-[#FFFDFC] text-[11px] font-bold uppercase tracking-wider hover:bg-[#B77A68] transition-colors shrink-0"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
