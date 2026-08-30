'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Layout,
  Type,
  Grid,
  ShieldCheck,
  MousePointer,
} from 'lucide-react';

export function PlatformShowcaseLanding() {
  const tenants = [
    {
      id: 'store_demo',
      slug: 'demo',
      name: 'Demo Store (Generic)',
      tagline: 'Curated Modern Lifestyle & Design Capsule',
      industry: 'Modern Lifestyle & Pret (Generic)',
      currency: 'USD ($)',
      themeColors: {
        primary: '#0F172A',
        secondary: '#F8FAFC',
        accent: '#6366F1',
      },
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
      description: 'A generic, brand-agnostic demonstration showcasing visual drag-and-drop CMS blocks, lookbook storytelling, and responsive commerce.',
      badgeText: 'Featured Client Demo',
      catalogSize: '36+ Modern SKUs',
    },
    {
      id: 'store_jq_trends',
      slug: 'jqtrends',
      name: 'JQ Trends',
      tagline: 'Affordable Luxury Women & Kids Fashion',
      industry: 'Haute Couture & Festive Pret',
      currency: 'INR (₹)',
      themeColors: {
        primary: '#111111',
        secondary: '#FFFDFC',
        accent: '#B77A68',
      },
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
      description: 'Artisanal Indian pret, pure chanderi silks, luxury festive sets, and bespoke runway silhouettes.',
      badgeText: 'Fashion & Luxury',
      catalogSize: '24+ Curated SKUs',
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
  ];

  const cmsFeatures = [
    {
      icon: Layout,
      title: 'Visual Drag-and-Drop CMS',
      desc: '15+ modular sections including Atelier Hero Banners, Lookbooks, Dynamic Product Feeds, and Flash Sale Countdowns.',
      tag: 'Zero Code Needed',
    },
    {
      icon: Palette,
      title: 'Dynamic Theme & Font Studio',
      desc: 'Customize brand primary/accent palettes, Google Fonts, button radii, and announcement bars on the fly.',
      tag: 'Live Token Sync',
    },
    {
      icon: Zap,
      title: 'Headless Edge Performance',
      desc: 'Next.js 16 serverless edge rendering with sub-50ms API response times and 100/100 Lighthouse performance.',
      tag: 'Sub-50ms Speed',
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Tenant Isolation',
      desc: 'Dedicated tenant boundaries, custom subdomain routing, and automated SSL for every enterprise client.',
      tag: 'Complete Security',
    },
  ];

  return (
    <div className="flex flex-col bg-[#0A0C10] text-slate-100 min-h-screen select-none">
      {/* Hero Section */}
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
            A reusable, multi-tenant headless ecommerce architecture with an intuitive visual drag &amp; drop CMS, live design token customizer, and lightning-fast edge delivery.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#demo-stores"
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Store className="w-4 h-4" />
              <span>Explore Demo Tenant Stores</span>
            </a>

            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Launch Merchant Admin Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/cms"
              className="px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30 flex items-center gap-2 transition-all"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Visual CMS Deep Dive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Demo Stores Showcase Grid */}
      <section id="demo-stores" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tenants.map((store) => (
            <div
              key={store.id}
              className="bg-[#12151F] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all group"
            >
              <div>
                {/* Store Preview Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12151F] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {store.badgeText}
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                    <span className="text-[10px] text-slate-300 font-mono">Theme:</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: store.themeColors.primary }}
                      title="Primary Color"
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: store.themeColors.accent }}
                      title="Accent Color"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-rose-400 transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {store.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {store.description}
                  </p>

                  <div className="p-3.5 bg-[#0C0E14] rounded-xl border border-slate-800/80 text-[11px] space-y-2 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Industry:</span>
                      <span className="text-slate-300 font-semibold">{store.industry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Currency:</span>
                      <span className="text-emerald-400 font-bold">{store.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Catalog Focus:</span>
                      <span className="text-amber-300 font-bold">{store.catalogSize}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Routing:</span>
                      <span className="text-rose-400">/stores/{store.slug}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0">
                <Link
                  href={`/stores/${store.slug}`}
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all group-hover:shadow-rose-950/50"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Visit {store.name} Storefront Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual CMS Spotlight Section */}
      <section id="cms-engine" className="py-20 bg-[#0E1017] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Visual CMS Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Empower Non-Technical Teams to Build &amp; Launch
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Our modular headless CMS gives brand managers complete control over section ordering, lookbooks, flash sales, and product carousels without touching code.
              </p>
            </div>

            <Link
              href="/cms"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <span>Explore All 15+ CMS Components</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cmsFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 bg-[#12151F] border border-slate-800 hover:border-slate-700 rounded-2xl space-y-3 shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white pt-1">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Theme Studio Spotlight */}
      <section id="theme-studio" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
            Brand Identity Customization
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Dynamic Design Tokens &amp; Google Fonts
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Change fonts, colors, and button styles in the admin panel and see them reflect instantly on the live storefront with zero build delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#12151F] border border-slate-800 rounded-2xl space-y-3">
            <Type className="w-6 h-6 text-rose-400" />
            <h4 className="text-sm font-bold text-white">Typography Pairing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pair luxury serif headlines (Playfair Display, Cinzel) with ultra-readable sans-serif body fonts (Plus Jakarta Sans, Inter).
            </p>
          </div>

          <div className="p-6 bg-[#12151F] border border-slate-800 rounded-2xl space-y-3">
            <Palette className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Curated Color Palettes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure brand primary, accent CTAs, and background shades with real-time contrast validation.
            </p>
          </div>

          <div className="p-6 bg-[#12151F] border border-slate-800 rounded-2xl space-y-3">
            <Sliders className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Announcement Banners</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edit top promotional tickers, callout badges, and WhatsApp concierge links with one click.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section id="architecture" className="py-16 bg-[#080A0E] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Enterprise Multi-Tenant Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built on modern cloud primitives for unmatched reliability and isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-[#12151F] border border-slate-800 rounded-xl space-y-2">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Multi-Tenant Boundary
              </div>
              <p className="text-slate-400 leading-relaxed">
                Complete data isolation ensuring tenant catalogs, customer records, and orders are strictly segregated.
              </p>
            </div>

            <div className="p-5 bg-[#12151F] border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Edge Routing Engine
              </div>
              <p className="text-slate-400 leading-relaxed">
                Middleware detects `/stores/[slug]` or custom domains in &lt;1ms and serves the appropriate theme and catalog.
              </p>
            </div>

            <div className="p-5 bg-[#12151F] border border-slate-800 rounded-xl space-y-2">
              <div className="text-rose-400 font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Real-Time CMS Sync
              </div>
              <p className="text-slate-400 leading-relaxed">
                Edits saved in the Admin Workspace are instantly synced to edge caching layers without server restarts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
