'use client';

import React, { useState } from 'react';
import { Palette, Type, Sliders, Sparkles, Check, RefreshCw, Layers } from 'lucide-react';

export function ThemeStagingStudio() {
  const [activePalette, setActivePalette] = useState<string>('crimson');
  const [activeFont, setActiveFont] = useState<string>('playfair');
  const [radius, setRadius] = useState<string>('rounded-2xl');

  const palettes = {
    crimson: { name: 'Royal Crimson & Gold', primary: '#E11D48', secondary: '#F59E0B', bg: '#0D0F18', border: '#E11D4840' },
    emerald: { name: 'Emerald Minimalist', primary: '#10B981', secondary: '#34D399', bg: '#0A120E', border: '#10B98140' },
    cyber: { name: 'Cyber Obsidian & Cyan', primary: '#06B6D4', secondary: '#3B82F6', bg: '#080E1A', border: '#06B6D440' },
    terracotta: { name: 'Warm Terracotta Sand', primary: '#F97316', secondary: '#FBBF24', bg: '#140E0A', border: '#F9731640' },
  };

  const fonts = {
    playfair: { name: 'Playfair Display (Haute Luxury)', sample: 'Timeless Artisanal Elegance' },
    jakarta: { name: 'Plus Jakarta Sans (Modern Clean)', sample: 'Engineered for Conversion' },
    syne: { name: 'Syne (Editorial Avant-Garde)', sample: 'Next-Gen Visual Distinction' },
    outfit: { name: 'Outfit (Sleek Geometric)', sample: 'Clean High-Velocity Commerce' },
  };

  const current = palettes[activePalette as keyof typeof palettes];

  return (
    <div className="bg-[#10131E] border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-rose-400" />
          <span>Real-Time Design Token Engine</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Live Theme &amp; Typography Staging Studio
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Tweak brand color palettes, luxury typography pairings, and corner radius tokens in real-time with zero cold rebuilds.
        </p>
      </div>

      {/* 2-Column Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800">
          {/* Palette Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Brand Color Harmony
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(palettes).map(([key, pal]) => (
                <button
                  key={key}
                  onClick={() => setActivePalette(key)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                    activePalette === key
                      ? 'border-white/40 bg-white/5 text-white font-bold'
                      : 'border-slate-800 bg-[#121522] text-slate-400 hover:text-white'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: pal.primary }}
                  />
                  <span className="truncate">{pal.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Editorial Typography
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(fonts).map(([key, f]) => (
                <button
                  key={key}
                  onClick={() => setActiveFont(key)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    activeFont === key
                      ? 'border-rose-500/60 bg-rose-500/10 text-white font-bold'
                      : 'border-slate-800 bg-[#121522] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{f.name}</span>
                  {activeFont === key && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Radius Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Shape &amp; Radii Architecture
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'rounded-none', label: 'Sharp 0px' },
                { id: 'rounded-2xl', label: 'Modern 16px' },
                { id: 'rounded-3xl', label: 'Pill 24px' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRadius(r.id)}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    radius === r.id
                      ? 'border-white bg-white/10 text-white'
                      : 'border-slate-800 bg-[#121522] text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Render Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Dynamic Token Preview</span>
            <span className="text-emerald-400 font-bold">Sub-1ms CSS Ingress</span>
          </div>

          {/* Live Stylized Product Card */}
          <div
            className={`p-6 border transition-all duration-300 ${radius} space-y-4`}
            style={{ backgroundColor: current.bg, borderColor: current.border }}
          >
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${current.primary}20`, color: current.primary }}
              >
                Signature Capsule
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: MVC-LUM-01</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white tracking-tight">
                {fonts[activeFont as keyof typeof fonts].sample}
              </h4>
              <p className="text-xs text-slate-300">
                Handcrafted luxury piece rendered dynamically with active merchant tokens.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <div>
                <div className="text-2xl font-black text-white font-mono">₹2,999</div>
                <div className="text-[10px] text-emerald-400 font-mono">0% Platform Fee</div>
              </div>

              <button
                type="button"
                className={`px-5 py-2.5 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 ${radius}`}
                style={{ backgroundColor: current.primary }}
              >
                Add to Bag
              </button>
            </div>
          </div>

          {/* Injected CSS Variables Output */}
          <div className="p-3 bg-[#121522] rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-slate-500 uppercase text-[9px] font-bold">Injected CSS Custom Properties</div>
            <div className="text-rose-300">--brand-primary: {current.primary};</div>
            <div className="text-amber-300">--font-family: &apos;{activeFont}&apos;;</div>
            <div className="text-cyan-300">--card-border-radius: {radius === 'rounded-none' ? '0px' : radius === 'rounded-2xl' ? '16px' : '24px'};</div>
          </div>
        </div>
      </div>
    </div>
  );
}
