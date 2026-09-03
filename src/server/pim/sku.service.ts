/**
 * Module 33: SkuService
 * Configurable pattern generation and tenant-scoped uniqueness verification.
 */

export interface SkuPatternContext {
  brand?: string;
  category?: string;
  title?: string;
  options?: Record<string, string>; // e.g. { color: "Blush", size: "M" }
  customPrefix?: string;
  sequenceNumber?: number;
}

export class SkuService {
  /**
   * Generates a normalized SKU based on a configurable pattern template.
   * Template tokens: [BRAND], [CATEGORY], [COLOR], [SIZE], [SEQ], [PREFIX], [OPTION:key]
   * Default pattern: [BRAND]-[CATEGORY]-[COLOR]-[SIZE]
   */
  public static generateSku(
    pattern: string = '[BRAND]-[CATEGORY]-[COLOR]-[SIZE]',
    context: SkuPatternContext
  ): string {
    const sanitize = (val?: string) =>
      (val || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 4) || 'GEN';

    const brandPart = sanitize(context.brand || 'ATELIER');
    const categoryPart = sanitize(context.category || 'PROD');
    const colorPart = sanitize(context.options?.color || context.options?.Color || 'STD');
    const sizePart = (context.options?.size || context.options?.Size || 'REG')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 3);

    const prefixPart = (context.customPrefix || 'SKU').toUpperCase();
    const seqPart = String(context.sequenceNumber || Math.floor(1000 + Math.random() * 9000));

    let sku = pattern
      .replace(/\[BRAND\]/gi, brandPart)
      .replace(/\[CATEGORY\]/gi, categoryPart)
      .replace(/\[COLOR\]/gi, colorPart)
      .replace(/\[SIZE\]/gi, sizePart)
      .replace(/\[PREFIX\]/gi, prefixPart)
      .replace(/\[SEQ\]/gi, seqPart);

    // Replace dynamic option tokens like [OPTION:material]
    sku = sku.replace(/\[OPTION:([a-zA-Z0-9_]+)\]/gi, (_, key) => {
      return sanitize(context.options?.[key] || 'VAL');
    });

    // Clean any leftover double dashes or stray symbols
    sku = sku.replace(/-+/g, '-').replace(/^-|-$/g, '');

    return sku || `SKU-${Date.now()}`;
  }

  /**
   * Validates SKU format and checks tenant-scoped uniqueness
   */
  public static validateSkuUniqueness(
    sku: string,
    existingSkus: Set<string> | string[]
  ): { isValid: boolean; error?: string } {
    const cleanSku = sku.trim().toUpperCase();
    if (!cleanSku) {
      return { isValid: false, error: 'SKU cannot be empty' };
    }

    if (cleanSku.length < 3) {
      return { isValid: false, error: 'SKU must be at least 3 characters long' };
    }

    if (!/^[A-Z0-9-_.]+$/.test(cleanSku)) {
      return { isValid: false, error: 'SKU can only contain alphanumeric characters, hyphens, and underscores' };
    }

    const set = existingSkus instanceof Set ? existingSkus : new Set(existingSkus.map((s) => s.toUpperCase()));
    if (set.has(cleanSku)) {
      return { isValid: false, error: `SKU '${cleanSku}' already exists in tenant catalog` };
    }

    return { isValid: true };
  }
}
