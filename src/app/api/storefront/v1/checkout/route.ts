import { NextRequest, NextResponse } from 'next/server';
import { ExperienceAPIService } from '@/server/experience/experience-api.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-channel-code, x-market-code, x-currency, x-locale, x-session-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const ctx = ExperienceAPIService.resolveContext(req);
    const body = await req.json();
    const { action, cartId, sessionId, contact, shippingAddress, billingAddress, shippingMethodId, provider } = body;

    switch (action) {
      case 'create_session': {
        if (!cartId) return NextResponse.json({ success: false, error: 'cartId is required' }, { status: 400, headers: corsHeaders() });
        const session = ExperienceAPIService.createCheckoutSession(ctx, cartId);
        return NextResponse.json({ success: true, data: session }, { headers: corsHeaders() });
      }
      case 'update_contact': {
        if (!sessionId || !contact) return NextResponse.json({ success: false, error: 'sessionId and contact are required' }, { status: 400, headers: corsHeaders() });
        const session = ExperienceAPIService.updateCheckoutContact(ctx, sessionId, contact);
        return NextResponse.json({ success: true, data: session }, { headers: corsHeaders() });
      }
      case 'update_address': {
        if (!sessionId || !shippingAddress) return NextResponse.json({ success: false, error: 'sessionId and shippingAddress are required' }, { status: 400, headers: corsHeaders() });
        const session = ExperienceAPIService.updateCheckoutAddress(ctx, sessionId, shippingAddress, billingAddress);
        return NextResponse.json({ success: true, data: session }, { headers: corsHeaders() });
      }
      case 'select_shipping': {
        if (!sessionId || !shippingMethodId) return NextResponse.json({ success: false, error: 'sessionId and shippingMethodId are required' }, { status: 400, headers: corsHeaders() });
        const session = ExperienceAPIService.selectShippingMethod(ctx, sessionId, shippingMethodId);
        return NextResponse.json({ success: true, data: session }, { headers: corsHeaders() });
      }
      case 'create_payment_session': {
        if (!sessionId) return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400, headers: corsHeaders() });
        const session = ExperienceAPIService.createPaymentSession(ctx, sessionId, provider);
        return NextResponse.json({ success: true, data: session }, { headers: corsHeaders() });
      }
      case 'complete_order': {
        if (!sessionId) return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400, headers: corsHeaders() });
        const result = ExperienceAPIService.completeCheckout(ctx, sessionId);
        return NextResponse.json({ success: true, data: result }, { headers: corsHeaders() });
      }
      default:
        return NextResponse.json({ success: false, error: `Unsupported checkout action '${action}'` }, { status: 400, headers: corsHeaders() });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
