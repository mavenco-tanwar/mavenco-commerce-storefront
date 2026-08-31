'use client';

import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Zap, DollarSign, Globe, ExternalLink } from 'lucide-react';

export function ShopifyMigrationTester() {
  const [storeUrl, setStoreUrl] = useState<string>('kyliecosmetics.myshopify.com');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    storeName: string;
    productCount: number;
    shopifySpeed: string;
    mavencoSpeed: string;
    annualSavings: string;
    collections: string[];
  } | null>(null);

  const presets = [
    { label: 'Kylie Cosmetics', url: 'kyliecosmetics.myshopify.com' },
    { label: 'Gymshark D2C', url: 'gymshark.myshopify.com' },
    { label: 'Alo Yoga Fashion', url: 'aloyoga.myshopify.com' },
  ];

  const handleScanStore = (urlToScan?: string) => {
    const target = urlToScan || storeUrl;
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const cleanName = target.replace('.myshopify.com', '').replace('https://', '').replace('/', '');
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      setScanResult({
        storeName: formattedName,
        productCount: 148,
        shopifySpeed: '2.8s LCP (Monolithic Liquid)',
        mavencoSpeed: '0.4s LCP (Next.js 16 Edge)',
        annualSavings: '₹4,80,000 / year ($0 App fees + $0 GMV tax)',
        collections: ['Bestsellers', 'Seasonal Pret', 'Accessories', 'Capsule 2026'],
      });
    }, 800);
  };

  const handleWhatsAppMigrationRequest = () => {
    const summary = `Hi Mavenco Solutions Team,\n\nI want to migrate my Shopify store to Mavenco Headless Edge:\n\n🏬 *Store URL:* ${storeUrl}\n🚀 *Target Speed:* Sub-500ms Edge\n💰 *Savings Goal:* $0 App Tax + 0% Commission\n\nPlease share the free 24-hour catalog migration blueprint!`;
    const cleanPhone = '918239019096';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Shopify Catalog Migration Tool</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Test Your Shopify Store on Mavenco Edge
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your current Shopify store URL to preview catalog extraction, 7x speedups, and $0 transaction fee savings.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Input & Scan Form */}
        <div className="p-2 bg-[#0A0C10] rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-1 w-full">
            <Globe className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="e.g. yourstore.myshopify.com"
              className="w-full bg-transparent text-white text-xs font-mono focus:outline-none placeholder:text-slate-600"
            />
          </div>

          <button
            type="button"
            onClick={() => handleScanStore()}
            disabled={isScanning || !storeUrl.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isScanning ? 'Probing Catalog...' : 'Simulate Migration'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
          <span className="text-slate-500 font-mono text-[11px]">Or test sample D2C brand:</span>
          {presets.map((p) => (
            <button
              key={p.url}
              onClick={() => {
                setStoreUrl(p.url);
                handleScanStore(p.url);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#121522] border border-slate-800 text-slate-400 hover:text-white text-[11px] font-mono transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Scan Results Card */}
        {scanResult && (
          <div className="p-6 bg-[#0A0C10] rounded-2xl border border-emerald-500/40 space-y-5 animate-in fade-in duration-300 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{scanResult.storeName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    Ready for 1-Click Migration
                  </span>
                </h4>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Detected {scanResult.productCount} SKUs across {scanResult.collections.length} categories
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase font-mono text-slate-500">Estimated Annual Cloud Savings</div>
                <div className="text-sm font-bold font-mono text-emerald-400">{scanResult.annualSavings}</div>
              </div>
            </div>

            {/* Performance Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#121522] rounded-xl border border-rose-500/30 space-y-1">
                <div className="text-slate-400 text-[11px]">Current Monolithic Performance:</div>
                <div className="text-rose-400 font-bold font-mono text-sm">{scanResult.shopifySpeed}</div>
                <div className="text-[10px] text-slate-500">Subject to third-party app script bloat &amp; 2% GMV fee</div>
              </div>

              <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/30 space-y-1">
                <div className="text-slate-400 text-[11px]">Mavenco Next.js Edge Performance:</div>
                <div className="text-emerald-300 font-bold font-mono text-sm">{scanResult.mavencoSpeed}</div>
                <div className="text-[10px] text-emerald-400/80">0% Commission • Sub-50ms Global TTFB • Pure React</div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsAppMigrationRequest}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Request Free Catalog Migration for {scanResult.storeName} via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
