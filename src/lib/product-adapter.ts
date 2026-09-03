import { Product } from '@/types/product';
import { NormalizedProduct, NormalizedProductMedia, NormalizedProductVariant } from '@/types/pdp-template.types';
import { PimProduct } from '@/types/pim-commerce.types';

/**
 * Normalizes either legacy Product or enterprise PimProduct into storefront NormalizedProduct
 */
export function normalizeProduct(raw: Product | PimProduct, context?: { marketId?: string; channelId?: string }): NormalizedProduct {
  const isPim = 'productTypeId' in raw;
  const pim = isPim ? (raw as PimProduct) : null;

  // Resolve market override if available
  const marketOverride = (context?.marketId && pim?.marketOverrides && typeof pim.marketOverrides === 'object')
    ? pim.marketOverrides[context.marketId]
    : undefined;

  const title = (marketOverride && typeof marketOverride === 'object' && marketOverride.title) || (isPim ? pim!.title : (raw as Product).name);
  const subtitle = (marketOverride && typeof marketOverride === 'object' && marketOverride.subtitle) || (isPim ? pim!.subtitle : (raw as Product).shortDescription);
  const description = (marketOverride && typeof marketOverride === 'object' && marketOverride.description) || raw.description;
  const shortDescription = (marketOverride && typeof marketOverride === 'object' && marketOverride.shortDescription) || (raw as any).shortDescription || raw.description.slice(0, 150);

  // Map images to media
  const rawMedia = (raw as any).media || [];
  let media: NormalizedProductMedia[] = [];

  if (rawMedia.length > 0) {
    media = rawMedia.map((m: any, idx: number) => ({
      type: m.type || 'image',
      url: m.url,
      alt: m.altText || title,
      position: idx,
    }));
  } else if ((raw as any).images) {
    media = ((raw as Product).images || []).map((img: any, idx: number) => ({
      type: 'image',
      url: typeof img === 'string' ? img : img.url,
      alt: typeof img === 'string' ? title : img.alt || title,
      position: idx,
    }));
  }

  // Map variants
  const variants: NormalizedProductVariant[] = [];
  if (isPim && pim!.variants && pim!.variants.length > 0) {
    pim!.variants.forEach((v) => {
      variants.push({
        id: v.id,
        sku: v.sku,
        options: v.optionValues || {},
        price: v.priceReference?.basePrice || 1499,
        compareAtPrice: v.priceReference?.compareAtPrice,
        inventory: 15,
        inStock: v.status === 'active',
        images: v.media?.map((m) => m.url),
      });
    });
  } else if ((raw as any).colors && (raw as any).sizes) {
    const p = raw as Product;
    p.colors.forEach((c) => {
      p.sizes?.forEach((s) => {
        const sizeStr = typeof s === 'string' ? s : s.size;
        const inStock = typeof s === 'string' ? true : s.inStock;
        variants.push({
          id: `var_${p.id}_${c.name}_${sizeStr}`,
          sku: `${p.sku}-${c.name.substring(0, 3).toUpperCase()}-${sizeStr}`,
          options: {
            color: c.name,
            size: sizeStr,
          },
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          inventory: inStock ? 10 : 0,
          inStock: inStock,
          images: (c as any).image ? [(c as any).image] : undefined,
        });
      });
    });
  }

  // Normalize sizes
  const sizes = ((raw as any).sizes || []).map((s: any) =>
    typeof s === 'string' ? { size: s, inStock: true } : s
  );

  // Curated badges
  const badges: string[] = [];
  if ((raw as any).discountPercent && (raw as any).discountPercent > 0) {
    badges.push(`${(raw as any).discountPercent}% OFF`);
  }
  if ((raw as any).badges && Array.isArray((raw as any).badges)) {
    badges.push(...(raw as any).badges);
  } else {
    badges.push('Handcrafted Atelier');
  }

  const basePrice = (marketOverride && typeof marketOverride === 'object' && marketOverride.priceReference?.basePrice) || (raw as any).price || 1499;
  const currency = (marketOverride && typeof marketOverride === 'object' && marketOverride.priceReference?.currency) || 'USD';

  return {
    id: raw.id,
    slug: raw.slug,
    title,
    subtitle,
    description,
    shortDescription,
    brand: {
      name: (raw as any).brandName || (raw as any).brand || 'Lumina Atelier',
      href: '/collections',
    },
    category: Array.isArray((raw as any).categories) ? (raw as any).categories[0] : (raw as any).category || 'dresses',
    categoryName: (raw as any).categoryName || (raw as any).category || 'Dresses',
    price: basePrice,
    compareAtPrice: (raw as any).compareAtPrice,
    discountPercent: (raw as any).discountPercent,
    currency,
    sku: raw.sku,
    rating: (raw as any).rating || 4.9,
    reviewCount: (raw as any).reviewCount || 42,
    badges: Array.from(new Set(badges)).slice(0, 2),
    media: media.length > 0 ? media : [
      { type: 'image', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200', alt: title }
    ],
    variants: variants,
    colors: (raw as any).colors || [{ name: 'Blush Rose', hex: '#E8B8B5' }, { name: 'Classic Black', hex: '#0A0A0B' }],
    sizes: sizes.length > 0 ? sizes : [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false },
    ],
    features: (raw as any).features || [
      'Tailored single-breasted relaxed blazer with bespoke buttons',
      'High-waisted wide-leg trousers with functional pockets',
      'Breathable, pre-shrunk premium linen-cotton fabric',
      'Artisanal hand-finished tailoring',
    ],
    fabric: (raw as any).material || (raw as any).fabric || 'Pure Georgette & Butter Crepe',
    careInstructions: (raw as any).careInstructions || ['Dry clean recommended', 'Steam iron gently on low heat'],
    origin: (raw as any).countryOfOrigin || 'Handcrafted in India',
    inStock: (raw as any).inStock ?? true,
    stockCount: (raw as any).stockCount ?? 12,
    subscriptionAvailability: (raw as any).subscriptionEnabled ?? true,
    subscriptionPlans: [
      {
        id: 'sub_plan_monthly_default',
        name: 'Subscribe & Save (Monthly)',
        slug: 'monthly-delivery',
        billingInterval: 'month' as const,
        billingIntervalCount: 1,
        discountPercent: 15,
        recurringPrice: Math.round(basePrice * 0.85),
        trialDurationDays: 0,
      },
      {
        id: 'sub_plan_bimonthly',
        name: 'Subscribe & Save (Bi-Monthly)',
        slug: 'bimonthly-delivery',
        billingInterval: 'month' as const,
        billingIntervalCount: 2,
        discountPercent: 10,
        recurringPrice: Math.round(basePrice * 0.9),
        trialDurationDays: 0,
      },
    ],
    allowedIntervals: ['1 month', '2 months', '3 months'],
    subscriptionPricing: {
      recurringPrice: Math.round(basePrice * 0.85),
      discountPercent: 15,
    },
    membershipEligibility: ['atelier-circle-vip'],
  };
}

export function generateProductJsonLd(product: NormalizedProduct, baseUrl: string = 'https://lumina-atelier.com') {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.media.map((m) => m.url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Lumina Atelier',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 1,
        }
      : undefined,
  };
}
