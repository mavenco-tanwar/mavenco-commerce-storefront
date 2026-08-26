import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { categoriesData } from '@/data/categories';

export const metadata = {
  title: "Kids' Fashion Collection (Ages 2-12Y) | JQ Trends",
  description:
    'Adorable and skin-friendly kids clothing. Explore girls party frocks, boys nehru jacket sets, and cotton dungarees at JQ Trends.',
};

export default function KidsPage() {
  const kidsCat = categoriesData.find((c) => c.slug === 'kids');
  const subcategories = kidsCat
    ? kidsCat.subcategories.map((s) => ({ slug: s.slug, name: s.name, count: s.itemCount }))
    : [];

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading Kids&apos; Collection...</div>}>
      <ProductListingView
        department="kids"
        pageTitle="Little Looks, Big Style"
        pageSubtitle="Adorable, 100% organic cotton lined partywear, occasion sets & everyday play outfits for kids."
        bannerImage="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1600&auto=format&fit=crop"
        breadcrumbs={[{ label: 'Kids' }]}
        availableCategories={subcategories}
      />
    </Suspense>
  );
}
