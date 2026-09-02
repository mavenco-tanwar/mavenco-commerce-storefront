'use client';

import React from 'react';
import { HeaderBlock, NavigationItem } from '@/lib/header-config';
import { LogoBlock } from './blocks/LogoBlock';
import { BrandBlock } from './blocks/BrandBlock';
import { NavigationBlock } from './blocks/NavigationBlock';
import { SearchBlock } from './blocks/SearchBlock';
import { WishlistBlock } from './blocks/WishlistBlock';
import { CartBlock } from './blocks/CartBlock';
import { AccountBlock } from './blocks/AccountBlock';
import { CurrencyBlock } from './blocks/CurrencyBlock';
import {
  WhatsAppBlock,
  PhoneBlock,
  TextBlock,
  IconBlock,
  CTAButtonBlock,
  DividerBlock,
  SpacerBlock,
} from './blocks/UtilityBlocks';

interface HeaderBlockRendererProps {
  block: HeaderBlock;
  tenantSlug: string;
  navigationMenu?: NavigationItem[];
  accentColor?: string;
  isScrolled?: boolean;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
}

export function getResponsiveVisibilityClass(responsive?: {
  desktop?: { visible?: boolean };
  tablet?: { visible?: boolean };
  mobile?: { visible?: boolean };
}): string {
  if (!responsive) return '';

  const d = responsive.desktop?.visible !== false;
  const t = responsive.tablet?.visible !== false;
  const m = responsive.mobile?.visible !== false;

  if (d && t && m) return '';
  if (!d && !t && !m) return 'hidden';
  if (d && t && !m) return 'hidden md:inline-flex';
  if (d && !t && !m) return 'hidden lg:inline-flex';
  if (!d && t && !m) return 'hidden md:inline-flex lg:hidden';
  if (!d && !t && m) return 'inline-flex md:hidden';
  if (!d && t && m) return 'inline-flex lg:hidden';
  if (d && !t && m) return 'inline-flex md:hidden lg:inline-flex';
  return '';
}

export function HeaderBlockRenderer({
  block,
  tenantSlug,
  navigationMenu = [],
  accentColor = '#E11D48',
  isScrolled = false,
  onOpenSearch,
  onOpenCart,
}: HeaderBlockRendererProps) {
  if (block.enabled === false) return null;

  // Check scheduling visibility
  if (block.visibility?.scheduleEnabled) {
    const now = new Date();
    if (block.visibility.startDate && new Date(block.visibility.startDate) > now) {
      return null;
    }
    if (block.visibility.endDate && new Date(block.visibility.endDate) < now) {
      return null;
    }
  }

  const responsiveClass = getResponsiveVisibilityClass(block.responsive);
  if (responsiveClass === 'hidden') return null;

  const renderContent = () => {
    switch (block.type) {
      case 'logo':
        return <LogoBlock block={block} tenantSlug={tenantSlug} isScrolled={isScrolled} />;

      case 'brand':
        return <BrandBlock block={block} tenantSlug={tenantSlug} />;

      case 'navigation':
        return (
          <NavigationBlock
            block={block}
            navigationMenu={navigationMenu}
            accentColor={accentColor}
            tenantSlug={tenantSlug}
          />
        );

      case 'search':
        return <SearchBlock block={block} accentColor={accentColor} onOpenSearch={onOpenSearch} />;

      case 'wishlist':
        return <WishlistBlock block={block} accentColor={accentColor} />;

      case 'cart':
        return <CartBlock block={block} accentColor={accentColor} onOpenCart={onOpenCart} />;

      case 'account':
        return <AccountBlock block={block} accentColor={accentColor} />;

      case 'currency':
        return <CurrencyBlock block={block} accentColor={accentColor} />;

      case 'whatsapp':
        return <WhatsAppBlock block={block} />;

      case 'phone':
        return <PhoneBlock block={block} />;

      case 'text':
        return <TextBlock block={block} />;

      case 'icon':
        return <IconBlock block={block} />;

      case 'cta':
        return <CTAButtonBlock block={block} />;

      case 'tagline': {
        const taglineVal = block.settings?.text || block.settings?.tagline || block.settings?.badgeText || block.settings?.label || '';
        if (!taglineVal) return null;
        return (
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold opacity-70 leading-none"
            style={{
              fontFamily: block.styles?.fontFamily,
              color: block.styles?.textColor,
            }}
          >
            {taglineVal}
          </span>
        );
      }

      case 'divider':
        return <DividerBlock block={block} />;

      case 'spacer':
        return <SpacerBlock block={block} />;

      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  if (responsiveClass) {
    return <div className={`inline-flex items-center ${responsiveClass}`}>{content}</div>;
  }

  return content;
}
