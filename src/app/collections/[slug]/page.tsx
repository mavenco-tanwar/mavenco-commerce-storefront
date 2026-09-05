import React from 'react';
import { CategoryApiService } from '@/services/api/categories';
import { ProductApiService } from '@/services/api/products';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';

import { getDatabase } from '@/lib/mongodb';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { formatTenantHref } from '@/lib/tenant-config';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const resolved = await params;
  const rawSlug = decodeURIComponent(resolved.slug || '').trim();

  try {
    const db = await getDatabase();
    if (db) {
      const col = await db.collection('collections').findOne({
        $or: [{ slug: rawSlug }, { id: rawSlug }],
      });
      if (col) {
        const title = col.title || col.name || 'Lookbook Collection';
        return {
          title: `${title} Lookbook | Boutique Atelier`,
          description: col.description || 'Explore our seasonal lookbook collection.',
        };
      }
    }
  } catch {}

  const colRes = await CategoryApiService.getCollectionBySlug(rawSlug);
  const col = colRes.data;

  if (!col) return { title: 'Designer Collection | Boutique Atelier' };
  return {
    title: `${col.name} Lookbook | Boutique Atelier`,
    description: col.description || 'Explore our seasonal lookbook collection.',
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolved = await params;
  const rawSlug = decodeURIComponent(resolved.slug || '').trim();

  let col: any = null;
  let productsToRender: any[] = [];

  try {
    const db = await getDatabase();
    if (db) {
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

        const prodDocs = await db.collection('products')
          .find({ $or: orConditions })
          .sort({ createdAt: -1 })
          .toArray();

        if (prodDocs.length > 0) {
          productsToRender = prodDocs.map(mapCmsProductToStorefrontProduct);
        }
      }
    }
  } catch (err) {
    console.warn('[CollectionPage] Direct DB fetch error:', err);
  }

  // Fallback to API service if not found in direct DB
  if (!col) {
    const colRes = await CategoryApiService.getCollectionBySlug(rawSlug);
    col = colRes.data;
  }

  const collectionTitle = col ? (col.title || col.name) : rawSlug.replace(/-/g, ' ').toUpperCase();
  const collectionDesc = col ? (col.description || col.subtitle || 'Explore our curated seasonal assortment of bespoke luxury garments.') : 'Explore our curated seasonal assortment of bespoke luxury garments.';
  const bannerImg = col ? (col.imageUrl || col.bannerImage || col.image) : undefined;

  if (productsToRender.length === 0 && col && Array.isArray(col.productIds) && col.productIds.length > 0) {
    try {
      const prodRes = await ProductApiService.getProducts({
        ids: col.productIds.join(','),
        limit: 50,
      } as any);
      productsToRender = prodRes.data?.products || [];
    } catch {}
  }

  if (productsToRender.length === 0) {
    try {
      const prodRes = await ProductApiService.getProducts({ category: rawSlug, limit: 30 });
      productsToRender = prodRes.data?.products || [];
    } catch {}
  }

  return (
    <CollectionListingPage
      initialProducts={productsToRender}
      collectionTitle={collectionTitle}
      collectionDescription={collectionDesc}
      collectionBannerImage={bannerImg}
      breadcrumbs={[
        { label: 'Collections', href: formatTenantHref('/collections') },
        { label: collectionTitle },
      ]}
      availableCategories={[
        { slug: 'all', name: 'All in Collection' },
        ...Array.from(new Set(productsToRender.map((p) => p.category).filter(Boolean))).map((cat) => ({
          slug: String(cat).toLowerCase().trim(),
          name: String(cat).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        })),
      ]}
    />
  );
}
