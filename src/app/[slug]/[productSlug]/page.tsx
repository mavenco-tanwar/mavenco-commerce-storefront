import {
  generatePdpMetadata,
  RenderProductDetailPage,
} from '@/lib/server/pdp-helper';
import { headers, cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>;
  searchParams?: Promise<{ tenant?: string; [key: string]: string | string[] | undefined }>;
}

async function resolveTenantSlug(searchParams?: Promise<{ tenant?: string }>) {
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

  return undefined;
}

export async function generateMetadata({ params, searchParams }: CategoryProductPageProps) {
  const { productSlug } = await params;
  const tenant = await resolveTenantSlug(searchParams);
  return generatePdpMetadata({ productSlug, explicitTenant: tenant });
}

export default async function CategoryProductDetailPage({
  params,
  searchParams,
}: CategoryProductPageProps) {
  const { slug, productSlug } = await params;
  const tenant = await resolveTenantSlug(searchParams);

  return (
    <RenderProductDetailPage
      productSlug={productSlug}
      categorySlug={slug}
      explicitTenant={tenant}
    />
  );
}
