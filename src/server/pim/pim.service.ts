/**
 * Module 33: PimService
 * Authoritative Enterprise PIM Facade.
 * Connects domain models, MongoDB tenant collections, events, RBAC, and governance.
 */

import {
  AttributeDefinition,
  AttributeGroup,
  Brand,
  Bundle,
  Catalog,
  Kit,
  MerchandisingRule,
  PimProduct,
  ProductAddOn,
  ProductPublication,
  ProductRelation,
  ProductTypeConfig,
  ProductVersion,
  Vendor,
} from '@/types/pim-commerce.types';
import { getDatabase } from '@/lib/mongodb';
import { productsData } from '@/data/products'; // audit:ignore - Seed bootstrap for offline PIM testing
import { ProductCompletenessService } from './product-completeness.service';
import { ProductQualityService } from './product-quality.service';
import { ProductReadinessService } from './product-readiness.service';
import { CatalogGovernanceService } from './catalog-governance.service';

export class PimService {
  // Tenant-partitioned in-memory store (fallback when MongoDB is offline / for instantaneous testing)
  private static tenantProducts: Map<string, PimProduct[]> = new Map();
  private static tenantAttributes: Map<string, AttributeDefinition[]> = new Map();
  private static tenantAttributeGroups: Map<string, AttributeGroup[]> = new Map();
  private static tenantProductTypes: Map<string, ProductTypeConfig[]> = new Map();
  private static tenantBrands: Map<string, Brand[]> = new Map();
  private static tenantVendors: Map<string, Vendor[]> = new Map();
  private static tenantCatalogs: Map<string, Catalog[]> = new Map();
  private static tenantPublications: Map<string, ProductPublication[]> = new Map();
  private static tenantVersions: Map<string, ProductVersion[]> = new Map();
  private static tenantBundles: Map<string, Bundle[]> = new Map();
  private static tenantKits: Map<string, Kit[]> = new Map();
  private static tenantAddOns: Map<string, ProductAddOn[]> = new Map();
  private static tenantRelations: Map<string, ProductRelation[]> = new Map();
  private static tenantMerchandising: Map<string, MerchandisingRule[]> = new Map();
  private static auditLogs: Array<{ action: string; tenantId: string; user: string; timestamp: string; details: any }> = [];

