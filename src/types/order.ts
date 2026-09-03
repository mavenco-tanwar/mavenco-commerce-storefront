import { CartItem } from './cart';

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentMethod;
  transactionId?: string;
  upiApp?: string;
  cardLast4?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  trackingSteps: TrackingStep[];
  trackingNumber?: string;
  courierPartner?: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  estimatedDeliveryDate: string;
  subscriptionId?: string;
  subscriptionOrderSequence?: number;
  isRecurringOrder?: boolean;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  renewalNumber?: number;
}

export interface CreateOrderParams {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  upiApp?: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}
