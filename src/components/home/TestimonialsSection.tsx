'use client';

import React from 'react';
import Image from 'next/image';
import { Quote, CheckCircle2 } from 'lucide-react';
import { customerReviewsData } from '@/data/reviews';
import { RatingStars } from '@/components/ui/RatingStars';
import { SectionTypographyProps, getSectionTypographyStyles } from '@/lib/section-typography';

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

interface TestimonialsSectionProps extends SectionTypographyProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customReviews?: TestimonialItem[];
  paddingTop?: string;
  paddingBottom?: string;
  bgColor?: string;
  textColor?: string;
}

export function TestimonialsSection({
  customTitle,
  customSubtitle,
  customBadge,
  customReviews,
  paddingTop,
  paddingBottom,
  bgColor,
  textColor,
  ...typographyProps
}: TestimonialsSectionProps = {}) {
  const title = customTitle || 'Loved By You';
  const subtitle =
    customSubtitle ||
    'Hear from thousands of delighted customers who cherish our boutique collections.';
  const badge = customBadge || 'Real Customer Stories';
  const reviews =
    customReviews && customReviews.length > 0 ? customReviews : customerReviewsData;

  const { headingStyle, subtitleStyle, badgeStyle } = getSectionTypographyStyles({
    ...typographyProps,
    textColor,
  });

  const isDarkBg =
    bgColor &&
    (bgColor.startsWith('#0') ||
      bgColor.startsWith('#1') ||
      bgColor.startsWith('#2') ||
      bgColor === 'black' ||
      bgColor.includes('17, 17, 17'));

  return (
    <section
      className="py-16 md:py-24 bg-[#FFFDFC] select-none transition-colors duration-200"
      style={{
        paddingTop: paddingTop || undefined,
        paddingBottom: paddingBottom || undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {badge && (
            <span
              data-typography="badge"
              className="text-xs uppercase font-bold tracking-widest text-[#B77A68] inline-block px-3 py-1 rounded-full mb-1"
              style={badgeStyle}
            >
              {badge}
            </span>
          )}
          <h2
            data-typography="heading"
            className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1 mb-3"
            style={{
              color: textColor || undefined,
              ...headingStyle,
            }}
          >
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-[#B77A68] mx-auto mb-3" />
          {subtitle && (
            <p
              data-typography="subtitle"
              className="text-xs sm:text-sm text-[#777777] font-sans"
              style={{
                color: textColor ? `${textColor}cc` : undefined,
                ...subtitleStyle,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review: any, idx: number) => {
            const author = review.authorName || review.name || 'Verified Patron';
            const comment = review.comment || review.text || 'Exceptional craftsmanship and bespoke luxury styling.';
            const headline = review.title || review.role || 'Exceptional Quality';
            const rating = review.rating || 5;

            const cardClasses = isDarkBg
              ? 'bg-white/5 border border-white/10 text-white rounded-xl'
              : 'bg-[#FAF6F2] border border-[#E8DED8]';

            return (
              <div
                key={review.id || idx}
                className={`flex flex-col justify-between p-6 sm:p-8 luxury-card-shadow relative ${cardClasses}`}
              >
                <Quote className="w-8 h-8 text-[#B77A68]/30 absolute top-6 right-6 pointer-events-none" />

                <div>
                  <RatingStars rating={rating} size="sm" />

                  <h4
                    className={`text-sm sm:text-base font-serif font-bold mt-4 mb-2 ${
                      isDarkBg ? 'text-white' : 'text-[#111111]'
                    }`}
                    style={{
                      fontFamily: typographyProps.headingFontFamily ? `"${typographyProps.headingFontFamily}", serif` : undefined,
                      color: typographyProps.headingColor || textColor || undefined,
                    }}
                  >
                    &ldquo;{headline}&rdquo;
                  </h4>

                  <p
                    data-typography="subtitle"
                    className={`text-xs leading-relaxed font-sans font-normal ${
                      isDarkBg ? 'text-slate-300' : 'text-[#777777]'
                    }`}
                    style={{
                      fontFamily: typographyProps.subtitleFontFamily ? `"${typographyProps.subtitleFontFamily}", sans-serif` : undefined,
                      color: typographyProps.subtitleColor || (textColor ? `${textColor}cc` : undefined),
                      fontSize: typographyProps.subtitleFontSize || undefined,
                    }}
                  >
                    {comment}
                  </p>
                </div>

                {/* Author Details */}
                <div className={`flex items-center gap-3 pt-6 mt-6 border-t ${isDarkBg ? 'border-white/10' : 'border-[#E8DED8]'}`}>
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
                      <h5 className={`text-xs font-bold ${isDarkBg ? 'text-white' : 'text-[#111111]'}`}>{author}</h5>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B77A68]" />
                    </div>
                    <p className={`text-[11px] ${isDarkBg ? 'text-slate-400' : 'text-[#777777]'}`}>
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

