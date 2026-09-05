import React from 'react';
import { getDatabase } from '@/lib/mongodb';
import { ProductApiService } from '@/services/api/products';
import { CategoryApiService } from '@/services/api/categories';
import { CollectionListingPage } from '@/components/collection/CollectionListingPage';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';
import { formatTenantHref } from '@/lib/tenant-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TenantCollectionLookbookPageProps {
  params: Promise<{ slug: string; colSlug: string }>;
}

export async function generateMetadata({ params }: TenantCollectionLookbookPageProps) {
  const resolved = await params;
  const rawColSlug = decodeURIComponent(resolved.colSlug || '').trim();

  try {
    const db = await getDatabase();
    if (db) {
      const col = await db.collection('collections').findOne({
        $or: [{ slug: rawColSlug }, { id: rawColSlug }],
      });
      if (col) {
        const title = col.title || col.name || 'Lookbook Collection';
        return {
          title: `${title} | Boutique Lookbook`,
          description: col.description || 'Explore our curated seasonal assortment of signature boutique garments.',
        };
      }
    }
  } catch {}

  return {
    title: `${rawColSlug.replace(/-/g, ' ').toUpperCase()} | Lookbook Collection`,
    description: 'Explore our curated seasonal assortment of signature boutique garments.',
  };
}

export default async function TenantCollectionLookbookPage({ params }: TenantCollectionLookbookPageProps) {
  const resolved = await params;
  const tenantSlug = (resolved.slug || 'demo').toLowerCase().trim();
  const rawColSlug = decodeURIComponent(resolved.colSlug || '').trim();

  let col: any = null;
  let productsToRender: any[] = [];

  try {
    const db = await getDatabase();
    if (db) {
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
          .find({ $or: orConditions })
          .sort({ createdAt: -1 })
          .toArray();

        if (prodDocs.length > 0) {
          productsToRender = prodDocs.map(mapCmsProductToStorefrontProduct);
        }
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
  const collectionDesc = col ? (col.description || col.subtitle || 'Explore our curated seasonal assortment of signature boutique garments.') : 'Explore our curated seasonal assortment of signature boutique garments.';
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

  return (
    <CollectionListingPage
      initialProducts={productsToRender}
      collectionTitle={collectionTitle}
      collectionDescription={collectionDesc}
      collectionBannerImage={bannerImg}
      breadcrumbs={[
        { label: 'Store', href: formatTenantHref('/', tenantSlug) },
        { label: 'Collections', href: formatTenantHref('/collections', tenantSlug) },
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
