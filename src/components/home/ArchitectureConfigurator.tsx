'use client';

import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Database, Zap, DollarSign, Globe, Check, ArrowRight, Server, MessageSquare, Download } from 'lucide-react';

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

  const handleDownloadRfpPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mavenco Commerce - Enterprise Architecture Specification - ${brandName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #111; max-width: 700px; margin: 0 auto; line-height: 1.5; }
            .header { border-bottom: 2px solid #0F172A; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .badge { background: #E0E7FF; color: #3730A3; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: monospace; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #64748B; letter-spacing: 1px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; }
            .card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; }
            .card-title { font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: bold; }
            .card-val { font-size: 13px; font-weight: bold; color: #0F172A; margin-top: 2px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px dashed #CBD5E1; font-size: 11px; color: #64748B; text-align: center; }
            @media print { button { display: none; } body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0; font-size: 24px; color: #0F172A;">MAVENCO COMMERCE</h1>
              <div style="font-size: 12px; color: #64748B;">Enterprise Headless Multi-Tenant Technical Architecture Specification</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">SPEC #MVC-RFP-${Date.now().toString().slice(-6)}</span>
              <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Generated: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">1. Client Brand &amp; Domain Ingress</div>
            <div class="grid">
              <div class="card">
                <div class="card-title">Brand / Organization</div>
                <div class="card-val">${brandName}</div>
              </div>
              <div class="card">
                <div class="card-title">Industry Taxonomy</div>
                <div class="card-val">${industryNames[industry]}</div>
              </div>
              <div class="card">
                <div class="card-title">Domain Strategy</div>
                <div class="card-val">${domainNames[domainType]}</div>
              </div>
              <div class="card">
                <div class="card-title">SSL / TLS Termination</div>
                <div class="card-val">Wildcard TLS 1.3 Anycast Ingress</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. Edge Compute &amp; Database Topology</div>
            <div class="grid">
              <div class="card">
                <div class="card-title">Compute Layer</div>
                <div class="card-val">Next.js 16 Edge Runtime (Sub-40ms TTFB)</div>
              </div>
              <div class="card">
                <div class="card-title">Database Partition</div>
                <div class="card-val">MongoDB Atlas Isolated Tenant Cluster</div>
              </div>
              <div class="card">
                <div class="card-title">CDN &amp; Media Ingress</div>
                <div class="card-val">Cloudinary AVIF / WebP Auto-Compression</div>
              </div>
              <div class="card">
                <div class="card-title">High Availability SLA</div>
                <div class="card-val">99.99% Uptime with Zero Cold Starts</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">3. Checkout, Payments &amp; Automation</div>
            <div class="grid">
              <div class="card">
                <div class="card-title">Payment Gateways</div>
                <div class="card-val">${gatewayNames[gateway]}</div>
              </div>
              <div class="card">
                <div class="card-title">Platform GMV Commission</div>
                <div class="card-val" style="color: #059669;">0% Platform Fee (Keep 100% Margin)</div>
              </div>
              <div class="card">
                <div class="card-title">WhatsApp Commerce</div>
                <div class="card-val">Official Meta Cloud API (Cart Recovery + OTP)</div>
              </div>
              <div class="card">
                <div class="card-title">Logistics Sync</div>
                <div class="card-val">Automated Courier Dispatch &amp; Tracking API</div>
              </div>
            </div>
          </div>

          <div class="footer">
            Prepared by Mavenco Commerce Global Platform Operations • support@mavenco.com • +91 82390 19096
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
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
                { id: 'apparel', title: 'Haute Luxury & Ethnic Pret', desc: 'Banarasi sarees, bridal gowns, curated lookbooks', icon: '👗' },
                { id: 'home', title: 'Nordic Home Living & Decor', desc: 'Handmade ceramics, ambient lamps, Belgian linens', icon: '🛋️' },
                { id: 'activewear', title: 'High-Performance Activewear', desc: 'Compression wear, marathon running shoes, gear', icon: '⚡' },
                { id: 'custom', title: 'Bespoke D2C Enterprise', desc: 'Custom database schema, B2B wholesale pricing tiers', icon: '🏢' },
              ].map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setIndustry(ind.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    industry === ind.id
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-950/30'
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
              <h4 className="text-base font-bold text-white">Step 2: Choose Custom Domain Routing Strategy</h4>
              <p className="text-xs text-slate-400">All configurations include automated Let's Encrypt Wildcard SSL certificates.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: 'dual',
                  title: 'Dual Custom Apex Domains (Recommended)',
                  desc: `Public Store: ${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.com • Admin Workspace: admin.${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.com`,
                  icon: <Globe className="w-5 h-5 text-emerald-400" />,
                },
                {
                  id: 'subdomain',
                  title: 'Mavenco Managed Subdomain (Instant Zero-DNS Setup)',
                  desc: `Instant provisioned URL: ${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.mavenco.store with pre-warmed edge CDN.`,
                  icon: <Server className="w-5 h-5 text-sky-400" />,
                },
                {
                  id: 'custom_ingress',
                  title: 'Custom Enterprise Cloudflare / AWS CloudFront Ingress',
                  desc: 'Proxy traffic through your existing corporate WAF, Cloudflare Enterprise, or AWS Route53.',
                  icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
                },
              ].map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => setDomainType(dom.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    domainType === dom.id
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">{dom.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-white">{dom.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{dom.desc}</div>
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
              <h4 className="text-base font-bold text-white">Step 3: Choose Primary Payment &amp; Checkout Engine</h4>
              <p className="text-xs text-slate-400">0% platform commission on all orders. Keep 100% of your gross margins.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'razorpay', title: 'Razorpay Direct UPI & Cards', desc: 'Instant UPI, Cards, NetBanking with sub-2s checkout', icon: '⚡' },
                { id: 'stripe', title: 'Stripe Global Multi-Currency', desc: 'Accept USD, EUR, GBP, AED with Apple Pay & Google Pay', icon: '💳' },
                { id: 'cashfree', title: 'Cashfree Fast Checkout', desc: 'Instant merchant settlements & automated refund ledger', icon: '🏦' },
                { id: 'cod', title: 'Cash on Delivery with OTP', desc: 'WhatsApp 1-tap OTP verification to reduce RTO fraud by 35%', icon: '📦' },
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadRfpPdf}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>📄 Download Technical RFP Spec (PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleSendBlueprintWhatsApp}
                className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Deploy via WhatsApp (+91 82390 19096)</span>
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
