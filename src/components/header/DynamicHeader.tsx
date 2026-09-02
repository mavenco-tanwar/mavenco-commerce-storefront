'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { resolveTenant } from '@/lib/tenant-config';
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

  // Determine active tenant
  const activeTenantSlug =
    propTenantSlug ||
    (pathname.startsWith('/stores/')
      ? pathname.split('/')[2]?.toLowerCase()
      : searchParams.get('tenant')?.toLowerCase()) ||
    resolveTenant().slug ||
    'lumina';

  const [config, setConfig] = useState<HeaderConfig>(
    initialConfig || getDefaultHeaderConfig(activeTenantSlug)
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDrawerOpen: isCartOpen, closeDrawer: closeCartDrawer } = useCart();

  // Fetch live Header configuration from MongoDB Atlas API
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/v1/content/header?tenant=${activeTenantSlug}&_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json?.data) {
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
              blocks: raw.announcementBar?.blocks || base.announcementBar.blocks,
            },
            mainHeader: {
              ...base.mainHeader,
              ...(raw.mainHeader || {}),
              styles: {
                ...base.mainHeader.styles,
                ...(raw.mainHeader?.styles || {}),
              },
              blocks: raw.mainHeader?.blocks || base.mainHeader.blocks,
            },
            navigationMenu: raw.navigationMenu || base.navigationMenu,
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [activeTenantSlug, pathname, searchParams]);

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

  const isSticky = config.sticky?.enabled !== false;
  const isTransparent =
    config.transparent?.enabledOnHomepage && (pathname === '/' || pathname === `/stores/${activeTenantSlug}`);

  return (
    <>
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
