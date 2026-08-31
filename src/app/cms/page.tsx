'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InstantStoreBuilder } from '@/components/home/InstantStoreBuilder';
import {
  Layers,
  Sparkles,
  Palette,
  Sliders,
  Eye,
  CheckCircle2,
  ArrowRight,
  Zap,
  Layout,
  Type,
  Grid,
  Image as ImageIcon,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  GripVertical,
  MousePointer,
  ShoppingBag,
  ExternalLink,
  Store,
  Cpu,
  ShieldCheck,
  Globe,
  MessageSquare,
  Camera,
  Mail,
  HelpCircle,
  Tag,
  Search,
  BarChart2,
  Star,
  Map,
  Gift,
  Users,
  Truck,
} from 'lucide-react';

export default function CmsOverviewPage() {
  // State for Visual CMS Interactive Studio
  const [selectedCmsBlock, setSelectedCmsBlock] = useState<number>(0);

  // State for Theme Token Studio Playground
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
      previewSub: 'High-impact full bleed media with dual action CTAs, video backdrops, and live promo pill callouts.',
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

  const fullLibraryBlocks = [
    {
      title: 'Atelier Hero Banners',
      desc: 'Full-bleed imagery, video backgrounds, pill callouts, dual CTA buttons, and responsive text alignments.',
      icon: Layout,
      color: 'from-rose-500 to-pink-600',
    },
    {
      title: 'Editorial Lookbooks',
      desc: 'Split-screen narrative storytelling with shoppable pins, atelier credits, and lookbook previews.',
      icon: ImageIcon,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Department Carousels',
      desc: 'Horizontal category pills with custom photography, badge indicators (Fresh, Eco, Pro), and filtering.',
      icon: Grid,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Dynamic Product Grids',
      desc: 'Showcase New Arrivals, Bestsellers, or Curated Collections with instant variant hover selectors.',
      icon: ShoppingBag,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Flash Sale Countdowns',
      desc: 'Live countdown timers, coupon code copy buttons, and high-visibility promotional ribbons.',
      icon: Clock,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Social Proof & Reviews',
      desc: 'Verified buyer quotes, star rating aggregates, customer city tags, and media testimonials.',
      icon: MessageSquare,
      color: 'from-rose-500 to-amber-500',
    },
    {
      title: 'Instagram & Journals',
      desc: 'Curated social media grid with hover overlay links, lookbook tags, and brand hashtags.',
      icon: Camera,
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'VIP Circle Newsletters',
      desc: 'Lead capture forms with automated welcome triggers, lookbook downloads, and discount delivery.',
      icon: Mail,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Smart Search & Filters',
      desc: 'Instant full-text search with faceted filters, autocomplete, and AI-powered product recommendations.',
      icon: Search,
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Promo Tag & Badge Engine',
      desc: 'Configurable product badges — New, Sale, Limited Edition — with per-SKU rules and expiry timers.',
      icon: Tag,
      color: 'from-lime-500 to-green-600',
    },
    {
      title: 'Sales Analytics Dashboard',
      desc: 'Embedded revenue charts, conversion funnels, and category-level heatmaps for marketing teams.',
      icon: BarChart2,
      color: 'from-sky-500 to-cyan-600',
    },
    {
      title: 'Star Ratings & Q&A',
      desc: 'Product-level star ratings with photo reviews, merchant replies, and buyer Q&A threads.',
      icon: Star,
      color: 'from-yellow-400 to-amber-500',
    },
    {
      title: 'Store Locator & Map',
      desc: 'Interactive map block with multi-city store pins, opening hours, and click-to-navigate CTAs.',
      icon: Map,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      title: 'Gift Card & Voucher Block',
      desc: 'Digital gift card purchase flow with custom denominations, personalized notes, and email delivery.',
      icon: Gift,
      color: 'from-fuchsia-500 to-pink-600',
    },
    {
      title: 'Referral & Loyalty Module',
      desc: 'Friend referral widgets, loyalty point trackers, and tiered reward milestones for repeat buyers.',
      icon: Users,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Order Tracking Timeline',
      desc: 'Real-time shipment status with courier API integration, ETA countdown, and delivery confirmation.',
      icon: Truck,
      color: 'from-slate-400 to-slate-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 select-none pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Mavenco Visual CMS Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Build Stunning Storefronts <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-400 to-emerald-400">
              Without Writing a Single Line of Code
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Our modular headless CMS allows merchants and marketing teams to customize every pixel, reorder sections, launch seasonal drops, and publish in real time across any tenant store.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sliders className="w-4 h-4" />
              <span>Try Visual CMS in Admin Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4 text-slate-400" />
              <span>Explore Platform Showcase</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 0: 60-SECOND INSTANT STORE BUILDER ───────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InstantStoreBuilder />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: VISUAL CMS INTERACTIVE STUDIO CANVAS */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Interactive Drag-and-Drop Studio Canvas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Live Modular Homepage Builder
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Click any section below to see how the live canvas preview updates in real time with responsive viewport emulation and edge sync.
            </p>
          </div>

          <a
            href="https://mavenco-admin.vercel.app/login"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all self-start md:self-auto"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Launch Merchant Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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

              <span className="text-slate-400 text-[11px]">Instant Cache Purge Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: FULL MODULAR BLOCK LIBRARY (15+ COMPONENTS) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#080A0E] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              Component Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              16+ Production-Grade Content Blocks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Pre-built, responsive, and accessibility-tested commerce modules ready to drag and drop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fullLibraryBlocks.map((block) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.title}
                  className="p-6 bg-[#12151F] border border-slate-800 hover:border-slate-700 rounded-2xl space-y-3 shadow-lg transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${block.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors pt-1">
                    {block.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {block.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: INTERACTIVE THEME STUDIO & DYNAMIC DESIGN TOKENS PLAYGROUND */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
      {/* SECTION 4: ENTERPRISE MULTI-TENANT EDGE ARCHITECTURE (FLOW DIAGRAM) */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#080A0E] border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
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
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Next.js 16 Edge Middleware resolves tenant identity, currency, and headers in under 1 millisecond.
                </p>
                <div className="pt-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40">
                  x-tenant-slug: demo
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
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Injects brand-specific Google Fonts and CSS custom tokens without triggering cold rebuilds.
                </p>
                <div className="pt-1 text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                  --theme-accent: #6366F1
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
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
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

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Experience the Visual CMS?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore our live merchant admin workspace demo and see the real-time visual drag-and-drop builder in action.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:ammar.tanwar.dev@gmail.com?subject=Request%20Mavenco%20Admin%20Panel%20Demo"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Us for Admin Demo</span>
            </a>

            <Link
              href="/stores/demo"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4 text-rose-400" />
              <span>Explore Generic Demo Storefront</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
