import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/server/commerce/cart.service';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/cart/items
 * Body: { tenant, sessionId, customerId, productId, color, size, quantity }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      sessionId = 'guest_session',
      customerId,
      productId,
      color,
      size,
      quantity = 1,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const updatedCart = await CartService.addItem(
      tenant,
      sessionId,
      customerId,
      productId,
      color || 'Standard',
      size || 'One Size',
      quantity
    );

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: 'Item added to cart',
    });
  } catch (error: any) {
    console.error('Error in POST /api/v1/cart/items:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/cart/items
 * Body: { tenant, sessionId, customerId, itemId, quantity }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      sessionId = 'guest_session',
      customerId,
      itemId,
      quantity,
    } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const updatedCart = await CartService.updateQuantity(
      tenant,
      sessionId,
      customerId,
      itemId,
      quantity
    );

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: 'Cart updated',
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/v1/cart/items:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/cart/items
 * Query/Body: { tenant, sessionId, customerId, itemId }
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const sessionId = searchParams.get('sessionId') || 'guest_session';
    const customerId = searchParams.get('customerId') || undefined;
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const updatedCart = await CartService.removeItem(
      tenant,
      sessionId,
      customerId,
      itemId
    );

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: 'Item removed from cart',
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/v1/cart/items:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove item' },
      { status: 500 }
    );
  }
}
