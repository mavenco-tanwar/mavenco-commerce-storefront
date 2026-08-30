'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [tenant, setTenant] = useState<TenantBrandConfig>(resolveTenant());

  useEffect(() => {
    setTenant(resolveTenant());
  }, []);

  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : '#111111';

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
      className={`inline-flex items-center gap-3 group transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${tenant.name} - Home`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-white text-lg shadow-sm shrink-0 transition-transform group-hover:scale-105"
        style={{ backgroundColor: tenant.theme.primaryColor }}
      >
        {monogram}
      </div>

      <div className="flex flex-col">
        <span
          className="font-serif font-extrabold text-base sm:text-lg tracking-wider leading-none"
          style={{ color: textColor }}
        >
          {tenant.name.toUpperCase()}
        </span>
        {showTagline && (
          <span
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
