'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductGallery } from './ProductGallery';
import { ProductPurchasePanel } from './ProductPurchasePanel';
import { ProductAccordions } from './ProductAccordions';
import { MobilePurchaseBar } from './MobilePurchaseBar';
import {
  NormalizedProduct,
  ProductPageConfig,
} from '@/types/pdp-template.types';
import { getDefaultPdpConfig } from '@/lib/pdp-presets';
import { resolveTenant } from '@/lib/tenant-config';
import { Product } from '@/types/product';

export interface ProductPageRendererProps {
  product: NormalizedProduct;
  templateConfig?: ProductPageConfig;
  relatedProducts?: Product[];
  recommendedProducts?: Product[];
}

export function ProductPageRenderer({
  product,
  templateConfig,
  relatedProducts = [],
  recommendedProducts = [],
}: ProductPageRendererProps) {
  const activeTenant = resolveTenant();

  // Load Active PDP Configuration (Fallback to preset or template override)
  const [config, setConfig] = useState<ProductPageConfig>(() => ({
    ...getDefaultPdpConfig(activeTenant.slug || 'lumina'),
    ...(templateConfig || {}),
  }));

  // Fetch Live Published Configuration from MongoDB Atlas
  useEffect(() => {
    async function loadTemplate() {
      try {
        const slug = activeTenant.slug || 'lumina';
        const res = await fetch(`/api/v1/content/product-page?tenant=${slug}&template=default_fashion`);
        const json = await res.json();
        if (json.success && json.data) {
          setConfig((prev) => ({
            ...prev,
            ...json.data,
            ...(templateConfig || {}),
          }));
        }
      } catch (err) {
        console.warn('Failed to load live published PDP template, using fallback config:', err);
      }
    }
    loadTemplate();
  }, [activeTenant.slug, templateConfig]);

  // Active Variant Selection State
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0]?.size || ''
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Active variant image
  const activeVariantImage = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined;
    const match = product.variants.find(
      (v) =>
        (!selectedColor || v.options.color?.toLowerCase() === selectedColor.toLowerCase()) &&
        (!selectedSize || v.options.size?.toLowerCase() === selectedSize.toLowerCase())
    );
    return match?.images?.[0];
  }, [product.variants, selectedColor, selectedSize]);

  // Gallery Width CSS Split Calculation
  const galleryWidthPercent = config.gallery.galleryWidthPercent || 55;
  const purchaseWidthPercent = 100 - galleryWidthPercent;

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-slate-900 pb-28 space-y-12">
      {/* 1. Breadcrumbs Trail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: product.categoryName || 'Creations', href: `/collections/${product.category || 'all'}` },
            { label: product.title },
          ]}
        />
      </div>

      {/* 2. Main Section: Product Gallery & Purchase Box Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Column */}
          <div
            className="lg:col-span-7"
            style={{
              gridColumn: `span ${Math.round((galleryWidthPercent / 100) * 12)} / span ${Math.round(
                (galleryWidthPercent / 100) * 12
              )}`,
            }}
          >
            <ProductGallery
              media={product.media}
              config={config.gallery}
              productTitle={product.title}
              activeVariantImage={activeVariantImage}
            />
          </div>

          {/* Purchase Box Column */}
          <div
            className="lg:col-span-5"
            style={{
              gridColumn: `span ${12 - Math.round((galleryWidthPercent / 100) * 12)} / span ${
                12 - Math.round((galleryWidthPercent / 100) * 12)
              }`,
            }}
          >
            <ProductPurchasePanel
              product={product}
              config={config.purchasePanel}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              isWishlisted={isWishlisted}
              onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
            />
          </div>
        </div>
      </main>

      {/* 3. Below-the-fold Configurable PDP Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Accordions / Tabs */}
        <section className="border-t border-[#E8DED8] dark:border-slate-800 pt-12">
          <ProductAccordions product={product} />
        </section>

        {/* Customer Reviews Section */}
        <section className="border-t border-[#E8DED8] dark:border-slate-800 pt-12">
          <ProductReviews
            productId={product.id}
            rating={product.rating || 4.9}
            reviewCount={product.reviewCount || 38}
          />
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#E8DED8] dark:border-slate-800 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">
                  Complete the Look
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white">
                  Related Creations
                </h3>
              </div>
              <Link
                href="/collections"
                className="text-xs font-bold text-slate-600 hover:text-rose-600 uppercase tracking-wider transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            <ProductGrid products={relatedProducts.slice(0, 4)} columns={4} />
          </section>
        )}
      </div>

      {/* 4. Mobile Sticky Purchase Bar */}
      <MobilePurchaseBar
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onAddToCart={() => alert(`Added ${product.title} to bag`)}
        onBuyNow={() => alert(`Proceeding to checkout for ${product.title}`)}
        enabled={config.purchasePanel.mobileStickyBar}
      />

      {/* 5. Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category || 'dresses'}
      />
    </div>
  );
}
