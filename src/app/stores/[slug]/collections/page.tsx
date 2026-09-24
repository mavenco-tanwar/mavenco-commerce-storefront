import React from 'react';
import { getPlatformDatabase, getTenantDatabase } from '@/lib/mongodb';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { formatTenantHref } from '@/lib/tenant-config';
import { Product } from '@/types/product';
import { CollectionPageConfig } from '@/types/collection-page.types';
import {
  getDefaultCollectionPageConfig,
  inferCategoryFromTenant,
} from '@/lib/collection-page-presets';
import { resolveBlueprintPreset } from '@/lib/server/tenant-blueprint';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TenantCollectionsPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: TenantCollectionsPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const cleanTenant = tenantSlug.replace(/^(store_|_)/, '').trim();

  let categoryKey = inferCategoryFromTenant(tenantSlug);
  let customConfig: CollectionPageConfig | null = null;

  try {
    const tenantDb = await getTenantDatabase(tenantSlug);
    const platformDb = await getPlatformDatabase();

    const tenantMatch = [
      { tenantSlug },
      { storeSlug: tenantSlug },
      { tenantId: tenantSlug },
      { tenantId: `store_${tenantSlug}` },
      { tenantId: cleanTenant },
      { tenantSlug: cleanTenant },
      { storeSlug: cleanTenant },
    ];

    if (platformDb) {
      const tenantDoc = await platformDb.collection('tenants').findOne({
        $or: [{ slug: tenantSlug }, { id: tenantSlug }, { id: `store_${tenantSlug}` }, { slug: cleanTenant }],
      });
      if (tenantDoc?.category || tenantDoc?.preset) {
        categoryKey = (tenantDoc.category || tenantDoc.preset).toLowerCase().trim();
      }
    }

    const doc =
      (tenantDb &&
        (await tenantDb.collection('collection_page_configs').findOne(
          {
            $and: [
              { $or: tenantMatch },
              { $or: [{ status: 'published' }, { published: { $exists: true, $ne: null } }] },
            ],
          },
          { sort: { publishedAt: -1, updatedAt: -1 } }
        ))) ||
      (platformDb &&
        (await platformDb.collection('collection_page_configs').findOne(
          {
            $and: [
              { $or: tenantMatch },
              { $or: [{ status: 'published' }, { published: { $exists: true, $ne: null } }] },
            ],
          },
          { sort: { publishedAt: -1, updatedAt: -1 } }
        )));

    if (doc) {
      customConfig = (doc.published || doc.draft || doc) as CollectionPageConfig;
    }
  } catch (err) {
    console.warn('[TenantCollectionsPage.generateMetadata] DB warning:', err);
  }

  const blueprint = getDefaultCollectionPageConfig(tenantSlug, categoryKey);
  const cfg = customConfig ? { ...blueprint, ...customConfig } : blueprint;

  return {
    title: cfg.seo?.metaTitle || `${cfg.name || cfg.hero?.title} | ${tenantSlug.toUpperCase()}`,
    description:
      cfg.seo?.metaDescription ||
      cfg.hero?.description ||
      'Explore our complete catalog of curated collections.',
  };
}

