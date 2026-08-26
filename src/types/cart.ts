import { Product } from './product';

export interface CartItem {
  id: string; // unique item composite key (productId + color + size)
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CouponDiscount {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  description: string;
}

export interface CartSummary {
  subtotal: number;
  discountTotal: number;
  couponCode?: string;
  shippingFee: number;
  freeShippingThreshold: number;
  amountAwayFromFreeShipping: number;
  estimatedTax: number;
  grandTotal: number;
  totalItemCount: number;
}
