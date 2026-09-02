'use client';

import React, { useState } from 'react';
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const activeMedia = media.length > 0
    ? media[activeIndex] || media[0]
    : { type: 'image' as const, url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200' };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (config.zoomMode !== 'hover') return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
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

  return (
    <div className={`select-none ${className}`}>
      <div
        className={`flex ${
          config.layout === 'left-thumbs' ? 'flex-row gap-4 items-start' : 'flex-col gap-4'
        }`}
      >
        {/* Thumbnail Navigation (Left Placement) */}
        {config.layout === 'left-thumbs' && config.thumbnailsPosition !== 'hidden' && media.length > 1 && (
          <div className="hidden sm:flex flex-col gap-3 shrink-0 w-20 max-h-[640px] overflow-y-auto scrollbar-none py-0.5">
            {media.map((item, idx) => (
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
                {item.type === 'video' && (
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
          className={`relative flex-1 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#E8DED8] dark:border-slate-800 shadow-sm ${getAspectClass()} group`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => config.zoomMode === 'hover' && setIsZoomed(true)}
          onMouseLeave={() => config.zoomMode === 'hover' && setIsZoomed(false)}
          onClick={() => {
            if (config.zoomMode === 'click') setIsZoomed(!isZoomed);
            if (config.zoomMode === 'fullscreen') setIsFullscreen(true);
          }}
        >
          {activeMedia.type === 'video' ? (
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

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white hover:scale-105 transition-all shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Fullscreen Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Carousel Arrows */}
          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white hover:scale-105 transition-all shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white hover:scale-105 transition-all shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Mobile Indicators */}
          {media.length > 1 && (
            <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs">
              {media.map((_, idx) => (
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

        {/* Thumbnail Navigation (Bottom Placement) */}
        {config.layout !== 'left-thumbs' && config.thumbnailsPosition !== 'hidden' && media.length > 1 && (
          <div className="hidden sm:flex flex-row gap-3 overflow-x-auto shrink-0 py-1 scrollbar-none">
            {media.map((item, idx) => (
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
                {item.type === 'video' && (
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
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            {activeMedia.type === 'video' ? (
              <video
                src={activeMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-2xl"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={activeMedia.url}
                  alt={activeMedia.alt || productTitle}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
