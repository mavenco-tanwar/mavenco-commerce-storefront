'use client';

import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Database, Zap, DollarSign, Globe, Check, ArrowRight, Server, MessageSquare } from 'lucide-react';

export function ArchitectureConfigurator() {
  const [step, setStep] = useState<number>(1);
  const [industry, setIndustry] = useState<'apparel' | 'home' | 'activewear' | 'custom'>('apparel');
  const [domainType, setDomainType] = useState<'dual' | 'subdomain' | 'custom_ingress'>('dual');
  const [gateway, setGateway] = useState<'razorpay' | 'stripe' | 'cashfree' | 'cod'>('razorpay');
  const [brandName, setBrandName] = useState<string>('My Brand');

  const industryNames = {
    apparel: 'Haute Luxury & Ethnic Pret',
    home: 'Nordic Home Living & Decor',
    activewear: 'High-Performance Activewear',
    custom: 'Bespoke D2C Enterprise',
  };

  const gatewayNames = {
    razorpay: 'Razorpay Direct UPI & Cards (0% Platform Fee)',
    stripe: 'Stripe Global Multi-Currency Checkout',
    cashfree: 'Cashfree Fast Checkout & Instant Refunds',
    cod: 'Automated Cash on Delivery with OTP Verification',
  };

  const domainNames = {
    dual: 'Dual Custom Domains (brand.com + admin.brand.com)',
    subdomain: 'Mavenco Managed Subdomain (brand.mavenco.store)',
    custom_ingress: 'Custom Enterprise Anycast Edge Ingress',
  };

  const handleSendBlueprintWhatsApp = () => {
    const summary = `Hi Mavenco Solutions Team,\n\nI just configured my custom store architecture on your visual studio:\n\n🏬 *Brand Name:* ${brandName}\n🏷️ *Industry:* ${industryNames[industry]}\n🌐 *Domain Strategy:* ${domainNames[domainType]}\n💳 *Payment Gateway:* ${gatewayNames[gateway]}\n⚡ *Database:* Dedicated MongoDB Atlas Cluster\n🚀 *Commission:* 0% Platform Fee\n\nPlease share the deployment timeline and launch quotation!`;
    const cleanPhone = '918239019096';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Interactive Architecture Studio
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configure Your Custom Headless Architecture
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Customize your database isolation, custom domain routing, and checkout stack in 4 interactive steps.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
        {[
          { num: 1, label: 'Industry' },
          { num: 2, label: 'Domains' },
          { num: 3, label: 'Payments' },
          { num: 4, label: 'Blueprint' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
              step === s.num
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/40'
                : step > s.num
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/30'
                : 'bg-[#0A0C10] text-slate-500 border-slate-800'
            }`}
          >
            <span className="block">{s.num}. {s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto min-h-[300px] flex flex-col justify-between">
        {/* Step 1: Industry */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <h4 className="text-base font-bold text-white">Step 1: Choose Your Store Brand Name &amp; Industry</h4>
              <p className="text-xs text-slate-400">Pre-loads optimized catalog taxonomies and visual theme tokens.</p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Your Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Muskan Clothing or Aura Living"
                className="w-full px-4 py-2.5 bg-[#0A0C10] border border-slate-700 rounded-xl text-white text-xs focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'apparel', title: 'Haute Luxury & Ethnic Pret', icon: '👗', desc: 'Silk saris, lehengas, evening blazers & festive wear' },
                { id: 'home', title: 'Nordic Home Living & Decor', icon: '🌿', desc: 'Ceramic tableware, terrazzo lamps & organic textiles' },
                { id: 'activewear', title: 'Performance Activewear', icon: '⚡', desc: 'Seamless leggings, tech hoodies & training runners' },
                { id: 'custom', title: 'Custom Multi-Category D2C', icon: '💎', desc: 'Jewelry, cosmetics, gourmet foods or multi-brand lookbooks' },
              ].map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setIndustry(ind.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    industry === ind.id
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{ind.icon}</div>
                  <div className="text-xs font-bold text-white">{ind.title}</div>
                  <div className="text-[10px] text-slate-400">{ind.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Domains */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <h4 className="text-base font-bold text-white">Step 2: Choose Your Domain &amp; Ingress Strategy</h4>
              <p className="text-xs text-slate-400">All options include automated Let’s Encrypt Wildcard TLS 1.3 certificates.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: 'dual',
                  title: 'Dual Custom White-Label Domains (Recommended)',
                  desc: `Public Store: ${brandName.toLowerCase().replace(/\s+/g, '')}.com • Merchant Admin: admin.${brandName.toLowerCase().replace(/\s+/g, '')}.com`,
                  badge: 'Enterprise White-Label',
                  icon: <Globe className="w-5 h-5 text-emerald-400" />,
                },
                {
                  id: 'subdomain',
                  title: 'Mavenco Fast Subdomain Ingress',
                  desc: `Instant zero-config setup on ${brandName.toLowerCase().replace(/\s+/g, '')}.mavenco.store with global edge caching.`,
                  badge: 'Instant Setup',
                  icon: <Server className="w-5 h-5 text-sky-400" />,
                },
                {
                  id: 'custom_ingress',
                  title: 'Custom Enterprise Cloudflare / Anycast Ingress',
                  desc: 'Bring your existing enterprise DNS / Cloudflare zone with custom WAF rules.',
                  badge: 'High Security',
                  icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
                },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDomainType(d.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    domainType === d.id
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {d.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{d.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] font-mono text-slate-300">
                        {d.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{d.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Payments */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <h4 className="text-base font-bold text-white">Step 3: Select Payment Gateway &amp; Payout Routing</h4>
              <p className="text-xs text-slate-400">100% direct merchant settlements with 0% platform transaction fees.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'razorpay', title: 'Razorpay Direct Gateway', desc: 'Direct UPI, NetBanking, Credit/Debit cards & EMI with 0% platform fee', icon: '⚡' },
                { id: 'stripe', title: 'Stripe Global Checkout', desc: 'Accept international cards in USD, EUR, GBP, AED with automated fraud radar', icon: '🌐' },
                { id: 'cashfree', title: 'Cashfree Fast Checkout', desc: 'Optimized for high-throughput Indian UPI with instant customer refunds', icon: '💰' },
                { id: 'cod', title: 'Automated COD with OTP', desc: 'Verify cash-on-delivery orders via SMS/WhatsApp OTP to reduce RTO returns', icon: '📦' },
              ].map((gw) => (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => setGateway(gw.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    gateway === gw.id
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{gw.icon}</div>
                  <div className="text-xs font-bold text-white">{gw.title}</div>
                  <div className="text-[10px] text-slate-400">{gw.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Blueprint Summary */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1 text-center">
              <h4 className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                <Check className="w-5 h-5" />
                <span>Architecture Blueprint Configured</span>
              </h4>
              <p className="text-xs text-slate-400">Ready for instant automated provisioning on the Mavenco Engine.</p>
            </div>

            <div className="p-5 bg-[#0A0C10] rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Brand Name:</span>
                <span className="font-bold text-white text-sm">{brandName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Industry Architecture:</span>
                <span className="font-bold text-rose-400">{industryNames[industry]}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Domain Strategy:</span>
                <span className="font-mono text-emerald-400">{domainNames[domainType]}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Checkout Stack:</span>
                <span className="font-bold text-sky-400">{gatewayNames[gateway]}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Platform Transaction Commission:</span>
                <span className="font-bold font-mono text-emerald-400">0% (Keep 100% Profit)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendBlueprintWhatsApp}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Deploy Architecture via WhatsApp (+91 82390 19096)</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Previous Step
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Reconfigure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
