'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Store,
  Zap,
  Layers,
  Globe,
  TrendingUp,
  CreditCard,
  Database,
  ExternalLink,
  ShieldCheck,
  Cpu,
  DollarSign,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { CaseStudies } from './CaseStudies';
import { CustomerUgcGallery } from './CustomerUgcGallery';

export function PlatformShowcaseLanding() {
  const [tenants, setTenants] = useState([
    {
      id: 'store_muskan_clothing',
      slug: 'muskan-clothing',
      name: 'Muskan Clothing',
      tagline: 'Pure Handloom Silk Sarees & Velvet Blazers',
      industry: 'Luxury Indian Pret & Bridal Couture',
      currency: 'INR (₹)',
      themeColors: {
        primary: '#E11D48',
        secondary: '#FFF1F2',
        accent: '#FB7185',
      },
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
      description: 'Handcrafted Banarasi silks, antique zari embroideries, and bespoke bridal silhouettes.',
      badgeText: 'Active Client Store',
      catalogSize: '12+ Couture SKUs',
    },
    {
      id: 'store_demo',
      slug: 'demo',
      name: 'Demo Store',
      tagline: 'Curated Modern Lifestyle & Design Capsule',
      industry: 'Modern Lifestyle & Pret (Generic)',
      currency: 'USD ($)',
      themeColors: {
        primary: '#0F172A',
        secondary: '#F8FAFC',
        accent: '#6366F1',
      },
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
      description: 'A brand-agnostic demonstration showcasing visual drag-and-drop CMS blocks and responsive commerce.',
      badgeText: 'Featured Demo',
      catalogSize: '36+ Modern SKUs',
    },
    {
      id: 'store_aura_living',
      slug: 'auraliving',
      name: 'Aura Living',
      tagline: 'Minimalist Scandinavian Home Decor & Lifestyle',
      industry: 'Nordic Interior & Mindful Living',
      currency: 'USD ($)',
      themeColors: {
        primary: '#1B4332',
        secondary: '#FAF3E0',
        accent: '#74C69D',
      },
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80',
      description: 'Small-batch handcrafted ceramics, Belgian organic linens, ambient travertine lamps, and solid oak furniture.',
      badgeText: 'Home & Decor',
      catalogSize: '18+ Decor Pieces',
    },
    {
      id: 'store_apex_athletics',
      slug: 'apexathletics',
      name: 'Apex Athletics',
      tagline: 'High-Performance Activewear & Compression Gear',
      industry: 'Athletic Gear & Carbon Footwear',
      currency: 'USD ($)',
      themeColors: {
        primary: '#0A0A0A',
        secondary: '#161822',
        accent: '#00F5D4',
      },
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80',
      description: 'Seamless thermo-regulating compression tops, marathon-grade carbon plated shoes, and athlete gear.',
      badgeText: 'Activewear & Gear',
      catalogSize: '32+ Athletic SKUs',
    },
  ]);

  useEffect(() => {
    fetch('/api/v1/tenant-config?list=all')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const mapped = json.data.map((t: any) => ({
            id: t.id || `store_${t.slug}`,
            slug: t.slug,
            name: t.name,
            tagline: t.tagline || 'Modern Commerce Storefront',
            industry: t.tagline || 'Modern Commerce',
            currency: `${t.currency || 'INR'} (${t.currencySymbol || '₹'})`,
            themeColors: {
              primary: t.theme?.primaryColor || '#0F172A',
              secondary: t.theme?.secondaryColor || '#F8FAFC',
              accent: t.theme?.accentColor || '#6366F1',
            },
            image:
              t.slug === 'muskan-clothing'
                ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80'
                : t.slug === 'auraliving'
                ? 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80'
                : t.slug === 'apexathletics'
                ? 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
            description: t.description || `Explore ${t.name} with real-time headless visual CMS and dynamic design tokens.`,
            badgeText: t.slug === 'demo' ? 'Featured Demo' : 'Live Storefront',
            catalogSize: '12+ Modern SKUs',
          }));
          setTenants(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col bg-[#0A0C10] text-slate-100 min-h-screen select-none">
      {/* ========================================================================= */}
      {/* 1. HERO VALUE PROPOSITION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Mavenco Commerce SaaS Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            The Commerce Engine For <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-200 to-emerald-400">
              Next-Gen Brands &amp; Enterprises
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Mavenco Commerce delivers sub-40ms Edge page transitions, an intuitive Visual CMS, and 100% database isolation on MongoDB Atlas — with zero commission cuts.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <DollarSign className="w-4 h-4" />
              <span>Explore SaaS Pricing &amp; ROI</span>
            </Link>

            <a
              href="#demo-stores"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4 text-rose-400" />
              <span>Explore Demo Storefronts</span>
            </a>

            <Link
              href="/cms"
              className="px-6 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-2 transition-all"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Visual CMS Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SLA & Performance Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto text-left">
            <div className="p-4 bg-[#121522]/80 backdrop-blur-md rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>&lt; 40ms TTFB</span>
              </div>
              <div className="text-sm font-extrabold text-white">Global Edge Speed</div>
              <div className="text-[10px] text-slate-400">Next.js 16 Edge Compute</div>
            </div>

            <div className="p-4 bg-[#121522]/80 backdrop-blur-md rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold font-mono">
                <DollarSign className="w-3.5 h-3.5" />
                <span>0% Commission</span>
              </div>
              <div className="text-sm font-extrabold text-white">100% Profit Retention</div>
              <div className="text-[10px] text-slate-400">Zero Transaction Fees</div>
            </div>

            <div className="p-4 bg-[#121522]/80 backdrop-blur-md rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>99.98% SLA</span>
              </div>
              <div className="text-sm font-extrabold text-white">Database Isolation</div>
              <div className="text-[10px] text-slate-400">Dedicated MongoDB Atlas</div>
            </div>

            <div className="p-4 bg-[#121522]/80 backdrop-blur-md rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>10,000+ SKUs</span>
              </div>
              <div className="text-sm font-extrabold text-white">Infinite Scaling</div>
              <div className="text-[10px] text-slate-400">Dual Custom Domains</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE CLIENT STOREFRONTS GRID */}
      {/* ========================================================================= */}
      <section id="demo-stores" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
            Multi-Tenant Isolation In Action
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore Provisioned Client Storefronts
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Click any client below to test dynamic on-the-fly theme loading, tailored typography, custom announcement banners, and unique product catalogs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tenants.map((store) => (
            <div
              key={store.id}
              className="bg-[#12151F] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all group"
            >
              <div>
                {/* Store Preview Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12151F] via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {store.badgeText}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                    <div
                      className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: store.themeColors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: store.themeColors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-rose-400 transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5 line-clamp-1">
                      {store.tagline}
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#0C0E14] rounded-xl border border-slate-800/80 text-[10px] space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Industry:</span>
                      <span className="text-slate-300 font-semibold">{store.industry.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Currency:</span>
                      <span className="text-emerald-400 font-bold">{store.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Catalog:</span>
                      <span className="text-amber-300 font-bold">{store.catalogSize}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                <Link
                  href={`/stores/${store.slug}`}
                  className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all group-hover:shadow-rose-950/50"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Preview Storefront</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM HUBS GRID (Clear Multi-Page Navigation) */}
      {/* ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Dedicated Platform Hubs
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
                Interactive drag-and-drop builder, responsive device previews, and custom theme tokens.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-rose-400 flex items-center gap-1">
              <span>Launch CMS Studio</span>
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
                Compare subscription tiers, calculate Shopify fee savings, and review platform SLAs.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>View Plans &amp; ROI</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 3: Edge Architecture */}
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
                Domain setups, payment gateways, white-glove migrations, and 24/7 WhatsApp concierge access.
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
      {/* 4. CLIENT GROWTH SPOTLIGHTS (Live from MongoDB Atlas) */}
      {/* ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <CaseStudies />

        {/* ========================================================================= */}
        {/* 5. VERIFIED SAAS FOUNDER REVIEWS CAROUSEL (3-Card Carousel from MongoDB) */}
        {/* ========================================================================= */}
        <CustomerUgcGallery />
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
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
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Book Live WhatsApp Demo</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
