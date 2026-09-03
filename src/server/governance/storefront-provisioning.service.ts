/**
 * Module 36: Tenant & Storefront Provisioning Orchestration Service
 * Executes idempotent provisioning of dedicated tenant database, store,
 * module entitlements, permissions, tenant admin user, and storefront pages.
 */

import { TenantProvisioningRecord } from '@/types/tenant-governance.types';
import { ModuleCatalogService } from './module-catalog.service';
import { PermissionService } from './permission.service';
import { StorefrontPageService } from './storefront-page.service';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { getDatabase } from '@/lib/mongodb';

export interface TenantProvisioningInput {
  tenantName: string;
  slug: string;
  email: string;
  phone?: string;
  country: string;
  timezone: string;
  storeName: string;
  defaultCurrency: string;
  defaultLocale: string;
  selectedModules: string[];
  adminName: string;
  adminEmail: string;
  storefrontTemplate: 'blank' | 'luxury';
  planId?: string;
}

export class StorefrontProvisioningService {
  private static provisioningJobs: Map<string, TenantProvisioningRecord> = new Map();

  /**
   * Orchestrates complete idempotent tenant & storefront provisioning.
   */
  public static async provisionTenant(
    input: TenantProvisioningInput,
    operator: string = 'superadmin'
  ): Promise<{ success: boolean; record: TenantProvisioningRecord; message: string }> {
    const safeTenantId = input.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    const storeId = `store_${safeTenantId}`;
    const now = new Date().toISOString();

    const record: TenantProvisioningRecord = {
      id: `prov_${safeTenantId}_${Date.now()}`,
      tenantId: safeTenantId,
      status: 'provisioning',
      currentStep: 'STARTING',
      completedSteps: [],
      retryCount: 0,
      startedAt: now,
    };

    this.provisioningJobs.set(safeTenantId, record);

    try {
      // Step 1: Resolve Dependencies
      record.currentStep = 'RESOLVING_DEPENDENCIES';
      const depCheck = ModuleCatalogService.resolveDependencies(input.selectedModules);
      const allModulesToEnable = [...new Set([...input.selectedModules, ...depCheck.missingDependencies])];
      record.completedSteps.push('RESOLVING_DEPENDENCIES');

      // Step 2: Register Platform Tenant
      record.currentStep = 'REGISTERING_TENANT';
      const db = await getDatabase();
      const tenantRecord = {
        tenantId: safeTenantId,
        slug: safeTenantId,
        name: input.tenantName,
        status: 'active',
        databaseIdentifier: `tenant_${safeTenantId}`,
        planId: input.planId || 'plan_growth',
        planName: 'Enterprise SaaS Tier',
        storesCount: 1,
        customDomainsCount: 1,
        mrrMinor: 29900,
        health: 'healthy',
        createdAt: now,
        updatedAt: now,
      };

      if (db) {
        await db.collection('platform_tenants_registry').updateOne(
          { tenantId: safeTenantId },
          { $set: tenantRecord },
          { upsert: true }
        );
      }
      record.completedSteps.push('REGISTERING_TENANT');

      // Step 3: Connect & Initialize Tenant Database
      record.currentStep = 'PROVISIONING_TENANT_DATABASE';
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      record.completedSteps.push('PROVISIONING_TENANT_DATABASE');

      // Step 4: Seed Module Entitlements
      record.currentStep = 'ENTITLING_MODULES';
      await ModuleCatalogService.seedTenantEntitlements(
        safeTenantId,
        storeId,
        allModulesToEnable,
        operator
      );
      record.completedSteps.push('ENTITLING_MODULES');

      // Step 5: Initialize Default Roles & Assign Tenant Admin
      record.currentStep = 'PROVISIONING_ROLES_AND_ADMIN';
      const roles = await PermissionService.initializeDefaultRoles(safeTenantId, storeId);
      const ownerRole = roles.find((r) => r.name === 'Owner') || roles[0];
      await PermissionService.assignUserRole(
        `usr_${safeTenantId}_owner`,
        safeTenantId,
        storeId,
        ownerRole.id
      );
      record.completedSteps.push('PROVISIONING_ROLES_AND_ADMIN');

      // Step 6: Initialize Storefront & Seed Pages
      record.currentStep = 'PROVISIONING_STOREFRONT';
      const storefront = await StorefrontPageService.getStorefront(safeTenantId, storeId);
      await StorefrontPageService.seedStorefrontPages(
        safeTenantId,
        storefront.id,
        storeId,
        input.storefrontTemplate
      );
      record.completedSteps.push('PROVISIONING_STOREFRONT');

      // Mark Complete
      record.status = 'completed';
      record.currentStep = 'COMPLETED';
      record.completedAt = new Date().toISOString();

      return {
        success: true,
        record,
        message: `Tenant '${input.tenantName}' (${safeTenantId}) successfully provisioned with ${allModulesToEnable.length} modules!`,
      };
    } catch (err: any) {
      record.status = 'failed';
      record.failedStep = record.currentStep;
      record.error = err.message;
      return {
        success: false,
        record,
        message: `Provisioning failed at step ${record.currentStep}: ${err.message}`,
      };
    }
  }

  /**
   * Retrieves provisioning status for a tenant.
   */
  public static getProvisioningStatus(tenantId: string): TenantProvisioningRecord | null {
    return this.provisioningJobs.get(tenantId.toLowerCase().trim()) || null;
  }
}
