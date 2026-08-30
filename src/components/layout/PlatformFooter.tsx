'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Database, Globe, Layers, ArrowRight, ExternalLink } from 'lucide-react';

export function PlatformFooter() {
  return (
    <footer className="bg-[#080A0E] text-slate-400 border-t border-slate-800 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Platform Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                M
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">MAVENCO COMMERCE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Reusable multi-tenant headless ecommerce architecture. Provisioning isolated merchant databases, visual drag-and-drop CMS, and dynamic branding on the fly.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              MongoDB Multi-Tenant Database Engine
            </div>
          </div>

          {/* Col 2: Live Provisioned Stores */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Live Tenant Storefronts
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/stores/jqtrends" className="hover:text-rose-400 transition-colors flex items-center justify-between">
                  <span>JQ Trends (Luxury Fashion)</span>
                  <span className="text-[10px] text-slate-400 font-mono">/stores/jqtrends</span>
                </Link>
              </li>
              <li>
                <Link href="/stores/auraliving" className="hover:text-rose-400 transition-colors flex items-center justify-between">
                  <span>Aura Living (Home &amp; Decor)</span>
                  <span className="text-[10px] text-slate-400 font-mono">/stores/auraliving</span>
                </Link>
              </li>
              <li>
                <Link href="/stores/apexathletics" className="hover:text-rose-400 transition-colors flex items-center justify-between">
                  <span>Apex Athletics (Activewear)</span>
                  <span className="text-[10px] text-slate-400 font-mono">/stores/apexathletics</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: SaaS Control Planes */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Admin &amp; Control Planes
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://mavenco-admin.vercel.app/platform"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  <span>Superadmin Platform Console</span>
                </a>
              </li>
              <li>
                <a
                  href="https://mavenco-admin.vercel.app/stores/jqtrends"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Merchant Admin (JQ Trends)
                </a>
              </li>
              <li>
                <a
                  href="https://mavenco-admin.vercel.app/stores/auraliving"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Merchant Admin (Aura Living)
                </a>
              </li>
              <li>
                <a
                  href="https://mavenco-admin.vercel.app/stores/apexathletics"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Merchant Admin (Apex Athletics)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Engine Specs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Architecture
            </div>
            <div className="p-3 bg-[#0F1118] rounded-xl border border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Routing:</span>
                <span className="text-slate-200">Next.js Edge Proxy</span>
              </div>
              <div className="flex justify-between">
                <span>CMS:</span>
                <span className="text-slate-200">Visual Drag &amp; Drop</span>
              </div>
              <div className="flex justify-between">
                <span>Isolation:</span>
                <span className="text-emerald-400">100% DB Isolated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Mavenco Commerce Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/mavenco-tanwar/mavenco-commerce-storefront" target="_blank" rel="noreferrer" className="hover:text-slate-400">
              Storefront GitHub
            </a>
            <span>•</span>
            <a href="https://github.com/mavenco-tanwar/mavenco-commerce-admin" target="_blank" rel="noreferrer" className="hover:text-slate-400">
              Admin GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
