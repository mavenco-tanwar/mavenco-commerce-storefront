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

export function PlatformShowcaseLanding() {
  // State for Section 1: Visual CMS Studio Interactive Preview
  const [selectedCmsBlock, setSelectedCmsBlock] = useState<number>(0);

  // State for Section 2: Theme Token Studio Playground
  const [activeFont, setActiveFont] = useState<'Playfair Display, serif' | 'Cinzel, serif' | 'Montserrat, sans-serif' | 'Plus Jakarta Sans, sans-serif'>('Playfair Display, serif');
  const [activeThemeName, setActiveThemeName] = useState<'rose' | 'nordic' | 'athletic' | 'indigo'>('rose');
  const [activeRadius, setActiveRadius] = useState<'rounded-lg' | 'rounded-full' | 'rounded-none'>('rounded-lg');

  const themePalettes = {
    rose: {
      name: 'Haute Pret (Blush & Gold)',
      primary: '#1A1412',
      accent: '#B77A68',
      background: '#FFFDFC',
      cardBg: '#FFFFFF',
      textColor: '#1A1412',
      subTextColor: '#6B5E59',
      tagline: 'Artisanal Festive Silhouettes',
      announcementBg: '#1A1412',
      announcementText: '#FFFDFC',
      buttonText: '#FFFFFF',
      isDark: false,
    },
    nordic: {
      name: 'Nordic Sanctuary (Forest & Sand)',
      primary: '#1B4332',
      accent: '#2D6A4F',
      background: '#FAF6EE',
      cardBg: '#FFFFFF',
      textColor: '#1B4332',
      subTextColor: '#405B4E',
      tagline: 'Mindful Interior Living',
      announcementBg: '#1B4332',
      announcementText: '#FAF6EE',
      buttonText: '#FFFFFF',
      isDark: false,
    },
    athletic: {
      name: 'Apex Athletic (Carbon & Cyan)',
      primary: '#0F172A',
      accent: '#00F5D4',
      background: '#090D16',
      cardBg: '#111827',
      textColor: '#F8FAFC',
      subTextColor: '#94A3B8',
      tagline: 'Championship Engineered Gear',
      announcementBg: '#00F5D4',
      announcementText: '#090D16',
      buttonText: '#090D16',
      isDark: true,
    },
    indigo: {
      name: 'Modern Atelier (Slate & Indigo)',
      primary: '#0F172A',
      accent: '#6366F1',
      background: '#F8FAFC',
      cardBg: '#FFFFFF',
      textColor: '#0F172A',
      subTextColor: '#64748B',
      tagline: 'Curated Design Capsule',
      announcementBg: '#0F172A',
      announcementText: '#F8FAFC',
      buttonText: '#FFFFFF',
      isDark: false,
    },
  };

  const activePalette = themePalettes[activeThemeName];

  const cmsBlocksData = [
    {
      id: 'hero',
      title: 'Hero & Atelier Banner',
      tag: 'Section 01',
      badge: 'Visual Hero',
      previewHeading: 'Next-Generation Luxury & Craftsmanship',
      previewSub: 'High-impact full bleed media with dual action CTAs and live promo pill callouts.',
      previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
      controls: ['Dual Action Buttons', 'Video / Image Backdrop', 'Device Visibility Toggles'],
    },
    {
      id: 'lookbook',
      title: 'Editorial Haute Lookbook',
      tag: 'Section 02',
      badge: 'Narrative Story',
      previewHeading: 'The Minimalist Autumn Narrative',
      previewSub: 'Split editorial layouts designed for lookbook storytelling and collection previews.',
      previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&auto=format&fit=crop&q=80',
      controls: ['Shoppable Image Hotspots', 'Seasonal Lookbook Cards', 'Editorial Captions'],
    },
    {
      id: 'categories',
      title: 'Curated Category Strip',
      tag: 'Section 03',
      badge: 'Dynamic Carousel',
      previewHeading: 'Explore Signature Departments',
      previewSub: 'Horizontal category pills with custom photography and department filtering.',
      previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
      controls: ['Product Count Badges', 'Smooth Scroll Physics', 'Filter Direct Linking'],
    },
    {
      id: 'promo',
      title: 'Flash Sale & Countdown',
      tag: 'Section 04',
      badge: 'Urgency Banner',
      previewHeading: 'Seasonal Private Circle Sale • 20% OFF',
      previewSub: 'Configurable countdown clocks, coupon code copy buttons, and high-visibility ribbons.',
      previewImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000&auto=format&fit=crop&q=80',
      controls: ['Live Countdown Timer', 'Instant Coupon Copy', 'Targeted Discounts'],
    },
  ];

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
            <a
              href="#pricing"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <DollarSign className="w-4 h-4" />
              <span>Platform License &amp; AMC Pricing</span>
            </a>

            <a
              href="#demo-stores"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4 text-rose-400" />
              <span>Explore Demo Tenant Stores</span>
            </a>

            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Launch Merchant Admin</span>
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
      {/* SECTION 1: VISUAL CMS INTERACTIVE STUDIO CANVAS (RICH SPLIT-SCREEN WORKFLOW) */}
      {/* ========================================================================= */}
      <section id="cms-engine" className="py-24 bg-[#080A0E] border-y border-slate-800/90 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Visual CMS Architecture Studio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Interactive Drag-and-Drop Canvas
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Experience how non-technical marketing and merchant teams assemble, reorder, and configure production-grade homepage sections with real-time responsive preview.
              </p>
            </div>

            <Link
              href="/cms"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all self-start md:self-auto"
            >
              <span>Explore All 15+ CMS Components</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Studio Workspace Simulation */}
          <div className="bg-[#10131E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Component Tree & Layer Stack (5 cols) */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4 bg-[#0D0F18]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-xs uppercase tracking-wider">Homepage Section Stack</span>
                </div>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono font-bold">
                  {cmsBlocksData.length} Active Blocks
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Click any section below to load its configuration into the live canvas viewer:
              </p>

              {/* Draggable Component List */}
              <div className="space-y-2.5">
                {cmsBlocksData.map((block, idx) => {
                  const isSelected = selectedCmsBlock === idx;
                  return (
                    <button
                      key={block.id}
                      onClick={() => setSelectedCmsBlock(idx)}
                      type="button"
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                          : 'bg-[#131622] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className={`w-4 h-4 transition-colors ${isSelected ? 'text-amber-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                              {block.title}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400 font-mono">
                              {block.tag}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{block.previewSub}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Controls for Selected Block */}
              <div className="p-4 bg-[#141824] rounded-2xl border border-slate-800/80 space-y-2.5 pt-3">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configured Capabilities</span>
                </div>
                <div className="space-y-1.5">
                  {cmsBlocksData[selectedCmsBlock].controls.map((ctrl) => (
                    <div key={ctrl} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{ctrl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Canvas Browser Preview (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#111420]">
              {/* Browser Window Chrome */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-[#0A0C10] px-3 py-1 rounded-md border border-slate-800">
                      https://storefront.edge/preview?block={cmsBlocksData[selectedCmsBlock].id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#0A0C10] p-1 rounded-lg border border-slate-800 text-slate-400">
                    <Monitor className="w-3.5 h-3.5 text-amber-400" />
                    <Tablet className="w-3.5 h-3.5 hover:text-white transition-colors" />
                    <Smartphone className="w-3.5 h-3.5 hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Rendered Live Component Card Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl min-h-[300px] flex flex-col justify-end p-6 group">
                  <Image
                    src={cmsBlocksData[selectedCmsBlock].previewImage}
                    alt={cmsBlocksData[selectedCmsBlock].title}
                    fill
                    className="object-cover opacity-45 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>{cmsBlocksData[selectedCmsBlock].badge}</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white leading-tight">
                      {cmsBlocksData[selectedCmsBlock].previewHeading}
                    </h3>

                    <p className="text-xs text-slate-300 max-w-md font-sans">
                      {cmsBlocksData[selectedCmsBlock].previewSub}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5">
                        <span>Interactive CTA</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-lg border border-white/20 backdrop-blur-md">
                        Secondary Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Edge Publish Status Bar */}
              <div className="flex items-center justify-between p-3.5 bg-[#0A0C10] rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-semibold">Real-Time Edge Sync</span>
                  <span className="text-slate-500 font-mono">• &lt; 50ms Latency</span>
                </div>

                <a
                  href="https://mavenco-admin.vercel.app/content/homepage"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 transition-all"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Launch CMS Editor</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: INTERACTIVE THEME STUDIO & DYNAMIC DESIGN TOKENS PLAYGROUND */}
      {/* ========================================================================= */}
      <section id="theme-studio" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-rose-400 flex items-center justify-center gap-1.5">
            <Palette className="w-4 h-4" />
            Live Brand Customizer Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dynamic Design Tokens &amp; Google Fonts Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Interact with the live token controls below. Watch the storefront card adapt its typography, color palettes, and button radii in real time!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-6 bg-[#12151F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {/* Control 1: Font Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-rose-400" />
                  1. Select Google Heading Typography
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold">Dynamic Font Injection</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Playfair Display', val: 'Playfair Display, serif', style: 'font-serif' },
                  { label: 'Cinzel Classical', val: 'Cinzel, serif', style: 'font-serif tracking-widest' },
                  { label: 'Montserrat Athletic', val: 'Montserrat, sans-serif', style: 'font-sans font-black' },
                  { label: 'Plus Jakarta Sans', val: 'Plus Jakarta Sans, sans-serif', style: 'font-sans' },
                ].map((f) => (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setActiveFont(f.val as any)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      activeFont === f.val
                        ? 'bg-rose-500/15 border-rose-500 text-white shadow-md font-bold'
                        : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="text-white text-xs">{f.label}</div>
                    <div className={`text-[10px] text-slate-400 mt-1 ${f.style}`}>Sample Headline Aa</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Color Palette Swatches */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  2. Select Brand Color Palette
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">Live CSS Variable</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(themePalettes) as (keyof typeof themePalettes)[]).map((key) => {
                  const pal = themePalettes[key];
                  const isSelected = activeThemeName === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveThemeName(key)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                          : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{pal.name.split('(')[0]}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{pal.tagline}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: pal.primary }} />
                        <div className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: pal.accent }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control 3: Button Curvature */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                3. Select CTA Button Radius
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: 'Rounded (8px)', val: 'rounded-lg' },
                  { label: 'Pill Shape (Full)', val: 'rounded-full' },
                  { label: 'Sharp Edge (0px)', val: 'rounded-none' },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setActiveRadius(r.val as any)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      activeRadius === r.val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Reactive Mockup Card (6 cols) */}
          <div className="lg:col-span-6 sticky top-24 space-y-4">
            <div className="p-4 bg-[#12151F] border border-slate-800 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Live Reactive Storefront Canvas
                </span>
                <span className="text-[10px] text-slate-400 font-mono">React CSS Tokens: Active</span>
              </div>

              {/* Dynamic Styled Card Container */}
              <div
                className="p-6 sm:p-8 rounded-2xl border shadow-inner transition-all duration-300 space-y-6"
                style={{
                  backgroundColor: activePalette.background,
                  borderColor: `${activePalette.accent}4D`,
                }}
              >
                {/* Simulated Announcement Bar */}
                <div
                  className="p-2.5 rounded-lg text-center text-xs font-bold tracking-wide shadow-sm"
                  style={{
                    backgroundColor: activePalette.announcementBg,
                    color: activePalette.announcementText,
                  }}
                >
                  ⚡ Spring Private Preview • 20% OFF with Code{' '}
                  <span
                    className="underline font-black"
                    style={{
                      color: activePalette.isDark ? '#090D16' : activePalette.accent,
                    }}
                  >
                    TOKEN20
                  </span>
                </div>

                {/* Simulated Hero Card */}
                <div className="space-y-4 text-center py-4">
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md"
                    style={{
                      color: activePalette.accent,
                      backgroundColor: `${activePalette.accent}20`,
                    }}
                  >
                    {activePalette.tagline}
                  </span>

                  <h3
                    className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight transition-all"
                    style={{ fontFamily: activeFont, color: activePalette.textColor }}
                  >
                    Effortless Luxury &amp; Timeless Distinction
                  </h3>

                  <p
                    className="text-xs max-w-sm mx-auto font-sans leading-relaxed transition-all"
                    style={{ color: activePalette.subTextColor }}
                  >
                    Rendered with zero rebuild delays. Brand customizers can alter every design token across merchant instances in real time.
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      className={`px-6 py-3 font-bold text-xs shadow-xl transition-all hover:scale-105 ${activeRadius}`}
                      style={{
                        backgroundColor: activePalette.accent,
                        color: activePalette.buttonText,
                      }}
                    >
                      Explore Curated Drop →
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#0A0C10] rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>Active Heading Font:</span>
                <span className="text-white font-bold">{activeFont.split(',')[0]}</span>
              </div>
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
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: TRANSPARENT PRICING & CLOUD INFRASTRUCTURE (ONE-TIME + AMC) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 bg-[#0A0C10] border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Predictable Cloud Economics</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              One-Time Platform License + Annual Maintenance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We deploy your fully custom Headless Storefront and Merchant Admin Panel with an isolated MongoDB database partition. Ongoing cloud computing, database backups, media CDN, and transaction mail are covered under predictable Annual Maintenance (AMC). Custom domain renewal excluded and billed separately.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Starter Boutique */}
            <div className="bg-[#12151F] border border-slate-800 rounded-3xl p-7 flex flex-col justify-between shadow-2xl space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    Tier 01 • Starter Boutique
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">₹29,999</span>
                    <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">/ one-time</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete Storefront + Admin Workspace deployment with dedicated MongoDB partition.
                  </p>
                </div>

                {/* AMC Card */}
                <div className="p-3.5 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-400">
                    <span>Annual Maintenance (AMC):</span>
                    <span>₹24,000 / yr</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Monthly Equivalent:</span>
                    <span className="text-slate-300 font-mono">₹2,000 / mo</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Covers MongoDB cluster, Next.js Edge hosting &amp; email delivery.
                  </div>
                </div>

                {/* Quotas & Limits */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to <strong>250 Products</strong> &amp; 1,000 Orders/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>2 GB</strong> Fast Cloud Asset Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>3 Staff</strong> Admin User Accounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Visual Homepage CMS &amp; Product Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Payment Gateways (Razorpay / Stripe / COD)</span>
                  </div>
                </div>
              </div>

              <a
                href="https://mavenco-admin.vercel.app/login"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all block"
              >
                Deploy Starter Boutique →
              </a>
            </div>

            {/* Plan 2: Professional Scale (FEATURED) */}
            <div className="bg-gradient-to-b from-[#181B28] via-[#141724] to-[#12141F] border-2 border-rose-500/60 rounded-3xl p-7 flex flex-col justify-between shadow-2xl shadow-rose-950/40 space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                Most Popular Choice
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between pt-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    Tier 02 • Professional Scale
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">₹59,999</span>
                    <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">/ one-time</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    High-volume direct-to-consumer flagship storefront with AI automation and marketing engine.
                  </p>
                </div>

                {/* AMC Card */}
                <div className="p-3.5 bg-[#0A0C10] rounded-2xl border border-rose-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-400">
                    <span>Annual Maintenance (AMC):</span>
                    <span>₹48,000 / yr</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Monthly Equivalent:</span>
                    <span className="text-slate-200 font-mono">₹4,000 / mo</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Covers dedicated DB indexing, Serverless Next.js Edge, CDN, &amp; transactional mail.
                  </div>
                </div>

                {/* Quotas & Limits */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Up to <strong>2,500 Products</strong> &amp; 10,000 Orders/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>10 GB</strong> Media CDN &amp; WebP Optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>15 Staff</strong> Accounts &amp; RBAC Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Abandoned Cart Recovery</strong> Engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>AI Copywriting &amp; SEO</strong> Studio</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Full Headless REST API &amp; Webhooks</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Advanced Funnel Analytics</strong> &amp; Projections</span>
                  </div>
                </div>
              </div>

              <a
                href="https://mavenco-admin.vercel.app/login"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 text-center bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all block"
              >
                Deploy Professional Scale →
              </a>
            </div>

            {/* Plan 3: Enterprise Global */}
            <div className="bg-[#12151F] border border-slate-800 rounded-3xl p-7 flex flex-col justify-between shadow-2xl space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    Tier 03 • Enterprise Global
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">₹1,49,999</span>
                    <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">/ one-time</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-brand, multi-region enterprise architecture with custom ERP sync and dedicated DB cluster.
                  </p>
                </div>

                {/* AMC Card */}
                <div className="p-3.5 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-400">
                    <span>Annual Maintenance (AMC):</span>
                    <span>₹96,000 / yr</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Monthly Equivalent:</span>
                    <span className="text-slate-300 font-mono">₹8,000 / mo</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Covers dedicated multi-region cluster, 24/7 VIP SLA &amp; custom DevOps.
                  </div>
                </div>

                {/* Quotas & Limits */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to <strong>50,000 Products</strong> &amp; 250,000 Orders/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>100 GB</strong> Ultra-fast Cloud Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>100 Staff</strong> Users &amp; Multi-Role RBAC</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated MongoDB Cluster Replica</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Custom ERP, SAP &amp; Warehouse Integrations</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24/7 Dedicated Cloud Solution Architect SLA</span>
                  </div>
                </div>
              </div>

              <a
                href="https://mavenco-admin.vercel.app/login"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all block"
              >
                Contact Enterprise Sales →
              </a>
            </div>
          </div>

          {/* Real-Time Cloud Infrastructure & Domain Policy Card */}
          <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Cloud Services &amp; Domain Renewal Policy</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transparency on what is covered inside the platform and what is billed separately.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                100% Transparent SLA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#0A0C10] rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Included In Annual Maintenance (AMC)</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 leading-relaxed">
                  <li>• <strong>MongoDB Atlas Cluster:</strong> Continuous database replication, high availability, daily snapshots.</li>
                  <li>• <strong>Serverless Next.js Edge Compute:</strong> Global CDN caching, edge routing, sub-50ms TTFB.</li>
                  <li>• <strong>Transactional Mail Daemon:</strong> Credentials dispatch, order notifications, customer invoices.</li>
                  <li>• <strong>Media CDN:</strong> Responsive WebP image transformations and fast product media delivery.</li>
                  <li>• <strong>Maintenance &amp; Security:</strong> Core platform version updates, framework patches, bug fixes.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#0A0C10] rounded-2xl border border-amber-500/20 space-y-2">
                <div className="font-bold text-amber-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Excluded &amp; Billed Separately Upon Renewal</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 leading-relaxed">
                  <li>• <strong>Custom Domain Names:</strong> Domain registrations (`.com`, `.in`, `.store`, etc.) are renewed yearly at actual registrar cost (approx ₹999 - ₹1,499/year per domain).</li>
                  <li>• <strong>Custom Third-Party SMS Gateways:</strong> External transactional SMS gateway credits (OTP / Twilio) if custom SMS routes are requested.</li>
                  <li>• <strong>Custom Payment Gateway Transaction Rates:</strong> Standard merchant acquirer fees charged by Razorpay / Stripe (approx 1.8% - 2.0%).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
