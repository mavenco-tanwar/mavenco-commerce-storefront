'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Store,
  Layers,
  Palette,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Zap,
  Sliders,
} from 'lucide-react';

export function PlatformNavbar() {
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [demoStores, setDemoStores] = useState([
    {
      slug: 'demo',
      name: 'Demo Store',
      industry: 'Modern Lifestyle & Pret (Generic)',
      badge: 'Interactive Demo',
    },
    {
      slug: 'auraliving',
      name: 'Aura Living',
      industry: 'Nordic Minimalist Home Decor',
      badge: 'Home & Decor',
    },
    {
      slug: 'apexathletics',
      name: 'Apex Athletics',
      industry: 'High-Performance Activewear',
      badge: 'Activewear & Gear',
    },
  ]);

  React.useEffect(() => {
    fetch('/api/v1/tenant-config?list=all')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const mapped = json.data.map((t: any) => ({
            slug: t.slug,
            name: t.name,
            industry: t.tagline || 'Modern Commerce Store',
            badge: t.slug === 'demo' ? 'Interactive Demo' : 'Live Storefront',
          }));
          setDemoStores(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0A0C10]/95 backdrop-blur-md border-b border-slate-800 text-white select-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-emerald-950/80 border-b border-slate-800/80 px-4 py-1.5 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <span>
          <strong>Mavenco Commerce Engine</strong> — Next-Generation Headless Visual CMS &amp; Multi-Tenant Platform
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>MAVENCO</span>
              <span className="text-rose-400 font-medium text-xs px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 uppercase tracking-wider">
                COMMERCE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide -mt-0.5">Headless SaaS Engine</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {/* Storefronts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-rose-400" />
              <span>Live Demo Stores</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isStoreMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-72 bg-[#12151F] border border-slate-700/80 rounded-xl shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsStoreMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Provisioned Demo Storefronts
                </div>
                {demoStores.map((store) => (
                  <Link
                    key={store.slug}
                    href={`/stores/${store.slug}`}
                    onClick={() => setIsStoreMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                        {store.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{store.industry}</div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Explore
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/cms" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Visual CMS Overview</span>
          </Link>

          <a href="/#theme-studio" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-rose-400" />
            <span>Theme Tokens</span>
          </a>

          <a href="/#architecture" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture</span>
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://mavenco-admin.vercel.app/login"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/40 transition-all flex items-center gap-1.5 hover:scale-105"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Merchant Admin Demo</span>
            <ExternalLink className="w-3 h-3 text-rose-200" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0F111A] border-b border-slate-800 p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Client Stores</div>
          <div className="space-y-1">
            {demoStores.map((store) => (
              <Link
                key={store.slug}
                href={`/stores/${store.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-white"
              >
                <div className="font-bold">{store.name}</div>
                <div className="text-[11px] text-slate-400">{store.industry}</div>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/cms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2 bg-slate-800 text-center font-bold text-xs text-slate-200 rounded-lg"
            >
              Visual CMS Overview
            </Link>
            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-rose-600 text-center font-bold text-xs text-white rounded-lg flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch Merchant Admin Demo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
