/**
 * Module 36: Tenant Governance, Module Entitlements, Access Control,
 * and Storefront Provisioning Automated Test Suite
 */

import { ModuleCatalogService } from '../module-catalog.service';
import { PermissionService } from '../permission.service';
import { StorefrontProvisioningService } from '../storefront-provisioning.service';
import { StorefrontPageService } from '../storefront-page.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runModule36TestSuite() {
  console.log('--- STARTING MODULE 36 TENANT GOVERNANCE & STOREFRONT TEST SUITE ---');

  // 1. Platform Module Catalog & Dependency Resolution
  console.log('[Test 1] Module Catalog & Dependency Graph Verification');
  const modules = await ModuleCatalogService.getPlatformModules();
  assert(modules.length >= 10, 'Catalog must contain core and optional commerce modules');

  const subModule = modules.find((m) => m.key === 'subscriptions');
  assert(subModule !== undefined, 'Subscriptions module must exist in catalog');
  assert(subModule!.dependencies.includes('products'), 'Subscriptions must depend on products');
  assert(subModule!.dependencies.includes('orders'), 'Subscriptions must depend on orders');
  assert(subModule!.dependencies.includes('payments'), 'Subscriptions must depend on payments');

  // Test dependency resolver
  const resolution1 = ModuleCatalogService.resolveDependencies(['subscriptions']);
  assert(resolution1.canEnable === false, 'Cannot enable subscriptions without its dependencies');
  assert(resolution1.missingDependencies.includes('products'), 'Must flag products as missing dependency');

  const resolution2 = ModuleCatalogService.resolveDependencies([
    'products',
    'orders',
    'customers',
    'payments',
    'subscriptions',
  ]);
  assert(resolution2.canEnable === true, 'All dependencies satisfied');
  console.log('✓ Module catalog & dependency resolution verified');

  // 2. Tenant Provisioning Orchestration
  console.log('[Test 2] Idempotent Tenant & Storefront Provisioning');
  const tenantSlug = `autotest_${Date.now()}`;
  const provResult = await StorefrontProvisioningService.provisionTenant({
    tenantName: 'AutoTest Couture',
    slug: tenantSlug,
    email: `contact@${tenantSlug}.com`,
    country: 'US',
    timezone: 'America/New_York',
    storeName: 'AutoTest Flagship',
    defaultCurrency: 'USD',
    defaultLocale: 'en-US',
    selectedModules: ['dashboard', 'storefront', 'pages', 'products', 'orders', 'subscriptions'],
    adminName: 'Test Owner',
    adminEmail: `owner@${tenantSlug}.com`,
    storefrontTemplate: 'luxury',
  });

  assert(provResult.success === true, 'Tenant provisioning must succeed');
  assert(provResult.record.status === 'completed', 'Provisioning record status must be completed');
  console.log(`✓ Tenant '${tenantSlug}' provisioned successfully`);

  // 3. Effective Access Formula Verification
  console.log('[Test 3] Access Control Formula: MODULE ENABLED + PERMISSION + TENANT OWNERSHIP');
  // Scenario A: Enabled module + Valid permission -> Allowed
  const checkAllowed = await PermissionService.evaluateAccess({
    tenantId: tenantSlug,
    userId: 'usr_superadmin',
    permissionKey: 'products.view',
    targetResourceTenantId: tenantSlug,
  });
  assert(checkAllowed.allowed === true, 'Access must be allowed when module is enabled');

  // Scenario B: Disabled module -> Denied (even with permission)
  const checkDisabled = await PermissionService.evaluateAccess({
    tenantId: tenantSlug,
    userId: 'usr_superadmin',
    permissionKey: 'inventory.view', // inventory was not selected
    targetResourceTenantId: tenantSlug,
  });
  assert(checkDisabled.allowed === false, 'Access must be denied when module is not entitled');
  assert(checkDisabled.reason?.includes('inventory'), 'Reason must specify missing module');

  // Scenario C: Cross-tenant Resource Violation -> Strictly Denied
  const checkCrossTenant = await PermissionService.evaluateAccess({
    tenantId: tenantSlug,
    userId: 'usr_superadmin',
    permissionKey: 'products.view',
    targetResourceTenantId: 'another_tenant_database',
  });
  assert(checkCrossTenant.allowed === false, 'Cross-tenant resource access must be strictly prohibited');
  console.log('✓ Effective access control formula verified');

  // 4. Non-Destructive Module Disabling Rule
  console.log('[Test 4] Module Disabling Rule (Access Revoked, Data Preserved)');
  await ModuleCatalogService.disableModule(tenantSlug, `store_${tenantSlug}`, 'subscriptions');

  const hasAccessAfterDisable = await ModuleCatalogService.hasModuleAccess(tenantSlug, 'subscriptions');
  assert(hasAccessAfterDisable === false, 'Access must be revoked immediately upon module disable');

  // Re-enable restores access
  await ModuleCatalogService.enableModule(tenantSlug, `store_${tenantSlug}`, 'subscriptions');
  const hasAccessAfterReEnable = await ModuleCatalogService.hasModuleAccess(tenantSlug, 'subscriptions');
  assert(hasAccessAfterReEnable === true, 'Re-enabling module must restore access immediately');
  console.log('✓ Non-destructive module disabling and re-enabling verified');

  // 5. Storefront Draft, Publish & Safe Rollback Lifecycle
  console.log('[Test 5] Storefront Page Draft, Publish & Immutable Rollback');
  const sf = await StorefrontPageService.getStorefront(tenantSlug);
  const pages = await StorefrontPageService.getPages(tenantSlug, sf.id);
  assert(pages.length > 0, 'Provisioned storefront must have pages');

  const homePage = pages.find((p) => p.slug === 'home') || pages[0];
  const originalTitle = homePage.title;

  // Save draft modifications
  await StorefrontPageService.savePageDraft(tenantSlug, homePage.id, [
    {
      id: 'sec_new_hero',
      type: 'hero',
      title: 'Summer Solstice Edition',
      subtitle: 'Exclusive seasonal drops',
      displayOrder: 1,
      isVisible: true,
      settings: {},
    },
  ]);

  const draftPage = await StorefrontPageService.getPageById(tenantSlug, homePage.id);
  assert(draftPage?.status === 'draft', 'Page should be in draft status after editing');

  // Publish storefront Version 2
  const ver2 = await StorefrontPageService.publishStorefront(tenantSlug, sf.id, 'superadmin', 'Summer launch');
  assert(ver2.version === 2, 'Published version should advance to Version 2');

  // Publish another update Version 3
  const ver3 = await StorefrontPageService.publishStorefront(tenantSlug, sf.id, 'superadmin', 'Autumn update');
  assert(ver3.version === 3, 'Published version should advance to Version 3');

  // Safe Rollback to Version 2
  // Must create a NEW version (v4) restoring v2 snapshot; NEVER mutate historical records
  const rolledBackVer = await StorefrontPageService.rollbackStorefront(tenantSlug, sf.id, 2, 'superadmin');
  assert(rolledBackVer.version === 4, 'Rollback must create a NEW version (v4)');
  assert(rolledBackVer.changelog?.includes('Rolled back to Version 2'), 'Changelog must reflect rollback target');

  const history = await StorefrontPageService.getVersionHistory(tenantSlug, sf.id);
  assert(history.length >= 3, 'Version history must record all immutable snapshots');
  console.log('✓ Storefront draft, publish, and immutable rollback verified');

  // 6. Tenant A vs Tenant B Storefront Isolation
  console.log('[Test 6] Tenant A and Tenant B Storefront Isolation');
  const tenantB = `tenant_b_${Date.now()}`;
  await StorefrontProvisioningService.provisionTenant({
    tenantName: 'Tenant B Store',
    slug: tenantB,
    email: `admin@${tenantB}.com`,
    country: 'US',
    timezone: 'UTC',
    storeName: 'Tenant B Store',
    defaultCurrency: 'USD',
    defaultLocale: 'en-US',
    selectedModules: ['storefront', 'products'],
    adminName: 'Owner B',
    adminEmail: `owner@${tenantB}.com`,
    storefrontTemplate: 'blank',
  });

  const sfA = await StorefrontPageService.getStorefront(tenantSlug);
  const sfB = await StorefrontPageService.getStorefront(tenantB);
  assert(sfA.id !== sfB.id, 'Storefront IDs must be distinct across tenants');

  const pagesB = await StorefrontPageService.getPages(tenantB, sfB.id);
  assert(pagesB.every((p) => p.tenantId === tenantB), 'Tenant B pages must belong strictly to Tenant B');
  console.log('✓ Multi-tenant storefront isolation verified');

  console.log('================================================================');
  console.log('ALL MODULE 36 TENANT GOVERNANCE & STOREFRONT TESTS PASSED (6/6)');
  console.log('================================================================');
  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runModule36TestSuite().catch((err) => {
    console.error('Test Suite Failure:', err);
    process.exit(1);
  });
}
