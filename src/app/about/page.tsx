import React from 'react';
import Link from 'next/link';
import { Sparkles, Quote, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { getDatabase } from '@/lib/mongodb';
import { PlatformNavbar } from '@/components/layout/PlatformNavbar';
import { PlatformFooter } from '@/components/layout/PlatformFooter';

export const revalidate = 0; // Dynamic on request

async function getAboutPageConfig() {
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        type: 'about-page',
      });
      if (doc?.config) {
        return doc.config;
      }
    }
  } catch (err) {
    console.error('Failed to load about page from MongoDB:', err);
  }

  // Fallback defaults
  return {
    heroBadge: 'SINCE 2018 • ATELIER HERITAGE',
    heroHeadline: 'Crafting Timeless Elegance Through Pure Artisanry',
    heroSubtext: 'Every weave and silhouette tells a story of generation-old handloom heritage blended with contemporary haute couture.',
    heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
    founderName: 'Ananya Singhania',
    founderRole: 'Founder & Creative Director',
    founderQuote: 'We believe luxury lies in patience, handspun threads, and empowering rural master weavers with 100% fair-wage commerce.',
    founderImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop',
    pillars: [
      { title: '100% Handloom Certified', desc: 'Handcrafted on authentic wooden pit looms without synthetic blends.' },
      { title: 'Zero Compromise Purity', desc: 'Pure mulberry silks, certified organic cottons, and genuine gold zari.' },
      { title: 'Fair-Trade Artisans', desc: 'Direct partnership with over 450+ master weaver families across India.' },
      { title: 'Conscious Luxury', desc: 'Plastic-free biodegradable packaging and carbon-neutral deliveries.' },
    ],
    showPressLogos: true,
  };
}

export default async function AboutPage() {
  const config = await getAboutPageConfig();

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <PlatformNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 w-full">
        {/* Atelier Hero */}
        <section className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center justify-center p-8 sm:p-14 border border-rose-500/20 shadow-2xl">
          <img
            src={config.heroImage}
            alt="Atelier Heritage"
            className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-transparent" />

          <div className="relative text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              {config.heroBadge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
              {config.heroHeadline}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {config.heroSubtext}
            </p>
          </div>
        </section>

        {/* Founder Vision Statement */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121522] to-[#170E1A] border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <img
              src={config.founderImage}
              alt={config.founderName}
              className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-rose-500/40 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-rose-600 text-white shadow-lg">
              <Quote className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <p className="text-lg sm:text-2xl font-serif italic text-slate-100 leading-relaxed">
              "{config.founderQuote}"
            </p>
            <div>
              <div className="font-bold text-white text-base">{config.founderName}</div>
              <div className="text-xs text-rose-400 font-semibold tracking-wider uppercase">
                {config.founderRole}
              </div>
            </div>
          </div>
        </section>

        {/* 4 Craftsmanship & Sustainability Pillars */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Our Core Principles</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">The Artisan Standard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.pillars.map((pillar: any, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0E111C] border border-slate-800/90 hover:border-rose-500/40 transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-rose-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#1A0E1C] to-amber-950/50 border border-rose-500/30 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">Explore The Haute Collection</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Experience the craftsmanship in our signature sarees, dupattas, and pret silhouettes.
          </p>
          <div className="pt-2">
            <Link
              href="/women"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-xl transition-transform hover:scale-105"
            >
              <span>Shop Handcrafted Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <PlatformFooter />
    </div>
  );
}
