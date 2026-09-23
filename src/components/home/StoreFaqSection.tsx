'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

import { SectionTypographyProps, getSectionTypographyStyles } from '@/lib/section-typography';

export interface StoreFaqItem {
  id?: string | number;
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
  category?: string;
}

interface StoreFaqSectionProps extends SectionTypographyProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customFaqs?: StoreFaqItem[];
  paddingTop?: string;
  paddingBottom?: string;
  bgColor?: string;
  textColor?: string;
  tenantSlug?: string;
}

const DEFAULT_STORE_FAQS: StoreFaqItem[] = [
  {
    question: 'What is the shipping timeframe for domestic and international orders?',
    answer:
      'Orders are typically hand-inspected and dispatched within 24–48 hours. Domestic express deliveries arrive in 2–4 business days, while international express shipments via DHL arrive within 4–7 business days.',
  },
  {
    question: 'How do doorstep returns and size exchanges work?',
    answer:
      'We provide a complimentary 7-day doorstep return and exchange privilege. Products must be unworn, in original luxury packaging with all tags attached. Simply initiate a return from your account portal.',
  },
  {
    question: 'Are all garments handcrafted with authentic natural textiles?',
    answer:
      'Yes, each creation is crafted using pure breathable textiles, certified organic cotton, and hand-woven chanderi silks. Master artisans oversee every seam and silhouette to ensure runway distinction.',
  },
  {
    question: 'How do I find my ideal fit across different silhouettes?',
    answer:
      'Every product page features a comprehensive sizing chart with exact bust, waist, and hip measurements. Our styling concierge is also available via WhatsApp or live chat to provide bespoke sizing guidance.',
  },
  {
    question: 'What payment methods are supported at checkout?',
    answer:
      'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, Net Banking, Razorpay, Cashfree, and Cash on Delivery (COD) for eligible domestic pin codes.',
  },
];

export function StoreFaqSection({
  customTitle = 'Frequently Asked Questions',
  customSubtitle = 'Instant answers to concierge, shipping, and bespoke care inquiries.',
  customBadge = 'Customer Concierge',
  customFaqs,
  paddingTop,
  paddingBottom,
  bgColor,
  textColor,
  tenantSlug,
  ...typographyProps
}: StoreFaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const { headingStyle, subtitleStyle, badgeStyle } = getSectionTypographyStyles({
    ...typographyProps,
    textColor,
  });

  const rawList = customFaqs && customFaqs.length > 0 ? customFaqs : DEFAULT_STORE_FAQS;
  const faqs = rawList.map((item, idx) => ({
    id: item.id || idx,
    question: item.question || item.q || 'Question',
    answer: item.answer || item.a || 'Answer details.',
    category: item.category,
  }));

  const toggleItem = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      className="py-16 md:py-24 bg-[var(--theme-color-surface,#FFFDFC)] border-t border-[var(--theme-color-border,#E8DED8)] select-none transition-colors duration-200"
      style={{
        paddingTop: paddingTop || undefined,
        paddingBottom: paddingBottom || undefined,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {customBadge && (
            <div
              data-typography="badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--theme-color-surface-secondary,#F8F1EA)] border border-[var(--theme-color-border,#E8DED8)] rounded-full shadow-xs mb-3 text-[11px] uppercase font-bold tracking-widest text-[var(--theme-color-accent,#B77A68)]"
              style={badgeStyle}
            >
              <Sparkles className="w-3 h-3" />
              <span style={{ color: badgeStyle.color || undefined }}>{customBadge}</span>
            </div>
          )}
          <h2
            data-typography="heading"
            className="text-3xl sm:text-4xl font-serif font-bold text-[var(--theme-color-heading,#111111)] mb-3"
            style={{
              color: textColor || undefined,
              ...headingStyle,
            }}
          >
            {customTitle}
          </h2>
          {customSubtitle && (
            <p
              data-typography="subtitle"
              className="text-xs sm:text-sm text-[var(--theme-color-text-secondary,#57534E)] font-sans max-w-lg mx-auto leading-relaxed"
              style={{
                color: textColor ? `${textColor}cc` : undefined,
                ...subtitleStyle,
              }}
            >
              {customSubtitle}
            </p>
          )}
          <div className="w-12 h-0.5 bg-[var(--theme-color-accent,#B77A68)] mx-auto mt-4" />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={faq.id}
                className={`border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[var(--theme-color-surface-secondary,#F8F1EA)] border-[var(--theme-color-accent,#B77A68)]/60 shadow-sm'
                    : 'bg-[var(--theme-color-surface,#FFFDFC)] border-[var(--theme-color-border,#E8DED8)] hover:border-[var(--theme-color-accent,#B77A68)]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[var(--theme-color-accent,#B77A68)] text-white'
                          : 'bg-[var(--theme-color-surface-secondary,#F8F1EA)] text-[var(--theme-color-text-secondary,#57534E)]'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-serif font-bold text-[var(--theme-color-heading,#111111)]">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`p-1.5 rounded-full shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--theme-color-accent,#B77A68)]' : 'text-[var(--theme-color-text-muted,#777777)]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-[var(--theme-color-text-secondary,#57534E)] font-sans leading-relaxed border-t border-[var(--theme-color-border,#E8DED8)]/40">
                    <p className="mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
