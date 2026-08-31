'use client';

import React from 'react';
import { Zap, Gauge, TrendingUp, Check, ShieldCheck, ArrowRight, Smartphone, Globe } from 'lucide-react';

export function SpeedScorecard() {
  const metrics = [
    { label: 'Time-To-First-Byte (TTFB)', mavenco: '24ms', shopify: '380ms', woo: '680ms', win: true },
    { label: 'Largest Contentful Paint (LCP)', mavenco: '0.6s', shopify: '2.4s', woo: '3.8s', win: true },
    { label: 'Cumulative Layout Shift (CLS)', mavenco: '0.00', shopify: '0.08', woo: '0.19', win: true },
    { label: 'Total Blocking Time (TBT)', mavenco: '0ms', shopify: '240ms', woo: '490ms', win: true },
    { label: 'Google Core Web Vitals', mavenco: '100% Passed', shopify: 'Conditional', woo: 'Failed', win: true },
  ];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Global Edge Latency Benchmark
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Why Speed Drives Direct Revenue
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Every 100ms reduction in checkout latency increases mobile conversion by <strong>1.1%</strong>. See how our Next.js 16 serverless edge engine crushes monolithic platforms.
        </p>
      </div>

      {/* Scorecards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Mavenco Edge Lighthouse Score */}
        <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-[#0E1318] to-[#121822] rounded-2xl border border-emerald-500/40 space-y-5 relative shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Mavenco Headless Edge</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              VERIFIED 99/100
            </span>
          </div>

          {/* Lighthouse Circular Gauges */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { score: '99', label: 'Performance', color: 'text-emerald-400 border-emerald-500/40' },
              { score: '100', label: 'SEO Meta', color: 'text-emerald-400 border-emerald-500/40' },
              { score: '98', label: 'Best Practices', color: 'text-emerald-400 border-emerald-500/40' },
              { score: '100', label: 'Accessibility', color: 'text-emerald-400 border-emerald-500/40' },
            ].map((g, idx) => (
              <div key={idx} className="p-3 bg-[#0A0C10] rounded-xl border border-slate-800 space-y-1">
                <div className={`w-10 h-10 rounded-full border-2 ${g.color} flex items-center justify-center font-extrabold font-mono text-sm mx-auto`}>
                  {g.score}
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">{g.label}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#0A0C10] rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Global Edge TTFB:</span>
            <span className="text-emerald-400 font-bold">&lt; 24ms (Sub-second)</span>
          </div>
        </div>

        {/* Legacy Monolithic Score */}
        <div className="p-6 bg-[#0E1018] rounded-2xl border border-red-500/20 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-red-400">Traditional Monolith (Woo / Shopify)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-mono font-bold">
              HEAVY OVERHEAD
            </span>
          </div>

          {/* Legacy Circular Gauges */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { score: '44', label: 'Performance', color: 'text-red-400 border-red-500/40' },
              { score: '72', label: 'SEO Meta', color: 'text-amber-400 border-amber-500/40' },
              { score: '65', label: 'Best Practices', color: 'text-amber-400 border-amber-500/40' },
              { score: '78', label: 'Accessibility', color: 'text-amber-400 border-amber-500/40' },
            ].map((g, idx) => (
              <div key={idx} className="p-3 bg-[#0A0C10] rounded-xl border border-slate-800 space-y-1">
                <div className={`w-10 h-10 rounded-full border-2 ${g.color} flex items-center justify-center font-extrabold font-mono text-sm mx-auto`}>
                  {g.score}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate">{g.label}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#0A0C10] rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Server Latency:</span>
            <span className="text-red-400 font-bold">400ms - 900ms</span>
          </div>
        </div>
      </div>

      {/* Latency Breakdown Table */}
      <div className="max-w-4xl mx-auto overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-400 tracking-wider">
              <th className="py-2.5 px-3">Performance Metric</th>
              <th className="py-2.5 px-3 text-center text-emerald-400 font-bold">Mavenco Edge</th>
              <th className="py-2.5 px-3 text-center text-slate-400">Shopify Plus</th>
              <th className="py-2.5 px-3 text-center text-slate-400">WooCommerce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {metrics.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-300">{m.label}</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-400 bg-emerald-950/20">{m.mavenco}</td>
                <td className="py-2.5 px-3 text-center text-slate-400">{m.shopify}</td>
                <td className="py-2.5 px-3 text-center text-slate-500">{m.woo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
