'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeaderBlock } from '@/lib/header-config';
import { HeaderBlockRenderer, getResponsiveVisibilityClass } from './HeaderBlockRenderer';

interface DynamicAnnouncementBarProps {
  blocks: HeaderBlock[];
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
    fontSize: string;
    fontFamily: string;
    letterSpacing: string;
  };
  mode?: 'static' | 'rotate' | 'marquee' | 'countdown';
  marqueeSpeed?: number;
  countdown?: {
    targetDate: string;
    label: string;
    expiredText?: string;
  };
  rotationEnabled?: boolean;
  rotationInterval?: number;
  pauseOnHover?: boolean;
  tenantSlug: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  responsive?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

export function DynamicAnnouncementBar({
  blocks = [],
  styles,
  mode = 'static',
  countdown,
  rotationEnabled = false,
  rotationInterval = 5,
  pauseOnHover = true,
  tenantSlug,
  hideOnMobile = false,
  hideOnTablet = false,
  responsive,
}: DynamicAnnouncementBarProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const isBlockVisible = (b: HeaderBlock) => {
    if (b.enabled === false) return false;
    const d = b.responsive?.desktop?.visible !== false;
    const t = b.responsive?.tablet?.visible !== false;
    const m = b.responsive?.mobile?.visible !== false;
    if (!d && !t && !m) return false;
    return true;
  };

  const leftBlocks = blocks
    .filter((b) => b.zone === 'announcement.left' && isBlockVisible(b))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const centerBlocks = blocks
    .filter((b) => b.zone === 'announcement.center' && isBlockVisible(b))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const rightBlocks = blocks
    .filter((b) => b.zone === 'announcement.right' && isBlockVisible(b))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [activeCenterIdx, setActiveCenterIdx] = useState(0);

  // Rotation Timer
  useEffect(() => {
    const isRotate = mode === 'rotate' || rotationEnabled;
    if (!isRotate || centerBlocks.length <= 1 || (pauseOnHover && isPaused)) {
      return;
    }

    const timer = setInterval(() => {
      setActiveCenterIdx((prev) => (prev + 1) % centerBlocks.length);
    }, (rotationInterval || 5) * 1000);

    return () => clearInterval(timer);
  }, [mode, rotationEnabled, rotationInterval, centerBlocks.length, pauseOnHover, isPaused]);

  // Countdown Timer
  useEffect(() => {
    if (mode !== 'countdown' || !countdown?.targetDate) return;

    const calcTime = () => {
      const target = new Date(countdown.targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [mode, countdown?.targetDate]);

  if (blocks.length === 0 && mode !== 'countdown') return null;

  // Calculate Responsive Bar Visibility
  const isDesktop = responsive?.desktop !== false;
  const isTablet = !hideOnTablet && responsive?.tablet !== false;
  const isMobile = !hideOnMobile && responsive?.mobile !== false;

  if (!isDesktop && !isTablet && !isMobile) return null;

  let responsiveClass = 'w-full text-xs py-2 px-4 border-b select-none relative z-40 transition-colors duration-300';
  if (isDesktop && isTablet && !isMobile) {
    responsiveClass += ' hidden md:block';
  } else if (isDesktop && !isTablet && !isMobile) {
    responsiveClass += ' hidden lg:block';
  } else if (!isDesktop && isTablet && !isMobile) {
    responsiveClass += ' hidden md:block lg:hidden';
  } else if (!isDesktop && !isTablet && isMobile) {
    responsiveClass += ' block md:hidden';
  } else if (!isDesktop && isTablet && isMobile) {
    responsiveClass += ' block lg:hidden';
  } else if (isDesktop && !isTablet && isMobile) {
    responsiveClass += ' block md:hidden lg:block';
  }

  // Marquee Mode Render
  if (mode === 'marquee') {
    const marqueeText = centerBlocks.map((b) => b.settings?.text).filter(Boolean).join('   ✦   ') ||
      'COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY • EXCLUSIVE ATELIER LUXURY PACKAGING • DEDICATED BESPOKE CLIENT CONCIERGE';

    return (
      <aside
        aria-label="Announcement Marquee"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`${responsiveClass} overflow-hidden whitespace-nowrap`}
        style={{
          backgroundColor: styles?.backgroundColor || '#1E1B4B',
          color: styles?.textColor || '#FFFFFF',
          borderColor: styles?.borderColor || 'rgba(255,255,255,0.1)',
          fontSize: styles?.fontSize || '11px',
          fontFamily: styles?.fontFamily,
          letterSpacing: styles?.letterSpacing || '0.08em',
        }}
      >
        <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
          <span className="px-6 font-semibold uppercase tracking-wider">{marqueeText}</span>
          <span className="px-6 font-semibold uppercase tracking-wider">{marqueeText}</span>
          <span className="px-6 font-semibold uppercase tracking-wider">{marqueeText}</span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Announcement & Utility Bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={responsiveClass}
      style={{
        backgroundColor: styles?.backgroundColor || '#1E1B4B',
        color: styles?.textColor || '#FFFFFF',
        borderColor: styles?.borderColor || 'rgba(255,255,255,0.1)',
        fontSize: styles?.fontSize || '11px',
        fontFamily: styles?.fontFamily,
        letterSpacing: styles?.letterSpacing || '0.05em',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Zone */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] shrink-0">
          {leftBlocks.map((block) => (
            <HeaderBlockRenderer
              key={block.id}
              block={block}
              tenantSlug={tenantSlug}
              accentColor={styles.accentColor}
            />
          ))}
        </div>

        {/* Center Zone */}
        <div className="flex-1 flex items-center justify-center text-center font-medium overflow-hidden px-2">
          {mode === 'countdown' ? (
            <div className="flex items-center justify-center gap-3 font-mono font-bold flex-wrap">
              <span className="font-sans font-semibold tracking-wider text-xs uppercase">
                {countdown?.label || 'LIMITED TIME FLASH SALE'}
              </span>
              {!timeLeft.isExpired ? (
                <div className="flex items-center gap-1 text-[11px] bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
                  {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span className="text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              ) : (
                <span className="text-amber-300 uppercase tracking-widest text-[11px]">
                  {countdown?.expiredText || 'EVENT CONCLUDED'}
                </span>
              )}
            </div>
          ) : (
            centerBlocks.map((block, idx) => {
              if (block.enabled === false) return null;
              const respClass = getResponsiveVisibilityClass(block.responsive);
              if (respClass === 'hidden') return null;

              const isRotate = mode === 'rotate' || rotationEnabled;
              if (isRotate && idx !== activeCenterIdx) return null;

              const s = block.settings || {};
              const text = s.text || '';
              const ctaText = s.ctaText;
              const ctaUrl = s.ctaUrl || '/sale';

              return (
                <div
                  key={block.id}
                  className={`flex items-center justify-center gap-2 flex-wrap transition-opacity duration-300 animate-in fade-in ${respClass}`}
                >
                  <span>{text}</span>
                  {ctaText && (
                    <Link
                      href={ctaUrl}
                      className="font-bold underline uppercase tracking-widest hover:opacity-80 transition-opacity ml-1"
                      style={{ color: styles?.accentColor || '#F59E0B' }}
                    >
                      {ctaText}
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Zone */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] shrink-0">
          {rightBlocks.map((block) => (
            <HeaderBlockRenderer
              key={block.id}
              block={block}
              tenantSlug={tenantSlug}
              accentColor={styles.accentColor}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
