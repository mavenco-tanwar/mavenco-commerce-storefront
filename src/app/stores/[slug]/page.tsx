import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { ValueProps } from '@/components/home/ValueProps';
import { checkTenantValidityDb } from '@/lib/server/tenant-db';
import { StoreUnavailableView } from '@/components/ui/StoreUnavailableView';
import { getDatabase } from '@/lib/mongodb';

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
  const { isValid, isSuspended } = await checkTenantValidityDb(tenantSlug);
  if (!isValid || isSuspended) {
    return <StoreUnavailableView tenantSlug={tenantSlug} isSuspended={isSuspended} />;
  }

  // 1. Direct MongoDB Atlas Fetch (Instant SSR)
  let sections = null;
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: 'homepage' },
          { tenantSlug: 'all', type: 'homepage' },
        ],
      });
      if (doc?.sections && Array.isArray(doc.sections) && doc.sections.length > 0) {
        sections = doc.sections;
      }
    }
  } catch (err) {
    console.error('Direct MongoDB store homepage error:', err);
  }

  // 2. Fallback
  if (!sections) {
    sections = await CmsApiService.getHomepageSections(isPreview, tenantSlug);
  }

  return (
    <div className="flex flex-col">
      {/* Dynamic CMS Sections Renderer with explicit tenantSlug */}
      <DynamicSectionRenderer sections={sections} initialSections={sections} tenantSlug={tenantSlug} />

      {/* Brand Value Propositions */}
      <ValueProps />
    </div>
  );
}
