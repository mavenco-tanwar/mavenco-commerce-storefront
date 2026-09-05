import {
  generatePdpMetadata,
  RenderProductDetailPage,
} from '@/lib/server/pdp-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StoreCategoryProductPageProps {
  params: Promise<{ slug: string; category: string; productSlug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: StoreCategoryProductPageProps) {
  const { slug, productSlug } = await params;
  return generatePdpMetadata({ productSlug, explicitTenant: slug });
}

export default async function StoreCategoryProductDetailPage({
  params,
}: StoreCategoryProductPageProps) {
  const { slug, category, productSlug } = await params;

  return (
    <RenderProductDetailPage
      productSlug={productSlug}
      categorySlug={category}
      explicitTenant={slug}
    />
  );
}
