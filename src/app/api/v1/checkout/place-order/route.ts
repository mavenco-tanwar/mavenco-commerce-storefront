import { NextRequest, NextResponse } from 'next/server';
import { CheckoutService } from '@/server/commerce/checkout.service';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/checkout/place-order
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      sessionId = 'guest_session',
      customerId,
      shippingAddress,
      billingAddress,
      shippingMethod = 'standard',
      paymentMethod = 'cod',
      notes,
    } = body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
      return NextResponse.json(
        { success: false, error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    const order = await CheckoutService.placeOrder({
      tenantId: tenant,
      sessionId,
      customerId,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      notes,
    });

    return NextResponse.json({
      success: true,
      data: order,
      orderNumber: order.orderNumber,
      message: 'Order placed successfully!',
    });
  } catch (error: any) {
    console.error('Error in POST /api/v1/checkout/place-order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
