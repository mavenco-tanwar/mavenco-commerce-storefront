/**
 * Module 36: Platform Module Catalog & Dependency Resolution Service
 * Manages SaaS module catalog, dependency requirements, and tenant module entitlements.
 */

import {
  PlatformModule,
  TenantModuleEntitlement,
  TenantModuleEntitlementStatus,
} from '@/types/tenant-governance.types';
import { getDatabase } from '@/lib/mongodb';

export const PLATFORM_MODULE_CATALOG: PlatformModule[] = [
  // Core & Storefront
  {
    id: 'mod_dashboard',
    key: 'dashboard',
    name: 'Dashboard & Analytics Overview',
    description: 'Real-time KPIs, sales performance, conversion metrics, and operational alerts.',
    category: 'core',
    icon: 'LayoutDashboard',
    status: 'active',
    version: '1.0.0',
    isCore: true,
    isOptional: false,
    isEnterprise: false,
    sortOrder: 1,
    dependencies: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_storefront',
    key: 'storefront',
    name: 'Storefront & Experience Builder',
    description: 'Visual layout engine, theme customization, header/footer configuration, and menus.',
    category: 'storefront',
    icon: 'Store',
    status: 'active',
    version: '2.0.0',
    isCore: true,
    isOptional: false,
    isEnterprise: false,
    sortOrder: 2,
    dependencies: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_pages',
    key: 'pages',
    name: 'Pages & Visual Builder',
    description: 'Drag-and-drop page designer for landing pages, lookbooks, and articles.',
    category: 'storefront',
    icon: 'Layers',
    status: 'active',
    version: '2.0.0',
    isCore: false,
    isOptional: true,
    isEnterprise: false,
    sortOrder: 3,
    dependencies: ['storefront'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // Catalog & Merchandising
  {
    id: 'mod_products',
    key: 'products',
    name: 'Products & Variant Management',
    description: 'SKU management, multidimensional variants, pricing, inventory sync, and media.',
    category: 'catalog',
    icon: 'Package',
    status: 'active',
    version: '1.5.0',
    isCore: true,
    isOptional: false,
    isEnterprise: false,
    sortOrder: 4,
    dependencies: [],
    defaultLimits: { maxProducts: 5000 },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_categories',
    key: 'categories',
    name: 'Categories & Taxonomy',
    description: 'Nested category hierarchies, faceted navigation, and dynamic filtering.',
    category: 'catalog',
    icon: 'FolderTree',
    status: 'active',
    version: '1.2.0',
    isCore: false,
    isOptional: true,
    isEnterprise: false,
    sortOrder: 5,
    dependencies: ['products'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_collections',
    key: 'collections',
    name: 'Lookbook & Smart Collections',
    description: 'Rule-based and manual collections with automated merchandising and sort criteria.',
    category: 'catalog',
    icon: 'Boxes',
    status: 'active',
    version: '1.4.0',
    isCore: false,
    isOptional: true,
    isEnterprise: false,
    sortOrder: 6,
    dependencies: ['products'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_pim',
    key: 'pim',
    name: 'Enterprise PIM & Governance',
    description: 'Attribute dictionaries, validation rules, quality scoring, completeness audits, and import/export.',
    category: 'catalog',
    icon: 'ShieldCheck',
    status: 'active',
    version: '3.0.0',
    isCore: false,
    isOptional: true,
    isEnterprise: true,
    sortOrder: 7,
    dependencies: ['products', 'categories'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // Orders & Sales
  {
    id: 'mod_orders',
    key: 'orders',
    name: 'Orders & Fulfillment Lifecycle',
    description: 'Order capture, payment orchestration, fulfillment status tracking, cancellations, and returns.',
    category: 'sales',
    icon: 'ShoppingBag',
    status: 'active',
    version: '2.1.0',
    isCore: true,
    isOptional: false,
    isEnterprise: false,
    sortOrder: 8,
    dependencies: ['products'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_subscriptions',
    key: 'subscriptions',
    name: 'Subscriptions & Recurring Commerce',
    description: 'Subscribe & save, interval billing, automated dunning, exact proration, and customer portal.',
    category: 'sales',
    icon: 'RefreshCw',
    status: 'active',
    version: '1.0.0',
    isCore: false,
    isOptional: true,
    isEnterprise: true,
    sortOrder: 9,
    dependencies: ['products', 'orders', 'customers', 'payments'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_memberships',
    key: 'memberships',
    name: 'VIP Memberships & Privileges',
    description: 'Tiered membership programs, exclusive member discounts, free shipping, and perks.',
    category: 'sales',
    icon: 'Award',
    status: 'active',
    version: '1.0.0',
    isCore: false,
    isOptional: true,
    isEnterprise: true,
    sortOrder: 10,
    dependencies: ['subscriptions', 'customers'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // Operations
  {
    id: 'mod_inventory',
    key: 'inventory',
    name: 'Multi-Warehouse Inventory & Tracking',
    description: 'Warehouse locations, stock allocations, safety buffer levels, transfers, and barcode scanning.',
    category: 'operations',
    icon: 'Truck',
    status: 'active',
    version: '2.0.0',
    isCore: false,
    isOptional: true,
    isEnterprise: true,
    sortOrder: 11,
    dependencies: ['products'],
    defaultLimits: { maxWarehouses: 10 },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // Customers & CRM
  {
    id: 'mod_customers',
    key: 'customers',
    name: 'Customers & CRM Profiles',
    description: 'Customer directory, purchase history, order value, addresses, and customer segmentation.',
    category: 'customers',
    icon: 'Users',
    status: 'active',
    version: '1.5.0',
    isCore: true,
    isOptional: false,
    isEnterprise: false,
    sortOrder: 12,
    dependencies: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_loyalty',
    key: 'loyalty',
    name: 'Loyalty Points & Rewards Wallet',
    description: 'Earn points per purchase, tier-based multipliers, store credit wallet, and point redemptions.',
    category: 'customers',
    icon: 'Sparkles',
    status: 'active',
    version: '1.2.0',
    isCore: false,
    isOptional: true,
    isEnterprise: false,
    sortOrder: 13,
    dependencies: ['customers', 'orders'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_reviews',
    key: 'reviews',
    name: 'Reviews, Ratings & UGC',
    description: 'Verified buyer reviews, star ratings, review moderation, photo uploads, and community Q&A.',
    category: 'customers',
    icon: 'Star',
    status: 'active',
    version: '1.1.0',
    isCore: false,
    isOptional: true,
    isEnterprise: false,
    sortOrder: 14,
    dependencies: ['products'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // Finance & Payments
  {
    id: 'mod_payments',
    key: 'payments',
    name: 'Payment Orchestration & Gateways',
    description: 'Stripe, Razorpay, PayPal, Apple Pay, split payouts, recurring tokenization, and webhooks.',
    category: 'finance',
    icon: 'CreditCard',
    status: 'active',
    version: '2.0.0',
    isCore: true,
    isOptional: false,
    isEnterprise: false,
    sortOrder: 15,
    dependencies: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_invoices',
    key: 'invoices',
    name: 'Tax Invoicing & Legal Documents',
    description: 'Automated tax invoice generation, credit notes, series sequencing, and compliance PDFs.',
    category: 'finance',
    icon: 'FileText',
    status: 'active',
    version: '1.5.0',
    isCore: false,
    isOptional: true,
    isEnterprise: false,
    sortOrder: 16,
    dependencies: ['orders', 'payments'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export class ModuleCatalogService {
  // In-memory fallback registry for rapid testing and when offline
  private static tenantEntitlementsStore: Map<string, TenantModuleEntitlement[]> = new Map();

  /**
   * Retrieves all modules available in the platform catalog.
   */
  public static async getPlatformModules(): Promise<PlatformModule[]> {
    try {
      const db = await getDatabase();
      if (db) {
        const collection = db.collection('platform_modules');
        const count = await collection.countDocuments({});
        if (count === 0) {
          await collection.insertMany(PLATFORM_MODULE_CATALOG);
        }
        const docs = await collection.find({ status: 'active' }).sort({ sortOrder: 1 }).toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...rest }) => rest as any);
        }
      }
    } catch (err) {
      console.warn('[ModuleCatalogService] MongoDB fetch error, using catalog definition:', err);
    }
    return PLATFORM_MODULE_CATALOG;
  }

  /**
   * Resolves missing required dependencies for a selected list of module keys.
   */
  public static resolveDependencies(selectedModuleKeys: string[]): {
    missingDependencies: string[];
    dependencyMap: Record<string, string[]>;
    canEnable: boolean;
  } {
    const selectedSet = new Set(selectedModuleKeys);
    const missingDependencies: string[] = [];
    const dependencyMap: Record<string, string[]> = {};

    for (const key of selectedModuleKeys) {
      const moduleDef = PLATFORM_MODULE_CATALOG.find((m) => m.key === key);
      if (moduleDef && moduleDef.dependencies.length > 0) {
        dependencyMap[key] = moduleDef.dependencies;
        for (const dep of moduleDef.dependencies) {
          if (!selectedSet.has(dep) && !missingDependencies.includes(dep)) {
            missingDependencies.push(dep);
          }
        }
      }
    }

    return {
      missingDependencies,
      dependencyMap,
      canEnable: missingDependencies.length === 0,
    };
  }

  /**
   * Retrieves active module entitlements for a given tenant.
   */
  public static async getTenantEntitlements(
    tenantId: string,
    storeId?: string
  ): Promise<TenantModuleEntitlement[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const specificKey = storeId && storeId !== 'default' ? `${safeTenantId}:${storeId}` : null;

    if (specificKey && this.tenantEntitlementsStore.has(specificKey)) {
      return this.tenantEntitlementsStore.get(specificKey)!;
    }

    // Check memory store for any store under this tenant
    for (const [k, list] of this.tenantEntitlementsStore.entries()) {
      if (k.startsWith(`${safeTenantId}:`)) {
        return list;
      }
    }

    try {
      const db = await getDatabase();
      if (db) {
        const query: any = { tenantId: safeTenantId };
        if (storeId && storeId !== 'default') query.storeId = storeId;
        const docs = await db.collection('tenant_module_entitlements').find(query).toArray();
        if (docs.length > 0) {
          const list = docs.map(({ _id, ...rest }) => rest as any);
          this.tenantEntitlementsStore.set(`${safeTenantId}:${storeId || 'default'}`, list);
          return list;
        }
      }
    } catch (err) {
      console.warn('[ModuleCatalogService] Entitlements query warning:', err);
    }

    return [];
  }

  /**
   * Checks if a tenant has access to a specific module.
   */
  public static async hasModuleAccess(
    tenantId: string,
    moduleKey: string,
    storeId?: string
  ): Promise<boolean> {
    const entitlements = await this.getTenantEntitlements(tenantId, storeId);
    const entitlement = entitlements.find((e) => e.moduleKey === moduleKey);
    return entitlement ? entitlement.status === 'enabled' : false;
  }

  /**
   * Enables a module for a tenant, recording audit timestamps.
   */
  public static async enableModule(
    tenantId: string,
    storeId: string,
    moduleKey: string,
    source: TenantModuleEntitlement['source'] = 'manual',
    enabledBy: string = 'superadmin'
  ): Promise<TenantModuleEntitlement> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const cacheKey = `${safeTenantId}:${storeId}`;
    const now = new Date().toISOString();

    const existingList = this.tenantEntitlementsStore.get(cacheKey) || [];
    let record = existingList.find((e) => e.moduleKey === moduleKey);

    if (record) {
      record.status = 'enabled';
      record.enabledAt = now;
      record.enabledBy = enabledBy;
      record.disabledAt = undefined;
      record.updatedAt = now;
    } else {
      record = {
        id: `ent_${safeTenantId}_${moduleKey}`,
        tenantId: safeTenantId,
        storeId,
        moduleKey,
        status: 'enabled',
        source,
        enabledAt: now,
        enabledBy,
        createdAt: now,
        updatedAt: now,
      };
      existingList.push(record);
    }

    this.tenantEntitlementsStore.set(cacheKey, existingList);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('tenant_module_entitlements').updateOne(
          { tenantId: safeTenantId, storeId, moduleKey },
          { $set: record },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('[ModuleCatalogService] Entitlement DB update warning:', err);
    }

    return record;
  }

  /**
   * Disables a module for a tenant:
   * Rule: Disabling revokes access immediately BUT NEVER DELETES HISTORICAL DATA.
   */
  public static async disableModule(
    tenantId: string,
    storeId: string,
    moduleKey: string,
    disabledBy: string = 'superadmin'
  ): Promise<TenantModuleEntitlement | null> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const cacheKey = `${safeTenantId}:${storeId}`;
    const now = new Date().toISOString();

    const existingList = this.tenantEntitlementsStore.get(cacheKey) || [];
    const record = existingList.find((e) => e.moduleKey === moduleKey);

    if (!record) return null;

    record.status = 'disabled';
    record.disabledAt = now;
    record.disabledBy = disabledBy;
    record.updatedAt = now;

    this.tenantEntitlementsStore.set(cacheKey, existingList);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('tenant_module_entitlements').updateOne(
          { tenantId: safeTenantId, storeId, moduleKey },
          { $set: record }
        );
      }
    } catch (err) {
      console.warn('[ModuleCatalogService] Entitlement DB update warning:', err);
    }

    return record;
  }

  /**
   * Seeds initial entitlements for a newly provisioned tenant.
   */
  public static async seedTenantEntitlements(
    tenantId: string,
    storeId: string,
    selectedModuleKeys: string[],
    enabledBy: string = 'superadmin'
  ): Promise<TenantModuleEntitlement[]> {
    const entitlements: TenantModuleEntitlement[] = [];
    for (const key of selectedModuleKeys) {
      const ent = await this.enableModule(tenantId, storeId, key, 'system', enabledBy);
      entitlements.push(ent);
    }
    return entitlements;
  }
}
