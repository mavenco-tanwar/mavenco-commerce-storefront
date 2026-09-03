/**
 * Module 36: Tenant Governance, Module Entitlements, Access Control,
 * and Storefront Provisioning Domain Types
 */

export type PlatformModuleCategory =
  | 'core'
  | 'catalog'
  | 'sales'
  | 'customers'
  | 'marketing'
  | 'operations'
  | 'finance'
  | 'storefront'
  | 'advanced';

export interface PlatformModule {
  id: string;
  key: string;
  name: string;
  description: string;
  category: PlatformModuleCategory;
  icon: string;
  status: 'active' | 'beta' | 'deprecated';
  version: string;
  isCore: boolean;
  isOptional: boolean;
  isEnterprise: boolean;
  sortOrder: number;
  dependencies: string[]; // module keys required
  defaultLimits?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type TenantModuleEntitlementStatus = 'enabled' | 'disabled' | 'suspended' | 'expired';

export interface TenantModuleEntitlement {
  id: string;
  tenantId: string;
  storeId: string;
  moduleKey: string;
  status: TenantModuleEntitlementStatus;
  source: 'plan' | 'manual' | 'trial' | 'addon' | 'enterprise_override' | 'system';
  planId?: string;
  enabledAt: string;
  enabledBy: string;
  disabledAt?: string;
  disabledBy?: string;
  expiresAt?: string;
  configuration?: Record<string, any>;
  limits?: {
    maxProducts?: number;
    maxWarehouses?: number;
    maxUsers?: number;
    maxOrdersMonthly?: number;
    featuresAllowed?: string[];
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  key: string; // e.g. 'products.view', 'orders.create', 'storefront.publish'
  name: string;
  description: string;
  moduleKey: string;
  resource: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'publish' | 'export' | 'manage';
  status: 'active' | 'deprecated';
  createdAt: string;
  updatedAt: string;
}

export interface TenantRole {
  id: string;
  tenantId: string;
  storeId: string;
  name: string;
  description?: string;
  isSystem: boolean; // Owner, Admin, Editor
  permissions: string[]; // permission keys
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  tenantId: string;
  storeId: string;
  roleId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface TenantCapabilitiesResponse {
  tenantId: string;
  storeId: string;
  modules: Record<string, boolean>; // moduleKey -> enabled
  permissions: string[]; // list of active permission keys
  limits: Record<string, any>;
  userRole: string;
  timestamp: string;
}

export interface StorefrontSection {
  id: string;
  type: string; // 'hero' | 'featured-products' | 'categories-grid' | 'banner' | 'reviews' | 'newsletter' | 'rich-text'
  title: string;
  subtitle?: string;
  displayOrder: number;
  isVisible: boolean;
  settings: Record<string, any>;
}

export interface StorefrontPage {
  id: string;
  storefrontId: string;
  tenantId: string;
  storeId: string;
  slug: string;
  title: string;
  type: 'standard' | 'homepage' | 'landing' | 'policy' | 'custom';
  status: 'draft' | 'published' | 'archived';
  sections: StorefrontSection[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
}

export interface Storefront {
  id: string;
  tenantId: string;
  storeId: string;
  environmentId: string;
  name: string;
  slug: string;
  status: 'active' | 'maintenance' | 'draft';
  defaultLocale: string;
  defaultCurrency: string;
  defaultMarketId: string;
  themeId: string;
  publishedVersion: number;
  draftVersion: number;
  lastPublishedAt?: string;
  lastPublishedBy?: string;
  settings: {
    titleTemplate?: string;
    favicon?: string;
    enableBreadcrumbs?: boolean;
    announcementBarEnabled?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StorefrontVersion {
  id: string;
  storefrontId: string;
  tenantId: string;
  version: number;
  snapshot: {
    storefront: Partial<Storefront>;
    pages: StorefrontPage[];
    themeTokens?: Record<string, any>;
    navigation?: Record<string, any>;
  };
  status: 'published' | 'archived' | 'superseded';
  publishedBy: string;
  publishedAt: string;
  changelog?: string;
}

export interface TenantProvisioningRecord {
  id: string;
  tenantId: string;
  status: 'pending' | 'provisioning' | 'completed' | 'failed' | 'cancelled';
  currentStep: string;
  completedSteps: string[];
  failedStep?: string;
  error?: string;
  retryCount: number;
  startedAt: string;
  completedAt?: string;
}
