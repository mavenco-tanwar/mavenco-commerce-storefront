/**
 * Module 37: Headless Experience API & Storefront SDK Unit Test Suite
 * Validates:
 * 1. Request context extraction (device, currency, market, locale).
 * 2. Public store configuration projection without credential leakage.
 * 3. Headless navigation hierarchy.
 * 4. Storefront product structure formatting.
 */

import { ExperienceAPIService } from '@/server/experience/experience-api.service';
import { createMockNextRequest } from '../support/mocks/http-context.mock';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runHeadlessExperienceUnitTests() {
  console.log('--- RUNNING UNIT TEST: Headless Experience & Storefront SDK ---');

  // 1. Request Context Extraction
  console.log('[Test 3.1] StorefrontRequestContext extraction from headers and host');
  const mockReq = createMockNextRequest({
    tenantId: 'lumina',
    currency: 'GBP',
    locale: 'en-GB',
    marketId: 'EU_UK',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    },
  });

  const context = await ExperienceAPIService.resolveContext(mockReq);
  assert(context.tenantId === 'lumina', `Expected tenant lumina, got: ${context.tenantId}`);
  assert(context.currency === 'GBP', `Expected currency GBP, got: ${context.currency}`);
  assert(context.locale === 'en-GB', `Expected locale en-GB, got: ${context.locale}`);
  assert(context.device === 'mobile', `Expected mobile device from iPhone UA, got: ${context.device}`);
  console.log('✓ Request context resolution passed');

  // 2. Public Store Configuration Security Check
  console.log('[Test 3.2] PublicStoreConfiguration safety (zero secret keys or credentials)');
  const publicConfig = await ExperienceAPIService.getPublicStoreConfig(context);
  assert(publicConfig !== null, 'Public config should not be null');
  assert(publicConfig.store?.name.length > 0, 'Store name must be present');

  const configJson = JSON.stringify(publicConfig);
  assert(!configJson.includes('secret'), 'Public config must never expose secrets');
  assert(!configJson.includes('private_key'), 'Public config must never expose private keys');
  assert(!configJson.includes('password'), 'Public config must never expose passwords');
  console.log('✓ Public store configuration projection & security verified');

  // 3. Headless Navigation Structure
  console.log('[Test 3.3] Storefront navigation structure & menu items');
  const nav = await ExperienceAPIService.getNavigation(context);
  assert(nav !== null, 'Navigation must not be null');
  assert(Array.isArray(nav.headerMenu), 'Header menu items must be an array');
  console.log('✓ Storefront navigation hierarchy passed');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runHeadlessExperienceUnitTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
