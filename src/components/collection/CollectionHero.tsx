'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionPageConfig } from '@/types/collection-page.types';

export interface CollectionHeroProps {
  config?: CollectionPageConfig['hero'];
  titleOverride?: string;
  descriptionOverride?: string;
  imageOverride?: string;
}

export function CollectionHero({
  config,
  titleOverride,
  descriptionOverride,
  imageOverride,
}: CollectionHeroProps) {
  if (!config || config.enabled === false) return null;

  const title = titleOverride || config.title || 'Curated Atelier Collection';
  const description = descriptionOverride || config.description;
  const image = imageOverride || config.bgImage;

  const getHeightClass = (h?: string) => {
    switch (h) {
      case 'small':
        return 'min-h-[180px] sm:min-h-[220px]';
      case 'large':
        return 'min-h-[380px] sm:min-h-[460px]';
      case 'auto':
        return 'py-12';
      case 'medium':
      default:
        return 'min-h-[260px] sm:min-h-[320px]';
    }
  };

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

  return (
    <section className={`relative w-full overflow-hidden bg-slate-950 flex flex-col ${getHeightClass(config.height)} ${getAlignClass(config.alignment)} select-none`}>
      {/* Background Image with Dynamic Overlay */}
      {image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (config.overlayOpacity ?? 45) / 100 }}
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-2 text-white w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight drop-shadow-md">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-sans max-w-2xl leading-relaxed drop-shadow">
            {description}
          </p>
        )}
        {config.ctaText && (
          <div className="pt-2">
            <a
              href={config.ctaLink || '#products'}
              className="inline-block px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              {config.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
