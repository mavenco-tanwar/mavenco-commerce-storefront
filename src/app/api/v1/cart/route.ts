import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/commerce/cart.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/cart?tenant=slug&sessionId=id&customerId=id
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const sessionId = searchParams.get('sessionId') || 'guest_session';
    const customerId = searchParams.get('customerId') || undefined;

    const cart = await CartService.getOrCreateCart(tenant, sessionId, customerId);

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    console.error('Error in GET /api/v1/cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve cart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/cart?tenant=slug&sessionId=id
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const sessionId = searchParams.get('sessionId') || 'guest_session';
    const customerId = searchParams.get('customerId') || undefined;

    const cart = await CartService.clearCart(tenant, sessionId, customerId);

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/v1/cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
