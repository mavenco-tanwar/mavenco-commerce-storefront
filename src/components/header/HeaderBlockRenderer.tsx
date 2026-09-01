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

    case 'divider':
      return <DividerBlock block={block} />;

    case 'spacer':
      return <SpacerBlock block={block} />;

    default:
      return null;
  }
}
