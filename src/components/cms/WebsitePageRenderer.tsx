'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  RefreshCw,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';

export interface CustomHtmlSectionItem {
  id: string;
  title: string;
  enabled: boolean;
  html: string;
  containerWidth?: 'full' | 'standard' | 'narrow';
  backgroundColor?: string;
  textColor?: string;
}

export interface WebsitePageData {
  id?: string;
  title: string;
  slug: string;
  status?: string;
  type?: string;
  blocks?: Array<{
    type: string;
    data?: Record<string, any>;
  }>;
  sectionsEnabled?: {
    hero?: boolean;
    body?: boolean;
    customSections?: boolean;
    valueProps?: boolean;
  };
  customSections?: CustomHtmlSectionItem[];
  design?: {
    pageBg?: string;
    textColor?: string;
    mutedTextColor?: string;
    headingFont?: string;
    bodyFont?: string;
    accentColor?: string;
    heroBg?: string;
    heroTitleColor?: string;
    heroSubtitleColor?: string;
    cardBg?: string;
    cardBorder?: string;
  };
  styles?: Record<string, any>;
  content?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  tenantSlug?: string;
  updatedAt?: string;
}

export interface WebsitePageRendererProps {
  initialPage: WebsitePageData;
  tenantSlug?: string;
}

export function WebsitePageRenderer({ initialPage, tenantSlug }: WebsitePageRendererProps) {
  const [page, setPage] = useState<WebsitePageData>(initialPage);

  // Synchronize when initialPage prop changes
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Real-time live synchronization with Admin Panel "Website Pages" editor
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (
        data.type === 'PAGE_UPDATED' ||
        data.type === 'CMS_PAGE_UPDATED' ||
        data.type === 'WEBSITE_PAGE_UPDATED' ||
        data.type === 'MAVENCO_PAGE_PREVIEW' ||
        data.type === 'VISUAL_BUILDER_UPDATE'
      ) {
        const incoming = data.page || data.config || data.data;
        if (incoming && (incoming.slug === page.slug || incoming.id === page.id || !incoming.slug)) {
          setPage((prev) => ({ ...prev, ...incoming }));
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_page_updated' ||
        event.key === `jq_page_${page.slug}` ||
        event.key === `jq_page_${tenantSlug}`
      ) {
        if (event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (parsed && typeof parsed === 'object') {
              setPage((prev) => ({ ...prev, ...parsed }));
            }
          } catch {}
        }
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [page.slug, page.id, tenantSlug]);

  const activeSlug = (tenantSlug || page.tenantSlug || '').toLowerCase();
  const isJewelry =
    activeSlug.includes('silvora') ||
    activeSlug.includes('jewel') ||
    activeSlug.includes('aurum') ||
    activeSlug.includes('watch') ||
    page.title?.toLowerCase().includes('solitaire') ||
    page.title?.toLowerCase().includes('gold');

  const d = page.design || page.styles || {};
  const pageBg = d.pageBg || (isJewelry ? '#07090E' : '#FFFDFC');
  const textColor = d.textColor || (isJewelry ? '#F8FAFC' : '#111111');
  const mutedColor = d.mutedTextColor || (isJewelry ? '#94A3B8' : '#777777');
  const accentColor = d.accentColor || (isJewelry ? '#EAB308' : '#B77A68');
  const headingFont = d.headingFont || (isJewelry ? 'Playfair Display, serif' : 'serif');
  const bodyFont = d.bodyFont || (isJewelry ? 'Plus Jakarta Sans, sans-serif' : 'sans-serif');
  const heroBg = d.heroBg || (isJewelry ? '#111422' : '#111111');
  const cardBg = d.cardBg || (isJewelry ? '#0E111C' : '#FAF6F2');
  const cardBorder = d.cardBorder || (isJewelry ? 'rgba(234, 179, 8, 0.2)' : '#E8DED8');

  // Dynamic CSS Variables Scoped to Website Pages
  const pageCssVariables = useMemo(() => {
    return `
      :root {
        --page-accent: ${accentColor};
        --page-hero-bg: ${heroBg};
        --page-bg: ${pageBg};
        --page-text: ${textColor};
        --page-muted: ${mutedColor};
        --page-surface: ${cardBg};
        --page-border: ${cardBorder};
        --page-font-heading: ${headingFont};
        --page-font-body: ${bodyFont};
      }
    `.trim();
  }, [accentColor, heroBg, pageBg, textColor, mutedColor, cardBg, cardBorder, headingFont, bodyFont]);

  const sec = page.sectionsEnabled || {
    hero: true,
    body: true,
    customSections: true,
    valueProps: true,
  };

  const heroBlock = page.blocks?.find((b) => b.type === 'hero');
  const richTextBlocks = page.blocks?.filter((b) => b.type === 'rich-text') || [];
  const customSections = (page.customSections || []).filter((s) => s.enabled !== false);
  const rawHtmlContent = page.content || '';

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: pageBg,
        color: textColor,
        fontFamily: bodyFont,
      }}
    >
      {/* Scoped Dynamic CSS Variables */}
      <style id="dynamic-page-tokens" dangerouslySetInnerHTML={{ __html: pageCssVariables }} />

      {/* 1. Breadcrumb Navigation */}
      <div
        className="py-3 border-b"
        style={{ backgroundColor: cardBg, borderColor: cardBorder }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-sans" style={{ color: mutedColor }}>
            <Link
              href={formatTenantHref('/', tenantSlug)}
              className="hover:opacity-80 transition-opacity"
              style={{ color: mutedColor }}
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="font-semibold" style={{ color: textColor }}>{page.title}</span>
          </nav>
        </div>
      </div>

      {/* 2. Top Hero Header Section (Honors sectionsEnabled.hero) */}
      {sec.hero !== false && (
        heroBlock ? (
          <section
            className="relative py-20 md:py-28 overflow-hidden shadow-sm text-white"
            style={{ backgroundColor: heroBg }}
          >
            <Image
              src={
                heroBlock.data?.image ||
                (isJewelry
                  ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop')
              }
              alt={page.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4">
              {heroBlock.data?.badge && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xs"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    borderColor: `${accentColor}40`,
                    borderWidth: '1px',
                  }}
                >
                  <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest"
                    style={{ color: accentColor }}
                  >
                    {heroBlock.data.badge}
                  </span>
                </div>
              )}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white"
                style={{ fontFamily: headingFont, color: d.heroTitleColor || '#FFFFFF' }}
              >
                {heroBlock.data?.title || page.title}
              </h1>
              {heroBlock.data?.subtitle && (
                <p
                  className="text-sm sm:text-base max-w-2xl font-sans leading-relaxed"
                  style={{ color: d.heroSubtitleColor || '#CBD5E1' }}
                >
                  {heroBlock.data.subtitle}
                </p>
              )}
            </div>
          </section>
        ) : (
          <section
            className="py-12 md:py-16 border-b"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
              <span
                className="text-xs uppercase font-bold tracking-widest block"
                style={{ color: accentColor }}
              >
                Atelier Editorial
              </span>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
                style={{ fontFamily: headingFont, color: textColor }}
              >
                {page.title}
              </h1>
              <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: accentColor }} />
            </div>
          </section>
        )
      )}

      {/* 3. Main Body Editorial Articles & Rich-Text Story (Honors sectionsEnabled.body) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        {sec.body !== false && (
          <>
            {richTextBlocks.length > 0 ? (
              richTextBlocks.map((block, idx) => {
                const heading = block.data?.heading;
                const contentHtml = block.data?.content || block.data?.html || '';

                return (
                  <article key={idx} className="space-y-6">
                    {heading && heading !== page.title && (
                      <h2
                        className="text-2xl sm:text-3xl font-bold border-b pb-3"
                        style={{ fontFamily: headingFont, color: textColor, borderColor: cardBorder }}
                      >
                        {heading}
                      </h2>
                    )}

                    {contentHtml ? (
                      <div
                        className="prose prose-stone prose-lg max-w-none font-sans leading-relaxed
                          prose-headings:font-bold
                          prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:border-b prose-h2:pb-3 prose-h2:mt-10
                          prose-h3:text-xl
                          prose-p:text-sm prose-p:sm:text-base prose-p:leading-relaxed
                          prose-li:text-sm prose-li:sm:text-base
                          prose-strong:font-bold
                          prose-a:underline hover:prose-a:opacity-80"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                      />
                    ) : null}
                  </article>
                );
              })
            ) : rawHtmlContent ? (
              <article
                className="prose prose-stone prose-lg max-w-none font-sans leading-relaxed"
                style={{ color: textColor }}
                dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
              />
            ) : null}
          </>
        )}

        {/* 4. Custom HTML Sections (The requested Component for HTML!) */}
        {sec.customSections !== false && customSections.length > 0 && (
          <div className="space-y-10 pt-4">
            {customSections.map((cSec) => (
              <section
                key={cSec.id}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  backgroundColor: cSec.backgroundColor || cardBg,
                  border: `1px solid ${cardBorder}`,
                }}
              >
                {cSec.title && (
                  <div
                    className="px-6 py-3 border-b text-xs font-bold uppercase tracking-wider"
                    style={{ borderColor: cardBorder, color: accentColor }}
                  >
                    {cSec.title}
                  </div>
                )}
                <div
                  className={`p-6 ${
                    cSec.containerWidth === 'narrow'
                      ? 'max-w-3xl mx-auto'
                      : cSec.containerWidth === 'full'
                      ? 'w-full'
                      : 'max-w-6xl mx-auto'
                  }`}
                  dangerouslySetInnerHTML={{ __html: cSec.html }}
                />
              </section>
            ))}
          </div>
        )}

        {/* 5. Value Props & Guarantee Banner (Category-Aligned, Honors sectionsEnabled.valueProps) */}
        {sec.valueProps !== false && (
          <div
            className="mt-16 p-8 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xs border"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            {isJewelry ? (
              <>
                <div className="space-y-2">
                  <ShieldCheck className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    Armored Vault Transit
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    100% insured delivery via Brink&apos;s &amp; Malca-Amit
                  </p>
                </div>
                <div className="space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    GIA Solitaire Certified
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    Laser-inscribed verifiable diamond dossiers
                  </p>
                </div>
                <div className="space-y-2">
                  <RefreshCw className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    Lifetime Atelier Care
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    Complimentary ultrasonic cleaning &amp; resizing
                  </p>
                </div>
                <div className="space-y-2">
                  <HeartHandshake className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    Private Haute Salons
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    VIP viewing lounges in Delhi, Mumbai, &amp; Bengaluru
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Truck className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    Express Delivery
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    Free shipping above ₹999 across India
                  </p>
                </div>
                <div className="space-y-2">
                  <RefreshCw className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    Easy 7-Day Returns
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    Hassle-free doorstep exchange
                  </p>
                </div>
                <div className="space-y-2">
                  <ShieldCheck className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    100% Quality Verified
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    Authentic handpicked fabrics
                  </p>
                </div>
                <div className="space-y-2">
                  <HeartHandshake className="w-6 h-6 mx-auto" style={{ color: accentColor }} />
                  <h4 className="font-bold text-sm" style={{ fontFamily: headingFont, color: textColor }}>
                    Dedicated Care
                  </h4>
                  <p className="text-xs" style={{ color: mutedColor }}>
                    VIP styling concierge available 24/7
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* 6. Bottom Return-to-Boutique CTA */}
        <div
          className="pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: cardBorder }}
        >
          <Link
            href={formatTenantHref('/', tenantSlug)}
            className="text-xs uppercase font-bold tracking-widest transition-opacity hover:opacity-80"
            style={{ color: mutedColor }}
          >
            ← Return to Boutique Home
          </Link>

          <Link href={formatTenantHref('/new-arrivals', tenantSlug)}>
            <Button variant="luxury-gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore New Arrivals
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

