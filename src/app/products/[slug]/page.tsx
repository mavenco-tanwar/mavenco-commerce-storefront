import React from 'react';
import { notFound } from 'next/navigation';
import { ProductService } from '@/services/products';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getPdpConfig(tenantSlug: string = 'all') {
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: 'product-page' },
          { tenantSlug: 'all', type: 'product-page' },
        ],
      });
      if (doc?.config) {
        return doc.config;
      }
    }
  } catch (err) {
    console.error('Failed to load PDP config from MongoDB:', err);
  }

  // Default Luxury PDP Configuration
  return {
    galleryLayout: 'grid-2',
    imageZoom: true,
    showVideoBadge: true,
    stickyBuyBar: true,
    showStockUrgency: true,
    stockThreshold: 5,
    enableDeliveryEstimator: true,
    defaultEstimatedDays: '2-4 Days',
    enableSizeGuideModal: true,
    enableFabricCareAccordion: true,
    enableArtisanProvenance: true,
    trustBadges: [
      { id: 'auth', title: '100% Handcrafted Authenticity', desc: 'Direct from artisan weavers', enabled: true },
      { id: 'shipping', title: 'Complimentary Express Delivery', desc: 'Dispatched in 24 hours', enabled: true },
      { id: 'exchange', title: '7-Day Easy Exchange', desc: 'Doorstep pickup available', enabled: true },
      { id: 'secure', title: '0% Platform Fee Protected', desc: 'Encrypted SSL checkout', enabled: true },
    ],
    showFrequentlyBoughtTogether: true,
    showCustomerReviews: true,
    showRelatedProducts: true,
    accentColor: '#E11D48',
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolved = await params;
  const res = await ProductService.getProductBySlug(resolved.slug);
  const product = res.data;

  if (!product) {
    return {
      title: 'Product Not Found | JQ Trends',
    };
  }

  return {
    title: `${product.name} | JQ Trends`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | JQ Trends`,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolved = await params;
  const [productRes, pdpConfig] = await Promise.all([
    ProductService.getProductBySlug(resolved.slug),
    getPdpConfig(),
  ]);

  const product = productRes.data;

  if (!product) {
    notFound();
  }

  const relatedRes = await ProductService.getRelatedProducts(product.id, 4);
  const relatedProducts = relatedRes.data;

  const breadcrumbs = [
    {
      label: product.department === 'women' ? 'Women' : 'Kids',
      href: product.department === 'women' ? '/women' : '/kids',
    },
    {
      label: product.categoryName,
      href: `/${product.department}?category=${product.category}`,
    },
    {
      label: product.name,
    },
  ];

  return (
    <div className="bg-[#FFFDFC] py-6 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Top 2-Column Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery (7 cols on lg) */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              layout={pdpConfig.galleryLayout || 'grid-2'}
              imageZoom={pdpConfig.imageZoom !== false}
              showVideoBadge={pdpConfig.showVideoBadge !== false}
            />
          </div>

          {/* Product Information & CTAs (5 cols on lg) */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} pdpConfig={pdpConfig} />

            {/* Accordion Tabs for Fabric, Fit & Shipping */}
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Customer Reviews Section */}
        {pdpConfig.showCustomerReviews !== false && (
          <div className="mt-16 sm:mt-24">
            <ProductReviews productId={product.id} productName={product.name} />
          </div>
        )}

        {/* "You May Also Like" Related Products */}
        {pdpConfig.showRelatedProducts !== false && relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E8DED8]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-[#B77A68]">
                Style Recommendations
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] mt-1">
                You May Also Like
              </h3>
            </div>

            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
