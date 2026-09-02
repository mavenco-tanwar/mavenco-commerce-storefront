'use client';

import React, { useState, useEffect } from 'react';
import { CmsHomepageSection } from '@/services/api/cms';
import { HeroSection } from './HeroSection';
import { CategoryShowcase } from './CategoryShowcase';
import { TrendingSection } from './TrendingSection';
import { WomensEditorial } from './WomensEditorial';
import { NewArrivalsStudio } from './NewArrivalsStudio';
import { KidsEditorial } from './KidsEditorial';
import { BestSellersSection } from './BestSellersSection';
import { TestimonialsSection } from './TestimonialsSection';
import { InstagramFeed } from './InstagramFeed';
import { NewsletterSection } from './NewsletterSection';
import { PromotionalBanner } from './PromotionalBanner';
import { ValueProps } from './ValueProps';

interface DynamicSectionRendererProps {
  sections?: CmsHomepageSection[];
  initialSections?: CmsHomepageSection[];
  tenantSlug?: string;
}

export function DynamicSectionRenderer({ sections, initialSections, tenantSlug }: DynamicSectionRendererProps) {
  const [liveSections, setLiveSections] = useState<CmsHomepageSection[]>(
    sections || initialSections || []
  );

  useEffect(() => {
    if (sections && sections.length > 0) {
      setLiveSections(sections);
    }
  }, [sections]);

  // Client-side real-time sync with /api/v1/content/homepage
  useEffect(() => {
    let isMounted = true;
    const currentSlug =
      tenantSlug ||
      (typeof window !== 'undefined'
        ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
          new URLSearchParams(window.location.search).get('tenant') ||
          ''
        : '') ||
      'demo';

    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/v1/content/homepage?tenant=${currentSlug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const apiSections = json?.data?.sections;
          if (isMounted && Array.isArray(apiSections) && apiSections.length > 0) {
            setLiveSections(apiSections);
          }
        }
      } catch (e) {
        // Fallback to initial
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  const now = new Date();

  // Filter visible and scheduled sections, sorted by displayOrder
  const activeSections = liveSections
    .filter((sec) => {
      if (sec.isVisible === false) return false;

      // Check scheduled visibility window if set
      if (sec.startDate && new Date(sec.startDate) > now) {
        return false;
      }
      if (sec.endDate && new Date(sec.endDate) < now) {
        return false;
      }

      return true;
    })
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <>
      {activeSections.map((section) => {
        const rawSec = section as any;
        const sData = rawSec.data || rawSec.settings || {};
        const title = sData.title || sData.heading || rawSec.title || rawSec.name;
        const subtitle = sData.subtitle || sData.description || rawSec.subtitle;
        const badge = sData.badge || sData.tagline || sData.badgeText || rawSec.badge || rawSec.tagline;

        switch (section.type) {
          case 'hero':
            return (
              <HeroSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customSettings={{
                  tagline: badge,
                  primaryBtnText: sData.primaryCtaText || sData.primaryBtnText || sData.ctaText || 'Shop Women',
                  primaryBtnLink: sData.primaryCtaUrl || sData.primaryBtnLink || sData.ctaUrl || '/women',
                  secondaryBtnText: sData.secondaryCtaText || sData.secondaryBtnText || 'Shop Kids',
                  secondaryBtnLink: sData.secondaryCtaUrl || sData.secondaryBtnLink || '/kids',
                  desktopImage: sData.desktopImage || sData.image,
                  mobileImage: sData.mobileImage,
                  overlayOpacity: sData.overlayOpacity,
                }}
              />
            );

          case 'category-grid':
          case 'categories':
            return (
              <CategoryShowcase
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCategories={sData.categories || sData.items}
              />
            );

          case 'trending':
          case 'product-grid':
          case 'products':
          case 'products_grid':
          case 'featured_products':
            return (
              <TrendingSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customLimit={sData.limit || 8}
                customCtaText={sData.ctaText || sData.primaryCtaText || 'Explore All'}
                customCtaUrl={sData.ctaUrl || sData.primaryCtaUrl || '/collections'}
              />
            );

          case 'womens-editorial':
          case 'collection-banner':
          case 'image_text':
          case 'editorial':
            return (
              <WomensEditorial
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customImage={sData.desktopImage || sData.bannerImage || sData.image}
                customCtaText={sData.ctaText || sData.primaryCtaText || sData.btnText}
                customCtaUrl={sData.ctaUrl || sData.primaryCtaUrl || sData.btnLink}
              />
            );

          case 'new-arrivals':
          case 'product-carousel':
          case 'product_carousel':
          case 'carousel':
            return (
              <NewArrivalsStudio
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customLimit={sData.limit || 6}
              />
            );

          case 'kids-editorial':
            return (
              <KidsEditorial
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCtaText={sData.ctaText || sData.primaryCtaText}
                customCtaUrl={sData.ctaUrl || sData.primaryCtaUrl}
              />
            );

          case 'best-sellers':
            return (
              <BestSellersSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customLimit={sData.limit || 4}
              />
            );

          case 'testimonials':
          case 'reviews':
            return (
              <TestimonialsSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customReviews={sData.testimonials || sData.testimonialsList || sData.items}
              />
            );

          case 'instagram-feed':
          case 'instagram':
          case 'social':
          case 'social_grid':
            return (
              <InstagramFeed
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customHandle={sData.handle || sData.accountHandle}
              />
            );

          case 'newsletter':
          case 'newsletter-club':
            return (
              <NewsletterSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCouponPromo={sData.discountText}
              />
            );

          case 'promo-banner':
          case 'promotional-banner':
          case 'promotional_banner':
          case 'countdown':
            return (
              <PromotionalBanner
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customPrimaryCtaText={sData.ctaText || sData.primaryCtaText || sData.btnText}
                customPrimaryCtaUrl={sData.ctaUrl || sData.primaryCtaUrl || sData.btnLink}
              />
            );

          case 'spacer':
            return (
              <div
                key={section.id}
                className="w-full"
                style={{ height: sData.heightDesktop || '48px' }}
              />
            );

          case 'divider':
            return (
              <div key={section.id} className="max-w-7xl mx-auto px-6 py-4">
                <hr className="border-t border-slate-200 dark:border-white/10" />
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
