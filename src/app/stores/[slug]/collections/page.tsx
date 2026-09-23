import React from 'react';
import { getDatabase } from '@/lib/mongodb';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { formatTenantHref } from '@/lib/tenant-config';
import { Product } from '@/types/product';
import {
  getDefaultCollectionPageConfig,
  inferCategoryFromTenant,
} from '@/lib/collection-page-presets';
import { resolveBlueprintPreset } from '@/lib/server/tenant-blueprint';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TenantCollectionsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TenantCollectionsPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const catKey = inferCategoryFromTenant(tenantSlug);
  const cfg = getDefaultCollectionPageConfig(tenantSlug, catKey);

  return {
    title: `${cfg.name} | ${tenantSlug.toUpperCase()}`,
    description:
      cfg.seo?.metaDescription ||
      cfg.hero?.description ||
      'Explore our complete catalog of curated collections.',
  };
}

export default async function TenantCollectionsPage({ params }: TenantCollectionsPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
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

      // 1. Resolve tenant's installed category / blueprint
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

  // Fallback to service if DB returned 0 products
  if (products.length === 0) {
    try {
      const prodRes = await ProductApiService.getProducts({ tenant: tenantSlug, limit: 40 });
      products = prodRes.data?.products || [];
    } catch {}
  }

  // Resolve Blueprint Config for this tenant's category
  const blueprintConfig = getDefaultCollectionPageConfig(tenantSlug, categoryKey);

  // If no custom categories exist in DB, use the category blueprint's defaults
  if (availableCategories.length <= 1 && blueprintConfig.defaultCategories) {
    availableCategories = blueprintConfig.defaultCategories;
  }

  // If still 0 products, seed fallback products from the category blueprint
  if (products.length === 0) {
    const blueprintData = resolveBlueprintPreset(categoryKey);
    if (blueprintData && Array.isArray(blueprintData.products) && blueprintData.products.length > 0) {
      products = blueprintData.products.map(mapCmsProductToStorefrontProduct);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Unified Category & Collection Catalog with Instant Background Banner */}
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
