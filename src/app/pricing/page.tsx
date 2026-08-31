'use client';

import React from 'react';
import Link from 'next/link';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { RoiSavingsCalculator } from '@/components/home/RoiSavingsCalculator';
import { PlatformComparisonMatrix } from '@/components/home/PlatformComparisonMatrix';
import {
  DollarSign,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter D2C',
      tagline: 'Ideal for emerging boutique brands and single-category creators',
      priceInr: '₹2,999',
      priceUsd: '$39',
      billing: 'per month, billed annually',
      popular: false,
      features: [
        '1 Production Storefront Domain',
        'Visual CMS Drag-and-Drop Studio',
        '0% Platform Transaction Cut',
        'Up to 500 Active Product SKUs',
        'Razorpay, Stripe & COD Payment Flow',
        'Standard Edge CDN (Global sub-60ms)',
        'Community Email Support',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: 'https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20am%20interested%20in%20the%20Starter%20D2C%20plan.',
    },
    {
      name: 'Professional Growth',
      tagline: 'For high-velocity D2C brands scaling past ₹10L+ monthly GMV',
      priceInr: '₹7,999',
      priceUsd: '$99',
      billing: 'per month, billed annually',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Dual Custom Domains (Storefront + Admin)',
        'Unlimited Visual Lookbooks & CMS Pages',
        '0% Platform Transaction Cut (Always)',
        'Up to 5,000 Active Product SKUs',
        'Automated Abandoned Cart WhatsApp Engine',
        'Sub-40ms Anycast Edge Acceleration',
        'Dedicated MongoDB Atlas Partition',
        'Priority 24/7 WhatsApp Concierge',
      ],
      ctaText: 'Deploy Pro Storefront',
      ctaHref: 'https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20am%20interested%20in%20the%20Professional%20Growth%20plan.',
    },
    {
      name: 'Enterprise Scale',
      tagline: 'Custom infrastructure for multi-brand conglomerates and high-volume drops',
      priceInr: '₹19,999',
      priceUsd: '$249',
      billing: 'per month, custom SLA',
      popular: false,
      features: [
        'Multi-Store Multi-Tenant Cluster',
        'Unlimited SKUs & Surge Drop Handling',
        '0% Platform Cut + Custom ERP Ingress',
        'Custom React / Next.js Component Ingestion',
        'Full REST API & Webhooks Engine Access',
        'Dedicated Solutions Architect & SLA',
        'Custom Domain SSL Provisioning & DNS Health',
        'White-Glove Shopify / Magento Migration',
      ],
      ctaText: 'Speak to Enterprise Team',
      ctaHref: 'https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20to%20discuss%20the%20Enterprise%20Scale%20plan.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans select-none">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparent SaaS Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Keep 100% of Your Revenue with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-400 to-amber-300">
              0% Transaction Fees.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Unlike Shopify Plus or legacy platforms that charge 0.5%–2.0% on every sale, Mavenco Commerce charges zero platform commission. Choose the tier that matches your scale.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                p.popular
                  ? 'bg-gradient-to-b from-[#161A28] via-[#121522] to-[#0D101A] border-2 border-rose-500/60 shadow-2xl shadow-rose-950/40 lg:-translate-y-2'
                  : 'bg-[#10131E] border border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
                  {p.badge}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">{p.tagline}</p>
                </div>

                <div className="space-y-1 pb-4 border-b border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">{p.priceInr}</span>
                    <span className="text-xs text-slate-400 font-mono">({p.priceUsd})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{p.billing}</div>
                </div>

                <div className="space-y-3 text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
                    What&apos;s Included:
                  </span>
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={p.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    p.popular
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 hover:scale-105'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Interactive Shopify vs Mavenco Savings Calculator */}
        <section className="pt-8">
          <RoiSavingsCalculator />
        </section>

        {/* Detailed Feature Comparison Matrix */}
        <section className="pt-8">
          <PlatformComparisonMatrix />
        </section>

        {/* Enterprise Bottom Banner */}
        <section className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Need a Custom Enterprise Deployment?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We offer bespoke database clustering, custom ERP/WMS integrations, and dedicated 24/7 engineering retainers.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <a
              href="https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20to%20schedule%20an%20enterprise%20consultation."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Schedule Enterprise Consultation
            </a>
          </div>
        </section>
      </main>

      {/* Platform Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06080E] py-8 text-center text-xs text-slate-500">
        <p>© 2026 Mavenco Commerce Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
