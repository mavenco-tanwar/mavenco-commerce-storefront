import React from 'react';
import { headers, cookies } from 'next/headers';
import { Metadata } from 'next';
import { getTenantDatabase } from '@/lib/mongodb';
import { getDefaultWebsitePages, WebsitePageConfig } from '@/lib/cms-page-presets';
import { WebsitePageRenderer } from '@/components/cms/WebsitePageRenderer';
import { PlatformFaqClient } from './PlatformFaqClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams?: Promise<{ tenant?: string; [key: string]: string | string[] | undefined }>;
}

async function resolveTenant(searchParams?: Promise<{ tenant?: string }>): Promise<string | null> {
  const sp = searchParams ? await searchParams : {};
  if (sp.tenant && sp.tenant.trim()) {
    const t = sp.tenant.toLowerCase().trim();
    if (t !== 'platform' && t !== 'mavenco') return t;
  }

  try {
    const h = await headers();
    const hTenant = h.get('x-tenant-slug');
    if (hTenant && hTenant.trim()) {
      const t = hTenant.toLowerCase().trim();
      if (t !== 'platform' && t !== 'mavenco') return t;
    }
  } catch {}

  try {
    const c = await cookies();
    const cTenant = c.get('jq_active_tenant')?.value || c.get('jq_saas_active_tenant_slug')?.value;
    if (cTenant && cTenant.trim()) {
      const t = cTenant.toLowerCase().trim();
      if (t !== 'platform' && t !== 'mavenco') return t;
    }
  } catch {}

  return null;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const tenantSlug = await resolveTenant(searchParams);
  if (!tenantSlug) {
    return {
      title: 'Frequently Asked Questions | Mavenco Commerce Architecture',
      description: 'Frequently Asked Questions on multi-tenant architecture, pricing, and infrastructure.',
    };
  }

  try {
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const pageDoc = await db.collection('cms_pages').findOne({
        $or: [{ slug: 'faq' }, { slug: '/faq' }, { slug: 'frequently-asked-questions' }, { id: 'faq' }],
      });
      if (pageDoc?.seo?.title) {
        return {
          title: pageDoc.seo.title,
          description: pageDoc.seo.description || 'Frequently Asked Questions.',
        };
      }
    }
  } catch {}

  const defaults = getDefaultWebsitePages(tenantSlug);
  const faqDef = defaults.find((p) => p.slug === 'faq') || defaults[2];
  return {
    title: faqDef?.seo?.title || `Frequently Asked Questions | Store`,
    description: faqDef?.seo?.description || `Frequently asked questions.`,
  };
}

export default async function FaqPage({ searchParams }: PageProps) {
  const tenantSlug = await resolveTenant(searchParams);

  // If no tenant or explicitly platform showcase, render SaaS platform FAQ
  if (!tenantSlug) {
    return <PlatformFaqClient />;
  }

  // Tenant-specific Category FAQ
  let page: WebsitePageConfig | null = null;
  try {
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const pageDoc = await db.collection('cms_pages').findOne({
        $or: [
          { slug: 'faq' },
          { slug: '/faq' },
          { slug: 'frequently-asked-questions' },
          { slug: '/frequently-asked-questions' },
          { id: 'faq' },
          { id: `page_faq_${tenantSlug}` },
        ],
      });

      if (pageDoc) {
        const { _id, ...clean } = pageDoc;
        page = { id: clean.id || _id.toString(), ...clean } as WebsitePageConfig;
      }
    }
  } catch (err) {
    console.warn(`[FAQ Page] Direct DB lookup error for tenant ${tenantSlug}:`, err);
  }

  if (!page) {
    const defaults = getDefaultWebsitePages(tenantSlug);
    page = defaults.find((p) => p.slug === 'faq') || defaults[2] || (defaults[0] as WebsitePageConfig);
  }

  return <WebsitePageRenderer initialPage={page} tenantSlug={tenantSlug} />;
}
