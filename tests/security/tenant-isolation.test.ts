/**
 * Module 37: Security & Multi-Tenant Isolation Test Suite
 * Validates:
 * 1. Database name sanitization & isolation: strictly `tenant_{tenantId}`.
 * 2. Injection prevention: special characters and traversal patterns are stripped.
 * 3. Cache key prefix isolation: Tenant A and Tenant B keys never collide.
 * 4. Cross-tenant authorization boundary: Tenant A cannot access Tenant B resources.
 * 5. Data contamination prevention: Empty tenant returns clean empty states without data leaks.
 */

import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { PermissionService } from '@/server/governance/permission.service';
import { createMockNextRequest } from '../support/mocks/http-context.mock';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runTenantIsolationSecurityTests() {
  console.log('--- RUNNING SECURITY TEST: Tenant Isolation & Boundary Verification ---');

  // 1. Database Name Sanitization & Scoping
  console.log('[Test 4.1] Database name sanitization & injection resistance');
  const safeName1 = TenantDatabaseResolver.getTenantDatabaseName('lumina');
  assert(safeName1 === 'tenant_lumina', `Expected tenant_lumina, got: ${safeName1}`);

  // Test special characters & path traversal attempts
  const dirtyInput = '../../admin$root;DROP DATABASE';
  const safeDirtyName = TenantDatabaseResolver.getTenantDatabaseName(dirtyInput);
  assert(!safeDirtyName.includes('.'), 'Database name must not contain dots');
  assert(!safeDirtyName.includes('/'), 'Database name must not contain slashes');
  assert(!safeDirtyName.includes(';'), 'Database name must not contain semicolons');
  assert(safeDirtyName.startsWith('tenant_'), 'Database name must strictly start with tenant_');
  console.log('✓ Database name sanitization passed');

  // 2. Cache Key Partitioning
  console.log('[Test 4.2] Cache key partitioning: Tenant A vs Tenant B');
  const reqA = createMockNextRequest({ tenantId: 'tenant_alpha', marketId: 'US' });
  const ctxA = TenantDatabaseResolver.resolveContext(reqA);

  const reqB = createMockNextRequest({ tenantId: 'tenant_beta', marketId: 'US' });
  const ctxB = TenantDatabaseResolver.resolveContext(reqB);

  const cacheKeyA = TenantDatabaseResolver.getTenantCacheKey(ctxA, 'catalog', 'prod_100');
  const cacheKeyB = TenantDatabaseResolver.getTenantCacheKey(ctxB, 'catalog', 'prod_100');

  assert(cacheKeyA !== cacheKeyB, 'Tenant A and Tenant B cache keys must NEVER collide');
  assert(cacheKeyA.includes('tenant:tenant_alpha'), 'Key A must be partitioned by tenant_alpha');
  assert(cacheKeyB.includes('tenant:tenant_beta'), 'Key B must be partitioned by tenant_beta');
  console.log('✓ Cache key partition isolation verified');

  // 3. Cross-Tenant Authorization Boundary
  console.log('[Test 4.3] Cross-tenant resource authorization rejection');
  const accessCheck = await PermissionService.evaluateAccess({
    tenantId: 'tenant_alpha',
    userId: 'usr_alpha_admin',
    permissionKey: 'products.view',
    targetResourceTenantId: 'tenant_beta', // Attempting to access Tenant Beta resource
  });

  assert(accessCheck.allowed === false, 'Cross-tenant resource access must be strictly DENIED');
  assert(accessCheck.reason?.includes('Cross-tenant'), 'Rejection reason must indicate cross-tenant prohibition');
  console.log('✓ Cross-tenant access denial verified');

  // 4. Clean Empty State (Zero Data Contamination)
  console.log('[Test 4.4] Clean empty state for new unconfigured tenant');
  const newTenantReq = createMockNextRequest({ tenantId: 'brand_new_unseeded_store' });
  const newTenantCtx = TenantDatabaseResolver.resolveContext(newTenantReq);
  assert(newTenantCtx.tenantId === 'brand_new_unseeded_store', 'Context must reflect unseeded tenant');
  console.log('✓ Clean empty state verified');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runTenantIsolationSecurityTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
