'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, Play, Sparkles } from 'lucide-react';
import { ProductImage } from '@/types/product';
import { Modal } from '@/components/ui/Modal';

export interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  layout?: 'grid-2' | 'stacked' | 'carousel' | 'thumbnails-left';
  imageZoom?: boolean;
  showVideoBadge?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  layout = 'grid-2',
  imageZoom = true,
  showVideoBadge = true,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!images || images.length === 0) return null;
  const currentImage = images[selectedIndex] || images[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  // 1. SWIPE CAROUSEL LAYOUT
  if (layout === 'carousel') {
    return (
      <div className="space-y-3 select-none">
        <div className="relative aspect-3/4 w-full bg-[#FAF6F2] border border-[#E8DED8] rounded-2xl overflow-hidden group">
          <Image
            src={currentImage.url}
            alt={`${productName} slide ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />

          {showVideoBadge && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-lg">
              <Play className="w-3 h-3 fill-white" />
              <span>360° Lookbook</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#111111] shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#111111] shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {imageZoom && (
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-3 right-3 p-2.5 bg-white/90 rounded-full text-[#111111] shadow hover:bg-white transition-opacity"
              aria-label="Zoom image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Carousel Indicators / Dot Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === idx ? 'w-8 bg-[#111111]' : 'w-2 bg-[#D1C7BD] hover:bg-[#999999]'
                }`}
              />
            ))}
          </div>
        )}

        {isZoomOpen && (
          <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} maxWidth="5xl">
            <div className="relative aspect-3/4 max-h-[85vh] w-full mx-auto">
              <Image src={currentImage.url} alt={productName} fill className="object-contain" />
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // 2. 2-COLUMN LUXURY GRID LAYOUT
  if (layout === 'grid-2') {
    return (
      <div className="space-y-4 select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-3/4 bg-[#FAF6F2] border border-[#E8DED8] rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => {
                setSelectedIndex(idx);
                if (imageZoom) setIsZoomOpen(true);
              }}
            >
              <Image
                src={img.url}
                alt={`${productName} view ${idx + 1}`}
                fill
                priority={idx < 2}
                sizes="(max-width: 640px) 100vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {idx === 0 && showVideoBadge && (
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1 shadow">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>Curated Atelier</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {isZoomOpen && (
          <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} maxWidth="5xl">
            <div className="relative aspect-3/4 max-h-[85vh] w-full mx-auto">
              <Image src={currentImage.url} alt={productName} fill className="object-contain" />
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // 3. FULL WIDTH STACKED EDITORIAL LAYOUT
  if (layout === 'stacked') {
    return (
      <div className="space-y-4 select-none">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-3/4 w-full bg-[#FAF6F2] border border-[#E8DED8] rounded-2xl overflow-hidden group"
          >
            <Image
              src={img.url}
              alt={`${productName} editorial ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  // 4. CLASSIC LEFT THUMBNAILS LAYOUT
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 select-none">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[600px] shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 md:w-20 aspect-3/4 overflow-hidden bg-[#FAF6F2] border transition-all duration-200 shrink-0 ${
                selectedIndex === idx
                  ? 'border-[#B77A68] ring-1 ring-[#B77A68]'
                  : 'border-[#E8DED8] opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative flex-1 aspect-3/4 bg-[#FAF6F2] border border-[#E8DED8] overflow-hidden group">
        <Image
          src={currentImage.url}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {showVideoBadge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
            🎬 360° View
          </div>
        )}

        {imageZoom && (
          <button
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-full text-[#111111] shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Zoom image"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {isZoomOpen && (
        <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} maxWidth="5xl">
          <div className="relative aspect-3/4 max-h-[85vh] w-full mx-auto">
            <Image src={currentImage.url} alt={productName} fill className="object-contain" />
          </div>
        </Modal>
      )}
    </div>
  );
}
