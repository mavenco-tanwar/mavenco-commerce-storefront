'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles, ArrowRight, ShieldCheck, Zap, DollarSign, Store } from 'lucide-react';

export function CaseStudies() {
  const caseStudies = [
    {
      brand: 'Muskan Clothing',
      slug: 'muskan-clothing',
      industry: 'Haute Luxury & Ethnic Pret',
      highlight: '+42% Mobile Conversion Rate',
      savings: '₹2,40,000/yr saved in 0% transaction commission',
      description:
        'Migrated from a sluggish monolithic store to Mavenco Headless Edge. Page load time dropped from 3.8s to 0.4s, resulting in a dramatic reduction in checkout abandonment.',
      badge: 'Fashion & Apparel',
      color: 'from-rose-500/20 to-amber-500/10 border-rose-500/30 text-rose-400',
    },
    {
      brand: 'Aura Living',
      slug: 'auraliving',
      industry: 'Nordic Minimalist Living & Decor',
      highlight: 'Zero Third-Party App Fees',
      savings: '₹1,40,000/yr saved on Shopify app subscriptions',
      description:
        'Replaced 7 paid Shopify plugins (PageFly, Loox reviews, SEO suite, mega menus) with Mavenco’s all-in-one native visual CMS and verified review system.',
      badge: 'Home & Living',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      brand: 'Apex Athletics',
      slug: 'apexathletics',
      industry: 'High-Performance Activewear',
      highlight: '< 24ms Instant Page Transitions',
      savings: '100% database isolation on MongoDB Atlas',
      description:
        'Launched a high-velocity direct-to-consumer store with dual custom domains and custom headless product bundling for athlete training kits.',
      badge: 'Athleisure',
      color: 'from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400',
    },
  ];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Client Growth Spotlights
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Real Brands, Real Exponential Returns
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          See how high-growth D2C brands scale faster, retain 100% of their gross revenue, and wow their shoppers with Mavenco Commerce.
        </p>
      </div>

      {/* Grid of Case Studies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {caseStudies.map((cs, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl bg-gradient-to-br ${cs.color} border space-y-4 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-slate-800">
                  {cs.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-white/80">Case #{idx + 1}</span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-white">{cs.brand}</h4>
                <p className="text-xs text-slate-400">{cs.industry}</p>
              </div>

              <div className="p-3 bg-[#0A0C10]/80 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{cs.highlight}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">{cs.savings}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{cs.description}</p>
            </div>

            <Link
              href={`/stores/${cs.slug}`}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>Explore Live Storefront</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