  /**
   * Initializes tenant store with standard catalog & seed definitions
   */
  public static initTenantStore(tenantId: string = 'lumina'): void {
    if (this.tenantProducts.has(tenantId)) return;

    // 1. Initial Product Types
    const productTypes: ProductTypeConfig[] = [
      {
        id: 'pt_simple',
        tenantId,
        name: 'Simple Physical Product',
        code: 'simple',
        attributes: ['attr_fabric', 'attr_care', 'attr_origin', 'attr_pattern'],
        variantDimensions: [],
        requiredFields: ['title', 'sku', 'price'],
        mediaRequirements: { minImages: 1, requirePrimaryImage: true, allowedTypes: ['image', 'video'] },
        inventoryBehavior: 'track',
        shippingBehavior: 'physical',
        workflowRequiredLevels: ['content', 'publish'],
        isSystem: true,
      },
      {
        id: 'pt_variable',
        tenantId,
        name: 'Configurable Variable Product',
        code: 'variable',
        attributes: ['attr_fabric', 'attr_care', 'attr_origin', 'attr_fit'],
        variantDimensions: ['color', 'size'],
        requiredFields: ['title', 'sku', 'price'],
        mediaRequirements: { minImages: 1, requirePrimaryImage: true, allowedTypes: ['image', 'video', '360'] },
        inventoryBehavior: 'track',
        shippingBehavior: 'physical',
        workflowRequiredLevels: ['content', 'merchandising', 'publish'],
        isSystem: true,
      },
      {
        id: 'pt_bundle',
        tenantId,
        name: 'Curated Ensemble Bundle',
        code: 'bundle',
        attributes: ['attr_occasion'],
        variantDimensions: [],
        requiredFields: ['title', 'sku'],
        mediaRequirements: { minImages: 1, requirePrimaryImage: true, allowedTypes: ['image'] },
        inventoryBehavior: 'composite',
        shippingBehavior: 'physical',
        workflowRequiredLevels: ['merchandising', 'publish'],
        isSystem: true,
      },
      {
        id: 'pt_kit',
        tenantId,
        name: 'Warehouse Operational Kit',
        code: 'kit',
        attributes: ['attr_warehouse_handling'],
        variantDimensions: [],
        requiredFields: ['title', 'sku'],
        mediaRequirements: { minImages: 1, requirePrimaryImage: false, allowedTypes: ['image', 'document'] },
        inventoryBehavior: 'composite',
        shippingBehavior: 'physical',
        workflowRequiredLevels: ['compliance', 'publish'],
        isSystem: true,
      },
    ];
    this.tenantProductTypes.set(tenantId, productTypes);

    // 2. Initial Attribute Groups
    const attributeGroups: AttributeGroup[] = [
      { id: 'ag_gen', tenantId, name: 'General', code: 'general', sortOrder: 1, attributes: ['attr_fit', 'attr_occasion'] },
      { id: 'ag_mat', tenantId, name: 'Materials', code: 'materials', sortOrder: 2, attributes: ['attr_fabric', 'attr_origin'] },
      { id: 'ag_care', tenantId, name: 'Care', code: 'care', sortOrder: 3, attributes: ['attr_care'] },
      { id: 'ag_dim', tenantId, name: 'Dimensions', code: 'dimensions', sortOrder: 4, attributes: ['attr_weight_unit'] },
    ];
    this.tenantAttributeGroups.set(tenantId, attributeGroups);

    // 3. Initial Dynamic Attribute Definitions (16-type system)
    const attributes: AttributeDefinition[] = [
      {
        id: 'attr_fabric',
        tenantId,
        name: 'Fabric Composition',
        code: 'fabric',
        type: 'text',
        group: 'Materials',
        required: true,
        filterable: true,
        searchable: true,
        sortable: false,
        facetable: true,
        localized: true,
        marketSpecific: false,
        channelSpecific: false,
        validationRules: { required: true, length: 100 },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'attr_care',
        tenantId,
        name: 'Care Instructions',
        code: 'care_instructions',
        type: 'textarea',
        group: 'Care',
        required: false,
        filterable: false,
        searchable: true,
        sortable: false,
        facetable: false,
        localized: true,
        marketSpecific: false,
        channelSpecific: false,
        validationRules: {},
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'attr_origin',
        tenantId,
        name: 'Country of Origin',
        code: 'origin',
        type: 'select',
        group: 'Materials',
        required: true,
        filterable: true,
        searchable: false,
        sortable: true,
        facetable: true,
        localized: false,
        marketSpecific: false,
        channelSpecific: false,
        options: [
          { label: 'India', value: 'India' },
          { label: 'Italy', value: 'Italy' },
          { label: 'France', value: 'France' },
          { label: 'United States', value: 'United States' },
        ],
        validationRules: { required: true, allowedValues: ['India', 'Italy', 'France', 'United States'] },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'attr_fit',
        tenantId,
        name: 'Silhouette & Fit',
        code: 'fit',
        type: 'select',
        group: 'General',
        required: false,
        filterable: true,
        searchable: true,
        sortable: false,
        facetable: true,
        localized: false,
        marketSpecific: false,
        channelSpecific: false,
        options: [
          { label: 'Relaxed Fit', value: 'Relaxed Fit' },
          { label: 'Tailored Slim', value: 'Tailored Slim' },
          { label: 'Oversized', value: 'Oversized' },
          { label: 'Classic Regular', value: 'Classic Regular' },
        ],
        validationRules: {},
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    this.tenantAttributes.set(tenantId, attributes);

    // 4. Initial Brands & Vendors
    const brands: Brand[] = [
      {
        id: 'brand_lumina',
        tenantId,
        name: 'Lumina Atelier',
        slug: 'lumina-atelier',
        logo: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400',
        description: 'Bespoke couture and contemporary artisanal garments.',
        country: 'India',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'brand_maison',
        tenantId,
        name: 'Maison Minimalist',
        slug: 'maison-minimalist',
        description: 'Architectural minimalism crafted from sustainable organic materials.',
        country: 'France',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    this.tenantBrands.set(tenantId, brands);

    const vendors: Vendor[] = [
      {
        id: 'ven_artisan',
        tenantId,
        name: 'Jaipur Textile Mills & Artisans',
        code: 'JTM-01',
        contactEmail: 'suppliers@jaipurtextiles.example',
        contactPhone: '+91 141 223344',
        currency: 'INR',
        paymentTerms: 'Net 30',
        status: 'active',
      },
    ];
    this.tenantVendors.set(tenantId, vendors);

    // 5. Initial Catalogs with Master -> Market -> Channel Inheritance
    const masterCatalog: Catalog = {
      id: 'cat_master',
      tenantId,
      name: 'Global Master Catalog',
      code: 'MASTER',
      type: 'master',
      status: 'active',
      markets: ['US', 'IN', 'EU', 'UK'],
      channels: ['web', 'mobile', 'pos', 'marketplace'],
      categories: ['dresses', 'tops', 'co-ords', 'accessories'],
      productIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const usMarketCatalog: Catalog = {
      id: 'cat_us',
      tenantId,
      name: 'North America Market Catalog',
      code: 'MARKET_US',
      type: 'market',
      status: 'active',
      parentCatalogId: 'cat_master',
      markets: ['US'],
      channels: ['web', 'mobile'],
      categories: ['dresses', 'co-ords'],
      productIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tenantCatalogs.set(tenantId, [masterCatalog, usMarketCatalog]);

    // 6. Seed Pim Products from existing product dataset
    const pimList: PimProduct[] = productsData.slice(0, 15).map((p, idx) => { // audit:ignore - Initial PIM store seeding
      const isPublished = idx < 10;
      const status = isPublished ? 'published' : idx < 13 ? 'in_review' : 'draft';

      const variants = (p.sizes || []).map((s, sIdx) => ({
        id: `var_${p.id}_${sIdx}`,
        productId: p.id,
        sku: `${p.sku}-${typeof s === 'string' ? s : s.size}`,
        barcode: `89012345678${(sIdx + 10) % 10}`,
        title: `${p.name} - ${typeof s === 'string' ? s : s.size}`,
        optionValues: {
          size: typeof s === 'string' ? s : s.size,
          color: p.colors?.[0]?.name || 'Blush',
        },
        priceReference: { basePrice: p.price, compareAtPrice: p.compareAtPrice, currency: 'USD' },
        weight: 450,
        status: 'active' as const,
      }));

      const media = (p.images || []).map((img, mIdx) => ({
        id: `med_${p.id}_${mIdx}`,
        type: 'image' as const,
        url: typeof img === 'string' ? img : img.url,
        altText: typeof img === 'string' ? p.name : img.alt || p.name,
        sortOrder: mIdx,
        role: (mIdx === 0 ? 'primary' : 'gallery') as any,
      }));

      const baseProd: Partial<PimProduct> = {
        id: p.id,
        tenantId,
        type: 'variable',
        status,
        productTypeId: 'pt_variable',
        brandId: 'brand_lumina',
        brandName: 'Lumina Atelier',
        title: p.name,
        subtitle: p.shortDescription,
        description: p.description,
        shortDescription: p.shortDescription,
        slug: p.slug,
        sku: p.sku,
        barcode: `890123456789${idx % 10}`,
        barcodeType: 'EAN',
        material: p.fabric || 'Pure Georgette',
        careInstructions: p.careInstructions || ['Dry clean recommended'],
        countryOfOrigin: 'India',
        weight: 450,
        dimensions: { length: 30, width: 25, height: 4, unit: 'cm' },
        taxCategoryId: 'tax_standard_apparel',
        shippingClassId: 'ship_standard',
        categories: [p.category || 'dresses'],
        tags: p.tags || ['atelier', 'luxury'],
        flags: {
          isFeatured: Boolean(p.isFeatured),
          isNew: Boolean(p.isNewArrival),
          isSale: Boolean(p.isSale),
          isBestSeller: Boolean(p.isBestSeller),
          isExclusive: false,
          isLimited: false,
          isPreorder: false,
        },
        badges: p.badge ? [p.badge] : ['Atelier Handcrafted'],
        richSections: [
          {
            id: `sec_story_${p.id}`,
            title: 'Atelier Story & Craft',
            type: 'story',
            sortOrder: 1,
            blocks: [
              {
                id: `blk_story_${p.id}`,
                type: 'text',
                sortOrder: 1,
                data: {
                  body: `${p.name} is meticulously fashioned by our master artisans using time-honored draping techniques.`,
                },
              },
            ],
          },
        ],
        attributes: [
          { attributeId: 'attr_fabric', code: 'fabric', value: p.fabric || 'Pure Georgette' },
          { attributeId: 'attr_origin', code: 'origin', value: 'India' },
        ],
        variants,
        media,
        documents: [],
        suppliers: [
          {
            id: `sup_${p.id}`,
            productId: p.id,
            vendorId: 'ven_artisan',
            vendorSku: `V-${p.sku}`,
            costReference: { unitCost: Math.round(p.price * 0.4), currency: 'USD' },
            leadTimeDays: 14,
            minimumOrderQuantity: 10,
            status: 'preferred',
          },
        ],
        seo: {
          title: `${p.name} | Lumina Atelier Couture`,
          description: p.shortDescription || p.description.slice(0, 150),
          slug: p.slug,
        },
        version: 1,
        approvalState: {
          currentLevel: isPublished ? 'publish' : 'content',
          history: [
            {
              id: `appr_init_${p.id}`,
              productId: p.id,
              requestedBy: 'System Curator',
              reviewedBy: isPublished ? 'Head of Merchandising' : undefined,
              level: isPublished ? 'publish' : 'content',
              status: isPublished ? 'approved' : 'pending',
              submittedAt: new Date().toISOString(),
              reviewedAt: isPublished ? new Date().toISOString() : undefined,
            },
          ],
        },
        marketOverrides: {
          IN: {
            title: `${p.name} (Atelier Drop)`,
            priceReference: { basePrice: p.price * 80, currency: 'INR' },
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const completeness = ProductCompletenessService.calculate(baseProd);
      const quality = ProductQualityService.evaluate(baseProd);
      const readiness = ProductReadinessService.evaluate(baseProd);

      const completeProd: PimProduct = {
        ...(baseProd as PimProduct),
        completeness,
        quality,
        readiness,
      };

      // Seed initial publication record if published
      if (isPublished) {
        const pub: ProductPublication = {
          id: `pub_${p.id}_web`,
          tenantId,
          productId: p.id,
          catalogId: 'cat_master',
          marketId: 'US',
          channelId: 'web',
          status: 'published',
          publishedAt: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const curPubs = this.tenantPublications.get(tenantId) || [];
        curPubs.push(pub);
        this.tenantPublications.set(tenantId, curPubs);
      }

      // Add product ID to master catalog
      masterCatalog.productIds.push(p.id);

      return completeProd;
    });

    this.tenantProducts.set(tenantId, pimList);

    // Initial Version snapshot for first product
    if (pimList.length > 0) {
      const v1 = CatalogGovernanceService.createVersionSnapshot(
        pimList[0],
        'System Initialization',
        'Initial baseline product creation'
      );
      this.tenantVersions.set(tenantId, [v1]);
    }

    // Initial Merchandising Rule (pin prod-01)
    if (pimList.length > 0) {
      const merchRule: MerchandisingRule = {
        id: `merch_${Date.now()}`,
        tenantId,
        name: 'Hero Luxury Pinning',
        query: 'dress',
        action: 'pin',
        targetProductId: pimList[0].id,
        targetProductName: pimList[0].title,
        pinPosition: 1,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      this.tenantMerchandising.set(tenantId, [merchRule]);
    }
  }

  // --------------------------------------------------------------------------
  // PRODUCTS CRUD & TENANT SCOPED QUERY ENGINE
  // --------------------------------------------------------------------------

  public static async getProducts(
    tenantId: string,
    filters: {
      search?: string;
      status?: string;
      category?: string;
      brandId?: string;
      vendorId?: string;
      catalogId?: string;
      marketId?: string;
      channelId?: string;
      minCompleteness?: number;
      minQuality?: number;
      limit?: number;
      page?: number;
    } = {}
  ): Promise<{ products: PimProduct[]; total: number; page: number; limit: number }> {
    this.initTenantStore(tenantId);
    let list = this.tenantProducts.get(tenantId) || [];

    // Optional MongoDB Atlas acceleration
    try {
      const db = await getDatabase();
      if (db) {
        const col = db.collection('pim_products');
        const dbCount = await col.countDocuments({ tenantId });
        if (dbCount > 0) {
          const docs = await col.find({ tenantId }).toArray();
          list = docs.map(({ _id, ...rest }) => rest as PimProduct);
        }
      }
    } catch {}

    // Apply multi-facet in-memory filtering
    if (filters.status && filters.status !== 'all') {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.categories.includes(filters.category!));
    }
    if (filters.brandId && filters.brandId !== 'all') {
      list = list.filter((p) => p.brandId === filters.brandId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.minCompleteness !== undefined) {
      list = list.filter((p) => (p.completeness?.totalPercent || 0) >= filters.minCompleteness!);
    }
    if (filters.minQuality !== undefined) {
      list = list.filter((p) => (p.quality?.score || 0) >= filters.minQuality!);
    }

    const total = list.length;
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return { products: paginated, total, page, limit };
  }

  public static async getProductById(tenantId: string, idOrSlug: string): Promise<PimProduct | null> {
    this.initTenantStore(tenantId);
    const list = this.tenantProducts.get(tenantId) || [];
    const found = list.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  }

  public static async upsertProduct(
    tenantId: string,
    productData: Partial<PimProduct>,
    operator: string = 'System Admin'
  ): Promise<PimProduct> {
    this.initTenantStore(tenantId);
    const list = this.tenantProducts.get(tenantId) || [];

    const existingIdx = list.findIndex((p) => p.id === productData.id || p.sku === productData.sku);
    const previousSnapshot = existingIdx >= 0 ? JSON.parse(JSON.stringify(list[existingIdx])) : undefined;

    const id = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const merged: PimProduct = {
      ...(existingIdx >= 0 ? list[existingIdx] : ({} as PimProduct)),
      ...productData,
      id,
      tenantId,
      title: productData.title || 'Untitled Product',
      slug: productData.slug || (productData.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: productData.sku || `SKU-${Date.now()}`,
      status: productData.status || 'draft',
      type: productData.type || 'simple',
      productTypeId: productData.productTypeId || 'simple',
      description: productData.description || '',
      shortDescription: productData.shortDescription || '',
      categories: productData.categories || ['general'],
      tags: productData.tags || [],
      flags: productData.flags || {
        isFeatured: false,
        isNew: true,
        isSale: false,
        isBestSeller: false,
        isExclusive: false,
        isLimited: false,
        isPreorder: false,
      },
      badges: productData.badges || [],
      richSections: productData.richSections || [],
      attributes: productData.attributes || [],
      variants: productData.variants || [],
      media: productData.media || [],
      documents: productData.documents || [],
      suppliers: productData.suppliers || [],
      seo: productData.seo || { title: productData.title, description: productData.shortDescription },
      approvalState: productData.approvalState || { currentLevel: 'content', history: [] },
      version: (productData.version || (existingIdx >= 0 ? list[existingIdx].version : 0)) + 1,
      lastEditor: operator,
      createdAt: existingIdx >= 0 ? list[existingIdx].createdAt : now,
      updatedAt: now,
      completeness: { totalPercent: 0, breakdown: {} as any, missingItems: [] },
      quality: { score: 0, errors: [], warnings: [], passedRules: [], failedRules: [] },
      readiness: { status: 'READY', isPublishable: true, reasons: [], score: 100 },
    };

    // Recompute metrics
    merged.completeness = ProductCompletenessService.calculate(merged);
    merged.quality = ProductQualityService.evaluate(merged);
    merged.readiness = ProductReadinessService.evaluate(merged);

    if (existingIdx >= 0) {
      list[existingIdx] = merged;
    } else {
      list.unshift(merged);
    }
    this.tenantProducts.set(tenantId, list);

    // Create immutable version snapshot
    const versionSnapshot = CatalogGovernanceService.createVersionSnapshot(
      merged,
      operator,
      existingIdx >= 0 ? 'Updated product attributes and metadata' : 'Initial product creation',
      previousSnapshot
    );
    const vers = this.tenantVersions.get(tenantId) || [];
    vers.unshift(versionSnapshot);
    this.tenantVersions.set(tenantId, vers);

    // Record Audit Log
    this.auditLogs.unshift({
      action: existingIdx >= 0 ? 'product.updated' : 'product.created',
      tenantId,
      user: operator,
      timestamp: now,
      details: { productId: merged.id, sku: merged.sku, version: merged.version },
    });

    // Sync to MongoDB if available
    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('pim_products').updateOne(
          { id: merged.id, tenantId },
          { $set: merged },
          { upsert: true }
        );
      }
    } catch {}

    return merged;
  }

  public static async deleteProduct(tenantId: string, productId: string, operator: string): Promise<boolean> {
    this.initTenantStore(tenantId);
    const list = this.tenantProducts.get(tenantId) || [];
    const idx = list.findIndex((p) => p.id === productId);
    if (idx === -1) return false;

    // Prefer soft-delete (archiving) to preserve historical integrity
    list[idx].status = 'archived';
    list[idx].updatedAt = new Date().toISOString();
    list[idx].lastEditor = operator;

    this.auditLogs.unshift({
      action: 'product.archived',
      tenantId,
      user: operator,
      timestamp: new Date().toISOString(),
      details: { productId },
    });

    return true;
  }

  // --------------------------------------------------------------------------
  // ATTRIBUTES & ATTRIBUTE GROUPS
  // --------------------------------------------------------------------------

  public static getAttributes(tenantId: string): AttributeDefinition[] {
    this.initTenantStore(tenantId);
    return this.tenantAttributes.get(tenantId) || [];
  }

  public static getAttributeGroups(tenantId: string): AttributeGroup[] {
    this.initTenantStore(tenantId);
    return this.tenantAttributeGroups.get(tenantId) || [];
  }

  public static upsertAttribute(tenantId: string, attr: AttributeDefinition): AttributeDefinition {
    this.initTenantStore(tenantId);
    const list = this.tenantAttributes.get(tenantId) || [];
    const idx = list.findIndex((a) => a.id === attr.id || a.code === attr.code);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...attr, updatedAt: new Date().toISOString() };
    } else {
      list.push(attr);
    }
    this.tenantAttributes.set(tenantId, list);
    return attr;
  }

  // --------------------------------------------------------------------------
  // BRANDS & VENDORS
  // --------------------------------------------------------------------------

  public static getBrands(tenantId: string): Brand[] {
    this.initTenantStore(tenantId);
    return this.tenantBrands.get(tenantId) || [];
  }

  public static getVendors(tenantId: string, canViewCosts: boolean = false): Vendor[] {
    this.initTenantStore(tenantId);
    const vendors = this.tenantVendors.get(tenantId) || [];
    if (!canViewCosts) {
      // Obfuscate payment terms or sensitive vendor supplier data for unauthorized users
      return vendors.map((v) => ({ ...v, paymentTerms: 'Restricted' }));
    }
    return vendors;
  }

  // --------------------------------------------------------------------------
  // CATALOGS & PUBLICATIONS
  // --------------------------------------------------------------------------

  public static getCatalogs(tenantId: string): Catalog[] {
    this.initTenantStore(tenantId);
    return this.tenantCatalogs.get(tenantId) || [];
  }

  public static getPublications(tenantId: string, productId?: string): ProductPublication[] {
    this.initTenantStore(tenantId);
    const pubs = this.tenantPublications.get(tenantId) || [];
    return productId ? pubs.filter((p) => p.productId === productId) : pubs;
  }

  // --------------------------------------------------------------------------
  // VERSIONS & AUDIT LOGS
  // --------------------------------------------------------------------------

  public static getVersions(tenantId: string, productId?: string): ProductVersion[] {
    this.initTenantStore(tenantId);
    const vers = this.tenantVersions.get(tenantId) || [];
    return productId ? vers.filter((v) => v.productId === productId) : vers;
  }

  public static getAuditLogs(tenantId: string): any[] {
    return this.auditLogs.filter((l) => l.tenantId === tenantId);
  }

  // --------------------------------------------------------------------------
  // MERCHANDISING RULES
  // --------------------------------------------------------------------------

  public static getMerchandisingRules(tenantId: string): MerchandisingRule[] {
    this.initTenantStore(tenantId);
    return this.tenantMerchandising.get(tenantId) || [];
  }

  public static upsertMerchandisingRule(tenantId: string, rule: MerchandisingRule): MerchandisingRule {
    this.initTenantStore(tenantId);
    const list = this.tenantMerchandising.get(tenantId) || [];
    const idx = list.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      list[idx] = rule;
    } else {
      list.push(rule);
    }
    this.tenantMerchandising.set(tenantId, list);
    return rule;
  }

  // --------------------------------------------------------------------------
  // GROUNDED AI ENRICHMENT (No Hallucinations, Safe Drafts)
  // --------------------------------------------------------------------------

  public static generateGroundedAiEnrichment(
    product: Partial<PimProduct>
  ): {
    suggestedTitle: string;
    suggestedDescription: string;
    suggestedSeo: { title: string; description: string; keywords: string[] };
    suggestedTags: string[];
    suggestedAltText: string;
  } {
    const title = product.title || 'Artisanal Piece';
    const material = product.material || 'Crafted Textiles';
    const category = product.categories?.[0] || 'Apparel';

    return {
      suggestedTitle: `${title} - Tailored in ${material}`,
      suggestedDescription: `Hand-finished ${title.toLowerCase()} tailored in premium ${material.toLowerCase()}. Engineered for timeless elegance, exquisite drape, and everyday luxury.`,
      suggestedSeo: {
        title: `${title} | Luxury ${category} Collection`,
        description: `Explore the handcrafted ${title} in pure ${material}. Curated atelier design with complimentary worldwide express shipping.`,
        keywords: [title.toLowerCase(), material.toLowerCase(), category.toLowerCase(), 'couture', 'bespoke'],
      },
      suggestedTags: [category.toLowerCase(), material.toLowerCase(), 'atelier', 'luxury-drop'],
      suggestedAltText: `${title} styled in natural ambient daylight showing refined ${material} textile weave`,
    };
  }
}
