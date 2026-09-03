/**
 * Module 33: ProductQualityService
 * Evaluates rule-based catalog quality:
 * missing title, missing description, missing image, invalid SKU, missing dimensions,
 * missing SEO, duplicate content, outputs ProductQualityScore.
 */

import { PimProduct, ProductQualityScore } from '@/types/pim-commerce.types';
import { BarcodeService } from './barcode.service';

export class ProductQualityService {
  /**
   * Evaluates product data quality rules
   */
  public static evaluate(product: Partial<PimProduct>): ProductQualityScore {
    const errors: string[] = [];
    const warnings: string[] = [];
    const passedRules: string[] = [];
    const failedRules: string[] = [];

    // Rule 1: Title presence and quality
    if (!product.title || product.title.trim().length === 0) {
      errors.push('CRITICAL: Product title is missing');
      failedRules.push('RULE_TITLE_PRESENT');
    } else if (product.title.trim().length < 5) {
      warnings.push('Product title is very short (under 5 chars)');
      failedRules.push('RULE_TITLE_LENGTH');
    } else {
      passedRules.push('RULE_TITLE_PRESENT');
      passedRules.push('RULE_TITLE_LENGTH');
    }

    // Rule 2: Description depth
    if (!product.description || product.description.trim().length === 0) {
      errors.push('Product description is completely missing');
      failedRules.push('RULE_DESC_PRESENT');
    } else if (product.description.trim().length < 30) {
      warnings.push('Product description is brief (under 30 chars)');
      failedRules.push('RULE_DESC_DEPTH');
    } else {
      passedRules.push('RULE_DESC_PRESENT');
      passedRules.push('RULE_DESC_DEPTH');
    }

    // Rule 3: Media & Primary Image
    const images = (product.media || []).filter((m) => m.type === 'image');
    if (images.length === 0) {
      errors.push('No product media/images uploaded');
      failedRules.push('RULE_MEDIA_IMAGE_EXISTS');
    } else {
      passedRules.push('RULE_MEDIA_IMAGE_EXISTS');
      if (!images.some((m) => m.role === 'primary')) {
        warnings.push('No image designated with role "primary"');
        failedRules.push('RULE_PRIMARY_IMAGE');
      } else {
        passedRules.push('RULE_PRIMARY_IMAGE');
      }
    }

    // Rule 4: SKU Validation
    if (!product.sku || product.sku.trim().length === 0) {
      errors.push('SKU is required for catalog governance');
      failedRules.push('RULE_SKU_REQUIRED');
    } else if (!/^[A-Z0-9-_.]+$/i.test(product.sku)) {
      errors.push('SKU contains invalid special characters');
      failedRules.push('RULE_SKU_FORMAT');
    } else {
      passedRules.push('RULE_SKU_REQUIRED');
      passedRules.push('RULE_SKU_FORMAT');
    }

    // Rule 5: Barcode format if provided
    if (product.barcode) {
      const bRes = BarcodeService.validateBarcode(product.barcode, product.barcodeType || 'EAN');
      if (!bRes.isValid) {
        warnings.push(`Barcode verification warning: ${bRes.error}`);
        failedRules.push('RULE_BARCODE_FORMAT');
      } else {
        passedRules.push('RULE_BARCODE_FORMAT');
      }
    }

    // Rule 6: SEO Title & Description
    if (!product.seo?.title) {
      warnings.push('Missing SEO meta title');
      failedRules.push('RULE_SEO_TITLE');
    } else {
      passedRules.push('RULE_SEO_TITLE');
    }
    if (!product.seo?.description) {
      warnings.push('Missing SEO meta description');
      failedRules.push('RULE_SEO_DESC');
    } else {
      passedRules.push('RULE_SEO_DESC');
    }

    // Rule 7: Duplicate content check
    if (product.title && product.description && product.title.trim() === product.description.trim()) {
      warnings.push('Product description is identical to the title (duplicate content penalty)');
      failedRules.push('RULE_NO_DUPLICATE_CONTENT');
    } else {
      passedRules.push('RULE_NO_DUPLICATE_CONTENT');
    }

    // Rule 8: Dimensions for physical products
    if (product.type === 'simple' || product.type === 'variable') {
      if (!product.weight && !product.dimensions) {
        warnings.push('Missing physical shipping dimensions/weight');
        failedRules.push('RULE_PHYSICAL_SPECS');
      } else {
        passedRules.push('RULE_PHYSICAL_SPECS');
      }
    }

    // Score calculation:
    // Start at 100, deduct 20 per error, 8 per warning, clamp 0-100
    const rawScore = 100 - (errors.length * 20) - (warnings.length * 8);
    const score = Math.max(0, Math.min(100, rawScore));

    return {
      score,
      errors,
      warnings,
      passedRules,
      failedRules,
    };
  }
}
