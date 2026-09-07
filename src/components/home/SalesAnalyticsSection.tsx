'use client';

import React from 'react';
import { BarChart2, TrendingUp, Users, Award, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface SalesAnalyticsSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  showRevenue?: boolean;
  showConversionFunnel?: boolean;
  showTopProducts?: boolean;
  dateRange?: string;
}

export function SalesAnalyticsSection({
  customTitle = 'Boutique Trust & Atelier Metrics',
  customSubtitle = 'Real-time verified client satisfaction, artisan craftsmanship stats, and ethical fulfillment indicators.',
  customBadge = 'VERIFIED PERFORMANCE',
}: SalesAnalyticsSectionProps) {
  const metrics = [
    {
      label: 'Verified Client Satisfaction',
      value: '99.4%',
      detail: 'Based on 50,000+ post-purchase reviews',
      icon: Award,
    },
    {
      label: 'Atelier Orders Dispatched',
      value: '52,400+',
      detail: 'Across India & international destinations',
      icon: Users,
    },
    {
      label: 'White Glove Transit Rate',
      value: '98.8%',
      detail: 'On-time delivery via dedicated couriers',
      icon: Truck,
    },
    {
      label: 'Sustainable Handcrafting',
      value: '100%',
      detail: 'Zero microplastic linings & ethical dyes',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-lg space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full">
              <BarChart2 className="w-3.5 h-3.5 text-[#E8B8B5]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B8B5]">
                {customBadge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#FFFDFC]">
            {customTitle}
          </h2>
          {customSubtitle && (
            <p className="text-xs sm:text-sm text-[#E8DED8] font-sans leading-relaxed">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 backdrop-blur-xs hover:border-[#E8B8B5]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E8B8B5]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFDFC]">
                    {m.value}
                  </div>
                  <div className="text-xs font-semibold text-[#E8B8B5]">{m.label}</div>
                  <div className="text-[11px] text-[#AFA5A0] leading-snug">{m.detail}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="text-center pt-4 border-t border-white/10 text-[11px] text-[#AFA5A0] flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B8B5]" />
          <span>Audited quarterly by international boutique luxury compliance standards.</span>
        </div>
      </div>
    </section>
  );
}
