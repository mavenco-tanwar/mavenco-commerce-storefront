import React from 'react';
import { CategoryApiService } from '@/services/api/categories';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';

import { getDatabase, getTenantDatabase, getPlatformDatabase } from '@/lib/mongodb';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { getDefaultCollectionPageConfig } from '@/lib/collection-page-presets';
import { CollectionPageConfig } from '@/types/collection-page.types';
import { formatTenantHref } from '@/lib/tenant-config';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tenant?: string }>;
}

export async function generateMetadata({ params, searchParams }: CollectionPageProps) {
  const resolved = await params;
  const sp = searchParams ? await searchParams : {};
  const rawSlug = decodeURIComponent(resolved.slug || '').trim();
  const tenantSlug = sp.tenant ? sp.tenant.toLowerCase().trim() : undefined;

  try {
    const tenantDb = tenantSlug ? await getTenantDatabase(tenantSlug) : null;
    const platformDb = await getPlatformDatabase();
    const dbsToTry = [tenantDb, platformDb].filter(Boolean);

    for (const db of dbsToTry) {
      if (!db) continue;
      const col = await db.collection('collections').findOne({
        $or: [{ slug: rawSlug }, { id: rawSlug }],
      });
      if (col) {
        const title = col.title || col.name || 'Lookbook Collection';
        return {
          title: `${title} Lookbook | Boutique Atelier`,
          description: col.description || `Explore our seasonal ${title} collection.`,
        };
      }
    }
  } catch {}

  const colRes = await CategoryApiService.getCollectionBySlug(rawSlug, tenantSlug);
  const col = colRes.data;

  if (!col) return { title: 'Designer Collection | Boutique Atelier' };
  return {
    title: `${col.name} Lookbook | Boutique Atelier`,
    description: col.description || 'Explore our seasonal lookbook collection.',
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const resolved = await params;
  const sp = searchParams ? await searchParams : {};
  const rawSlug = decodeURIComponent(resolved.slug || '').trim();
  const tenantSlug = sp.tenant ? sp.tenant.toLowerCase().trim() : undefined;

  let col: any = null;
  let productsToRender: any[] = [];
  let dbConfig: CollectionPageConfig | null = null;
  let dbCategories: { slug: string; name: string }[] = [];

  try {
    const tenantDb = tenantSlug ? await getTenantDatabase(tenantSlug) : null;
    const platformDb = await getPlatformDatabase();
    const dbsToTry = [tenantDb, platformDb].filter(Boolean);

    if (tenantSlug) {
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
        } catch {}
      }
    }

    // 2. Fetch categories from tenant DB
    if (tenantSlug) {
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
        } catch {}
      }
    }

    // 3. Find collection record
    for (const db of dbsToTry) {
      if (!db) continue;
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(rawSlug) && rawSlug.length === 24) objId = new ObjectId(rawSlug);
      } catch {}

      col = await db.collection('collections').findOne({
        $or: [{ slug: rawSlug }, { id: rawSlug }, ...(objId ? [{ _id: objId }] : [])],
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

        const prodQuery: any = { $or: orConditions };
        if (tenantSlug) {
          prodQuery.$and = [
            {
              $or: [
                { tenantSlug },
                { storeSlug: tenantSlug },
                { tenantId: tenantSlug },
                { tenantId: `store_${tenantSlug}` },
              ],
            },
            { $or: orConditions },
          ];
          delete prodQuery.$or;
        }

        const prodDocs = await db.collection('products')
          .find(prodQuery)
          .sort({ createdAt: -1 })
          .toArray();

        if (prodDocs.length > 0) {
          productsToRender = prodDocs.map(mapCmsProductToStorefrontProduct);
        }
        break;
      }
    }
  } catch (err) {
    console.warn('[CollectionPage] Direct DB fetch error:', err);
  }

  // Fallback to API service if not found in direct DB
  if (!col) {
    const colRes = await CategoryApiService.getCollectionBySlug(rawSlug, tenantSlug);
    col = colRes.data;
  }

  const collectionTitle = col ? (col.title || col.name) : rawSlug.replace(/-/g, ' ').toUpperCase();
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
      const prodRes = await ProductApiService.getProducts({ category: rawSlug, limit: 30, tenant: tenantSlug });
      productsToRender = prodRes.data?.products || [];
    } catch {}
  }

  const effectiveConfig: CollectionPageConfig = dbConfig || getDefaultCollectionPageConfig(tenantSlug || 'fashion');

  return (
    <CollectionListingPage
      initialConfig={effectiveConfig}
      initialProducts={productsToRender}
      collectionTitle={collectionTitle}
      collectionDescription={collectionDesc}
      collectionBannerImage={bannerImg}
      breadcrumbs={[
        { label: 'Collections', href: formatTenantHref('/collections', tenantSlug) },
        { label: collectionTitle },
      ]}
      availableCategories={[
        { slug: 'all', name: 'All in Collection' },
        ...(dbCategories.length > 0
          ? dbCategories
          : Array.from(new Set(productsToRender.map((p) => p.category).filter(Boolean))).map((cat) => ({
              slug: String(cat).toLowerCase().trim(),
              name: String(cat).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            }))),
      ]}
    />
  );
}
