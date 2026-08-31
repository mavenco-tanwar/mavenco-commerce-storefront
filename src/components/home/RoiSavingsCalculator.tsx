'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function RoiSavingsCalculator() {
  const [monthlyGmv, setMonthlyGmv] = useState<number>(1000000); // Default ₹10,00,000 / month

  // Calculations
  // Shopify:
  // 1. Transaction fees (approx 2% on ₹10L = ₹20,000/mo)
  // 2. Essential App Subscriptions ($180/mo = ~₹15,000/mo for PageFly CMS, Loox reviews, Klaviyo add-on, SEO optimizer)
  // 3. Shopify Plan ($105/mo = ~₹8,800/mo)
  // Monthly Shopify Cost = (monthlyGmv * 0.02) + 23800
  const shopifyTransactionFee = monthlyGmv * 0.02;
  const shopifyAppsAndPlan = 23800;
  const shopifyMonthlyTotal = shopifyTransactionFee + shopifyAppsAndPlan;
  const shopifyAnnualTotal = shopifyMonthlyTotal * 12;

  // Mavenco Commerce:
  // 1. 0% Transaction Fees = ₹0
  // 2. Built-in Visual Drag & Drop CMS = ₹0
  // 3. Built-in AI Copywriter & SEO Studio = ₹0
  // 4. Built-in Verified Reviews = ₹0
  // 5. Cloud Hosting & Dedicated Mongo Cluster: ₹4,000/mo (Professional Scale)
  // 6. Annual Platform License Amortized: ₹49,999 one-time
  const mavencoMonthlyTotal = 4000;
  const mavencoAnnualTotal = 49999 + mavencoMonthlyTotal * 12;

  const annualSavings = Math.max(0, shopifyAnnualTotal - mavencoAnnualTotal);
  const savingsPercent = Math.round((annualSavings / shopifyAnnualTotal) * 100);

  return (
    <div className="bg-[#121522] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          SaaS Cost Efficiency Engine
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Calculate Your Annual Savings vs. Shopify
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Shopify charges up to <strong>2% on every transaction</strong> plus ₹15,000+/mo in third-party app subscriptions. See how much profit you keep with Mavenco's 0% commission architecture.
        </p>
      </div>

      {/* Interactive Slider */}
      <div className="max-w-xl mx-auto space-y-4 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Monthly Online Store Sales (GMV):
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-rose-400 font-mono">
            ₹{monthlyGmv.toLocaleString('en-IN')} /mo
          </span>
        </div>

        <input
          type="range"
          min={100000}
          max={5000000}
          step={50000}
          value={monthlyGmv}
          onChange={(e) => setMonthlyGmv(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />

        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>₹1 Lakh /mo</span>
          <span>₹25 Lakhs /mo</span>
          <span>₹50 Lakhs /mo</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Shopify Breakdown */}
        <div className="p-6 bg-[#0E1018] rounded-2xl border border-red-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-red-400">Shopify + Essential Apps</span>
            <span className="text-xs font-bold text-red-400/80 uppercase font-mono">High Overhead</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">2% Transaction Commission:</span>
              <span className="font-mono text-red-300">₹{(shopifyTransactionFee * 12).toLocaleString('en-IN')}/yr</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Essential App Subscriptions:</span>
              <span className="font-mono text-red-300">₹1,80,000/yr</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Shopify Core Plan ($105/mo):</span>
              <span className="font-mono text-red-300">₹1,05,600/yr</span>
            </div>
          </div>

          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-400">Total Annual Outflow:</span>
            <span className="text-xl font-extrabold text-red-400 font-mono">
              ₹{Math.round(shopifyAnnualTotal).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Mavenco Breakdown */}
        <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-[#0E1318] to-[#121820] rounded-2xl border border-emerald-500/40 space-y-4 relative shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Mavenco Commerce Cloud</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono uppercase">
              0% Commission
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">0% Transaction Fee:</span>
              <span className="font-mono text-emerald-400 font-bold">₹0 (Keep 100%)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Built-in CMS, AI SEO &amp; Reviews:</span>
              <span className="font-mono text-emerald-400 font-bold">Included Free</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Dedicated MongoDB + Edge Hosting:</span>
              <span className="font-mono text-slate-200">₹48,000/yr (₹4k/mo)</span>
            </div>
          </div>

          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-400">Total Year 1 Investment:</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              ₹{Math.round(mavencoAnnualTotal).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Big ROI Callout */}
      <div className="p-6 bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-emerald-950/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 justify-center sm:justify-start">
            <TrendingUp className="w-4 h-4" />
            <span>Net Annual Merchant Profit Retained:</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            Save ₹{Math.round(annualSavings).toLocaleString('en-IN')} / year ({savingsPercent}% ROI)
          </div>
        </div>

        <a
          href="#pricing"
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl shadow-emerald-950/50 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
        >
          <span>Claim Your Savings</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
