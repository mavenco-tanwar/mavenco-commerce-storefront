'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  Server,
  Database,
  Globe,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { ArchitectureConfigurator } from '@/components/home/ArchitectureConfigurator';
import { SpeedScorecard } from '@/components/home/SpeedScorecard';
import { ApiPlayground } from '@/components/home/ApiPlayground';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5 shadow-md shadow-rose-950/40">
            <Cpu className="w-4 h-4" />
            <span>Cloud Infrastructure &amp; Edge Latency</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            High-Velocity Edge Compute. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400">
              Isolated MongoDB Atlas Partitions.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every merchant store runs on isolated MongoDB Atlas partitions with multi-region replication, sub-40ms edge ISR caching, and zero noisy-neighbor performance degradation.
          </p>
        </div>

        {/* Global Speed & Edge Benchmark */}
        <SpeedScorecard />

        {/* Interactive Architecture Configurator */}
        <ArchitectureConfigurator />

        {/* Developer REST API & Webhook Playground */}
        <ApiPlayground />
      </main>
    </div>
  );
}
