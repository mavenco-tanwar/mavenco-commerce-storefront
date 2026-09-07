'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, MessageSquare, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface StarRatingsQaSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  allowPhotoReviews?: boolean;
  allowMerchantReply?: boolean;
  showQASection?: boolean;
  minRatingToShow?: number;
}

const REVIEWS = [
  {
    author: 'Ananya Sharma',
    city: 'Mumbai',
    rating: 5,
    date: '3 days ago',
    title: 'Exquisite Silk Handfeel and Fit',
    comment:
      'The Chanderi Kurti set arrived in stunning archival gift packaging. The stitching precision and soft breathable lining exceeded expectations.',
    verified: true,
    photo:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop',
    merchantReply:
      'Thank you Ananya! Our master artisans take immense pride in reinforcing every seam with silk threads.',
  },
  {
    author: 'Pooja Iyer',
    city: 'Bengaluru',
    rating: 5,
    date: '1 week ago',
    title: 'Perfect Party Frock for My Daughter',
    comment:
      'Completely scratch-free pure cotton lining. My daughter danced comfortably throughout the festive evening.',
    verified: true,
    photo:
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&auto=format&fit=crop',
    merchantReply:
      'Delighted to hear this Pooja! Comfort for little ones is our paramount tailoring standard.',
  },
];

const QA_ITEMS = [
  {
    q: 'How do I choose the right size for ethnic silhouettes?',
    a: 'We recommend referring to our Atelier Size Guide. If you are between measurements, our dedicated styling concierge is available 24/7 on WhatsApp to assist with custom fit recommendations.',
  },
  {
    q: 'Are dry clean services strictly required for silk garments?',
    a: 'For pure silk Chanderi and Banarasi fabrics, we recommend dry cleaning for the first three cleans to preserve natural luster and delicate zari borders.',
  },
  {
    q: 'What is your doorstep exchange timeline?',
    a: 'We provide complimentary 7-day doorstep exchanges across India. Our courier partner collects the garment and hands over your replacement simultaneously.',
  },
];

export function StarRatingsQaSection({
  customTitle = 'Customer Reviews & Atelier Q&A',
  customSubtitle = 'Unfiltered experiences from verified clients and answers to frequently asked styling questions.',
  customBadge = 'REVIEWS & INQUIRIES',
  allowPhotoReviews = true,
  allowMerchantReply = true,
  showQASection = true,
}: StarRatingsQaSectionProps) {
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F2] border border-[#E8DED8] rounded-full shadow-2xs">
              <Star className="w-3.5 h-3.5 text-[#B77A68] fill-[#B77A68]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                {customBadge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111111]">
            {customTitle}
          </h2>
          {customSubtitle && (
            <p className="text-xs sm:text-sm text-[#777777] font-sans leading-relaxed">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* Rating Overview Score */}
        <div className="bg-[#FAF6F2] border border-[#E8DED8] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-[#111111]">4.9</div>
            <div>
              <div className="flex items-center gap-1 text-[#B77A68]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-xs text-[#777777] mt-0.5">Based on 1,420+ verified boutique reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#111111] bg-white px-4 py-2 rounded-xl border border-[#E8DED8] shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Verified Buyer Feedback</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFC] border border-[#E8DED8] rounded-2xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#111111]">{rev.author}</span>
                    <span className="text-[10px] text-[#777777]">• {rev.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#B77A68] mt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-[#999999]">{rev.date}</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-xs text-[#111111]">{rev.title}</h4>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">{rev.comment}</p>
              </div>

              {allowPhotoReviews && rev.photo && (
                <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-[#E8DED8]">
                  <Image src={rev.photo} alt={rev.title} fill className="object-cover" />
                </div>
              )}

              {allowMerchantReply && rev.merchantReply && (
                <div className="p-3 bg-[#FAF6F2] border-l-2 border-[#B77A68] rounded-r-lg space-y-1 text-xs">
                  <div className="font-bold text-[11px] text-[#111111] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B77A68]" />
                    Atelier Concierge Response
                  </div>
                  <p className="text-[#555555] text-[11px] leading-relaxed">{rev.merchantReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Q&A Accordion */}
        {showQASection && (
          <div className="max-w-3xl mx-auto space-y-4 pt-6">
            <h3 className="text-xl font-serif font-bold text-[#111111] text-center">
              Styling & Sizing Inquiries
            </h3>
            <div className="space-y-3">
              {QA_ITEMS.map((item, i) => {
                const isOpen = openQaIndex === i;
                return (
                  <div
                    key={i}
                    className="border border-[#E8DED8] rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenQaIndex(isOpen ? null : i)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#111111] hover:bg-[#FAF6F2] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#B77A68]" />
                        {item.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#777777]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#777777]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-[#555555] font-sans leading-relaxed border-t border-[#E8DED8]/60 bg-[#FAF6F2]/30">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
