import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { getDatabase } from '@/lib/mongodb';
import {
  generatePdpMetadata,
  RenderProductDetailPage,
  fetchRawProduct,
} from '@/lib/server/pdp-helper';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { formatTenantHref, cleanCategorySlug } from '@/lib/tenant-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>;
  searchParams?: Promise<{ tenant?: string; [key: string]: string | string[] | undefined }>;
}

async function resolveTenantSlug(searchParams?: Promise<{ tenant?: string }>) {
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

  return undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryProductPageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const tenant = await resolveTenantSlug(searchParams);

  // 1. Try product metadata first
  const rawProduct = await fetchRawProduct(productSlug, tenant);
  if (rawProduct) {
    return generatePdpMetadata({ productSlug, explicitTenant: tenant });
  }

  // 2. Try nested subcategory metadata
  try {
    const db = await getDatabase();
    if (db) {
      const cleanSub = cleanCategorySlug(productSlug);
      const catDoc = await db.collection('categories').findOne({
        $and: [
          ...(tenant && tenant !== 'all'
            ? [{ $or: [{ tenantSlug: tenant }, { storeSlug: tenant }, { tenantId: tenant }, { tenantId: `store_${tenant}` }] }]
            : []),
          { $or: [{ slug: cleanSub }, { id: cleanSub }, { id: `cat_${cleanSub}_${tenant}` }, { id: `cat_${cleanSub}` }] },
        ],
      });
      if (catDoc) {
        return {
          title: `${catDoc.name} | Collection`,
          description: catDoc.description || `Explore ${catDoc.name} collection.`,
        };
      }
    }
  } catch {}

  return { title: 'Product or Category' };
}

export default async function CategoryProductDetailPage({
  params,
  searchParams,
}: CategoryProductPageProps) {
  const { slug, productSlug } = await params;
  const tenant = await resolveTenantSlug(searchParams);

  // 1. First check if productSlug is a real product
  const rawProduct = await fetchRawProduct(productSlug, tenant);
  if (rawProduct) {
    return (
      <RenderProductDetailPage
        productSlug={productSlug}
        categorySlug={slug}
        explicitTenant={tenant}
      />
    );
  }

  // 2. If not a product, check if it is a subcategory under department `slug`
  try {
    const db = await getDatabase();
    if (db) {
      const cleanSub = cleanCategorySlug(productSlug);
      const catDoc = await db.collection('categories').findOne({
        $and: [
          ...(tenant && tenant !== 'all'
            ? [{ $or: [{ tenantSlug: tenant }, { storeSlug: tenant }, { tenantId: tenant }, { tenantId: `store_${tenant}` }] }]
            : []),
          { $or: [{ slug: cleanSub }, { id: cleanSub }, { id: `cat_${cleanSub}_${tenant}` }, { id: `cat_${cleanSub}` }] },
        ],
      });

      if (catDoc) {
        let parentDoc: any = null;
        if (catDoc.parentId) {
          parentDoc = await db.collection('categories').findOne({
            $or: [{ id: catDoc.parentId }, { slug: catDoc.parentId }],
          });
        }

        const breadcrumbs = parentDoc
          ? [
              { label: parentDoc.name, href: formatTenantHref(`/${parentDoc.slug}`, tenant) },
              { label: catDoc.name },
            ]
          : [{ label: catDoc.name }];

        return (
          <Suspense
            fallback={
              <div className="py-24 text-center text-xs text-[#777777]">
                Loading {catDoc.name} Collection...
              </div>
            }
          >
            <ProductListingView
              department={parentDoc?.slug || catDoc.department}
              initialCategory={catDoc.slug || cleanSub}
              pageTitle={catDoc.name}
              pageSubtitle={catDoc.description || `Explore our ${catDoc.name} collection.`}
              bannerImage={catDoc.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop'}
              breadcrumbs={breadcrumbs}
              availableCategories={[]}
            />
          </Suspense>
        );
      }
    }
  } catch (err) {
    console.warn('[CategoryProductPage] Subcategory resolution fallback error:', err);
  }

  // If neither product nor category exists, return 404
  notFound();
}
