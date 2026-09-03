'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
  ArrowRight,
  HelpCircle,
  Calculator,
  Layers,
  Cpu,
  Server,
  Database,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { RoiSavingsCalculator } from '@/components/home/RoiSavingsCalculator';
import { ArchitectureConfigurator } from '@/components/home/ArchitectureConfigurator';
import { PlatformComparisonMatrix } from '@/components/home/PlatformComparisonMatrix';
import { PlatformFaqAccordion } from '@/components/home/PlatformFaqAccordion';
import { AllPlatformModulesPricingMatrix } from '@/components/pricing/AllPlatformModulesPricingMatrix';

export default function PricingPage() {
  const [billingCurrency, setBillingCurrency] = useState<'INR' | 'USD'>('INR');

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 select-none pb-24">
      {/* ─── Hero Header ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Predictable Cloud Economics</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            One-Time Platform License <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-400 to-emerald-400">
              Flexible Cloud Infrastructure
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-sans leading-relaxed">
            We deploy your custom Headless Storefront and Merchant Admin Panel with an isolated MongoDB database partition. Server computing, database backups, media CDN, and transaction mail run on flexible, pay-as-you-go server maintenance without locked annual contracts. Custom domain renewal excluded and billed separately.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#all-modules"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-xs text-rose-300 font-bold flex items-center gap-1.5 hover:border-rose-400 hover:scale-105 transition-all shadow-lg"
            >
              <Layers className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Explore All 48 Modules Breakdown ↓</span>
            </a>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#121522] border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>0% Commission on GMV</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#121522] border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>100% Isolated MongoDB Partitions</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#121522] border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>No Annual Lock-In Contracts</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3 Tier Pricing Cards Grid ───────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1: Starter Boutique */}
          <div className="bg-[#12151F] border border-slate-800 rounded-3xl p-7 flex flex-col justify-between shadow-2xl space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Tier 01 • Starter Boutique
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  14-Day Trial Available
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">₹24,999</span>
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">/ one-time</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Complete Storefront + Admin Workspace deployment with dedicated MongoDB partition.
                </p>
              </div>

              {/* 14-Day Sandbox Trial & Refund Terms Card */}
              <div className="p-3.5 bg-gradient-to-br from-amber-950/30 via-[#10121A] to-[#12141F] rounded-2xl border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-300 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>14-Day Evaluation Trial</span>
                  </span>
                  <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-mono">₹2,000 Deposit</span>
                </div>
                <div className="text-[10.5px] text-slate-300 space-y-1 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>100% Credited:</strong> If you love it, the ₹2,000 deposit is fully deducted from your ₹24,999 license.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span><strong>50% Risk-Free Refund:</strong> If you don&apos;t proceed, we refund <strong>₹1,000 back</strong> to you.</span>
                  </div>
                </div>
              </div>

              {/* Cloud & Server Card */}
              <div className="p-3.5 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-400">
                  <span>Cloud Server &amp; Database:</span>
                  <span>₹2,000 / mo</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  Flexible recharge (pay monthly or 2-month blocks). Covers MongoDB cluster, Next.js Edge compute &amp; email delivery.
                </div>
              </div>

              {/* Quotas & Limits */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs font-bold text-rose-300">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>22 Essential Modules Active</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to <strong>250 Products</strong> &amp; 1,000 Orders/mo</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>2 GB</strong> Fast Cloud Asset Storage</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>3 Staff</strong> Admin User Accounts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Visual Homepage CMS &amp; Product Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Payment Gateways (Razorpay / Stripe / COD)</span>
                </div>
              </div>
            </div>

            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 text-center bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all block hover:scale-[1.02]"
            >
              Start 14-Day Trial (₹2,000 Deposit) →
            </a>
          </div>

          {/* Plan 2: Professional Scale (FEATURED) */}
          <div className="bg-gradient-to-b from-[#181B28] via-[#141724] to-[#12141F] border-2 border-rose-500/60 rounded-3xl p-7 flex flex-col justify-between shadow-2xl shadow-rose-950/40 space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
              Most Popular Choice
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between pt-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Tier 02 • Professional Scale
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">₹49,999</span>
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">/ one-time</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  High-volume direct-to-consumer flagship storefront with AI automation and marketing engine.
                </p>
              </div>

              {/* Cloud & Server Card */}
              <div className="p-3.5 bg-[#0A0C10] rounded-2xl border border-rose-500/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-400">
                  <span>Cloud Server &amp; Database:</span>
                  <span>₹4,000 / mo</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  Flexible recharge (pay monthly or multi-month). Covers dedicated DB indexing, Serverless Next.js Edge, CDN, &amp; transactional mail.
                </div>
              </div>

              {/* Quotas & Limits */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs font-bold text-amber-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>33 Pro Growth Modules Active</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Up to <strong>2,500 Products</strong> &amp; 10,000 Orders/mo</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>10 GB</strong> Media CDN &amp; WebP Optimization</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>15 Staff</strong> Accounts &amp; RBAC Access</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Abandoned Cart Recovery</strong> Engine</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>AI Copywriting &amp; SEO</strong> Studio</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Full Headless REST API &amp; Webhooks</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Advanced Funnel Analytics</strong> &amp; Projections</span>
                </div>
              </div>
            </div>

            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 text-center bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all block hover:scale-[1.02]"
            >
              Deploy Professional Scale →
            </a>
          </div>

          {/* Plan 3: Enterprise Global */}
          <div className="bg-[#12151F] border border-slate-800 rounded-3xl p-7 flex flex-col justify-between shadow-2xl space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Tier 03 • Enterprise Global
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">₹1,39,999</span>
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">/ one-time</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Multi-brand, multi-region enterprise architecture with custom ERP sync and dedicated DB cluster.
                </p>
              </div>

              {/* Cloud & Server Card */}
              <div className="p-3.5 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-400">
                  <span>Dedicated Cloud Cluster:</span>
                  <span>₹8,000 / mo</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  Dedicated multi-region database cluster, 24/7 VIP SLA &amp; custom DevOps support.
                </div>
              </div>

              {/* Quotas & Limits */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs font-bold text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All 48 Enterprise Modules Included</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to <strong>50,000 Products</strong> &amp; 250,000 Orders/mo</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100 GB</strong> Ultra-fast Cloud Storage</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100 Staff</strong> Users &amp; Multi-Role RBAC</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated MongoDB Cluster Replica</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom ERP, SAP &amp; Warehouse Integrations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 Dedicated Cloud Solution Architect SLA</span>
                </div>
              </div>
            </div>

            <a
              href="mailto:ammar.tanwar.dev@gmail.com?subject=Enterprise%20Plan%20Inquiry%20-%20Mavenco%20Commerce"
              className="w-full py-3.5 text-center bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all block hover:scale-[1.02]"
            >
              Contact Enterprise Sales →
            </a>
          </div>
        </div>

        {/* ─── All 48 Enterprise Modules Breakdown Matrix ─────────────────── */}
        <AllPlatformModulesPricingMatrix />

        {/* ─── Interactive Architecture Configurator ──────────────────────── */}
        <ArchitectureConfigurator />

        {/* ─── Interactive ROI & Savings Calculator vs Shopify ────────────── */}
        <RoiSavingsCalculator />

        {/* ─── Feature Comparison Matrix ──────────────────────────────────── */}
        <PlatformComparisonMatrix />

        {/* ─── Real-Time Cloud Infrastructure & Domain Policy Card ─────────── */}
        <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Cloud Services &amp; Domain Renewal Policy</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparency on what is covered inside the platform and what is billed separately.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
              100% Transparent SLA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-[#0A0C10] rounded-2xl border border-emerald-500/20 space-y-2">
              <div className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Included In Cloud Infrastructure &amp; Maintenance</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 leading-relaxed">
                <li>• <strong>MongoDB Atlas Cluster:</strong> Continuous database replication, high availability, daily snapshots.</li>
                <li>• <strong>Serverless Next.js Edge Compute:</strong> Global CDN caching, edge routing, sub-50ms TTFB.</li>
                <li>• <strong>Transactional Mail Daemon:</strong> Credentials dispatch, order notifications, customer invoices.</li>
                <li>• <strong>Media CDN:</strong> Responsive WebP image transformations and fast product media delivery.</li>
                <li>• <strong>Maintenance &amp; Security:</strong> Core platform version updates, framework patches, bug fixes.</li>
              </ul>
            </div>

            <div className="p-4 bg-[#0A0C10] rounded-2xl border border-amber-500/20 space-y-2">
              <div className="font-bold text-amber-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Excluded &amp; Billed Separately Upon Renewal</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 leading-relaxed">
                <li>• <strong>Custom Domain Names:</strong> Domain registrations (`.com`, `.in`, `.store`, etc.) are renewed yearly at actual registrar cost (approx ₹999 - ₹1,499/year per domain).</li>
                <li>• <strong>Custom Third-Party SMS Gateways:</strong> External transactional SMS gateway credits (OTP / Twilio) if custom SMS routes are requested.</li>
                <li>• <strong>Custom Payment Gateway Transaction Rates:</strong> Standard merchant acquirer fees charged by Razorpay / Stripe (approx 1.8% - 2.0%).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── Enterprise Architecture FAQs ───────────────────────────────── */}
        <div id="faq" className="pt-4">
          <PlatformFaqAccordion />
        </div>

        {/* ─── Final Call To Action ───────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-rose-950/40 via-[#121522] to-amber-950/40 border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Ready To Launch Your Brand?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
            Deploy Your High-Performance Flagship Storefront in Days
          </h2>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Book a private architecture walk-through or provision your 14-day evaluation sandbox now.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://mavenco-admin.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Starter Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <span>Back to Platform Showcase</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
