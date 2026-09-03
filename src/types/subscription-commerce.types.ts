/**
 * Module 34: Subscriptions, Recurring Commerce, Memberships & Recurring Billing Types
 * Complete domain models for customer recurring commerce, tiered memberships,
 * dunning policies, proration records, and subscription analytics.
 * Strictly decoupled from platform SaaS billing.
 */

export type SubscriptionStatus =
  | 'draft'
  | 'pending'
  | 'trialing'
  | 'active'
  | 'paused'
  | 'past_due'
  | 'payment_failed'
  | 'cancel_pending'
  | 'cancelled'
  | 'expired'
  | 'completed'
  | 'suspended';

export type IntervalUnit = 'day' | 'week' | 'month' | 'year';

export type SubscriptionPlanType =
  | 'product_subscription'
  | 'membership'
  | 'service_subscription'
  | 'digital_subscription'
  | 'subscription_box'
  | 'recurring_order'
  | 'hybrid';

export interface BillingIntervalConfig {
  unit: IntervalUnit;
  count: number; // e.g. 1 month, 2 weeks, 3 months
}

export interface DeliveryIntervalConfig {
  unit: IntervalUnit;
  count: number; // e.g. every 2 weeks, every 1 month
}

export interface SubscriptionPolicies {
  allowPause: boolean;
  maxPauseCycles?: number;
  pausePolicy: 'immediate' | 'end_of_period';
  allowSkip: boolean;
  maxConsecutiveSkips?: number;
  allowQuantityChange: boolean;
  quantityChangeEffective: 'immediate' | 'next_cycle';
  allowProductChange: boolean;
  allowVariantChange: boolean;
  allowUpgrade: boolean;
  allowDowngrade: boolean;
  upgradePolicy: 'immediate_prorate' | 'immediate_full' | 'next_cycle';
  downgradePolicy: 'immediate_credit' | 'next_cycle';
  allowCancellation: boolean;
  cancellationPolicy: 'immediate' | 'end_of_period';
  minimumCommitmentPeriods: number;
  maximumPeriods?: number;
}

