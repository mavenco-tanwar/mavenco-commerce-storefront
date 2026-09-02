export interface ProductSnapshot {
  id: string;
  title: string;
  slug: string;
  image: string;
  sku: string;
  category?: string;
}

export interface VariantSnapshot {
  id: string;
  sku: string;
  name: string;
  options: Record<string, string>; // e.g. { color: 'Rose', size: 'M' }
}

export interface CommerceCartItem {
  id: string; // unique item composite key (productId + variantId / options)
  productId: string;
  variantId?: string;
  quantity: number;
  productSnapshot: ProductSnapshot;
  variantSnapshot?: VariantSnapshot;
  unitPrice: number;
  compareAtPrice?: number;
  lineSubtotal: number;
  lineDiscount: number;
  lineTotal: number;
}

export interface CartPricing {
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

export type CartStatus = 'ACTIVE' | 'CHECKOUT' | 'CONVERTED' | 'ABANDONED' | 'EXPIRED';

export interface CommerceCart {
  _id?: string;
  id: string;
  tenantId: string;
  sessionId: string;
  customerId?: string;
  status: CartStatus;
  currency: string;
  items: CommerceCartItem[];
  couponCodes: string[];
  pricing: CartPricing;
  notes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddressData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface CheckoutSessionData {
  _id?: string;
  id: string;
  tenantId: string;
  cartId: string;
  customerId?: string;
  email?: string;
  phone?: string;
  shippingAddress?: ShippingAddressData;
  billingAddress?: ShippingAddressData;
  billingSameAsShipping?: boolean;
  shippingMethod: 'standard' | 'express' | 'free_shipping';
  paymentMethod: 'cod' | 'upi' | 'card' | 'razorpay' | 'stripe';
  pricingSnapshot: CartPricing;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommerceOrder {
  _id?: string;
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId?: string;
  email: string;
  phone: string;
  items: CommerceCartItem[];
  pricing: CartPricing;
  shippingAddress: ShippingAddressData;
  billingAddress?: ShippingAddressData;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  couponCodes: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MiniCartConfig {
  enabled: boolean;
  autoOpenOnAddToCart: boolean;
  drawerPosition: 'right' | 'left';
  widthPx: number; // e.g. 420
  showFreeShippingBar: boolean;
  freeShippingThreshold: number;
  freeShippingMessage: string;
  showCouponInput: boolean;
  showCrossSellRecommendations: boolean;
  crossSellSource: 'trending' | 'related' | 'recent';
  viewCartButtonText: string;
  checkoutButtonText: string;
}

export interface CartPageConfig {
  layout: '2-column' | 'single-column';
  stickyMobileSummary: boolean;
  showShippingEstimator: boolean;
  showCouponInput: boolean;
  showTrustBadges: boolean;
  showRecommendations: boolean;
  recommendationsTitle: string;
}

export interface StoreCartSettings {
  id: string;
  tenantSlug: string;
  miniCart: MiniCartConfig;
  cartPage: CartPageConfig;
  updatedAt: string;
}
