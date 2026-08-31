'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle, ShieldCheck, Zap, Database, Globe, DollarSign } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function PlatformFaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Do I retain 100% ownership of my customer database and catalog?',
      answer:
        'Yes, absolutely. Unlike closed-wall monolithic platforms, every Mavenco store runs on an isolated MongoDB Atlas partition. You own 100% of your customer records, order histories, product schemas, and media assets with zero vendor lock-in.',
      category: 'Data Ownership',
      icon: Database,
    },
    {
      question: 'How does the 0% platform transaction commission structure work?',
      answer:
        'We do not take any percentage cut on your sales. You keep 100% of your gross merchandise value (GMV). You only pay your flat SaaS license and monthly cloud server hosting (₹2,000 to ₹8,000/mo depending on your scale).',
      category: 'Pricing & ROI',
      icon: DollarSign,
    },
    {
      question: 'Can I connect my own payment gateway (Razorpay, Cashfree, Stripe, PhonePe)?',
      answer:
        'Yes. You can link your existing merchant accounts directly. All customer payouts settle directly into your business bank account according to your standard merchant acquirer terms.',
      category: 'Payments',
      icon: ShieldCheck,
    },
    {
      question: 'Can I use custom domains for both my public Storefront and Merchant Admin?',
      answer:
        'Yes! Mavenco supports dual custom domains out of the box. You can map your storefront to `yourbrand.com` and your staff admin console to `admin.yourbrand.com` with automated TLS 1.3 wildcard SSL certificates.',
      category: 'Domains & Branding',
      icon: Globe,
    },
    {
      question: 'How does the Visual Drag-and-Drop CMS Studio work without writing code?',
      answer:
        'Our visual studio gives your marketing and merchandising team complete creative control. Reorder promo hero banners, curate seasonal lookbooks, adjust typography, and swap theme palettes in real time with instant live previews.',
      category: 'CMS & Customization',
      icon: Sparkles,
    },
    {
      question: 'How fast is the Next.js 16 Edge storefront performance?',
      answer:
        'Our serverless architecture compiles every page to global edge CDN nodes, delivering sub-50ms Time-To-First-Byte (TTFB) across India and worldwide. This lightning speed maximizes Google Core Web Vitals and increases mobile checkout conversion rates.',
      category: 'Architecture & Speed',
      icon: Zap,
    },
  ];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Frequently Asked Questions
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Everything You Need to Know
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Clear answers on our multi-tenant headless architecture, transparent billing, and enterprise cloud SLA guarantees.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const Icon = faq.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-[#141724] border-rose-500/40 shadow-xl shadow-rose-950/20'
                  : 'bg-[#0E1018] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isOpen ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      {faq.category}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 ml-12">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
