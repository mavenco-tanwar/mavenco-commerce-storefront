import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';

export interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  compareAtPrice,
  size = 'md',
  showDiscountBadge = false,
  className,
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const fontSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl md:text-3xl font-bold',
  };

  const compareFontSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={cn('inline-flex items-baseline flex-wrap gap-2', className)}>
      <span className={cn('text-[#111111] tracking-tight font-sans', fontSizes[size])}>
        {formatCurrency(price)}
      </span>

      {hasDiscount && (
        <span
          className={cn(
            'text-[#777777] line-through font-normal decoration-[#C98282]/60',
            compareFontSizes[size]
          )}
        >
          {formatCurrency(compareAtPrice)}
        </span>
      )}

      {hasDiscount && showDiscountBadge && (
        <span className="text-xs font-bold text-[#C98282] uppercase tracking-wider bg-[#F7EBEA] px-1.5 py-0.5 rounded-none">
          {discountPercent}% OFF
        </span>
      )}
    </div>
  );
}
