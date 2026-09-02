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

  // Filter visible and scheduled sections, sorted by displayOrder / order
  const activeSections = liveSections
    .filter((sec: any) => {
      if (sec.enabled === false || sec.isVisible === false) return false;

      // Check scheduled visibility window if set
      if (sec.startDate && new Date(sec.startDate) > now) {
        return false;
      }
      if (sec.endDate && new Date(sec.endDate) < now) {
        return false;
      }

      return true;
    })
    .sort((a: any, b: any) => (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0));

  return (
    <>
      {activeSections.map((section: any) => {
        const sData = section.data || section.settings || {};
        const title = sData.heading || sData.title || section.name || section.title;
        const subtitle = sData.subheading || sData.subtitle || sData.description || section.subtitle;
        const badge = sData.tagline || sData.badge || sData.badgeText || section.badge || section.tagline;
        const image = sData.bgImage || sData.desktopImage || sData.image || sData.bannerImage;

        switch (section.type) {
          case 'hero':
            return (
              <HeroSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customSettings={{
                  tagline: badge,
                  primaryBtnText: sData.primaryBtnText || sData.primaryCtaText || sData.ctaText || 'Shop The Collection',
                  primaryBtnLink: sData.primaryBtnLink || sData.primaryCtaUrl || sData.ctaUrl || '/collections',
                  secondaryBtnText: sData.secondaryBtnText || sData.secondaryCtaText || 'Explore Lookbook',
                  secondaryBtnLink: sData.secondaryBtnLink || sData.secondaryCtaUrl || '/about',
                  desktopImage: image,
                  mobileImage: sData.mobileImage || image,
                  overlayOpacity: typeof sData.overlayOpacity === 'number' ? (sData.overlayOpacity <= 1 ? sData.overlayOpacity * 100 : sData.overlayOpacity) : 40,
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
                customCategories={sData.categoriesList || sData.categories || sData.items}
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
                customCtaText={sData.primaryBtnText || sData.ctaText || sData.primaryCtaText || 'Explore All'}
                customCtaUrl={sData.primaryBtnLink || sData.ctaUrl || sData.primaryCtaUrl || '/collections'}
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
                customImage={image}
                customCtaText={sData.btnText || sData.ctaText || sData.primaryCtaText || 'Read Our Story'}
                customCtaUrl={sData.btnLink || sData.ctaUrl || sData.primaryCtaUrl || '/about'}
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
                customReviews={sData.testimonialsList || sData.testimonials || sData.items}
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
                customCouponPromo={sData.discountText || sData.description}
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
                customPrimaryCtaText={sData.btnText || sData.ctaText || sData.primaryCtaText || 'Claim Privilege'}
                customPrimaryCtaUrl={sData.btnLink || sData.ctaUrl || sData.primaryCtaUrl || '/collections'}
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
