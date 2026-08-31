'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Globe, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

interface CurrencyItem {
  symbol: string;
  rate: number;
  basePrice: number;
  label: string;
  flag: string;
}

export function CurrencyCheckoutSimulator() {
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'>('INR');
  const [currencies, setCurrencies] = useState<Record<string, CurrencyItem>>({
    INR: { symbol: '₹', rate: 1, basePrice: 4999, label: 'Indian Rupee (INR)', flag: '🇮🇳' },
    USD: { symbol: '$', rate: 0.0116, basePrice: 57.99, label: 'US Dollar (USD)', flag: '🇺🇸' },
    EUR: { symbol: '€', rate: 0.0108, basePrice: 53.99, label: 'Euro (EUR)', flag: '🇪🇺' },
    GBP: { symbol: '£', rate: 0.0092, basePrice: 45.99, label: 'British Pound (GBP)', flag: '🇬🇧' },
    AED: { symbol: 'AED ', rate: 0.0425, basePrice: 212.45, label: 'UAE Dirham (AED)', flag: '🇦🇪' },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/platform/rates')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res?.data) {
          setCurrencies(res.data);
        }
      })
      .catch((err) => console.warn('Forex fetch error:', err));
  }, []);

  const curr = currencies[selectedCurrency] || currencies.INR;

  return (
    <div className="bg-gradient-to-b from-[#121522] via-[#0E111C] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 inline-flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>Global Multi-Currency &amp; 1-Click Order Engine (Dynamic FX API)</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sell Worldwide in Any Local Currency
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Shoppers in London, Dubai, New York, and Mumbai experience real-time localized currency rates with instant VIP WhatsApp order dispatch.
        </p>
      </div>

      {/* Currency Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {(Object.keys(currencies) as (keyof typeof currencies)[]).map((code) => {
          const item = currencies[code];
          const isActive = selectedCurrency === code;
          return (
            <button
              key={code}
              onClick={() => setSelectedCurrency(code as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/50 scale-105'
                  : 'bg-[#0A0C10] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{item.flag}</span>
              <span>{code} ({item.symbol.trim()})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulated Product Checkout Card */}
      <div className="max-w-3xl mx-auto bg-[#07090F] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Left: Product Thumbnail */}
        <div className="sm:col-span-5 relative h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
            alt="Pure Mulberry Silk Banarasi Saree"
            fill
            className="object-cover"
          />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            In Stock • Express Air Ship
          </div>
        </div>

        {/* Right: Checkout Pricing & WhatsApp Trigger */}
        <div className="sm:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Couture Silk Edit</span>
            <h4 className="text-lg font-bold text-white leading-snug">
              Pure Mulberry Silk Banarasi Saree
            </h4>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {curr.symbol}{typeof curr.basePrice === 'number' ? curr.basePrice.toLocaleString() : curr.basePrice}
              </span>
              <span className="text-xs text-slate-500 line-through">
                {curr.symbol}{(curr.basePrice * 1.25).toFixed(0)}
              </span>
              <span className="text-xs text-emerald-400 font-bold font-mono">20% OFF</span>
            </div>
          </div>

          <div className="space-y-2 p-3 bg-[#111420] rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Live Dynamic FX Rate:</span>
              <span className="font-mono text-white">1 {selectedCurrency} ≈ ₹{(1 / curr.rate).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Duty &amp; Taxes:</span>
              <span className="text-emerald-400 font-medium">Pre-Calculated (DDP)</span>
            </div>
          </div>

          {/* Direct WhatsApp VIP Order Simulation Button */}
          <a
            href={`https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20to%20place%20a%20test%20order%20for%20Pure%20Mulberry%20Silk%20Banarasi%20Saree%20(${curr.symbol}${curr.basePrice}).`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Test 1-Click WhatsApp Order ({curr.symbol}{curr.basePrice})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
