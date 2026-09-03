/**
 * Module 37: Storefront Route Handlers Integration Test Suite
 * Validates:
 * 1. GET /api/storefront/v1/bootstrap delivers normalized storefront config.
 * 2. GET /api/storefront/v1/settings delivers public-safe settings.
 * 3. GET /api/storefront/v1/theme delivers published theme tokens.
 * 4. GET /api/storefront/v1/pages/[slug] returns 404 for unconfigured pages (Zero Static Fallback).
 */

import { GET as getBootstrap } from '@/app/api/storefront/v1/bootstrap/route';
import { GET as getSettings } from '@/app/api/storefront/v1/settings/route';
import { GET as getTheme } from '@/app/api/storefront/v1/theme/route';
import { GET as getCmsPage } from '@/app/api/storefront/v1/pages/[slug]/route';
import { createMockNextRequest } from '../support/mocks/http-context.mock';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runStorefrontApiIntegrationTests() {
  console.log('--- RUNNING INTEGRATION TEST: Storefront Route Handlers ---');

  // 1. Storefront Bootstrap Route
  console.log('[Test 5.1] GET /api/storefront/v1/bootstrap');
  const bootstrapReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/storefront/v1/bootstrap',
    tenantId: 'lumina',
  });
  const bootstrapRes = await getBootstrap(bootstrapReq);
  assert(bootstrapRes.status === 200, `Expected 200, got: ${bootstrapRes.status}`);

  const bootstrapJson = await bootstrapRes.json();
  assert(bootstrapJson.success === true, 'Bootstrap API must return success: true');
  assert(bootstrapJson.data?.store !== undefined, 'Bootstrap must contain store entity');
  assert(bootstrapJson.data?.theme !== undefined, 'Bootstrap must contain theme entity');
  console.log('✓ Storefront bootstrap route verified');

  // 2. Public Settings Route
  console.log('[Test 5.2] GET /api/storefront/v1/settings');
  const settingsReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/storefront/v1/settings',
    tenantId: 'lumina',
  });
  const settingsRes = await getSettings(settingsReq);
  assert(settingsRes.status === 200, `Expected 200, got: ${settingsRes.status}`);

  const settingsJson = await settingsRes.json();
  assert(settingsJson.success === true, 'Settings API must return success: true');
  assert(settingsJson.market?.currency !== undefined, 'Settings must specify currency');
  console.log('✓ Public settings route verified');

  // 3. Published Theme Route
  console.log('[Test 5.3] GET /api/storefront/v1/theme');
  const themeReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/storefront/v1/theme',
    tenantId: 'lumina',
  });
  const themeRes = await getTheme(themeReq);
  assert(themeRes.status === 200, `Expected 200, got: ${themeRes.status}`);

  const themeJson = await themeRes.json();
  assert(themeJson.success === true, 'Theme API must return success: true');
  assert(themeJson.data?.primaryColor !== undefined, 'Theme must return primaryColor');
  console.log('✓ Published theme route verified');

  // 4. CMS Page Route - Zero Static Fallback (404 on missing record)
  console.log('[Test 5.4] GET /api/storefront/v1/pages/[slug] 404 behavior');
  const cmsReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/storefront/v1/pages/non_existent_page_slug',
    tenantId: 'lumina',
  });
  const cmsRes = await getCmsPage(cmsReq, { params: Promise.resolve({ slug: 'non_existent_page_slug' }) });
  assert(cmsRes.status === 404, `Expected 404 for missing CMS page, got: ${cmsRes.status}`);

  const cmsJson = await cmsRes.json();
  assert(cmsJson.success === false, 'Missing CMS page must return success: false');
  console.log('✓ CMS page route 404 behavior verified');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runStorefrontApiIntegrationTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
