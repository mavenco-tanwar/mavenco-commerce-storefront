'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';

interface FlashSaleCountdownProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  targetDate?: string;
  customBtnText?: string;
  customBtnLink?: string;
  tenantSlug?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetDateStr?: string): TimeLeft {
  const target = targetDateStr
    ? new Date(targetDateStr).getTime()
    : Date.now() + 7 * 24 * 60 * 60 * 1000;

  const difference = target - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

export function FlashSaleCountdown({
  customTitle = 'Private Seasonal Flash Sale',
  customSubtitle = 'Enjoy up to 30% OFF selected archive silhouettes before release closes.',
  customBadge = 'Limited Release Urgency',
  targetDate,
  customBtnText = 'SHOP SALE NOW',
  customBtnLink = '/sale',
  tenantSlug,
}: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const timeUnits = [
    { label: 'Days', value: pad(timeLeft.days) },
    { label: 'Hours', value: pad(timeLeft.hours) },
    { label: 'Mins', value: pad(timeLeft.minutes) },
    { label: 'Secs', value: pad(timeLeft.seconds) },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-[#111319] text-white overflow-hidden select-none">
      {/* Background Ambience / Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--theme-color-accent,#B77A68)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Urgency Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Flame className="w-3.5 h-3.5 animate-pulse text-rose-500" />
          <span>{customBadge}</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
          {customTitle}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-slate-300 font-sans max-w-xl mx-auto leading-relaxed mb-10">
          {customSubtitle}
        </p>

        {/* Countdown Digits Grid */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10">
          {timeUnits.map((unit, idx) => (
            <React.Fragment key={unit.label}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {unit.value}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-slate-400 mt-2">
                  {unit.label}
                </span>
              </div>

              {idx < timeUnits.length - 1 && (
                <span className="text-xl sm:text-3xl font-bold text-white/30 -mt-6">:</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA Button */}
        <div>
          <Link href={formatTenantHref(customBtnLink, tenantSlug)}>
            <Button
              variant="luxury-gold"
              size="lg"
              className="min-w-[200px] group shadow-xl shadow-rose-950/30"
            >
              <span>{customBtnText}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
