import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { PlatformShowcaseLanding } from '@/components/home/PlatformShowcaseLanding';
import { checkTenantValidityDb } from '@/lib/server/tenant-db';
import { StoreUnavailableView } from '@/components/ui/StoreUnavailableView';

import { getDatabase, getTenantDatabase } from '@/lib/mongodb';

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
  try {
    const { isValid, isSuspended } = await checkTenantValidityDb(tenantSlug);
    if (!isValid || isSuspended) {
      return <StoreUnavailableView tenantSlug={tenantSlug} isSuspended={isSuspended} />;
    }
  } catch (err) {
    console.warn('Tenant validity check warning:', err);
  }

  // 1. Direct MongoDB Atlas Fetch (Instant SSR from tenant database)
  let sections = null;
  try {
    const tenantDb = await getTenantDatabase(tenantSlug);
    if (tenantDb) {
      const doc = await tenantDb.collection('cms_pages').findOne(
        {
          $or: [
            { tenantSlug: tenantSlug, type: 'homepage' },
            { type: 'homepage' },
          ],
        },
        { sort: { publishedAt: -1, updatedAt: -1 } }
      );
      const dbSections = doc?.sections || doc?.config?.sections;
      if (Array.isArray(dbSections) && dbSections.length > 0) {
        sections = dbSections;
      }
    }

    if (!sections) {
      const platformDb = await getDatabase();
      if (platformDb) {
        const doc = await platformDb.collection('cms_pages').findOne(
          {
            $or: [
              { tenantSlug: tenantSlug, type: 'homepage' },
              { tenantSlug: 'all', type: 'homepage' },
            ],
          },
          { sort: { publishedAt: -1, updatedAt: -1 } }
        );
        const dbSections = doc?.sections || doc?.config?.sections;
        if (Array.isArray(dbSections) && dbSections.length > 0) {
          sections = dbSections;
        }
      }
    }
  } catch (err) {
    console.warn('Direct MongoDB store homepage warning:', err);
  }

  // 2. Fallback to API service
  if (!sections) {
    try {
      sections = await CmsApiService.getHomepageSections(isPreview, tenantSlug);
    } catch (err) {
      sections = [];
    }
  }

  return (
    <div className="flex flex-col">
      {/* Dynamic CMS Sections Renderer */}
      <DynamicSectionRenderer sections={sections} initialSections={sections} tenantSlug={tenantSlug} />
    </div>
  );
}
