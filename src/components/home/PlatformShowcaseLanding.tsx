'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Database,
  Globe,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Store,
  Zap,
  ShoppingBag,
  Palette,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PlatformShowcaseLanding() {
  const tenants = [
    {
      id: 'store_jq_trends',
      slug: 'jqtrends',
      name: 'JQ Trends',
      tagline: 'Affordable Luxury Women & Kids Fashion',
      industry: 'Haute Couture & Festive Fashion',
      currency: 'INR (₹)',
      themeColors: {
        primary: '#111111',
        secondary: '#FFFDFC',
        accent: '#B77A68',
      },
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
      description: 'Artisanal Indian pret, chanderi silks, luxury festive sets, and runway silhouettes.',
      badgeText: 'Fashion & Luxury',
    },
    {
      id: 'store_aura_living',
      slug: 'auraliving',
      name: 'Aura Living',
      tagline: 'Minimalist Scandinavian Home Decor & Lifestyle',
      industry: 'Nordic Interior & Living',
      currency: 'USD ($)',
      themeColors: {
        primary: '#1B4332',
        secondary: '#FAF3E0',
        accent: '#74C69D',
      },
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80',
      description: 'Handcrafted ceramic pottery, sustainable linen drapes, and organic oak furniture.',
      badgeText: 'Home & Decor',
    },
    {
      id: 'store_apex_athletics',
      slug: 'apexathletics',
      name: 'Apex Athletics',
      tagline: 'High-Performance Activewear & Compression Gear',
      industry: 'Athletic Gear & Footwear',
      currency: 'USD ($)',
      themeColors: {
        primary: '#0A0A0A',
        secondary: '#161822',
        accent: '#00F5D4',
      },
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=80',
      description: 'Seamless compression tops, marathon-grade carbon plated shoes, and gym accessories.',
      badgeText: 'Activewear & Gear',
    },
  ];

  return (
    <div className="flex flex-col bg-[#0C0E14] text-slate-100 min-h-screen select-none">
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
            The Commerce Engine For <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-200 to-emerald-400">Next-Gen Brands</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            A reusable, multi-tenant headless ecommerce architecture. Provision hundreds of isolated client stores with dedicated databases, dynamic themes, and visual drag &amp; drop CMS.
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
              href="https://mavenco-admin.vercel.app/platform"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Open Superadmin Console</span>
            </a>
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
            Click any client below to test dynamic on-the-fly theme loading, custom typography, catalogs, and isolated databases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tenants.map((store) => (
            <div
              key={store.id}
              className="bg-[#141722] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all group"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141722] via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {store.badgeText}
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: store.themeColors.primary }}
                      title="Primary Color"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
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

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {store.description}
                  </p>

                  <div className="p-3 bg-[#0C0E14] rounded-xl border border-slate-800 text-[11px] space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Database:</span>
                      <span className="text-slate-300 font-bold">tenant_{store.slug}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Currency:</span>
                      <span className="text-emerald-400 font-bold">{store.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Routing:</span>
                      <span className="text-rose-400">/stores/{store.slug}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <Link
                  href={`/stores/${store.slug}`}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Visit {store.name} Storefront</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`https://mavenco-admin.vercel.app/stores/${store.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>View Merchant Admin</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Architecture Highlights */}
      <section className="py-16 bg-[#0E1017] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built For Enterprise SaaS Scalability
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every client gets its own isolated stack without code duplication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#141722] border border-slate-800 rounded-xl space-y-3">
              <Database className="w-6 h-6 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Tenant Database Isolation</h3>
              <p className="text-xs text-slate-400">
                Independent database instances for complete security, zero tenant data leakage, and GDPR compliance.
              </p>
            </div>

            <div className="p-5 bg-[#141722] border border-slate-800 rounded-xl space-y-3">
              <Palette className="w-6 h-6 text-rose-400" />
              <h3 className="font-bold text-white text-sm">Dynamic Design Tokens</h3>
              <p className="text-xs text-slate-400">
                On-the-fly Google Fonts, color schemes, and button styles rendered dynamically per store.
              </p>
            </div>

            <div className="p-5 bg-[#141722] border border-slate-800 rounded-xl space-y-3">
              <Layers className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Visual Drag &amp; Drop CMS</h3>
              <p className="text-xs text-slate-400">
                12+ modular content block types with instant draft, preview, and real-time live publishing.
              </p>
            </div>

            <div className="p-5 bg-[#141722] border border-slate-800 rounded-xl space-y-3">
              <Globe className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Custom Domain Engine</h3>
              <p className="text-xs text-slate-400">
                Wildcard subdomains, automatic SSL provisioning, and custom CNAME routing for every merchant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
