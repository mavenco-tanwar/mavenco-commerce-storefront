/**
 * Module 37: Tenant Admin Integration Test Suite
 * Validates:
 * 1. GET /api/v1/admin/capabilities delivering dynamic permissions & module entitlements.
 * 2. GET /api/v1/products delivering tenant-scoped product catalog.
 * 3. POST /api/v1/products creating products with PIM validation & automated scoring.
 * 4. GET /api/v1/orders delivering tenant-scoped order management.
 * 5. Dynamic route guard behavior for disabled/unentitled modules.
 */

import { GET as getCapabilities } from '@/app/api/v1/admin/capabilities/route';
import { GET as getProducts, POST as createProduct } from '@/app/api/v1/products/route';
import { GET as getOrders } from '@/app/api/v1/orders/route';
import { ModuleCatalogService } from '@/server/governance/module-catalog.service';
import { PermissionService } from '@/server/governance/permission.service';
import { createMockNextRequest } from '../support/mocks/http-context.mock';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runTenantAdminApiIntegrationTests() {
  console.log('--- RUNNING INTEGRATION TEST: Tenant Admin Route Handlers ---');

  const tenantSlug = `tenant_admin_test_${Date.now()}`;
  const storeId = `store_${tenantSlug}`;

  // 1. Tenant Admin Dynamic Capabilities
  console.log('[Test 7.1] GET /api/v1/admin/capabilities');
  // Enable products and orders, leave subscriptions disabled
  await ModuleCatalogService.enableModule(tenantSlug, storeId, 'dashboard');
  await ModuleCatalogService.enableModule(tenantSlug, storeId, 'products');
  await ModuleCatalogService.enableModule(tenantSlug, storeId, 'orders');

  const capReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/v1/admin/capabilities',
    tenantId: tenantSlug,
    storeId,
    userId: 'usr_store_manager',
  });

  const capRes = await getCapabilities(capReq);
  assert(capRes.status === 200, `Expected 200, got: ${capRes.status}`);

  const capJson = await capRes.json();
  assert(capJson.success === true, 'Capabilities API must return success: true');
  assert(capJson.data.modules.products === true, 'Products module must be enabled');
  assert(capJson.data.modules.orders === true, 'Orders module must be enabled');
  assert(capJson.data.modules.subscriptions === false, 'Subscriptions module must be disabled');
  console.log('✓ Tenant admin capabilities & dynamic module entitlements verified');

  // 2. Tenant Admin Product Catalog Listing
  console.log('[Test 7.2] GET /api/v1/products');
  const prodReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/products?tenant=${tenantSlug}`,
    tenantId: tenantSlug,
  });

  const prodRes = await getProducts(prodReq);
  assert(prodRes.status === 200, `Expected 200, got: ${prodRes.status}`);

  const prodJson = await prodRes.json();
  assert(Array.isArray(prodJson.data), 'Products response must contain data array');
  assert(typeof prodJson.total === 'number', 'Products response must contain total');
  console.log('✓ Tenant admin product catalog listing verified');

  // 3. Tenant Admin Product Creation
  console.log('[Test 7.3] POST /api/v1/products');
  const newProductPayload = {
    title: 'Handcrafted Cashmere Cardigan',
    slug: `cashmere-cardigan-${Date.now()}`,
    description: '100% Grade-A Mongolian cashmere with horn buttons.',
    productType: 'physical',
    categories: ['apparel', 'knitwear'],
    pricing: { basePrice: 38000, currency: 'USD' },
    status: 'draft',
  };

  const createReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/products?tenant=${tenantSlug}`,
    method: 'POST',
    tenantId: tenantSlug,
    headers: { 'x-tenant-slug': tenantSlug },
    body: newProductPayload,
  });

  const createRes = await createProduct(createReq);
  assert(createRes.status === 200 || createRes.status === 201, `Expected 200 or 201, got: ${createRes.status}`);

  const createJson = await createRes.json();
  assert(createJson.success === true, 'Product creation must return success: true');
  assert(createJson.data.title === newProductPayload.title, 'Created product must match title');
  assert(createJson.data.completeness?.totalPercent !== undefined, 'Created product must have completeness calculated');
  console.log('✓ Tenant admin product creation & PIM scoring verified');

  // 4. Tenant Admin Order Management
  console.log('[Test 7.4] GET /api/v1/orders');
  const ordersReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/orders?tenant=${tenantSlug}`,
    tenantId: tenantSlug,
    headers: { 'x-tenant-slug': tenantSlug },
  });

  const ordersRes = await getOrders(ordersReq);
  assert(ordersRes.status === 200, `Expected 200, got: ${ordersRes.status}`);

  const ordersJson = await ordersRes.json();
  assert(ordersJson.success === true, 'Orders API must return success: true');
  assert(Array.isArray(ordersJson.data), 'Orders API must return data array');
  console.log('✓ Tenant admin order management verified');

  // 5. Route Protection for Disabled Modules
  console.log('[Test 7.5] Route Guard check for disabled module');
  const disabledAccess = await PermissionService.evaluateAccess({
    tenantId: tenantSlug,
    userId: 'usr_store_manager',
    permissionKey: 'subscriptions.manage',
    targetResourceTenantId: tenantSlug,
  });

  assert(disabledAccess.allowed === false, 'Access to disabled module must be blocked');
  assert(disabledAccess.reason?.includes('not enabled'), 'Rejection must mention module is not enabled');
  console.log('✓ Tenant admin route protection for disabled module verified');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runTenantAdminApiIntegrationTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