export interface SubscriptionPlanVersion {
  version: number;
  planId: string;
  name: string;
  recurringPrice: number; // Integer minor currency units (e.g. 79900 = 799.00)
  currency: string;
  billingInterval: BillingIntervalConfig;
  deliveryInterval: DeliveryIntervalConfig;
  trialEnabled: boolean;
  trialDurationDays?: number;
  introductoryPricingEnabled: boolean;
  introductoryPrice?: number;
  introductoryPeriods?: number;
  setupFee?: number;
  policies: SubscriptionPolicies;
  benefits?: string[];
  effectiveFrom: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  tenantId: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  planType: SubscriptionPlanType;
  version: number;
  currentVersion: SubscriptionPlanVersion;
  versions: SubscriptionPlanVersion[];
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  membershipLevel?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionItemSnapshot {
  productId: string;
  productTitle: string;
  sku: string;
  variantId?: string;
  variantTitle?: string;
  image?: string;
  unitPrice: number;
  compareAtPrice?: number;
}

export interface SubscriptionItem {
  id: string;
  subscriptionId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number; // base reference price
  recurringPrice: number; // price charged per recurrence in minor units
  currency: string;
  taxCategoryId?: string;
  shippingClassId?: string;
  discountPercentage?: number;
  productSnapshot: SubscriptionItemSnapshot;
  metadata?: Record<string, any>;
}

export interface AddressSnapshot {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface TaxSnapshot {
  taxZoneId?: string;
  taxRate: number; // e.g. 0.18 for 18%
  taxAmount: number; // minor units
  isTaxIncluded: boolean;
}

export interface PricingSnapshot {
  subtotal: number; // minor units
  discountTotal: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  lockedPrice: boolean;
  pricingMode: 'locked' | 'current_catalog' | 'discount_tier';
}

export interface Subscription {
  id: string;
  tenantId: string;
  storeId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: SubscriptionStatus;
  subscriptionNumber: string; // e.g. SUB-LUM-100234
  planId: string;
  planName: string;
  planType: SubscriptionPlanType;
  planVersion: number;
  items: SubscriptionItem[];
  currency: string;
  locale: string;
  marketId: string;
  channelId: string;
  billingInterval: BillingIntervalConfig;
  deliveryInterval: DeliveryIntervalConfig;
  trialStartsAt?: string;
  trialEndsAt?: string;
  startsAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingAt?: string;
  nextDeliveryAt?: string;
  renewalCount: number;
  cancelledAt?: string;
  cancelAtPeriodEnd: boolean;
  cancellationReason?: string;
  cancellationSource?: 'customer' | 'admin' | 'dunning' | 'system';
  pausedAt?: string;
  pauseReason?: string;
  resumedAt?: string;
  endedAt?: string;
  paymentMethodId?: string;
  paymentToken?: string;
  shippingAddressSnapshot: AddressSnapshot;
  billingAddressSnapshot: AddressSnapshot;
  taxSnapshot: TaxSnapshot;
  pricingSnapshot: PricingSnapshot;
  failedPaymentCount: number;
  lastPaymentError?: string;
  lastOrderId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type MembershipStatus = 'pending' | 'active' | 'paused' | 'past_due' | 'cancelled' | 'expired';

export interface MembershipBenefit {
  id: string;
  type:
    | 'percentage_discount'
    | 'fixed_discount'
    | 'free_shipping'
    | 'early_access'
    | 'exclusive_products'
    | 'exclusive_collections'
    | 'loyalty_multiplier'
    | 'bonus_points'
    | 'member_only_pricing'
    | 'priority_support';
  description: string;
  discountPercentage?: number;
  loyaltyMultiplier?: number;
  exclusiveCollectionIds?: string[];
  exclusiveProductIds?: string[];
  enabled: boolean;
}

export interface MembershipPlan {
  id: string;
  tenantId: string;
  storeId: string;
  name: string;
  slug: string;
  tier: 'basic' | 'premium' | 'vip' | 'custom';
  description?: string;
  price: number; // in minor units
  currency: string;
  billingInterval: BillingIntervalConfig;
  status: 'draft' | 'published' | 'archived';
  benefits: MembershipBenefit[];
  trialDurationDays?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionProrationRecord {
  id: string;
  tenantId: string;
  subscriptionId: string;
  oldPlanId: string;
  newPlanId: string;
  oldPriceMinor: number;
  newPriceMinor: number;
  cycleStart: string;
  cycleEnd: string;
  effectiveDate: string;
  unusedDays: number;
  totalDaysInCycle: number;
  unusedCreditMinor: number;
  newChargeMinor: number;
  netAdjustmentMinor: number; // positive = charge customer, negative = refund/credit
  currency: string;
  calculationTimestamp: string;
  calculationVersion: number;
}

export interface DunningAttempt {
  attemptNumber: number;
  scheduledAt: string;
  executedAt?: string;
  status: 'scheduled' | 'successful' | 'failed' | 'skipped';
  errorCode?: string;
  errorMessage?: string;
}

export interface DunningPolicy {
  id: string;
  tenantId: string;
  name: string;
  maxRetryAttempts: number;
  retryIntervalDays: number[]; // e.g. [0, 2, 4, 7]
  gracePeriodDays: number; // e.g. 10 days before cancel or suspend
  finalAction: 'cancel' | 'suspend' | 'mark_unpaid';
  notificationSchedule: boolean;
}

export interface SubscriptionAnalyticsMetrics {
  activeSubscribers: number;
  newSubscribersCount: number;
  churnRatePercent: number;
  mrrMinor: number; // Monthly Recurring Revenue
  arrMinor: number; // Annual Recurring Revenue
  netMrrMinor: number;
  renewalSuccessRatePercent: number;
  trialConversionRatePercent: number;
  recoveryRatePercent: number;
  averageSubscriptionValueMinor: number;
  averageLifetimeDays: number;
  pausesCount: number;
  skipsCount: number;
  upgradesCount: number;
  downgradesCount: number;
  cancellationsCount: number;
}
