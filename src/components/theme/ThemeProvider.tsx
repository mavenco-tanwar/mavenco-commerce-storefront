'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeDocument } from '@/types/theme.types';
import { getDefaultTheme } from '@/lib/theme-presets';
import { generateThemeCssVariables, resolveThemeStyle } from '@/lib/theme-engine';
import { resolveActiveTenantSlug } from '@/lib/tenant-config';
import { apiClient } from '@/services/api/client';

interface ThemeContextValue {
  theme: ThemeDocument;
  cssVariables: string;
  resolveStyle: (componentVal?: string, sectionVal?: string, themeVal?: string, fallback?: string) => string;
  isLoading: boolean;
  activeTenantSlug: string;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getDefaultTheme('lumina'),
  cssVariables: '',
  resolveStyle: (_, __, ___, fallback = '') => fallback,
  isLoading: true,
  activeTenantSlug: 'lumina',
  refreshTheme: async () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeInner({
  children,
  initialTheme,
  tenantSlug: propTenantSlug,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeDocument;
  tenantSlug?: string;
}) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  // Deterministically resolve active tenant from URL path (/stores/[slug]), query, cookies, or storage
  const activeTenantSlug = useMemo(() => {
    return resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);
  }, [pathname, searchParams, propTenantSlug]);

  const isPreview = searchParams?.get('preview') === 'draft';

  const [theme, setTheme] = useState<ThemeDocument>(() => {
    return initialTheme || getDefaultTheme(activeTenantSlug);
  });
  const [isLoading, setIsLoading] = useState(!initialTheme);

  const fetchTheme = useCallback(async () => {
    if (!activeTenantSlug) return;
    try {
      setIsLoading(true);
      const previewQuery = isPreview ? '&preview=draft' : '';
      const res = await apiClient.get<ThemeDocument>(
        `/api/v1/theme?tenant=${encodeURIComponent(activeTenantSlug)}${previewQuery}&_t=${Date.now()}`
      );
      if (res.data) {
        setTheme(res.data);
      }
    } catch (err) {
      console.warn('[ThemeProvider] Falling back to default theme for:', activeTenantSlug, err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTenantSlug, isPreview]);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  // Listen for storage changes or theme update broadcast events from admin live preview
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'THEME_UPDATED' || event.data?.type === 'MAVENCO_THEME_PREVIEW') {
        if (event.data?.theme) {
          setTheme(event.data.theme);
        } else {
          fetchTheme();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'jq_theme_updated' || event.key === 'jq_active_tenant') {
        fetchTheme();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchTheme]);

  const cssVariables = useMemo(() => {
    return generateThemeCssVariables(theme);
  }, [theme]);

  const contextValue = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      cssVariables,
      resolveStyle: (comp, sec, thm, fb = '') => resolveThemeStyle(comp, sec, thm, fb),
      isLoading,
      activeTenantSlug,
      refreshTheme: fetchTheme,
    };
  }, [theme, cssVariables, isLoading, activeTenantSlug, fetchTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <style
        id="storefront-theme-tokens"
        dangerouslySetInnerHTML={{ __html: cssVariables }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeStaticFallback({
  children,
  initialTheme,
  tenantSlug = 'lumina',
}: {
  children: React.ReactNode;
  initialTheme?: ThemeDocument;
  tenantSlug?: string;
}) {
  const fallbackTheme = initialTheme || getDefaultTheme(tenantSlug);
  const cssVariables = generateThemeCssVariables(fallbackTheme);

  const value: ThemeContextValue = {
    theme: fallbackTheme,
    cssVariables,
    resolveStyle: (comp, sec, thm, fb = '') => resolveThemeStyle(comp, sec, thm, fb),
    isLoading: false,
    activeTenantSlug: tenantSlug,
    refreshTheme: async () => {},
  };

  return (
    <ThemeContext.Provider value={value}>
      <style
        id="storefront-theme-tokens"
        dangerouslySetInnerHTML={{ __html: cssVariables }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeProvider(props: {
  children: React.ReactNode;
  initialTheme?: ThemeDocument;
  tenantSlug?: string;
}) {
  return (
    <Suspense fallback={<ThemeStaticFallback {...props} />}>
      <ThemeInner {...props} />
    </Suspense>
  );
}
