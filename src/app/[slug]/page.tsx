import { formatTenantHref } from '@/lib/tenant-config';
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  RefreshCw,
  Truck,
  ShoppingBag,
  Search,
} from 'lucide-react';
import { CmsApiService } from '@/services/api/cms';
import { CategoryApiService } from '@/services/api/categories';
import { ProductListingView } from '@/components/plp/ProductListingView';
import { Button } from '@/components/ui/Button';
import { getDatabase } from '@/lib/mongodb';
import { headers, cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tenant?: string; [key: string]: string | string[] | undefined }>;
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

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await resolveTenant(searchParams);

  // 1. Check Category from MongoDB
  try {
    const db = await getDatabase();
    if (db) {
      const catDoc = await db.collection('categories').findOne({
        $or: [
          { slug },
          { id: slug },
          { id: `cat_${slug}_${tenant}` },
          { id: `cat_${slug}` },
        ],
      });
      if (catDoc) {
        return {
          title: `${catDoc.name} Collection | Luxury Boutique`,
          description: catDoc.description || `Shop ${catDoc.name} collections.`,
        };
      }
    }
  } catch {}

  // 2. Check Category Service
  try {
    const catRes = await CategoryApiService.getCategoryBySlug(slug);
    if (catRes?.data) {
      return {
        title: `${catRes.data.name} Collection | Luxury Boutique`,
        description: catRes.data.description || `Shop ${catRes.data.name} collections.`,
      };
    }
  } catch { }

  // 3. Check CMS Page from Direct MongoDB
  try {
    const db = await getDatabase();
    if (db) {
      const cleanSlug = slug.replace(/^\//, '').toLowerCase().trim();
      const pageDoc = await db.collection('cms_pages').findOne({
        $and: [
          { $or: [{ slug: cleanSlug }, { slug: `/${cleanSlug}` }, { id: cleanSlug }] },
          { status: 'published' },
        ],
      });
      if (pageDoc) {
        return {
          title: pageDoc.seo?.title || `${pageDoc.title} | Luxury Boutique`,
          description: pageDoc.seo?.description || `Explore ${pageDoc.title} luxury boutique collections.`,
        };
      }
    }
  } catch {}

  // 4. Check CMS Page Service Fallback
  try {
    const page = await CmsApiService.getPageBySlug(slug);
    if (page) {
      return {
        title: page.seo?.title || `${page.title} | Luxury Boutique`,
        description: page.seo?.description || `Explore ${page.title} luxury boutique collections.`,
      };
    }
  } catch {}

  return {
    title: 'Explore Boutique Fashion | Luxury Boutique',
  };
}

