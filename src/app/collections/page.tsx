import React from 'react';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { getPlatformDatabase, getTenantDatabase } from '@/lib/mongodb';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { headers, cookies } from 'next/headers';
import { Product } from '@/types/product';
import { CollectionPageConfig } from '@/types/collection-page.types';
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
  searchParams?: Promise<{ tenant?: string; category?: string; preview?: string; [key: string]: string | string[] | undefined }>;
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
  const sp = searchParams ? await searchParams : {};
  const isPreview = sp.preview === 'draft';
  const tenantSlug = await resolveTenant(searchParams);
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

    // 1. Resolve tenant's category
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

    // 3. Fetch live categories for tenant
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

    // 4. Fetch live products for tenant
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

  // If no categories in DB, derive dynamically from tenant's actual DB products
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
