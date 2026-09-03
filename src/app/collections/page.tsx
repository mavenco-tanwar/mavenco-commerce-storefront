import React from 'react';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';

export const metadata = {
  title: 'All Designer Collections | Boutique Atelier',
  description: 'Explore our complete catalog of bespoke silhouettes, handcrafted textiles, and modern luxury co-ords.',
};

export default async function AllCollectionsPage() {
  const prodRes = await ProductApiService.getProducts({ limit: 40 });
  const products = prodRes.data?.products || [];

  return (
    <CollectionListingPage
      initialProducts={products}
      collectionTitle="All Boutique Collections"
      collectionDescription="Discover our complete catalog of handcrafted silhouettes engineered for timeless grace."
      breadcrumbs={[{ label: 'All Collections' }]}
      availableCategories={[
        { slug: 'all', name: 'All Categories' },
        { slug: 'women', name: 'Women' },
        { slug: 'kids', name: 'Kids' },
        { slug: 'dresses', name: 'Dresses' },
        { slug: 'co-ords', name: 'Co-Ords' },
        { slug: 'kurtis', name: 'Kurtis' },
        { slug: 'western-wear', name: 'Western Wear' },
      ]}
    />
  );
}
