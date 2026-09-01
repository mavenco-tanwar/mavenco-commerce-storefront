'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Store,
  Check,
  Palette,
  Layers,
  ShoppingBag,
  Wand2,
  Zap,
  CheckCircle2,
  RefreshCw,
  Copy,
} from 'lucide-react';

interface AiConceptPreset {
  label: string;
  brand: string;
  category: 'apparel' | 'decor' | 'athletics' | 'beauty';
  palette: 'rose' | 'forest' | 'carbon' | 'royal';
  headline: string;
  subtext: string;
  sampleItems: string[];
}

export function InstantStoreBuilder() {
  const [brandName, setBrandName] = useState('Vedic Luxe');
  const [category, setCategory] = useState<'apparel' | 'decor' | 'athletics' | 'beauty'>('apparel');
  const [palette, setPalette] = useState<'rose' | 'forest' | 'carbon' | 'royal'>('rose');
  const [headline, setHeadline] = useState('Crafted for Distinction & Elegance');
  const [subtext, setSubtext] = useState('0% transaction fees, sub-40ms edge performance, and visual drag-and-drop lookbooks.');
  const [sampleItems, setSampleItems] = useState<string[]>(['Banarasi Silk Saree', 'Zari Embroidered Kurta', 'Velvet Evening Dupatta']);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [copiedConfig, setCopiedConfig] = useState(false);

  const categories = [
    { id: 'apparel', label: 'Luxury Apparel & Pret', icon: ShoppingBag, desc: 'Banarasi silks, couture gowns, and seasonal lookbooks.' },
    { id: 'decor', label: 'Artisanal Home & Decor', icon: Store, desc: 'Fluted ceramics, ambient lamps, and Belgian linens.' },
    { id: 'athletics', label: 'High-Performance Activewear', icon: Sparkles, desc: 'Seamless compression, marathon carbon shoes, and gear.' },
    { id: 'beauty', label: 'Organic Skincare & Botanicals', icon: Layers, desc: 'Cold-pressed serums, ayurvedic oils, and luxury packaging.' },
  ];

  const palettes = [
    { id: 'rose', name: 'Haute Blush', primary: '#E11D48', accent: '#FB7185', bg: '#1A0812', text: '#FFFFFF', subtle: '#F9A8D4' },
    { id: 'forest', name: 'Nordic Forest', primary: '#22C55E', accent: '#86EFAC', bg: '#052E16', text: '#FFFFFF', subtle: '#BBF7D0' },
    { id: 'carbon', name: 'Apex Carbon', primary: '#00F5D4', accent: '#38BDF8', bg: '#0D1117', text: '#FFFFFF', subtle: '#94A3B8' },
    { id: 'royal', name: 'Imperial Indigo', primary: '#818CF8', accent: '#C7D2FE', bg: '#0F0C29', text: '#FFFFFF', subtle: '#C4B5FD' },
  ];

  const aiPresets: AiConceptPreset[] = [
    {
      label: 'Parisian Silk Couture',
      brand: 'Maison Étoile',
      category: 'apparel',
      palette: 'rose',
      headline: 'Atelier Silks & Haute Pret Couture',
      subtext: 'Bespoke handwoven silks and runway eveningwear crafted for modern icons.',
      sampleItems: ['Silk Organza Corset Gown', 'Handwoven Brocade Blazer', 'Pleated Crepe Jumpsuit'],
    },
    {
      label: 'Kyoto Artisanal Ceramics',
      brand: 'Komorebi Studio',
      category: 'decor',
      palette: 'forest',
      headline: 'Mindful Ceramic & Living Spaces',
      subtext: 'Fluted pottery, Japanese cedar lighting, and Belgian washed linen accents.',
      sampleItems: ['Wabi-Sabi Fluted Vase', 'Hana Teak Table Lamp', 'Kyoto Clay Matcha Bowl'],
    },
    {
      label: 'Pro Marathon Athletics',
      brand: 'Apex Velocity',
      category: 'athletics',
      palette: 'carbon',
      headline: 'Aerodynamic Performance Engineering',
      subtext: 'Sub-180g carbon marathon runners and thermal moisture-regulating gear.',
      sampleItems: ['Carbon Plate Marathon Speed', 'Seamless Compression Singlet', 'Ultralight Hydration Pack'],
    },
    {
      label: 'Ayurvedic Botanical Alchemy',
      brand: 'Veda Botanica',
      category: 'beauty',
      palette: 'royal',
      headline: 'Ancient Botanicals, Modern Purity',
      subtext: 'Cold-pressed kumkumadi serums, saffron elixirs, and clean herbal rituals.',
      sampleItems: ['24k Gold Kumkumadi Oil', 'Saffron Radiance Nectar', 'Kansa Wand Massage Elixir'],
    },
  ];

  const applyAiPreset = (preset: AiConceptPreset) => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setBrandName(preset.brand);
      setCategory(preset.category);
      setPalette(preset.palette);
      setHeadline(preset.headline);
      setSubtext(preset.subtext);
      setSampleItems(preset.sampleItems);
      setIsAiGenerating(false);
    }, 300);
  };

  const handleCustomAiPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptToUse = aiPrompt.trim() || 'Minimalist Japanese ceramics and organic green tea brand based in Kyoto';
    setIsAiGenerating(true);

    setTimeout(() => {
      const lower = promptToUse.toLowerCase();
      let matchedCategory: 'apparel' | 'decor' | 'athletics' | 'beauty' = 'apparel';
      let matchedPalette: 'rose' | 'forest' | 'carbon' | 'royal' = 'rose';
      let genBrand = 'Aura Concept';
      let genHeadline = 'Crafted for Modern Distinctions';
      let genSubtext = 'Sub-40ms Edge delivery, zero transaction fee architecture, and visual lookbooks.';
      let genItems = ['Signature Drop 01', 'Limited Edition Release', 'Private Reserve Capsule'];

      if (
        lower.includes('home') ||
        lower.includes('decor') ||
        lower.includes('furniture') ||
        lower.includes('ceramic') ||
        lower.includes('coffee') ||
        lower.includes('tea') ||
        lower.includes('pottery') ||
        lower.includes('kyoto') ||
        lower.includes('japanese')
      ) {
        matchedCategory = 'decor';
        matchedPalette = 'forest';
        genBrand = lower.includes('kyoto') || lower.includes('tea') ? 'Komorebi Tea & Clay' : 'Aura Craft Living';
        genHeadline = 'Mindful Organic Pottery & Living Spaces';
        genSubtext = 'Wabi-sabi aesthetics, handmade stoneware matcha bowls, and organic Kyoto harvests.';
        genItems = ['Kyoto Clay Matcha Bowl', 'Wabi-Sabi Fluted Vase', 'Hana Teak Table Lamp'];
      } else if (
        lower.includes('sport') ||
        lower.includes('gym') ||
        lower.includes('run') ||
        lower.includes('fit') ||
        lower.includes('shoe') ||
        lower.includes('active') ||
        lower.includes('marathon') ||
        lower.includes('sneaker')
      ) {
        matchedCategory = 'athletics';
        matchedPalette = 'carbon';
        genBrand = 'Apex Velocity';
        genHeadline = 'Aerodynamic Performance Engineering';
        genSubtext = 'Sub-180g carbon marathon runners and thermal moisture-regulating gear.';
        genItems = ['Carbon Plate Marathon Speed', 'Seamless Compression Singlet', 'Ultralight Hydration Pack'];
      } else if (
        lower.includes('skin') ||
        lower.includes('beauty') ||
        lower.includes('oil') ||
        lower.includes('cream') ||
        lower.includes('herbal') ||
        lower.includes('hair') ||
        lower.includes('ayurved') ||
        lower.includes('serum')
      ) {
        matchedCategory = 'beauty';
        matchedPalette = 'royal';
        genBrand = 'Veda Botanica';
        genHeadline = 'Ancient Botanicals, Modern Purity';
        genSubtext = 'Cold-pressed kumkumadi serums, saffron elixirs, and clean herbal rituals.';
        genItems = ['24k Gold Kumkumadi Oil', 'Saffron Radiance Nectar', 'Kansa Wand Massage Elixir'];
      } else if (
        lower.includes('silk') ||
        lower.includes('couture') ||
        lower.includes('saree') ||
        lower.includes('gown') ||
        lower.includes('paris') ||
        lower.includes('pret') ||
        lower.includes('fashion') ||
        lower.includes('dress')
      ) {
        matchedCategory = 'apparel';
        matchedPalette = 'rose';
        genBrand = 'Maison Étoile';
        genHeadline = 'Atelier Silks & Haute Pret Couture';
        genSubtext = 'Bespoke handwoven silks and runway eveningwear crafted for modern icons.';
        genItems = ['Silk Organza Corset Gown', 'Handwoven Brocade Blazer', 'Pleated Crepe Jumpsuit'];
      } else {
        const words = promptToUse.split(' ').filter((w) => w.length > 2);
        const namePart = words.slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        genBrand = namePart ? `${namePart} Atelier` : 'Luxe Concept Pret';
        genHeadline = `Artisanal Distinction for ${genBrand}`;
        genSubtext = 'Custom headless storefront rendered with sub-40ms Edge speed and isolated DB.';
        genItems = [`${genBrand} Signature Capsule`, 'Atelier Heritage Edition', 'Seasonal Lookbook Drop'];
      }

      setBrandName(genBrand);
      setCategory(matchedCategory);
      setPalette(matchedPalette);
      setHeadline(genHeadline);
      setSubtext(genSubtext);
      setSampleItems(genItems);
      setIsAiGenerating(false);
      setAiPrompt('');
    }, 450);
  };

  const selectedPaletteObj = palettes.find((p) => p.id === palette) || palettes[0];

  const handleCopyConfig = () => {
    const config = {
      tenantSlug: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      brandName,
      category,
      theme: {
        paletteId: palette,
        primary: selectedPaletteObj.primary,
        accent: selectedPaletteObj.accent,
        bg: selectedPaletteObj.bg,
      },
      headline,
      subtext,
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="bg-gradient-to-b from-[#121522] via-[#0E111C] to-[#0A0C12] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-rose-400" />
          <span>AI-Powered 60-Second Instant Store Builder</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Generate &amp; Preview Your Custom D2C Storefront
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Describe your dream brand concept or click an AI template to watch our Edge engine configure dynamic tokens and lookbooks in real time.
        </p>
      </div>

      {/* AI Concept Prompt Bar */}
      <div className="max-w-4xl mx-auto space-y-3">
        <form onSubmit={handleCustomAiPrompt} className="flex flex-col sm:flex-row items-center gap-2 bg-[#06080E] p-2 rounded-2xl border border-slate-800 focus-within:border-rose-500/60 shadow-xl">
          <div className="flex items-center gap-2 px-3 py-1 text-slate-400 flex-1 w-full min-w-0">
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Minimalist Japanese ceramics and organic green tea brand based in Kyoto"
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none font-sans"
            />
          </div>
          <button
            type="submit"
            onClick={(e) => handleCustomAiPrompt(e)}
            disabled={isAiGenerating}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isAiGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </form>

        {/* Quick AI Presets Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="text-[11px] text-slate-500 font-medium">Try AI Concept:</span>
          {aiPresets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyAiPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-[#0E111A] hover:bg-[#151926] border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-white transition-all text-[11px] flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Configurator (6 cols) */}
        <div className="lg:col-span-6 space-y-5 bg-[#0A0C10] p-6 rounded-2xl border border-slate-800 shadow-xl">
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

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyConfig}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedConfig ? 'Copied JSON Config!' : 'Copy Provisioning Config'}</span>
            </button>
          </div>
        </div>

        {/* Right Live Reactive Store Mockup (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A0C10] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>store.{brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.com</span>
              </span>
              <span className="text-emerald-400 font-bold">24ms Edge Ready</span>
            </div>

            {/* Generated Mockup Hero Card */}
            <div
              className="p-6 rounded-2xl border transition-all duration-300 space-y-4"
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

              <div className="space-y-2 py-2 text-center">
                <h4 className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ color: selectedPaletteObj.text }}>
                  {headline}
                </h4>
                <p className="text-xs max-w-sm mx-auto font-sans leading-relaxed" style={{ color: selectedPaletteObj.subtle }}>
                  {subtext}
                </p>
              </div>

              {/* Sample Product Pills */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-slate-400 text-center tracking-wider">
                  Live Catalog Preview
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  {sampleItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-white/10 bg-black/20 text-slate-200 truncate font-sans"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
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

            {/* Direct Provisioning Action */}
            <div className="p-3 bg-[#121522] rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ready to deploy on custom domain?</span>
              <a
                href={`https://wa.me/918239019096?text=Hi%20Mavenco%20Team%2C%20I%20would%20like%20to%20provision%20a%20store%20for%20${encodeURIComponent(brandName)}%20(${category}).`}
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
