import { Order, OrderStatus, TrackingStep, ShippingAddress, PaymentDetails } from '@/types/order';
import { CartItem } from '@/types/cart';
import { ApiClient, ApiResponse } from './api';

const mockOrdersStorage: Order[] = [
  {
    id: 'ord-10948',
    orderNumber: 'JQT-2026-10948',
    createdAt: '2026-08-25T14:20:00Z',
    status: 'shipped',
    items: [
      {
        id: 'prod-01-Blush-Pink-S',
        productId: 'prod-01',
        product: {
          id: 'prod-01',
          name: 'Blush Floral Tiered Midi Dress',
          slug: 'blush-floral-tiered-midi-dress',
          sku: 'JQT-WMN-DRS-001',
          department: 'women',
          category: 'dresses',
          categoryName: 'Dresses',
          price: 1499,
          compareAtPrice: 2199,
          discountPercent: 32,
          shortDescription: '',
          description: '',
          features: [],
          fabric: 'Georgette',
          careInstructions: [],
          images: [
            {
              url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
              alt: 'Blush Floral Tiered Midi Dress',
            },
          ],
          colors: [],
          sizes: [],
          rating: 4.8,
          reviewCount: 48,
          isFeatured: true,
          isNewArrival: false,
          isBestSeller: true,
          isSale: true,
          tags: [],
        },
        selectedColor: 'Blush Pink',
        selectedSize: 'S',
        quantity: 1,
        unitPrice: 1499,
        totalPrice: 1499,
      },
    ],
    shippingAddress: {
      fullName: 'Aarav Gupta',
      email: 'aarav.gupta@example.com',
      phone: '+91 98765 12345',
      addressLine1: 'Flat 402, Lotus Orchid, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    paymentDetails: {
      method: 'upi',
      upiApp: 'Google Pay',
      transactionId: 'UPI-98726348123',
      status: 'success',
    },
    trackingSteps: [
      { status: 'placed', label: 'Order Placed', description: 'Order received & confirmed', timestamp: '25 Aug 2026, 02:20 PM', isCompleted: true, isCurrent: false },
      { status: 'confirmed', label: 'Payment Verified', description: 'Paid via UPI Google Pay', timestamp: '25 Aug 2026, 02:21 PM', isCompleted: true, isCurrent: false },
      { status: 'packed', label: 'Packed & Inspected', description: 'Handcrafted with love at Studio', timestamp: '26 Aug 2026, 11:30 AM', isCompleted: true, isCurrent: false },
      { status: 'shipped', label: 'In Transit', description: 'Out for delivery via BlueDart', timestamp: '26 Aug 2026, 06:45 PM', isCompleted: true, isCurrent: true },
      { status: 'delivered', label: 'Delivered', description: 'Expected delivery by 28 Aug', isCompleted: false, isCurrent: false },
    ],
    trackingNumber: 'BLUEDART-84729104',
    courierPartner: 'BlueDart Express',
    subtotal: 1499,
    discount: 150,
    shippingFee: 0,
    tax: 0,
    total: 1349,
    estimatedDeliveryDate: '28 August 2026',
  },
];

export class OrderService {
  public static async getOrderById(orderId: string): Promise<ApiResponse<Order | null>> {
    const order = mockOrdersStorage.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
    return ApiClient.simulateRequest<Order | null>(order, 60);
  }

  public static async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return ApiClient.simulateRequest<Order[]>(mockOrdersStorage, 80);
  }

  public static async createOrder(orderPayload: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentDetails['method'];
    upiApp?: string;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
  }): Promise<ApiResponse<Order>> {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ord-${randomSuffix}`;
    const orderNumber = `JQT-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      items: orderPayload.items,
      shippingAddress: orderPayload.shippingAddress,
      paymentDetails: {
        method: orderPayload.paymentMethod,
        transactionId: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        upiApp: orderPayload.upiApp,
        status: 'success',
      },
      status: 'placed',
      trackingSteps: [
        { status: 'placed', label: 'Order Placed', description: 'Order successfully placed', timestamp: 'Just now', isCompleted: true, isCurrent: true },
        { status: 'confirmed', label: 'Order Confirmed', description: 'Sent to JQ Trends Studio', isCompleted: false, isCurrent: false },
        { status: 'packed', label: 'Packaging', description: 'Quality inspection & packaging', isCompleted: false, isCurrent: false },
        { status: 'shipped', label: 'Shipped', description: 'Dispatched with premium courier', isCompleted: false, isCurrent: false },
        { status: 'delivered', label: 'Delivered', description: 'Delivered to your doorstep', isCompleted: false, isCurrent: false },
      ],
      trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierPartner: 'BlueDart Express',
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount,
      shippingFee: orderPayload.shippingFee,
      tax: 0,
      total: orderPayload.total,
      estimatedDeliveryDate: 'Delivery in 2-4 business days',
    };

    mockOrdersStorage.unshift(newOrder);
    return ApiClient.simulateRequest<Order>(newOrder, 150);
  }
}
