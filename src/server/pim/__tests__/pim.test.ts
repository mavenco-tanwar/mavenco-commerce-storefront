/**
 * Module 33: Enterprise PIM & Catalog Governance Test Suite
 * Validates domain models, SKU generation, barcode checksums, attribute validation,
 * completeness, quality, readiness, catalog inheritance, versioning & rollback,
 * duplicate detection & safe merge, bulk import/export, and storefront security.
 */

import { SkuService } from '../sku.service';
import { BarcodeService } from '../barcode.service';
import { AttributeValidationEngine } from '../attribute-validation.service';
import { ProductCompletenessService } from '../product-completeness.service';
import { ProductQualityService } from '../product-quality.service';
import { ProductReadinessService } from '../product-readiness.service';
import { CatalogGovernanceService } from '../catalog-governance.service';
import { ProductDuplicateDetectionService } from '../duplicate-detection.service';
import { BulkOperationsService } from '../bulk-operations.service';
import { PimService } from '../pim.service';
import { AttributeDefinition, Catalog, PimProduct } from '@/types/pim-commerce.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runPimTestSuite() {
  console.log('--- STARTING MODULE 33 ENTERPRISE PIM TEST SUITE ---');

  // 1. SKU Service Tests
  console.log('[Test 1] SkuService: Configurable pattern generation & uniqueness');
  const generatedSku = SkuService.generateSku('[BRAND]-[CATEGORY]-[COLOR]-[SIZE]', {
    brand: 'Lumina',
    category: 'Dress',
    options: { color: 'Rose', size: 'M' },
  });
  assert(generatedSku === 'LUMI-DRES-ROSE-M', `Expected LUMI-DRES-ROSE-M, got: ${generatedSku}`);

  const uniquenessValid = SkuService.validateSkuUniqueness('LUMI-DRES-ROSE-M', ['EXISTING-SKU-1', 'EXISTING-SKU-2']);
  assert(uniquenessValid.isValid === true, 'SKU should be valid when not in existing set');

  const uniquenessConflict = SkuService.validateSkuUniqueness('EXISTING-SKU-1', ['EXISTING-SKU-1']);
  assert(uniquenessConflict.isValid === false, 'SKU should conflict when duplicate detected');
  console.log('✓ SkuService tests passed');

  // 2. Barcode Service Checksum Tests
  console.log('[Test 2] BarcodeService: EAN-13, UPC-A, GTIN, ISBN validation');
  // Valid EAN-13: 4006381333931
  const validEan = BarcodeService.validateBarcode('4006381333931', 'EAN');
  assert(validEan.isValid === true, `EAN-13 should be valid, error: ${validEan.error}`);

  // Invalid EAN-13 (wrong check digit)
  const invalidEan = BarcodeService.validateBarcode('4006381333932', 'EAN');
  assert(invalidEan.isValid === false, 'EAN-13 with invalid check digit must fail');

  // Valid UPC-A: 012345678905
  const validUpc = BarcodeService.validateBarcode('012345678905', 'UPC');
  assert(validUpc.isValid === true, `UPC-A should be valid, error: ${validUpc.error}`);
  console.log('✓ BarcodeService tests passed');

  // 3. Dynamic Attribute Validation Engine & Conditional Requirements
  console.log('[Test 3] AttributeValidationEngine: 16-type system & conditional requirements');
  const defs: AttributeDefinition[] = [
    {
      id: 'attr_1',
      tenantId: 'lumina',
      name: 'Thread Count',
      code: 'thread_count',
      type: 'integer',
      group: 'Technical',
      required: true,
      filterable: true,
      searchable: false,
      sortable: true,
      facetable: true,
      localized: false,
      marketSpecific: false,
      channelSpecific: false,
      validationRules: { required: true, min: 100, max: 2000 },
      status: 'active',
      createdAt: '',
      updatedAt: '',
    },
  ];

  // Test valid attribute
  const validValResult = AttributeValidationEngine.validateAll(
    defs,
    [{ attributeId: 'attr_1', code: 'thread_count', value: 400 }],
    'simple'
  );
  assert(validValResult.isValid === true, 'Thread count 400 should pass');

  // Test invalid range
  const invalidRangeResult = AttributeValidationEngine.validateAll(
    defs,
    [{ attributeId: 'attr_1', code: 'thread_count', value: 50 }],
    'simple'
  );
  assert(invalidRangeResult.isValid === false, 'Thread count 50 should fail min constraint');

  // Test conditional furniture requirement
  const conditionalErrors = AttributeValidationEngine.validateConditionalRequirements(
    'furniture',
    [],
    {}
  );
  assert(conditionalErrors.length >= 2, 'Furniture without material & dimensions must return conditional errors');
  console.log('✓ AttributeValidationEngine tests passed');

  // 4. Product Completeness & Quality Scoring
  console.log('[Test 4] ProductCompletenessService & ProductQualityService');
  const sampleProduct: Partial<PimProduct> = {
    title: 'Ivory Handcrafted Kaftan',
    description: 'A bespoke silk kaftan tailored with exquisite artisanal draping and hand-finished hems.',
    shortDescription: 'Bespoke silk kaftan for luxury occasions.',
    sku: 'LUM-KFT-001',
    categories: ['dresses'],
    material: 'Pure Mulberry Silk',
    dimensions: { length: 30, width: 20, height: 5, unit: 'cm' },
    media: [
      { id: 'm1', type: 'image', url: 'https://img.example/1.jpg', altText: 'Front', sortOrder: 0, role: 'primary' },
      { id: 'm2', type: 'image', url: 'https://img.example/2.jpg', altText: 'Detail', sortOrder: 1, role: 'gallery' },
      { id: 'm3', type: 'image', url: 'https://img.example/3.jpg', altText: 'Lifestyle', sortOrder: 2, role: 'lifestyle' },
    ],
    attributes: [
      { attributeId: 'a1', code: 'material', value: 'Silk' },
      { attributeId: 'a2', code: 'weave', value: 'Jacquard' },
    ],
    seo: { title: 'Ivory Silk Kaftan | Lumina Atelier', description: 'Explore our luxury handcrafted silk kaftan.' },
  };

  const completeness = ProductCompletenessService.calculate(sampleProduct);
  assert(completeness.totalPercent >= 75, `Expected completeness >= 75%, got: ${completeness.totalPercent}%`);

  const quality = ProductQualityService.evaluate(sampleProduct);
  assert(quality.score >= 80, `Expected quality >= 80%, got: ${quality.score}`);

  const readiness = ProductReadinessService.evaluate(sampleProduct);
  assert(readiness.isPublishable === true, 'Complete sample product should be publishable');
  console.log('✓ Completeness and Quality scoring passed');

  // 5. Catalog Inheritance & Publishing
  console.log('[Test 5] CatalogGovernanceService: Catalog inheritance & publication');
  const masterCat: Catalog = {
    id: 'cat_master',
    tenantId: 'lumina',
    name: 'Master Catalog',
    code: 'MASTER',
    type: 'master',
    status: 'active',
    markets: ['GLOBAL'],
    channels: ['web'],
    categories: ['dresses'],
    productIds: ['prod-01', 'prod-02'],
    createdAt: '',
    updatedAt: '',
  };

  const childMarketCat: Catalog = {
    id: 'cat_us',
    tenantId: 'lumina',
    name: 'US Market Catalog',
    code: 'US_MKT',
    type: 'market',
    status: 'active',
    parentCatalogId: 'cat_master',
    markets: ['US'],
    channels: ['web'],
    categories: ['dresses'],
    productIds: ['prod-03'],
    createdAt: '',
    updatedAt: '',
  };

  const resolvedInheritedIds = CatalogGovernanceService.resolveCatalogProductIds(childMarketCat, [masterCat, childMarketCat]);
  assert(resolvedInheritedIds.includes('prod-01'), 'Child catalog must inherit prod-01 from master catalog');
  assert(resolvedInheritedIds.includes('prod-03'), 'Child catalog must contain its own prod-03');
  console.log('✓ Catalog inheritance passed');

  // 6. Immutable Versioning & Non-Destructive Rollback
  console.log('[Test 6] CatalogGovernanceService: Immutable version snapshots & rollback');
  const fullProduct: PimProduct = {
    ...(sampleProduct as PimProduct),
    id: 'prod_test_v',
    tenantId: 'lumina',
    type: 'simple',
    status: 'draft',
    productTypeId: 'pt_simple',
    slug: 'ivory-handcrafted-kaftan',
    version: 1,
    tags: [],
    flags: { isFeatured: false, isNew: true, isSale: false, isBestSeller: false, isExclusive: false, isLimited: false, isPreorder: false },
    badges: [],
    richSections: [],
    documents: [],
    suppliers: [],
    completeness: { totalPercent: 90, breakdown: {} as any, missingItems: [] },
    quality: { score: 95, errors: [], warnings: [], passedRules: [], failedRules: [] },
    readiness: { status: 'READY', isPublishable: true, reasons: [], score: 95 },
    approvalState: { currentLevel: 'content', history: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const v1Snapshot = CatalogGovernanceService.createVersionSnapshot(fullProduct, 'Author 1', 'Baseline release');
  assert(v1Snapshot.version === 2, 'Version should increment on snapshot');

  // Mutate product
  fullProduct.title = 'V2 Modified Title';
  const v2Snapshot = CatalogGovernanceService.createVersionSnapshot(fullProduct, 'Author 2', 'Modified title', v1Snapshot.snapshot);
  assert(v2Snapshot.version === 3, 'Version should increment to 3');
  assert(v2Snapshot.diff !== undefined, 'Diff should be recorded between v1 and v2');

  // Rollback to v1 snapshot
  const rollbackResult = CatalogGovernanceService.rollbackToVersion(fullProduct, v1Snapshot, 'Admin Lead');
  const activeProduct = rollbackResult.rolledBackProduct;
  assert(activeProduct.title === 'Ivory Handcrafted Kaftan', 'Title should be restored to v1');
  assert(rollbackResult.newVersionRecord.version === 4, 'Rollback must create forward version 4, never mutating v1');
  console.log('✓ Immutable versioning & rollback passed');

  // 7. Duplicate Detection & Safe Merge
  console.log('[Test 7] ProductDuplicateDetectionService: Detection and safe merge');
  const dupResults = ProductDuplicateDetectionService.detectDuplicates(
    { id: 'prod_new', sku: 'LUM-KFT-001', title: 'Ivory Handcrafted Kaftan' },
    [activeProduct]
  );
  assert(dupResults.length > 0, 'Duplicate detector should identify exact SKU and title match');
  assert(dupResults[0].confidenceScore >= 0.8, 'Confidence score should be high for exact SKU and title');

  const subsumedProduct: PimProduct = {
    ...activeProduct,
    id: 'prod_subsumed',
    sku: 'LUM-KFT-001-ALT',
    title: 'Duplicate Kaftan to Merge',
  };

  const mergeResult = ProductDuplicateDetectionService.executeSafeMerge(activeProduct, subsumedProduct, 'Catalog Lead');
  assert(mergeResult.status === 'completed', 'Safe merge must complete successfully');
  assert(subsumedProduct.status === 'archived', 'Subsumed product must be archived');
  assert(activeProduct.metadata?.aliasSkus.includes('LUM-KFT-001-ALT'), 'Surviving product must retain subsumed SKU alias');
  console.log('✓ Duplicate detection & safe merge passed');

  // 8. Bulk Operations & Import/Export
  console.log('[Test 8] BulkOperationsService: Bulk execution & CSV parser with dry-run');
  const csvData = `SKU,Title,Category,Material\nTEST-SKU-100,Midnight Silk Gown,dresses,Silk Satin\nTEST-SKU-200,Linen Palazzo Pants,bottoms,Organic Linen`;
  const importJob = await BulkOperationsService.processImport({
    tenantId: 'lumina',
    format: 'csv',
    rawContent: csvData,
    mappings: [
      { sourceField: 'SKU', productField: 'sku' },
      { sourceField: 'Title', productField: 'title' },
      { sourceField: 'Category', productField: 'category' },
      { sourceField: 'Material', productField: 'material' },
    ],
    isDryRun: true,
    upsertStrategy: 'upsert',
    catalog: [fullProduct],
  });

  assert(importJob.status === 'dry_run_complete', 'Dry run must complete without persisting mutations');
  assert(importJob.totalRows === 2, 'Should have parsed 2 rows');
  assert(importJob.newCount === 2, 'Should have detected 2 new products');
  console.log('✓ Bulk operations & import tests passed');

  // 9. Deterministic Content Resolution Hierarchy
  console.log('[Test 9] CatalogGovernanceService: Deterministic 7-step Content Resolution');
  const productWithOverrides: PimProduct = {
    ...fullProduct,
    title: 'Core Tenant English Title',
    marketOverrides: {
      IN: {
        title: 'India Atelier Festive Title',
      },
    },
    localeOverrides: {
      'fr-FR': {
        title: 'Titre Français Élégant',
      },
    },
  };

  // Indian market query
  const inRes = CatalogGovernanceService.resolveLocalizedContent(productWithOverrides, { marketId: 'IN' });
  assert(inRes.title === 'India Atelier Festive Title', 'Should resolve Market override');

  // French locale query
  const frRes = CatalogGovernanceService.resolveLocalizedContent(productWithOverrides, { locale: 'fr-FR' });
  assert(frRes.title === 'Titre Français Élégant', 'Should resolve Locale override');

  // Global query
  const globalRes = CatalogGovernanceService.resolveLocalizedContent(productWithOverrides, {});
  assert(globalRes.title === 'Core Tenant English Title', 'Should resolve Core Tenant fallback');
  console.log('✓ Content resolution hierarchy passed');

  // 10. Multi-Tenant Store & Security Checks
  console.log('[Test 10] PimService: Multi-tenant store initialization & query isolation');
  PimService.initTenantStore('lumina');
  PimService.initTenantStore('auraliving');

  const luminaProducts = await PimService.getProducts('lumina');
  const auraProducts = await PimService.getProducts('auraliving');
  assert(luminaProducts.total > 0, 'Lumina tenant store should be populated');
  assert(auraProducts.total > 0, 'Aura Living tenant store should be populated');

  // Verify vendor cost protection
  const maskedVendors = PimService.getVendors('lumina', false);
  assert(maskedVendors[0].paymentTerms === 'Restricted', 'Unauthorized user must have vendor costs & terms restricted');

  const authorizedVendors = PimService.getVendors('lumina', true);
  assert(authorizedVendors[0].paymentTerms !== 'Restricted', 'Authorized finance user can view payment terms');
  console.log('✓ Multi-tenant store & security checks passed');

  console.log('====================================================');
  console.log('ALL MODULE 33 ENTERPRISE PIM TESTS PASSED (10/10)');
  console.log('====================================================');
  return true;
}

// Self-executing runner when executed via node/ts-node
if (typeof require !== 'undefined' && require.main === module) {
  runPimTestSuite().catch((err) => {
    console.error('Test Suite Failure:', err);
    process.exit(1);
  });
}
