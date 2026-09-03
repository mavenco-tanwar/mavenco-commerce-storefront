/**
 * Module 33: Enterprise Product Information Management (PIM) & Catalog Governance
 * Domain Types Definition
 */

export type ProductType =
  | 'simple'
  | 'variable'
  | 'digital'
  | 'service'
  | 'bundle'
  | 'kit'
  | 'gift_card'
  | 'subscription'
  | 'composite'
  | string; // custom product types

export type ProductStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'unpublished'
  | 'archived'
  | 'rejected';

export type ApprovalLevel = 'content' | 'merchandising' | 'compliance' | 'publish';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ProductApproval {
  id: string;
  productId: string;
  requestedBy: string;
  reviewedBy?: string;
  level: ApprovalLevel;
  status: ApprovalStatus;
  comments?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export type AttributeType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'decimal'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multi_select'
  | 'color'
  | 'measurement'
  | 'currency'
  | 'url'
  | 'email'
  | 'json';

export type AttributeGroupName =
  | 'General'
  | 'Dimensions'
  | 'Materials'
  | 'Care'
  | 'Technical'
  | 'SEO'
  | 'Marketing'
  | 'Compliance'
  | 'Shipping'
  | string;

export interface AttributeValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  regex?: string;
  allowedValues?: string[];
  length?: number;
  decimalPrecision?: number;
  unit?: string;
  dependency?: {
    field: string;
    value: any;
  };
}

