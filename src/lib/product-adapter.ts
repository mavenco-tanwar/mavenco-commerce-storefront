import { Product } from "@/types/product";
import { NormalizedProduct, NormalizedProductMedia, NormalizedProductVariant } from "@/types/pdp-template.types";
import { PimProduct } from "@/types/pim-commerce.types";

function cleanCategoryLabel(idOrSlug?: string): string {
  if (!idOrSlug) return "";
  let clean = idOrSlug
    .replace(/^cat_/, "")
    .replace(/_gever$|_jq-trends$|_lumina$|_store$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!clean) return "";
  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Normalizes either legacy Product or enterprise PimProduct into storefront NormalizedProduct
 */
export function normalizeProduct(
  raw: Product | PimProduct | any,
  context?: { marketId?: string; channelId?: string }
): NormalizedProduct {
  const isPim = "productTypeId" in raw;
  const pim = isPim ? (raw as PimProduct) : null;

  // Resolve market override if available
  const marketOverride =
    context?.marketId && pim?.marketOverrides && typeof pim.marketOverrides === "object"
      ? pim.marketOverrides[context.marketId]
      : undefined;

  const title =
    (marketOverride && typeof marketOverride === "object" && marketOverride.title) ||
    (isPim ? pim!.title : raw.name || raw.title || "Product");

  const description =
    (marketOverride && typeof marketOverride === "object" && marketOverride.description) ||
    raw.description ||
    raw.descriptionHtml ||
    raw.shortDescription ||
    "";

  const subtitle =
    (marketOverride && typeof marketOverride === "object" && marketOverride.subtitle) ||
    (isPim ? pim!.subtitle : raw.shortDescription || "");

  const shortDescription =
    (marketOverride && typeof marketOverride === "object" && marketOverride.shortDescription) ||
    raw.shortDescription ||
    (typeof description === "string" ? description.replace(/<[^>]*>?/gm, "").slice(0, 160) : "");

  // Map images to media
  const rawMedia = raw.media || [];
  let media: NormalizedProductMedia[] = [];

  if (Array.isArray(rawMedia) && rawMedia.length > 0) {
    media = rawMedia.map((m: any, idx: number) => ({
      type: m.type || "image",
      url: m.url,
      alt: m.altText || m.alt || title,
      position: idx,
    }));
  } else if (Array.isArray(raw.images) && raw.images.length > 0) {
    media = raw.images.map((img: any, idx: number) => ({
      type: "image",
      url: typeof img === "string" ? img : img.url,
      alt: typeof img === "string" ? title : img.altText || img.alt || title,
      position: idx,
    }));
  }

  const basePrice =
    (marketOverride && typeof marketOverride === "object" && marketOverride.priceReference?.basePrice) ||
    raw.price ||
    1499;

  const compareAtPrice = raw.compareAtPrice || undefined;
  const discountPercent =
    raw.discountPercent ||
    (compareAtPrice && compareAtPrice > basePrice
      ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
      : undefined);

  // Map variants
  const variants: NormalizedProductVariant[] = [];
  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];

  if (rawVariants.length > 0) {
    rawVariants.forEach((v: any, idx: number) => {
      const opts = v.options || {};
      const sizeOpt =
        opts.size ||
        opts.Size ||
        (v.title && v.title.includes("/") ? v.title.split("/")[0]?.trim() : (v.title !== "Default" ? v.title : undefined));
      const colorOpt =
        opts.color ||
        opts.Color ||
        (v.title && v.title.includes("/") ? v.title.split("/")[1]?.trim() : undefined);

      const effectiveOptions: Record<string, string> = { ...opts };
      if (sizeOpt) effectiveOptions.size = sizeOpt;
      if (colorOpt) effectiveOptions.color = colorOpt;

      variants.push({
        id: v.id || `var_${idx}_${v.sku || Math.random().toString(36).slice(2, 6)}`,
        sku: v.sku || raw.sku || `SKU-${idx}`,
        options: effectiveOptions,
        price: typeof v.price === "number" ? v.price : basePrice,
        compareAtPrice: typeof v.compareAtPrice === "number" ? v.compareAtPrice : compareAtPrice,
        inventory: typeof v.stock === "number" ? v.stock : 10,
        inStock: typeof v.stock === "number" ? v.stock > 0 : true,
        images: v.images || (v.image ? [v.image] : undefined),
      });
    });
  } else if (isPim && pim!.variants && pim!.variants.length > 0) {
    pim!.variants.forEach((v) => {
      variants.push({
        id: v.id,
        sku: v.sku,
        options: v.optionValues || {},
        price: v.priceReference?.basePrice || basePrice,
        compareAtPrice: v.priceReference?.compareAtPrice || compareAtPrice,
        inventory: 15,
        inStock: v.status === "active",
        images: v.media?.map((m) => m.url),
      });
    });
  } else if (raw.colors && raw.sizes) {
    const p = raw as Product;
    p.colors.forEach((c) => {
      p.sizes?.forEach((s) => {
        const sizeStr = typeof s === "string" ? s : s.size;
        const inStock = typeof s === "string" ? true : s.inStock;
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

  // Determine distinct sizes
  let sizes: Array<{ size: string; inStock: boolean }> = [];
  const variantSizes = Array.from(new Set(variants.map((v) => v.options.size).filter(Boolean)));
  if (variantSizes.length > 0) {
    sizes = variantSizes.map((sz) => {
      const matching = variants.filter((v) => v.options.size === sz);
      const isAvailable = matching.some((v) => v.inStock && v.inventory > 0);
      return { size: sz, inStock: isAvailable };
    });
  } else if (Array.isArray(raw.sizes) && raw.sizes.length > 0) {
    sizes = raw.sizes.map((s: any) =>
      typeof s === "string" ? { size: s, inStock: true } : s
    );
  }

  // Determine distinct colors
  const colorHexMap: Record<string, string> = {
    black: "#0A0A0B",
    white: "#FFFFFF",
    red: "#DC2626",
    blue: "#2563EB",
    rose: "#E8B8B5",
    pink: "#EC4899",
    green: "#10B981",
    yellow: "#F59E0B",
    beige: "#D4B996",
    navy: "#1E3A8A",
    grey: "#6B7280",
    gray: "#6B7280",
  };

  let colors: Array<{ name: string; hex: string }> = [];
  const variantColors = Array.from(new Set(variants.map((v) => v.options.color).filter(Boolean)));
  if (variantColors.length > 0) {
    colors = variantColors.map((clr) => {
      const lower = clr.toLowerCase();
      const hex = Object.entries(colorHexMap).find(([k]) => lower.includes(k))?.[1] || "#334155";
      return { name: clr, hex };
    });
  } else if (Array.isArray(raw.colors) && raw.colors.length > 0) {
    colors = raw.colors;
  }

  // Resolve Category & Category Name cleanly
  const rawCatId = Array.isArray(raw.categoryIds) && raw.categoryIds.length > 0 ? raw.categoryIds[0] : raw.categoryId;
  const rawCatName = raw.categoryName || (raw.category && typeof raw.category === "object" ? raw.category.name : undefined);
  const rawCatSlug = raw.categorySlug || (raw.category && typeof raw.category === "object" ? raw.category.slug : undefined) || (typeof raw.category === "string" ? raw.category : undefined);

  const categoryName = rawCatName || cleanCategoryLabel(rawCatId) || cleanCategoryLabel(rawCatSlug) || "Collection";
  const category = rawCatSlug || (rawCatId ? rawCatId.replace(/^cat_/, "").replace(/_gever$|_jq-trends$/, "") : "all");

  // Extract fabric and care instructions intelligently from description if not directly provided
  let fabric = raw.fabric || raw.material || undefined;
  if (!fabric && typeof description === "string") {
    const m =
      description.match(/Fabric Composition:<\/strong>\s*([^<\n]+)/i) ||
      description.match(/Fabric Composition:\s*([^<\n]+)/i);
    if (m && m[1]) fabric = m[1].replace(/&amp;/g, "&").trim();
  }

  let careInstructions = Array.isArray(raw.careInstructions) ? raw.careInstructions : undefined;
  if (!careInstructions && typeof description === "string") {
    const m =
      description.match(/Care Instructions:<\/strong>\s*([^<\n]+)/i) ||
      description.match(/Care Instructions:\s*([^<\n]+)/i);
    if (m && m[1]) careInstructions = [m[1].trim()];
  }

  // Only use features if explicitly defined
  const features = Array.isArray(raw.features) && raw.features.length > 0 ? raw.features : [];

  // Badges
  const badges: string[] = [];
  if (discountPercent && discountPercent > 0) {
    badges.push(`${discountPercent}% OFF`);
  }
  if (raw.badges) {
    if (Array.isArray(raw.badges)) {
      badges.push(...raw.badges);
    } else if (typeof raw.badges === "object") {
      if (raw.badges.isNewArrival) badges.push("New Arrival");
      if (raw.badges.isFeatured) badges.push("Featured");
      if (raw.badges.isBestSeller) badges.push("Best Seller");
    }
  }

  const brandName = raw.brand || raw.brandName || "JQ Trends";
  const currency = raw.currency || "INR";

  return {
    id: raw.id,
    slug: raw.slug,
    title,
    subtitle,
    description,
    shortDescription,
    brand: {
      name: brandName,
      href: "/collections",
    },
    category,
    categoryName,
    price: basePrice,
    compareAtPrice,
    discountPercent,
    currency,
    sku: raw.sku || `SKU-${raw.id}`,
    rating: raw.rating || 4.9,
    reviewCount: raw.reviewCount || 42,
    badges: Array.from(new Set(badges)).slice(0, 3),
    media:
      media.length > 0
        ? media
        : [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200",
              alt: title,
            },
          ],
    variants,
    colors,
    sizes,
    features,
    fabric,
    careInstructions: careInstructions || [
      "Dry clean recommended or gentle hand wash with cold water",
      "Store in a breathable garment bag away from direct sunlight",
    ],
    origin: raw.origin || raw.countryOfOrigin || "Handcrafted in India",
    inStock: raw.stock !== undefined ? raw.stock > 0 : (raw.inStock ?? true),
    stockCount: raw.stock !== undefined ? raw.stock : (raw.stockCount ?? 12),
    subscriptionAvailability: raw.subscriptionEnabled ?? false,
    subscriptionPlans: [],
    allowedIntervals: ["1 month", "2 months", "3 months"],
    subscriptionPricing: {
      recurringPrice: Math.round(basePrice * 0.85),
      discountPercent: 15,
    },
    membershipEligibility: ["vip"],
  };
}

export function generateProductJsonLd(product: NormalizedProduct, baseUrl: string = "https://jqtrends.com") {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.media.map((m) => m.url),
    description: product.shortDescription || product.title,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "JQ Trends",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 1,
        }
      : undefined,
  };
}
