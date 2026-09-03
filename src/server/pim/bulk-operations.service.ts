/**
 * Module 33: BulkOperationsService & Import/Export Engine
 * High-throughput asynchronous bulk operations, CSV/JSON parser with visual mapping,
 * dry-run simulations, version-creating upserts, and failure reports.
 */

import {
  BulkOperationJob,
  ImportMapping,
  PimProduct,
  ProductExportJob,
  ProductImportJob,
} from '@/types/pim-commerce.types';

export class BulkOperationsService {
  private static bulkJobs: Map<string, BulkOperationJob> = new Map();
  private static importJobs: Map<string, ProductImportJob> = new Map();
  private static exportJobs: Map<string, ProductExportJob> = new Map();

  /**
   * Executes a bulk operation on a set of product IDs
   */
  public static async executeBulkOperation(params: {
    tenantId: string;
    productIds: string[];
    operation: BulkOperationJob['operationType'];
    payload?: any;
    productsCatalog: PimProduct[];
  }): Promise<BulkOperationJob> {
    const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const total = params.productIds.length;

    const job: BulkOperationJob = {
      id: jobId,
      tenantId: params.tenantId,
      operationType: params.operation,
      status: 'running',
      total,
      processed: 0,
      successCount: 0,
      failedCount: 0,
      failures: [],
      createdAt: new Date().toISOString(),
    };

    this.bulkJobs.set(jobId, job);

    for (const pid of params.productIds) {
      const prod = params.productsCatalog.find((p) => p.id === pid);
      job.processed++;

      if (!prod) {
        job.failedCount++;
        job.failures.push({ productId: pid, error: 'Product not found in catalog' });
        continue;
      }

      try {
        switch (params.operation) {
          case 'publish':
            prod.status = 'published';
            break;
          case 'unpublish':
            prod.status = 'unpublished';
            break;
          case 'archive':
            prod.status = 'archived';
            break;
          case 'category_assignment':
            if (params.payload?.categoryId) {
              const catSet = new Set(prod.categories || []);
              catSet.add(params.payload.categoryId);
              prod.categories = Array.from(catSet);
            }
            break;
          case 'attribute_update':
            if (params.payload?.code && params.payload?.value !== undefined) {
              const attrs = prod.attributes || [];
              const existingIdx = attrs.findIndex((a) => a.code === params.payload.code);
              if (existingIdx >= 0) {
                attrs[existingIdx].value = params.payload.value;
              } else {
                attrs.push({
                  attributeId: `attr_${params.payload.code}`,
                  code: params.payload.code,
                  value: params.payload.value,
                });
              }
              prod.attributes = attrs;
            }
            break;
          default:
            break;
        }
        job.successCount++;
      } catch (err: any) {
        job.failedCount++;
        job.failures.push({ productId: pid, error: err.message || 'Operation failed' });
      }
    }

    job.status = job.failedCount === 0 ? 'completed' : job.successCount === 0 ? 'failed' : 'partial';
    job.completedAt = new Date().toISOString();
    return job;
  }

