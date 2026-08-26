import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/plp/ProductListingView';

export const metadata = {
  title: 'Fresh From The Studio • New Arrivals | JQ Trends',
  description:
    'Discover the newest fashion arrivals for women and kids, designed in limited boutique batches at JQ Trends.',
};

export default function NewArrivalsPage() {
  const categories = [
    { slug: 'women', name: 'Women' },
    { slug: 'kids', name: 'Kids' },
    { slug: 'dresses', name: 'Dresses' },
    { slug: 'kurtis', name: 'Kurtis' },
    { slug: 'co-ords', name: 'Co-ords' },
  ];

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading New Arrivals...</div>}>
      <ProductListingView
        isNewArrivalsOnly={true}
        pageTitle="Fresh From The Studio"
        pageSubtitle="New season silhouettes, breezy linen tailoring & fresh floral designs just released."
        bannerImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
        breadcrumbs={[{ label: 'New Arrivals' }]}
        availableCategories={categories}
      />
    </Suspense>
  );
}
