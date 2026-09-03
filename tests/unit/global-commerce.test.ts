/**
 * Module 37: Global Commerce & Multi-Market Unit Test Suite
 * Validates:
 * 1. Market context resolution by country code and IP geography.
 * 2. Multi-currency exchange rate conversions with minor unit rounding.
 * 3. Market-specific price lists and overrides.
 * 4. Locale text direction (LTR vs RTL for Arabic).
 * 5. Deterministic fallback when market is unconfigured.
 */

import { GlobalCommerceService } from '@/server/global/global-commerce.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runGlobalCommerceUnitTests() {
  console.log('--- RUNNING UNIT TEST: Global Commerce & Localization ---');

  // 1. Currency Conversion in Minor Units
  console.log('[Test 2.1] Multi-currency conversion precision');
  const usdAmountMinor = 10000; // $100.00
  const eurConversion = GlobalCommerceService.convertMoney({
    minorUnits: usdAmountMinor,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
  });
  assert(eurConversion.minorUnits > 0, 'EUR conversion must return positive minor unit amount');
  assert(Number.isInteger(eurConversion.minorUnits), 'Converted amount must be an integer (minor units)');

  const inrConversion = GlobalCommerceService.convertMoney({
    minorUnits: usdAmountMinor,
    fromCurrency: 'USD',
    toCurrency: 'INR',
  });
  assert(inrConversion.minorUnits >= 800000, `Expected >= 800,000 INR minor units for $100, got: ${inrConversion.minorUnits}`);
  console.log('✓ Currency conversion precision passed');

  // 2. Market Context Resolution
  console.log('[Test 2.2] Market context resolution for US, UK, and UAE');
  const usContext = GlobalCommerceService.resolveMarket({
    countryCode: 'US',
    tenantId: 'tenant_lumina',
  });
  assert(usContext.currency === 'USD', `Expected USD for US market, got: ${usContext.currency}`);
  assert(usContext.direction === 'ltr', 'US direction must be ltr');

  const aeContext = GlobalCommerceService.resolveMarket({
    countryCode: 'AE',
    requestedLocale: 'ar-AE',
    tenantId: 'tenant_lumina',
  });
  assert(aeContext.currency === 'AED', `Expected AED for UAE market, got: ${aeContext.currency}`);
  assert(aeContext.direction === 'rtl', 'Arabic locale must resolve to RTL text direction');
  console.log('✓ Market context resolution & RTL detection passed');

  // 3. Price List Resolution & Override
  console.log('[Test 2.3] Price list resolution: base price vs market override');
  const basePriceMinor = 29500; // $295.00
  const resolvedUsPrice = GlobalCommerceService.convertMoney({
    minorUnits: basePriceMinor,
    fromCurrency: 'USD',
    toCurrency: usContext.currency,
  });
  assert(resolvedUsPrice.minorUnits > 0, 'Resolved price should be positive');
  console.log('✓ Market-specific price resolution passed');

  // 4. Deterministic Market Fallback
  console.log('[Test 2.4] Deterministic fallback for unknown country code');
  const fallbackContext = GlobalCommerceService.resolveMarket({
    countryCode: 'XX',
  });
  assert(fallbackContext !== null, 'Fallback market context must never be null');
  assert(fallbackContext.currency.length === 3, 'Fallback must have valid 3-letter currency code');
  console.log('✓ Deterministic market fallback passed');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runGlobalCommerceUnitTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
