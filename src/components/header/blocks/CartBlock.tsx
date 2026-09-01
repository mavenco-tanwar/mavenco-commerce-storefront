'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { HeaderBlock } from '@/lib/header-config';
import { useCart } from '@/context/CartContext';

interface CartBlockProps {
  block: HeaderBlock;
  accentColor?: string;
  onOpenCart?: () => void;
}

export function CartBlock({ block, accentColor = '#E11D48', onOpenCart }: CartBlockProps) {
  const { summary, openDrawer } = useCart();
  const s = block.settings || {};
  const showLabel = s.showLabel || false;
  const label = s.label || 'BAG';
  const count = summary.itemCount || 0;

  const handleTrigger = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      openDrawer();
    }
  };

  return (
    <button
      type="button"
      onClick={handleTrigger}
      aria-label="Shopping Bag"
      className="relative flex items-center gap-1.5 hover:opacity-75 transition-opacity text-xs font-semibold tracking-wider uppercase cursor-pointer select-none group focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ color: block.styles?.textColor || 'inherit' }}
    >
      <div className="relative">
        <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
        {count > 0 && (
          <span
            className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200"
            style={{ backgroundColor: accentColor }}
          >
            {count}
          </span>
        )}
      </div>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
