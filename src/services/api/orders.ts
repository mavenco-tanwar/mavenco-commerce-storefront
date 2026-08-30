import { apiClient } from './client';
import { mapCmsOrderToStorefrontOrder } from './adapters';
import { Order, CreateOrderParams } from '@/types/order';

export class OrderApiService {
  /**
   * Creates a new order in the CMS during checkout.
   */
  public static async createOrder(params: CreateOrderParams): Promise<{ data: Order }> {
    const cmsPayload = {
      email: params.shippingAddress.email,
      currency: 'INR',
      subtotal: params.subtotal,
      discountTotal: params.discount,
      shippingTotal: params.shippingFee,
      grandTotal: params.total,
      shippingAddress: params.shippingAddress,
      billingAddress: params.shippingAddress,
      items: params.items.map((it) => ({
        productId: it.product.id,
        title: it.product.name,
        slug: it.product.slug,
        sku: it.product.sku,
        price: it.unitPrice,
        quantity: it.quantity,
        total: it.totalPrice,
        imageUrl: it.product.images[0]?.url || '',
        options: {
          Size: it.selectedSize,
          Color: it.selectedColor,
        },
      })),
      payments: [
        {
          id: `pay_${Date.now()}`,
          provider: params.paymentMethod,
          amount: params.total,
          status: 'success',
          reference: params.upiApp ? `UPI-${params.upiApp}` : 'Direct Gateway',
        },
      ],
      appliedCoupons: [],
    };

    const res = await apiClient.post<any>('/api/v1/orders', cmsPayload);
    return { data: mapCmsOrderToStorefrontOrder(res.data) };
  }

  /**
   * Retrieves an order by its ID or order number.
   */
  public static async getOrderById(orderId: string): Promise<{ data: Order | null }> {
    try {
      const res = await apiClient.get<any>(`/api/v1/orders/${encodeURIComponent(orderId)}`);
      if (res.data) {
        return { data: mapCmsOrderToStorefrontOrder(res.data) };
      }
    } catch (err) {
      console.error(`[OrderApiService] Order not found: ${orderId}`, err);
    }
    return { data: null };
  }

  /**
   * Retrieves orders for the authenticated customer or email.
   */
  public static async getUserOrders(email?: string): Promise<{ data: Order[] }> {
    try {
      const endpoint = `/api/v1/customers/me/orders${email ? `?email=${encodeURIComponent(email)}` : ''}`;
      const res = await apiClient.get<any[]>(endpoint);
      const orders = (res.data || []).map((o) => mapCmsOrderToStorefrontOrder(o));
      return { data: orders };
    } catch (err) {
      console.warn('[OrderApiService] Failed to fetch customer orders from CMS:', err);
      return { data: [] };
    }
  }
}
