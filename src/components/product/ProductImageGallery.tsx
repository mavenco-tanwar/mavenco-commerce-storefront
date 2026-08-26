'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ProductImage } from '@/types/product';
import { Modal } from '@/components/ui/Modal';

export interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentImage = images[selectedIndex] || images[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 select-none">
      {/* Thumbnail column (Vertical on Desktop, Horizontal on Mobile) */}
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
          alt={currentImage.alt || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Carousel Prev/Next Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FFFDFC]/85 backdrop-blur-xs border border-[#E8DED8] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FFFDFC]/85 backdrop-blur-xs border border-[#E8DED8] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Zoom Trigger */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-[#FFFDFC]/80 backdrop-blur-xs text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-xs"
          aria-label="Zoom image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Zoom Lightbox Modal */}
      <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} maxWidth="4xl">
        <div className="relative w-full aspect-3/4 max-h-[80vh]">
          <Image
            src={currentImage.url}
            alt={productName}
            fill
            sizes="1000px"
            className="object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}
