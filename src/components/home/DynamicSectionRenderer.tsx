'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { SmartSearchSection } from './SmartSearchSection';
import { PromoTagsSection } from './PromoTagsSection';
import { SalesAnalyticsSection } from './SalesAnalyticsSection';
import { StarRatingsQaSection } from './StarRatingsQaSection';
import { StoreLocatorSection } from './StoreLocatorSection';
import { GiftCardsSection } from './GiftCardsSection';
import { ReferralLoyaltySection } from './ReferralLoyaltySection';
import { OrderTrackingSection } from './OrderTrackingSection';

interface DynamicSectionRendererProps {
  sections?: CmsHomepageSection[];
  initialSections?: CmsHomepageSection[];
  tenantSlug?: string;
}

class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; sectionId?: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(`DynamicSectionRenderer error in section [${this.props.sectionId}]:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
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

  const fetchingRef = useRef(false);
  const fetchedTenantRef = useRef<string | null>(null);

  const fetchLatestSections = useCallback(async (force = false) => {
    if (!force && fetchingRef.current) return;
    if (!force && fetchedTenantRef.current === resolvedTenant) return;

    fetchingRef.current = true;
    try {
      const isDraft =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('preview') === 'draft';
      const draftQuery = isDraft ? '&status=draft' : '';
      const cacheBust = isDraft || force ? `&_t=${Date.now()}` : '';
      const res = await fetch(
        `/api/v1/content/homepage?tenant=${encodeURIComponent(resolvedTenant)}${draftQuery}${cacheBust}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        const apiSections = json?.data?.sections;
        if (Array.isArray(apiSections) && apiSections.length > 0) {
          setLiveSections(apiSections);
          fetchedTenantRef.current = resolvedTenant;
        }
      }
    } catch {
      // Retain current state on fetch failure
    } finally {
      fetchingRef.current = false;
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
          fetchLatestSections(true);
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_homepage_updated' ||
        event.key === `jq_homepage_sections_${resolvedTenant}`
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
        fetchLatestSections(true);
      } else if (event.key === 'jq_active_tenant' && event.newValue && event.newValue !== resolvedTenant) {
        fetchLatestSections(true);
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

  // Dynamically load Google Fonts used by any active section
  const usedFonts = new Set<string>();
  activeSections.forEach((sec: any) => {
    const d = sec?.data || sec?.settings || {};
    if (d.headingFontFamily) usedFonts.add(d.headingFontFamily);
    if (d.subtitleFontFamily) usedFonts.add(d.subtitleFontFamily);
    if (d.badgeFontFamily) usedFonts.add(d.badgeFontFamily);
    if (d.btnFontFamily) usedFonts.add(d.btnFontFamily);
  });

  const GOOGLE_FONTS_MAP: Record<string, string> = {
    'Playfair Display': 'family=Playfair+Display:ital,wght@0,400..900;1,400..900',
    'Cormorant Garamond': 'family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700',
    'Cinzel': 'family=Cinzel:wght@400..900',
    'Bodoni Moda': 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900',
    'Plus Jakarta Sans': 'family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800',
    'Inter': 'family=Inter:wght@100..900',
    'Outfit': 'family=Outfit:wght@100..900',
    'Montserrat': 'family=Montserrat:ital,wght@0,100..900;1,100..900',
    'Syne': 'family=Syne:wght@400..800',
    'Space Grotesk': 'family=Space+Grotesk:wght@300..700',
    'Pinyon Script': 'family=Pinyon+Script',
    'Great Vibes': 'family=Great+Vibes',
  };

  const fontQueries = Array.from(usedFonts)
    .map((f) => GOOGLE_FONTS_MAP[f] || `family=${encodeURIComponent(f)}:wght@400;600;700`)
    .filter(Boolean);

  const googleFontsUrl =
    fontQueries.length > 0
      ? `https://fonts.googleapis.com/css2?${fontQueries.join('&')}&display=swap`
      : null;

  return (
    <>
      {googleFontsUrl && (
        <link rel="stylesheet" href={googleFontsUrl} />
      )}
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
                customTitle={title}
                customSubtitle={subtitle}
                customItems={sData.items || sData.promises}
                columnsDesktop={sData.columns || sData.columnsDesktop || 4}
                contentAlign={sData.contentAlign || sData.textAlignment || 'center'}
                containerWidth={sData.containerWidth || 'contained'}
                cardStyle={sData.cardStyle || 'bordered'}
                paddingTop={sData.paddingTop || styles?.paddingTop}
                paddingBottom={sData.paddingBottom || styles?.paddingBottom}
                bgColor={sData.bgColor || styles?.backgroundColor}
                textColor={sData.textColor || styles?.color}
              />
            );
            break;

          // 3. Full-Width Hero Banner & Multi-Slide Carousel [HERO & SLIDER]
          case 'hero':
          case 'slider':
          case 'hero_slider':
          case 'hero-slider':
          case 'hero_carousel':
            sectionElement = (
              <HeroSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customSettings={{
                  tagline: badge,
                  primaryBtnText: sData.primaryBtnText || sData.primaryCtaText || sData.ctaText || 'Shop Collection',
                  primaryBtnLink: sData.primaryBtnLink || sData.primaryCtaUrl || sData.ctaUrl || '/collections',
                  secondaryBtnText: sData.secondaryBtnText || sData.secondaryCtaText,
                  secondaryBtnLink: sData.secondaryBtnLink || sData.secondaryCtaUrl || '/about',
                  desktopImage: image,
                  mobileImage: sData.mobileImage || image,
                  overlayOpacity: typeof sData.overlayOpacity === 'number' ? (sData.overlayOpacity <= 1 ? sData.overlayOpacity * 100 : sData.overlayOpacity) : 45,
                  overlayColor: sData.overlayColor || '#000000',
                  contentAlign: sData.contentAlign || sData.textAlignment || 'center',
                  layout: sData.layout || (section.type === 'slider' || section.type === 'hero_slider' ? 'slider' : 'centered'),
                  minHeight: sData.minHeight || '640px',
                  bgColor: sData.bgColor || styles?.backgroundColor,
                  bgGradient: sData.bgGradient || styles?.backgroundImage,
                  textColor: sData.textColor || styles?.color,
                  paddingTop: sData.paddingTop || styles?.paddingTop,
                  paddingBottom: sData.paddingBottom || styles?.paddingBottom,
                  containerWidth: sData.containerWidth || 'contained',

                  // Button Placements & Styling
                  buttonPlacement: sData.buttonPlacement || sData.contentAlign || 'center',
                  buttonOrientation: sData.buttonOrientation || 'inline',
                  btnBorderRadius: sData.btnBorderRadius,
                  primaryBtnVariant: sData.primaryBtnVariant,
                  primaryBtnColor: sData.primaryBtnColor,
                  primaryBtnTextColor: sData.primaryBtnTextColor,
                  secondaryBtnVariant: sData.secondaryBtnVariant,
                  secondaryBtnColor: sData.secondaryBtnColor,
                  secondaryBtnTextColor: sData.secondaryBtnTextColor,

                  // Typography Customization
                  headingFontFamily: sData.headingFontFamily,
                  headingColor: sData.headingColor,
                  headingFontSize: sData.headingFontSize,
                  headingFontWeight: sData.headingFontWeight,
                  headingLetterSpacing: sData.headingLetterSpacing,
                  headingLineHeight: sData.headingLineHeight,
                  headingTextTransform: sData.headingTextTransform,

                  subtitleFontFamily: sData.subtitleFontFamily,
                  subtitleColor: sData.subtitleColor,
                  subtitleFontSize: sData.subtitleFontSize,
                  subtitleFontWeight: sData.subtitleFontWeight,
                  subtitleLetterSpacing: sData.subtitleLetterSpacing,
                  subtitleLineHeight: sData.subtitleLineHeight,

                  badgeFontFamily: sData.badgeFontFamily,
                  badgeColor: sData.badgeColor,
                  badgeBgColor: sData.badgeBgColor,
                  badgeFontSize: sData.badgeFontSize,
                  badgeFontWeight: sData.badgeFontWeight,
                  badgeLetterSpacing: sData.badgeLetterSpacing,
                  badgeTextTransform: sData.badgeTextTransform,

                  btnFontFamily: sData.btnFontFamily,
                  btnFontSize: sData.btnFontSize,
                  btnFontWeight: sData.btnFontWeight,
                  btnLetterSpacing: sData.btnLetterSpacing,
                  btnTextTransform: sData.btnTextTransform,

                  // Multi-Slide Carousel Data
                  slides: Array.isArray(sData.slides) ? sData.slides : undefined,
                  autoplay: sData.autoplay !== false,
                  autoplayInterval: sData.autoplayInterval || 5000,
                  showArrows: sData.showArrows !== false,
                  showDots: sData.showDots !== false,
                  pauseOnHover: sData.pauseOnHover !== false,
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
                columnsDesktop={sData.columnsDesktop || 4}
                columnsMobile={sData.columnsMobile || 2}
                contentAlign={sData.contentAlign || sData.textAlignment || 'center'}
                containerWidth={sData.containerWidth || 'contained'}
                paddingTop={sData.paddingTop || styles?.paddingTop}
                paddingBottom={sData.paddingBottom || styles?.paddingBottom}
                bgColor={sData.bgColor || styles?.backgroundColor}
                textColor={sData.textColor || styles?.color}
                headingFontFamily={sData.headingFontFamily}
                headingColor={sData.headingColor}
                headingFontSize={sData.headingFontSize}
                headingFontWeight={sData.headingFontWeight}
                headingLetterSpacing={sData.headingLetterSpacing}
                headingLineHeight={sData.headingLineHeight}
                headingTextTransform={sData.headingTextTransform}
                subtitleFontFamily={sData.subtitleFontFamily}
                subtitleColor={sData.subtitleColor}
                subtitleFontSize={sData.subtitleFontSize}
                subtitleFontWeight={sData.subtitleFontWeight}
                subtitleLetterSpacing={sData.subtitleLetterSpacing}
                subtitleLineHeight={sData.subtitleLineHeight}
                badgeFontFamily={sData.badgeFontFamily}
                badgeColor={sData.badgeColor}
                badgeBgColor={sData.badgeBgColor}
                badgeFontSize={sData.badgeFontSize}
                badgeFontWeight={sData.badgeFontWeight}
                badgeLetterSpacing={sData.badgeLetterSpacing}
                badgeTextTransform={sData.badgeTextTransform}
                btnFontFamily={sData.btnFontFamily}
                btnFontSize={sData.btnFontSize}
                btnFontWeight={sData.btnFontWeight}
                btnLetterSpacing={sData.btnLetterSpacing}
                btnTextTransform={sData.btnTextTransform}
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
                columnsDesktop={sData.columnsDesktop || 4}
                columnsTablet={sData.columnsTablet || 2}
                columnsMobile={sData.columnsMobile || 1}
                contentAlign={sData.contentAlign || sData.textAlignment || 'center'}
                containerWidth={sData.containerWidth || 'contained'}
                cardBorderRadius={sData.cardBorderRadius}
                aspectRatio={sData.aspectRatio}
                paddingTop={sData.paddingTop || styles?.paddingTop}
                paddingBottom={sData.paddingBottom || styles?.paddingBottom}
                bgColor={sData.bgColor || styles?.backgroundColor}
                textColor={sData.textColor || styles?.color}
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
                customImage={image}
                customPrimaryCtaText={sData.btnText || sData.ctaText || sData.primaryCtaText || 'Claim Privilege'}
                customPrimaryCtaUrl={sData.btnLink || sData.ctaUrl || sData.primaryCtaUrl || '/collections'}
                customSecondaryCtaText={sData.secondaryBtnText}
                customSecondaryCtaUrl={sData.secondaryBtnLink}
                contentAlign={sData.contentAlign || sData.textAlignment || 'center'}
                containerWidth={sData.containerWidth || 'contained'}
                bannerHeight={sData.bannerHeight || 'medium'}
                primaryBtnColor={sData.primaryBtnColor}
                primaryBtnTextColor={sData.primaryBtnTextColor}
                bgColor={sData.bgColor || styles?.backgroundColor}
                textColor={sData.textColor || styles?.color}
                paddingTop={sData.paddingTop || styles?.paddingTop}
                paddingBottom={sData.paddingBottom || styles?.paddingBottom}
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

          // 16. Smart Search & Filters [SMART_SEARCH]
          case 'smart-search':
          case 'smart_search':
          case 'search-filter':
            sectionElement = (
              <SmartSearchSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                placeholder={sData.placeholder}
                showFilters={sData.showFilters}
                showAutocomplete={sData.showAutocomplete}
                showRecommendations={sData.showRecommendations}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 17. Promo Tag & Badge Engine [PROMO_TAGS]
          case 'promo-tags':
          case 'promo_tags':
          case 'badge-engine':
          case 'product-badges':
            sectionElement = (
              <PromoTagsSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                badges={sData.badges}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 18. Sales Analytics Dashboard [ANALYTICS]
          case 'analytics-dashboard':
          case 'analytics_dashboard':
          case 'analytics':
          case 'sales-analytics':
            sectionElement = (
              <SalesAnalyticsSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                showRevenue={sData.showRevenue}
                showConversionFunnel={sData.showConversionFunnel}
                showTopProducts={sData.showTopProducts}
                dateRange={sData.dateRange}
              />
            );
            break;

          // 19. Star Ratings & Q&A [STAR_RATINGS_QA]
          case 'star-ratings-qa':
          case 'star_ratings_qa':
          case 'ratings-qa':
          case 'reviews-qa':
            sectionElement = (
              <StarRatingsQaSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                allowPhotoReviews={sData.allowPhotoReviews}
                allowMerchantReply={sData.allowMerchantReply}
                showQASection={sData.showQASection}
                minRatingToShow={sData.minRatingToShow}
              />
            );
            break;

          // 20. Store Locator & Map [STORE_LOCATOR]
          case 'store-locator':
          case 'store_locator':
          case 'locations':
          case 'map':
            sectionElement = (
              <StoreLocatorSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                locations={sData.locations}
                showOpeningHours={sData.showOpeningHours}
                showDirectionsButton={sData.showDirectionsButton}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 21. Gift Card & Voucher Block [GIFT_CARDS]
          case 'gift-cards':
          case 'gift_cards':
          case 'gift-card':
          case 'vouchers':
            sectionElement = (
              <GiftCardsSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                denominations={sData.denominations}
                allowCustomAmount={sData.allowCustomAmount}
                ctaText={sData.ctaText}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 22. Referral & Loyalty Module [REFERRAL_LOYALTY]
          case 'referral-loyalty':
          case 'referral_loyalty':
          case 'loyalty':
          case 'rewards':
            sectionElement = (
              <ReferralLoyaltySection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                pointsPerRupee={sData.pointsPerRupee}
                tiers={sData.tiers}
                referralBonusPoints={sData.referralBonusPoints}
                tenantSlug={resolvedTenant}
              />
            );
            break;

          // 23. Order Tracking Timeline [ORDER_TRACKING]
          case 'order-tracking':
          case 'order_tracking':
          case 'tracking':
          case 'shipment-tracking':
            sectionElement = (
              <OrderTrackingSection
                key={section.id}
                customTitle={title}
                customSubtitle={subtitle}
                customBadge={badge}
                showEtaCountdown={sData.showEtaCountdown}
                showCourierDetails={sData.showCourierDetails}
                supportEmail={sData.supportEmail}
              />
            );
            break;

          default:
            sectionElement = null;
            break;
        }

        if (!sectionElement) return null;

        // Responsive visibility based on section.visibilityDevice
        let deviceVisibilityClass = '';
        if (section.visibilityDevice) {
          const { desktop, tablet, mobile } = section.visibilityDevice;
          if (desktop === false && tablet === false && mobile === false) return null;
          if (desktop === false) deviceVisibilityClass += ' lg:hidden';
          if (tablet === false) deviceVisibilityClass += ' md:max-lg:hidden';
          if (mobile === false) deviceVisibilityClass += ' max-md:hidden';
        }

        // Universal Typography scoped CSS generator
        const secSelector = `[id="section-${section.id}"]`;
        let scopedCss = '';

        const headingRules: string[] = [];
        if (sData.headingFontFamily) headingRules.push(`font-family: "${sData.headingFontFamily}", serif !important;`);
        if (sData.headingColor) headingRules.push(`color: ${sData.headingColor} !important;`);
        if (sData.headingFontSize) headingRules.push(`font-size: ${sData.headingFontSize} !important;`);
        if (sData.headingFontWeight) headingRules.push(`font-weight: ${sData.headingFontWeight} !important;`);
        if (sData.headingLetterSpacing) headingRules.push(`letter-spacing: ${sData.headingLetterSpacing} !important;`);
        if (sData.headingLineHeight) headingRules.push(`line-height: ${sData.headingLineHeight} !important;`);
        if (sData.headingTextTransform) headingRules.push(`text-transform: ${sData.headingTextTransform} !important;`);
        if (headingRules.length > 0) {
          scopedCss += `${secSelector} h1, ${secSelector} h2, ${secSelector} h3, ${secSelector} [data-typography="heading"] { ${headingRules.join(' ')} }\n`;
        }

        const subtitleRules: string[] = [];
        if (sData.subtitleFontFamily) subtitleRules.push(`font-family: "${sData.subtitleFontFamily}", sans-serif !important;`);
        if (sData.subtitleColor) subtitleRules.push(`color: ${sData.subtitleColor} !important;`);
        if (sData.subtitleFontSize) subtitleRules.push(`font-size: ${sData.subtitleFontSize} !important;`);
        if (sData.subtitleFontWeight) subtitleRules.push(`font-weight: ${sData.subtitleFontWeight} !important;`);
        if (sData.subtitleLetterSpacing) subtitleRules.push(`letter-spacing: ${sData.subtitleLetterSpacing} !important;`);
        if (sData.subtitleLineHeight) subtitleRules.push(`line-height: ${sData.subtitleLineHeight} !important;`);
        if (subtitleRules.length > 0) {
          scopedCss += `${secSelector} p:not(button p), ${secSelector} [data-typography="subtitle"] { ${subtitleRules.join(' ')} }\n`;
        }

        const badgeRules: string[] = [];
        if (sData.badgeFontFamily) badgeRules.push(`font-family: "${sData.badgeFontFamily}", sans-serif !important;`);
        if (sData.badgeColor) badgeRules.push(`color: ${sData.badgeColor} !important;`);
        if (sData.badgeBgColor) badgeRules.push(`background-color: ${sData.badgeBgColor} !important;`);
        if (sData.badgeFontSize) badgeRules.push(`font-size: ${sData.badgeFontSize} !important;`);
        if (sData.badgeFontWeight) badgeRules.push(`font-weight: ${sData.badgeFontWeight} !important;`);
        if (sData.badgeLetterSpacing) badgeRules.push(`letter-spacing: ${sData.badgeLetterSpacing} !important;`);
        if (sData.badgeTextTransform) badgeRules.push(`text-transform: ${sData.badgeTextTransform} !important;`);
        if (badgeRules.length > 0) {
          scopedCss += `${secSelector} span.uppercase, ${secSelector} [data-typography="badge"] { ${badgeRules.join(' ')} }\n`;
        }

        const btnRules: string[] = [];
        if (sData.btnFontFamily) btnRules.push(`font-family: "${sData.btnFontFamily}", sans-serif !important;`);
        if (sData.btnFontSize) btnRules.push(`font-size: ${sData.btnFontSize} !important;`);
        if (sData.btnFontWeight) btnRules.push(`font-weight: ${sData.btnFontWeight} !important;`);
        if (sData.btnLetterSpacing) btnRules.push(`letter-spacing: ${sData.btnLetterSpacing} !important;`);
        if (sData.btnTextTransform) btnRules.push(`text-transform: ${sData.btnTextTransform} !important;`);
        if (btnRules.length > 0) {
          scopedCss += `${secSelector} button, ${secSelector} .btn, ${secSelector} [data-typography="button"] { ${btnRules.join(' ')} }\n`;
        }

        // Wrap each section with dynamic CSS variables and section styles configured in Visual Theme Studio
        const sectionStyle: React.CSSProperties = {
          backgroundColor: styles.backgroundColor || sData.bgColor,
          color: styles.textColor || sData.textColor,
          paddingTop: styles.paddingTop || sData.paddingTop,
          paddingBottom: styles.paddingBottom || sData.paddingBottom,
          ...(styles.customStyles || {}),
          // Dynamic CSS Variables per section
          ['--section-bg' as any]: styles.backgroundColor || sData.bgColor || 'transparent',
          ['--section-text' as any]: styles.textColor || sData.textColor || 'inherit',
          ['--section-accent' as any]: styles.accentColor || 'var(--theme-color-accent, #B77A68)',
          ['--section-pt' as any]: styles.paddingTop || sData.paddingTop || '0px',
          ['--section-pb' as any]: styles.paddingBottom || sData.paddingBottom || '0px',
          ['--sec-heading-font' as any]: sData.headingFontFamily ? `"${sData.headingFontFamily}", serif` : undefined,
          ['--sec-heading-color' as any]: sData.headingColor || undefined,
          ['--sec-subtitle-font' as any]: sData.subtitleFontFamily ? `"${sData.subtitleFontFamily}", sans-serif` : undefined,
          ['--sec-subtitle-color' as any]: sData.subtitleColor || undefined,
          ['--sec-badge-font' as any]: sData.badgeFontFamily ? `"${sData.badgeFontFamily}", sans-serif` : undefined,
          ['--sec-badge-color' as any]: sData.badgeColor || undefined,
          ['--sec-btn-font' as any]: sData.btnFontFamily ? `"${sData.btnFontFamily}", sans-serif` : undefined,
        };

        return (
          <SectionErrorBoundary key={section.id} sectionId={section.id}>
            <div
              id={`section-${section.id}`}
              data-section-type={section.type}
              data-section-order={section.order ?? section.displayOrder}
              className={`w-full relative transition-colors duration-200 ${deviceVisibilityClass} ${section.className || ''}`}
              style={sectionStyle}
            >
              {scopedCss && (
                <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
              )}
              {sectionElement}
            </div>
          </SectionErrorBoundary>
        );
      })}

      {/* Auto-render Collections & Lookbooks showcase only if unconfigured fallback (e.g. 0 active sections) */}
      {activeSections.length === 0 && (
        <CollectionsShowcase key="sec_auto_collections" tenantSlug={resolvedTenant} />
      )}
    </>
  );
}
