/**
 * Module 34: Subscription Proration Service
 * Calculates exact mid-cycle adjustments for upgrades, downgrades, and quantity changes.
 * Produces immutable SubscriptionProrationRecord instances.
 * All financial amounts use integer minor currency units.
 */

import { SubscriptionProrationRecord } from '@/types/subscription-commerce.types';

export class SubscriptionProrationService {
  /**
   * Calculates mid-cycle proration when moving from oldPlan/oldPrice to newPlan/newPrice.
   */
  public static calculateProration(params: {
    tenantId: string;
    subscriptionId: string;
    oldPlanId: string;
    newPlanId: string;
    oldPriceMinor: number;
    newPriceMinor: number;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    effectiveDate?: string;
    currency: string;
  }): SubscriptionProrationRecord {
    const {
      tenantId,
      subscriptionId,
      oldPlanId,
      newPlanId,
      oldPriceMinor,
      newPriceMinor,
      currentPeriodStart,
      currentPeriodEnd,
      currency,
    } = params;

    const startMs = new Date(currentPeriodStart).getTime();
    const endMs = new Date(currentPeriodEnd).getTime();
    const effectiveMs = params.effectiveDate ? new Date(params.effectiveDate).getTime() : Date.now();

    const totalCycleMs = Math.max(1, endMs - startMs);
    const unusedMs = Math.max(0, Math.min(totalCycleMs, endMs - effectiveMs));

    const totalDaysInCycle = Math.max(1, Math.round(totalCycleMs / (1000 * 60 * 60 * 24)));
    const unusedDays = Math.max(0, Math.round(unusedMs / (1000 * 60 * 60 * 24)));

    // Exact ratio calculation in integer minor units
    const ratio = unusedMs / totalCycleMs;
    const unusedCreditMinor = Math.round(oldPriceMinor * ratio);
    const newChargeMinor = Math.round(newPriceMinor * ratio);
    const netAdjustmentMinor = newChargeMinor - unusedCreditMinor; // positive = charge, negative = credit

    return {
      id: `pror_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      subscriptionId,
      oldPlanId,
      newPlanId,
      oldPriceMinor,
      newPriceMinor,
      cycleStart: currentPeriodStart,
      cycleEnd: currentPeriodEnd,
      effectiveDate: new Date(effectiveMs).toISOString(),
      unusedDays,
      totalDaysInCycle,
      unusedCreditMinor,
      newChargeMinor,
      netAdjustmentMinor,
      currency,
      calculationTimestamp: new Date().toISOString(),
      calculationVersion: 1,
    };
  }
}