export interface AttributeDefinition {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: AttributeType;
  description?: string;
  group: AttributeGroupName;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
  sortable: boolean;
  facetable: boolean;
  localized: boolean;
  marketSpecific: boolean;
  channelSpecific: boolean;
  validationRules: AttributeValidationRule;
  options?: Array<{ label: string; value: string }>;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AttributeGroup {
  id: string;
  tenantId: string;
  name: AttributeGroupName;
  code: string;
  sortOrder: number;
  description?: string;
  attributes: string[]; // attribute codes
}

export interface ProductAttributeValue {
  attributeId: string;
  code: string;
  value: any;
  locale?: string;
  marketId?: string;
  channelId?: string;
}

export interface ProductTypeConfig {
  id: string;
  tenantId: string;
  name: string;
  code: ProductType;
  description?: string;
  attributes: string[]; // attribute IDs
  variantDimensions: string[]; // e.g. ['color', 'size', 'material']
  requiredFields: string[];
  mediaRequirements: {
    minImages: number;
    requirePrimaryImage: boolean;
    allowedTypes: Array<'image' | 'video' | 'document' | '360' | 'model'>;
  };
  pricingRules?: {
    allowNegative?: boolean;
    requireCompareAt?: boolean;
  };
  inventoryBehavior: 'track' | 'dont_track' | 'composite';
  shippingBehavior: 'physical' | 'digital' | 'service';
  defaultTaxCategoryId?: string;
  workflowRequiredLevels: ApprovalLevel[];
  publishingRules?: {
    requireApproval: boolean;
    minCompletenessScore: number;
  };
  isSystem: boolean;
}

export interface VariantOptionValue {
  id: string;
  code: string;
  label: string;
  swatchHex?: string;
  image?: string;
}

export interface VariantOption {
  id: string;
  name: string; // e.g. Color, Size, Finish, Memory
  code: string; // color, size, finish, memory
  values: VariantOptionValue[];
}

export interface PimVariant {
  id: string;
  productId: string;
  sku: string;
  barcode?: string;
  title: string;
  optionValues: Record<string, string>; // { color: "Blush", size: "M" }
  priceReference?: {
    basePrice: number;
    compareAtPrice?: number;
    currency: string;
  };
  inventoryReference?: {
    sku: string;
    trackInventory: boolean;
  };
  weight?: number; // in grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  media?: ProductMedia[];
  status: 'active' | 'inactive';
  metadata?: Record<string, any>;
}

export type BarcodeType = 'EAN' | 'UPC' | 'GTIN' | 'ISBN' | 'custom';

export interface ProductIdentifier {
  id: string;
  type: 'SKU' | 'GTIN' | 'MPN' | 'ISBN' | 'UPC' | 'EAN' | 'ASIN' | 'external';
  value: string;
  isPrimary?: boolean;
  provider?: string;
}

export interface Brand {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  country?: string;
  status: 'active' | 'archived';
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  localizedContent?: Record<string, {
    name?: string;
    description?: string;
    seo?: { title?: string; description?: string };
  }>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Manufacturer {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  country: string;
  website?: string;
  certifications?: string[];
  status: 'active' | 'archived';
}

export interface Vendor {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  currency: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
}

export interface ProductSupplier {
  id: string;
  productId: string;
  vendorId: string;
  vendorSku: string;
  costReference?: {
    unitCost: number;
    currency: string;
  };
  leadTimeDays: number;
  minimumOrderQuantity: number;
  status: 'preferred' | 'active' | 'inactive';
}

export type MediaRole =
  | 'primary'
  | 'gallery'
  | 'thumbnail'
  | 'swatch'
  | 'variant'
  | 'lifestyle'
  | 'technical'
  | 'instruction'
  | 'video'
  | '360';

export interface ProductMedia {
  id: string;
  type: 'image' | 'video' | 'document' | '360' | 'model' | 'manual';
  url: string;
  thumbnailUrl?: string;
  altText: string;
  title?: string;
  caption?: string;
  locale?: string;
  market?: string;
  channel?: string;
  sortOrder: number;
  role: MediaRole;
  variantIds?: string[];
  metadata?: {
    width?: number;
    height?: number;
    sizeBytes?: number;
    mimeType?: string;
  };
}

export interface ProductDocument {
  id: string;
  productId: string;
  type: 'manual' | 'specification' | 'warranty' | 'certificate' | 'care_guide';
  title: string;
  url: string;
  fileSizeBytes: number;
  mimeType: string;
  locale?: string;
  isRestricted?: boolean;
}

export interface ProductRichBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'gallery' | 'accordion' | 'tabs' | 'comparison' | 'icons' | 'custom';
  title?: string;
  data: Record<string, any>;
  sortOrder: number;
}

export interface ProductRichSection {
  id: string;
  title: string;
  type: 'overview' | 'specs' | 'story' | 'materials' | 'faq' | 'custom';
  blocks: ProductRichBlock[];
  sortOrder: number;
}

export interface ProductCompletenessScore {
  totalPercent: number;
  breakdown: {
    content: number;
    media: number;
    attributes: number;
    seo: number;
    localization: number;
    channelRequirements: number;
    marketRequirements: number;
  };
  missingItems: string[];
}

export interface ProductQualityRule {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'content' | 'media' | 'attributes' | 'seo' | 'tax_shipping' | 'integrity';
}

export interface ProductQualityScore {
  score: number; // 0-100
  errors: string[];
  warnings: string[];
  passedRules: string[];
  failedRules: string[];
}

export type ReadinessStatus = 'READY' | 'WARNING' | 'BLOCKED';

export interface ProductReadinessReport {
  status: ReadinessStatus;
  isPublishable: boolean;
  reasons: string[];
  score: number;
}

export type ProductRelationType =
  | 'related'
  | 'similar'
  | 'accessory'
  | 'replacement'
  | 'compatible'
  | 'frequently_bought'
  | 'upsell'
  | 'cross_sell'
  | 'alternative'
  | 'bundle_component';

export interface ProductRelation {
  id: string;
  sourceProductId: string;
  targetProductId: string;
  type: ProductRelationType;
  sourceType: 'manual' | 'rule_based' | 'AI_suggested';
  score?: number; // similarity or relevance score
  sortOrder: number;
  metadata?: Record<string, any>;
}

export type BundleType = 'fixed' | 'dynamic' | 'discounted' | 'mixed';

export interface BundleComponent {
  id: string;
  bundleId: string;
  productId: string;
  variantId?: string;
  productName?: string;
  quantity: number;
  required: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  unitPriceReference?: number;
}

export interface Bundle {
  id: string;
  tenantId: string;
  productId: string; // The parent bundle product
  bundleType: BundleType;
  discountPercentage?: number;
  components: BundleComponent[];
  status: 'active' | 'inactive';
}

export interface Kit {
  id: string;
  tenantId: string;
  productId: string;
  warehouseSku: string;
  fixedComponents: BundleComponent[];
  allowedSubstitutions?: Array<{
    originalProductId: string;
    substituteProductId: string;
    substitutionRatio: number;
  }>;
  warehouseInstructions?: string;
  status: 'active' | 'inactive';
}

export interface ProductAddOn {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: 'gift_wrapping' | 'engraving' | 'assembly' | 'warranty' | 'custom';
  description?: string;
  priceReference: number;
  currency: string;
  requiresShipping: boolean;
  trackInventory: boolean;
  sku?: string;
  status: 'active' | 'inactive';
}

export type CatalogType = 'master' | 'market' | 'channel' | 'campaign' | 'seasonal';

export interface Catalog {
  id: string;
  tenantId: string;
  storeId?: string;
  name: string;
  code: string;
  type: CatalogType;
  status: 'active' | 'draft' | 'archived';
  parentCatalogId?: string; // inheritance parent
  markets: string[]; // e.g. ['US', 'IN', 'EU']
  channels: string[]; // e.g. ['web', 'mobile', 'pos', 'marketplace']
  categories: string[];
  productIds: string[];
  rules?: SmartCollectionRule[];
  createdAt: string;
  updatedAt: string;
}

export interface SmartCollectionRule {
  id: string;
  field: 'brand' | 'category' | 'attribute' | 'price' | 'inventory' | 'rating' | 'sales' | 'promotion' | 'status';
  attributeCode?: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
}

export type PublicationStatus = 'draft' | 'pending' | 'published' | 'failed' | 'unpublished' | 'scheduled';

export interface ProductPublication {
  id: string;
  tenantId: string;
  productId: string;
  catalogId: string;
  marketId: string;
  channelId: string;
  status: PublicationStatus;
  publishedAt?: string;
  unpublishedAt?: string;
  publishAt?: string; // scheduled
  unpublishAt?: string; // scheduled
  version: number;
  errors?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVersion {
  id: string;
  productId: string;
  tenantId: string;
  version: number;
  changedBy: string;
  changedAt: string;
  changeSummary: string;
  diff?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  snapshot: Record<string, any>;
}

export interface BulkOperationJob {
  id: string;
  tenantId: string;
  operationType:
    | 'publish'
    | 'unpublish'
    | 'archive'
    | 'category_assignment'
    | 'attribute_update'
    | 'market_assignment'
    | 'channel_assignment';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
  total: number;
  processed: number;
  successCount: number;
  failedCount: number;
  failures: Array<{
    productId: string;
    error: string;
  }>;
  createdAt: string;
  completedAt?: string;
}

export interface ImportMapping {
  sourceField: string;
  productField: string;
  transformation?: 'trim' | 'uppercase' | 'lowercase' | 'parse_number' | 'split_comma';
  defaultValue?: string;
  required?: boolean;
}

export interface ProductImportJob {
  id: string;
  tenantId: string;
  format: 'csv' | 'json' | 'xml';
  status: 'queued' | 'validating' | 'running' | 'completed' | 'failed' | 'dry_run_complete' | 'partial';
  isDryRun: boolean;
  mappings: ImportMapping[];
  totalRows: number;
  newCount: number;
  updateCount: number;
  skipCount: number;
  errorCount: number;
  errors: Array<{ row: number; identifier: string; error: string }>;
  warnings: Array<{ row: number; identifier: string; warning: string }>;
  previewRows?: Array<Record<string, any>>;
  createdAt: string;
  completedAt?: string;
}

export interface ProductExportJob {
  id: string;
  tenantId: string;
  format: 'csv' | 'json';
  filterParams?: {
    catalogId?: string;
    categoryId?: string;
    marketId?: string;
    channelId?: string;
    status?: ProductStatus;
    brandId?: string;
  };
  status: 'queued' | 'running' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSizeBytes?: number;
  recordCount: number;
  createdAt: string;
}

export interface ExternalProductReference {
  id: string;
  tenantId: string;
  provider: 'shopify' | 'amazon' | 'netsuite' | 'sap' | 'salesforce' | 'magento' | string;
  externalProductId: string;
  externalVariantId?: string;
  productId: string;
  variantId?: string;
  lastSyncedAt: string;
  syncStatus: 'synced' | 'pending' | 'error';
  syncError?: string;
}

export interface ProductFieldOwnership {
  id: string;
  tenantId: string;
  field: string;
  source: 'PIM' | 'ERP' | 'Pricing' | 'Inventory' | 'WMS' | 'CRM';
  priority: number;
  channel?: string;
  market?: string;
}

export interface ProductComment {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  text: string;
  mentions?: string[];
  resolved: boolean;
  createdAt: string;
}

export interface ProductTask {
  id: string;
  productId: string;
  title: string;
  type: 'add_images' | 'translate' | 'complete_seo' | 'approve' | 'verify_specs';
  assignedTo?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface ProductBadgeDefinition {
  id: string;
  code: string;
  label: string;
  colorScheme: 'gold' | 'emerald' | 'crimson' | 'sapphire' | 'slate';
  position: 'top-left' | 'top-right';
  criteria?: 'isNew' | 'isSale' | 'isBestSeller' | 'manual';
}

export interface MerchandisingRule {
  id: string;
  tenantId: string;
  name: string;
  query?: string;
  category?: string;
  action: 'boost' | 'bury' | 'pin' | 'exclude' | 'promote';
  targetProductId: string;
  targetProductName?: string;
  pinPosition?: number;
  boostMultiplier?: number;
  market?: string;
  channel?: string;
  schedule?: {
    startDate?: string;
    endDate?: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
}

/**
 * Authoritative Enterprise PIM Product Model
 */
export interface PimProduct {
  id: string;
  tenantId: string;
  type: ProductType;
  status: ProductStatus;
  productTypeId: string;
  brandId?: string;
  brandName?: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  slug: string;
  sku: string;
  barcode?: string;
  barcodeType?: BarcodeType;
  vendor?: string;
  vendorId?: string;
  manufacturer?: string;
  manufacturerId?: string;
  material?: string;
  careInstructions?: string[];
  countryOfOrigin?: string;
  weight?: number; // in grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  taxCategoryId?: string;
  shippingClassId?: string;
  defaultVariantId?: string;
  seo: {
    title?: string;
    description?: string;
    slug?: string;
    canonicalUrl?: string;
    robots?: string;
    ogImage?: string;
    structuredDataOverride?: Record<string, any>;
  };
  metadata?: Record<string, any>;

