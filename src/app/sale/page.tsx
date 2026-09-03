import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/plp/ProductListingView';

export const metadata = {
  title: 'Special Fashion Sale • Up to 50% Off | Luxury Boutique',
  description:
    'Exclusive discounts on premium dresses, curated sets, and designer wear. Limited stock available.',
};

export default function SalePage() {
  const categories = [
    { slug: 'women', name: 'Women on Sale' },
    { slug: 'kids', name: 'Kids on Sale' },
    { slug: 'dresses', name: 'Dresses' },
    { slug: 'tops', name: 'Tops' },
    { slug: 'accessories', name: 'Accessories' },
  ];

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading Sale Collection...</div>}>
      <ProductListingView
        isOnSaleOnly={true}
        pageTitle="Special Celebratory Sale"
        pageSubtitle="Enjoy up to 50% off on your favorite boutique fashion styles. Limited stock available."
        bannerImage="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop"
        breadcrumbs={[{ label: 'Sale' }]}
        availableCategories={categories}
      />
    </Suspense>
  );
}
