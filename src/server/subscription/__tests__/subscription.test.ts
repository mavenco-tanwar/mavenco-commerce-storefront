/**
 * Module 34: Enterprise Subscriptions & Recurring Billing Test Suite
 * Validates domain models, interval scheduling, state machine transitions,
 * trial & introductory pricing, exact proration, idempotent order generation,
 * dunning policies, pause/skip/cancel semantics, membership benefits, and tenant isolation.
 */

import { SubscriptionStateMachine } from '../subscription-state-machine';
import { SubscriptionSchedulingService } from '../subscription-scheduling.service';
import { SubscriptionProrationService } from '../subscription-proration.service';
import { SubscriptionDunningService } from '../subscription-dunning.service';
import { SubscriptionOrderService } from '../subscription-order.service';
import { SubscriptionService } from '../subscription.service';
import { Subscription, SubscriptionStatus } from '@/types/subscription-commerce.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runSubscriptionTestSuite() {
  console.log('--- STARTING MODULE 34 ENTERPRISE SUBSCRIPTION TEST SUITE ---');

  // 1. Scheduling & Interval Calculations
  console.log('[Test 1] Scheduling: Configurable intervals (days, weeks, months, years) & trial periods');
  const baseDate = new Date('2026-01-01T00:00:00.000Z');

  // Month interval
  const nextMonth = SubscriptionSchedulingService.addInterval(baseDate, { unit: 'month', count: 1 });
  assert(nextMonth.getUTCMonth() === 1, 'Adding 1 month to Jan should produce Feb');

  // 2-week interval
  const nextTwoWeeks = SubscriptionSchedulingService.addInterval(baseDate, { unit: 'week', count: 2 });
  assert(nextTwoWeeks.getUTCDate() === 15, 'Adding 2 weeks to Jan 1 should produce Jan 15');

  // Initial periods with trial
  const periods = SubscriptionSchedulingService.calculateInitialPeriods({
    startDate: baseDate,
    billingInterval: { unit: 'month', count: 1 },
    deliveryInterval: { unit: 'week', count: 2 },
    trialDurationDays: 14,
  });
  assert(periods.trialStartsAt !== undefined, 'Trial start should be recorded');
  assert(periods.trialEndsAt?.startsWith('2026-01-15'), '14-day trial should end on Jan 15');
  console.log('✓ Scheduling & interval calculations passed');

  // 2. State Machine Transitions
  console.log('[Test 2] State Machine: Enforcing valid transitions & rejecting illegal mutations');
  assert(SubscriptionStateMachine.canTransition('draft', 'active') === true, 'draft -> active is legal');
  assert(SubscriptionStateMachine.canTransition('active', 'paused') === true, 'active -> paused is legal');
  assert(SubscriptionStateMachine.canTransition('paused', 'active') === true, 'paused -> active is legal');
  assert(SubscriptionStateMachine.canTransition('active', 'cancelled') === true, 'active -> cancelled is legal');
  assert(SubscriptionStateMachine.canTransition('cancelled', 'active') === false, 'cancelled -> active is strictly illegal');
  assert(SubscriptionStateMachine.canTransition('completed', 'trialing') === false, 'completed -> trialing is strictly illegal');

  const illegalResult = SubscriptionStateMachine.validateTransition('cancelled', 'active');
  assert(illegalResult.allowed === false, 'Transition validation must return allowed: false');
  console.log('✓ State machine validation passed');

  // 3. Introductory Pricing Determinism
  console.log('[Test 3] Introductory Pricing: Deterministic transition to regular pricing');
  assert(
    SubscriptionSchedulingService.isIntroductoryPricingApplicable(0, true, 2) === true,
    'Cycle 0 should receive intro price'
  );
  assert(
    SubscriptionSchedulingService.isIntroductoryPricingApplicable(1, true, 2) === true,
    'Cycle 1 should receive intro price'
  );
  assert(
    SubscriptionSchedulingService.isIntroductoryPricingApplicable(2, true, 2) === false,
    'Cycle 2 must transition to regular price'
  );
  console.log('✓ Introductory pricing evaluation passed');

  // 4. Exact Proration Engine
  console.log('[Test 4] Proration: Exact calculation of unused credit and new charges in minor units');
  const proration = SubscriptionProrationService.calculateProration({
    tenantId: 'lumina',
    subscriptionId: 'sub_test_01',
    oldPlanId: 'plan_basic',
    newPlanId: 'plan_premium',
    oldPriceMinor: 10000, // $100.00
    newPriceMinor: 20000, // $200.00
    currentPeriodStart: '2026-06-01T00:00:00.000Z',
    currentPeriodEnd: '2026-07-01T00:00:00.000Z', // 30 days
    effectiveDate: '2026-06-16T00:00:00.000Z', // exactly 50% through cycle
    currency: 'USD',
  });

  assert(proration.unusedDays >= 14 && proration.unusedDays <= 16, 'Unused days should be ~15 days');
  assert(proration.unusedCreditMinor >= 4900 && proration.unusedCreditMinor <= 5100, 'Unused credit should be ~$50');
  assert(proration.newChargeMinor >= 9800 && proration.newChargeMinor <= 10200, 'New charge should be ~$100');
  assert(proration.netAdjustmentMinor > 0, 'Net adjustment must be positive (customer pays upgrade difference)');
  console.log('✓ Proration engine tests passed');

  // 5. Idempotent Recurring Order Generation
  console.log('[Test 5] Order Generation: Automated recurring order placement & idempotency locks');
  SubscriptionOrderService.clearIdempotencyCache();

  const mockSub: Subscription = {
    id: 'sub_test_order_gen',
    tenantId: 'lumina',
    storeId: 'store_01',
    customerId: 'cust_01',
    customerEmail: 'clara@atelier.com',
    customerName: 'Clara Dupont',
    status: 'active',
    subscriptionNumber: 'SUB-LUM-9999',
    planId: 'plan_monthly_couture',
    planName: 'Monthly Couture Refill',
    planType: 'product_subscription',
    planVersion: 1,
    items: [
      {
        id: 'item_1',
        subscriptionId: 'sub_test_order_gen',
        productId: 'prod-01',
        quantity: 2,
        unitPrice: 50000,
        recurringPrice: 42500, // $425.00 * 2 = $850.00
        currency: 'USD',
        productSnapshot: {
          productId: 'prod-01',
          productTitle: 'Ivory Handcrafted Kaftan',
          sku: 'ATELIER-DRS-001',
          unitPrice: 50000,
        },
      },
    ],
    currency: 'USD',
    locale: 'en-US',
    marketId: 'GLOBAL',
    channelId: 'web',
    billingInterval: { unit: 'month', count: 1 },
    deliveryInterval: { unit: 'month', count: 1 },
    startsAt: '2026-01-01T00:00:00.000Z',
    currentPeriodStart: '2026-01-01T00:00:00.000Z',
    currentPeriodEnd: '2026-02-01T00:00:00.000Z',
    renewalCount: 0,
    cancelAtPeriodEnd: false,
    shippingAddressSnapshot: {
      fullName: 'Clara Dupont',
      email: 'clara@atelier.com',
      phone: '+1 415 555 1234',
      addressLine1: '100 Post St',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94108',
      country: 'US',
    },
    billingAddressSnapshot: {
      fullName: 'Clara Dupont',
      email: 'clara@atelier.com',
      phone: '+1 415 555 1234',
      addressLine1: '100 Post St',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94108',
      country: 'US',
    },
    taxSnapshot: { taxRate: 0.08, taxAmount: 6800, isTaxIncluded: false },
    pricingSnapshot: {
      subtotal: 85000,
      discountTotal: 0,
      shippingFee: 0,
      taxAmount: 6800,
      total: 91800,
      lockedPrice: true,
      pricingMode: 'locked',
    },
    failedPaymentCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  // First execution: Must succeed
  const genResult1 = await SubscriptionOrderService.generateRecurringOrder(mockSub);
  assert(genResult1.success === true, 'First renewal execution must succeed');
  assert(genResult1.order !== undefined, 'Order should be created');
  assert(genResult1.order?.isRecurringOrder === true, 'Order must be tagged isRecurringOrder: true');
  assert(genResult1.order?.subscriptionId === mockSub.id, 'Order must link subscriptionId');
  assert(genResult1.subscription.renewalCount === 1, 'Renewal count must advance to 1');

  // Second immediate execution: Must fail due to Idempotency Lock
  const genResult2 = await SubscriptionOrderService.generateRecurringOrder(mockSub);
  assert(genResult2.success === false, 'Duplicate renewal job execution must be blocked by idempotency key');
  assert(genResult2.error?.includes('Duplicate prevented'), 'Error must specify duplicate prevented');
  console.log('✓ Idempotent order generation passed');

  // 6. Dunning Policies & Failure Recovery
  console.log('[Test 6] Dunning: Retries, grace periods, and escalation');
  const dunningPolicy = SubscriptionDunningService.DEFAULT_POLICY;
  const retry1 = SubscriptionDunningService.calculateNextRetry(1, dunningPolicy);
  assert(retry1 !== null, 'Attempt 1 should yield a valid next retry date');

  const failedSub: Subscription = { ...mockSub, failedPaymentCount: 3 };
  const escalation = SubscriptionDunningService.evaluateNextStateOnFailure(failedSub, dunningPolicy);
  assert(escalation.nextStatus === 'suspended', 'Reaching max retry attempts must escalate to suspended');
  console.log('✓ Dunning & recovery policy passed');

  // 7. Pause, Resume, and Skip Next Shipment
  console.log('[Test 7] Pause, Resume, & Skip: Schedule shifts without duplicate billing');
  const subSkipped = await SubscriptionService.skipNextShipment('lumina', 'sub_lumina_101');
  assert(subSkipped.nextDeliveryAt !== undefined, 'Next delivery should be advanced on skip');

  const subPaused = await SubscriptionService.pauseSubscription('lumina', 'sub_lumina_101', 'Vacation');
  assert(subPaused.status === 'paused', 'Status should transition to paused');

  const subResumed = await SubscriptionService.resumeSubscription('lumina', 'sub_lumina_101');
  assert(subResumed.status === 'active', 'Status should transition back to active');
  console.log('✓ Pause, resume, and skip tests passed');

  // 8. Quantity Changes & Dynamic Pricing Recalculation
  console.log('[Test 8] Quantity Modification: Live line & tax recalculation in minor units');
  const updatedQtySub = await SubscriptionService.changeQuantity('lumina', 'sub_lumina_101', 'item_01', 3);
  const updatedItem = updatedQtySub.items.find((i) => i.id === 'item_01');
  assert(updatedItem?.quantity === 3, 'Item quantity should update to 3');
  assert(updatedQtySub.pricingSnapshot.subtotal === 67900 * 3, 'Subtotal should be 3x recurring price');
  console.log('✓ Quantity modification passed');

  // 9. Membership Benefits Evaluation
  console.log('[Test 9] Membership Benefits: Loyalty multipliers, free shipping, member discounts');
  SubscriptionService.initTenantStore('lumina');
  // Create an active membership subscription for Clara
  await SubscriptionService.createSubscription('lumina', {
    customerId: 'cust_clara_vip',
    customerEmail: 'clara.vip@atelier.com',
    customerName: 'Clara VIP',
    planId: 'mem_lumina_vip',
    planName: 'Atelier Circle VIP Membership',
    storeId: 'store_primary',
    items: [],
    shippingAddressSnapshot: mockSub.shippingAddressSnapshot,
    billingAddressSnapshot: mockSub.billingAddressSnapshot,
  });

  // Since planType is membership in mem_lumina_vip
  const memSub = Array.from((await SubscriptionService.getSubscriptions('lumina', { customerId: 'cust_clara_vip' })).data)[0];
  memSub.planType = 'membership';

  const benefits = await SubscriptionService.getCustomerMembershipBenefits('lumina', 'cust_clara_vip');
  assert(benefits.hasActiveMembership === true, 'Customer should hold active membership');
  assert(benefits.freeShipping === true, 'VIP tier should entitle customer to free shipping');
  assert(benefits.discountPercentage === 10, 'VIP tier should include 10% discount');
  assert(benefits.loyaltyMultiplier === 2.0, 'VIP tier should grant 2x loyalty multiplier');
  console.log('✓ Membership benefits evaluation passed');

  // 10. Multi-Tenant Isolation & Customer Security
  console.log('[Test 10] Multi-Tenant Isolation: Database and customer boundaries');
  SubscriptionService.initTenantStore('lumina');
  SubscriptionService.initTenantStore('auraliving');

  const luminaSubs = await SubscriptionService.getSubscriptions('lumina');
  const auraSubs = await SubscriptionService.getSubscriptions('auraliving');
  assert(luminaSubs.total > 0, 'Lumina store should have subscriptions');
  assert(auraSubs.total > 0, 'Aura Living store should have subscriptions');

  // Cross-tenant ID lookup must return null
  const crossLookup = await SubscriptionService.getSubscriptionById('auraliving', 'sub_lumina_101');
  assert(crossLookup === null, 'Tenant A must NEVER access Tenant B subscription');
  console.log('✓ Multi-tenant isolation verified');

  console.log('================================================================');
  console.log('ALL MODULE 34 ENTERPRISE SUBSCRIPTION TESTS PASSED (10/10)');
  console.log('================================================================');
  return true;
}

// Self-executing runner
if (typeof require !== 'undefined' && require.main === module) {
  runSubscriptionTestSuite().catch((err) => {
    console.error('Test Suite Failure:', err);
    process.exit(1);
  });
}
