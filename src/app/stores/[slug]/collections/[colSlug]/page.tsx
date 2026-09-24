import React from 'react';
import { getDatabase, getTenantDatabase, getPlatformDatabase } from '@/lib/mongodb';
import { ProductApiService } from '@/services/api/products';
import { CategoryApiService } from '@/services/api/categories';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { getDefaultCollectionPageConfig } from '@/lib/collection-page-presets';
import { CollectionPageConfig } from '@/types/collection-page.types';
import { formatTenantHref } from '@/lib/tenant-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TenantCollectionLookbookPageProps {
  params: Promise<{ slug: string; colSlug: string }>;
}

export async function generateMetadata({ params }: TenantCollectionLookbookPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const rawColSlug = decodeURIComponent(resolved.colSlug || '').trim();

  try {
    const tenantDb = await getTenantDatabase(tenantSlug);
    const platformDb = await getPlatformDatabase();
    const dbsToTry = [tenantDb, platformDb].filter(Boolean);

    for (const db of dbsToTry) {
      if (!db) continue;
      const col = await db.collection('collections').findOne({
        $or: [{ slug: rawColSlug }, { id: rawColSlug }],
      });
      if (col) {
        const title = col.title || col.name || 'Lookbook Collection';
        return {
          title: `${title} | Lookbook Collection`,
          description: col.description || `Explore our curated ${title} lookbook collection.`,
        };
      }
    }
  } catch {}

  return {
    title: `${rawColSlug.replace(/-/g, ' ').toUpperCase()} | Lookbook Collection`,
    description: 'Explore our curated lookbook collection.',
  };
}

export default async function TenantCollectionLookbookPage({ params }: TenantCollectionLookbookPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const rawColSlug = decodeURIComponent(resolved.colSlug || '').trim();

  let col: any = null;
  let productsToRender: any[] = [];
  let dbCategories: { slug: string; name: string }[] = [];
  let dbConfig: CollectionPageConfig | null = null;

  try {
    const tenantDb = await getTenantDatabase(tenantSlug);
    const platformDb = await getPlatformDatabase();
    const dbsToTry = [tenantDb, platformDb].filter(Boolean);

    // 1. Fetch Collection Page Config from MongoDB
    for (const db of dbsToTry) {
      if (!db) continue;
      try {
        const configDoc = await db.collection('collection_page_configs').findOne(
          {
            $or: [
              { tenantSlug: tenantSlug, status: 'published' },
              { tenantId: tenantSlug, status: 'published' },
              { tenantSlug: tenantSlug },
              { tenantId: tenantSlug },
            ],
          },
          { sort: { publishedAt: -1, updatedAt: -1 } }
        );

        if (configDoc?.config) {
          dbConfig = configDoc.config;
          break;
        } else if (configDoc && configDoc.hero) {
          const { _id, ...clean } = configDoc;
          dbConfig = clean as any;
          break;
        }
      } catch (err) {
        console.warn(`[TenantCollectionLookbookPage] config fetch warning from ${db.databaseName}:`, err);
      }
    }

    // 2. Fetch categories from tenant DB
    for (const db of dbsToTry) {
      if (!db) continue;
      try {
        const catDocs = await db.collection('categories').find({
          $or: [
            { tenantSlug: tenantSlug },
            { storeSlug: tenantSlug },
            { tenantId: tenantSlug },
            { tenantId: `store_${tenantSlug}` },
          ],
        }).sort({ displayOrder: 1 }).toArray();

        if (catDocs.length > 0) {
          dbCategories = catDocs.map((c: any) => ({
            slug: (c.slug || c.id || '').toLowerCase().trim(),
            name: c.name || c.title || '',
          })).filter((c) => c.slug && c.name);
          break;
        }
      } catch (err) {
        console.warn(`[TenantCollectionLookbookPage] categories fetch warning from ${db.databaseName}:`, err);
      }
    }

    // 3. Find collection record
    for (const db of dbsToTry) {
      if (!db) continue;
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(rawColSlug) && rawColSlug.length === 24) objId = new ObjectId(rawColSlug);
      } catch {}

      col = await db.collection('collections').findOne({
        $or: [{ slug: rawColSlug }, { id: rawColSlug }, ...(objId ? [{ _id: objId }] : [])],
      });

      if (col) {
        const assignedIds = Array.isArray(col.productIds) ? col.productIds : [];
        const orConditions: any[] = [];
        if (assignedIds.length > 0) {
          orConditions.push({ id: { $in: assignedIds } }, { slug: { $in: assignedIds } });
        }
        orConditions.push(
          { collectionIds: col.id },
          { collectionIds: col.slug },
          { collections: col.id },
          { collections: col.slug }
        );

        const prodDocs = await db.collection('products')
          .find({
            $and: [
              {
                $or: [
                  { tenantSlug },
                  { storeSlug: tenantSlug },
                  { tenantId: tenantSlug },
                  { tenantId: `store_${tenantSlug}` },
                ],
              },
              { $or: orConditions },
            ],
          })
          .sort({ createdAt: -1 })
          .toArray();

        if (prodDocs.length > 0) {
          productsToRender = prodDocs.map(mapCmsProductToStorefrontProduct);
        }
        break;
      }
    }
  } catch (err) {
    console.warn('[TenantCollectionLookbookPage] Direct DB fetch error:', err);
  }

  // Fallback to API service
  if (!col) {
    const colRes = await CategoryApiService.getCollectionBySlug(rawColSlug, tenantSlug);
    col = colRes.data;
  }

  const collectionTitle = col ? (col.title || col.name) : rawColSlug.replace(/-/g, ' ').toUpperCase();
  const collectionDesc = col ? (col.description || col.subtitle || `Curated ${collectionTitle} assortment.`) : `Curated ${collectionTitle} assortment.`;
  const bannerImg = col ? (col.imageUrl || col.bannerImage || col.image) : undefined;

  if (productsToRender.length === 0 && col && Array.isArray(col.productIds) && col.productIds.length > 0) {
    try {
      const prodRes = await ProductApiService.getProducts({
        ids: col.productIds.join(','),
        limit: 50,
        tenant: tenantSlug,
      } as any);
      productsToRender = prodRes.data?.products || [];
    } catch {}
  }

  if (productsToRender.length === 0) {
    try {
      const prodRes = await ProductApiService.getProducts({ category: rawColSlug, limit: 30, tenant: tenantSlug });
      productsToRender = prodRes.data?.products || [];
    } catch {}
  }

  const effectiveConfig: CollectionPageConfig = dbConfig || getDefaultCollectionPageConfig(tenantSlug);

  const availableCategories = [
    { slug: 'all', name: 'All in Collection' },
    ...(dbCategories.length > 0
      ? dbCategories
      : Array.from(new Set(productsToRender.map((p) => p.category).filter(Boolean))).map((cat) => ({
          slug: String(cat).toLowerCase().trim(),
          name: String(cat).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        }))),
  ];

  return (
    <CollectionListingPage
      initialConfig={effectiveConfig}
      initialProducts={productsToRender}
      collectionTitle={collectionTitle}
      collectionDescription={collectionDesc}
      collectionBannerImage={bannerImg}
      breadcrumbs={[
        { label: 'Store', href: formatTenantHref('/', tenantSlug) },
        { label: 'Collections', href: formatTenantHref('/collections', tenantSlug) },
        { label: collectionTitle },
      ]}
      availableCategories={availableCategories}
    />
  );
}
