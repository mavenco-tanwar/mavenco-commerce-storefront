import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { categoriesData } from '@/data/categories';

export const metadata = {
  title: "Women's Fashion Collection | JQ Trends",
  description:
    'Shop the finest women’s dresses, chanderi kurtis, linen co-ords, tops, and tailored bottoms at JQ Trends.',
};

export default function WomenPage() {
  const womenCat = categoriesData.find((c) => c.slug === 'women');
  const subcategories = womenCat
    ? womenCat.subcategories.map((s) => ({ slug: s.slug, name: s.name, count: s.itemCount }))
    : [];

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading Women&apos;s Collection...</div>}>
      <ProductListingView
        department="women"
        pageTitle="Women's Fashion Collection"
        pageSubtitle="Runway elegance meets daily comfort: dresses, kurtis, co-ords & tops crafted to perfection."
        bannerImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
        breadcrumbs={[{ label: 'Women' }]}
        availableCategories={subcategories}
      />
    </Suspense>
  );
}
