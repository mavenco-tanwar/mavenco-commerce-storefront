'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';

export interface HeroSlide {
  id?: string;
  tagline?: string;
  title?: string;
  subtitle?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  desktopImage?: string;
  mobileImage?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  bgColor?: string;
  contentAlign?: 'left' | 'center' | 'right';
  textColor?: string;
}

export interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customSettings?: {
    // Basic / Fallback
    tagline?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    desktopImage?: string;
    tabletImage?: string;
    mobileImage?: string;
    overlayOpacity?: number;
    overlayColor?: string;
    textAlignment?: 'left' | 'center' | 'right';
    contentAlign?: 'left' | 'center' | 'right';
    layout?: 'slider' | 'centered' | 'split_left' | 'split_right' | 'editorial' | 'full_width' | string;
    minHeight?: string;
    bgColor?: string;
    bgGradient?: string;
    textColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    containerWidth?: 'contained' | 'full_width';

    // Buttons & Placement
    buttonPlacement?: 'center' | 'left' | 'right';
    buttonOrientation?: 'inline' | 'stacked';
    btnBorderRadius?: string;
    primaryBtnVariant?: string;
    primaryBtnColor?: string;
    primaryBtnTextColor?: string;
    secondaryBtnVariant?: string;
    secondaryBtnColor?: string;
    secondaryBtnTextColor?: string;

    // Multi-Slide Carousel Controls
    slides?: HeroSlide[];
    autoplay?: boolean;
    autoplayInterval?: number; // In milliseconds (e.g. 5000)
    showArrows?: boolean;
    showDots?: boolean;
    pauseOnHover?: boolean;
  };
  tenantSlug?: string;
}

