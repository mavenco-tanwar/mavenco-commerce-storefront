'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { resolveTenant } from '@/lib/tenant-config';
import { FooterConfig, getDefaultFooterConfig } from '@/lib/footer-config';
import { FooterBlockRenderer } from './FooterBlockRenderer';

interface DynamicFooterProps {
  initialConfig?: FooterConfig | null;
}

export function DynamicFooter({ initialConfig }: DynamicFooterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [tenantSlug, setTenantSlug] = useState<string>(() => {
    return resolveTenant().slug;
  });
  const [config, setConfig] = useState<FooterConfig>(() => {
    const t = resolveTenant();
    return initialConfig || getDefaultFooterConfig(t.slug, t.name);
  });

  useEffect(() => {
    setMounted(true);
    const t = resolveTenant();
    const slug = (t.slug || 'jq-trends').toLowerCase().trim();
    setTenantSlug(slug);

    // Fetch published configuration from API
    fetch(`/api/v1/content/footer?tenant=${slug}&_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.sections && json.data.sections.length > 0) {
          setConfig(json.data);
        } else {
          setConfig(getDefaultFooterConfig(slug, t.name));
        }
      })
      .catch((err) => {
        console.warn('[DynamicFooter] Falling back to default seed:', err);
      });
  }, [pathname, searchParams]);

  if (!config || !config.sections || config.sections.length === 0) {
    return null;
  }

  const { theme, sections } = config;

  return (
    <footer
      suppressHydrationWarning
      style={{
        backgroundColor: theme?.backgroundColor || '#111111',
        color: theme?.textColor || '#FAF6F2',
        fontFamily: theme?.fontFamily,
      }}
      className="border-t border-white/10 select-none pt-12 pb-10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {sections
          .filter((sec) => sec.enabled !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((section) => {
            const cols = section.layout?.columns?.desktop || 4;
            const gridClass =
              cols === 1
                ? 'grid grid-cols-1'
                : cols === 2
                ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                : cols === 3
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                : cols === 4
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8';

            return (
              <div
                key={section.id}
                style={{
                  borderColor: section.styles?.borderColor || 'rgba(255,255,255,0.08)',
                  borderBottomWidth: section.styles?.borderBottomWidth || '0px',
                  borderTopWidth: section.styles?.borderTopWidth || '0px',
                }}
                className={`py-4 ${gridClass}`}
              >
                {section.blocks
                  .filter((b) => b.enabled !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((block) => (
                    <FooterBlockRenderer
                      key={block.id}
                      block={block}
                      tenantSlug={tenantSlug}
                      themeAccent={theme?.accentColor || '#B77A68'}
                    />
                  ))}
              </div>
            );
          })}
      </div>
    </footer>
  );
}
