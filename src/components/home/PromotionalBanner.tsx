import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PromotionalBannerProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customImage?: string;
  customPrimaryCtaText?: string;
  customPrimaryCtaUrl?: string;
  customSecondaryCtaText?: string;
  customSecondaryCtaUrl?: string;
}

export function PromotionalBanner({
  customTitle,
  customSubtitle,
  customBadge,
  customImage,
  customPrimaryCtaText = 'Shop Collection',
  customPrimaryCtaUrl = '/women',
  customSecondaryCtaText = 'View Offers',
  customSecondaryCtaUrl = '/sale',
}: PromotionalBannerProps = {}) {
  const title = customTitle || 'NEW SEASON. NEW YOU.';
  const subtitle =
    customSubtitle ||
    'Discover styles made to move with you. From sunlit brunches to evening celebrations, embrace fashion that honors your individuality with grace.';
  const badge = customBadge || 'Limited Edition Studio Drop';
  const image =
    customImage ||
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1600&auto=format&fit=crop';

  return (
    <section className="relative bg-[#111111] text-white overflow-hidden py-20 md:py-28 select-none">
      {/* Background Editorial High-Fashion Image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
      />

      {/* Decorative Blush & Rose Gold Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
      <div className="absolute -top-20 right-10 w-96 h-96 bg-[#B77A68]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFDFC]/10 backdrop-blur-md border border-[#E8DED8]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#E8B8B5]">
              {badge}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#FFFDFC] leading-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-[#E8DED8] font-sans font-normal leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href={customPrimaryCtaUrl}>
              <Button variant="luxury-gold" size="lg" className="min-w-[180px] group">
                <span>{customPrimaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {customSecondaryCtaText && (
              <Link href={customSecondaryCtaUrl}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-black min-w-[150px]"
                >
                  {customSecondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
