/**
 * Module 33: ProductCompletenessService
 * Calculates completeness percentage (0-100%) and breakdown:
 * Content, Media, Attributes, SEO, Localization, Channel requirements, Market requirements.
 */

import { PimProduct, ProductCompletenessScore } from '@/types/pim-commerce.types';

export class ProductCompletenessService {
  /**
   * Evaluates product data completeness
   */
  public static calculate(product: Partial<PimProduct>): ProductCompletenessScore {
    const missing: string[] = [];

    // 1. Content (weight: 25%)
    let contentPoints = 0;
    const maxContent = 5;
    if (product.title && product.title.trim().length >= 3) contentPoints++;
    else missing.push('Missing or short title');

    if (product.description && product.description.trim().length >= 20) contentPoints++;
    else missing.push('Missing detailed description');

    if (product.shortDescription && product.shortDescription.trim().length >= 10) contentPoints++;
    else missing.push('Missing short description');

    if (product.categories && product.categories.length > 0) contentPoints++;
    else missing.push('Missing primary category assignment');

    if (product.sku && product.sku.trim().length >= 3) contentPoints++;
    else missing.push('Missing SKU');

    const contentScore = Math.round((contentPoints / maxContent) * 100);

    // 2. Media (weight: 20%)
    let mediaPoints = 0;
    const maxMedia = 3;
    const images = (product.media || []).filter((m) => m.type === 'image');
    if (images.length >= 1) mediaPoints++;
    else missing.push('Missing product image');

    if (images.some((m) => m.role === 'primary')) mediaPoints++;
    else missing.push('Missing primary role image');

    if (images.length >= 3) mediaPoints++;
    else missing.push('Recommended at least 3 gallery images');

    const mediaScore = Math.round((mediaPoints / maxMedia) * 100);

    // 3. Attributes (weight: 20%)
    let attrPoints = 0;
    const maxAttr = 3;
    const attrs = product.attributes || [];
    if (attrs.length >= 2) attrPoints++;
    else missing.push('Insufficient attributes configured (min 2)');

    if (product.material || attrs.some((a) => a.code === 'material')) attrPoints++;
    else missing.push('Missing material specification');

    if (product.dimensions || (product.weight && product.weight > 0)) attrPoints++;
    else missing.push('Missing physical dimensions or weight');

    const attributesScore = Math.round((attrPoints / maxAttr) * 100);

    // 4. SEO (weight: 15%)
    let seoPoints = 0;
    const maxSeo = 3;
    if (product.seo?.title && product.seo.title.trim().length >= 10) seoPoints++;
    else missing.push('Missing meta title');

    if (product.seo?.description && product.seo.description.trim().length >= 25) seoPoints++;
    else missing.push('Missing meta description');

    if (product.slug && product.slug.trim().length >= 3) seoPoints++;
    else missing.push('Missing canonical slug');

    const seoScore = Math.round((seoPoints / maxSeo) * 100);

    // 5. Localization (weight: 10%)
    let locPoints = 0;
    const maxLoc = 2;
    if (product.localeOverrides && Object.keys(product.localeOverrides).length > 0) locPoints += 2;
    else if (product.title) locPoints += 1; // base locale present

    const localizationScore = Math.round((locPoints / maxLoc) * 100);

    // 6. Channel Requirements (weight: 5%)
    let chanPoints = 0;
    const maxChan = 2;
    if (product.status !== 'draft') chanPoints++;
    if (product.taxCategoryId && product.shippingClassId) chanPoints++;
    else missing.push('Missing tax category or shipping class');

    const channelScore = Math.round((chanPoints / maxChan) * 100);

    // 7. Market Requirements (weight: 5%)
    let marketPoints = 0;
    const maxMarket = 2;
    if (product.marketOverrides && Object.keys(product.marketOverrides).length > 0) marketPoints += 2;
    else marketPoints += 1;

    const marketScore = Math.round((marketPoints / maxMarket) * 100);

    // Weighted Total Score: 25 + 20 + 20 + 15 + 10 + 5 + 5 = 100%
    const totalPercent = Math.round(
      contentScore * 0.25 +
      mediaScore * 0.20 +
      attributesScore * 0.20 +
      seoScore * 0.15 +
      localizationScore * 0.10 +
      channelScore * 0.05 +
      marketScore * 0.05
    );

    return {
      totalPercent: Math.min(100, Math.max(0, totalPercent)),
      breakdown: {
        content: contentScore,
        media: mediaScore,
        attributes: attributesScore,
        seo: seoScore,
        localization: localizationScore,
        channelRequirements: channelScore,
        marketRequirements: marketScore,
      },
      missingItems: missing,
    };
  }
}
