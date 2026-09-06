'use client';

import React from 'react';
import Link from 'next/link';
import { formatTenantHref } from '@/lib/tenant-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CollectionBreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
  tenantSlug?: string;
}

export function CollectionBreadcrumbs({
  items,
  separator = '/',
  className = '',
  tenantSlug,
}: CollectionBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs text-[var(--theme-color-text-secondary,#57534E)] font-sans select-none ${className}`}>
      <Link href={formatTenantHref('/', tenantSlug)} className="hover:text-[var(--theme-color-accent,#B77A68)] transition-colors">
        Home
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <span className="text-[var(--theme-color-text-muted,#A8A29E)] font-mono">{separator}</span>
            {isLast || !item.href ? (
              <span className="text-[var(--theme-color-heading,#111111)] font-bold truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link href={formatTenantHref(item.href, tenantSlug)} className="hover:text-[var(--theme-color-accent,#B77A68)] transition-colors truncate max-w-[160px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
