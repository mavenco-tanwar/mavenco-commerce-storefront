import React from 'react';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { getDatabase } from '@/lib/mongodb';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { headers, cookies } from 'next/headers';
import { Product } from '@/types/product';
import {
  getDefaultCollectionPageConfig,
  inferCategoryFromTenant,
} from '@/lib/collection-page-presets';
import { resolveBlueprintPreset } from '@/lib/server/tenant-blueprint';
import { formatTenantHref } from '@/lib/tenant-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'All Collections | Designer Storefront',
  description: 'Explore our complete catalog of curated collections and signature edits.',
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
  const cleanTenant = tenantSlug.replace(/^(store_|_)/, '').trim();

  let products: Product[] = [];
  let availableCategories = [{ slug: 'all', name: 'All Categories' }];
  let categoryKey = inferCategoryFromTenant(tenantSlug);

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

      // 1. Resolve tenant's category
      const tenantDoc = await db.collection('tenants').findOne({
        $or: [{ slug: tenantSlug }, { id: tenantSlug }, { id: `store_${tenantSlug}` }, { slug: cleanTenant }],
      });
      if (tenantDoc?.category || tenantDoc?.preset) {
        categoryKey = (tenantDoc.category || tenantDoc.preset).toLowerCase().trim();
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

      // 3. Fetch live products for tenant
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

  const blueprintConfig = getDefaultCollectionPageConfig(tenantSlug, categoryKey);

  // If no categories in DB, use blueprint categories (e.g. jewelry or grocery, NOT generic clothes!)
  if (availableCategories.length <= 1 && blueprintConfig.defaultCategories) {
    availableCategories = blueprintConfig.defaultCategories;
  }

  // If still 0 products, seed fallback products from category blueprint
  if (products.length === 0) {
    const blueprintData = resolveBlueprintPreset(categoryKey);
    if (blueprintData && Array.isArray(blueprintData.products) && blueprintData.products.length > 0) {
      products = blueprintData.products.map(mapCmsProductToStorefrontProduct);
    }
  }

  return (
    <div className="flex flex-col">
      <CollectionListingPage
        initialProducts={products}
        collectionTitle={blueprintConfig.hero.title}
        collectionDescription={blueprintConfig.hero.description}
        collectionBannerImage={blueprintConfig.hero.bgImage}
        breadcrumbs={[
          { label: 'Store', href: formatTenantHref('/', tenantSlug) },
          { label: 'Collections' },
        ]}
        availableCategories={availableCategories}
        tenantSlug={tenantSlug}
      />
    </div>
  );
}
