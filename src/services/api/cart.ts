import { apiClient } from './client';
import { CartItem, CartSummary } from '@/types/cart';

export class CartApiService {
  private static FREE_SHIPPING_THRESHOLD = 999;
  private static STANDARD_SHIPPING_FEE = 99;

  /**
   * Validates a discount coupon code directly against the CMS marketing engine.
   */
  public static async validateCoupon(
    code: string,
    subtotal: number
  ): Promise<{ data: { valid: boolean; discountAmount: number; message: string; coupon?: { code: string; discountType: string; discountValue: number } } }> {
    try {
      const res = await apiClient.post<{
        valid: boolean;
        code: string;
        discountType: string;
        discountValue: number;
        discountAmount: number;
      }>('/api/v1/marketing/coupons/validate', {
        code: code.trim().toUpperCase(),
        subtotal,
      });

      if (res.data?.valid) {
        return {
          data: {
            valid: true,
            discountAmount: res.data.discountAmount || 0,
            message: `Coupon ${res.data.code} applied successfully!`,
            coupon: {
              code: res.data.code,
              discountType: res.data.discountType,
              discountValue: res.data.discountValue,
            },
          },
        };
      }
    } catch (err: any) {
      return {
        data: {
          valid: false,
          discountAmount: 0,
          message: err.message || 'Invalid or expired coupon code.',
        },
      };
    }

    return {
      data: {
        valid: false,
        discountAmount: 0,
        message: 'Invalid coupon code.',
      },
    };
  }

  /**
   * Calculates comprehensive cart summary.
   */
  public static calculateSummary(
    items: CartItem[],
    couponCode: string = '',
    shippingFeeOverride?: number
  ): CartSummary {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    let discountTotal = 0;
    const cleanCoupon = couponCode.trim().toUpperCase();

    if (cleanCoupon === 'JQTRENDS10') {
      discountTotal = Math.round(subtotal * 0.1);
    } else if (cleanCoupon === 'WELCOME200' && subtotal >= 999) {
      discountTotal = 200;
    } else if (cleanCoupon === 'FESTIVE500' && subtotal >= 2999) {
      discountTotal = 500;
    }

    const shippingFee =
      shippingFeeOverride !== undefined
        ? shippingFeeOverride
        : subtotal >= this.FREE_SHIPPING_THRESHOLD || subtotal === 0
        ? 0
        : this.STANDARD_SHIPPING_FEE;

    const amountAwayFromFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
    const estimatedTax = 0; // Tax is inclusive in Indian retail pricing
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingFee + estimatedTax);

    return {
      subtotal,
      discountTotal,
      couponCode: cleanCoupon || undefined,
      shippingFee,
      freeShippingThreshold: this.FREE_SHIPPING_THRESHOLD,
      amountAwayFromFreeShipping,
      estimatedTax,
      grandTotal,
      totalItemCount,
    };
  }
}
