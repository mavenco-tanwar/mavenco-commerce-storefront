'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
import { resolveTenant, resolveActiveTenantSlug, formatTenantHref, cleanCategorySlug } from '@/lib/tenant-config';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

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
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const productTenant = (product as any).tenantSlug || (product as any).storeSlug;
  const activeTenantSlug = resolveActiveTenantSlug(pathname, searchParams, productTenant);
  const activeTenant = resolveTenant(activeTenantSlug);
  const { addItem } = useCart();
  const router = useRouter();

  // Load Active PDP Configuration (Fallback to preset or template override)
  const [config, setConfig] = useState<ProductPageConfig>(() => ({
    ...getDefaultPdpConfig(activeTenant.slug || 'lumina'),
    ...(templateConfig || {}),
  }));

  // Fetch Live Published/Draft Configuration from MongoDB Atlas API
  const loadTemplate = useCallback(async () => {
    try {
      const slug = activeTenant.slug || 'lumina';
      const isDraftPreview = searchParams.get('preview') === 'draft' || searchParams.get('preview') === 'true';
      const url = `/api/v1/content/product-page?tenant=${slug}${isDraftPreview ? '&preview=draft' : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setConfig((prev) => ({
          ...prev,
          ...json.data,
        }));
      }
    } catch (err) {
      console.warn('Failed to load live published PDP template, using fallback config:', err);
    }
  }, [activeTenant.slug, searchParams]);

  useEffect(() => {
    loadTemplate();

    // Check localStorage for draft overrides if preview mode is active
    try {
      const isDraftPreview = searchParams.get('preview') === 'draft' || searchParams.get('preview') === 'true';
      if (isDraftPreview) {
        const localDraft = localStorage.getItem(`jq_pdp_draft_${activeTenant.slug}`);
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          if (parsed && typeof parsed === 'object') {
            setConfig((prev) => ({ ...prev, ...parsed }));
          }
        }
      }
    } catch {}

    // 1. PostMessage listener for real-time live preview broadcasts from Visual PDP Studio
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (
        data.type === 'PDP_UPDATED' ||
        data.type === 'PRODUCT_PAGE_UPDATED' ||
        data.type === 'PRODUCT_PAGE_CONFIG_UPDATED' ||
        data.type === 'MAVENCO_PDP_PREVIEW' ||
        data.type === 'VISUAL_BUILDER_UPDATE'
      ) {
        const incoming = data.config || data.data;
        if (incoming && typeof incoming === 'object') {
          setConfig((prev) => ({ ...prev, ...incoming }));
        } else {
          loadTemplate();
        }
      }
    };

    // 2. Storage event listener for multi-tab synchronization between admin and storefront
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === 'jq_pdp_updated' ||
        event.key === `jq_pdp_template_${activeTenant.slug}` ||
        event.key === `jq_pdp_draft_${activeTenant.slug}` ||
        event.key === 'jq_active_tenant'
      ) {
        if (event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (parsed && typeof parsed === 'object') {
              setConfig((prev) => ({ ...prev, ...parsed }));
              return;
            }
          } catch {}
        }
        loadTemplate();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadTemplate, activeTenant.slug, searchParams]);

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

  // Dynamic CSS Variables Injection Scoped to Product Detail Page
  const pdpCssVariables = useMemo(() => {
    const gallerySplit = config.gallery.galleryWidthPercent || 55;
    const panelSplit = 100 - gallerySplit;
    const aspectRatioCss =
      config.gallery.aspectRatio === '1:1'
        ? '1 / 1'
        : config.gallery.aspectRatio === '3:4'
        ? '3 / 4'
        : config.gallery.aspectRatio === '16:9'
        ? '16 / 9'
        : '4 / 5';

    const galleryGapCss =
      config.gallery.gap === 'large'
        ? '2.5rem'
        : config.gallery.gap === 'small'
        ? '1rem'
        : '1.75rem';

    const accentColor = config.accentColor || '#B77A68';
    const stickyOffset = config.purchasePanel.stickyOffsetPx || 80;

    return `
      :root {
        --pdp-gallery-width: ${gallerySplit}%;
        --pdp-purchase-width: ${panelSplit}%;
        --pdp-aspect-ratio: ${aspectRatioCss};
        --pdp-accent-color: ${accentColor};
        --pdp-gallery-gap: ${galleryGapCss};
        --pdp-sticky-offset: ${stickyOffset}px;
      }
    `.trim();
  }, [config]);

  const handleAddToCart = async (qty: number = 1) => {
    const cartProduct: any = {
      id: product.id,
      name: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: product.media.map((m) => m.url),
      sku: product.sku,
      category: product.category,
    };
    await addItem(cartProduct, selectedColor, selectedSize, qty);
  };

  const handleBuyNow = async (qty: number = 1) => {
    await handleAddToCart(qty);
    router.push(formatTenantHref('/checkout', activeTenant.slug));
  };

  // Sync document title and meta description on tab hover
  useEffect(() => {
    const metaTitle = product.seo?.title || product.title;
    const metaDesc = product.seo?.description || product.shortDescription;
    if (metaDesc) {
      document.title = `${metaTitle} — ${metaDesc}`;
    } else if (metaTitle) {
      document.title = metaTitle;
    }
  }, [product]);

  // Section visibility guards
  const isDetailsEnabled = config.sections?.find(
    (s) => s.id === 'sec_tabs' || s.type === 'tabs' || s.type === 'accordions'
  )?.enabled !== false;

  const isReviewsEnabled = config.sections?.find(
    (s) => s.id === 'sec_reviews' || s.type === 'reviews'
  )?.enabled !== false;

  const isRelatedEnabled = config.sections?.find(
    (s) => s.id === 'sec_related' || s.type === 'relatedProducts'
  )?.enabled !== false;

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-slate-900 pb-28 space-y-10">
      {/* Dynamic CSS Variables Scoped to PDP */}
      <style id="dynamic-pdp-tokens" dangerouslySetInnerHTML={{ __html: pdpCssVariables }} />

      {/* 1. Breadcrumbs Trail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs
          items={[
            ...(product.category &&
            product.categoryName &&
            product.category !== 'all' &&
            product.category !== 'collection'
              ? [
                  {
                    label: product.categoryName,
                    href: formatTenantHref(`/${product.category}`, activeTenant.slug),
                  },
                ]
              : []),
            { label: product.title },
          ]}
        />
      </div>

      {/* 2. Main Section: Product Gallery & Purchase Box Layout with Dynamic CSS Split */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-[var(--pdp-gallery-width,55%)_minmax(0,1fr)] gap-8 lg:gap-[var(--pdp-gallery-gap,2rem)] items-start"
        >
          {/* Gallery Column */}
          <div className="w-full">
            <ProductGallery
              media={product.media}
              config={config.gallery}
              productTitle={product.title}
              activeVariantImage={activeVariantImage}
            />
          </div>

          {/* Purchase Box Column */}
          <div className="w-full">
            <ProductPurchasePanel
              product={product}
              config={config.purchasePanel}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isWishlisted={isWishlisted}
              onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
            />
          </div>
        </div>
      </main>

      {/* 3. Below-the-fold Configurable PDP Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Accordions / Tabs */}
        {isDetailsEnabled && (
          <section className="border-t border-[#EFE8E2] pt-12">
            <ProductAccordions product={product} sections={config.sections} />
          </section>
        )}

        {/* Customer Reviews Section */}
        {isReviewsEnabled && (
          <section className="border-t border-[#EFE8E2] pt-12">
            <ProductReviews
              productId={product.id}
              rating={product.rating || 4.9}
              reviewCount={product.reviewCount || 38}
            />
          </section>
        )}

        {/* Related Products Section */}
        {isRelatedEnabled && relatedProducts.length > 0 && (
          <section className="border-t border-[#EFE8E2] pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">
                  Complete the Look
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                  Related Creations
                </h3>
              </div>
              <Link
                href={
                  product.category && product.category !== 'all' && product.category !== 'collection'
                    ? formatTenantHref(`/${cleanCategorySlug(product.category)}`, activeTenant.slug)
                    : formatTenantHref('/collections', activeTenant.slug)
                }
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
        onAddToCart={() => handleAddToCart(1)}
        onBuyNow={() => handleBuyNow(1)}
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
