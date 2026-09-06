'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { resolveTenant, resolveActiveTenantSlug, formatStoreName } from '@/lib/tenant-config';
import { FooterConfig, getDefaultFooterConfig } from '@/lib/footer-config';
import { FooterBlockRenderer } from './FooterBlockRenderer';

interface DynamicFooterProps {
  initialConfig?: FooterConfig | null;
  tenantSlug?: string;
}

export function DynamicFooter({ initialConfig, tenantSlug: propTenantSlug }: DynamicFooterProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);

  const [mounted, setMounted] = useState(false);
  const [tenantSlug, setTenantSlug] = useState<string>(activeTenantSlug);
  const [config, setConfig] = useState<FooterConfig>(() => {
    return initialConfig || getDefaultFooterConfig(activeTenantSlug, formatStoreName(activeTenantSlug));
  });

  const fetchFooter = useCallback(async () => {
    const t = resolveTenant(activeTenantSlug);
    const slug = (t.slug || activeTenantSlug || 'demo').toLowerCase().trim();
    setTenantSlug(slug);

    try {
      const res = await fetch(`/api/v1/content/footer?tenant=${encodeURIComponent(slug)}&_t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.sections && json.data.sections.length > 0) {
          setConfig(json.data);
          return;
        }
      }
      setConfig(getDefaultFooterConfig(slug, t.name || formatStoreName(slug)));
    } catch (err) {
      console.warn('[DynamicFooter] Falling back to default seed:', err);
    }
  }, [activeTenantSlug]);

  useEffect(() => {
    setMounted(true);
    fetchFooter();
  }, [fetchFooter, pathname, searchParams]);

  // Live broadcast listener from Admin Visual Theme Studio preview / publish
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'FOOTER_UPDATED' ||
        event.data?.type === 'MAVENCO_FOOTER_PREVIEW' ||
        event.data?.type === 'MAVENCO_THEME_PREVIEW'
      ) {
        if (event.data?.footerConfig) {
          setConfig(event.data.footerConfig);
        } else {
          fetchFooter();
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'jq_footer_updated' || event.key === 'jq_active_tenant') {
        fetchFooter();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchFooter]);

  // Dynamic CSS variables scoped to Footer & Navigation
  const footerCssVariables = useMemo(() => {
    const th = config?.theme || ({} as any);
    return `
      :root {
        --footer-bg: ${th.backgroundColor || '#111111'};
        --footer-surface: ${th.surfaceColor || '#1A1615'};
        --footer-text: ${th.textColor || '#FAF6F2'};
        --footer-heading: ${th.headingColor || '#FFFDFC'};
        --footer-muted: ${th.mutedTextColor || '#A0958E'};
        --footer-accent: ${th.accentColor || '#B77A68'};
        --footer-border: ${th.borderColor || 'rgba(255, 255, 255, 0.1)'};
        --footer-font-family: ${th.fontFamily || 'inherit'};
        --footer-heading-font: ${th.headingFontFamily || 'inherit'};
        --footer-font-size: ${th.fontSize || '13px'};
        --footer-letter-spacing: ${th.letterSpacing || '0.02em'};
      }
    `.trim();
  }, [config?.theme]);

  if (!config || !config.sections || config.sections.length === 0) {
    return null;
  }

  const { theme, sections } = config;

  return (
    <>
      <style id="dynamic-footer-tokens" dangerouslySetInnerHTML={{ __html: footerCssVariables }} />
      <footer
        suppressHydrationWarning
        style={{
          backgroundColor:
            theme?.backgroundColor || 'var(--footer-bg, var(--theme-color-surface-secondary, #111111))',
          color: theme?.textColor || 'var(--footer-text, var(--theme-color-text, #FAF6F2))',
          fontFamily: theme?.fontFamily || 'var(--footer-font-family, var(--theme-font-body, inherit))',
          borderColor: theme?.borderColor || 'var(--footer-border, rgba(255, 255, 255, 0.1))',
        }}
        className="border-t select-none pt-12 pb-10 transition-colors duration-300"
      >
        <div className="space-y-12">
          {(sections || [])
            .filter((sec) => sec && sec.enabled !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section) => {
              const cols = section?.layout?.columns?.desktop || 4;
              const containerWidth = section?.layout?.containerWidth || 'contained';
              const containerClasses =
                containerWidth === 'full'
                  ? 'w-full px-4 sm:px-6 lg:px-12'
                  : containerWidth === 'narrow'
                  ? 'max-w-5xl mx-auto px-4 sm:px-6'
                  : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

              const gridClass =
                cols === 1
                  ? 'grid grid-cols-1 gap-6'
                  : cols === 2
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  : cols === 3
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                  : cols === 4
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
                  : cols === 6
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8';

              return (
                <div
                  key={section.id}
                  style={{
                    backgroundColor: section?.styles?.backgroundColor || 'transparent',
                    borderColor: section?.styles?.borderColor || 'var(--footer-border, rgba(255,255,255,0.08))',
                    borderBottomWidth: section?.styles?.borderBottomWidth || '0px',
                    borderTopWidth: section?.styles?.borderTopWidth || '0px',
                  }}
                  className="py-4 transition-colors"
                >
                  <div className={`${containerClasses} ${gridClass}`}>
                    {(section?.blocks || [])
                      .filter((b) => b && b.enabled !== false)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((block) => {
                        const span = block.columnSpan || 1;
                        const spanClass =
                          span > 1
                            ? span === 2
                              ? 'col-span-1 md:col-span-2'
                              : span === 3
                              ? 'col-span-1 md:col-span-3'
                              : span >= 4
                              ? 'col-span-1 md:col-span-4'
                              : ''
                            : '';

                        return (
                          <div key={block.id} className={spanClass}>
                            <FooterBlockRenderer
                              block={block}
                              tenantSlug={tenantSlug}
                              themeAccent={theme?.accentColor || 'var(--footer-accent, #B77A68)'}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
      </footer>
    </>
  );
}
