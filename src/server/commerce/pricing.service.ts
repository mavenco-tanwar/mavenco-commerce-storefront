import { CommerceCartItem, CartPricing } from '@/types/cart-commerce.types';

export class PricingService {
  private static DEFAULT_FREE_SHIPPING_THRESHOLD = 999;
  private static DEFAULT_STANDARD_SHIPPING_FEE = 99;

  /**
   * Recalculates line items and totals strictly on the server.
   */
  public static calculateTotals(
    items: CommerceCartItem[],
    couponCode: string = '',
    freeShippingThreshold: number = PricingService.DEFAULT_FREE_SHIPPING_THRESHOLD,
    standardShippingFee: number = PricingService.DEFAULT_STANDARD_SHIPPING_FEE
  ): CartPricing {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    let discountTotal = 0;
    const cleanCoupon = couponCode.trim().toUpperCase();

    if (cleanCoupon === 'JQTRENDS10' || cleanCoupon === 'LUMINA10') {
      discountTotal = Math.round(subtotal * 0.1);
    } else if (cleanCoupon === 'WELCOME200' && subtotal >= 999) {
      discountTotal = 200;
    } else if (cleanCoupon === 'FESTIVE500' && subtotal >= 2999) {
      discountTotal = 500;
    } else if (cleanCoupon === 'ATELIERVIP') {
      discountTotal = Math.round(subtotal * 0.15);
    }

    const shippingFee =
      subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : standardShippingFee;

    const amountAwayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const estimatedTax = 0; // Inclusive pricing standard
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingFee + estimatedTax);

    return {
      subtotal,
      discountTotal,
      couponCode: cleanCoupon || undefined,
      shippingFee,
      freeShippingThreshold,
      amountAwayFromFreeShipping,
      estimatedTax,
      grandTotal,
      totalItemCount,
    };
  }
}
