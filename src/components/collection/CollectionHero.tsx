'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CollectionPageConfig, CollectionPageStyles } from '@/types/collection-page.types';
import { formatTenantHref } from '@/lib/tenant-config';

export interface CollectionHeroProps {
  config?: CollectionPageConfig['hero'];
  titleOverride?: string;
  descriptionOverride?: string;
  imageOverride?: string;
  tenantSlug?: string;
  styles?: CollectionPageStyles;
}

export function CollectionHero({
  config,
  titleOverride,
  descriptionOverride,
  imageOverride,
  tenantSlug,
  styles,
}: CollectionHeroProps) {
  if (!config || config.enabled === false) return null;

  const title = titleOverride || config.title || 'Curated Atelier Collection';
  const description = descriptionOverride || config.description;
  const image = imageOverride || config.bgImage;

  // Compute Height: support both exact pixel strings (e.g. '340px' or 'Medium (340px)') and keywords
  const rawHeight = config.height || 'medium';
  let minHeightStyle: string | undefined = undefined;

  const pxMatch = String(rawHeight).match(/(\d+)px/);
  if (pxMatch) {
    minHeightStyle = `${pxMatch[1]}px`;
  } else if (rawHeight === 'small') {
    minHeightStyle = '220px';
  } else if (rawHeight === 'large') {
    minHeightStyle = '460px';
  } else if (rawHeight === 'medium') {
    minHeightStyle = '340px';
  }

  const getAlignClass = (a?: string) => {
    switch (a) {
      case 'center':
        return 'text-center items-center justify-center';
      case 'right':
        return 'text-right items-end justify-center';
      case 'left':
      default:
        return 'text-left items-start justify-center';
    }
  };

  const rawOpacity = config.overlayOpacity !== undefined ? config.overlayOpacity : 45;
  const overlayOpacity = rawOpacity <= 1 ? rawOpacity : rawOpacity / 100;

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-[#121626] to-[#0A0D15] flex flex-col ${getAlignClass(
        config.alignment
      )} select-none transition-all duration-300`}
      style={{ minHeight: minHeightStyle || '340px' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />
      {/* Background Image with Dynamic Overlay */}
      {image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-black transition-opacity duration-200"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      )}

      {/* Hero Content */}
      <div data-hero-content="true" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-3.5 text-white w-full">
        {Boolean(config.badgeText || (config as any).badge) && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-[11px] font-bold uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-sm" />
            <span>{config.badgeText || (config as any).badge}</span>
          </div>
        )}
        <h1
          data-hero-title="true"
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight drop-shadow-md"
          style={{
            color: styles?.headingColor || 'var(--theme-hero-title, var(--theme-color-heading, #FFFFFF))',
            fontFamily: styles?.headingFont ? `${styles.headingFont}, serif` : undefined,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="text-xs sm:text-sm md:text-base font-sans max-w-2xl leading-relaxed drop-shadow"
            style={{
              color: styles?.textColor || 'var(--theme-hero-subtitle, var(--theme-color-text-secondary, #CBD5E1))',
              fontFamily: styles?.bodyFont ? `${styles.bodyFont}, sans-serif` : undefined,
            }}
          >
            {description}
          </p>
        )}
        {config.ctaText && (
          <div className="pt-3">
            <Link
              href={formatTenantHref(config.ctaLink || '#products', tenantSlug)}
              className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
              style={{
                backgroundColor: styles?.buttonBackgroundColor || '#FFFFFF',
                color: styles?.buttonTextColor || '#020617',
              }}
            >
              {config.ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
