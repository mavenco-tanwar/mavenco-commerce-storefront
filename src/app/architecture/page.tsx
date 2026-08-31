'use client';

import React from 'react';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { ArchitectureConfigurator } from '@/components/home/ArchitectureConfigurator';
import { SpeedScorecard } from '@/components/home/SpeedScorecard';
import { ApiPlayground } from '@/components/home/ApiPlayground';
import {
  Cpu,
  Zap,
  ShieldCheck,
  Server,
  Database,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans select-none">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Next-Gen Edge Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Sub-40ms Performance with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-sky-300 to-emerald-400">
              Complete Multi-Tenant Isolation.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Built on Next.js 16 Edge runtime, Anycast global CDN, and dedicated MongoDB Atlas database partitions. Zero shared state, zero cold starts, and 99.98% SLA uptime.
          </p>
        </section>

        {/* Multi-Tenant Architecture Configurator */}
        <section>
          <ArchitectureConfigurator />
        </section>

        {/* Core Web Vitals & Speed Scorecards */}
        <section className="pt-4">
          <SpeedScorecard />
        </section>

        {/* Developer REST API & Webhooks Playground */}
        <section className="pt-4">
          <ApiPlayground />
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-sky-950/80 border border-purple-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Inspect the API in Staging?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Generate test API keys, inspect sample webhook payloads, and review our schema documentation with our solutions architects.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <a
              href="https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20developer%20sandbox%20credentials."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Request Sandbox API Keys
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-[#06080E] py-8 text-center text-xs text-slate-500">
        <p>© 2026 Mavenco Commerce Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
