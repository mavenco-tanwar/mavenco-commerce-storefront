'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Globe,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Store,
  Zap,
  ShoppingBag,
  Palette,
  Eye,
  ShieldCheck,
  Cpu,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { CaseStudies } from './CaseStudies';
import { CustomerUgcGallery } from './CustomerUgcGallery';

export function PlatformShowcaseLanding() {
  const [activePreviewTenant, setActivePreviewTenant] = useState<string>('demo');

  const previewStores = [
    {
      slug: 'demo',
      name: 'Demo Store',
      theme: 'Modern Lifestyle & Pret',
      color: '#E11D48',
      plan: 'Professional',
      speed: '28ms TTFB',
      skus: '12 Active SKUs',
    },
    {
      slug: 'auraliving',
      name: 'Aura Living',
      theme: 'Nordic Minimalist Living & Decor',
      color: '#10B981',
      plan: 'Starter',
      speed: '34ms TTFB',
      skus: '12 Active SKUs',
    },
    {
      slug: 'apexathletics',
      name: 'Apex Athletics',
      theme: 'High-Performance Activewear',
      color: '#0284C7',
      plan: 'Enterprise',
      speed: '21ms TTFB',
      skus: '12 Active SKUs',
    },
  ];

  const currentStore =
    previewStores.find((s) => s.slug === activePreviewTenant) || previewStores[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans select-none">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* ========================================================================= */}
        {/* HERO SECTION: Enterprise SaaS Value Proposition */}
        {/* ========================================================================= */}
        <section className="text-center space-y-6 pt-4 pb-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/30 animate-in fade-in zoom-in duration-300">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Next-Gen Multi-Tenant Commerce Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Build &amp; Scale Modern D2C Brands with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400">
              0% Transaction Fees.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mavenco Commerce delivers sub-40ms Edge page transitions, an intuitive Visual CMS, and 100% database isolation on MongoDB Atlas — with zero commission cuts.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/stores/${currentStore.slug}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs tracking-wide shadow-xl shadow-rose-900/40 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Live Storefront</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>View SaaS Pricing</span>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE STORE ENGINE PREVIEW CARD */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-b from-[#121522] via-[#0E101A] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-extrabold text-white">
                  Multi-Tenant Store Engine
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Switch between live client stores to experience independent branding and speed.
              </p>
            </div>

            {/* Store Switcher Pills */}
            <div className="flex items-center gap-2 bg-[#06080E] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
              {previewStores.map((store) => (
                <button
                  key={store.slug}
                  onClick={() => setActivePreviewTenant(store.slug)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activePreviewTenant === store.slug
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: store.color }}
                  />
                  <span>{store.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Tenant Metadata & Direct Link */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#07090F] rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">Active Theme</span>
              <span className="text-white font-bold">{currentStore.theme}</span>
            </div>
            <div className="p-3 bg-[#07090F] rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">Edge TTFB</span>
              <span className="text-emerald-400 font-bold">{currentStore.speed}</span>
            </div>
            <div className="p-3 bg-[#07090F] rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">Database Partition</span>
              <span className="text-purple-400 font-bold">MongoDB Atlas</span>
            </div>
            <div className="p-3 bg-[#07090F] rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px]">Storefront URL</span>
                <span className="text-rose-400 font-bold">/{currentStore.slug}</span>
              </div>
              <Link
                href={`/stores/${currentStore.slug}`}
                className="p-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-lg transition-colors"
                title="Open Storefront"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURE PLATFORM HUBS GRID (Structured Navigation) */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Everything You Need to Power Enterprise D2C
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hub 1: Visual CMS */}
            <Link
              href="/cms"
              className="p-6 bg-[#10131E] border border-slate-800 hover:border-rose-500/40 rounded-3xl space-y-3 transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                  Visual CMS Canvas
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive block re-ordering, responsive device previews, and custom theme styling without code.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-rose-400 flex items-center gap-1">
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Hub 2: SaaS Pricing */}
            <Link
              href="/pricing"
              className="p-6 bg-[#10131E] border border-slate-800 hover:border-amber-500/40 rounded-3xl space-y-3 transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  SaaS Pricing &amp; ROI
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compare one-time setup pricing, calculate Shopify commission savings, and review our cloud SLA.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-amber-400 flex items-center gap-1">
                <span>View Plans &amp; ROI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Hub 3: Architecture & Edge */}
            <Link
              href="/architecture"
              className="p-6 bg-[#10131E] border border-slate-800 hover:border-purple-500/40 rounded-3xl space-y-3 transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                  Edge Infrastructure
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Isolated MongoDB Atlas partitions, sub-40ms Anycast CDN, and developer REST API playgrounds.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-purple-400 flex items-center gap-1">
                <span>Inspect Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Hub 4: Enterprise FAQ */}
            <Link
              href="/faq"
              className="p-6 bg-[#10131E] border border-slate-800 hover:border-emerald-500/40 rounded-3xl space-y-3 transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Enterprise FAQ &amp; Support
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Answers to domain setup, payment gateways, migrations, and 24/7 WhatsApp concierge access.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Read Knowledge Base</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CLIENT GROWTH SPOTLIGHTS (Live from MongoDB Atlas) */}
        {/* ========================================================================= */}
        <CaseStudies />

        {/* ========================================================================= */}
        {/* VERIFIED SAAS FOUNDER REVIEWS CAROUSEL (3-Card Carousel from MongoDB) */}
        {/* ========================================================================= */}
        <CustomerUgcGallery />

        {/* ========================================================================= */}
        {/* BOTTOM CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Own Your Commerce Infrastructure?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch your headless store in under 48 hours. Zero revenue cuts, instant Next.js edge performance, and full database control.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <Link
              href="/pricing"
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Explore Pricing &amp; Plans →
            </Link>
            <a
              href="https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20a%20live%20demo%20of%20Mavenco%20Commerce."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Book Live WhatsApp Demo
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
