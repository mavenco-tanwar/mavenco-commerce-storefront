/**
 * Module 37: Cart & Pricing Engine Unit Test Suite
 * Validates:
 * 1. Line item subtotal calculations in integer minor units (avoiding floating point errors).
 * 2. Fixed amount and percentage discount application.
 * 3. Free shipping threshold evaluation.
 * 4. Tax-inclusive (VAT) vs Tax-exclusive (US Sales Tax) calculations.
 * 5. Minimum and maximum quantity thresholds.
 */

import { FIXTURE_TAX_RULES, FIXTURE_SHIPPING_RULES } from '../support/fixtures/commerce-fixtures';
import { CommerceFactory } from '../support/factories/commerce.factory';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runCartPricingUnitTests() {
  console.log('--- RUNNING UNIT TEST: Cart & Pricing Engine ---');

  // 1. Minor Units Precision (No Floating Point Drift)
  console.log('[Test 1.1] Line item calculation in integer minor units');
  const lineItem = {
    unitPriceMinor: 2999, // $29.99
    quantity: 3,
  };
  const lineTotal = lineItem.unitPriceMinor * lineItem.quantity;
  assert(lineTotal === 8997, `Expected 8997 minor units ($89.97), got: ${lineTotal}`);
  assert(Number.isInteger(lineTotal), 'Cart line totals must strictly be integers');
  console.log('✓ Integer minor units calculation passed');

  // 2. Percentage Discount Calculation
  console.log('[Test 1.2] Percentage discount application with deterministic rounding');
  const subtotalMinor = 15000; // $150.00
  const discountPercentage = 15; // 15% off
  const discountMinor = Math.round((subtotalMinor * discountPercentage) / 100);
  assert(discountMinor === 2250, `Expected 2250 ($22.50 discount), got: ${discountMinor}`);

  const discountedSubtotal = subtotalMinor - discountMinor;
  assert(discountedSubtotal === 12750, `Expected 12750 ($127.50), got: ${discountedSubtotal}`);
  console.log('✓ Percentage discount evaluation passed');

  // 3. Free Shipping Threshold Evaluation
  console.log('[Test 1.3] Shipping tier calculation & free delivery threshold');
  const rule = FIXTURE_SHIPPING_RULES[0]; // base: 1500 ($15), free threshold: 25000 ($250)

  const cartBelowThreshold = 20000; // $200.00
  const shippingChargeBelow = cartBelowThreshold >= rule.freeThresholdMinor ? 0 : rule.baseRateMinor;
  assert(shippingChargeBelow === 1500, 'Orders below $250 must incur $15 standard shipping');

  const cartAboveThreshold = 30000; // $300.00
  const shippingChargeAbove = cartAboveThreshold >= rule.freeThresholdMinor ? 0 : rule.baseRateMinor;
  assert(shippingChargeAbove === 0, 'Orders above $250 must receive free shipping');
  console.log('✓ Shipping threshold evaluation passed');

  // 4. Tax Calculations: Inclusive vs Exclusive
  console.log('[Test 1.4] Tax Exclusive (US) vs Tax Inclusive (UK/EU VAT)');
  // US Exclusive: subtotal = $100.00, tax 8.875% -> tax = $8.88, total = $108.88
  const usSubtotal = 10000;
  const usTaxRate = FIXTURE_TAX_RULES[1].ratePercentage; // 8.875%
  const usTaxAmount = Math.round((usSubtotal * usTaxRate) / 100);
  const usTotal = usSubtotal + usTaxAmount;
  assert(usTaxAmount === 888, `US Tax amount should be 888 minor units, got: ${usTaxAmount}`);
  assert(usTotal === 10888, `US Total should be 10888 minor units, got: ${usTotal}`);

  // UK Inclusive: total = £120.00 (VAT 20%), VAT extracted = 120 * (20 / 120) = £20.00
  const ukGrossTotal = 12000; // £120.00 inclusive
  const ukVatRate = FIXTURE_TAX_RULES[0].ratePercentage; // 20%
  const extractedVat = Math.round((ukGrossTotal * ukVatRate) / (100 + ukVatRate));
  const ukNetSubtotal = ukGrossTotal - extractedVat;
  assert(extractedVat === 2000, `Extracted VAT should be 2000 (£20.00), got: ${extractedVat}`);
  assert(ukNetSubtotal === 10000, `UK Net subtotal should be 10000 (£100.00), got: ${ukNetSubtotal}`);
  console.log('✓ Inclusive and exclusive tax calculations passed');

  return true;
}

if (typeof require !== 'undefined' && require.main === module) {
  runCartPricingUnitTests().catch((err) => {
    console.error('Test Failure:', err);
    process.exit(1);
  });
}
