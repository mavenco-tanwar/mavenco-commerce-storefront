'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { HeaderBlock } from '@/lib/header-config';
import { formatTenantHref } from '@/lib/tenant-config';
import { useWishlist } from '@/context/WishlistContext';

interface WishlistBlockProps {
  block: HeaderBlock;
  accentColor?: string;
}

export function WishlistBlock({ block, accentColor = '#E11D48' }: WishlistBlockProps) {
  const { wishlistCount } = useWishlist();
  const s = block.settings || {};
  const showLabel = s.showLabel || false;
  const label = s.label || 'WISHLIST';

  return (
    <Link
      href={formatTenantHref('/wishlist')}
      aria-label="Wishlist"
      className="relative flex items-center gap-1.5 hover:opacity-75 transition-opacity text-xs font-semibold tracking-wider uppercase select-none group"
      style={{ color: block.styles?.textColor || 'inherit' }}
    >
      <div className="relative">
        <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
        {wishlistCount > 0 && (
          <span
            className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
            style={{ backgroundColor: accentColor }}
          >
            {wishlistCount}
          </span>
        )}
      </div>
      {showLabel && <span>{label}</span>}
    </Link>
  );
}
