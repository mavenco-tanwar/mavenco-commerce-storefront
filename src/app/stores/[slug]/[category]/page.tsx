import React, { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';
import { getDatabase } from '@/lib/mongodb';
import { CategoryApiService } from '@/services/api/categories';
import { CmsApiService } from '@/services/api/cms';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { WebsitePageRenderer } from '@/components/cms/WebsitePageRenderer';
import { Button } from '@/components/ui/Button';
import { formatTenantHref } from '@/lib/tenant-config';
import { checkTenantValidityDb } from '@/lib/server/tenant-db';
import { StoreUnavailableView } from '@/components/ui/StoreUnavailableView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StoreCategoryOrPageProps {
  params: Promise<{ slug: string; category: string }>;
  searchParams?: Promise<{ preview?: string; [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: StoreCategoryOrPageProps): Promise<Metadata> {
  const { slug: tenantSlug, category: rawTarget } = await params;
  const target = decodeURIComponent(rawTarget || '').trim();
  const cleanTarget = target.replace(/^\//, '').toLowerCase().trim();

  // 1. Check Category from MongoDB
  try {
    const db = await getDatabase();
    if (db) {
      const catDoc = await db.collection('categories').findOne({
        $and: [
          ...(tenantSlug && tenantSlug !== 'all'
            ? [
                {
                  $or: [
                    { tenantSlug },
                    { storeSlug: tenantSlug },
                    { tenantId: tenantSlug },
                    { tenantId: `store_${tenantSlug}` },
                  ],
                },
              ]
            : []),
          {
            $or: [
              { slug: cleanTarget },
              { id: cleanTarget },
              { id: `cat_${cleanTarget}_${tenantSlug}` },
              { id: `cat_${cleanTarget}` },
            ],
          },
        ],
      }) || (await db.collection('categories').findOne({
        $or: [
          { slug: cleanTarget },
          { id: cleanTarget },
          { id: `cat_${cleanTarget}_${tenantSlug}` },
          { id: `cat_${cleanTarget}` },
        ],
      }));

      if (catDoc) {
        return {
          title: `${catDoc.name} | Boutique Collection`,
          description: catDoc.description || `Shop ${catDoc.name} collections.`,
        };
      }

      // 2. Check CMS Website Page from MongoDB
      const pageDoc = await db.collection('cms_pages').findOne({
        $and: [
          {
            $or: [
              { tenantSlug: tenantSlug },
              { tenantSlug: 'all' },
              { tenantSlug: 'platform' },
              { tenantSlug: { $exists: false } },
            ],
          },
          {
            $or: [
              { slug: cleanTarget },
              { slug: `/${cleanTarget}` },
              { slug: target },
              { id: cleanTarget },
            ],
          },
          { status: 'published' },
        ],
      });

      if (pageDoc) {
        return {
          title: pageDoc.seo?.title || `${pageDoc.title} | Storefront`,
          description:
            pageDoc.seo?.description || `Explore ${pageDoc.title} boutique information and policies.`,
        };
      }
    }
  } catch {}

  // 3. Service Fallbacks
  try {
    const catRes = await CategoryApiService.getCategoryBySlug(cleanTarget, tenantSlug);
    if (catRes?.data) {
      return {
        title: `${catRes.data.name} | Boutique Collection`,
        description: catRes.data.description || `Shop ${catRes.data.name} collections.`,
      };
    }
  } catch {}

  try {
    const page = await CmsApiService.getPageBySlug(cleanTarget, tenantSlug);
    if (page) {
      return {
        title: page.seo?.title || `${page.title} | Storefront`,
        description: page.seo?.description || `Explore ${page.title} boutique information.`,
      };
    }
  } catch {}

  return {
    title: `${cleanTarget.replace(/[-_]+/g, ' ').toUpperCase()} | Boutique Storefront`,
  };
}

export default async function StoreCategoryOrWebsitePage({
  params,
  searchParams,
}: StoreCategoryOrPageProps) {
  const { slug: rawTenantSlug, category: rawTarget } = await params;
  const tenantSlug = (rawTenantSlug || 'demo').toLowerCase().trim();
  const target = decodeURIComponent(rawTarget || '').trim();
  const cleanTarget = target.replace(/^\//, '').toLowerCase().trim();

  // Verify store validity
  try {
    const { isValid, isSuspended } = await checkTenantValidityDb(tenantSlug);
    if (!isValid || isSuspended) {
      return <StoreUnavailableView tenantSlug={tenantSlug} isSuspended={isSuspended} />;
    }
  } catch (err) {
    console.warn('[StoreCategoryOrWebsitePage] Tenant check warning:', err);
  }

  // 1. Direct MongoDB lookup for Category
  let category: any = null;
  try {
    const db = await getDatabase();
    if (db) {
      const catMatches = [
        { slug: cleanTarget },
        { id: cleanTarget },
        { id: `cat_${cleanTarget}_${tenantSlug}` },
        { id: `cat_${cleanTarget}` },
      ];

      const catDoc =
        (await db.collection('categories').findOne({
          $and: [
            ...(tenantSlug && tenantSlug !== 'all'
              ? [
                  {
                    $or: [
                      { tenantSlug },
                      { storeSlug: tenantSlug },
                      { tenantId: tenantSlug },
                      { tenantId: `store_${tenantSlug}` },
                    ],
                  },
                ]
              : []),
            { $or: catMatches },
          ],
        })) || (await db.collection('categories').findOne({ $or: catMatches }));

      if (catDoc) {
        const childCats = await db
          .collection('categories')
          .find({
            $and: [
              ...(tenantSlug && tenantSlug !== 'all'
                ? [
                    {
                      $or: [
                        { tenantSlug },
                        { storeSlug: tenantSlug },
                        { tenantId: tenantSlug },
                        { tenantId: `store_${tenantSlug}` },
                      ],
                    },
                  ]
                : []),
              {
                parentId: {
                  $in: [
                    catDoc.id,
                    catDoc.slug,
                    `cat_${catDoc.slug}_${tenantSlug}`,
                    `cat_${catDoc.slug}`,
                  ],
                },
              },
            ],
          })
          .toArray();

        category = {
          id: catDoc.id || catDoc._id.toString(),
          name: catDoc.name,
          slug: catDoc.slug || cleanTarget,
          description: catDoc.description || '',
          imageUrl: catDoc.imageUrl || '',
          department: catDoc.department || catDoc.slug,
          subcategories:
            childCats && childCats.length > 0
              ? childCats.map((s) => ({
                  slug: s.slug || s.id,
                  name: s.name,
                  itemCount: s.productCount || 12,
                }))
              : catDoc.children || [],
        };
      }
    }
  } catch (err) {
    console.warn(`[StoreCategoryOrWebsitePage] Category lookup for ${cleanTarget} error:`, err);
  }

  // 2. Service fallback for Category
  if (!category) {
    try {
      const catRes = await CategoryApiService.getCategoryBySlug(cleanTarget, tenantSlug);
      if (catRes?.data) {
        category = catRes.data;
      }
    } catch {}
  }

  // If Category found, render ProductListingView
  if (category) {
    const subcategories = (category.subcategories || []).map((s: any) => ({
      slug: s.slug,
      name: s.name,
      count: s.itemCount || 12,
    }));

    return (
      <Suspense
        fallback={
          <div className="py-24 text-center text-xs text-[#777777]">
            Loading {category.name} Collection...
          </div>
        }
      >
        <ProductListingView
          department={category.department ? (category.department as any) : undefined}
          initialCategory={category.slug}
          pageTitle={category.name}
          pageSubtitle={
            category.description ||
            'Artisanal tailoring and modern silhouettes handcrafted for effortless luxury.'
          }
          bannerImage={
            category.imageUrl ||
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop'
          }
          breadcrumbs={[
            { label: 'Store', href: formatTenantHref('/', tenantSlug) },
            { label: category.name },
          ]}
          availableCategories={subcategories}
        />
      </Suspense>
    );
  }

  // 3. Direct MongoDB lookup for CMS Website Page
  let page: any = null;
  try {
    const db = await getDatabase();
    if (db) {
      const pageDoc = await db.collection('cms_pages').findOne({
        $and: [
          {
            $or: [
              { tenantSlug: tenantSlug },
              { tenantSlug: 'all' },
              { tenantSlug: 'platform' },
              { tenantSlug: { $exists: false } },
            ],
          },
          {
            $or: [
              { slug: cleanTarget },
              { slug: `/${cleanTarget}` },
              { slug: target },
              { id: cleanTarget },
            ],
          },
          { status: 'published' },
        ],
      });

      if (pageDoc) {
        const { _id, ...clean } = pageDoc;
        page = { id: clean.id || _id.toString(), ...clean };
      }
    }
  } catch (err) {
    console.warn(`[StoreCategoryOrWebsitePage] Direct DB page lookup for ${cleanTarget} error:`, err);
  }

  // 4. Service API fallback for CMS Website Page
  if (!page) {
    try {
      page = await CmsApiService.getPageBySlug(cleanTarget, tenantSlug);
    } catch {}
  }

  // If CMS Website Page found, render WebsitePageRenderer
  if (page) {
    return <WebsitePageRenderer initialPage={page} tenantSlug={tenantSlug} />;
  }

  // 5. Luxury Storefront 404 Fallback
  return (
    <div className="min-h-[70vh] bg-[#FFFDFC] py-20 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF6F2] border border-[#E8DED8] flex items-center justify-center mx-auto text-[#B77A68]">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68] block">
            Boutique Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
            Looking for &ldquo;{target}&rdquo;?
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-sans">
            This boutique page or category is being curated. Explore our store collections below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={formatTenantHref('/', tenantSlug)}>
            <Button variant="luxury-gold" size="md">
              Return to Store
            </Button>
          </Link>
          <Link href={formatTenantHref('/collections', tenantSlug)}>
            <Button variant="outline" size="md">
              Explore Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
