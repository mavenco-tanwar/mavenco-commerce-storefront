import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { CategoryApiService } from '@/services/api/categories';

export const metadata = {
  title: "Women's Fashion Collection | Boutique Atelier",
  description:
    'Shop refined dresses, contemporary co-ords, tops, and tailored boutique silhouettes.',
};

export default async function WomenPage() {
  const catRes = await CategoryApiService.getCategories('women');
  const womenCats = catRes.data || [];
  const subcategories = womenCats.flatMap((c) =>
    (c.subcategories || []).map((s) => ({ slug: s.slug, name: s.name, count: s.itemCount }))
  );

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading Women's Collection...</div>}>
      <ProductListingView
        department="women"
        pageTitle="Women's Collection"
        pageSubtitle="Discover handpicked contemporary dresses, flowing silhouettes, and artisan co-ords."
        categories={subcategories}
        bannerImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
      />
    </Suspense>
  );
}
