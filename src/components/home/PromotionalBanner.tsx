import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';

import { SectionTypographyProps, getSectionTypographyStyles } from '@/lib/section-typography';

interface PromotionalBannerProps extends SectionTypographyProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customImage?: string;
  customPrimaryCtaText?: string;
  customPrimaryCtaUrl?: string;
  customSecondaryCtaText?: string;
  customSecondaryCtaUrl?: string;
  customTertiaryCtaText?: string;
  customTertiaryCtaUrl?: string;
  contentAlign?: 'left' | 'center' | 'right';
  containerWidth?: 'contained' | 'full' | 'full_width';
  bannerHeight?: 'compact' | 'medium' | 'tall';
  primaryBtnColor?: string;
  primaryBtnTextColor?: string;
  secondaryBtnColor?: string;
  secondaryBtnTextColor?: string;
  tertiaryBtnColor?: string;
  tertiaryBtnTextColor?: string;
  bgColor?: string;
  textColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
  tenantSlug?: string;
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
  customTertiaryCtaText,
  customTertiaryCtaUrl = '/contact',
  contentAlign = 'left',
  containerWidth = 'contained',
  bannerHeight = 'medium',
  primaryBtnColor,
  primaryBtnTextColor,
  secondaryBtnColor,
  secondaryBtnTextColor,
  tertiaryBtnColor,
  tertiaryBtnTextColor,
  bgColor,
  textColor,
  paddingTop,
  paddingBottom,
  tenantSlug,
  ...typographyProps
}: PromotionalBannerProps = {}) {
  const { headingStyle, subtitleStyle, badgeStyle, primaryBtnStyle, secondaryBtnStyle, tertiaryBtnStyle } =
    getSectionTypographyStyles({
      ...typographyProps,
      textColor,
      primaryBtnColor,
      primaryBtnTextColor,
      secondaryBtnColor,
      secondaryBtnTextColor,
      tertiaryBtnColor,
      tertiaryBtnTextColor,
    });

  const title = customTitle || 'NEW SEASON. NEW YOU.';
  const subtitle =
    customSubtitle ||
    'Discover styles made to move with you. From sunlit brunches to evening celebrations, embrace fashion that honors your individuality with grace.';
  const badge = customBadge || 'Limited Edition Studio Drop';
  const image =
    customImage ||
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1600&auto=format&fit=crop';

  const isFullWidth = containerWidth === 'full' || containerWidth === 'full_width';
  const containerClass = isFullWidth ? 'w-full px-4 sm:px-8 md:px-12' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const minHeight = bannerHeight === 'compact' ? '300px' : bannerHeight === 'tall' ? '560px' : '420px';

  const alignClass =
    contentAlign === 'center'
      ? 'max-w-2xl mx-auto text-center items-center'
      : contentAlign === 'right'
      ? 'max-w-2xl ml-auto text-right items-end'
      : 'max-w-xl text-left items-start';

  const btnAlignClass =
    contentAlign === 'center'
      ? 'justify-center'
      : contentAlign === 'right'
      ? 'justify-end'
      : 'justify-start';


  return (
    <section
      className="relative bg-[#111111] text-white overflow-hidden select-none transition-colors duration-200 flex items-center"
      style={{
        minHeight,
        paddingTop: paddingTop || '5rem',
        paddingBottom: paddingBottom || '5rem',
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
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

      <div className={`relative ${containerClass} z-10 w-full`}>
        <div className={`flex flex-col space-y-6 ${alignClass}`}>
          {/* Badge */}
          {badge && (
            <div
              data-typography="badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFDFC]/10 backdrop-blur-md border border-[#E8DED8]/30 rounded-full"
              style={badgeStyle}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#E8B8B5]" style={{ color: badgeStyle.color || undefined }}>
                {badge}
              </span>
            </div>
          )}

          {/* Headline */}
          <h2
            data-typography="heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#FFFDFC] leading-tight"
            style={{
              color: textColor || undefined,
              ...headingStyle,
            }}
          >
            {title}
          </h2>

          <p
            data-typography="subtitle"
            className="text-sm sm:text-base text-[#E8DED8] font-sans font-normal leading-relaxed"
            style={{
              color: textColor ? `${textColor}cc` : undefined,
              ...subtitleStyle,
            }}
          >
            {subtitle}
          </p>

          <div className={`pt-2 flex flex-wrap items-center gap-4 ${btnAlignClass}`}>
            <Link href={formatTenantHref(customPrimaryCtaUrl, tenantSlug)}>
              <Button
                variant="luxury-gold"
                size="lg"
                style={primaryBtnStyle}
                className="min-w-[180px] group cursor-pointer"
              >
                <span>{customPrimaryCtaText}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {customSecondaryCtaText && (
              <Link href={formatTenantHref(customSecondaryCtaUrl, tenantSlug)}>
                <Button
                  variant="outline"
                  size="lg"
                  style={secondaryBtnStyle}
                  className="border-white text-white hover:bg-white hover:text-black min-w-[150px] cursor-pointer"
                >
                  {customSecondaryCtaText}
                </Button>
              </Link>
            )}

            {customTertiaryCtaText && (
              <Link href={formatTenantHref(customTertiaryCtaUrl, tenantSlug)}>
                <Button
                  variant="outline"
                  size="lg"
                  style={tertiaryBtnStyle}
                  className="border-white/60 text-white hover:bg-white/20 min-w-[150px] cursor-pointer"
                >
                  {customTertiaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

