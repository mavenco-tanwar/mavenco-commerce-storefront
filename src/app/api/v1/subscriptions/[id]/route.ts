import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/subscription/subscription.service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'lumina';

    const sub = await SubscriptionService.getSubscriptionById(tenantId, id);
    if (!sub) {
      return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: sub });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const tenantId = req.headers.get('x-tenant-id') || body.tenantId || 'lumina';

    let sub = await SubscriptionService.getSubscriptionById(tenantId, id);
    if (!sub) {
      return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 });
    }

    if (body.shippingAddressSnapshot) {
      sub = await SubscriptionService.updateAddress(tenantId, id, body.shippingAddressSnapshot);
    }

    if (body.quantityChange) {
      const { itemId, newQuantity } = body.quantityChange;
      sub = await SubscriptionService.changeQuantity(tenantId, id, itemId, newQuantity);
    }

    return NextResponse.json({
      success: true,
      data: sub,
      message: 'Subscription updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
