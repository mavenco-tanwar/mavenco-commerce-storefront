'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Sparkles, ShoppingBag, Eye, Heart, Check, X, ArrowRight } from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  creator: string;
  views: string;
  thumbnail: string;
  productTitle: string;
  productPrice: string;
  productImage: string;
  productSlug: string;
}

export function ShoppableReelsSection() {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  const reels: ReelItem[] = [
    {
      id: 'reel_1',
      title: 'How I style the Banarasi Katan Silk Saree for festive weddings ✨',
      creator: '@ananya_couture',
      views: '124K',
      thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      productTitle: 'Banarasi Katan Silk Saree (Plum)',
      productPrice: '₹2,999',
      productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
      productSlug: '/women',
    },
    {
      id: 'reel_2',
      title: 'Unboxing the Travertine Table Lamp — Pure minimalist luxury',
      creator: '@auraliving_home',
      views: '89K',
      thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
      productTitle: 'Artisanal Travertine Table Lamp',
      productPrice: '₹4,499',
      productImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80',
      productSlug: '/kids',
    },
    {
      id: 'reel_3',
      title: '10km morning run test in the Carbon Speed Marathon shoe 🏃',
      creator: '@marathon_varun',
      views: '210K',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      productTitle: 'Carbon Plate Runner Pro',
      productPrice: '₹3,299',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
      productSlug: '/sale',
    },
    {
      id: 'reel_4',
      title: 'The ultimate Chikankari georgette kurti for festive evenings',
      creator: '@riya_pret',
      views: '95K',
      thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      productTitle: 'Chikankari Georgette Kurta Set',
      productPrice: '₹1,899',
      productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
      productSlug: '/new-arrivals',
    },
  ];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Shoppable 9:16 Lookbook Reels</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Watch &amp; Shop Studio Drops
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive vertical video lookbooks. Tap any reel to preview the creator story and purchase with 1 click.
          </p>
        </div>

        <Link
          href="/stores/demo"
          className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Explore All Video Drops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4-Reel 9:16 Vertical Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reels.map((reel) => (
          <div
            key={reel.id}
            onClick={() => setActiveReel(reel)}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-rose-500/60 shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Background Thumbnail */}
            <img
              src={reel.thumbnail}
              alt={reel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            {/* Top Creator Badge & Views */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
              <span className="font-bold drop-shadow-md">{reel.creator}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs font-mono text-[10px] text-slate-300">
                {reel.views}
              </span>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            {/* Bottom Product Shoppable Pill */}
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 space-y-1">
              <div className="text-[11px] font-bold text-white truncate">{reel.productTitle}</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">{reel.productPrice}</span>
                <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-0.5">
                  <ShoppingBag className="w-3 h-3" /> Shop
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Video Modal */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0C10] border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
                {activeReel.creator.substring(1, 3).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{activeReel.creator}</div>
                <div className="text-[11px] text-slate-400 font-mono">{activeReel.views} views • Verified Creator</div>
              </div>
            </div>

            <p className="text-xs text-slate-300">{activeReel.title}</p>

            <div className="p-4 bg-[#121522] rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeReel.productImage}
                  alt={activeReel.productTitle}
                  className="w-14 h-16 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="font-bold text-white text-xs">{activeReel.productTitle}</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{activeReel.productPrice}</div>
                  <div className="text-[10px] text-slate-400">0% Commission • Free Shipping</div>
                </div>
              </div>

              <Link
                href="/stores/demo"
                onClick={() => setActiveReel(null)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
