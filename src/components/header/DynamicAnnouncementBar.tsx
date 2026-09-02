'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeaderBlock } from '@/lib/header-config';
import { HeaderBlockRenderer } from './HeaderBlockRenderer';

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
  rotationEnabled = false,
  rotationInterval = 5,
  pauseOnHover = true,
  tenantSlug,
  hideOnMobile = false,
  hideOnTablet = false,
  responsive,
}: DynamicAnnouncementBarProps) {
  const [isPaused, setIsPaused] = useState(false);

  const leftBlocks = blocks
    .filter((b) => b.zone === 'announcement.left' && b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const centerBlocks = blocks
    .filter((b) => b.zone === 'announcement.center' && b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const rightBlocks = blocks
    .filter((b) => b.zone === 'announcement.right' && b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [activeCenterIdx, setActiveCenterIdx] = useState(0);

  useEffect(() => {
    if (!rotationEnabled || centerBlocks.length <= 1 || (pauseOnHover && isPaused)) {
      return;
    }

    const timer = setInterval(() => {
      setActiveCenterIdx((prev) => (prev + 1) % centerBlocks.length);
    }, (rotationInterval || 5) * 1000);

    return () => clearInterval(timer);
  }, [rotationEnabled, rotationInterval, centerBlocks.length, pauseOnHover, isPaused]);

  if (blocks.length === 0) return null;

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
          {centerBlocks.map((block, idx) => {
            if (rotationEnabled && idx !== activeCenterIdx) return null;

            const s = block.settings || {};
            const text = s.text || '';
            const ctaText = s.ctaText;
            const ctaUrl = s.ctaUrl || '/sale';

            return (
              <div
                key={block.id}
                className="flex items-center justify-center gap-2 flex-wrap transition-opacity duration-300 animate-in fade-in"
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
          })}
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