export function HeroSection({
  customTitle,
  customSubtitle,
  customSettings,
  tenantSlug,
}: HeroSectionProps = {}) {
  const s = customSettings || {};

  // Normalize Slides
  const defaultSlide: HeroSlide = {
    id: 'slide-default',
    tagline: s.tagline || 'Spring / Summer 2026 Studio Collection',
    title: customTitle || 'Style That Speaks You',
    subtitle:
      customSubtitle ||
      'Discover effortlessly stylish, runway-inspired fashion crafted for modern luxury living. Breathable fabrics, pure bespoke silhouettes, accessible prices.',
    primaryBtnText: s.primaryBtnText || 'Shop Collection',
    primaryBtnLink: s.primaryBtnLink || '/collections',
    secondaryBtnText: s.secondaryBtnText || 'Explore Lookbook',
    secondaryBtnLink: s.secondaryBtnLink || '/about',
    desktopImage:
      s.desktopImage ||
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    mobileImage: s.mobileImage,
    overlayOpacity: s.overlayOpacity !== undefined ? s.overlayOpacity : 45,
    overlayColor: s.overlayColor || '#000000',
    contentAlign: s.contentAlign || s.textAlignment || 'center',
  };

  const slides: HeroSlide[] =
    Array.isArray(s.slides) && s.slides.length > 0
      ? s.slides.map((sl, idx) => ({
          id: sl.id || `slide-${idx}`,
          tagline: sl.tagline || s.tagline || defaultSlide.tagline,
          title: sl.title || customTitle || defaultSlide.title,
          subtitle: sl.subtitle || customSubtitle || defaultSlide.subtitle,
          primaryBtnText: sl.primaryBtnText || s.primaryBtnText || defaultSlide.primaryBtnText,
          primaryBtnLink: sl.primaryBtnLink || s.primaryBtnLink || defaultSlide.primaryBtnLink,
          secondaryBtnText: sl.secondaryBtnText || s.secondaryBtnText,
          secondaryBtnLink: sl.secondaryBtnLink || s.secondaryBtnLink,
          desktopImage: sl.desktopImage || s.desktopImage || defaultSlide.desktopImage,
          mobileImage: sl.mobileImage || s.mobileImage,
          overlayOpacity: sl.overlayOpacity !== undefined ? sl.overlayOpacity : (s.overlayOpacity !== undefined ? s.overlayOpacity : 45),
          overlayColor: sl.overlayColor || s.overlayColor || '#000000',
          contentAlign: sl.contentAlign || s.contentAlign || s.textAlignment || 'center',
          textColor: sl.textColor || s.textColor,
        }))
      : [defaultSlide];

  const isSlider = s.layout === 'slider' || slides.length > 1;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay handler
  useEffect(() => {
    if (!isSlider || slides.length <= 1) return;
    if (s.autoplay === false) return;
    if (isHovered && s.pauseOnHover !== false) return;

    const intervalMs = s.autoplayInterval || 5000;
    timerRef.current = setInterval(nextSlide, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSlider, slides.length, s.autoplay, s.autoplayInterval, s.pauseOnHover, isHovered, nextSlide]);

  const activeSlide = slides[currentSlideIndex] || defaultSlide;

  // Formatting CTA placements & styles
  const buttonPlacement = s.buttonPlacement || activeSlide.contentAlign || 'center';
  const buttonOrientation = s.buttonOrientation || 'inline';

  const getPlacementClass = (placement: string) => {
    if (placement === 'left') return 'justify-start items-start text-left';
    if (placement === 'right') return 'justify-end items-end text-right';
    return 'justify-center items-center text-center';
  };

  const getButtonWrapperClass = (placement: string, orientation: string) => {
    const align =
      placement === 'left'
        ? 'sm:justify-start'
        : placement === 'right'
        ? 'sm:justify-end'
        : 'sm:justify-center';
    const direction = orientation === 'stacked' ? 'flex-col' : 'flex-col sm:flex-row';
    return `flex ${direction} items-center ${align} gap-3 pt-4`;
  };

  const primaryBtnCustomStyle: React.CSSProperties = {
    borderRadius: s.btnBorderRadius || undefined,
    backgroundColor: s.primaryBtnColor || undefined,
    color: s.primaryBtnTextColor || undefined,
  };

  const secondaryBtnCustomStyle: React.CSSProperties = {
    borderRadius: s.btnBorderRadius || undefined,
    backgroundColor: s.secondaryBtnColor || undefined,
    color: s.secondaryBtnTextColor || undefined,
  };

  // 1. MULTI-SLIDE CAROUSEL / SLIDER HERO
  if (isSlider) {
    const rawOpacity = activeSlide.overlayOpacity !== undefined ? activeSlide.overlayOpacity : 45;
    const overlayOpacity = rawOpacity <= 1 ? rawOpacity : rawOpacity / 100;
    const overlayColor = activeSlide.overlayColor || '#000000';

    return (
      <section
        className="relative overflow-hidden bg-[#111111] text-white flex items-center justify-center select-none border-b border-[var(--theme-color-border,#E8DED8)] transition-colors duration-200"
        style={{
          minHeight: s.minHeight || '660px',
          paddingTop: s.paddingTop || undefined,
          paddingBottom: s.paddingBottom || undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slide Background Images (Crossfade) */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          const bgImg = slide.desktopImage || defaultSlide.desktopImage || '';
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={bgImg}
                alt={slide.title || 'Hero Slide'}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
              />
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{
                  backgroundColor: overlayColor,
                  opacity: overlayOpacity,
                }}
              />
            </div>
          );
        })}

        {/* Content Box */}
        <div
          className={`relative z-10 w-full ${
            s.containerWidth === 'full_width' ? 'px-4 sm:px-8' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'
          } py-20 md:py-32`}
        >
          <div
            className={`flex flex-col ${getPlacementClass(buttonPlacement)} space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500`}
            key={`content-${currentSlideIndex}`}
          >
            {activeSlide.tagline && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 shadow-xs rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                  {activeSlide.tagline}
                </span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight max-w-3xl drop-shadow-md">
              {activeSlide.title}
            </h1>

            {activeSlide.subtitle && (
              <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-sans leading-relaxed drop-shadow-sm">
                {activeSlide.subtitle}
              </p>
            )}

            {/* Actions */}
            <div className={getButtonWrapperClass(buttonPlacement, buttonOrientation)}>
              {activeSlide.primaryBtnText && (
                <Link
                  href={formatTenantHref(activeSlide.primaryBtnLink || '/collections', tenantSlug)}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant={(s.primaryBtnVariant as any) || 'luxury-gold'}
                    size="lg"
                    style={primaryBtnCustomStyle}
                    className="w-full sm:w-auto min-w-[190px] group shadow-xl cursor-pointer"
                  >
                    <span>{activeSlide.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}

              {activeSlide.secondaryBtnText && (
                <Link
                  href={formatTenantHref(activeSlide.secondaryBtnLink || '/about', tenantSlug)}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant={(s.secondaryBtnVariant as any) || 'outline'}
                    size="lg"
                    style={secondaryBtnCustomStyle}
                    className="w-full sm:w-auto min-w-[170px] border-white text-white hover:bg-white hover:text-black cursor-pointer"
                  >
                    {activeSlide.secondaryBtnText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {slides.length > 1 && s.showArrows !== false && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Indicator Dots */}
        {slides.length > 1 && s.showDots !== false && (
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-7 bg-amber-400 shadow-md'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // 2. FULL-WIDTH CENTERED HERO
  const isCentered =
    s.layout === 'centered' ||
    s.layout === 'full_width' ||
    activeSlide.contentAlign === 'center';

  if (isCentered) {
    const rawOpacity = activeSlide.overlayOpacity !== undefined ? activeSlide.overlayOpacity : 45;
    const overlayOpacity = rawOpacity <= 1 ? rawOpacity : rawOpacity / 100;
    const overlayColor = activeSlide.overlayColor || '#000000';

    return (
      <section
        className="relative overflow-hidden bg-[#111111] text-white flex items-center justify-center select-none border-b border-[var(--theme-color-border,#E8DED8)] transition-colors duration-200"
        style={{
          minHeight: s.minHeight || '620px',
          backgroundColor: s.bgColor || undefined,
          backgroundImage: s.bgGradient || undefined,
          paddingTop: s.paddingTop || undefined,
          paddingBottom: s.paddingBottom || undefined,
        }}
      >
        {activeSlide.desktopImage && (
          <Image
            src={activeSlide.desktopImage}
            alt={activeSlide.title || 'Hero Banner'}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />

        <div
          className={`relative z-10 w-full ${
            s.containerWidth === 'full_width' ? 'px-4 sm:px-8' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
          } py-20 md:py-28 space-y-6 flex flex-col ${getPlacementClass(buttonPlacement)}`}
        >
          {activeSlide.tagline && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 shadow-xs rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                {activeSlide.tagline}
              </span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight">
            {activeSlide.title}
          </h1>

          {activeSlide.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-sans leading-relaxed">
              {activeSlide.subtitle}
            </p>
          )}

          <div className={getButtonWrapperClass(buttonPlacement, buttonOrientation)}>
            {activeSlide.primaryBtnText && (
              <Link
                href={formatTenantHref(activeSlide.primaryBtnLink || '/collections', tenantSlug)}
                className="w-full sm:w-auto"
              >
                <Button
                  variant={(s.primaryBtnVariant as any) || 'luxury-gold'}
                  size="lg"
                  style={primaryBtnCustomStyle}
                  className="w-full sm:w-auto min-w-[190px] group shadow-xl cursor-pointer"
                >
                  <span>{activeSlide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            {activeSlide.secondaryBtnText && (
              <Link
                href={formatTenantHref(activeSlide.secondaryBtnLink || '/about', tenantSlug)}
                className="w-full sm:w-auto"
              >
                <Button
                  variant={(s.secondaryBtnVariant as any) || 'outline'}
                  size="lg"
                  style={secondaryBtnCustomStyle}
                  className="w-full sm:w-auto min-w-[170px] border-white text-white hover:bg-white hover:text-black cursor-pointer"
                >
                  {activeSlide.secondaryBtnText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 3. EDITORIAL MINIMALIST HERO
  if (s.layout === 'editorial') {
    return (
      <section
        className="relative overflow-hidden bg-[#FAF6F2] text-[#111111] border-b border-[#E8DED8] select-none py-16 lg:py-24"
        style={{
          minHeight: s.minHeight || '580px',
          backgroundColor: s.bgColor || undefined,
          paddingTop: s.paddingTop || undefined,
          paddingBottom: s.paddingBottom || undefined,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              {activeSlide.tagline && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111]/5 border border-[#111111]/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#B77A68]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeSlide.tagline}</span>
                </div>
              )}
              <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#111111] leading-[1.08]">
                {activeSlide.title}
              </h1>
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-lg">
                {activeSlide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href={formatTenantHref(activeSlide.primaryBtnLink || '/collections', tenantSlug)}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    style={primaryBtnCustomStyle}
                    className="w-full sm:w-auto min-w-[180px] shadow-lg cursor-pointer"
                  >
                    <span>{activeSlide.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                {activeSlide.secondaryBtnText && (
                  <Link
                    href={formatTenantHref(activeSlide.secondaryBtnLink || '/about', tenantSlug)}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      style={secondaryBtnCustomStyle}
                      className="w-full sm:w-auto min-w-[160px] cursor-pointer"
                    >
                      {activeSlide.secondaryBtnText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border border-black/10">
              {activeSlide.desktopImage && (
                <Image
                  src={activeSlide.desktopImage}
                  alt={activeSlide.title || 'Editorial Feature'}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. SPLIT LAYOUT (SPLIT LEFT OR SPLIT RIGHT)
  const isSplitLeft = s.layout === 'split_left';

  return (
    <section
      className="relative overflow-hidden bg-[#F8F1EA] border-b border-[#E8DED8] select-none"
      style={{
        minHeight: s.minHeight || '580px',
        backgroundColor: s.bgColor || undefined,
        backgroundImage: s.bgGradient || undefined,
        paddingTop: s.paddingTop || undefined,
        paddingBottom: s.paddingBottom || undefined,
      }}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8B8B5]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#CF9584]/20 rounded-full blur-3xl pointer-events-none" />

      <div
        className={
          s.containerWidth === 'full_width'
            ? 'w-full px-4 sm:px-8'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] lg:min-h-[620px] items-center gap-8 py-10 lg:py-0">
          {/* Visual Column if Split Left */}
          {isSplitLeft && (
            <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-[420px] aspect-3/4 luxury-card-shadow bg-[#FAF6F2] overflow-hidden border-2 border-[#FFFDFC] rounded-2xl">
                {activeSlide.desktopImage && (
                  <Image
                    src={activeSlide.desktopImage}
                    alt={activeSlide.title || 'Hero Visual'}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
            </div>
          )}

          {/* Text Column */}
          <div
            className={`lg:col-span-7 space-y-6 lg:pr-8 z-10 text-center ${
              buttonPlacement === 'center'
                ? 'lg:text-center'
                : buttonPlacement === 'right'
                ? 'lg:text-right'
                : 'lg:text-left'
            } ${isSplitLeft ? 'order-1 lg:order-2' : ''}`}
          >
            {activeSlide.tagline && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFDFC] border border-[#E8DED8] shadow-xs rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#111111]">
                  {activeSlide.tagline}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#111111] leading-[1.12] tracking-tight">
                {activeSlide.title?.includes('You') ? (
                  <>
                    {activeSlide.title.replace(/You/g, '')}
                    <span className="italic font-normal text-[#B77A68]">You</span>
                  </>
                ) : (
                  activeSlide.title
                )}
              </h1>
              {activeSlide.subtitle && (
                <p className="text-sm sm:text-base text-[#777777] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className={getButtonWrapperClass(buttonPlacement, buttonOrientation)}>
              {activeSlide.primaryBtnText && (
                <Link
                  href={formatTenantHref(activeSlide.primaryBtnLink || '/collections', tenantSlug)}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant={(s.primaryBtnVariant as any) || 'primary'}
                    size="lg"
                    style={primaryBtnCustomStyle}
                    className="w-full sm:w-auto min-w-[170px] group cursor-pointer"
                  >
                    <span>{activeSlide.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}

              {activeSlide.secondaryBtnText && (
                <Link
                  href={formatTenantHref(activeSlide.secondaryBtnLink || '/about', tenantSlug)}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant={(s.secondaryBtnVariant as any) || 'secondary'}
                    size="lg"
                    style={secondaryBtnCustomStyle}
                    className="w-full sm:w-auto min-w-[170px] cursor-pointer"
                  >
                    {activeSlide.secondaryBtnText}
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#777777] border-t border-[#E8DED8]/80">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77A68]" />
                <span>Express Doorstep Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77A68]" />
                <span>100% Breathable Fabrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77A68]" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>
          </div>

          {/* Visual Column if Split Right (default) */}
          {!isSplitLeft && (
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[420px] aspect-3/4 luxury-card-shadow bg-[#FAF6F2] overflow-hidden border-2 border-[#FFFDFC] rounded-2xl">
                {activeSlide.desktopImage && (
                  <Image
                    src={activeSlide.desktopImage}
                    alt={activeSlide.title || 'Hero Visual'}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                )}

                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  style={{ opacity: (activeSlide.overlayOpacity || 45) / 100 }}
                />

                <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDFC]/95 backdrop-blur-md p-4 border border-[#E8DED8] shadow-lg flex items-center justify-between rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                      New Season Drop
                    </span>
                    <h4 className="text-xs font-serif font-bold text-[#111111]">
                      Linen Co-ords &amp; Chanderi Silks
                    </h4>
                    <p className="text-[11px] text-[#777777]">Starting from ₹899</p>
                  </div>

                  <Link
                    href={formatTenantHref(activeSlide.primaryBtnLink || '/collections', tenantSlug)}
                    className="px-3 py-1.5 bg-[#111111] text-[#FFFDFC] text-[11px] font-bold uppercase tracking-wider hover:bg-[#B77A68] transition-colors shrink-0 rounded"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
