import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

import { useProductCardConfig } from '@/context/ProductCardConfigContext';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  columns?: number;
  columnsMobile?: number;
  gap?: string;
  className?: string;
  tenantSlug?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  columns: explicitColumns,
  columnsMobile,
  gap,
  className = '',
  tenantSlug,
}: ProductGridProps) {
  const { config } = useProductCardConfig(tenantSlug);
  const desktopCols = Math.min(Math.max(Number(explicitColumns || config.responsive?.desktopColumns || 4), 1), 6);
  const mobCols = columnsMobile === 1 ? 1 : 2;

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: mobCols === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2',
    3: (mobCols === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2') + ' md:grid-cols-3',
    4: (mobCols === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2') + ' md:grid-cols-3 lg:grid-cols-4',
    5: (mobCols === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2') + ' md:grid-cols-3 lg:grid-cols-5',
    6: (mobCols === 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2') + ' md:grid-cols-3 lg:grid-cols-6',
  };
  const activeColumnClass = columnClasses[desktopCols] || columnClasses[4];

  if (isLoading) {
    return (
      <div
        className={`grid ${activeColumnClass} gap-3 sm:gap-6 ${className}`}
        style={{
          gap: gap || undefined,
        }}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid ${activeColumnClass} gap-3.5 sm:gap-6 ${className}`}
      style={{
        gap: gap || undefined,
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} tenantSlug={tenantSlug} />
      ))}
    </div>
  );
}

