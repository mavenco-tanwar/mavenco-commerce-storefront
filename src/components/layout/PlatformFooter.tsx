'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Layers, Sliders, ExternalLink, Palette, Globe, CheckCircle2 } from 'lucide-react';

export function PlatformFooter() {
  return (
    <footer className="bg-[#080A0E] text-slate-400 border-t border-slate-800 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Platform Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                M
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">MAVENCO COMMERCE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Next-generation multi-tenant headless ecommerce platform. Provisioning isolated merchant storefronts, visual drag-and-drop CMS, and dynamic design tokens on the fly.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enterprise Ready Architecture</span>
            </div>
          </div>

          {/* Col 2: Live Provisioned Stores */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Live Demo Storefronts
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/stores/jqtrends" className="hover:text-rose-400 transition-colors flex items-center justify-between">
                  <span>JQ Trends (Luxury Fashion)</span>
                  <span className="text-[10px] text-slate-500 font-mono">/stores/jqtrends</span>
                </Link>
              </li>
              <li>
                <Link href="/stores/auraliving" className="hover:text-rose-400 transition-colors flex items-center justify-between">
                  <span>Aura Living (Home Decor)</span>
                  <span className="text-[10px] text-slate-500 font-mono">/stores/auraliving</span>
                </Link>
              </li>
              <li>
                <Link href="/stores/apexathletics" className="hover:text-rose-400 transition-colors flex items-center justify-between">
                  <span>Apex Athletics (Activewear)</span>
                  <span className="text-[10px] text-slate-500 font-mono">/stores/apexathletics</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Capabilities */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              CMS &amp; Platform Engines
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visual Drag &amp; Drop CMS</span>
                </Link>
              </li>
              <li>
                <a href="/#theme-studio" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-400" />
                  <span>Theme &amp; Font Customizer</span>
                </a>
              </li>
              <li>
                <a href="/#architecture" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Tenant Routing</span>
                </a>
              </li>
              <li>
                <a
                  href="https://mavenco-admin.vercel.app/login"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 font-bold text-rose-400"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Merchant Admin Workspace Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Engine Specs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Overview
            </div>
            <div className="p-3.5 bg-[#0F1118] rounded-xl border border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Rendering:</span>
                <span className="text-slate-200">Serverless Edge</span>
              </div>
              <div className="flex justify-between">
                <span>CMS Blocks:</span>
                <span className="text-amber-400">15+ Modular Types</span>
              </div>
              <div className="flex justify-between">
                <span>Theme Engine:</span>
                <span className="text-rose-400">Live Dynamic CSS</span>
              </div>
              <div className="flex justify-between">
                <span>Isolation:</span>
                <span className="text-emerald-400">100% Isolated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Mavenco Commerce Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Next-Gen Ecommerce Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
