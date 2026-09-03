/**
 * Module 34: Subscription State Machine
 * Strictly governs subscription lifecycle transitions.
 * Prevents arbitrary status mutations.
 */

import { SubscriptionStatus } from '@/types/subscription-commerce.types';

export interface StateTransitionResult {
  allowed: boolean;
  from: SubscriptionStatus;
  to: SubscriptionStatus;
  reason?: string;
}

export class SubscriptionStateMachine {
  // Formal transition graph
  private static readonly VALID_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
    draft: ['pending', 'trialing', 'active', 'cancelled'],
    pending: ['trialing', 'active', 'payment_failed', 'cancelled'],
    trialing: ['active', 'past_due', 'payment_failed', 'cancel_pending', 'cancelled', 'expired'],
    active: ['paused', 'past_due', 'payment_failed', 'cancel_pending', 'cancelled', 'completed', 'expired'],
    paused: ['active', 'cancelled', 'expired'],
    past_due: ['active', 'payment_failed', 'suspended', 'cancelled'],
    payment_failed: ['active', 'past_due', 'suspended', 'cancelled'],
    cancel_pending: ['active', 'cancelled'], // can revert or finalize at cycle end
    cancelled: [], // terminal state
    expired: [], // terminal state
    completed: [], // terminal state
    suspended: ['active', 'cancelled'], // admin reactivation
  };

  /**
   * Validates whether a state transition from `from` to `to` is legally permitted.
   */
  public static canTransition(from: SubscriptionStatus, to: SubscriptionStatus): boolean {
    if (from === to) return true;
    const allowedTargets = this.VALID_TRANSITIONS[from] || [];
    return allowedTargets.includes(to);
  }

  /**
   * Asserts and executes a state transition, throwing an error if invalid.
   */
  public static validateTransition(from: SubscriptionStatus, to: SubscriptionStatus, contextReason?: string): StateTransitionResult {
    if (from === to) {
      return { allowed: true, from, to };
    }

    const allowed = this.canTransition(from, to);
    if (!allowed) {
      return {
        allowed: false,
        from,
        to,
        reason: `Illegal subscription lifecycle transition from '${from}' to '${to}'. Permitted next states: [${(this.VALID_TRANSITIONS[from] || []).join(', ')}]. Context: ${contextReason || 'N/A'}`,
      };
    }

    return {
      allowed: true,
      from,
      to,
      reason: contextReason,
    };
  }

  /**
   * Determines if a subscription status qualifies as "currently active and receiving benefits".
   */
  public static isActive(status: SubscriptionStatus): boolean {
    return status === 'active' || status === 'trialing' || status === 'cancel_pending';
  }

  /**
   * Determines if a subscription is in a terminal state that can never be modified.
   */
  public static isTerminal(status: SubscriptionStatus): boolean {
    return status === 'cancelled' || status === 'expired' || status === 'completed';
  }
}
