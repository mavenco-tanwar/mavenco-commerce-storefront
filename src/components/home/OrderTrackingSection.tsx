'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, Clock, PackageCheck, Scissors, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OrderTrackingSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  showEtaCountdown?: boolean;
  showCourierDetails?: boolean;
  supportEmail?: string;
}

const TRACKING_STEPS = [
  { id: 1, title: 'Order Confirmed', detail: 'Artisanal docket initiated', icon: PackageCheck, done: true },
  { id: 2, title: 'Atelier Tailoring', detail: 'Hand-inspected & tailored', icon: Scissors, done: true },
  { id: 3, title: 'Dispatched via Express', detail: 'Bluedart Air Tracking #BD88921', icon: Truck, active: true },
  { id: 4, title: 'White Glove Delivery', detail: 'Estimated Arrival: In 2 Days', icon: CheckCircle2, done: false },
];

export function OrderTrackingSection({
  customTitle = 'Real-Time Atelier Order Tracking',
  customSubtitle = 'Follow your garment from our master cutter’s table to your doorstep with white-glove courier milestones.',
  customBadge = 'LIVE SHIPMENT TELEMETRY',
  showEtaCountdown = true,
  showCourierDetails = true,
  supportEmail = 'care@jqtrends.com',
}: OrderTrackingSectionProps) {
  const [orderQuery, setOrderQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setHasSearched(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none">
      <div className="bg-[#FAF6F2] border border-[#E8DED8] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {customBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8DED8] rounded-full shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-[#B77A68]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B77A68]">
                {customBadge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#111111]">
            {customTitle}
          </h2>
          {customSubtitle && (
            <p className="text-xs sm:text-sm text-[#777777] font-sans leading-relaxed">
              {customSubtitle}
            </p>
          )}
        </div>

        {/* Order Input Lookup */}
        <form onSubmit={handleTrack} className="max-w-xl mx-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Order # or AWB tracking code..."
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-[#E8DED8] rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] outline-hidden focus:border-[#B77A68] shadow-2xs"
          />
          <Button type="submit" variant="luxury-gold" size="md">
            Track Order
          </Button>
        </form>

        {/* Milestone Steps Timeline */}
        <div className="max-w-4xl mx-auto bg-white border border-[#E8DED8] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-[#E8DED8] gap-2">
            <div className="text-xs font-bold text-[#111111]">
              Docket Status: <span className="text-[#B77A68]">In Flight (Express Air)</span>
            </div>
            {showEtaCountdown && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F2] rounded-full text-xs font-semibold text-[#111111]">
                <Clock className="w-3.5 h-3.5 text-[#B77A68]" />
                <span>ETA: Expected in 48 Hours</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRACKING_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      step.done
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : step.active
                        ? 'bg-[#B77A68] text-white shadow-md ring-4 ring-[#B77A68]/20 animate-pulse'
                        : 'bg-[#FAF6F2] text-[#999999] border border-[#E8DED8]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-xs text-[#111111]">{step.title}</div>
                  <div className="text-[11px] text-[#777777] max-w-[140px] leading-snug">
                    {step.detail}
                  </div>
                </div>
              );
            })}
          </div>

          {showCourierDetails && (
            <div className="pt-4 border-t border-[#E8DED8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B77A68]" />
                <span>Partner: Bluedart White Glove Express (Sealed Package Security)</span>
              </div>

              <a
                href={`mailto:${supportEmail}?subject=Order%20Inquiry`}
                className="flex items-center gap-1.5 font-semibold text-[#111111] hover:text-[#B77A68] hover:underline"
              >
                <Mail className="w-3.5 h-3.5 text-[#B77A68]" />
                <span>Contact Atelier Concierge</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
