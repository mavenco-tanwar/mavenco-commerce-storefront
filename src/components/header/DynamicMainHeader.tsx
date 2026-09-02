'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { HeaderBlock, NavigationItem } from '@/lib/header-config';
import { HeaderBlockRenderer } from './HeaderBlockRenderer';

interface DynamicMainHeaderProps {
  blocks: HeaderBlock[];
  styles: {
    backgroundColor: string;
    textColor: string;
    hoverColor: string;
    accentColor: string;
    borderColor: string;
    borderBottomWidth: string;
    shadow: string;
    fontFamily: string;
  };
  navigationMenu: NavigationItem[];
  tenantSlug: string;
  isScrolled?: boolean;
  onOpenMobileDrawer?: () => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
  containerWidth?: 'full' | 'contained' | 'custom';
  maxWidth?: number;
  height?: number;
  scrolledHeight?: number;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  responsive?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

export function DynamicMainHeader({
  blocks = [],
  styles,
  navigationMenu = [],
  tenantSlug,
  isScrolled = false,
  onOpenMobileDrawer,
  onOpenSearch,
  onOpenCart,
  containerWidth = 'contained',
  maxWidth = 1400,
  height = 80,
  scrolledHeight = 68,
  hideOnMobile = false,
  hideOnTablet = false,
  responsive,
}: DynamicMainHeaderProps) {
  const leftBlocks = blocks
    .filter((b) => b.zone === 'main.left' && b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const centerBlocks = blocks
    .filter((b) => b.zone === 'main.center' && b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const rightBlocks = blocks
    .filter((b) => b.zone === 'main.right' && b.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const currentHeight = isScrolled ? scrolledHeight : height;

  // Calculate Responsive Main Header Visibility
  const isDesktop = responsive?.desktop !== false;
  const isTablet = !hideOnTablet && responsive?.tablet !== false;
  const isMobile = !hideOnMobile && responsive?.mobile !== false;

  if (!isDesktop && !isTablet && !isMobile) return null;

  let responsiveHeaderClass = 'w-full border-b transition-all duration-300 relative z-30';
  if (isDesktop && isTablet && !isMobile) {
    responsiveHeaderClass += ' hidden md:block';
  } else if (isDesktop && !isTablet && !isMobile) {
    responsiveHeaderClass += ' hidden lg:block';
  } else if (!isDesktop && isTablet && !isMobile) {
    responsiveHeaderClass += ' hidden md:block lg:hidden';
  } else if (!isDesktop && !isTablet && isMobile) {
    responsiveHeaderClass += ' block md:hidden';
  } else if (!isDesktop && isTablet && isMobile) {
    responsiveHeaderClass += ' block lg:hidden';
  } else if (isDesktop && !isTablet && isMobile) {
    responsiveHeaderClass += ' block md:hidden lg:block';
  }

  const containerClasses =
    containerWidth === 'full'
      ? 'w-full px-4 sm:px-6 lg:px-10'
      : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <div
      role="banner"
      className={responsiveHeaderClass}
      style={{
        backgroundColor: styles?.backgroundColor || '#FFFDFC',
        color: styles?.textColor || '#111111',
        borderColor: styles?.borderColor || '#E8DED8',
        borderBottomWidth: styles?.borderBottomWidth || '1px',
        fontFamily: styles?.fontFamily,
      }}
    >
      <div className={containerClasses}>
        <div
          className="flex items-center justify-between gap-4 transition-all duration-300"
          style={{ height: `${currentHeight}px` }}
        >
          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center shrink-0">
            <button
              type="button"
              onClick={onOpenMobileDrawer}
              aria-label="Open mobile menu"
              className="p-2 -ml-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Left Zone (Logo / Brand) */}
          <div className="flex items-center gap-6 shrink-0">
            {leftBlocks.map((block) => (
              <HeaderBlockRenderer
                key={block.id}
                block={block}
                tenantSlug={tenantSlug}
                navigationMenu={navigationMenu}
                accentColor={styles.accentColor}
                isScrolled={isScrolled}
                onOpenSearch={onOpenSearch}
                onOpenCart={onOpenCart}
              />
            ))}
          </div>

          {/* Center Zone (Navigation) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            {centerBlocks.map((block) => (
              <HeaderBlockRenderer
                key={block.id}
                block={block}
                tenantSlug={tenantSlug}
                navigationMenu={navigationMenu}
                accentColor={styles.accentColor}
                isScrolled={isScrolled}
                onOpenSearch={onOpenSearch}
                onOpenCart={onOpenCart}
              />
            ))}
          </div>

          {/* Right Zone (Search, Wishlist, Cart, Account, Currency, CTAs) */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {rightBlocks.map((block) => (
              <HeaderBlockRenderer
                key={block.id}
                block={block}
                tenantSlug={tenantSlug}
                navigationMenu={navigationMenu}
                accentColor={styles.accentColor}
                isScrolled={isScrolled}
                onOpenSearch={onOpenSearch}
                onOpenCart={onOpenCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
