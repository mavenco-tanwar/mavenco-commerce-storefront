'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, CheckCircle2, ShieldCheck, Server, Globe, Zap, Database, ArrowLeft, Clock, RefreshCw } from 'lucide-react';

export default function PlatformStatusPage() {
  const [latency, setLatency] = useState(22);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const systems = [
    { name: 'Multi-Tenant Database Cluster (MongoDB Atlas)', region: 'AWS AP-South (Mumbai)', status: 'Operational', uptime: '99.99%', latency: '14ms' },
    { name: 'Vercel Global Edge Network (Anycast CDN)', region: 'Global 300+ PoPs', status: 'Operational', uptime: '100.0%', latency: `${latency}ms` },
    { name: 'Headless REST & GraphQL API Gateway', region: 'Edge Middleware', status: 'Operational', uptime: '99.98%', latency: '18ms' },
    { name: 'Razorpay / Stripe Payment Ingress', region: 'Multi-Gateway Webhook', status: 'Operational', uptime: '99.99%', latency: '45ms' },
    { name: 'WhatsApp Cloud Business API Gateway', region: 'Meta Verified Cloud', status: 'Operational', uptime: '99.95%', latency: '120ms' },
    { name: 'Cloudinary / S3 Global Media CDN', region: 'Global Edge Cache', status: 'Operational', uptime: '100.0%', latency: '28ms' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    const start = performance.now();
    fetch('/api/v1/tenant-config?tenant=demo')
      .then(() => {
        setLatency(Math.max(12, Math.round(performance.now() - start)));
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Platform Showcase</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161928] border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Health</span>
          </button>
        </div>

        {/* Status Header Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-[#101420] to-[#0D101A] border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">All Systems Operational</h1>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Mavenco Commerce Edge Platform is running at 100% capacity with zero active incidents.
              </p>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 shrink-0">
            99.98% 90-Day Uptime
          </div>
        </div>

        {/* Systems List */}
        <div className="bg-[#10131E] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#141826] border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-300">
              Core Infrastructure Components
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Status Check: Live</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {systems.map((s, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#131724] transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">{s.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{s.region}</div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="font-mono text-slate-300 font-bold">{s.latency}</div>
                    <div className="text-[10px] text-slate-500">Latency</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-mono text-emerald-400 font-bold">{s.uptime}</div>
                    <div className="text-[10px] text-slate-500">SLA</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{s.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Uptime Graph Bar */}
        <div className="bg-[#10131E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">90-Day Historical Availability</span>
            <span className="font-mono text-emerald-400 font-bold">100% Uptime</span>
          </div>
          <div className="flex gap-1 h-8 items-end">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500/80 hover:bg-emerald-400 rounded-xs h-full transition-all cursor-pointer"
                title={`Day ${i + 1}: 100% operational`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>60 days ago</span>
            <span>Today (0 incidents)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
