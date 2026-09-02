import React from 'react';
import { notFound } from 'next/navigation';
import { collectionsData } from '@/data/categories';
import { productsData } from '@/data/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const resolved = await params;
  const col = collectionsData.find((c) => c.slug === resolved.slug);
  if (!col) return { title: 'Designer Collection | Atelier' };
  return {
    title: `${col.name} Lookbook | Atelier Storefront`,
    description: col.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolved = await params;
  const col = collectionsData.find((c) => c.slug === resolved.slug);

  // If not in seed collections, still allow general browsing
  const collectionTitle = col ? col.name : resolved.slug.replace(/-/g, ' ').toUpperCase();
  const collectionDesc = col ? `${col.subtitle} — ${col.description}` : 'Explore our curated seasonal assortment of bespoke luxury garments.';
  const bannerImg = col ? col.bannerImage : undefined;

  // Filter products matching collection slug or default to all
  const filteredProds = productsData.filter((p) => {
    if (!col) return true;
    return (
      p.category?.toLowerCase() === resolved.slug.toLowerCase() ||
      p.department?.toLowerCase() === resolved.slug.toLowerCase()
    );
  });

  const productsToRender = filteredProds.length > 0 ? filteredProds : productsData;

  return (
    <CollectionListingPage
      initialProducts={productsToRender}
      collectionTitle={collectionTitle}
      collectionDescription={collectionDesc}
      collectionBannerImage={bannerImg}
      breadcrumbs={[
        { label: 'Collections', href: '/collections' },
        { label: collectionTitle },
      ]}
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