export default async function TenantCollectionsPage({ params, searchParams }: TenantCollectionsPageProps) {
  const resolved = await params;
  const sp = searchParams ? await searchParams : {};
  const isPreview = sp.preview === 'draft';
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const cleanTenant = tenantSlug.replace(/^(store_|_)/, '').trim();

  let products: Product[] = [];
  let availableCategories = [{ slug: 'all', name: 'All Categories' }];
  let categoryKey = inferCategoryFromTenant(tenantSlug);
  let tenantCustomConfig: CollectionPageConfig | null = null;

  try {
    const tenantDb = await getTenantDatabase(tenantSlug);
    const platformDb = await getPlatformDatabase();

    const tenantMatch = [
      { tenantSlug },
      { storeSlug: tenantSlug },
      { tenantId: tenantSlug },
      { tenantId: `store_${tenantSlug}` },
      { tenantId: cleanTenant },
      { tenantSlug: cleanTenant },
      { storeSlug: cleanTenant },
    ];

    // 1. Resolve tenant's category & blueprint from platform registry
    if (platformDb) {
      const tenantDoc = await platformDb.collection('tenants').findOne({
        $or: [{ slug: tenantSlug }, { id: tenantSlug }, { id: `store_${tenantSlug}` }, { slug: cleanTenant }],
      });
      if (tenantDoc?.category || tenantDoc?.preset) {
        categoryKey = (tenantDoc.category || tenantDoc.preset).toLowerCase().trim();
      }
    }

    // 2. Fetch tenant-specific collection page configuration from DB
    const configQuery = isPreview
      ? { $or: tenantMatch }
      : {
          $and: [
            { $or: tenantMatch },
            { $or: [{ status: 'published' }, { published: { $exists: true, $ne: null } }] },
          ],
        };

    const configDoc =
      (tenantDb &&
        (await tenantDb.collection('collection_page_configs').findOne(configQuery, {
          sort: { publishedAt: -1, updatedAt: -1 },
        }))) ||
      (platformDb &&
        (await platformDb.collection('collection_page_configs').findOne(configQuery, {
          sort: { publishedAt: -1, updatedAt: -1 },
        })));

    if (configDoc) {
      const rawCfg = isPreview
        ? configDoc.draft || configDoc.published || configDoc
        : configDoc.published || configDoc.draft || configDoc;
      tenantCustomConfig = rawCfg as CollectionPageConfig;
    }

    // 3. Fetch live categories for tenant from DB
    const catDocs =
      (tenantDb &&
        (await tenantDb.collection('categories')
          .find({ $or: tenantMatch })
          .sort({ displayOrder: 1 })
          .toArray())) ||
      (platformDb &&
        (await platformDb.collection('categories')
          .find({ $or: tenantMatch })
          .sort({ displayOrder: 1 })
          .toArray())) ||
      [];

    if (catDocs.length > 0) {
      const mapped = catDocs.map((c: any) => ({
        slug: c.slug || c.id,
        name: c.name || c.title || 'Category',
      }));
      availableCategories = [{ slug: 'all', name: 'All Categories' }, ...mapped];
    }

    // 4. Fetch live products for tenant from DB
    const prodDocs =
      (tenantDb &&
        (await tenantDb.collection('products')
          .find({
            $and: [
              { $or: tenantMatch },
              { status: { $ne: 'draft' } },
              { status: { $ne: 'archived' } },
            ],
          })
          .sort({ createdAt: -1 })
          .toArray())) ||
      (platformDb &&
        (await platformDb.collection('products')
          .find({
            $and: [
              { $or: tenantMatch },
              { status: { $ne: 'draft' } },
              { status: { $ne: 'archived' } },
            ],
          })
          .sort({ createdAt: -1 })
          .toArray())) ||
      [];

    if (prodDocs.length > 0) {
      products = prodDocs.map(mapCmsProductToStorefrontProduct);
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

  // Resolve Blueprint Config for fallback merge
  const blueprintConfig = getDefaultCollectionPageConfig(tenantSlug, categoryKey);

  // Merge DB config with blueprint defaults
  const effectiveConfig: CollectionPageConfig = tenantCustomConfig
    ? {
        ...blueprintConfig,
        ...tenantCustomConfig,
        styles: {
          ...(blueprintConfig.styles || {}),
          ...(tenantCustomConfig.styles || {}),
        },
        hero: {
          ...(blueprintConfig.hero || {}),
          ...(tenantCustomConfig.hero || {}),
        },
        promo: {
          ...(blueprintConfig.promo || {}),
          ...(tenantCustomConfig.promo || {}),
        },
        filters: {
          ...(blueprintConfig.filters || {}),
          ...(tenantCustomConfig.filters || {}),
        },
        toolbar: {
          ...(blueprintConfig.toolbar || {}),
          ...(tenantCustomConfig.toolbar || {}),
        },
        sorting: {
          ...(blueprintConfig.sorting || {}),
          ...(tenantCustomConfig.sorting || {}),
        },
        grid: {
          ...(blueprintConfig.grid || {}),
          ...(tenantCustomConfig.grid || {}),
        },
        pagination: {
          ...(blueprintConfig.pagination || {}),
          ...(tenantCustomConfig.pagination || {}),
        },
      }
    : blueprintConfig;

  // If no custom categories exist in DB, derive dynamically from tenant's actual DB products
  if (availableCategories.length <= 1) {
    const derivedCats: Array<{ slug: string; name: string }> = [];
    const seen = new Set<string>();

    for (const p of products) {
      const rawCat = (p as any).categorySlug || (p as any).categoryName || p.category || (p as any).department;
      if (rawCat) {
        const slug = String(rawCat).toLowerCase().replace(/^cat_/, '').replace(/_[a-z0-9-]+$/, '').trim();
        const name = (p as any).categoryName || slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        if (slug && !seen.has(slug)) {
          seen.add(slug);
          derivedCats.push({ slug, name });
        }
      }
    }

    if (derivedCats.length > 0) {
      availableCategories = [{ slug: 'all', name: 'All Categories' }, ...derivedCats];
    } else if (blueprintConfig.defaultCategories) {
      availableCategories = blueprintConfig.defaultCategories;
    }
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
      {/* Unified Category & Collection Catalog with Instant DB Background Banner & Styles */}
      <CollectionListingPage
        initialConfig={effectiveConfig}
        initialProducts={products}
        collectionTitle={effectiveConfig.hero?.title || blueprintConfig.hero.title}
        collectionDescription={effectiveConfig.hero?.description || blueprintConfig.hero.description}
        collectionBannerImage={effectiveConfig.hero?.bgImage || blueprintConfig.hero.bgImage}
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
