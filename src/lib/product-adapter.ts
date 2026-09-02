import { Product } from '@/types/product';
import { NormalizedProduct, NormalizedProductMedia, NormalizedProductVariant } from '@/types/pdp-template.types';

export function normalizeProduct(raw: Product): NormalizedProduct {
  // Map images to media
  const media: NormalizedProductMedia[] = (raw.images || []).map((img, idx) => ({
    type: 'image',
    url: typeof img === 'string' ? img : img.url,
    alt: typeof img === 'string' ? raw.name : img.alt || raw.name,
    position: idx,
  }));

  // Map variants
  const variants: NormalizedProductVariant[] = [];
  if (raw.colors && raw.sizes) {
    raw.colors.forEach((c) => {
      raw.sizes?.forEach((s) => {
        const sizeStr = typeof s === 'string' ? s : s.size;
        const inStock = typeof s === 'string' ? true : s.inStock;
        variants.push({
          id: `var_${raw.id}_${c.name}_${sizeStr}`,
          sku: `${raw.sku}-${c.name.substring(0, 3).toUpperCase()}-${sizeStr}`,
          options: {
            color: c.name,
            size: sizeStr,
          },
          price: raw.price,
          compareAtPrice: raw.compareAtPrice,
          inventory: inStock ? 10 : 0,
          inStock: inStock,
          images: c.image ? [c.image] : undefined,
        });
      });
    });
  }

  // Normalize sizes
  const sizes = (raw.sizes || []).map((s) =>
    typeof s === 'string' ? { size: s, inStock: true } : s
  );

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name,
    subtitle: raw.shortDescription,
    description: raw.description,
    shortDescription: raw.shortDescription,
    brand: {
      name: (raw as any).brand || 'Atelier Collection',
      href: '/collections',
    },
    category: raw.category,
    categoryName: raw.categoryName || raw.category,
    price: raw.price,
    compareAtPrice: raw.compareAtPrice,
    discountPercent: raw.discountPercent,
    currency: 'USD',
    sku: raw.sku,
    rating: raw.rating || 4.9,
    reviewCount: raw.reviewCount || 42,
    badges: raw.tags || (raw.discountPercent ? [`${raw.discountPercent}% OFF`, 'Handcrafted'] : ['Atelier Exclusive']),
    media: media.length > 0 ? media : [
      { type: 'image', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200', alt: raw.name }
    ],
    variants: variants,
    colors: raw.colors || [{ name: 'Blush Rose', hex: '#E8B8B5' }, { name: 'Classic Black', hex: '#0A0A0B' }],
    sizes: sizes.length > 0 ? sizes : [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true },
      { size: 'XL', inStock: false },
    ],
    features: raw.features || [
      'Hand-finished luxury fabric',
      'Breathable comfortable lining',
      'Bespoke artisanal construction',
    ],
    fabric: raw.fabric || 'Pure Georgette & Butter Crepe',
    careInstructions: raw.careInstructions || ['Dry clean recommended', 'Steam iron gently on low heat'],
    origin: 'Handcrafted in India',
    inStock: raw.inStock ?? true,
    stockCount: raw.stockCount ?? 12,
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
