/**
 * Module 34: Subscription Dunning Service
 * Handles payment retries, exponential/custom backoff schedules,
 * grace periods, and escalation to suspended or cancelled states.
 */

import { DunningPolicy, DunningAttempt, Subscription } from '@/types/subscription-commerce.types';

export class SubscriptionDunningService {
  public static readonly DEFAULT_POLICY: DunningPolicy = {
    id: 'dunning_default',
    tenantId: 'default',
    name: 'Standard E-Commerce Dunning Policy',
    maxRetryAttempts: 4,
    retryIntervalDays: [0, 2, 4, 7], // attempt 1: now, attempt 2: +2d, attempt 3: +4d, attempt 4: +7d
    gracePeriodDays: 10,
    finalAction: 'suspended',
    notificationSchedule: true,
  };

  /**
   * Computes the next retry timestamp based on current failed count.
   */
  public static calculateNextRetry(failedCount: number, policy: DunningPolicy = this.DEFAULT_POLICY): string | null {
    if (failedCount >= policy.maxRetryAttempts) {
      return null; // Exhausted retries
    }

    const intervalDays = policy.retryIntervalDays[failedCount] ?? 3;
    const nextDate = new Date();
    nextDate.setUTCDate(nextDate.getUTCDate() + intervalDays);
    return nextDate.toISOString();
  }

  /**
   * Evaluates whether a subscription has exceeded its grace period.
   */
  public static isGracePeriodExceeded(
    pastDueSince: string | Date,
    policy: DunningPolicy = this.DEFAULT_POLICY
  ): boolean {
    const pastDueMs = new Date(pastDueSince).getTime();
    const nowMs = Date.now();
    const graceMs = policy.gracePeriodDays * 24 * 60 * 60 * 1000;
    return nowMs - pastDueMs > graceMs;
  }

  /**
   * Evaluates the next state for a subscription following a failed payment.
   */
  public static evaluateNextStateOnFailure(
    subscription: Subscription,
    policy: DunningPolicy = this.DEFAULT_POLICY
  ): {
    nextStatus: 'past_due' | 'payment_failed' | 'suspended' | 'cancelled';
    nextRetryAt: string | null;
    actionMessage: string;
  } {
    const newFailCount = (subscription.failedPaymentCount || 0) + 1;

    if (newFailCount >= policy.maxRetryAttempts) {
      const finalAction = policy.finalAction === 'cancel' ? 'cancelled' : 'suspended';
      return {
        nextStatus: finalAction,
        nextRetryAt: null,
        actionMessage: `Exhausted ${policy.maxRetryAttempts} retry attempts. Escalated to ${finalAction}.`,
      };
    }

    const nextRetryAt = this.calculateNextRetry(newFailCount, policy);
    return {
      nextStatus: 'past_due',
      nextRetryAt,
      actionMessage: `Payment failed (attempt ${newFailCount}/${policy.maxRetryAttempts}). Next retry scheduled for ${nextRetryAt}.`,
    };
  }
}
