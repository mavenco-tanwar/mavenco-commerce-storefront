'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatTenantHref } from '@/lib/tenant-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CollectionBreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export function CollectionBreadcrumbs({
  items,
  separator = '/',
  className = '',
}: CollectionBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs text-slate-500 font-sans select-none ${className}`}>
      <Link href={formatTenantHref('/')} className="hover:text-rose-600 transition-colors">
        Home
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <span className="text-slate-400 font-mono">{separator}</span>
            {isLast || !item.href ? (
              <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link href={formatTenantHref(item.href)} className="hover:text-rose-600 transition-colors truncate max-w-[160px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
