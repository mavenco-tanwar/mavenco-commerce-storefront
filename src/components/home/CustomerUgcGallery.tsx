'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSaaSReviews() {
      try {
        const res = await fetch('/api/v1/reviews?type=saas&status=published').then((r) =>
          r.ok ? r.json() : null
        );
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

  // Carousel Navigation: Show 3 cards per view on desktop
  const maxIndex = Math.max(0, reviews.length - 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-6xl mx-auto">
        <div className="space-y-2">
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

        {/* Carousel Navigation Buttons */}
        {reviews.length > 3 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-[#161822] hover:bg-rose-600/20 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500/40 transition-all shadow-md active:scale-95"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-[#161822] hover:bg-rose-600/20 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500/40 transition-all shadow-md active:scale-95"
              title="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Viewport (Exactly 3 Cards Visible on Desktop) */}
      <div className="max-w-6xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 3))}%)`,
          }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="w-full md:w-1/2 lg:w-1/3 shrink-0 p-2.5"
            >
              <div className="bg-[#0A0C10] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between h-full group hover:border-rose-500/40 transition-all shadow-xl">
                <div>
                  {/* Founder Photo & Badge */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    {rev.image ? (
                      <Image
                        src={rev.image}
                        alt={rev.author}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {rev.highlight && (
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>{rev.highlight}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Founder Footer */}
                <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <div className="font-bold text-white text-xs">{rev.author}</div>
                    <div className="text-[10px] text-slate-400">
                      {rev.role ? `${rev.role}, ` : ''}
                      <strong className="text-rose-400">{rev.company || 'D2C Brand'}</strong>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{rev.location || 'Global'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      {reviews.length > 3 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-rose-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
