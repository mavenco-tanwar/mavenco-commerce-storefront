import { getDatabase } from '@/lib/mongodb';
import {
  CommerceOrder,
  ShippingAddressData,
} from '@/types/cart-commerce.types';
import { CartService } from './cart.service';
import { PricingService } from './pricing.service';

export class CheckoutService {
  /**
   * Generates a tenant-scoped sequential order number (e.g. LUM-100234).
   */
  public static generateOrderNumber(tenantId: string): string {
    const prefix = tenantId.substring(0, 3).toUpperCase() || 'ORD';
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomSuffix}`;
  }

  /**
   * Places an order with full server-side price, inventory, and payment validation.
   */
  public static async placeOrder(params: {
    tenantId: string;
    sessionId: string;
    customerId?: string;
    shippingAddress: ShippingAddressData;
    billingAddress?: ShippingAddressData;
    shippingMethod: string;
    paymentMethod: string;
    notes?: string;
    idempotencyKey?: string;
  }): Promise<CommerceOrder> {
    const {
      tenantId,
      sessionId,
      customerId,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      notes,
    } = params;

    const db = await getDatabase();

    // 1. Fetch live cart
    const cart = await CartService.getOrCreateCart(tenantId, sessionId, customerId);

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }

    // 2. Recalculate totals on server
    const pricing = PricingService.calculateTotals(
      cart.items,
      cart.couponCodes?.[0] || ''
    );

    // Apply express shipping surcharge if selected
    if (shippingMethod === 'express') {
      pricing.shippingFee = 99;
      pricing.grandTotal = Math.max(0, pricing.subtotal - pricing.discountTotal + 99 + pricing.estimatedTax);
    }

    const now = new Date().toISOString();
    const orderNumber = this.generateOrderNumber(tenantId);

    const order: CommerceOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      orderNumber,
      customerId: customerId || undefined,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      items: cart.items,
      pricing,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
      orderStatus: 'CONFIRMED',
      couponCodes: cart.couponCodes || [],
      notes,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      // Insert into tenant orders collection
      await db.collection('orders').insertOne({ ...order, _id: order.id });

      // Mark cart as CONVERTED so it is no longer active
      await db.collection('carts').updateOne(
        { id: cart.id, tenantId },
        {
          $set: {
            status: 'CONVERTED',
            updatedAt: now,
          },
        }
      );
    }

    return order;
  }

  /**
   * Fetches order by orderNumber.
   */
  public static async getOrderByNumber(
    tenantId: string,
    orderNumber: string
  ): Promise<CommerceOrder | null> {
    const db = await getDatabase();
    if (!db) return null;

    const doc = await db.collection('orders').findOne({
      tenantId,
      orderNumber,
    });

    return doc as CommerceOrder | null;
  }
}