export default async function DynamicSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const tenantSlug = await resolveTenant(searchParams);

  // 1. Direct MongoDB lookup for category
  let category: any = null;
  try {
    const db = await getDatabase();
    if (db) {
      const catMatches = [
        { slug },
        { id: slug },
        { id: `cat_${slug}_${tenantSlug}` },
        { id: `cat_${slug}` },
      ];

      const catDoc = (await db.collection('categories').findOne({
        $and: [
          ...(tenantSlug && tenantSlug !== 'all' ? [{ $or: [{ tenantSlug }, { storeSlug: tenantSlug }, { tenantId: tenantSlug }, { tenantId: `store_${tenantSlug}` }] }] : []),
          { $or: catMatches },
        ],
      })) || (await db.collection('categories').findOne({ $or: catMatches }));

      if (catDoc) {
        // Query child subcategories that have this category as parent
        const childCats = await db.collection('categories').find({
          $and: [
            ...(tenantSlug && tenantSlug !== 'all' ? [{ $or: [{ tenantSlug }, { storeSlug: tenantSlug }, { tenantId: tenantSlug }, { tenantId: `store_${tenantSlug}` }] }] : []),
            { parentId: { $in: [catDoc.id, catDoc.slug, `cat_${catDoc.slug}_${tenantSlug}`, `cat_${catDoc.slug}`] } },
          ],
        }).toArray();

        category = {
          id: catDoc.id || catDoc._id.toString(),
          name: catDoc.name,
          slug: catDoc.slug || slug,
          description: catDoc.description || '',
          imageUrl: catDoc.imageUrl || '',
          department: catDoc.department || catDoc.slug,
          subcategories: (childCats && childCats.length > 0)
            ? childCats.map((s) => ({ slug: s.slug || s.id, name: s.name, itemCount: s.productCount || 12 }))
            : (catDoc.children || []),
        };
      }
    }
  } catch (err) {
    console.warn(`[DynamicSlugPage] Direct DB category lookup for slug "${slug}" fallback:`, err);
  }

  // 2. Service fallback for category
  if (!category) {
    try {
      const catRes = await CategoryApiService.getCategoryBySlug(slug);
      if (catRes?.data) {
        category = catRes.data;
      } else {
        const allCats = await CategoryApiService.getCategories();
        const found = allCats.data?.find((c) => c.slug === slug);
        if (found) category = found;
      }
    } catch (err) {
      console.warn(`[DynamicSlugPage] Category lookup for slug "${slug}" fallback:`, err);
    }
  }

  // Render Category Catalog View if category matches
  if (category) {
    const subcategories = (category.subcategories || []).map((s) => ({
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
          pageSubtitle={category.description || 'Artisanal tailoring and modern silhouettes handcrafted for effortless luxury.'}
          bannerImage={category.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop'}
          breadcrumbs={[{ label: category.name }]}
          availableCategories={subcategories}
        />
      </Suspense>
    );
  }

  // 3. Direct MongoDB lookup for Editorial CMS Page or Visual Builder Page
  let page: any = null;
  try {
    const cleanSlug = slug.replace(/^\//, '').toLowerCase().trim();
    const slugQuery = {
      $and: [
        {
          $or: [
            { slug: cleanSlug },
            { slug: `/${cleanSlug}` },
            { slug: slug },
            { id: cleanSlug },
          ],
        },
        { status: 'published' },
      ],
    };

    // 1. Try tenant-scoped database
    const { TenantDatabaseResolver } = await import('@/server/db/tenant-database.resolver');
    const tenantDb = await TenantDatabaseResolver.getTenantDatabase(tenantSlug);
    if (tenantDb) {
      const pageDoc = await tenantDb.collection('cms_pages').findOne(slugQuery);
      if (pageDoc) {
        const { _id, ...clean } = pageDoc;
        page = { id: clean.id || _id.toString(), ...clean };
      }
    }

    // 2. Primary database fallback
    if (!page) {
      const db = await getDatabase();
      if (db) {
        const pageDoc = await db.collection('cms_pages').findOne(slugQuery);
        if (pageDoc) {
          const { _id, ...clean } = pageDoc;
          page = { id: clean.id || _id.toString(), ...clean };
        }
      }
    }
  } catch (err) {
    console.warn(`[DynamicSlugPage] Direct DB page lookup for slug "${slug}" fallback:`, err);
  }

  // 4. Service API fallback for CMS page
  if (!page) {
    try {
      page = await CmsApiService.getPageBySlug(slug);
    } catch (err) {
      console.warn(`[DynamicSlugPage] CMS page lookup for slug "${slug}" fallback:`, err);
    }
  }

  if (page) {
    // If the page was built with the Visual Builder (has component children), use PageRenderer
    const builderContent = page.publishedContent || page.content;
    if (builderContent?.children && Array.isArray(builderContent.children) && builderContent.children.length > 0) {
      const { PageRenderer } = await import('@/components/builder/renderer/PageRenderer');
      return <PageRenderer document={page} content={builderContent} />;
    }

    // Legacy block renderer fallback
    const { WebsitePageRenderer } = await import('@/components/cms/WebsitePageRenderer');
    return <WebsitePageRenderer initialPage={page} tenantSlug={tenantSlug} />;
  }

  // 3. Fallback: Luxury 404 Page (No Negative Timestamp Performance Crash)
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
            Looking for &ldquo;{slug}&rdquo;?
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-sans">
            This collection or page is being prepared in our atelier. Explore our current luxury collections below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={formatTenantHref('/women')}>
            <Button variant="luxury-gold" size="md">
              Shop Women
            </Button>
          </Link>
          <Link href={formatTenantHref('/kids')}>
            <Button variant="outline" size="md">
              Shop Kids
            </Button>
          </Link>
          <Link href={formatTenantHref('/new-arrivals')}>
            <Button variant="outline" size="md">
              New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