  /**
   * Parses raw CSV text into rows of key-value objects
   */
  public static parseCsv(csvText: string): Array<Record<string, string>> {
    const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows: Array<Record<string, string>> = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });
      rows.push(row);
    }

    return rows;
  }

  /**
   * Applies visual field mappings and transformations to raw source rows
   */
  public static applyMappings(
    rawRows: Array<Record<string, any>>,
    mappings: ImportMapping[]
  ): Array<Record<string, any>> {
    return rawRows.map((row) => {
      const transformed: Record<string, any> = {};

      mappings.forEach((m) => {
        let val = row[m.sourceField] !== undefined ? row[m.sourceField] : m.defaultValue;

        if (val !== undefined && m.transformation) {
          const str = String(val);
          switch (m.transformation) {
            case 'trim':
              val = str.trim();
              break;
            case 'uppercase':
              val = str.toUpperCase();
              break;
            case 'lowercase':
              val = str.toLowerCase();
              break;
            case 'parse_number':
              val = Number(str) || 0;
              break;
            case 'split_comma':
              val = str.split(',').map((s) => s.trim()).filter(Boolean);
              break;
          }
        }

        transformed[m.productField] = val;
      });

      return transformed;
    });
  }

  /**
   * Simulates or executes a Product Import Job with dry-run support
   */
  public static async processImport(params: {
    tenantId: string;
    format: 'csv' | 'json';
    rawContent: string;
    mappings: ImportMapping[];
    isDryRun: boolean;
    upsertStrategy: 'create' | 'update' | 'upsert' | 'skip';
    catalog: PimProduct[];
  }): Promise<ProductImportJob> {
    const jobId = `import_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let rows: Array<Record<string, any>> = [];
    if (params.format === 'csv') {
      rows = this.parseCsv(params.rawContent);
    } else {
      try {
        const parsed = JSON.parse(params.rawContent);
        rows = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        rows = [];
      }
    }

    const transformedRows = this.applyMappings(rows, params.mappings);

    const job: ProductImportJob = {
      id: jobId,
      tenantId: params.tenantId,
      format: params.format,
      status: 'running',
      isDryRun: params.isDryRun,
      mappings: params.mappings,
      totalRows: rows.length,
      newCount: 0,
      updateCount: 0,
      skipCount: 0,
      errorCount: 0,
      errors: [],
      warnings: [],
      previewRows: transformedRows.slice(0, 5),
      createdAt: new Date().toISOString(),
    };

    const existingSkus = new Map<string, PimProduct>();
    params.catalog.forEach((p) => existingSkus.set(p.sku.toUpperCase(), p));

    transformedRows.forEach((row, idx) => {
      const rowIndex = idx + 1;
      const sku = (row.sku || '').toString().trim().toUpperCase();
      const title = (row.title || '').toString().trim();

      if (!sku) {
        job.errorCount++;
        job.errors.push({ row: rowIndex, identifier: 'UNKNOWN', error: 'Missing required SKU' });
        return;
      }

      if (!title) {
        job.errorCount++;
        job.errors.push({ row: rowIndex, identifier: sku, error: 'Missing product title' });
        return;
      }

      const existing = existingSkus.get(sku);

      if (existing) {
        if (params.upsertStrategy === 'skip') {
          job.skipCount++;
        } else if (params.upsertStrategy === 'update' || params.upsertStrategy === 'upsert') {
          job.updateCount++;
          if (!params.isDryRun) {
            existing.title = title;
            if (row.description) existing.description = row.description;
            if (row.material) existing.material = row.material;
            if (row.category) {
              const cats = new Set(existing.categories || []);
              cats.add(row.category);
              existing.categories = Array.from(cats);
            }
            existing.version = (existing.version || 1) + 1;
            existing.updatedAt = new Date().toISOString();
          }
        } else {
          job.errorCount++;
          job.errors.push({ row: rowIndex, identifier: sku, error: `SKU already exists and strategy is ${params.upsertStrategy}` });
        }
      } else {
        if (params.upsertStrategy === 'update') {
          job.skipCount++;
        } else {
          job.newCount++;
          if (!params.isDryRun) {
            const newProduct: PimProduct = {
              id: `prod_imp_${Date.now()}_${idx}`,
              tenantId: params.tenantId,
              type: 'simple',
              status: 'draft',
              productTypeId: 'simple',
              title,
              slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `product-${Date.now()}`,
              sku,
              description: row.description || title,
              shortDescription: row.shortDescription || title,
              material: row.material,
              categories: row.category ? [row.category] : ['general'],
              tags: Array.isArray(row.tags) ? row.tags : [],
              flags: {
                isFeatured: false,
                isNew: true,
                isSale: false,
                isBestSeller: false,
                isExclusive: false,
                isLimited: false,
                isPreorder: false,
              },
              badges: [],
              richSections: [],
              attributes: [],
              variants: [],
              media: row.image
                ? [
                    {
                      id: `media_${Date.now()}`,
                      type: 'image',
                      url: row.image,
                      altText: title,
                      sortOrder: 0,
                      role: 'primary',
                    },
                  ]
                : [],
              documents: [],
              suppliers: [],
              seo: {
                title: `${title} | Storefront`,
                description: row.shortDescription || title,
              },
              completeness: {
                totalPercent: 75,
                breakdown: { content: 80, media: 60, attributes: 60, seo: 80, localization: 50, channelRequirements: 80, marketRequirements: 70 },
                missingItems: [],
              },
              quality: { score: 85, errors: [], warnings: [], passedRules: [], failedRules: [] },
              readiness: { status: 'READY', isPublishable: true, reasons: [], score: 85 },
              approvalState: { currentLevel: 'content', history: [] },
              version: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            params.catalog.push(newProduct);
          }
        }
      }
    });

    job.status = params.isDryRun ? 'dry_run_complete' : job.errorCount === 0 ? 'completed' : 'partial';
    job.completedAt = new Date().toISOString();
    this.importJobs.set(jobId, job);
    return job;
  }

  /**
   * Generates export records
   */
  public static generateExport(
    tenantId: string,
    catalog: PimProduct[],
    filters: ProductExportJob['filterParams'] = {}
  ): ProductExportJob {
    const jobId = `export_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let filtered = catalog.filter((p) => p.tenantId === tenantId);
    if (filters.status) filtered = filtered.filter((p) => p.status === filters.status);
    if (filters.categoryId) filtered = filtered.filter((p) => p.categories.includes(filters.categoryId!));
    if (filters.brandId) filtered = filtered.filter((p) => p.brandId === filters.brandId);

    const job: ProductExportJob = {
      id: jobId,
      tenantId,
      format: 'json',
      filterParams: filters,
      status: 'completed',
      downloadUrl: `/api/v1/catalog/exports?jobId=${jobId}`,
      recordCount: filtered.length,
      createdAt: new Date().toISOString(),
    };

    this.exportJobs.set(jobId, job);
    return job;
  }
}
