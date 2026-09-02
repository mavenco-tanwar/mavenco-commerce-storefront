import React from 'react';
import { productsData } from '@/data/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';

export const metadata = {
  title: 'All Designer Collections | Atelier Storefront',
  description: 'Explore our complete catalog of bespoke silhouettes, handcrafted textiles, and modern luxury co-ords.',
};

export default function AllCollectionsPage() {
  return (
    <CollectionListingPage
      initialProducts={productsData}
      collectionTitle="All Atelier Creations"
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
