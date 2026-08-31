'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Zap, Server, ShieldCheck, Activity, Users, ArrowRight, Play, RefreshCw, BarChart2 } from 'lucide-react';

export function FlashSaleConcurrencySimulator() {
  const [concurrency, setConcurrency] = useState<number>(25000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulatedRps, setSimulatedRps] = useState<number>(14200);
  const [edgeLatency, setEdgeLatency] = useState<number>(22);
  const [cacheHitRate, setCacheHitRate] = useState<number>(99.4);
  const [droppedRequests, setDroppedRequests] = useState<number>(0);
  const [activeEdgeNodes, setActiveEdgeNodes] = useState<number>(42);

  const handleRunSimulation = () => {
    setIsRunning(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const currentLoad = concurrency;
      setSimulatedRps(Math.round(currentLoad * (0.8 + Math.random() * 0.4)));
      setEdgeLatency(Math.round(18 + (currentLoad / 100000) * 12 + Math.random() * 4));
      setCacheHitRate(Number((99.2 + Math.random() * 0.6).toFixed(1)));
      setActiveEdgeNodes(Math.min(96, Math.max(28, Math.round(currentLoad / 1200))));
      setDroppedRequests(0);

      if (step >= 6) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 400);
  };

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>High-Concurrency Flash Sale Engine</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Shark Tank Spike &amp; Viral Drop Simulator
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Simulate massive sudden visitor spikes and observe how our multi-region Next.js 16 Edge architecture scales effortlessly with zero 502/504 errors.
        </p>
      </div>

      {/* Interactive Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left Slider Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Concurrent Shoppers
              </label>
              <span className="text-sm font-extrabold font-mono text-rose-400">
                {concurrency.toLocaleString()} users
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>1,000 (Normal)</span>
              <span>50,000 (Shark Tank)</span>
              <span>100k (Diwali Flash)</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#121522] rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Simulated Traffic Profile</div>
            <div className="flex justify-between text-slate-300">
              <span>Target Surge:</span>
              <span className="font-bold text-white">{Math.round(concurrency * 0.9).toLocaleString()} req/sec</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Traffic Ingress:</span>
              <span className="font-medium text-slate-200">Global Anycast CDN (300+ PoPs)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Database Strategy:</span>
              <span className="font-bold text-emerald-400">Read Replica Connection Pooling</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Benchmarking Under Load...' : 'Simulate Traffic Spike'}</span>
          </button>
        </div>

        {/* Right Live Real-Time Telemetry Screen (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE EDGE CLUSTER STATUS</span>
            </span>
            <span className="text-emerald-400 font-bold">0 Server Crashes</span>
          </div>

          {/* 4 Big Metrics Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 bg-[#121522] rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Requests Processed</div>
              <div className="text-2xl font-black font-mono text-white">
                {simulatedRps.toLocaleString()} <span className="text-xs text-rose-400 font-normal">req/s</span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3" /> Auto-scaled instantaneously
              </div>
            </div>

            <div className="p-4 bg-[#121522] rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Edge Response Latency</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {edgeLatency} <span className="text-xs text-slate-400 font-normal">ms</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Sub-50ms Global SLA</div>
            </div>

            <div className="p-4 bg-[#121522] rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Edge Cache Hit Ratio</div>
              <div className="text-2xl font-black font-mono text-cyan-400">{cacheHitRate}%</div>
              <div className="text-[10px] text-slate-400 font-mono">Vercel Global Edge</div>
            </div>

            <div className="p-4 bg-[#121522] rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Active Edge Instances</div>
              <div className="text-2xl font-black font-mono text-amber-400">{activeEdgeNodes} nodes</div>
              <div className="text-[10px] text-emerald-400 font-mono">Zero cold starts</div>
            </div>
          </div>

          {/* Architecture Resilience Callout */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Never lose a sale during influencer drops or festival sales.</span>
            </span>
            <span className="font-bold font-mono">100% Up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
