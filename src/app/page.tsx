import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { PlatformShowcaseLanding } from '@/components/home/PlatformShowcaseLanding';
import { checkTenantValidityDb } from '@/lib/server/tenant-db';
import { StoreUnavailableView } from '@/components/ui/StoreUnavailableView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HomePageProps {
  searchParams?: Promise<{ preview?: string; tenant?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isPreview = resolvedParams.preview === 'draft';
  const tenantSlug = resolvedParams.tenant;

  // If no tenant is explicitly requested on the main root domain, display the SaaS Platform Showcase
  if (!tenantSlug) {
    return <PlatformShowcaseLanding />;
  }

  // Verify that the requested tenant exists and is active in MongoDB Atlas or registry
  const { isValid, isSuspended } = await checkTenantValidityDb(tenantSlug);
  if (!isValid || isSuspended) {
    return <StoreUnavailableView tenantSlug={tenantSlug} isSuspended={isSuspended} />;
  }

  // Check if tenant has a published custom Visual Builder Homepage
  let customHomeDoc: any = null;
  let customHomeContent: any = null;
  try {
    const { TenantDatabaseResolver } = await import('@/server/db/tenant-database.resolver');
    const tenantDb = await TenantDatabaseResolver.getTenantDatabase(tenantSlug);
    if (tenantDb) {
      const doc = await tenantDb.collection('cms_pages').findOne({
        $and: [
          { $or: [{ slug: '/' }, { slug: 'home' }, { type: 'homepage' }] },
          { status: isPreview ? { $in: ['draft', 'published'] } : 'published' },
        ],
      });
      if (doc) {
        const active = isPreview && doc.content ? doc.content : (doc.publishedContent || doc.content);
        if (active?.children && active.children.length > 0) {
          customHomeDoc = doc;
          customHomeContent = active;
        }
      }
    }
  } catch (err) {
    console.warn('[HomePage] Custom visual homepage check fallback:', err);
  }

  if (customHomeDoc && customHomeContent) {
    const { PageRenderer } = await import('@/components/builder/renderer/PageRenderer');
    return <PageRenderer document={customHomeDoc} content={customHomeContent} />;
  }

  // Otherwise, load and render that specific tenant's store
  const sections = await CmsApiService.getHomepageSections(isPreview, tenantSlug);

  return (
    <div className="flex flex-col">
      {/* Dynamic CMS Sections Renderer */}
      <DynamicSectionRenderer sections={sections} tenantSlug={tenantSlug} />
    </div>
  );
}
