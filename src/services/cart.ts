import { CartItem, CartSummary, CouponDiscount } from '@/types/cart';
import { defaultStoreConfig } from '@/data/storeConfig';
import { ApiClient, ApiResponse } from './api';

export const activeCoupons: Record<string, CouponDiscount> = {
  'JQTRENDS10': {
    code: 'JQTRENDS10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    description: '10% Off on orders above ₹999',
  },
  'WELCOME200': {
    code: 'WELCOME200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1499,
    description: 'Flat ₹200 Off on your first order above ₹1,499',
  },
  'FESTIVE500': {
    code: 'FESTIVE500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2999,
    description: 'Flat ₹500 Off on orders above ₹2,999',
  },
};

export class CartService {
  public static calculateSummary(items: CartItem[], couponCode?: string): CartSummary {
    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const freeShippingThreshold = defaultStoreConfig.policies.freeShippingThreshold;

    let discountTotal = 0;
    let appliedCode = undefined;

    if (couponCode) {
      const coupon = activeCoupons[couponCode.toUpperCase().trim()];
      if (coupon && (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)) {
        appliedCode = coupon.code;
        if (coupon.discountType === 'percentage') {
          discountTotal = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discountTotal = coupon.discountValue;
        }
      }
    }

    const eligibleAmount = Math.max(0, subtotal - discountTotal);
    const shippingFee = eligibleAmount >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
    const amountAwayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const estimatedTax = 0; // Inclusive of GST in Indian retail standard
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingFee + estimatedTax);

    return {
      subtotal,
      discountTotal,
      couponCode: appliedCode,
      shippingFee,
      freeShippingThreshold,
      amountAwayFromFreeShipping,
      estimatedTax,
      grandTotal,
      totalItemCount,
    };
  }

  public static async validateCoupon(code: string, subtotal: number): Promise<ApiResponse<{ valid: boolean; coupon?: CouponDiscount; message: string }>> {
    const coupon = activeCoupons[code.toUpperCase().trim()];
    if (!coupon) {
      return ApiClient.simulateRequest({
        valid: false,
        message: 'Invalid coupon code. Try "JQTRENDS10" or "WELCOME200"',
      }, 50);
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return ApiClient.simulateRequest({
        valid: false,
        coupon,
        message: `Add ₹${coupon.minOrderAmount - subtotal} more to apply code ${coupon.code}`,
      }, 50);
    }

    return ApiClient.simulateRequest({
      valid: true,
      coupon,
      message: `Coupon ${coupon.code} applied successfully!`,
    }, 50);
  }
}
