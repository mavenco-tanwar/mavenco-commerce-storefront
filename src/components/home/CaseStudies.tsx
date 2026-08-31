'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface ClientSpotlight {
  brand: string;
  slug: string;
  industry: string;
  highlight: string;
  savings: string;
  description: string;
  badge: string;
  color: string;
}

export function CaseStudies() {
  const [spotlights, setSpotlights] = useState<ClientSpotlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTenantSpotlights() {
      try {
        const res = await fetch('/api/v1/platform/tenants').then((r) => (r.ok ? r.json() : null));
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const colors = [
            'from-rose-500/20 to-amber-500/10 border-rose-500/30 text-rose-400',
            'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
            'from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400',
          ];

          const mapped: ClientSpotlight[] = res.data.slice(0, 3).map((t: any, idx: number) => ({
            brand: t.name,
            slug: t.slug,
            industry: t.tagline || 'Modern Headless Commerce Store',
            highlight: '100% Isolated Database Partition',
            savings: `0% Platform Commission (${t.metrics?.products || 12} SKUs live)`,
            description: `Active production storefront running on Next.js 16 Edge Compute with dedicated MongoDB Atlas database isolation.`,
            badge: t.planName || 'Live Merchant',
            color: colors[idx % colors.length],
          }));

          setSpotlights(mapped);
        } else if (isMounted) {
          setSpotlights([]);
        }
      } catch (e) {
        if (isMounted) setSpotlights([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTenantSpotlights();
    return () => {
      isMounted = false;
    };
  }, []);

  // If no active stores exist in MongoDB Atlas, do not render any fake or deleted mock stores
  if (spotlights.length === 0 && !isLoading) {
    return null;
  }

  if (spotlights.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Client Growth Spotlights
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Active Live Stores on Mavenco
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Real production D2C brands powered by dedicated MongoDB Atlas database partitions.
        </p>
      </div>

      {/* Grid of Case Studies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {spotlights.map((cs, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl bg-gradient-to-br ${cs.color} border space-y-4 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-slate-800">
                  {cs.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-white/80">Store #{idx + 1}</span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-white">{cs.brand}</h4>
                <p className="text-xs text-slate-400">{cs.industry}</p>
              </div>

              <div className="p-3 bg-[#0A0C10]/80 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{cs.highlight}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">{cs.savings}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{cs.description}</p>
            </div>

            <Link
              href={`/stores/${cs.slug}`}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>Explore Live Storefront</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
