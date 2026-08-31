'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Store, Check, Palette, Layers, ShoppingBag } from 'lucide-react';

export function InstantStoreBuilder() {
  const [brandName, setBrandName] = useState('Vedic Luxe');
  const [category, setCategory] = useState<'apparel' | 'decor' | 'athletics' | 'beauty'>('apparel');
  const [palette, setPalette] = useState<'rose' | 'forest' | 'carbon' | 'royal'>('rose');
  const [isGenerated, setIsGenerated] = useState(false);

  const categories = [
    { id: 'apparel', label: 'Luxury Apparel & Pret', icon: ShoppingBag, desc: 'Banarasi silks, couture gowns, and seasonal lookbooks.' },
    { id: 'decor', label: 'Artisanal Home & Decor', icon: Store, desc: 'Fluted ceramics, ambient lamps, and Belgian linens.' },
    { id: 'athletics', label: 'High-Performance Activewear', icon: Sparkles, desc: 'Seamless compression, marathon carbon shoes, and gear.' },
    { id: 'beauty', label: 'Organic Skincare & Botanicals', icon: Layers, desc: 'Cold-pressed serums, ayurvedic oils, and luxury packaging.' },
  ];

  const palettes = [
    { id: 'rose',   name: 'Haute Blush',     primary: '#E11D48', accent: '#FB7185', bg: '#1A0812', text: '#FFFFFF', subtle: '#F9A8D4' },
    { id: 'forest', name: 'Nordic Forest',   primary: '#22C55E', accent: '#86EFAC', bg: '#052E16', text: '#FFFFFF', subtle: '#BBF7D0' },
    { id: 'carbon', name: 'Apex Carbon',     primary: '#00F5D4', accent: '#38BDF8', bg: '#0D1117', text: '#FFFFFF', subtle: '#94A3B8' },
    { id: 'royal',  name: 'Imperial Indigo', primary: '#818CF8', accent: '#C7D2FE', bg: '#0F0C29', text: '#FFFFFF', subtle: '#C4B5FD' },
  ];

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const selectedPaletteObj = palettes.find((p) => p.id === palette) || palettes[0];

  return (
    <div className="bg-gradient-to-b from-[#121522] via-[#0E111C] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>60-Second Instant Store Builder</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Preview Your Custom D2C Storefront
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure your brand identity in 3 clicks and watch our Edge engine generate a real-time responsive mockup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Configurator (6 cols) */}
        <form onSubmit={handleBuild} className="lg:col-span-6 space-y-5 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Brand Name
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Samyukta Couture"
              className="w-full px-3.5 py-2.5 bg-[#141724] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Select Product Industry
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as any)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                    category === c.id
                      ? 'bg-rose-500/15 border-rose-500 text-white font-bold shadow-md'
                      : 'bg-[#121522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <c.icon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-xs">{c.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal line-clamp-1">{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              3. Select Brand Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id as any)}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all space-y-1.5 ${
                    palette === p.id
                      ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                      : 'bg-[#121522] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: p.primary }} />
                    <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: p.accent }} />
                  </div>
                  <div className="text-[11px] text-white">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Update Instant Live Mockup</span>
          </button>
        </form>

        {/* Right Live Reactive Store Mockup (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A0C10] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>store.{brandName.toLowerCase().replace(/\s+/g, '')}.com</span>
              </span>
              <span className="text-emerald-400 font-bold">24ms Edge Ready</span>
            </div>

            {/* Generated Mockup Hero Card */}
            <div
              className="p-6 rounded-2xl border transition-all duration-300 space-y-5"
              style={{
                backgroundColor: selectedPaletteObj.bg,
                borderColor: `${selectedPaletteObj.primary}55`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base tracking-tight" style={{ color: selectedPaletteObj.primary }}>
                  {brandName || 'Your Brand'}
                </span>
                <span
                  className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${selectedPaletteObj.primary}22`, color: selectedPaletteObj.subtle }}
                >
                  {categories.find((c) => c.id === category)?.label}
                </span>
              </div>

              <div className="space-y-2 py-3 text-center">
                <h4 className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ color: selectedPaletteObj.text }}>
                  Crafted for Distinction &amp; Elegance
                </h4>
                <p className="text-xs max-w-sm mx-auto" style={{ color: selectedPaletteObj.subtle }}>
                  0% transaction fees, sub-40ms edge performance, and visual drag-and-drop lookbooks.
                </p>
              </div>

              <div className="pt-1 flex items-center justify-center gap-3">
                <Link
                  href="/stores/demo"
                  className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: selectedPaletteObj.primary,
                    color: '#FFFFFF',
                  }}
                >
                  Explore Live Demo Drop →
                </Link>
              </div>
            </div>

            <div className="p-3 bg-[#121522] rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ready to deploy on custom domain?</span>
              <a
                href={`https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20to%20provision%20a%20store%20for%20${encodeURIComponent(brandName)}.`}
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Provision in 48h</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
