'use client';

import React from 'react';
import Link from 'next/link';
import { HeaderBlock } from '@/lib/header-config';
import { formatTenantHref } from '@/lib/tenant-config';

interface LogoBlockProps {
  block: HeaderBlock;
  tenantSlug: string;
  isScrolled?: boolean;
}

export function LogoBlock({ block, tenantSlug }: LogoBlockProps) {
  const s = block.settings || {};
  const logoText = s.logoText || s.text || '';
  const badgeText = s.badgeText !== undefined ? s.badgeText : s.tagline !== undefined ? s.tagline : '';
  const logoUrl = s.logoUrl;
  const link = formatTenantHref(s.link || '/', tenantSlug);
  const width = s.width || '180px';
  const height = s.height || 'auto';

  return (
    <Link href={link} className="flex items-center gap-3.5 group select-none transition-transform active:scale-95">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={s.altText || `${logoText} Logo`}
          style={{ width, height, objectFit: 'contain' }}
          className="transition-opacity group-hover:opacity-90"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-md shadow-indigo-950/20 shrink-0 border border-white/20 transition-transform group-hover:scale-105">
          {logoText.substring(0, 2).toUpperCase()}
        </div>
      )}

      <div className="flex flex-col">
        <span
          className="text-base sm:text-lg font-bold tracking-tight text-current transition-colors leading-tight font-heading"
          style={{
            fontFamily: block.styles?.fontFamily,
            color: block.styles?.textColor,
          }}
        >
          {logoText}
        </span>
        {badgeText && (
          <span
            className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold opacity-60 leading-none mt-0.5"
            style={{ color: block.styles?.textColor }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </Link>
  );
}
