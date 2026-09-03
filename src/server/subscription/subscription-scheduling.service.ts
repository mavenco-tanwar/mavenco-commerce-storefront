/**
 * Module 34: Subscription Scheduling Service
 * Calculates timezone-aware billing periods, renewal timestamps, independent
 * delivery schedules, trial durations, and dunning retry intervals.
 */

import { BillingIntervalConfig, DeliveryIntervalConfig } from '@/types/subscription-commerce.types';

export class SubscriptionSchedulingService {
  /**
   * Calculates the next date based on interval unit and count.
   */
  public static addInterval(
    fromDate: Date | string,
    interval: BillingIntervalConfig | DeliveryIntervalConfig
  ): Date {
    const d = new Date(fromDate);
    const count = Math.max(1, interval.count || 1);

    switch (interval.unit) {
      case 'day':
        d.setUTCDate(d.getUTCDate() + count);
        break;
      case 'week':
        d.setUTCDate(d.getUTCDate() + count * 7);
        break;
      case 'month':
        d.setUTCMonth(d.getUTCMonth() + count);
        break;
      case 'year':
        d.setUTCFullYear(d.getUTCFullYear() + count);
        break;
      default:
        d.setUTCMonth(d.getUTCMonth() + 1);
    }
    return d;
  }

  /**
   * Computes the initial period boundaries for a new subscription.
   */
  public static calculateInitialPeriods(params: {
    startDate?: Date | string;
    billingInterval: BillingIntervalConfig;
    deliveryInterval: DeliveryIntervalConfig;
    trialDurationDays?: number;
  }): {
    startsAt: string;
    trialStartsAt?: string;
    trialEndsAt?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    nextBillingAt: string;
    nextDeliveryAt: string;
  } {
    const baseDate = params.startDate ? new Date(params.startDate) : new Date();
    const startsAt = baseDate.toISOString();

    let trialStartsAt: string | undefined;
    let trialEndsAt: string | undefined;
    let periodStart = new Date(baseDate);

    if (params.trialDurationDays && params.trialDurationDays > 0) {
      trialStartsAt = startsAt;
      const tEnd = new Date(baseDate);
      tEnd.setUTCDate(tEnd.getUTCDate() + params.trialDurationDays);
      trialEndsAt = tEnd.toISOString();
      // Period start aligns with trial end
      periodStart = new Date(tEnd);
    }

    const currentPeriodStart = periodStart.toISOString();
    const periodEnd = this.addInterval(periodStart, params.billingInterval);
    const currentPeriodEnd = periodEnd.toISOString();

    // Independent delivery schedule
    const firstDelivery = this.addInterval(baseDate, params.deliveryInterval);

    return {
      startsAt,
      trialStartsAt,
      trialEndsAt,
      currentPeriodStart,
      currentPeriodEnd,
      nextBillingAt: trialEndsAt || currentPeriodEnd,
      nextDeliveryAt: firstDelivery.toISOString(),
    };
  }

  /**
   * Advances periods upon successful renewal cycle.
   */
  public static advanceCycle(
    currentPeriodEnd: string,
    billingInterval: BillingIntervalConfig,
    deliveryInterval: DeliveryIntervalConfig
  ): {
    currentPeriodStart: string;
    currentPeriodEnd: string;
    nextBillingAt: string;
    nextDeliveryAt: string;
  } {
    const newStart = new Date(currentPeriodEnd);
    const newEnd = this.addInterval(newStart, billingInterval);
    const nextDelivery = this.addInterval(new Date(), deliveryInterval);

    return {
      currentPeriodStart: newStart.toISOString(),
      currentPeriodEnd: newEnd.toISOString(),
      nextBillingAt: newEnd.toISOString(),
      nextDeliveryAt: nextDelivery.toISOString(),
    };
  }

  /**
   * Computes next delivery timestamp when a customer skips the next shipment.
   */
  public static calculateNextDeliveryOnSkip(
    currentNextDelivery: string | undefined,
    deliveryInterval: DeliveryIntervalConfig
  ): string {
    const base = currentNextDelivery ? new Date(currentNextDelivery) : new Date();
    return this.addInterval(base, deliveryInterval).toISOString();
  }

  /**
   * Generates a deterministic idempotency key for a specific renewal cycle.
   */
  public static generateRenewalIdempotencyKey(
    tenantId: string,
    subscriptionId: string,
    periodStart: string,
    periodEnd: string
  ): string {
    return `${tenantId}:${subscriptionId}:${periodStart.slice(0, 10)}:${periodEnd.slice(0, 10)}`;
  }

  /**
   * Evaluates if introductory pricing applies for a given renewal count.
   */
  public static isIntroductoryPricingApplicable(
    renewalCount: number,
    introductoryPricingEnabled: boolean,
    introductoryPeriods?: number
  ): boolean {
    if (!introductoryPricingEnabled || !introductoryPeriods) return false;
    // renewalCount = 0 (first purchase), 1 (first renewal), etc.
    return renewalCount < introductoryPeriods;
  }
}
