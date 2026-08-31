'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Zap,
  Sliders,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { resolveTenant } from '@/lib/tenant-config';

interface TenantItem {
  slug: string;
  name: string;
  category?: string;
  primaryColor?: string;
  accentColor?: string;
}

export function DemoStoreSwitcherBar() {
  const pathname = usePathname();
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [currentTenant, setCurrentTenant] = useState(resolveTenant());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [latency, setLatency] = useState<number>(24);

  useEffect(() => {
    const t = resolveTenant();
    setCurrentTenant(t);

    const startTime = performance.now();
    fetch('/api/v1/platform/tenants')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const measured = Math.max(12, Math.round(performance.now() - startTime));
        setLatency(measured);
        if (json?.data?.length) {
          setTenants(
            json.data.map((item: any) => ({
              slug: item.slug,
              name: item.name,
              category: item.category || item.industry || 'Modern Retail',
              primaryColor: item.theme?.primaryColor || '#E11D48',
              accentColor: item.theme?.accentColor || '#FB7185',
            }))
          );
        }
      })
      .catch(() => {});
  }, [pathname]);

  const demoStores: TenantItem[] =
    tenants.length > 0
      ? tenants
      : [
          { slug: 'demo', name: 'Demo Store', category: 'Modern Lifestyle', primaryColor: '#E11D48', accentColor: '#FB7185' },
          { slug: 'auraliving', name: 'Aura Living', category: 'Home & Decor', primaryColor: '#1B4332', accentColor: '#74C69D' },
          { slug: 'apexathletics', name: 'Apex Athletics', category: 'High-Performance Activewear', primaryColor: '#0A0A0A', accentColor: '#00F5D4' },
        ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0D1017]/90 hover:bg-[#141824] border border-slate-700/80 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Store className="w-3.5 h-3.5 text-rose-400" />
          <span>Switch Store</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Live Demo Store Switcher" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-[#0A0D14]/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3 text-slate-200 transition-all duration-300">
        {/* Main Bar Row */}
        <div className="flex items-center justify-between gap-3 text-xs flex-wrap sm:flex-nowrap">
          {/* Active Store Indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden md:inline">Active Store:</span>
              <span className="font-bold text-white truncate">{currentTenant.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
                /{currentTenant.slug}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3 h-3" />
              <span>{latency}ms Edge</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTenant.theme.primaryColor }} />
              <span>Theme Synced</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Toggle Store List Drawer */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-rose-400" />
              <span>Switch Tenant</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            {/* Admin Demo CTA */}
            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Merchant Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Minimize bar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Drawer: All Available Provisioned Stores */}
        {isExpanded && (
          <div className="pt-3 mt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs animate-in fade-in duration-200">
            {demoStores.map((store) => {
              const isSelected = currentTenant.slug === store.slug;
              return (
                <Link
                  key={store.slug}
                  href={`/stores/${store.slug}`}
                  onClick={() => setIsExpanded(false)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                      : 'bg-[#0E111A] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: store.primaryColor || '#E11D48' }}
                    />
                    <div className="min-w-0">
                      <div className="text-white text-xs truncate group-hover:text-rose-300">{store.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{store.category}</div>
                    </div>
                  </div>

                  {isSelected ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">/stores/{store.slug}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
