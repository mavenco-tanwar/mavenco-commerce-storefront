'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { PlatformFaqAccordion } from '@/components/home/PlatformFaqAccordion';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <PlatformNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5 shadow-md shadow-rose-950/40">
            <HelpCircle className="w-4 h-4" />
            <span>Knowledge Base &amp; FAQs</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Everything you need to know about our headless Next.js architecture, one-time pricing model, Shopify migrations, and custom domain setup.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <PlatformFaqAccordion />

        {/* Direct Contact Card */}
        <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Our solutions engineering team is available 24/7 on WhatsApp or email to answer any technical or pricing questions.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <a
              href="https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20have%20questions%20regarding%20Mavenco%20Commerce%20SaaS."
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Concierge (+91 82390 19096)</span>
            </a>
            <a
              href="mailto:ammar.tanwar.dev@gmail.com?subject=Platform%20Question%20-%20Mavenco%20Commerce"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Email Solutions Team</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
