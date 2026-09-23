import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { checkTenantValidityDb } from '@/lib/server/tenant-db';
import { StoreUnavailableView } from '@/components/ui/StoreUnavailableView';
import { getOrSeedTenantHomepageSections } from '@/lib/server/tenant-blueprint';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StorePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPreview = resolvedSearchParams.preview === 'draft';
  const tenantSlug = (resolvedParams.slug || 'demo').toLowerCase().trim();

  // Verify that the requested tenant exists and is active in MongoDB Atlas or registry
  try {
    const { isValid, isSuspended } = await checkTenantValidityDb(tenantSlug);
    if (!isValid || isSuspended) {
      return <StoreUnavailableView tenantSlug={tenantSlug} isSuspended={isSuspended} />;
    }
  } catch (err) {
    console.warn('Tenant check warning:', err);
  }

  // 1. Fetch Tenant Homepage Sections or Auto-Seed from Category Blueprint
  let sections = await getOrSeedTenantHomepageSections(tenantSlug);

  // 2. Fallback to API service if unconfigured
  if (!sections || sections.length === 0) {
    try {
      sections = await CmsApiService.getHomepageSections(isPreview, tenantSlug);
    } catch (err) {
      sections = [];
    }
  }

  return (
    <div className="flex flex-col">
      {/* Dynamic CMS Sections Renderer with explicit tenantSlug */}
      <DynamicSectionRenderer sections={sections} initialSections={sections} tenantSlug={tenantSlug} />
    </div>
  );
}
