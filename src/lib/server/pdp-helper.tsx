import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductService } from '@/services/products';
import { ProductPageRenderer } from '@/components/product/pdp/ProductPageRenderer';
import { normalizeProduct, generateProductJsonLd } from '@/lib/product-adapter';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultPdpConfig } from '@/lib/pdp-presets';
import { resolveTenant, cleanCategorySlug } from '@/lib/tenant-config';
import { ProductReviewsAndQA } from '@/components/pdp/ProductReviewsAndQA';
import { mapCmsProductToStorefrontProduct } from '@/services/api/adapters';

export async function getPdpTemplateConfig(tenantSlug: string = 'lumina') {
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

export async function fetchRawProduct(productSlug: string, explicitTenant?: string) {
  let rawProduct: any = null;

  try {
    const db = await getDatabase();
    if (db) {
      // 1. Authoritative direct MongoDB lookup
      const query: any = {
        $or: [{ slug: productSlug }, { id: productSlug }],
      };

      if (explicitTenant) {
        const tenantConditions = [
          { tenantSlug: explicitTenant },
          { storeSlug: explicitTenant },
          { tenantId: explicitTenant },
          { tenantId: `store_${explicitTenant}` },
        ];
        // Try tenant-specific query first
        const docWithTenant = await db.collection('products').findOne({
          $and: [query, { $or: tenantConditions }],
        });
        if (docWithTenant) {
          const { _id, ...clean } = docWithTenant;
          rawProduct = clean;
        }
      }

      if (!rawProduct) {
        const doc = await db.collection('products').findOne(query);
        if (doc) {
          const { _id, ...clean } = doc;
          rawProduct = clean;
        }
      }

      if (rawProduct) {
        // Resolve exact category name & slug from categories collection
        const catSearchIds = [
          ...(Array.isArray(rawProduct.categoryIds) ? rawProduct.categoryIds : []),
          rawProduct.categoryId,
          rawProduct.department,
          rawProduct.category,
        ].filter(Boolean);

        let validCategory: any = null;
        if (catSearchIds.length > 0) {
          validCategory = await db.collection('categories').findOne({
            $or: [{ id: { $in: catSearchIds } }, { slug: { $in: catSearchIds } }],
          });
        }

        if (validCategory) {
          rawProduct.categoryName = validCategory.name;
          rawProduct.category = validCategory.slug || validCategory.id;
        } else {
          // Category does not exist in categories collection (deleted or unassigned)
          rawProduct.categoryName = null;
          rawProduct.category = null;
          rawProduct.categorySlug = null;
          rawProduct.department = null;
          rawProduct.categoryId = null;
          rawProduct.categoryIds = [];
          rawProduct.categories = [];
        }
      }
    }
  } catch (e) {
    console.warn('Direct MongoDB PDP lookup failed:', e);
  }

  // 2. Service fallback
  if (!rawProduct) {
    try {
      const productRes = await ProductService.getProductBySlug(productSlug);
      rawProduct = productRes.data;
    } catch {}
  }

  return rawProduct;
}

export async function generatePdpMetadata({
  productSlug,
  explicitTenant,
}: {
  productSlug: string;
  explicitTenant?: string;
}): Promise<Metadata> {
  const product = await fetchRawProduct(productSlug, explicitTenant);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const pName = product.title || product.name || 'Product';
  const pBrand = product.brand || product.brandName || explicitTenant || 'Store';
  const metaTitle = product.seo?.title || `${pName} | Buy Online | ${pBrand}`;
  const metaDesc =
    product.seo?.description ||
    product.shortDescription ||
    (typeof product.description === 'string'
      ? product.description.replace(/<[^>]*>?/gm, '').slice(0, 160)
      : '');
  const firstImg = product.images?.[0]
    ? typeof product.images[0] === 'string'
      ? product.images[0]
      : product.images[0].url
    : undefined;

  const tabHoverTitle = metaDesc ? `${metaTitle} — ${metaDesc}` : metaTitle;

  return {
    title: tabHoverTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: firstImg ? [firstImg] : [],
    },
  };
}

