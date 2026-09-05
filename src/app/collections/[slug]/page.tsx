import React from 'react';
import { CategoryApiService } from '@/services/api/categories';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const resolved = await params;
  const colRes = await CategoryApiService.getCollectionBySlug(resolved.slug);
  const col = colRes.data;

  if (!col) return { title: 'Designer Collection | Boutique Atelier' };
  return {
    title: `${col.name} Lookbook | Boutique Atelier`,
    description: col.description || 'Explore our seasonal lookbook collection.',
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolved = await params;
  const colRes = await CategoryApiService.getCollectionBySlug(resolved.slug);
  const col = colRes.data;

  const collectionTitle = col ? col.name : resolved.slug.replace(/-/g, ' ').toUpperCase();
  const collectionDesc = col ? `${col.subtitle} — ${col.description}` : 'Explore our curated seasonal assortment of bespoke luxury garments.';
  const bannerImg = col ? col.bannerImage : undefined;

  let productsToRender: any[] = [];
  if (col && Array.isArray(col.productIds) && col.productIds.length > 0) {
    const prodRes = await ProductApiService.getProducts({
      ids: col.productIds.join(','),
      limit: 50,
    } as any);
    productsToRender = prodRes.data?.products || [];
  }

  if (productsToRender.length === 0) {
    const prodRes = await ProductApiService.getProducts({ category: resolved.slug, limit: 30 });
    productsToRender = prodRes.data?.products || [];
  }

  return (
    <CollectionListingPage
      initialProducts={productsToRender}
      collectionTitle={collectionTitle}
      collectionDescription={collectionDesc}
      bannerImage={bannerImg}
      breadcrumbs={[
        { label: 'Collections', href: '/collections' },
        { label: collectionTitle },
      ]}
      availableCategories={[
        { slug: 'all', name: 'All in Collection' },
        { slug: 'dresses', name: 'Dresses' },
        { slug: 'co-ords', name: 'Co-Ords' },
        { slug: 'kurtis', name: 'Kurtis' },
        { slug: 'party-wear', name: 'Party Wear' },
      ]}
    />
  );
}
