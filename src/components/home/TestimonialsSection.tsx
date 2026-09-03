'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Quote, CheckCircle2 } from 'lucide-react';
import { customerReviewsData } from '@/data/reviews';
import { RatingStars } from '@/components/ui/RatingStars';

interface TestimonialItem {
  id?: string | number;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  avatar?: string;
  colorPurchased?: string;
  sizePurchased?: string;
}

interface TestimonialsSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customReviews?: TestimonialItem[];
}

export function TestimonialsSection({
  customTitle,
  customSubtitle,
  customBadge,
  customReviews,
}: TestimonialsSectionProps = {}) {
  const title = customTitle || 'Loved By You';
  const subtitle =
    customSubtitle ||
    'Hear from thousands of delighted customers who cherish our boutique collections.';
  const badge = customBadge || 'Real Customer Stories';
  const reviews =
    customReviews && customReviews.length > 0 ? customReviews : customerReviewsData;

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1 mb-3">
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-[#B77A68] mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-[#777777] font-sans">
            {subtitle}
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review: any, idx: number) => {
            const author = review.authorName || review.name || 'Verified Patron';
            const comment = review.comment || review.text || 'Exceptional craftsmanship and bespoke luxury styling.';
            const headline = review.title || review.role || 'Exceptional Quality';
            const rating = review.rating || 5;

            return (
              <div
                key={review.id || idx}
                className="flex flex-col justify-between p-6 sm:p-8 bg-[#FAF6F2] border border-[#E8DED8] luxury-card-shadow relative"
              >
                <Quote className="w-8 h-8 text-[#B77A68]/30 absolute top-6 right-6 pointer-events-none" />

                <div>
                  <RatingStars rating={rating} size="sm" />

                  <h4 className="text-sm sm:text-base font-serif font-bold text-[#111111] mt-4 mb-2">
                    &ldquo;{headline}&rdquo;
                  </h4>

                  <p className="text-xs text-[#777777] leading-relaxed font-sans font-normal">
                    {comment}
                  </p>
                </div>

                {/* Author Details */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#E8DED8]">
                  {review.avatar && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#B77A68] shrink-0">
                      <Image
                        src={review.avatar}
                        alt={author}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <h5 className="text-xs font-bold text-[#111111]">{author}</h5>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B77A68]" />
                    </div>
                    <p className="text-[11px] text-[#777777]">
                      {review.role || 'Verified Collector'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
