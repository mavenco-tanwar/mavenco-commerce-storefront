'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

interface MegaMenuProps {
  tenantSlug?: string;
  megaMenu: {
    enabled: boolean;
    columns: Array<{
      id: string;
      title: string;
      links: Array<{ label: string; url: string; badge?: string }>;
      promoBanner?: {
        image: string;
        heading: string;
        description?: string;
        ctaText: string;
        ctaUrl: string;
      };
    }>;
  };
  accentColor?: string;
  onClose?: () => void;
}

export function MegaMenu({ megaMenu, accentColor = '#E11D48', tenantSlug, onClose }: MegaMenuProps) {
  if (!megaMenu?.enabled || !megaMenu.columns || megaMenu.columns.length === 0) {
    return null;
  }

  return (
    <div
      role="menu"
      className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl bg-white text-[#111111] shadow-2xl rounded-2xl border border-slate-200/80 p-8 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        className="grid gap-8"
        style={{
          gridTemplateColumns: `repeat(${Math.min(megaMenu.columns.length, 4)}, minmax(0, 1fr))`,
        }}
      >
        {megaMenu.columns.map((col) => (
          <div key={col.id} className="space-y-4">
            <h4
              className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between"
            >
              <span>{col.title}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            </h4>

            {col.links && col.links.length > 0 && (
              <ul className="space-y-2.5">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={formatTenantHref(link.url, tenantSlug)}
                      onClick={onClose}
                      className="text-xs text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-between group py-1"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                      {link.badge && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {col.promoBanner && (
              <div className="relative rounded-xl overflow-hidden group shadow-md mt-3 aspect-[4/3]">
                <img
                  src={col.promoBanner.image}
                  alt={col.promoBanner.heading}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1 mb-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Spotlight
                  </span>
                  <h5 className="text-sm font-bold leading-tight drop-shadow-sm mb-1">
                    {col.promoBanner.heading}
                  </h5>
                  {col.promoBanner.description && (
                    <p className="text-[10px] text-slate-200 line-clamp-2 mb-2">
                      {col.promoBanner.description}
                    </p>
                  )}
                  <Link
                    href={formatTenantHref(col.promoBanner.ctaUrl, tenantSlug)}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-200 transition-colors"
                  >
                    <span>{col.promoBanner.ctaText || 'Shop Now'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
