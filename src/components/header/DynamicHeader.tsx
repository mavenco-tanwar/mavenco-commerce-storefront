'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { resolveTenant, resolveActiveTenantSlug } from '@/lib/tenant-config';
import { HeaderConfig, getDefaultHeaderConfig } from '@/lib/header-config';
import { DynamicAnnouncementBar } from './DynamicAnnouncementBar';
import { DynamicMainHeader } from './DynamicMainHeader';
import { DynamicMobileDrawer } from './DynamicMobileDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { useCart } from '@/context/CartContext';

interface DynamicHeaderProps {
  initialConfig?: HeaderConfig | null;
  tenantSlug?: string;
}

export function DynamicHeader({ initialConfig, tenantSlug: propTenantSlug }: DynamicHeaderProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  // Determine active tenant deterministically on SSR and client
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);

  const [config, setConfig] = useState<HeaderConfig>(
    initialConfig || getDefaultHeaderConfig(activeTenantSlug)
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDrawerOpen: isCartOpen, closeDrawer: closeCartDrawer } = useCart();

  // Fetch live Header configuration from MongoDB Atlas API
  const fetchHeader = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/content/header?tenant=${encodeURIComponent(activeTenantSlug)}&_t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          const raw = json.data;
          const base = getDefaultHeaderConfig(activeTenantSlug);
          setConfig({
            ...base,
            ...raw,
            announcementBar: {
              ...base.announcementBar,
              ...(raw.announcementBar || {}),
              styles: {
                ...base.announcementBar.styles,
                ...(raw.announcementBar?.styles || {}),
              },
              blocks: Array.isArray(raw.announcementBar?.blocks)
                ? raw.announcementBar.blocks
                : base.announcementBar.blocks,
            },
            mainHeader: {
              ...base.mainHeader,
              ...(raw.mainHeader || {}),
              styles: {
                ...base.mainHeader.styles,
                ...(raw.mainHeader?.styles || {}),
              },
              blocks: Array.isArray(raw.mainHeader?.blocks)
                ? raw.mainHeader.blocks
                : base.mainHeader.blocks,
            },
            navigationMenu: Array.isArray(raw.navigationMenu)
              ? raw.navigationMenu
              : base.navigationMenu,
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch header:', err);
    }
  }, [activeTenantSlug]);

  useEffect(() => {
    fetchHeader();
  }, [fetchHeader, pathname, searchParams]);

  // Live broadcast listener from Admin Visual Theme Studio preview / publish
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'HEADER_UPDATED' ||
        event.data?.type === 'MAVENCO_HEADER_PREVIEW' ||
        event.data?.type === 'MAVENCO_THEME_PREVIEW' ||
        event.data?.type === 'NAVIGATION_UPDATED' ||
        event.data?.type === 'MENU_UPDATED' ||
        event.data?.type === 'CMS_MENU_UPDATED'
      ) {
        if (event.data?.headerConfig) {
          setConfig(event.data.headerConfig);
        } else {
          fetchHeader();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_header_updated' ||
        event.key === 'jq_navigation_updated' ||
        event.key === 'jq_menu_updated' ||
        event.key === 'jq_active_tenant'
      ) {
        fetchHeader();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchHeader]);

  // Sticky Scroll listener
  useEffect(() => {
    if (!config.sticky?.enabled) return;

    const threshold = config.sticky.thresholdPx || 30;
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [config.sticky]);

  // Generate dynamic CSS variables scoped to Header & Navigation
  const headerCssVariables = useMemo(() => {
    const annStyles = config.announcementBar?.styles || ({} as any);
    const mainStyles = config.mainHeader?.styles || ({} as any);
    const stickyStyles = config.sticky || ({} as any);
    const drawerStyles = config.mobile?.drawer || ({} as any);

    return `
      :root {
        --header-announcement-bg: ${annStyles.backgroundColor || '#1E1B4B'};
        --header-announcement-text: ${annStyles.textColor || '#FFFFFF'};
        --header-announcement-accent: ${annStyles.accentColor || '#F59E0B'};
        --header-announcement-border: ${annStyles.borderColor || 'rgba(255,255,255,0.1)'};
        --header-announcement-font-size: ${annStyles.fontSize || '11px'};
        --header-announcement-font-family: ${annStyles.fontFamily || 'inherit'};
        --header-announcement-letter-spacing: ${annStyles.letterSpacing || '0.05em'};

        --header-main-bg: ${mainStyles.backgroundColor || '#FFFDFC'};
        --header-main-text: ${mainStyles.textColor || '#111111'};
        --header-main-hover: ${mainStyles.hoverColor || '#E11D48'};
        --header-main-accent: ${mainStyles.accentColor || '#E11D48'};
        --header-main-border: ${mainStyles.borderColor || '#E8DED8'};
        --header-main-border-width: ${mainStyles.borderBottomWidth || '1px'};
        --header-main-font-family: ${mainStyles.fontFamily || 'inherit'};
        --header-main-height: ${config.mainHeader?.height || 80}px;
        --header-sticky-bg: ${stickyStyles.stickyBg || 'rgba(255,253,252,0.95)'};
        --header-sticky-text: ${stickyStyles.stickyTextColor || '#111111'};
        --header-sticky-height: ${stickyStyles.scrolledHeight || 68}px;

        --header-drawer-bg: ${drawerStyles.background || '#FFFDFC'};
        --header-drawer-text: ${drawerStyles.textColor || '#111111'};
        --header-drawer-accent: ${drawerStyles.accentColor || '#E11D48'};
      }
    `.trim();
  }, [config]);

  const isSticky = config.sticky?.enabled !== false;
  const isTransparent =
    config.transparent?.enabledOnHomepage && (pathname === '/' || pathname === `/stores/${activeTenantSlug}`);

  return (
    <>
      <style id="dynamic-header-tokens" dangerouslySetInnerHTML={{ __html: headerCssVariables }} />
      <header
        className={`${
          isSticky ? 'sticky top-0 z-40' : 'relative z-40'
        } w-full transition-all duration-300 ${
          isTransparent && !isScrolled
            ? 'bg-transparent text-white'
            : isScrolled
            ? 'shadow-md backdrop-blur-md'
            : ''
        }`}
      >
        {/* Row 1: Announcement / Utility Bar */}
        {config.announcementBar?.enabled !== false && (
          <DynamicAnnouncementBar
            blocks={config.announcementBar.blocks}
            styles={config.announcementBar.styles}
            mode={config.announcementBar.mode}
            marqueeSpeed={config.announcementBar.marqueeSpeed}
            countdown={config.announcementBar.countdown}
            rotationEnabled={config.announcementBar.rotationEnabled}
            rotationInterval={config.announcementBar.rotationInterval}
            pauseOnHover={config.announcementBar.pauseOnHover}
            tenantSlug={activeTenantSlug}
            hideOnMobile={config.announcementBar.hideOnMobile}
            hideOnTablet={config.announcementBar.hideOnTablet}
            responsive={config.announcementBar.responsive}
          />
        )}

        {/* Row 2: Main Ecommerce Navigation Row */}
        {config.mainHeader?.enabled !== false && (
          <DynamicMainHeader
            blocks={config.mainHeader.blocks}
            styles={config.mainHeader.styles}
            navigationMenu={config.navigationMenu}
            tenantSlug={activeTenantSlug}
            isScrolled={isScrolled}
            stickyConfig={config.sticky}
            onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            containerWidth={config.mainHeader.containerWidth}
            maxWidth={config.mainHeader.maxWidth}
            height={config.mainHeader.height}
            scrolledHeight={config.sticky.scrolledHeight}
            hideOnMobile={config.mainHeader.hideOnMobile}
            hideOnTablet={config.mainHeader.hideOnTablet}
            responsive={config.mainHeader.responsive}
          />
        )}
      </header>

      {/* Mobile Drawer */}
      <DynamicMobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        navigationMenu={config.navigationMenu}
        tenantSlug={activeTenantSlug}
        drawerSettings={config.mobile?.drawer}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Search Overlay */}
      {isSearchOpen && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}

      {/* Global Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCartDrawer} />
    </>
  );
}
