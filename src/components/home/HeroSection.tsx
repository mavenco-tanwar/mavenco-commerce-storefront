'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8F1EA] border-b border-[#E8DED8] select-none">
      {/* Background Decorative Gradient Aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8B8B5]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#CF9584]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] lg:min-h-[620px] items-center gap-8 py-10 lg:py-0">
          {/* Left Column: Editorial Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 lg:pr-8 z-10 text-center lg:text-left">
            {/* Season Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFDFC] border border-[#E8DED8] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#111111]">
                Spring / Summer 2026 Studio Collection
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#111111] leading-[1.12] tracking-tight">
                Style That Speaks <span className="italic font-normal text-[#B77A68]">You</span>
              </h1>
              <p className="text-sm sm:text-base text-[#777777] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Discover effortlessly stylish, runway-inspired fashion crafted for modern women and adorable kids. Breathable fabrics, pure luxury silhouettes, affordable prices.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href="/women" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[170px] group"
                >
                  <span>Shop Women</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/kids" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[170px]"
                >
                  Shop Kids
                </Button>
              </Link>
            </div>

            {/* Trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8DED8]/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="block text-xl font-serif font-bold text-[#111111]">500+</span>
                <span className="text-[11px] text-[#777777]">Curated Styles</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-bold text-[#111111]">4.9★</span>
                <span className="text-[11px] text-[#777777]">Customer Rating</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-bold text-[#111111]">₹999</span>
                <span className="text-[11px] text-[#777777]">Free Shipping Min</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Double Image Showcase (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Primary Main Image Card */}
            <div className="relative w-full max-w-md aspect-3/4 bg-[#FFFDFC] border-8 border-[#FFFDFC] shadow-2xl overflow-hidden luxury-card-shadow">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
                alt="JQ Trends Spring Fashion Look"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDFC]/90 backdrop-blur-xs p-3 border border-[#E8DED8] text-left">
                <span className="text-[10px] uppercase font-bold text-[#B77A68] tracking-widest block">
                  Studio Spotlight
                </span>
                <p className="text-xs font-serif font-bold text-[#111111]">
                  Tiered Flora Georgette Midi &amp; Linen Sets
                </p>
              </div>
            </div>

            {/* Overlapping Kids Floating Badge Card */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-8 w-36 sm:w-44 aspect-square bg-[#FFFDFC] border-4 border-[#FFFDFC] shadow-xl overflow-hidden hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&auto=format&fit=crop"
                alt="Kids Little Blossom"
                fill
                sizes="180px"
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-[#111111]/85 text-white p-1 text-center">
                <span className="text-[9px] uppercase font-bold tracking-widest">
                  Kids Special
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
