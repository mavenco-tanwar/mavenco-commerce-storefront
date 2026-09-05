import React from 'react';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { getDatabase } from '@/lib/mongodb';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { headers, cookies } from 'next/headers';
import { Product } from '@/types/product';
import { CollectionsShowcase } from '@/components/home/CollectionsShowcase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'All Designer Collections | Boutique Atelier',
  description: 'Explore our complete catalog of bespoke silhouettes, handcrafted textiles, and modern luxury co-ords.',
};

interface AllCollectionsPageProps {
  searchParams?: Promise<{ tenant?: string; category?: string; [key: string]: string | string[] | undefined }>;
}

async function resolveTenant(searchParams?: Promise<{ tenant?: string }>): Promise<string> {
  const sp = searchParams ? await searchParams : {};
  if (sp.tenant) return sp.tenant.toLowerCase().trim();

  try {
    const h = await headers();
    const headerTenant = h.get('x-tenant-slug');
    if (headerTenant) return headerTenant.toLowerCase().trim();
  } catch {}

  try {
    const c = await cookies();
    const cookieTenant = c.get('jq_active_tenant')?.value;
    if (cookieTenant) return cookieTenant.toLowerCase().trim();
  } catch {}

  return 'jq-trends';
}

export default async function AllCollectionsPage({ searchParams }: AllCollectionsPageProps) {
  const tenantSlug = await resolveTenant(searchParams);
  let products: Product[] = [];
  let availableCategories = [
    { slug: 'all', name: 'All Categories' },
  ];

  try {
    const db = await getDatabase();
    if (db) {
      const tenantMatch = [
        { tenantSlug },
        { storeSlug: tenantSlug },
        { tenantId: tenantSlug },
        { tenantId: `store_${tenantSlug}` },
      ];

      // 1. Fetch live categories for tenant
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

      // 2. Fetch live products for tenant
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
    console.warn('[AllCollectionsPage] Direct DB fetch error:', err);
  }

  // Fallback to service if DB returned 0 products
  if (products.length === 0) {
    try {
      const prodRes = await ProductApiService.getProducts({ tenant: tenantSlug, limit: 40 });
      products = prodRes.data?.products || [];
    } catch {}
  }

  if (availableCategories.length <= 1) {
    availableCategories = [
      { slug: 'all', name: 'All Categories' },
      { slug: 'women', name: 'Women' },
      { slug: 'kids', name: 'Kids' },
      { slug: 'dresses', name: 'Dresses' },
      { slug: 'co-ords', name: 'Co-Ords' },
      { slug: 'kurtis', name: 'Kurtis' },
      { slug: 'western-wear', name: 'Western Wear' },
    ];
  }

  return (
    <div className="flex flex-col">
      <CollectionsShowcase
        customTitle="Collections & Lookbooks"
        customSubtitle="Curate seasonal edits, attach lookbook products, and organize fashion stories for your boutique."
        customBadge="CURATED ATELIER STORIES"
        tenantSlug={tenantSlug}
      />

      <CollectionListingPage
        initialProducts={products}
        collectionTitle="All Boutique Collections"
        collectionDescription="Discover our complete catalog of handcrafted silhouettes engineered for timeless grace."
        breadcrumbs={[{ label: 'All Collections' }]}
        availableCategories={availableCategories}
      />
    </div>
  );
}
