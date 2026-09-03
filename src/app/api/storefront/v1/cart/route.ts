import { NextRequest, NextResponse } from 'next/server';
import { ExperienceAPIService } from '@/server/experience/experience-api.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-channel-code, x-market-code, x-currency, x-locale, x-session-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const ctx = ExperienceAPIService.resolveContext(req);
    const url = new URL(req.url);
    const cartId = url.searchParams.get('cartId') || undefined;

    const cart = ExperienceAPIService.getOrCreateCart(ctx, cartId);
    return NextResponse.json({ success: true, data: cart }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = ExperienceAPIService.resolveContext(req);
    const body = await req.json();
    const { cartId, productId, variantId, quantity = 1, selectedOptions } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400, headers: corsHeaders() });
    }

    const updatedCart = ExperienceAPIService.addItemToCart(ctx, cartId, {
      productId,
      variantId,
      quantity,
      selectedOptions,
    });

    return NextResponse.json({ success: true, data: updatedCart }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const ctx = ExperienceAPIService.resolveContext(req);
    const body = await req.json();
    const { cartId, itemId, quantity, couponCode } = body;

    if (!cartId) {
      return NextResponse.json({ success: false, error: 'cartId is required' }, { status: 400, headers: corsHeaders() });
    }

    let updatedCart;
    if (couponCode) {
      updatedCart = ExperienceAPIService.applyCoupon(ctx, cartId, couponCode);
    } else if (itemId !== undefined && quantity !== undefined) {
      updatedCart = ExperienceAPIService.updateCartItem(ctx, cartId, itemId, quantity);
    } else {
      return NextResponse.json({ success: false, error: 'Action parameters missing' }, { status: 400, headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: updatedCart }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
