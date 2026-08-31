'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Sparkles, TrendingUp, Quote } from 'lucide-react';

interface SaasReviewDoc {
  id: string;
  author: string;
  role?: string;
  company?: string;
  location?: string;
  rating: number;
  highlight?: string;
  image?: string;
  comment: string;
  badge?: string;
}

export function CustomerUgcGallery() {
  const [reviews, setReviews] = useState<SaasReviewDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSaaSReviews() {
      try {
        const res = await fetch('/api/v1/reviews?status=published').then((r) => (r.ok ? r.json() : null));
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error('Failed to load SaaS reviews:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSaaSReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  if (reviews.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Verified Founder Experiences
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Trusted by High-Growth D2C Founders
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          See why fast-scaling e-commerce brands choose Mavenco Commerce to power their storefronts.
        </p>
      </div>

      {/* Grid of Founder Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {reviews.slice(0, 4).map((rev) => (
          <div
            key={rev.id}
            className="bg-[#0A0C10] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-rose-500/40 transition-all shadow-xl"
          >
            <div>
              {/* Founder Photo & Highlight */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                {rev.image ? (
                  <Image
                    src={rev.image}
                    alt={rev.author}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                    Founder Photo
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{rev.badge || 'Verified Merchant'}</span>
                </div>
              </div>

              {/* Review Body */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {rev.highlight && (
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 shrink-0" />
                    <span>{rev.highlight}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            </div>

            {/* Founder Footer */}
            <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div>
                <div className="font-bold text-white text-xs">{rev.author}</div>
                <div className="text-[10px] text-slate-400">
                  {rev.role ? `${rev.role}, ` : ''}<strong className="text-rose-400">{rev.company || 'D2C Brand'}</strong>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-500">{rev.location || 'Global'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
