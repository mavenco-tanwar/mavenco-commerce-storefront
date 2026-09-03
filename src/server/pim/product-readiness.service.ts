/**
 * Module 33: ProductReadinessService
 * Evaluates whether a product is READY, WARNING, or BLOCKED for publishing.
 */

import { PimProduct, ProductReadinessReport, ReadinessStatus } from '@/types/pim-commerce.types';

export class ProductReadinessService {
  /**
   * Assesses overall product readiness for publishing
   */
  public static evaluate(product: Partial<PimProduct>): ProductReadinessReport {
    const blockers: string[] = [];
    const warnings: string[] = [];

    // Critical Blockers
    if (!product.title || product.title.trim().length < 2) {
      blockers.push('Missing product title');
    }

    if (!product.sku || product.sku.trim().length < 2) {
      blockers.push('Missing or invalid product SKU');
    }

    const images = (product.media || []).filter((m) => m.type === 'image');
    if (images.length === 0) {
      blockers.push('Missing at least one product image');
    }

    if (product.status === 'archived' || product.status === 'rejected') {
      blockers.push(`Product is in ${product.status} state and cannot be published`);
    }

    // Warnings
    if (images.length > 0 && !images.some((m) => m.role === 'primary')) {
      warnings.push('Missing primary role image designation');
    }

    if (!product.taxCategoryId) {
      warnings.push('Missing tax category assignment');
    }

    if (!product.shippingClassId && product.type !== 'digital' && product.type !== 'service') {
      warnings.push('Missing shipping class assignment');
    }

    if (!product.seo?.title || !product.seo?.description) {
      warnings.push('Incomplete SEO metadata (title or meta description missing)');
    }

    if (!product.categories || product.categories.length === 0) {
      warnings.push('Product is not assigned to any category');
    }

    if (!product.material && product.type === 'apparel') {
      warnings.push('Missing fabric/material composition');
    }

    let status: ReadinessStatus = 'READY';
    let isPublishable = true;

    if (blockers.length > 0) {
      status = 'BLOCKED';
      isPublishable = false;
    } else if (warnings.length > 0) {
      status = 'WARNING';
      isPublishable = true; // publishable with warnings
    }

    const totalReasons = [...blockers.map((b) => `[BLOCKER] ${b}`), ...warnings.map((w) => `[WARNING] ${w}`)];

    // Readiness score out of 100
    const score = Math.max(0, 100 - blockers.length * 35 - warnings.length * 10);

    return {
      status,
      isPublishable,
      reasons: totalReasons,
      score,
    };
  }
}