  // Extended Governance & Rich Content
  categories: string[];
  primaryCategoryId?: string;
  tags: string[];
  flags: {
    isFeatured: boolean;
    isNew: boolean;
    isSale: boolean;
    isBestSeller: boolean;
    isExclusive: boolean;
    isLimited: boolean;
    isPreorder: boolean;
  };
  badges: string[];
  richSections: ProductRichSection[];
  attributes: ProductAttributeValue[];
  variants: PimVariant[];
  media: ProductMedia[];
  documents: ProductDocument[];
  suppliers: ProductSupplier[];
  addOnIds?: string[];

  // Completeness & Quality (Computed)
  completeness: ProductCompletenessScore;
  quality: ProductQualityScore;
  readiness: ProductReadinessReport;

  // Multi-market & Localized Content overrides
  marketOverrides?: Record<string, {
    title?: string;
    subtitle?: string;
    description?: string;
    shortDescription?: string;
    seo?: { title?: string; description?: string };
    badges?: string[];
    priceReference?: { basePrice: number; currency: string };
  }>;
  localeOverrides?: Record<string, {
    title?: string;
    subtitle?: string;
    description?: string;
    shortDescription?: string;
  }>;

  // Auditing & Workflow
  approvalState: {
    currentLevel: ApprovalLevel;
    history: ProductApproval[];
  };
  version: number;
  lastEditor?: string;
  createdAt: string;
  updatedAt: string;
}
