import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { PlatformShowcaseLanding } from '@/components/home/PlatformShowcaseLanding';
import { checkTenantValidityDb } from '@/lib/server/tenant-db';
import { StoreUnavailableView } from '@/components/ui/StoreUnavailableView';
import { getOrSeedTenantHomepageSections } from '@/lib/server/tenant-blueprint';

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

  // 1. Fetch Tenant Homepage Sections or Auto-Seed from Category Blueprint
  let sections = await getOrSeedTenantHomepageSections(tenantSlug);

  // 2. Fallback to API service
  if (!sections || sections.length === 0) {
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
