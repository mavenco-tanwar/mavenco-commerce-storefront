'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Phone, Sparkles, Globe } from 'lucide-react';
import { resolveTenant, resolveActiveTenantSlug, TenantBrandConfig, formatTenantHref } from '@/lib/tenant-config';

export function AnnouncementBar({ tenantSlug: propTenantSlug }: { tenantSlug?: string }) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, propTenantSlug);
  const [tenant, setTenant] = useState<TenantBrandConfig>(() => resolveTenant(activeTenantSlug));

  useEffect(() => {
    const t = resolveTenant(activeTenantSlug);
    setTenant(t);

    const targetSlug = t?.slug || activeTenantSlug;
    if (targetSlug && targetSlug !== 'demo') {
      fetch(`/api/v1/tenant-config?tenant=${targetSlug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data?.name) {
            setTenant(json.data);
          }
        })
        .catch(() => {});
    }
  }, [activeTenantSlug, pathname, searchParams]);

  const ann = tenant.announcements;

  return (
    <div
      suppressHydrationWarning
      className="text-xs py-2 px-4 border-b select-none relative z-40"
      style={{
        backgroundColor: tenant.theme.primaryColor,
        color: tenant.theme.secondaryColor,
        borderColor: `${tenant.theme.accentColor}33`,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between" suppressHydrationWarning>
        {/* Left Side: Support Callout (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-[11px]" style={{ color: tenant.theme.accentColor }}>
          <span suppressHydrationWarning className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Sparkles className="w-3 h-3" />
            {ann.leftCallout}
          </span>
          <span className="opacity-40">•</span>
          <a
            href={`https://wa.me/${tenant.contact.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            WhatsApp Concierge
          </a>
        </div>

        {/* Center: Announcement */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center" suppressHydrationWarning>
          <div className="font-medium tracking-wide text-xs">
            <Link
              href={formatTenantHref(ann.link || '/sale', tenant?.slug)}
              className="hover:underline inline-flex items-center gap-1.5"
            >
              <span suppressHydrationWarning>{ann.mainText}</span>
              {ann.highlightText && (
                <span
                  suppressHydrationWarning
                  className="font-bold tracking-wider uppercase underline underline-offset-2"
                  style={{ color: tenant.theme.accentColor }}
                >
                  {ann.highlightText}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Right Side: Currency & Store Tag */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono opacity-80" suppressHydrationWarning>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {tenant.currency} ({tenant.currencySymbol})
          </span>
          <span className="opacity-40">•</span>
          <span suppressHydrationWarning className="uppercase tracking-widest">{tenant.name}</span>
        </div>
      </div>
    </div>
  );
}
