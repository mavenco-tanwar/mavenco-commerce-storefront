'use client';

import React from 'react';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { PlatformFaqAccordion } from '@/components/home/PlatformFaqAccordion';
import {
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans select-none">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Knowledge Base &amp; FAQ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Frequently Asked{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Questions &amp; Migration Guide.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Everything you need to know about our headless architecture, zero transaction fees, custom domain SSL provisioning, and white-glove Shopify migration.
          </p>
        </section>

        {/* FAQ Accordion Component */}
        <section>
          <PlatformFaqAccordion />
        </section>

        {/* WhatsApp Concierge Banner */}
        <section className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Have a Specific Technical Question?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our engineering solutions team is available 24/7 on WhatsApp to answer infrastructure, migration, and custom integration questions.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <a
              href="https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20have%20a%20question%20about%20Mavenco%20Commerce."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Solutions Team on WhatsApp</span>
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
