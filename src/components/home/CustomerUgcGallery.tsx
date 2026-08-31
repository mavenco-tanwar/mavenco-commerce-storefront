'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function CustomerUgcGallery() {
  const reviews = [
    {
      author: 'Priya Sharma',
      location: 'Mumbai, India',
      rating: 5,
      store: 'Muskan Clothing',
      product: 'Pure Mulberry Silk Banarasi Saree',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      comment: 'The saree drape and antique zari craftsmanship are out of this world! Checkout was under 3 seconds on mobile.',
      badge: 'Verified Buyer',
    },
    {
      author: 'Kavita Mehta',
      location: 'Delhi NCR',
      rating: 5,
      store: 'Muskan Clothing',
      product: 'Artisanal Embroidered Velvet Blazer',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
      comment: 'Super fast delivery and flawless fit. The velvet has a rich luster that received endless compliments at the wedding.',
      badge: 'Verified Buyer',
    },
    {
      author: 'Astrid Lindqvist',
      location: 'Stockholm, Sweden',
      rating: 5,
      store: 'Aura Living',
      product: 'Handcrafted Fluted Ceramic Vase',
      image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop',
      comment: 'The matte chalk texture is so soothing. Packaged with zero plastic and arrived in pristine condition.',
      badge: 'Verified Buyer',
    },
    {
      author: 'Vikram Rajput',
      location: 'Bengaluru, India',
      rating: 5,
      store: 'Apex Athletics',
      product: 'Apex Pro Seamless High-Waist Leggings',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      comment: '100% squat proof and holds shape after 20+ intense training washes. Best activewear brand in India right now.',
      badge: 'Verified Athlete',
    },
  ];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Verified Customer Experiences
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Loved By Discerning Shoppers Worldwide
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Real customer photos and reviews across our multi-tenant storefront ecosystem.
        </p>
      </div>

      {/* Grid of UGC Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-[#0A0C10] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-xl"
          >
            <div>
              {/* Customer Photo */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <Image
                  src={rev.image}
                  alt={rev.author}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{rev.badge}</span>
                </div>
              </div>

              {/* Review Body */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="text-[11px] text-rose-400 font-medium">
                  {rev.product}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div>
                <div className="font-bold text-white text-[11px]">{rev.author}</div>
                <div className="text-[10px] text-slate-500">{rev.location}</div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {rev.store}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
