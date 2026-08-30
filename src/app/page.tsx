import React from 'react';
import { CmsApiService } from '@/services/api/cms';
import { DynamicSectionRenderer } from '@/components/home/DynamicSectionRenderer';
import { ValueProps } from '@/components/home/ValueProps';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HomePageProps {
  searchParams?: Promise<{ preview?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isPreview = resolvedParams.preview === 'draft';
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
