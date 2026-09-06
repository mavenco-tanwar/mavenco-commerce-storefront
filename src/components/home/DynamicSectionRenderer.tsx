'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CmsHomepageSection } from '@/services/api/cms';
import { formatTenantHref } from '@/lib/tenant-config';
import { HeroSection } from './HeroSection';
import { CategoryShowcase } from './CategoryShowcase';
import { TrendingSection } from './TrendingSection';
import { WomensEditorial } from './WomensEditorial';
import { SplitEditorialStory } from './SplitEditorialStory';
import { NewArrivalsStudio } from './NewArrivalsStudio';
import { KidsEditorial } from './KidsEditorial';
import { BestSellersSection } from './BestSellersSection';
import { TestimonialsSection } from './TestimonialsSection';
import { BrandPartnersSection } from './BrandPartnersSection';
import { StoreFaqSection } from './StoreFaqSection';
import { FlashSaleCountdown } from './FlashSaleCountdown';
import { InstagramFeed } from './InstagramFeed';
import { NewsletterSection } from './NewsletterSection';
import { PromotionalBanner } from './PromotionalBanner';
import { ValueProps } from './ValueProps';
import { CollectionsShowcase } from './CollectionsShowcase';

interface DynamicSectionRendererProps {
  sections?: CmsHomepageSection[];
  initialSections?: CmsHomepageSection[];
  tenantSlug?: string;
}

