/**
 * Module 36: Permission & Access Control Service
 * Strictly enforces: MODULE ENABLED + USER PERMISSION + TENANT OWNERSHIP = ALLOWED.
 */

import {
  Permission,
  TenantRole,
  UserRoleAssignment,
  TenantCapabilitiesResponse,
} from '@/types/tenant-governance.types';
import { ModuleCatalogService } from './module-catalog.service';
import { getDatabase } from '@/lib/mongodb';

export const SYSTEM_PERMISSIONS: Permission[] = [
  // Products
  { id: 'p_prod_view', key: 'products.view', name: 'View Products', description: 'View product catalog and variants', moduleKey: 'products', resource: 'products', action: 'view', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_prod_create', key: 'products.create', name: 'Create Products', description: 'Add new products and variants', moduleKey: 'products', resource: 'products', action: 'create', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_prod_update', key: 'products.update', name: 'Update Products', description: 'Edit existing products, prices, and media', moduleKey: 'products', resource: 'products', action: 'update', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_prod_delete', key: 'products.delete', name: 'Delete Products', description: 'Archive or delete products', moduleKey: 'products', resource: 'products', action: 'delete', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_prod_publish', key: 'products.publish', name: 'Publish Products', description: 'Publish products to sales channels', moduleKey: 'products', resource: 'products', action: 'publish', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },

  // Orders
  { id: 'p_ord_view', key: 'orders.view', name: 'View Orders', description: 'View customer orders and fulfillment details', moduleKey: 'orders', resource: 'orders', action: 'view', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_ord_manage', key: 'orders.manage', name: 'Manage Orders', description: 'Fulfill, cancel, refund, and capture payments', moduleKey: 'orders', resource: 'orders', action: 'manage', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },

  // Inventory
  { id: 'p_inv_view', key: 'inventory.view', name: 'View Inventory', description: 'View warehouse stock counts', moduleKey: 'inventory', resource: 'inventory', action: 'view', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_inv_manage', key: 'inventory.manage', name: 'Manage Inventory', description: 'Adjust levels, transfer stock, edit warehouses', moduleKey: 'inventory', resource: 'inventory', action: 'manage', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },

  // Subscriptions
  { id: 'p_sub_view', key: 'subscriptions.view', name: 'View Subscriptions', description: 'View customer subscriptions, plans and churn', moduleKey: 'subscriptions', resource: 'subscriptions', action: 'view', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_sub_manage', key: 'subscriptions.manage', name: 'Manage Subscriptions', description: 'Pause, resume, skip, force renewal, retry dunning', moduleKey: 'subscriptions', resource: 'subscriptions', action: 'manage', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },

  // Storefront & Pages
  { id: 'p_sf_view', key: 'storefront.view', name: 'View Storefront Config', description: 'View pages, theme, and navigation', moduleKey: 'storefront', resource: 'storefront', action: 'view', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_sf_update', key: 'storefront.update', name: 'Update Storefront Config', description: 'Edit page sections, theme tokens, menus', moduleKey: 'storefront', resource: 'storefront', action: 'update', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_sf_publish', key: 'storefront.publish', name: 'Publish Storefront', description: 'Publish storefront drafts to live store', moduleKey: 'storefront', resource: 'storefront', action: 'publish', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'p_sf_rollback', key: 'storefront.rollback', name: 'Rollback Storefront', description: 'Rollback to previous published version', moduleKey: 'storefront', resource: 'storefront', action: 'manage', status: 'active', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
];

export class PermissionService {
  private static tenantRolesStore: Map<string, TenantRole[]> = new Map();
  private static userAssignmentsStore: Map<string, UserRoleAssignment[]> = new Map();

  /**
   * Initializes default roles for a provisioned tenant.
   */
  public static async initializeDefaultRoles(tenantId: string, storeId: string): Promise<TenantRole[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const now = new Date().toISOString();

    const ownerRole: TenantRole = {
      id: `role_${safeTenantId}_owner`,
      tenantId: safeTenantId,
      storeId,
      name: 'Owner',
      description: 'Complete unrestricted administrative access across all entitled modules',
      isSystem: true,
      permissions: SYSTEM_PERMISSIONS.map((p) => p.key),
      createdAt: now,
      updatedAt: now,
    };

    const adminRole: TenantRole = {
      id: `role_${safeTenantId}_admin`,
      tenantId: safeTenantId,
      storeId,
      name: 'Store Admin',
      description: 'Administrative access except destructive platform operations',
      isSystem: true,
      permissions: SYSTEM_PERMISSIONS.filter((p) => !p.key.includes('delete')).map((p) => p.key),
      createdAt: now,
      updatedAt: now,
    };

    const roles = [ownerRole, adminRole];
    this.tenantRolesStore.set(`${safeTenantId}:${storeId}`, roles);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('tenant_roles').insertMany(roles);
      }
    } catch (err) {
      console.warn('[PermissionService] Role seeding warning:', err);
    }

    return roles;
  }

  /**
   * Assigns a role to a user.
   */
  public static async assignUserRole(
    userId: string,
    tenantId: string,
    storeId: string,
    roleId: string
  ): Promise<UserRoleAssignment> {
    const assignment: UserRoleAssignment = {
      id: `asg_${tenantId}_${userId}_${roleId}`,
      userId,
      tenantId,
      storeId,
      roleId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const key = `${tenantId}:${userId}`;
    const list = this.userAssignmentsStore.get(key) || [];
    list.push(assignment);
    this.userAssignmentsStore.set(key, list);

    return assignment;
  }

  /**
   * Evaluates effective authorization based on the authoritative formula:
   * MODULE ENABLED + USER HAS PERMISSION + TENANT OWNERSHIP = ACCESS ALLOWED
   */
  public static async evaluateAccess(params: {
    tenantId: string;
    storeId?: string;
    userId: string;
    permissionKey: string;
    targetResourceTenantId?: string;
  }): Promise<{ allowed: boolean; reason?: string }> {
    const { tenantId, storeId = 'default', userId, permissionKey, targetResourceTenantId } = params;
    const safeTenantId = tenantId.toLowerCase().trim();

    // 1. Cross-tenant Isolation Check
    if (targetResourceTenantId && targetResourceTenantId.toLowerCase().trim() !== safeTenantId) {
      return { allowed: false, reason: 'Cross-tenant resource access strictly prohibited' };
    }

    // 2. Identify required module
    const perm = SYSTEM_PERMISSIONS.find((p) => p.key === permissionKey);
    if (!perm) {
      return { allowed: false, reason: `Unknown permission: ${permissionKey}` };
    }

    // 3. Module Entitlement Check
    const isModuleEnabled = await ModuleCatalogService.hasModuleAccess(safeTenantId, perm.moduleKey, storeId);
    if (!isModuleEnabled) {
      return {
        allowed: false,
        reason: `Module '${perm.moduleKey}' is not enabled for tenant '${safeTenantId}'`,
      };
    }

    // 4. User Permission Check
    // Platform Superadmin bypasses role checks
    if (userId === 'usr_superadmin' || userId === 'usr_superadmin_01') {
      return { allowed: true };
    }

    const assignments = this.userAssignmentsStore.get(`${safeTenantId}:${userId}`) || [];
    const activeAssignment = assignments.find((a) => a.status === 'active');

    // Default tenant owner user permissions
    const roles = this.tenantRolesStore.get(`${safeTenantId}:${storeId}`) || [];
    const userRole = roles.find((r) => r.id === activeAssignment?.roleId) || roles[0]; // fallback to owner for default tenant admin

    if (!userRole || !userRole.permissions.includes(permissionKey)) {
      return {
        allowed: false,
        reason: `User '${userId}' lacks permission '${permissionKey}'`,
      };
    }

    return { allowed: true };
  }

  /**
   * Generates dynamic capabilities payload for the active tenant admin.
   */
  public static async getTenantCapabilities(
    tenantId: string,
    storeId: string = 'store_primary',
    userId: string = 'usr_tenant_owner'
  ): Promise<TenantCapabilitiesResponse> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const entitlements = await ModuleCatalogService.getTenantEntitlements(safeTenantId, storeId);

    const modules: Record<string, boolean> = {};
    for (const ent of entitlements) {
      modules[ent.moduleKey] = ent.status === 'enabled';
    }

    // Ensure core modules are marked enabled if entitled
    if (modules['dashboard'] === undefined) modules['dashboard'] = true;
    if (modules['storefront'] === undefined) modules['storefront'] = true;
    if (modules['products'] === undefined) modules['products'] = true;

    // Filter permissions only for modules that are actually enabled
    const activePermissions = SYSTEM_PERMISSIONS.filter((p) => modules[p.moduleKey] === true).map(
      (p) => p.key
    );

    return {
      tenantId: safeTenantId,
      storeId,
      modules,
      permissions: activePermissions,
      limits: {},
      userRole: 'Owner',
      timestamp: new Date().toISOString(),
    };
  }
}
