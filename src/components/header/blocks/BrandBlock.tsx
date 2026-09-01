'use client';

import React from 'react';
import Link from 'next/link';
import { HeaderBlock } from '@/lib/header-config';

interface BrandBlockProps {
  block: HeaderBlock;
  tenantSlug: string;
}

export function BrandBlock({ block, tenantSlug }: BrandBlockProps) {
  const s = block.settings || {};
  const name = s.text || s.name || tenantSlug.toUpperCase();
  const link = s.link || `/stores/${tenantSlug}`;

  return (
    <Link
      href={link}
      className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity select-none"
      style={{
        fontFamily: block.styles?.fontFamily,
        color: block.styles?.textColor,
        fontSize: block.styles?.fontSize,
        fontWeight: block.styles?.fontWeight,
      }}
    >
      {name}
    </Link>
  );
}
