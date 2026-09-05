import React from 'react';
import { getDatabase } from '@/lib/mongodb';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { CollectionsShowcase } from '@/components/home/CollectionsShowcase';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { formatTenantHref } from '@/lib/tenant-config';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TenantCollectionsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TenantCollectionsPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  return {
    title: `Designer Collections & Lookbooks | ${tenantSlug.toUpperCase()}`,
    description: 'Explore our complete catalog of curated seasonal lookbooks and signature fashion stories.',
  };
}

export default async function TenantCollectionsPage({ params }: TenantCollectionsPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const cleanTenant = tenantSlug.replace(/^(store_|_)/, '').trim();

  let products: Product[] = [];
  let availableCategories = [{ slug: 'all', name: 'All Categories' }];
  let collections: any[] = [];

  try {
    const db = await getDatabase();
    if (db) {
      const tenantMatch = [
        { tenantSlug },
        { storeSlug: tenantSlug },
        { tenantId: tenantSlug },
        { tenantId: `store_${tenantSlug}` },
        { tenantId: cleanTenant },
        { tenantSlug: cleanTenant },
        { storeSlug: cleanTenant },
      ];

      // 1. Fetch live collections / lookbooks for tenant
      const colDocs = await db.collection('collections')
        .find({ $or: tenantMatch })
        .sort({ createdAt: -1 })
        .toArray();

      if (colDocs.length > 0) {
        collections = colDocs.map(({ _id, ...rest }) => ({
          ...rest,
          id: rest.id || _id?.toString(),
          title: rest.title || rest.name,
        }));
      }

      // 2. Fetch live categories for tenant
      const catDocs = await db.collection('categories')
        .find({ $or: tenantMatch })
        .sort({ displayOrder: 1 })
        .toArray();

      if (catDocs.length > 0) {
        const mapped = catDocs.map((c: any) => ({
          slug: c.slug || c.id,
          name: c.name || c.title || 'Category',
        }));
        availableCategories = [{ slug: 'all', name: 'All Categories' }, ...mapped];
      }

      // 3. Fetch products for tenant
      const prodDocs = await db.collection('products')
        .find({
          $and: [
            { $or: tenantMatch },
            { status: { $ne: 'draft' } },
            { status: { $ne: 'archived' } },
          ],
        })
        .sort({ createdAt: -1 })
        .toArray();

      if (prodDocs.length > 0) {
        products = prodDocs.map(mapCmsProductToStorefrontProduct);
      }
    }
  } catch (err) {
    console.warn('[TenantCollectionsPage] DB fetch error:', err);
  }

  if (products.length === 0) {
    try {
      const prodRes = await ProductApiService.getProducts({ tenant: tenantSlug, limit: 40 });
      products = prodRes.data?.products || [];
    } catch {}
  }

  return (
    <div className="flex flex-col">
      {/* Visual Collections & Lookbooks Showcase Header */}
      <CollectionsShowcase
        customTitle="Collections & Lookbooks"
        customSubtitle="Curate seasonal edits, attach lookbook products, and organize fashion stories for your boutique."
        customBadge="CURATED ATELIER STORIES"
        customCollections={collections.length > 0 ? collections : undefined}
        tenantSlug={tenantSlug}
      />

      {/* Catalog Listing with Filters */}
      <CollectionListingPage
        initialProducts={products}
        collectionTitle="All Lookbook Creations"
        collectionDescription="Discover handcrafted silhouettes tailored for contemporary poise and timeless celebrations."
        breadcrumbs={[
          { label: 'Store', href: formatTenantHref('/', tenantSlug) },
          { label: 'Collections & Lookbooks' },
        ]}
        availableCategories={availableCategories}
      />
    </div>
  );
}
