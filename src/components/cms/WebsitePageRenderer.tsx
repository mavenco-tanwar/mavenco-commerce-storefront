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

  // Dynamic CSS Variables Scoped to Website Pages
  const pageCssVariables = useMemo(() => {
    return `
      :root {
        --page-accent: var(--theme-color-accent, #B77A68);
        --page-hero-bg: #111111;
        --page-bg: #FFFDFC;
        --page-text: #111111;
        --page-surface: #FAF6F2;
        --page-border: #E8DED8;
        --page-font-heading: var(--theme-font-heading, serif);
        --page-font-body: var(--theme-font-body, sans-serif);
      }
    `.trim();
  }, []);

  const heroBlock = page.blocks?.find((b) => b.type === 'hero');
  const richTextBlocks = page.blocks?.filter((b) => b.type === 'rich-text') || [];
  const valuePropsBlock = page.blocks?.find((b) => b.type === 'value-props') || {
    type: 'value-props',
    data: {},
  };

  // Fallback direct content if no rich-text blocks exist
  const rawHtmlContent = page.content || '';

  return (
    <div className="min-h-screen bg-[var(--page-bg,#FFFDFC)] text-[var(--page-text,#111111)] select-none">
      {/* Scoped Dynamic CSS Variables */}
      <style id="dynamic-page-tokens" dangerouslySetInnerHTML={{ __html: pageCssVariables }} />

      {/* 1. Breadcrumb Navigation */}
      <div className="bg-[#FAF6F2] border-b border-[#E8DED8] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#777777] font-sans">
            <Link
              href={formatTenantHref('/', tenantSlug)}
              className="hover:text-[#111111] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B77A68]" />
            <span className="text-[#111111] font-semibold">{page.title}</span>
          </nav>
        </div>
      </div>

      {/* 2. Top Hero Header Section */}
      {heroBlock ? (
        <section className="relative bg-[#111111] text-white py-20 md:py-28 overflow-hidden shadow-sm">
          <Image
            src={
              heroBlock.data?.image ||
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop'
            }
            alt={page.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4">
            {heroBlock.data?.badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFDFC]/15 border border-white/20 backdrop-blur-xs rounded-full">
                <Sparkles className="w-3 h-3 text-[#E8B8B5]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                  {heroBlock.data.badge}
                </span>
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#FFFDFC] leading-tight tracking-tight">
              {heroBlock.data?.title || page.title}
            </h1>
            {heroBlock.data?.subtitle && (
              <p className="text-sm sm:text-base text-[#E8DED8] max-w-2xl font-sans leading-relaxed">
                {heroBlock.data.subtitle}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-[#FAF6F2] py-12 md:py-16 border-b border-[#E8DED8]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
              Atelier Editorial
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#111111]">
              {page.title}
            </h1>
            <div className="w-12 h-0.5 bg-[#B77A68] mx-auto" />
          </div>
        </section>
      )}

      {/* 3. Main Body Editorial Articles & Rich-Text Story */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        {richTextBlocks.length > 0 ? (
          richTextBlocks.map((block, idx) => {
            const heading = block.data?.heading;
            const contentHtml = block.data?.content || block.data?.html || '';

            return (
              <article key={idx} className="space-y-6">
                {heading && heading !== page.title && (
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] border-b border-[#E8DED8] pb-3">
                    {heading}
                  </h2>
                )}

                {contentHtml ? (
                  <div
                    className="prose prose-stone prose-lg max-w-none text-[#333333] font-sans leading-relaxed
                      prose-headings:font-serif prose-headings:text-[#111111] prose-headings:font-bold
                      prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:border-b prose-h2:border-[#E8DED8] prose-h2:pb-3 prose-h2:mt-10
                      prose-h3:text-xl prose-h3:text-[#B77A68]
                      prose-p:text-sm prose-p:sm:text-base prose-p:leading-relaxed prose-p:text-[#444444]
                      prose-li:text-sm prose-li:sm:text-base prose-li:text-[#444444]
                      prose-strong:text-[#111111] prose-strong:font-bold
                      prose-a:text-[#B77A68] prose-a:underline hover:prose-a:text-[#111111]"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                ) : null}
              </article>
            );
          })
        ) : rawHtmlContent ? (
          <article
            className="prose prose-stone prose-lg max-w-none text-[#333333] font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
          />
        ) : (
          <div className="py-12 text-center text-slate-500 font-sans text-sm">
            Content is currently being prepared in our atelier. Please check back soon.
          </div>
        )}

        {/* 4. Value Props & Guarantee Banner */}
        {valuePropsBlock && (
          <div className="mt-16 p-8 bg-[#FAF6F2] border border-[#E8DED8] rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xs">
            <div className="space-y-2">
              <Truck className="w-6 h-6 text-[#B77A68] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#111111]">Express Delivery</h4>
              <p className="text-xs text-[#777777]">Free shipping above ₹999 across India</p>
            </div>
            <div className="space-y-2">
              <RefreshCw className="w-6 h-6 text-[#B77A68] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#111111]">Easy 7-Day Returns</h4>
              <p className="text-xs text-[#777777]">Hassle-free doorstep exchange</p>
            </div>
            <div className="space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#B77A68] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#111111]">100% Quality Verified</h4>
              <p className="text-xs text-[#777777]">Authentic handpicked fabrics</p>
            </div>
            <div className="space-y-2">
              <HeartHandshake className="w-6 h-6 text-[#B77A68] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#111111]">Dedicated Care</h4>
              <p className="text-xs text-[#777777]">VIP styling concierge available 24/7</p>
            </div>
          </div>
        )}

        {/* 5. Bottom Return-to-Boutique CTA */}
        <div className="pt-10 border-t border-[#E8DED8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={formatTenantHref('/', tenantSlug)}
            className="text-xs uppercase font-bold tracking-widest text-[#777777] hover:text-[#111111] transition-colors"
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
