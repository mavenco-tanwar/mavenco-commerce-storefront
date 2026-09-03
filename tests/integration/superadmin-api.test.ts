/**
 * Module 37: Superadmin Route Handlers Integration Test Suite
 * Validates:
 * 1. GET /api/v1/superadmin/modules catalog and dependency resolution.
 * 2. POST /api/v1/superadmin/tenants provisioning workflow.
 * 3. GET /api/v1/superadmin/tenants/[id]/storefront management overview.
 * 4. POST /api/v1/superadmin/tenants/[id]/storefront publish and rollback actions.
 */

import { GET as getModules, POST as postDependencyCheck } from '@/app/api/v1/superadmin/modules/route';
import { POST as postProvisionTenant } from '@/app/api/v1/superadmin/tenants/route';
import { GET as getStorefront, POST as postStorefrontAction } from '@/app/api/v1/superadmin/tenants/[id]/storefront/route';
import { createMockNextRequest } from '../support/mocks/http-context.mock';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runSuperadminApiIntegrationTests() {
  console.log('--- RUNNING INTEGRATION TEST: Superadmin Route Handlers ---');

  // 1. Modules Catalog Route
  console.log('[Test 6.1] GET & POST /api/v1/superadmin/modules');
  const modulesReq = createMockNextRequest();
  const modulesRes = await getModules(modulesReq);
  assert(modulesRes.status === 200, `Expected 200, got: ${modulesRes.status}`);

  const modulesJson = await modulesRes.json();
  assert(modulesJson.success === true, 'Modules API must return success: true');
  assert(modulesJson.data.length >= 10, 'Modules catalog should contain all platform modules');

  // Dependency Resolution Helper
  const depReq = createMockNextRequest({
    method: 'POST',
    body: { selectedModules: ['subscriptions'] },
  });
  const depRes = await postDependencyCheck(depReq);
  const depJson = await depRes.json();
  assert(depJson.data.canEnable === false, 'Subscriptions should flag missing dependencies');
  assert(depJson.data.missingDependencies.includes('products'), 'Products must be missing');
  console.log('✓ Superadmin modules catalog & dependency checker verified');

  // 2. Tenant Provisioning Route
  console.log('[Test 6.2] POST /api/v1/superadmin/tenants provisioning');
  const testSlug = `integ_test_${Date.now()}`;
  const provReq = createMockNextRequest({
    method: 'POST',
    body: {
      tenantName: 'Integration Test Atelier',
      slug: testSlug,
      email: `concierge@${testSlug}.com`,
      selectedModules: ['dashboard', 'storefront', 'products'],
      storefrontTemplate: 'luxury',
    },
  });
  const provRes = await postProvisionTenant(provReq);
  assert(provRes.status === 201, `Expected 201 Created, got: ${provRes.status}`);

  const provJson = await provRes.json();
  assert(provJson.success === true, 'Provisioning API must return success: true');
  assert(provJson.record.status === 'completed', 'Provisioning record must be completed');
  console.log('✓ Superadmin tenant provisioning route verified');

  // 3. Storefront Management & Publish/Rollback Route
  console.log('[Test 6.3] GET & POST /api/v1/superadmin/tenants/[id]/storefront');
  const sfReq = createMockNextRequest();
  const sfRes = await getStorefront(sfReq, { params: Promise.resolve({ id: testSlug }) });
  assert(sfRes.status === 200, `Expected 200, got: ${sfRes.status}`);

  const sfJson = await sfRes.json();
  assert(sfJson.data.storefront !== undefined, 'Storefront data must exist');
  const initialVersion = sfJson.data.storefront.publishedVersion;

  // Publish action
  const publishReq = createMockNextRequest({
    method: 'POST',
    body: { action: 'publish', changelog: 'Integration test publish' },
  });
  const publishRes = await postStorefrontAction(publishReq, { params: Promise.resolve({ id: testSlug }) });
  assert(publishRes.status === 200, `Expected 200, got: ${publishRes.status}`);

  const publishJson = await publishRes.json();
  assert(publishJson.data.version === initialVersion + 1, 'Publish must increment version');

  // Rollback action
  const rollbackReq = createMockNextRequest({
    method: 'POST',
    body: { action: 'rollback', targetVersion: initialVersion },
  });
  const rollbackRes = await postStorefrontAction(rollbackReq, { params: Promise.resolve({ id: testSlug }) });
  assert(rollbackRes.status === 200, `Expected 200, got: ${rollbackRes.status}`);

  const rollbackJson = await rollbackRes.json();
  assert(rollbackJson.data.version === initialVersion + 2, 'Rollback must create a NEW version');
  console.log('✓ Storefront management publish & rollback routes verified');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runSuperadminApiIntegrationTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
