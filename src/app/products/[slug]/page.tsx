import React from 'react';
import { notFound } from 'next/navigation';
import { ProductService } from '@/services/products';
import { ProductPageRenderer } from '@/components/product/pdp/ProductPageRenderer';
import { normalizeProduct, generateProductJsonLd } from '@/lib/product-adapter';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultPdpConfig } from '@/lib/pdp-presets';
import { resolveTenant } from '@/lib/tenant-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getPdpTemplateConfig(tenantSlug: string = 'lumina') {
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('product_page_templates').findOne({
        tenantSlug: tenantSlug,
        templateId: 'default_fashion',
      });
      if (doc?.published) {
        return doc.published;
      }
    }
  } catch (err) {
    console.warn('Failed to load PDP template from MongoDB:', err);
  }

  return getDefaultPdpConfig(tenantSlug);
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolved = await params;
  const res = await ProductService.getProductBySlug(resolved.slug);
  const product = res.data;

  if (!product) {
    return {
      title: 'Product Not Found | Atelier',
    };
  }

  return {
    title: `${product.name} | Atelier Haute Couture`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.name} | Atelier Haute Couture`,
      description: product.shortDescription || product.description,
      images: product.images[0] ? [typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url] : [],
    },
  };
}

import { ProductReviewsAndQA } from '@/components/pdp/ProductReviewsAndQA';

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolved = await params;
  const activeTenant = resolveTenant();

  const [productRes, pdpConfig] = await Promise.all([
    ProductService.getProductBySlug(resolved.slug),
    getPdpTemplateConfig(activeTenant.slug || 'lumina'),
  ]);

  const rawProduct = productRes.data;

  if (!rawProduct) {
    notFound();
  }

  const normalized = normalizeProduct(rawProduct);
  const relatedRes = await ProductService.getRelatedProducts(rawProduct.id, 4);
  const jsonLd = generateProductJsonLd(normalized);

  return (
    <>
      {/* JSON-LD Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductPageRenderer
        product={normalized}
        templateConfig={pdpConfig}
        relatedProducts={relatedRes.data}
      />

      {/* Social Proof, Verified Ratings & Product Q&A */}
      <ProductReviewsAndQA
        productId={rawProduct.id}
        productTitle={rawProduct.name}
      />
    </>
  );
}