export async function RenderProductDetailPage({
  productSlug,
  categorySlug,
  explicitTenant,
}: {
  productSlug: string;
  categorySlug?: string;
  explicitTenant?: string;
}) {
  const rawProduct = await fetchRawProduct(productSlug, explicitTenant);

  if (!rawProduct) {
    notFound();
  }

  // Ensure normalized product gets proper category slug
  const normalized = normalizeProduct(rawProduct);
  if (categorySlug && categorySlug !== 'all' && categorySlug !== 'collection') {
    // Only apply categorySlug from URL if it actually exists in the categories collection
    try {
      const db = await getDatabase();
      if (db) {
        const catExists = await db.collection('categories').findOne({
          $or: [
            { slug: categorySlug },
            { id: categorySlug },
            { id: `cat_${categorySlug}` },
            { id: new RegExp(`^cat_${categorySlug}(_|$)`, 'i') },
            { slug: new RegExp(`^${categorySlug}$`, 'i') },
          ],
        });
        if (catExists) {
          normalized.category = cleanCategorySlug(catExists.slug || catExists.id);
          normalized.categoryName = catExists.name;
        } else {
          normalized.category = undefined;
          normalized.categoryName = undefined;
        }
      }
    } catch {}
  } else if (!rawProduct.category) {
    normalized.category = undefined;
    normalized.categoryName = undefined;
  }

  const activeTenantSlug =
    explicitTenant ||
    rawProduct.tenantSlug ||
    rawProduct.storeSlug ||
    (rawProduct.tenantId ? String(rawProduct.tenantId).replace(/^store_/, '') : undefined);

  const activeTenant = resolveTenant(activeTenantSlug);
  const pdpConfig = await getPdpTemplateConfig(activeTenant.slug || 'lumina');

  let relatedData: any[] = [];
  try {
    const db = await getDatabase();
    const resolvedSlug = (activeTenant.slug || activeTenantSlug || '').toLowerCase().trim();

    if (db && resolvedSlug && resolvedSlug !== 'all') {
      const tenantMatchConditions = [
        { tenantSlug: resolvedSlug },
        { storeSlug: resolvedSlug },
        { tenantId: resolvedSlug },
        { tenantId: `store_${resolvedSlug}` },
      ];

      const excludeSelf = {
        id: { $ne: rawProduct.id },
        slug: { $ne: rawProduct.slug },
        status: { $in: ['published', 'active'] },
      };

      // 1. Try products from the same category first
      const cleanCat = cleanCategorySlug(normalized.category || rawProduct.category);
      let relatedDocs: any[] = [];

      if (cleanCat && cleanCat !== 'collection' && cleanCat !== 'all') {
        relatedDocs = await db
          .collection('products')
          .find({
            $and: [
              { $or: tenantMatchConditions },
              excludeSelf,
              {
                $or: [
                  { category: cleanCat },
                  { categorySlug: cleanCat },
                  { department: cleanCat },
                  { categoryIds: cleanCat },
                  { categoryIds: `cat_${cleanCat}_${resolvedSlug}` },
                  { department: `cat_${cleanCat}_${resolvedSlug}` },
                ],
              },
            ],
          })
          .limit(4)
          .toArray();
      }

      // 2. If fewer than 4 items, backfill with other products strictly from the SAME tenant
      if (relatedDocs.length < 4) {
        const existingIds = new Set(relatedDocs.map((d) => d.id || d.slug));
        const moreDocs = await db
          .collection('products')
          .find({
            $and: [
              { $or: tenantMatchConditions },
              excludeSelf,
              { id: { $nin: Array.from(existingIds) } },
              { slug: { $nin: Array.from(existingIds) } },
            ],
          })
          .limit(4 - relatedDocs.length)
          .toArray();

        relatedDocs = [...relatedDocs, ...moreDocs];
      }

      relatedData = relatedDocs.map((doc) => {
        const { _id, ...clean } = doc;
        return mapCmsProductToStorefrontProduct({ ...clean, id: clean.id || _id.toString() });
      });
    }

    // Only fallback for flagship reference demo store
    if (
      relatedData.length === 0 &&
      (!resolvedSlug || resolvedSlug === 'demo' || resolvedSlug === 'jq-trends')
    ) {
      const relatedRes = await ProductService.getRelatedProducts(rawProduct.id, 4, resolvedSlug);
      relatedData = relatedRes.data || [];
    }
  } catch (err) {
    console.warn('[RenderProductDetailPage] Failed to load tenant related products:', err);
  }

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
        relatedProducts={relatedData}
      />

      {/* Social Proof, Verified Ratings & Product Q&A */}
      <ProductReviewsAndQA
        productId={rawProduct.id}
        productTitle={rawProduct.name || rawProduct.title}
      />
    </>
  );
}
