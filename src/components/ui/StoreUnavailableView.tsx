'use client';

import React from 'react';
import Link from 'next/link';
import { Store, ArrowRight, ShieldAlert, Globe, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { formatStoreName } from '@/lib/tenant-config';

interface StoreUnavailableViewProps {
  tenantSlug: string;
  isSuspended?: boolean;
}

export function StoreUnavailableView({ tenantSlug, isSuspended = false }: StoreUnavailableViewProps) {
  const displayName = formatStoreName(tenantSlug);

  return (
    <div className="min-h-[85vh] bg-[#0A0C10] text-slate-100 flex items-center justify-center p-4 sm:p-8 select-none">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>{isSuspended ? 'Store Suspended' : '404 • Store Not Found / Inactive'}</span>
        </div>

        {/* Heading & Details */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isSuspended ? `${displayName} is Temporarily Suspended` : `Store "${displayName}" is Inactive`}
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            {isSuspended
              ? `This storefront is currently paused by the platform administrator for billing or scheduled maintenance.`
              : `The store "${tenantSlug}" does not exist, has been decommissioned or archived by the platform administrator, or the URL is incorrect.`}
          </p>
        </div>

        {/* Active Demo Stores to Explore */}
        <div className="p-6 rounded-2xl bg-[#12141D] border border-slate-800 space-y-4 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Active Platform Storefronts
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Live &amp; Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/stores/demo"
              className="p-3.5 rounded-xl bg-[#181B26] hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                  DEMO
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                    Demo Store
                  </div>
                  <div className="text-[10px] text-slate-400">Curated Modern Lifestyle</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/stores/jqtrends"
              className="p-3.5 rounded-xl bg-[#181B26] hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-600/30 text-rose-300 font-bold flex items-center justify-center text-xs">
                  JQT
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                    JQ Trends
                  </div>
                  <div className="text-[10px] text-slate-400">Luxury Women &amp; Kids Festive</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/stores/auraliving"
              className="p-3.5 rounded-xl bg-[#181B26] hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center text-xs">
                  AURA
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                    Aura Living
                  </div>
                  <div className="text-[10px] text-slate-400">Nordic Sanctuary Decor</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/stores/apexathletics"
              className="p-3.5 rounded-xl bg-[#181B26] hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600/30 text-teal-300 font-bold flex items-center justify-center text-xs">
                  APEX
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-rose-400 transition-colors">
                    Apex Athletics
                  </div>
                  <div className="text-[10px] text-slate-400">Pro High-Performance Gear</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Platform Showcase</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
