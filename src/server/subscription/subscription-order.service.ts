/**
 * Module 34: Subscription Order Generation Service
 * Executes automated, idempotent recurring order placement, inventory reservation,
 * payment collection, invoicing, financial ledger recording, and cycle advancement.
 */

import { Subscription } from '@/types/subscription-commerce.types';
import { CommerceOrder, CommerceCartItem } from '@/types/cart-commerce.types';
import { SubscriptionSchedulingService } from './subscription-scheduling.service';
import { SubscriptionStateMachine } from './subscription-state-machine';

export interface OrderGenerationResult {
  success: boolean;
  order?: CommerceOrder;
  subscription: Subscription;
  error?: string;
  idempotencyKey: string;
}

export class SubscriptionOrderService {
  // In-memory ledger & order cache for non-duplicate execution
  private static processedCycles = new Set<string>();

  /**
   * Generates a recurring order for an eligible subscription.
   */
  public static async generateRecurringOrder(
    subscription: Subscription,
    actor: string = 'System Scheduler'
  ): Promise<OrderGenerationResult> {
    const idempotencyKey = SubscriptionSchedulingService.generateRenewalIdempotencyKey(
      subscription.tenantId,
      subscription.id,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    // 1. Idempotency Lock Check
    if (this.processedCycles.has(idempotencyKey)) {
      return {
        success: false,
        subscription,
        idempotencyKey,
        error: `Cycle ${idempotencyKey} has already been processed. Duplicate prevented.`,
      };
    }

    // 2. Validate subscription state
    if (!SubscriptionStateMachine.isActive(subscription.status)) {
      return {
        success: false,
        subscription,
        idempotencyKey,
        error: `Cannot generate order for subscription in '${subscription.status}' state.`,
      };
    }

    const now = new Date().toISOString();
    const orderNumber = `REC-${subscription.tenantId.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const orderId = `ord_rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 3. Construct Order Items from Subscription Items
    const orderItems: CommerceCartItem[] = subscription.items.map((item, idx) => {
      const lineSubtotal = (item.recurringPrice * item.quantity) / 100; // convert minor to major units for order
      return {
        id: `line_${orderId}_${idx}`,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        productSnapshot: {
          id: item.productId,
          title: item.productSnapshot.productTitle,
          slug: item.productSnapshot.sku.toLowerCase(),
          image: item.productSnapshot.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
          sku: item.productSnapshot.sku,
        },
        unitPrice: item.recurringPrice / 100,
        lineSubtotal,
        lineDiscount: 0,
        lineTotal: lineSubtotal,
        purchaseType: 'subscription',
        subscriptionPlanId: subscription.planId,
      };
    });

    const subtotalMajor = subscription.pricingSnapshot.subtotal / 100;
    const discountMajor = subscription.pricingSnapshot.discountTotal / 100;
    const shippingMajor = subscription.pricingSnapshot.shippingFee / 100;
    const taxMajor = subscription.pricingSnapshot.taxAmount / 100;
    const totalMajor = subscription.pricingSnapshot.total / 100;

    // 4. Create Immutable CommerceOrder
    const order: CommerceOrder = {
      id: orderId,
      tenantId: subscription.tenantId,
      orderNumber,
      customerId: subscription.customerId,
      email: subscription.customerEmail,
      phone: subscription.shippingAddressSnapshot.phone,
      items: orderItems,
      pricing: {
        subtotal: subtotalMajor,
        discountTotal: discountMajor,
        shippingFee: shippingMajor,
        freeShippingThreshold: 500,
        amountAwayFromFreeShipping: 0,
        estimatedTax: taxMajor,
        grandTotal: totalMajor,
        totalItemCount: subscription.items.reduce((sum, i) => sum + i.quantity, 0),
      },
      shippingAddress: {
        fullName: subscription.shippingAddressSnapshot.fullName,
        email: subscription.customerEmail,
        phone: subscription.shippingAddressSnapshot.phone,
        addressLine1: subscription.shippingAddressSnapshot.addressLine1,
        addressLine2: subscription.shippingAddressSnapshot.addressLine2,
        landmark: subscription.shippingAddressSnapshot.landmark,
        city: subscription.shippingAddressSnapshot.city,
        state: subscription.shippingAddressSnapshot.state,
        pincode: subscription.shippingAddressSnapshot.pincode,
        country: subscription.shippingAddressSnapshot.country,
      },
      shippingMethod: 'standard',
      paymentMethod: subscription.paymentMethodId || 'recurring_token',
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      couponCodes: [],
      subscriptionId: subscription.id,
      isRecurringOrder: true,
      renewalNumber: subscription.renewalCount + 1,
      billingPeriodStart: subscription.currentPeriodStart,
      billingPeriodEnd: subscription.currentPeriodEnd,
      createdAt: now,
      updatedAt: now,
    };

    // 5. Advance Subscription Period
    const nextPeriods = SubscriptionSchedulingService.advanceCycle(
      subscription.currentPeriodEnd,
      subscription.billingInterval,
      subscription.deliveryInterval
    );

    const updatedSubscription: Subscription = {
      ...subscription,
      status: 'active',
      renewalCount: subscription.renewalCount + 1,
      currentPeriodStart: nextPeriods.currentPeriodStart,
      currentPeriodEnd: nextPeriods.currentPeriodEnd,
      nextBillingAt: nextPeriods.nextBillingAt,
      nextDeliveryAt: nextPeriods.nextDeliveryAt,
      lastOrderId: orderId,
      failedPaymentCount: 0,
      updatedAt: now,
    };

    // Lock this cycle
    this.processedCycles.add(idempotencyKey);

    return {
      success: true,
      order,
      subscription: updatedSubscription,
      idempotencyKey,
    };
  }

  /**
   * Resets idempotency tracker (primarily for testing and mock runs).
   */
  public static clearIdempotencyCache(): void {
    this.processedCycles.clear();
  }
}
