'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeDocument } from '@/types/theme.types';
import { getDefaultTheme } from '@/lib/theme-presets';
import { generateThemeCssVariables, resolveThemeStyle } from '@/lib/theme-engine';
import { apiClient } from '@/services/api/client';

interface ThemeContextValue {
  theme: ThemeDocument;
  cssVariables: string;
  resolveStyle: (componentVal?: string, sectionVal?: string, themeVal?: string, fallback?: string) => string;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getDefaultTheme('lumina'),
  cssVariables: '',
  resolveStyle: (_, __, ___, fallback = '') => fallback,
  isLoading: true,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeDocument;
}) {
  const [theme, setTheme] = useState<ThemeDocument>(initialTheme || getDefaultTheme('lumina'));
  const [isLoading, setIsLoading] = useState(!initialTheme);

  useEffect(() => {
    async function loadPublishedTheme() {
      try {
        let tenantSlug = 'lumina';
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          tenantSlug = params.get('tenant') || params.get('store') || 'lumina';
        }

        const res = await apiClient.get<ThemeDocument>(`/api/v1/theme?tenant=${tenantSlug}&_t=${Date.now()}`);
        if (res.data) {
          setTheme(res.data);
        }
      } catch (err) {
        console.warn('[ThemeProvider] Using default seed theme:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!initialTheme) {
      loadPublishedTheme();
    }
  }, [initialTheme]);

  const cssVariables = useMemo(() => {
    return generateThemeCssVariables(theme);
  }, [theme]);

  const contextValue = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      cssVariables,
      resolveStyle: (comp, sec, thm, fb = '') => resolveThemeStyle(comp, sec, thm, fb),
      isLoading,
    };
  }, [theme, cssVariables, isLoading]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Inject Dynamic CSS Tokens directly into Document */}
      <style
        id="storefront-theme-tokens"
        dangerouslySetInnerHTML={{ __html: cssVariables }}
      />
      {children}
    </ThemeContext.Provider>
  );
}
