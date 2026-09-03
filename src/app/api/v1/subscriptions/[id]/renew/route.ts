import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/subscription/subscription.service';
import { SubscriptionOrderService } from '@/server/subscription/subscription-order.service';

export async function POST(
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

    const result = await SubscriptionOrderService.generateRecurringOrder(sub, 'Admin Triggered Renewal');

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        order: result.order,
        subscription: result.subscription,
        idempotencyKey: result.idempotencyKey,
      },
      message: 'Recurring order generated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
