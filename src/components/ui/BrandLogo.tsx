'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { resolveTenant, TenantBrandConfig } from '@/lib/tenant-config';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}: BrandLogoProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tenant, setTenant] = useState<TenantBrandConfig>(resolveTenant());

  useEffect(() => {
    const t = resolveTenant();
    setTenant(t);

    if (t?.slug) {
      fetch(`/api/v1/tenant-config?tenant=${t.slug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data?.name) {
            setTenant(json.data);
          }
        })
        .catch(() => {});
    }
  }, [pathname, searchParams]);

  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : '#111111';

  const isBrightBg =
    tenant.theme.primaryColor.startsWith('#00FF') ||
    tenant.theme.primaryColor.startsWith('#39FF') ||
    tenant.theme.primaryColor.startsWith('#00F5') ||
    tenant.theme.primaryColor.toLowerCase() === '#ffffff' ||
    tenant.theme.primaryColor.toLowerCase() === '#ffff00';
  const monogramTextColor = isBrightBg ? '#111827' : '#FFFFFF';

  const monogram = tenant.name
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'TT';

  return (
    <Link
      href={`/stores/${tenant.slug}`}
      suppressHydrationWarning
      className={`inline-flex items-center gap-3 group transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${tenant.name} - Home`}
    >
      <div
        suppressHydrationWarning
        className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-lg shadow-sm shrink-0 transition-transform group-hover:scale-105"
        style={{
          backgroundColor: tenant.theme.primaryColor,
          color: monogramTextColor,
        }}
      >
        {monogram}
      </div>

      <div className="flex flex-col" suppressHydrationWarning>
        <span
          suppressHydrationWarning
          className="font-serif font-extrabold text-base sm:text-lg tracking-wider leading-none"
          style={{ color: textColor }}
        >
          {tenant.name.toUpperCase()}
        </span>
        {showTagline && (
          <span
            suppressHydrationWarning
            className="text-[9px] uppercase tracking-widest font-semibold mt-1"
            style={{ color: tenant.theme.accentColor }}
          >
            {tenant.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
