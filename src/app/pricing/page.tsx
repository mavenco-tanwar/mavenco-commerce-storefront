'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Database,
  Globe,
  Cpu,
} from 'lucide-react';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { RoiSavingsCalculator } from '@/components/home/RoiSavingsCalculator';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5 shadow-md shadow-rose-950/40">
            <DollarSign className="w-4 h-4" />
            <span>Transparent SaaS Pricing</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One-Time Setup Fee. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400">
              0% Transaction Commission.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Stop paying 2% GMV revenue cuts and dozens of expensive Shopify app subscriptions. Keep 100% of your earnings with dedicated MongoDB Atlas multi-region infrastructure.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Starter Boutique */}
          <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                  Tier 1 • Emerging Brands
                </span>
                <h2 className="text-xl font-bold text-white mt-1">Starter Boutique</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ideal for emerging fashion labels &amp; artisanal studios launching their first D2C storefront.
                </p>
              </div>

              <div className="p-4 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white">₹24,999</span>
                  <span className="text-xs text-slate-400 font-mono">one-time</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono">
                  + ₹2,500/mo cloud maintenance
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 100 Products &amp; Variants</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0% Revenue &amp; Transaction Fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Custom Domain + Free SSL</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Visual CMS &amp; Lookbook Studio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated MongoDB Atlas Database</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:ammar.tanwar.dev@gmail.com?subject=Starter%20Boutique%20Inquiry%20-%20Mavenco%20Commerce"
              className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all block"
            >
              Get Started with Starter →
            </a>
          </div>

          {/* Plan 2: Professional Scale (Highlighted) */}
          <div className="bg-gradient-to-b from-[#1E1728] via-[#121422] to-[#10131E] border-2 border-rose-500 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
              Most Popular • High Growth D2C
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase font-mono font-bold text-rose-300 tracking-wider">
                  Tier 2 • Scaling Brands
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">Professional Scale</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Engineered for fast-growing D2C powerhouses scaling orders and optimizing conversions.
                </p>
              </div>

              <div className="p-4 bg-[#0A0C10] rounded-2xl border border-rose-500/30 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white">₹49,999</span>
                  <span className="text-xs text-slate-400 font-mono">one-time</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono">
                  + ₹4,000/mo cloud infrastructure &amp; Edge CDN
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-semibold text-white">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited SKUs &amp; Product Bundles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0% Commission (Keep 100% Revenue)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Domain &amp; Anycast Global Edge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sub-40ms Edge ISR Instant Caching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Review System + Visual CMS</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High-Throughput Flash Sale Surge Mode</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:ammar.tanwar.dev@gmail.com?subject=Professional%20Scale%20Inquiry%20-%20Mavenco%20Commerce"
              className="w-full py-3.5 text-center bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-950/50 transition-all block"
            >
              Launch Professional Store →
            </a>
          </div>

          {/* Plan 3: Enterprise Custom */}
          <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase font-mono font-bold text-purple-400 tracking-wider">
                  Tier 3 • Multi-Store Ecosystem
                </span>
                <h2 className="text-xl font-bold text-white mt-1">Enterprise Custom</h2>
                <p className="text-xs text-slate-400 mt-1">
                  For conglomerate multi-brand enterprises needing custom ERP integrations and dedicated SLA.
                </p>
              </div>

              <div className="p-4 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white">Custom</span>
                  <span className="text-xs text-slate-400 font-mono">tailored scope</span>
                </div>
                <div className="text-xs text-purple-300 font-mono">
                  Multi-region dedicated cluster SLA
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom Headless Integrations (SAP / NetSuite)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Unlimited Tenant Storefront Partitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Dedicated Multi-Region MongoDB Cluster</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>24/7 Priority WhatsApp &amp; Engineering SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>White-Glove Shopify / Magento Migration</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:ammar.tanwar.dev@gmail.com?subject=Enterprise%20Plan%20Inquiry%20-%20Mavenco%20Commerce"
              className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all block"
            >
              Contact Enterprise Sales →
            </a>
          </div>
        </div>

        {/* Interactive ROI & Savings Calculator vs Shopify */}
        <RoiSavingsCalculator />

        {/* Cloud Infrastructure & Domain Policy SLA */}
        <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Cloud Infrastructure &amp; Maintenance Transparency</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clear breakdown of what is covered inside our cloud SLA vs billed domain registrars.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
              100% Transparent Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-[#0A0C10] rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Included in Cloud Maintenance SLA</span>
              </div>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                <li>• <strong>MongoDB Atlas Cluster:</strong> Continuous database replication, high availability, daily snapshots.</li>
                <li>• <strong>Serverless Next.js Edge Compute:</strong> Global CDN caching, edge routing, sub-50ms TTFB.</li>
                <li>• <strong>Transactional Mail Daemon:</strong> Credentials dispatch, order notifications, customer invoices.</li>
                <li>• <strong>Media CDN:</strong> Responsive WebP image transformations and fast product media delivery.</li>
                <li>• <strong>Maintenance &amp; Security:</strong> Core platform version updates, framework patches, bug fixes.</li>
              </ul>
            </div>

            <div className="p-5 bg-[#0A0C10] rounded-2xl border border-amber-500/20 space-y-3">
              <div className="font-bold text-amber-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Custom Domain Policy</span>
              </div>
              <ul className="space-y-2 text-slate-300 leading-relaxed">
                <li>• <strong>Your Domain Ownership:</strong> You retain 100% legal ownership of your custom domain (e.g. yourbrand.com).</li>
                <li>• <strong>Any Registrar Support:</strong> Connect GoDaddy, Namecheap, Cloudflare, or Google Domains.</li>
                <li>• <strong>Zero DNS Markup:</strong> Domain renewal is paid directly to your registrar (~₹800/yr).</li>
                <li>• <strong>Auto SSL Provisioning:</strong> Free Let’s Encrypt wildcard SSL certificate generated and renewed automatically by Mavenco.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
