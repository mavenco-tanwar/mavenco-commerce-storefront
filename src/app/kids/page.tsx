import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { CategoryApiService } from '@/services/api/categories';

export const metadata = {
  title: "Kids' Fashion Collection (Ages 2-12Y) | Boutique Atelier",
  description:
    'Adorable and skin-friendly kids clothing. Explore girls party frocks, boys festive sets, and cotton dungarees.',
};

export default async function KidsPage() {
  const catRes = await CategoryApiService.getCategories('kids');
  const kidsCats = catRes.data || [];
  const subcategories = kidsCats.flatMap((c) =>
    (c.subcategories || []).map((s) => ({ slug: s.slug, name: s.name, count: s.itemCount }))
  );

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading Kids&apos; Collection...</div>}>
      <ProductListingView
        department="kids"
        pageTitle="Little Looks, Big Style"
        pageSubtitle="Adorable, organic cotton lined partywear, occasion sets & everyday play outfits for kids."
        bannerImage="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1600&auto=format&fit=crop"
        breadcrumbs={[{ label: 'Kids' }]}
        availableCategories={subcategories}
      />
    </Suspense>
  );
}
