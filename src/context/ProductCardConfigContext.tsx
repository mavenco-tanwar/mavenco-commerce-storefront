'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ProductCardConfig } from '@/types/product-card.types';
import { getDefaultProductCardConfig } from '@/lib/product-card-presets';
import { resolveActiveTenantSlug } from '@/lib/tenant-config';

interface ProductCardContextValue {
  config: ProductCardConfig;
  isLoading: boolean;
  activeTenantSlug: string;
  refreshConfig: () => Promise<void>;
}

const configCache = new Map<string, ProductCardConfig>();

const ProductCardContext = createContext<ProductCardContextValue>({
  config: getDefaultProductCardConfig('lumina'),
  isLoading: true,
  activeTenantSlug: 'lumina',
  refreshConfig: async () => {},
});

export function useProductCardConfig(explicitTenantSlug?: string) {
  const context = useContext(ProductCardContext);

  if (!explicitTenantSlug || explicitTenantSlug.toLowerCase().trim() === context.activeTenantSlug) {
    return context;
  }

  const slug = explicitTenantSlug.toLowerCase().trim();
  const cached = configCache.get(slug);
  return {
    config: cached || getDefaultProductCardConfig(slug),
    isLoading: false,
    activeTenantSlug: slug,
    refreshConfig: async () => {},
  };
}

function ProductCardConfigInner({
  children,
  initialConfig,
  tenantSlug: propTenantSlug,
}: {
  children: React.ReactNode;
  initialConfig?: ProductCardConfig;
  tenantSlug?: string;
}) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  const activeTenantSlug = useMemo(() => {
    return resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);
  }, [pathname, searchParams, propTenantSlug]);

  const isPreview = searchParams?.get('preview') === 'draft';

  const [config, setConfig] = useState<ProductCardConfig>(() => {
    if (initialConfig) return initialConfig;
    const cached = configCache.get(activeTenantSlug);
    if (cached) return cached;
    return getDefaultProductCardConfig(activeTenantSlug);
  });
  const [isLoading, setIsLoading] = useState(!initialConfig);

  const fetchingRef = useRef(false);
  const fetchedSlugRef = useRef<string | null>(null);

  const fetchConfig = useCallback(async (force = false) => {
    if (!activeTenantSlug) return;
    if (!force && fetchingRef.current) return;
    if (!force && fetchedSlugRef.current === activeTenantSlug && !isPreview) return;

    fetchingRef.current = true;
    try {
      setIsLoading(true);
      const previewQuery = isPreview ? '&preview=draft' : '';
      const cacheBust = isPreview || force ? `&_t=${Date.now()}` : '';
      const res = await fetch(
        `/api/v1/content/product-card?tenant=${encodeURIComponent(activeTenantSlug)}${previewQuery}${cacheBust}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          configCache.set(activeTenantSlug, json.data);
          setConfig(json.data);
          fetchedSlugRef.current = activeTenantSlug;
        }
      }
    } catch (err) {
      console.warn('[ProductCardConfig] Using default seed config for:', activeTenantSlug, err);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [activeTenantSlug, isPreview]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Listen for storage changes or theme update broadcast events from admin live preview
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PRODUCT_CARD_UPDATED' || event.data?.type === 'MAVENCO_THEME_PREVIEW') {
        if (event.data?.productCardConfig) {
          configCache.set(activeTenantSlug, event.data.productCardConfig);
          setConfig(event.data.productCardConfig);
        } else {
          fetchConfig(true);
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'jq_product_card_updated') {
        fetchConfig(true);
      } else if (event.key === 'jq_active_tenant' && event.newValue && event.newValue !== activeTenantSlug) {
        fetchConfig(true);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchConfig, activeTenantSlug]);

  const contextValue = useMemo<ProductCardContextValue>(() => {
    return {
      config,
      isLoading,
      activeTenantSlug,
      refreshConfig: fetchConfig,
    };
  }, [config, isLoading, activeTenantSlug, fetchConfig]);

  return (
    <ProductCardContext.Provider value={contextValue}>
      {children}
    </ProductCardContext.Provider>
  );
}

function ProductCardStaticFallback({
  children,
  initialConfig,
  tenantSlug = 'lumina',
}: {
  children: React.ReactNode;
  initialConfig?: ProductCardConfig;
  tenantSlug?: string;
}) {
  const fallback = initialConfig || getDefaultProductCardConfig(tenantSlug);
  const value: ProductCardContextValue = {
    config: fallback,
    isLoading: false,
    activeTenantSlug: tenantSlug,
    refreshConfig: async () => {},
  };

  return (
    <ProductCardContext.Provider value={value}>
      {children}
    </ProductCardContext.Provider>
  );
}

export function ProductCardConfigProvider(props: {
  children: React.ReactNode;
  initialConfig?: ProductCardConfig;
  tenantSlug?: string;
}) {
  return (
    <Suspense fallback={<ProductCardStaticFallback {...props} />}>
      <ProductCardConfigInner {...props} />
    </Suspense>
  );
}
