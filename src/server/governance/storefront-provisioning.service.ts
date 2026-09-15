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
      const ownerEmail = (input.adminEmail || input.email || '').toLowerCase().trim();
      const ownerName = input.adminName || 'Store Owner';
      const tempPass = `Mavenco@2026!${safeTenantId}`;

      const tenantRecord = {
        tenantId: safeTenantId,
        id: `store_${safeTenantId}`,
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
        ownerName,
        ownerEmail,
        contact: {
          email: ownerEmail,
          phone: input.phone || '',
        },
        password: tempPass,
        temporaryPassword: tempPass,
        isTemporaryPassword: true,
        updatedAt: now,
      };

      if (db) {
        await Promise.all([
          db.collection('platform_tenants_registry').updateOne(
            { tenantId: safeTenantId },
            { $set: tenantRecord, $setOnInsert: { createdAt: now } },
            { upsert: true }
          ),
          db.collection('tenants').updateOne(
            { slug: safeTenantId },
            { $set: tenantRecord, $setOnInsert: { createdAt: now } },
            { upsert: true }
          ),
        ]);

        if (ownerEmail) {
          await db.collection('users').updateOne(
            { email: ownerEmail },
            {
              $set: {
                email: ownerEmail,
                name: ownerName,
                tenantSlug: safeTenantId,
                tenantId: `store_${safeTenantId}`,
                storeSlug: safeTenantId,
                role: 'owner',
                roleId: 'role_owner',
                roleName: 'Store Owner & Administrator',
                status: 'active',
                password: tempPass,
                temporaryPassword: tempPass,
                isTemporaryPassword: true,
                updatedAt: now,
              },
              $setOnInsert: {
                id: `user_${ownerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
                createdAt: now,
              },
            },
            { upsert: true }
          );
        }
      }
      record.completedSteps.push('REGISTERING_TENANT');

      // Step 3: Connect & Initialize Tenant Database with all required collections
      record.currentStep = 'PROVISIONING_TENANT_DATABASE';
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        // Create all tenant-scoped collections with basic indexes
        const tenantCollections = [
          'products', 'pim_products', 'pim_collections',
          'orders', 'customers', 'collections', 'categories',
          'carts', 'abandoned_carts', 'reviews', 'product_reviews', 'product_questions',
          'media', 'promotions', 'discounts',
          'cms_pages', 'cms_menus', 'cms_versions',
          'builder_page_versions',
          'themes', 'theme_versions',
          'product_page_templates', 'product_page_versions',
          'product_card_configs', 'product_card_versions',
          'collection_page_configs', 'collection_page_versions',
          'contact_inquiries',
          'stores', 'store_settings', 'navigation',
          'sales_channels', 'stock_transfers', 'warehouses',
          'invoices', 'invoice_series', 'invoice_templates', 'credit_notes',
          'gift_cards', 'vouchers', 'wallet_transactions', 'store_credit',
          'loyalty_programs', 'loyalty_points', 'loyalty_rewards',
          'referrals', 'notifications', 'notification_templates', 'notification_logs',
          'payment_methods', 'payment_providers', 'payment_intents', 'payment_webhooks',
          'shipping_methods', 'shipping_zones', 'shipping_carriers', 'shipments',
          'tax_zones', 'tax_rules', 'tax_categories', 'tax_registrations',
          'inventory', 'inventory_movements', 'inventory_adjustments', 'fulfillments',
          'marketing_campaigns', 'marketing_segments', 'marketing_automations',
          'finance_ledger', 'finance_accounts', 'finance_periods', 'finance_payouts', 'finance_settlements',
          'search_synonyms', 'search_merchandising',
          'billing_subscriptions', 'billing_invoices',
          'customer_returns', 'admin_returns',
          'settings',
        ];
        const existingColls = await tenantDb.listCollections().toArray();
        const existingNames = new Set(existingColls.map((c: any) => c.name));
        for (const collName of tenantCollections) {
          if (!existingNames.has(collName)) {
            try {
              await tenantDb.createCollection(collName);
            } catch {}
          }
        }
        // Create indexes on key collections
        try {
          await Promise.all([
            tenantDb.collection('products').createIndex({ id: 1 }, { sparse: true }),
            tenantDb.collection('products').createIndex({ slug: 1 }, { sparse: true }),
            tenantDb.collection('products').createIndex({ status: 1 }),
            tenantDb.collection('pim_products').createIndex({ id: 1 }, { sparse: true }),
            tenantDb.collection('orders').createIndex({ id: 1 }, { sparse: true }),
            tenantDb.collection('orders').createIndex({ orderNumber: 1 }, { sparse: true }),
            tenantDb.collection('customers').createIndex({ email: 1 }, { sparse: true }),
            tenantDb.collection('collections').createIndex({ id: 1 }, { sparse: true }),
            tenantDb.collection('collections').createIndex({ slug: 1 }, { sparse: true }),
            tenantDb.collection('categories').createIndex({ id: 1 }, { sparse: true }),
            tenantDb.collection('categories').createIndex({ slug: 1 }, { sparse: true }),
            tenantDb.collection('carts').createIndex({ sessionId: 1, status: 1 }),
            tenantDb.collection('reviews').createIndex({ productId: 1 }),
            tenantDb.collection('media').createIndex({ id: 1 }, { sparse: true }),
            tenantDb.collection('cms_pages').createIndex({ slug: 1 }, { sparse: true }),
          ]);
        } catch (indexErr) {
          console.warn('[Provisioning] Index creation warning:', indexErr);
        }
      }
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
      await StorefrontPageService.publishStorefront(
        safeTenantId,
        storefront.id,
        operator,
        'Initial provisioned storefront snapshot'
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
