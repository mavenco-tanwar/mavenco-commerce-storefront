import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/commerce/cart.service';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/cart/coupon
 * Body: { tenant, sessionId, customerId, code }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      sessionId = 'guest_session',
      customerId,
      code,
    } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const updatedCart = await CartService.applyCoupon(
      tenant,
      sessionId,
      customerId,
      code
    );

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: `Coupon ${code} applied successfully!`,
    });
  } catch (error: any) {
    console.error('Error in POST /api/v1/cart/coupon:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}
