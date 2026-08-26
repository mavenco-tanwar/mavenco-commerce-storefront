import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { collectionsData } from '@/data/categories';
import { ProductListingView } from '@/components/plp/ProductListingView';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const resolved = await params;
  const col = collectionsData.find((c) => c.slug === resolved.slug);
  if (!col) return { title: 'Collection | JQ Trends' };
  return {
    title: `${col.name} Lookbook | JQ Trends`,
    description: col.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolved = await params;
  const col = collectionsData.find((c) => c.slug === resolved.slug);
  if (!col) notFound();

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#777777]">Loading Collection...</div>}>
      <ProductListingView
        pageTitle={col.name}
        pageSubtitle={`${col.subtitle} • ${col.description}`}
        bannerImage={col.bannerImage}
        breadcrumbs={[{ label: 'Collections', href: '/women' }, { label: col.name }]}
        availableCategories={[
          { slug: 'women', name: 'Women' },
          { slug: 'kids', name: 'Kids' },
          { slug: 'dresses', name: 'Dresses' },
          { slug: 'co-ords', name: 'Co-ords' },
        ]}
      />
    </Suspense>
  );
}
