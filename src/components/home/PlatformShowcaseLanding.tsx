'use client';

import React, { useState } from 'react';
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
  GripVertical,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  Server,
  Lock,
  Cpu,
  Clock,
  DollarSign,
} from 'lucide-react';
import { RoiSavingsCalculator } from './RoiSavingsCalculator';
import { PlatformComparisonMatrix } from './PlatformComparisonMatrix';
import { PlatformFaqAccordion } from './PlatformFaqAccordion';
import { SpeedScorecard } from './SpeedScorecard';
import { ApiPlayground } from './ApiPlayground';
import { CaseStudies } from './CaseStudies';
import { ArchitectureConfigurator } from './ArchitectureConfigurator';
import { CustomerUgcGallery } from './CustomerUgcGallery';
import { StoreSpeedTester } from './StoreSpeedTester';
import { CurrencyCheckoutSimulator } from './CurrencyCheckoutSimulator';
import { FlashSaleConcurrencySimulator } from './FlashSaleConcurrencySimulator';
import { WhatsAppCommerceSimulator } from './WhatsAppCommerceSimulator';
import { PlatformRoadmap } from './PlatformRoadmap';

export function PlatformShowcaseLanding() {

  const [tenants, setTenants] = useState([
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
      description: 'A brand-agnostic demonstration showcasing visual drag-and-drop CMS blocks, lookbook storytelling, and responsive commerce.',
      badgeText: 'Featured Client Demo',
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

  React.useEffect(() => {
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
            currency: `${t.currency || 'USD'} (${t.currencySymbol || '$'})`,
            themeColors: {
              primary: t.theme?.primaryColor || '#0F172A',
              secondary: t.theme?.secondaryColor || '#F8FAFC',
              accent: t.theme?.accentColor || '#6366F1',
            },
            image:
              t.slug === 'auraliving'
                ? 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80'
                : t.slug === 'apexathletics'
                ? 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
            description: t.description || `Explore ${t.name} with real-time headless visual CMS and dynamic design tokens.`,
            badgeText: t.slug === 'demo' ? 'Featured Client Demo' : 'Live Storefront',
            catalogSize: '12+ Modern SKUs',
          }));
          setTenants(mapped);
        }
      })
      .catch(() => {});
  }, []);

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
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <DollarSign className="w-4 h-4" />
              <span>Platform License &amp; Pricing</span>
            </Link>

            <a
              href="#demo-stores"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4 text-rose-400" />
              <span>Explore Demo Tenant Stores</span>
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

          {/* Animated Platform Performance & SLA Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto text-left">
            <div className="p-4 bg-[#121522]/80 backdrop-blur-md rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>&lt; 50ms TTFB</span>
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

        {/* Client Growth Spotlights */}
        <div className="pt-6 space-y-12">
          <CaseStudies />
          <CustomerUgcGallery />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: VISUAL CMS & LIVE BRAND CUSTOMIZER TEASER (FULL STUDIO AT /cms) */}
      {/* ========================================================================= */}
      <section id="cms-engine" className="py-20 bg-[#080A0E] border-y border-slate-800/90 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-gradient-to-br from-[#121524] via-[#0E101A] to-[#101320] border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Visual CMS &amp; Brand Token Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  No-Code Visual Studio, Instant Store Mockups &amp; Google Fonts Customizer
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  Assemble 16+ production-grade commerce sections, test drag-and-drop layer stacks, preview real-time font injection, and configure live D2C brand identities in seconds.
                </p>
              </div>

              <Link
                href="/cms"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 shrink-0 self-start lg:self-auto"
              >
                <span>Launch Interactive CMS Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <Link href="/cms" className="p-4 bg-[#0A0C10] hover:bg-[#151826] rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all group block">
                <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>60-Sec Store Builder</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Instant D2C Store Mockup</div>
                <div className="text-[11px] text-slate-400 mt-1">Configure brand identity in 3 clicks with real-time Edge preview.</div>
              </Link>

              <Link href="/cms" className="p-4 bg-[#0A0C10] hover:bg-[#151826] rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all group block">
                <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                  <Layout className="w-3.5 h-3.5" />
                  <span>Drag &amp; Drop Canvas</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">Interactive Section Stack</div>
                <div className="text-[11px] text-slate-400 mt-1">Reorder Atelier Banners, Lookbooks, and Flash Sales with edge sync.</div>
              </Link>

              <Link href="/cms" className="p-4 bg-[#0A0C10] hover:bg-[#151826] rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all group block">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Theme Token Studio</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Dynamic Google Fonts &amp; Tokens</div>
                <div className="text-[11px] text-slate-400 mt-1">Zero rebuild delays with real-time CSS variable injection.</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: ENTERPRISE MULTI-TENANT EDGE ARCHITECTURE (INTERACTIVE FLOW) */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-24 bg-[#080A0E] border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 flex items-center justify-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Cloud Infrastructure Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Next-Gen Multi-Tenant Edge Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              How a single unified codebase powers hundreds of secure, isolated merchant storefronts with sub-50ms worldwide response times.
            </p>
          </div>

          {/* Visual Architecture Flow Diagram (Pipeline Nodes) */}
          <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Node 1: Request & Domain */}
              <div className="p-5 bg-[#0D0F18] border border-slate-800 rounded-2xl space-y-3 relative group hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-purple-400 font-bold">Step 01 • Ingress</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Global DNS &amp; Ingress</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Wildcard subdomains (`*.domain.com`) and custom merchant CNAMEs with automated SSL termination.
                </p>
                <div className="pt-1 text-[10px] font-mono text-purple-300 bg-purple-950/40 px-2 py-1 rounded border border-purple-800/40">
                  store.brand.com
                </div>
              </div>

              {/* Node 2: Edge Middleware */}
              <div className="p-5 bg-[#0D0F18] border border-slate-800 rounded-2xl space-y-3 relative group hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-bold">Step 02 • Resolution</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Edge Tenant Resolver</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Next.js 16 Edge Middleware resolves tenant identity, currency, and headers in under 1 millisecond.
                </p>
                <div className="pt-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40">
                  x-tenant-slug: aura
                </div>
              </div>

              {/* Node 3: Theme Token Engine */}
              <div className="p-5 bg-[#0D0F18] border border-slate-800 rounded-2xl space-y-3 relative group hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-amber-400 font-bold">Step 03 • Styling</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Dynamic Token Injector</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Injects brand-specific Google Fonts and CSS custom tokens without triggering cold rebuilds.
                </p>
                <div className="pt-1 text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                  --theme-accent: #74C69D
                </div>
              </div>

              {/* Node 4: Isolated Storage */}
              <div className="p-5 bg-[#0D0F18] border border-slate-800 rounded-2xl space-y-3 relative group hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold">Step 04 • Boundary</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Isolated Multi-Tenant DB</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Strict tenant boundaries ensuring customer records, catalogs, and orders are 100% segregated.
                </p>
                <div className="pt-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
                  Zero Data Leakage
                </div>
              </div>
            </div>

            {/* Performance SLA Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-center">
              <div className="p-4 bg-[#0D0F18] rounded-xl border border-slate-800 space-y-1">
                <div className="text-2xl font-extrabold text-emerald-400">&lt; 50ms</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Edge TTFB Response</div>
              </div>
              <div className="p-4 bg-[#0D0F18] rounded-xl border border-slate-800 space-y-1">
                <div className="text-2xl font-extrabold text-amber-400">100 / 100</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lighthouse Performance</div>
              </div>
              <div className="p-4 bg-[#0D0F18] rounded-xl border border-slate-800 space-y-1">
                <div className="text-2xl font-extrabold text-purple-400">99.99%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Availability SLA</div>
              </div>
              <div className="p-4 bg-[#0D0F18] rounded-xl border border-slate-800 space-y-1">
                <div className="text-2xl font-extrabold text-cyan-400">100%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Segregation</div>
              </div>
            </div>
          </div>

          {/* Global Multi-Currency & WhatsApp Checkout Simulator */}
          <CurrencyCheckoutSimulator />

          {/* Real-Time Live Speed & TTFB Benchmark Tester */}
          <StoreSpeedTester />

          {/* High-Concurrency Flash Sale & Spike Simulator */}
          <FlashSaleConcurrencySimulator />

          {/* Native WhatsApp Commerce Engine Simulator */}
          <WhatsAppCommerceSimulator />

          {/* Headless REST API & SDK Playground */}
          <ApiPlayground />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PLATFORM PRICING TEASER BANNER (FULL DETAILS AT /pricing) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 bg-[#0A0C10] border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          {/* Header & Pricing Highlights Card */}
          <div className="bg-gradient-to-br from-[#131624] via-[#10121D] to-[#0D0F18] border border-rose-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Predictable Cloud Economics</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  One-Time Platform License • Flexible Cloud Infrastructure
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  Deploy your custom Headless Storefront and Merchant Admin Panel with dedicated MongoDB partition, sub-50ms Edge compute, and 0% GMV commission.
                </p>
              </div>

              <Link
                href="/pricing"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all hover:scale-105 self-start lg:self-auto shrink-0"
              >
                <span>View Full Pricing &amp; ROI Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Quick Tier Summary Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <Link href="/pricing" className="p-4 bg-[#0A0C10] hover:bg-[#121522] rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all group block">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-rose-400 font-bold uppercase text-[10px]">Tier 01 • Starter Boutique</span>
                  <span className="text-amber-400 text-[10px] bg-amber-500/10 px-2 py-0.5 rounded">14-Day Trial</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">₹24,999</div>
                <div className="text-[11px] text-slate-400 mt-1">₹2,000/mo Cloud Server &amp; DB • 250 Products</div>
              </Link>

              <Link href="/pricing" className="p-4 bg-gradient-to-br from-[#161928] to-[#0A0C10] rounded-2xl border-2 border-rose-500/50 hover:border-rose-400 transition-all group block relative">
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                  Most Popular
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-rose-300 font-bold uppercase text-[10px]">Tier 02 • Professional Scale</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">₹49,999</div>
                <div className="text-[11px] text-slate-400 mt-1">₹4,000/mo Cloud Server &amp; DB • 2,500 Products</div>
              </Link>

              <Link href="/pricing" className="p-4 bg-[#0A0C10] hover:bg-[#121522] rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all group block">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">Tier 03 • Enterprise Global</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">VIP SLA</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">₹1,39,999</div>
                <div className="text-[11px] text-slate-400 mt-1">₹8,000/mo Dedicated DB Cluster • 50,000 Products</div>
              </Link>
            </div>
          </div>

          {/* Public Platform Roadmap & Merchant Upvote Board */}
          <div className="pt-4">
            <PlatformRoadmap />
          </div>

          {/* Enterprise Architecture FAQs */}
          <div id="faq" className="pt-8">
            <PlatformFaqAccordion />
          </div>
        </div>
      </section>
    </div>
  );
}
