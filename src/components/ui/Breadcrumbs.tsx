import { formatTenantHref } from '@/lib/tenant-config';
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const seenLabels = new Set<string>(['home']);
  const cleanItems = items.filter((item) => {
    if (!item.label) return false;
    const lower = item.label.trim().toLowerCase();
    if (seenLabels.has(lower)) return false;
    seenLabels.add(lower);
    return true;
  });

  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn('flex items-center text-xs text-[#777777] font-medium py-3 select-none overflow-x-auto no-scrollbar', className)}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        <li>
          <Link
            href={formatTenantHref('/')}
            className="hover:text-[#111111] transition-colors flex items-center"
          >
            Home
          </Link>
        </li>

        {cleanItems.map((item, index) => {
          const isLast = index === cleanItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-[#B77A68]/60 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-[#111111] font-semibold truncate max-w-[200px] sm:max-w-[300px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={formatTenantHref(item.href)}
                  className="hover:text-[#111111] transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
