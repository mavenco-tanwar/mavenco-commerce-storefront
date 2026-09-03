'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewsletterSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  customCouponPromo?: string;
  customButtonText?: string;
}

export function NewsletterSection({
  customTitle,
  customSubtitle,
  customBadge,
  customCouponPromo,
  customButtonText = 'Subscribe',
}: NewsletterSectionProps = {}) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const title = customTitle || 'Stay In Style';
  const subtitle =
    customSubtitle ||
    'Get first access to new collections, exclusive seasonal offers, and direct styling inspiration delivered to your inbox.';
  const badge = customBadge || 'VIP Insider Club';
  const coupon = customCouponPromo || 'WELCOME10';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-20 md:py-28 bg-[#F8F1EA] border-t border-[#E8DED8] relative overflow-hidden select-none">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#E8B8B5]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#CF9584]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFFDFC] border border-[#E8DED8] shadow-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#B77A68]" />
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#111111]">
            {badge}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-3">
          {title}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#777777] max-w-lg mx-auto font-sans leading-relaxed mb-8">
          {subtitle}
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto p-6 bg-[#FFFDFC] border border-[#B77A68] shadow-lg animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-8 h-8 text-[#B77A68] mx-auto mb-2" />
            <h4 className="text-base font-serif font-bold text-[#111111]">
              Welcome to the VIP Family!
            </h4>
            <p className="text-xs text-[#777777] mt-1 font-sans">
              Use code <strong className="text-[#B77A68] font-bold">{coupon}</strong> for special savings on your upcoming purchase.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-[#FFFDFC] border border-[#E8DED8] text-xs md:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#B77A68] rounded-none font-sans"
              />
            </div>
            <Button
              type="submit"
              variant="luxury-gold"
              size="lg"
              className="sm:w-auto min-w-[140px]"
            >
              <span>{customButtonText}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}

        <p className="text-[11px] text-[#999999] mt-4">
          We respect your privacy. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
}
