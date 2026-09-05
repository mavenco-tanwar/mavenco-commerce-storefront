'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { HeaderBlock, NavigationItem } from '@/lib/header-config';
import { MegaMenu } from './MegaMenu';
import { formatTenantHref } from '@/lib/tenant-config';

interface NavigationBlockProps {
  block: HeaderBlock;
  navigationMenu: NavigationItem[];
  accentColor?: string;
  tenantSlug: string;
}

export function NavigationBlock({
  block,
  navigationMenu = [],
  accentColor = '#E11D48',
  tenantSlug,
}: NavigationBlockProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const s = block.settings || {};
  const activeItems = (navigationMenu || [])
    .filter((item) => item && item.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const splitSide = s.splitSide || 'all'; // 'all' | 'first-half' | 'second-half' | 'left' | 'right'
  let displayedItems = activeItems;
  if (splitSide === 'first-half' || splitSide === 'left') {
    const half = Math.ceil(activeItems.length / 2);
    displayedItems = activeItems.slice(0, half);
  } else if (splitSide === 'second-half' || splitSide === 'right') {
    const half = Math.ceil(activeItems.length / 2);
    displayedItems = activeItems.slice(half);
  }

  const fontFamily = s.fontFamily || block.styles?.fontFamily || 'inherit';
  const fontSize = s.fontSize || block.styles?.fontSize || '12px';
  const letterSpacing = s.letterSpacing || block.styles?.letterSpacing || '0.12em';
  const textTransform = (s.textTransform || block.styles?.textTransform || 'uppercase') as any;
  const fontWeight = s.fontWeight || block.styles?.fontWeight || '600';

  return (
    <nav
      aria-label="Primary Navigation"
      className="flex items-center justify-center gap-4 lg:gap-6 select-none relative"
      onMouseLeave={() => setActiveMenuId(null)}
    >
      {displayedItems.map((item) => {
        const hasMegaMenu = !!item.megaMenu?.enabled;
        const hasChildren = !!(item.children && item.children.length > 0);
        const isHovered = activeMenuId === item.id;

        return (
          <div
            key={item.id}
            className="relative py-3 group"
            onMouseEnter={() => (hasMegaMenu || hasChildren ? setActiveMenuId(item.id) : setActiveMenuId(null))}
          >
            <Link
              href={formatTenantHref(item.url, tenantSlug)}
              target={item.target || '_self'}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                fontFamily,
                fontSize,
                letterSpacing,
                textTransform,
                fontWeight,
                color: isHovered ? accentColor : 'inherit',
              }}
            >
              <span>{item.label}</span>

              {item.badge && (
                <span
                  className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-white shadow-xs"
                  style={{
                    backgroundColor: item.badge.bg || accentColor,
                    color: item.badge.color || '#FFFFFF',
                  }}
                >
                  {item.badge.text}
                </span>
              )}

              {(hasMegaMenu || hasChildren) && (
                <ChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                    isHovered ? 'rotate-180 opacity-100' : ''
                  }`}
                />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            {hasMegaMenu && isHovered && item.megaMenu && (
              <MegaMenu
                megaMenu={item.megaMenu}
                accentColor={accentColor}
                tenantSlug={tenantSlug}
                onClose={() => setActiveMenuId(null)}
              />
            )}

            {/* Standard Dropdown */}
            {!hasMegaMenu && hasChildren && isHovered && item.children && (
              <div
                role="menu"
                className="absolute top-full left-0 min-w-[200px] bg-white text-[#111111] shadow-xl rounded-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={formatTenantHref(child.url, tenantSlug)}
                    onClick={() => setActiveMenuId(null)}
                    className="block px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
