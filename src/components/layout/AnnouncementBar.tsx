'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Phone, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export function AnnouncementBar() {
  const { storeConfig } = useStore();
  const announcements = storeConfig.announcements || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-[#111111] text-[#FFFDFC] text-xs py-2 px-4 border-b border-[#2A2523] select-none relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Support Callout (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-[#D89F9C] text-[11px]">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Sparkles className="w-3 h-3 text-[#B77A68]" />
            Affordable Luxury Fashion
          </span>
          <span className="text-[#3D3430]">•</span>
          <a
            href={`https://wa.me/${storeConfig.policies.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-[#B77A68]" />
            Order on WhatsApp
          </a>
        </div>

        {/* Center: Rotating Announcement */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
            }
            className="hidden sm:inline-flex text-[#777777] hover:text-[#FFFDFC] transition-colors p-0.5"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="font-medium tracking-wide text-xs transition-all duration-300">
            {current.link ? (
              <Link
                href={current.link}
                className="hover:underline inline-flex items-center gap-1.5"
              >
                <span>{current.text}</span>
                {current.highlightText && (
                  <span className="font-bold text-[#E8B8B5] tracking-wider uppercase underline underline-offset-2">
                    {current.highlightText}
                  </span>
                )}
              </Link>
            ) : (
              <span>
                {current.text}{' '}
                {current.highlightText && (
                  <strong className="text-[#E8B8B5]">{current.highlightText}</strong>
                )}
              </span>
            )}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
            className="hidden sm:inline-flex text-[#777777] hover:text-[#FFFDFC] transition-colors p-0.5"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side: Currency & Perks (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#777777]">
          <span>INR (₹)</span>
          <span>•</span>
          <Link href="/account" className="hover:text-white transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
