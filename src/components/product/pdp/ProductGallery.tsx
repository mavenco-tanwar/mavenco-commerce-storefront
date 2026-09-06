'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  X,
} from 'lucide-react';
import { GalleryConfig, NormalizedProductMedia } from '@/types/pdp-template.types';

export interface ProductGalleryProps {
  media: NormalizedProductMedia[];
  config: GalleryConfig;
  productTitle: string;
  activeVariantImage?: string;
  className?: string;
}

export function ProductGallery({
  media,
  config,
  productTitle,
  activeVariantImage,
  className = '',
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Sync with active variant image when variant changes
  useEffect(() => {
    if (activeVariantImage) {
      const matchIdx = media.findIndex((m) => m.url === activeVariantImage);
      if (matchIdx !== -1) {
        setActiveIndex(matchIdx);
      }
    }
  }, [activeVariantImage, media]);

  const fallbackMedia: NormalizedProductMedia = {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200',
    alt: productTitle,
  };

  const safeMedia = media && media.length > 0 ? media : [fallbackMedia];
  const activeMedia = safeMedia[activeIndex] || safeMedia[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? safeMedia.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === safeMedia.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (config.zoomMode !== 'hover') return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const openFullscreenAt = (idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFullscreenIndex(idx);
    setIsFullscreen(true);
  };

  const getAspectClass = () => {
    switch (config.aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-3/4';
      case '16:9':
        return 'aspect-video';
      case '4:5':
      default:
        return 'aspect-4/5';
    }
  };

  const isVideoSupported = config.enableVideo !== false;

  /* ========================================================================= */
  /* 1. LAYOUT: GRID-2 (2-Column Haute Couture Luxury Grid)                    */
  /* ========================================================================= */
  if (config.layout === 'grid-2') {
    return (
      <div className={`select-none ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {safeMedia.map((item, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#E8DED8] dark:border-slate-800 shadow-xs ${getAspectClass()} group cursor-pointer transition-all hover:shadow-md`}
              onClick={() => openFullscreenAt(idx)}
            >
              {item.type === 'video' && isVideoSupported ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={item.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Video Reel</span>
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={item.url}
                    alt={item.alt || `${productTitle} - Image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Lightbox zoom trigger badge */}
              <button
                type="button"
                onClick={(e) => openFullscreenAt(idx, e)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {renderLightboxModal()}
      </div>
    );
  }

  /* ========================================================================= */
  /* 2. LAYOUT: STACKED (Minimalist Vertical Column)                           */
  /* ========================================================================= */
  if (config.layout === 'stacked') {
    return (
      <div className={`select-none space-y-4 sm:space-y-6 ${className}`}>
        {safeMedia.map((item, idx) => (
          <div
            key={idx}
            className={`relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#E8DED8] dark:border-slate-800 shadow-xs ${getAspectClass()} group cursor-pointer transition-all hover:shadow-md`}
            onClick={() => openFullscreenAt(idx)}
          >
            {item.type === 'video' && isVideoSupported ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  src={item.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Video Reel</span>
                </span>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={item.url}
                  alt={item.alt || `${productTitle} - Look ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            )}

            <button
              type="button"
              onClick={(e) => openFullscreenAt(idx, e)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {renderLightboxModal()}
      </div>
    );
  }

  /* ========================================================================= */
  /* 3. LAYOUT: MASONRY (Editorial Staggered Proportions)                      */
  /* ========================================================================= */
  if (config.layout === 'masonry') {
    return (
      <div className={`select-none ${className}`}>
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {safeMedia.map((item, idx) => {
            const aspectStyle = idx % 3 === 0 ? 'aspect-4/5' : idx % 3 === 1 ? 'aspect-square' : 'aspect-3/4';
            return (
              <div
                key={idx}
                className={`relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#E8DED8] dark:border-slate-800 shadow-xs ${aspectStyle} break-inside-avoid group cursor-pointer transition-all hover:shadow-md`}
                onClick={() => openFullscreenAt(idx)}
              >
                {item.type === 'video' && isVideoSupported ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-xs">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Reel</span>
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.url}
                      alt={item.alt || `${productTitle} - Editorial ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => openFullscreenAt(idx, e)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {renderLightboxModal()}
      </div>
    );
  }

  /* ========================================================================= */
  /* 4. LAYOUT: LEFT-THUMBS, BOTTOM-THUMBS, OR CAROUSEL                        */
  /* ========================================================================= */
  const isLeftThumbs = config.layout === 'left-thumbs' && config.thumbnailsPosition !== 'hidden';
  const isBottomThumbs = config.layout === 'bottom-thumbs' || (config.layout !== 'left-thumbs' && config.thumbnailsPosition === 'bottom');
  const showThumbnails = config.thumbnailsPosition !== 'hidden' && safeMedia.length > 1;

  return (
    <div className={`select-none ${className}`}>
      <div className={`flex ${isLeftThumbs ? 'flex-row gap-4 items-start' : 'flex-col gap-4'}`}>
        {/* Left Thumbnail Sidebar Navigation */}
        {isLeftThumbs && showThumbnails && (
          <div className="hidden sm:flex flex-col gap-3 shrink-0 w-20 max-h-[640px] overflow-y-auto scrollbar-none py-0.5">
            {safeMedia.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-26 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-2xs ${
                  idx === activeIndex
                    ? 'border-rose-600 ring-2 ring-rose-500/20 opacity-100 scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={item.thumbnail || item.url}
                  alt={item.alt || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {item.type === 'video' && isVideoSupported && (
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Stage Viewport */}
        <div
          className={`relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#E8DED8] dark:border-slate-800 shadow-sm ${getAspectClass()} group`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => config.zoomMode === 'hover' && setIsZoomed(true)}
          onMouseLeave={() => config.zoomMode === 'hover' && setIsZoomed(false)}
          onClick={() => {
            if (config.zoomMode === 'click') setIsZoomed(!isZoomed);
            if (config.zoomMode === 'fullscreen') openFullscreenAt(activeIndex);
          }}
        >
          {activeMedia.type === 'video' && isVideoSupported ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                src={activeMedia.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
                <Play className="w-3 h-3 fill-white" />
                <span>Video Reel</span>
              </span>
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={activeMedia.url}
                alt={activeMedia.alt || productTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className={`object-cover transition-transform duration-200 ${
                  isZoomed && config.zoomMode === 'hover'
                    ? 'scale-175 cursor-crosshair'
                    : isZoomed && config.zoomMode === 'click'
                    ? 'scale-150 cursor-zoom-out'
                    : config.zoomMode === 'disabled'
                    ? 'scale-100 cursor-default'
                    : 'scale-100 cursor-zoom-in'
                }`}
                style={
                  isZoomed && config.zoomMode === 'hover'
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />
            </div>
          )}

          {/* Fullscreen Lightbox Button */}
          <button
            type="button"
            onClick={(e) => openFullscreenAt(activeIndex, e)}
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white hover:scale-105 transition-all shadow-md opacity-0 group-hover:opacity-100 cursor-pointer z-10"
            title="Fullscreen Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Carousel Arrows */}
          {safeMedia.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white hover:scale-105 transition-all shadow-md opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                title="Previous Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white hover:scale-105 transition-all shadow-md opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                title="Next Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Counter Badge */}
          {safeMedia.length > 1 && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-xs z-10">
              {activeIndex + 1} / {safeMedia.length}
            </span>
          )}

          {/* Mobile Dot Indicators */}
          {safeMedia.length > 1 && (
            <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs z-10">
              {safeMedia.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeIndex ? 'bg-white w-4' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Horizontal Thumbnails Strip */}
        {isBottomThumbs && showThumbnails && (
          <div className="flex flex-row gap-3 overflow-x-auto shrink-0 py-1 scrollbar-none">
            {safeMedia.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-18 h-22 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === activeIndex
                    ? 'border-rose-600 ring-2 ring-rose-500/30 opacity-100'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={item.thumbnail || item.url}
                  alt={item.alt || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {item.type === 'video' && isVideoSupported && (
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {renderLightboxModal()}
    </div>
  );

  /* Helper to render the shared fullscreen modal */
  function renderLightboxModal() {
    if (!isFullscreen) return null;
    const item = safeMedia[fullscreenIndex] || safeMedia[0];

    const nextFullscreen = () => {
      setFullscreenIndex((prev) => (prev === safeMedia.length - 1 ? 0 : prev + 1));
    };

    const prevFullscreen = () => {
      setFullscreenIndex((prev) => (prev === 0 ? safeMedia.length - 1 : prev - 1));
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
          {item.type === 'video' && isVideoSupported ? (
            <video
              src={item.url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-2xl"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={item.url}
                alt={item.alt || productTitle}
                fill
                sizes="95vw"
                className="object-contain"
              />
            </div>
          )}
        </div>

        {safeMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevFullscreen}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={nextFullscreen}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    );
  }
}
