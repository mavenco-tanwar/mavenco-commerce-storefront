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
  let product: any = null;

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('products').findOne({
        $or: [{ slug: resolved.slug }, { id: resolved.slug }],
      });
      if (doc) {
        const { _id, ...clean } = doc;
        product = clean;
      }
    }
  } catch {}

  if (!product) {
    product = (await ProductService.getProductBySlug(resolved.slug)).data;
  }

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const pName = product.title || product.name || 'Product';
  const pBrand = product.brand || product.brandName || 'Store';
  const metaTitle = product.seo?.title || `${pName} | Buy Online | ${pBrand}`;
  const metaDesc =
    product.seo?.description ||
    product.shortDescription ||
    (typeof product.description === 'string' ? product.description.replace(/<[^>]*>?/gm, '').slice(0, 160) : '');
  const firstImg = product.images?.[0]
    ? typeof product.images[0] === 'string'
      ? product.images[0]
      : product.images[0].url
    : undefined;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: firstImg ? [firstImg] : [],
    },
  };
}

import { ProductReviewsAndQA } from '@/components/pdp/ProductReviewsAndQA';

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolved = await params;
  const activeTenant = resolveTenant();
  const pdpConfig = await getPdpTemplateConfig(activeTenant.slug || 'lumina');

  let rawProduct: any = null;

  // 1. Authoritative direct MongoDB lookup for instant sync with Admin Panel
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('products').findOne({
        $or: [{ slug: resolved.slug }, { id: resolved.slug }],
      });
      if (doc) {
        const { _id, ...clean } = doc;
        rawProduct = clean as any;

        // Resolve exact category name from categories collection
        const catIds = Array.isArray(rawProduct.categoryIds) && rawProduct.categoryIds.length > 0
          ? rawProduct.categoryIds
          : rawProduct.categoryId
          ? [rawProduct.categoryId]
          : [];

        if (catIds.length > 0) {
          const catDoc = await db.collection('categories').findOne({
            $or: [{ id: { $in: catIds } }, { slug: { $in: catIds } }],
          });
          if (catDoc) {
            rawProduct.categoryName = catDoc.name;
            rawProduct.category = catDoc.slug || catDoc.id;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Direct MongoDB PDP lookup failed:', e);
  }

  // 2. Service fallback
  if (!rawProduct) {
    const productRes = await ProductService.getProductBySlug(resolved.slug);
    rawProduct = productRes.data;
  }

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
