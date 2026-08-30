import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { ValueProps } from '@/components/home/ValueProps';
import { PlatformShowcaseLanding } from '@/components/home/PlatformShowcaseLanding';

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

  // Otherwise, load and render that specific tenant's store
  const sections = await CmsApiService.getHomepageSections(isPreview);

  return (
    <div className="flex flex-col">
      {/* Dynamic CMS Sections Renderer */}
      <DynamicSectionRenderer sections={sections} />

      {/* Brand Value Propositions */}
      <ValueProps />
    </div>
  );
}
