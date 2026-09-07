/**
 * Module 37: Master Automated Quality Gate & Test Runner
 * Orchestrates complete project verification:
 * - Domain Unit Suites (Cart, Pricing, PIM, Subscriptions, Governance, Headless, Global)
 * - Security & Multi-Tenant Isolation Suites
 * - Next.js Route Handler Integration Suites (Storefront & Superadmin)
 * - Zero Static Business Data Audit Scanner
 */

import { runCartPricingUnitTests } from '../tests/unit/cart-pricing.test';
import { runGlobalCommerceUnitTests } from '../tests/unit/global-commerce.test';
import { runHeadlessExperienceUnitTests } from '../tests/unit/headless-experience.test';
import { runPimTestSuite } from '../src/server/pim/__tests__/pim.test';
import { runSubscriptionTestSuite } from '../src/server/subscription/__tests__/subscription.test';
import { runModule36TestSuite } from '../src/server/governance/__tests__/module-access-storefront.test';
import { runTenantIsolationSecurityTests } from '../tests/security/tenant-isolation.test';
import { runStorefrontApiIntegrationTests } from '../tests/integration/storefront-api.test';
import { runSuperadminApiIntegrationTests } from '../tests/integration/superadmin-api.test';
import { runTenantAdminApiIntegrationTests } from '../tests/integration/admin-api.test';
import { runDbSyncTestSuite } from '../src/server/db/__tests__/db-sync.test';
import { runStaticDataAudit } from './audit-static-data';

interface SuiteResult {
  name: string;
  category: 'Unit' | 'Integration' | 'Security' | 'Quality Gate';
  passed: boolean;
  durationMs: number;
  error?: string;
}

async function runQualityGate() {
  console.log('================================================================');
  console.log('       MAVENCO COMMERCE SAAS — AUTOMATED QUALITY GATE           ');
  console.log('             Complete Project Verification Suite                ');
  console.log('================================================================\n');

  const startTime = Date.now();
  const results: SuiteResult[] = [];

  const suites: { name: string; category: SuiteResult['category']; fn: () => Promise<any> | boolean }[] = [
    { name: 'Cart & Pricing Engine (Minor Units & Tax)', category: 'Unit', fn: runCartPricingUnitTests },
    { name: 'Global Commerce & Multi-Market Engine', category: 'Unit', fn: runGlobalCommerceUnitTests },
    { name: 'Headless Storefront & SDK Experience', category: 'Unit', fn: runHeadlessExperienceUnitTests },
    { name: 'Enterprise PIM & Catalog Governance', category: 'Unit', fn: runPimTestSuite },
    { name: 'Subscriptions & Recurring Commerce', category: 'Unit', fn: runSubscriptionTestSuite },
    { name: 'Tenant Entitlements & Storefront Governance', category: 'Unit', fn: runModule36TestSuite },
    { name: 'Multi-Tenant Isolation & Security Boundary', category: 'Security', fn: runTenantIsolationSecurityTests },
    { name: 'Storefront Route Handlers Integration', category: 'Integration', fn: runStorefrontApiIntegrationTests },
    { name: 'Superadmin Route Handlers Integration', category: 'Integration', fn: runSuperadminApiIntegrationTests },
    { name: 'Tenant Admin Route Handlers Integration', category: 'Integration', fn: runTenantAdminApiIntegrationTests },
    { name: 'Database-First Synchronization Contract', category: 'Quality Gate', fn: runDbSyncTestSuite },
    { name: 'Zero Static Business Data Scanner', category: 'Quality Gate', fn: () => runStaticDataAudit() },
  ];

  for (const suite of suites) {
    const suiteStart = Date.now();
    try {
      const outcome = await suite.fn();
      const passed = outcome !== false;
      results.push({
        name: suite.name,
        category: suite.category,
        passed,
        durationMs: Date.now() - suiteStart,
      });
    } catch (err: any) {
      results.push({
        name: suite.name,
        category: suite.category,
        passed: false,
        durationMs: Date.now() - suiteStart,
        error: err.message,
      });
    }
    console.log('');
  }

  const totalDuration = Date.now() - startTime;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log('================================================================');
  console.log('                 QUALITY GATE EXECUTION SUMMARY                 ');
  console.log('================================================================');
  console.log(
    `Total Suites: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount} | Time: ${totalDuration}ms\n`
  );

  console.log('----------------------------------------------------------------');
  console.log(
    'Status  | Category     | Duration | Suite Name'
  );
  console.log('----------------------------------------------------------------');
  for (const res of results) {
    const statusTag = res.passed ? '✓ PASS' : '✗ FAIL';
    const cat = res.category.padEnd(12);
    const dur = `${res.durationMs}ms`.padStart(7);
    console.log(`${statusTag}  | ${cat} | ${dur}  | ${res.name}`);
    if (res.error) {
      console.log(`         ERROR: ${res.error}`);
    }
  }
  console.log('----------------------------------------------------------------\n');

  if (failedCount > 0) {
    console.error('QUALITY GATE FAILED: Some test suites encountered failures.');
    process.exit(1);
  } else {
    console.log('✓ ALL QUALITY GATE CHECKS PASSED: Ready for production deployment!');
    process.exit(0);
  }
}

runQualityGate().catch((err) => {
  console.error('Quality Gate Fatal Error:', err);
  process.exit(1);
});
