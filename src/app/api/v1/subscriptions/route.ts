import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/subscription/subscription.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'lumina';
    const customerId = searchParams.get('customerId') || undefined;
    const status = (searchParams.get('status') as any) || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100;

    const result = await SubscriptionService.getSubscriptions(tenantId, {
      customerId,
      status,
      search,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      tenantId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = req.headers.get('x-tenant-id') || body.tenantId || 'lumina';

    const subscription = await SubscriptionService.createSubscription(tenantId, body);

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully.',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
