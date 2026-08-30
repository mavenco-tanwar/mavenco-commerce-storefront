'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  MousePointer,
  ShoppingBag,
  ExternalLink,
  Store,
} from 'lucide-react';

export default function CmsOverviewPage() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'tokens' | 'workflow' | 'headless'>('blocks');

  const cmsBlocks = [
    {
      id: 'hero',
      title: 'Hero & Atelier Banners',
      tagline: 'High-Impact First Impressions',
      description: 'Supports full-bleed imagery, video backgrounds, pill callouts, dual CTA buttons, and responsive text alignments.',
      icon: Layout,
      color: 'from-rose-500 to-pink-600',
      features: ['Dual Action Buttons', 'Video & Image Backdrops', 'Live Promo Pill Callouts'],
    },
    {
      id: 'lookbook',
      title: 'Editorial & Haute Lookbooks',
      tagline: 'High-Fashion Storytelling',
      description: 'Split editorial layouts designed for narrative storytelling, lookbook previews, and artisanal craftsmanship spotlights.',
      icon: ImageIcon,
      color: 'from-amber-500 to-orange-600',
      features: ['Split-Screen Visuals', 'Shoppable Hotspots', 'Seasonal Lookbook Cards'],
    },
    {
      id: 'categories',
      title: 'Curated Category Carousels',
      tagline: 'Frictionless Browsing',
      description: 'Dynamic departmental pills with custom photography, badge indicators (Fresh, Eco, Pro), and seamless filtering.',
      icon: Grid,
      color: 'from-emerald-500 to-teal-600',
      features: ['Horizontal Smooth Scroll', 'Dynamic Product Counts', 'Department Badges'],
    },
    {
      id: 'products',
      title: 'Dynamic Product Grids',
      tagline: 'Automated Catalog Sync',
      description: 'Showcase New Arrivals, Bestsellers, or Curated Collections with instant variant hover selectors and price compare tags.',
      icon: ShoppingBag,
      color: 'from-cyan-500 to-blue-600',
      features: ['Color Swatch Hover', 'Quick Add to Bag', 'Automatic Inventory Badging'],
    },
    {
      id: 'promo',
      title: 'Flash Sale & Promo Countdowns',
      tagline: 'Urgency & Conversion Boost',
      description: 'Configurable countdown timers, coupon code copy buttons, and high-visibility promotional ribbons.',
      icon: Clock,
      color: 'from-purple-500 to-indigo-600',
      features: ['Live Countdown Clocks', 'One-Click Promo Copy', 'Targeted Discounts'],
    },
    {
      id: 'reviews',
      title: 'Social Proof & VIP Reviews',
      tagline: 'Build Trust & Conversion',
      description: 'Verified buyer quotes, star rating aggregates, customer city tags, and media testimonials.',
      icon: Sparkles,
      color: 'from-rose-500 to-amber-500',
      features: ['Star Rating Aggregates', 'Verified Customer Badges', 'Smooth Testimonial Slider'],
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
            <span>Mavenco Visual CMS Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Build Stunning Storefronts <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-400 to-emerald-400">
              Without Writing a Single Line of Code
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Our visual drag-and-drop CMS allows merchants and marketing teams to customize every pixel, reorder sections, launch seasonal drops, and publish in real time across any tenant store.
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
              <span>Back to Platform Overview</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'blocks'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>15+ Modular Content Blocks</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tokens'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Live Design Tokens &amp; Fonts</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'workflow'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span>Drag-and-Drop Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('headless')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'headless'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Headless Edge Delivery</span>
          </button>
        </div>

        {/* Tab 1: Modular Blocks */}
        {activeTab === 'blocks' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Pre-Built, Production-Grade Component Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Mix, match, and reorder modular building blocks designed for extreme conversion, responsive fidelity, and luxury aesthetics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cmsBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <div
                    key={block.id}
                    className="p-6 bg-[#12151F] border border-slate-800 hover:border-slate-700 rounded-2xl space-y-4 shadow-xl transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${block.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">
                        {block.tagline}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors mt-0.5">
                        {block.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {block.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      {block.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Theme Tokens */}
        {activeTab === 'tokens' && (
          <div className="bg-[#12151F] border border-slate-800 rounded-2xl p-8 sm:p-12 space-y-8 animate-in fade-in duration-300">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
                Real-Time CSS Variable Injection
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Complete Design Token Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Brand managers can customize typography, primary brand colors, background hues, accent CTA colors, and border curvature on the fly. The changes are instantly injected into the storefront via CSS custom variables with zero rebuild time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <Type className="w-6 h-6 text-rose-400" />
                <h4 className="font-bold text-white text-sm">Google Fonts Engine</h4>
                <p className="text-xs text-slate-400">
                  Switch heading and body fonts dynamically between Playfair Display, Cinzel, Montserrat, Plus Jakarta Sans, and Inter.
                </p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <Palette className="w-6 h-6 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Hex &amp; HSL Color Palettes</h4>
                <p className="text-xs text-slate-400">
                  Fine-tune brand colors, dark mode surface tints, button states, and badge highlights.
                </p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <Smartphone className="w-6 h-6 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Device Breakpoint Calibration</h4>
                <p className="text-xs text-slate-400">
                  Ensure pixel-perfect rendering across Mobile, Tablet, Desktop, and Ultra-Wide displays.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Workflow */}
        {activeTab === 'workflow' && (
          <div className="bg-[#12151F] border border-slate-800 rounded-2xl p-8 sm:p-12 space-y-8 animate-in fade-in duration-300">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-rose-400">
                Intuitive Merchant Experience
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Drag, Reorder, Preview, and Publish
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Experience the seamless 4-step workflow that empowers non-technical marketing teams to ship new homepage campaigns in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Add Modular Blocks</h4>
                <p className="text-xs text-slate-400">
                  Select from our library of 15+ pre-coded, accessible commerce sections.
                </p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Drag &amp; Reorder</h4>
                <p className="text-xs text-slate-400">
                  Effortlessly drag blocks up or down to curate the perfect narrative flow.
                </p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Customize Content</h4>
                <p className="text-xs text-slate-400">
                  Update headlines, subtext, images, CTA URLs, and visibility toggles.
                </p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  4
                </div>
                <h4 className="font-bold text-white text-sm">Instant Live Publish</h4>
                <p className="text-xs text-slate-400">
                  Hit publish to push updates live to your storefront in under 50 milliseconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Headless Edge */}
        {activeTab === 'headless' && (
          <div className="bg-[#12151F] border border-slate-800 rounded-2xl p-8 sm:p-12 space-y-8 animate-in fade-in duration-300">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                Blazing-Fast Global Performance
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Headless Edge Delivery Network
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                By decoupling the visual CMS from the storefront frontend, your pages achieve near-instantaneous load times, 100/100 Google Lighthouse scores, and optimal SEO rankings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-2">
                <div className="text-2xl font-extrabold text-emerald-400">&lt; 50ms</div>
                <h4 className="font-bold text-white text-sm">Edge Serverless Response</h4>
                <p className="text-xs text-slate-400">Cached globally at 300+ edge locations for zero latency.</p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-2">
                <div className="text-2xl font-extrabold text-amber-400">100/100</div>
                <h4 className="font-bold text-white text-sm">Lighthouse Performance</h4>
                <p className="text-xs text-slate-400">Optimized asset pipeline with automatic WebP conversion.</p>
              </div>

              <div className="p-5 bg-[#0C0E14] border border-slate-800 rounded-xl space-y-2">
                <div className="text-2xl font-extrabold text-cyan-400">99.99%</div>
                <h4 className="font-bold text-white text-sm">Enterprise High-Availability</h4>
                <p className="text-xs text-slate-400">Resilient microservices architecture built for viral flash traffic.</p>
              </div>
            </div>
          </div>
        )}
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
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sliders className="w-4 h-4" />
              <span>Launch Merchant Admin Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/stores/jqtrends"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4 text-rose-400" />
              <span>Explore JQ Trends Storefront</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