export function DynamicSectionRenderer({ sections, initialSections, tenantSlug }: DynamicSectionRendererProps) {
  const [liveSections, setLiveSections] = useState<CmsHomepageSection[]>(
    sections || initialSections || []
  );

  const resolvedTenant =
    tenantSlug ||
    (typeof window !== 'undefined'
      ? window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/)?.[2] ||
        new URLSearchParams(window.location.search).get('tenant') ||
        ''
      : '') ||
    'demo';

  useEffect(() => {
    if (sections && sections.length > 0) {
      setLiveSections(sections);
    }
  }, [sections]);

  const fetchLatestSections = useCallback(async () => {
    try {
      const isDraft =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('preview') === 'draft';
      const draftQuery = isDraft ? '&status=draft' : '';
      const res = await fetch(
        `/api/v1/content/homepage?tenant=${encodeURIComponent(resolvedTenant)}${draftQuery}&_t=${Date.now()}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        const apiSections = json?.data?.sections;
        if (Array.isArray(apiSections) && apiSections.length > 0) {
          setLiveSections(apiSections);
        }
      }
    } catch {
      // Retain current state on fetch failure
    }
  }, [resolvedTenant]);

  // Initial client-side sync and draft check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDraft = new URLSearchParams(window.location.search).get('preview') === 'draft';
      if (isDraft) {
        try {
          const cachedDraft = localStorage.getItem(`jq_homepage_sections_${resolvedTenant}`);
          if (cachedDraft) {
            const parsed = JSON.parse(cachedDraft);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLiveSections(parsed);
            }
          }
        } catch {}
      }
    }

    fetchLatestSections();
  }, [resolvedTenant, fetchLatestSections]);

  // Real-time live preview sync with Visual Theme Studio iframe and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (
        data.type === 'HOMEPAGE_UPDATED' ||
        data.type === 'MAVENCO_HOMEPAGE_PREVIEW' ||
        data.type === 'MAVENCO_THEME_PREVIEW' ||
        data.type === 'VISUAL_BUILDER_UPDATE'
      ) {
        if (Array.isArray(data.sections) && data.sections.length > 0) {
          setLiveSections(data.sections);
        } else {
          fetchLatestSections();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_homepage_updated' ||
        event.key === `jq_homepage_sections_${resolvedTenant}` ||
        event.key === 'jq_active_tenant'
      ) {
        if (event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLiveSections(parsed);
              return;
            }
          } catch {}
        }
        fetchLatestSections();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [resolvedTenant, fetchLatestSections]);

  const now = new Date();

  // Filter visible and scheduled sections, sorted by order / displayOrder
  const activeSections = (liveSections || [])
    .filter((sec: any) => {
      if (!sec || sec.enabled === false || sec.isVisible === false) return false;

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
        const styles = section.styles || {};

        let sectionElement: React.ReactNode = null;

        switch (section.type) {
          // 1. Curated Collections & Lookbooks [COLLECTIONS]
          case 'collections':
          case 'collection':
          case 'lookbook':
          case 'lookbooks':
          case 'collections-grid':
          case 'collections_grid':
          case 'collections_showcase':
          case 'curated-collections':
          case 'curated_collection':
          case 'curated-collection':
            sectionElement = (
              <CollectionsShowcase
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCtaText={sData.ctaText || sData.primaryBtnText || sData.buttonText}
                customCtaUrl={sData.ctaUrl || sData.primaryBtnLink || sData.buttonUrl || sData.link}
                customBannerImage={sData.bannerImage || sData.image || sData.backgroundImage}
                customCollections={sData.collectionsList || sData.collections || sData.items}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 2. Brand Value Propositions & Guarantees [VALUE_PROPS]
          case 'value_props':
          case 'value-props':
          case 'valueprops':
          case 'features':
          case 'service_guarantees':
            sectionElement = (
              <ValueProps
                key={section.id}
                customItems={sData.items || sData.promises}
              />
            );
            break;

          // 3. Full-Width Hero Banner [HERO]
          case 'hero':
            sectionElement = (
              <HeroSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customSettings={{
                  tagline: badge,
                  primaryBtnText: sData.primaryBtnText || sData.primaryCtaText || sData.ctaText || 'Shop The Collection',
                  primaryBtnLink: formatTenantHref(sData.primaryBtnLink || sData.primaryCtaUrl || sData.ctaUrl || '/collections', resolvedTenant),
                  secondaryBtnText: sData.secondaryBtnText || sData.secondaryCtaText || 'Explore Lookbook',
                  secondaryBtnLink: formatTenantHref(sData.secondaryBtnLink || sData.secondaryCtaUrl || '/about', resolvedTenant),
                  desktopImage: image,
                  mobileImage: sData.mobileImage || image,
                  overlayOpacity: typeof sData.overlayOpacity === 'number' ? (sData.overlayOpacity <= 1 ? sData.overlayOpacity * 100 : sData.overlayOpacity) : 40,
                  contentAlign: sData.contentAlign || 'center',
                  minHeight: sData.minHeight || '620px',
                }}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 4. Featured Products Grid [PRODUCTS_GRID]
          case 'trending':
          case 'product-grid':
          case 'products':
          case 'products_grid':
          case 'featured_products':
            sectionElement = (
              <TrendingSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customLimit={sData.limit || 8}
                querySource={sData.querySource || 'best_sellers'}
                columnsDesktop={sData.columnsDesktop === 2 || sData.columnsDesktop === 3 || sData.columnsDesktop === 4 ? sData.columnsDesktop : 4}
                customCtaText={sData.primaryBtnText || sData.ctaText || sData.primaryCtaText || 'Explore All'}
                customCtaUrl={sData.primaryBtnLink || sData.ctaUrl || sData.primaryCtaUrl || '/collections'}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 5. Product Carousel / Slider [PRODUCT_CAROUSEL]
          case 'new-arrivals':
          case 'product-carousel':
          case 'product_carousel':
          case 'carousel':
            sectionElement = (
              <NewArrivalsStudio
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customLimit={sData.limit || 6}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 6. Shop by Category Tiles [CATEGORIES]
          case 'category-grid':
          case 'categories':
            sectionElement = (
              <CategoryShowcase
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCategories={sData.categoriesList || sData.categories || sData.items}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 7. Split Image + Story Editorial [IMAGE_TEXT]
          case 'image_text':
          case 'split-image-text':
          case 'editorial-story':
            sectionElement = (
              <SplitEditorialStory
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customDescription={sData.description || subtitle}
                customBadge={badge}
                customImage={image}
                imagePosition={sData.imagePosition === 'right' ? 'right' : 'left'}
                customBtnText={sData.btnText || sData.ctaText || 'READ OUR STORY'}
                customBtnLink={sData.btnLink || sData.ctaUrl || '/about'}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          case 'womens-editorial':
          case 'collection-banner':
          case 'editorial':
            sectionElement = (
              <WomensEditorial
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customImage={image}
                customCtaText={sData.btnText || sData.ctaText || sData.primaryCtaText || 'Read Our Story'}
                customCtaUrl={sData.btnLink || sData.ctaUrl || sData.primaryCtaUrl || '/about'}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 8. Promotional Campaign Banner [PROMOTIONAL_BANNER]
          case 'promo-banner':
          case 'promotional-banner':
          case 'promotional_banner':
            sectionElement = (
              <PromotionalBanner
                key={section.id}
                customTitle={title}
                customSubtitle={sData.description || subtitle}
                customBadge={badge}
                customPrimaryCtaText={sData.btnText || sData.ctaText || sData.primaryCtaText || 'Claim Privilege'}
                customPrimaryCtaUrl={sData.btnLink || sData.ctaUrl || sData.primaryCtaUrl || '/collections'}
                bgColor={sData.bgColor}
                textColor={sData.textColor}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 9. Flash Sale Countdown Timer [COUNTDOWN]
          case 'countdown':
          case 'flash-sale':
          case 'flash_sale':
          case 'countdown-timer':
            sectionElement = (
              <FlashSaleCountdown
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge || 'Private Flash Sale'}
                targetDate={sData.targetDate || sData.endDate}
                customBtnText={sData.btnText || sData.ctaText || 'SHOP SALE NOW'}
                customBtnLink={sData.btnLink || sData.ctaUrl || '/sale'}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 10. VIP Newsletter Box [NEWSLETTER]
          case 'newsletter':
          case 'newsletter-club':
            sectionElement = (
              <NewsletterSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCouponPromo={sData.discountText || sData.couponCode}
                customButtonText={sData.btnText || 'Subscribe'}
                customPlaceholder={sData.placeholder}
                customSuccessMsg={sData.successMsg}
              />
            );
            break;

          // 11. Customer Reviews & Press Quotes [TESTIMONIALS]
          case 'testimonials':
          case 'reviews':
            sectionElement = (
              <TestimonialsSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customReviews={sData.testimonialsList || sData.testimonials || sData.items}
              />
            );
            break;

          // 12. Brand Partners & Press Logos [BRANDS]
          case 'brands':
          case 'brand-partners':
          case 'partners':
          case 'press':
          case 'press-logos':
            sectionElement = (
              <BrandPartnersSection
                key={section.id}
                customTitle={title || 'AS FEATURED IN'}
                customSubtitle={subtitle}
                customBadge={badge}
                customLogos={sData.logos || sData.items || sData.brands}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 13. FAQ Accordions [FAQ]
          case 'faq':
          case 'faqs':
          case 'accordion':
          case 'faq-accordions':
            sectionElement = (
              <StoreFaqSection
                key={section.id}
                customTitle={title || 'Frequently Asked Questions'}
                customSubtitle={subtitle}
                customBadge={badge}
                customFaqs={sData.faqList || sData.items || sData.faqs}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 14. Instagram / Social Gallery [SOCIAL_GRID]
          case 'instagram-feed':
          case 'instagram':
          case 'social':
          case 'social_grid': {
            const rawImages = sData.images || sData.posts || sData.items;
            const mappedPosts = Array.isArray(rawImages)
              ? rawImages.map((img: any, i: number) => {
                  if (typeof img === 'string') {
                    return {
                      id: i + 1,
                      image: img,
                      likes: '2.4k',
                      tag: '#AtelierStyle',
                    };
                  }
                  return img;
                })
              : undefined;

            sectionElement = (
              <InstagramFeed
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customHandle={sData.handle || sData.accountHandle}
                customPosts={mappedPosts}
              />
            );
            break;
          }

          // 15. Vertical Spacer [SPACER]
          case 'spacer': {
            const hDesktop = sData.heightDesktop || '48px';
            const hMobile = sData.heightMobile || sData.height || '24px';
            sectionElement = (
              <div
                key={section.id}
                className="w-full transition-all"
                style={{
                  height: hDesktop,
                  // Responsive height via CSS custom variable
                  '--spacer-h-mobile': hMobile,
                  '--spacer-h-desktop': hDesktop,
                } as React.CSSProperties}
              />
            );
            break;
          }

          case 'kids-editorial':
            sectionElement = (
              <KidsEditorial
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customCtaText={sData.ctaText || sData.primaryCtaText}
                customCtaUrl={sData.ctaUrl || sData.primaryCtaUrl}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          case 'best-sellers':
            sectionElement = (
              <BestSellersSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                customLimit={sData.limit || 4}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          case 'divider':
            sectionElement = (
              <div key={section.id} className="max-w-7xl mx-auto px-6 py-4">
                <hr className="border-t border-slate-200 dark:border-white/10" />
              </div>
            );
            break;

          default:
            sectionElement = null;
            break;
        }

        if (!sectionElement) return null;

        // Wrap each section with dynamic CSS variables and section styles configured in Visual Theme Studio
        const sectionStyle: React.CSSProperties = {
          backgroundColor: styles.backgroundColor,
          color: styles.textColor,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          ...(styles.customStyles || {}),
          // Dynamic CSS Variables per section
          ['--section-bg' as any]: styles.backgroundColor || 'transparent',
          ['--section-text' as any]: styles.textColor || 'inherit',
          ['--section-accent' as any]: styles.accentColor || 'var(--theme-color-accent, #B77A68)',
          ['--section-pt' as any]: styles.paddingTop || '0px',
          ['--section-pb' as any]: styles.paddingBottom || '0px',
        };

        return (
          <div
            key={section.id}
            id={`section-${section.id}`}
            data-section-type={section.type}
            data-section-order={section.order ?? section.displayOrder}
            className={`w-full relative transition-colors duration-200 ${section.className || ''}`}
            style={sectionStyle}
          >
            {sectionElement}
          </div>
        );
      })}

      {/* Auto-render Collections & Lookbooks showcase only if unconfigured fallback (e.g. 0 active sections) */}
      {activeSections.length === 0 && (
        <CollectionsShowcase key="sec_auto_collections" tenantSlug={resolvedTenant} />
      )}
    </>
  );
}
