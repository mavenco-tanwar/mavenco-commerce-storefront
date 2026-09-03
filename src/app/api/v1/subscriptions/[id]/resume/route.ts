import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/subscription/subscription.service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const tenantId = req.headers.get('x-tenant-id') || body.tenantId || 'lumina';

    const sub = await SubscriptionService.resumeSubscription(tenantId, id);
    return NextResponse.json({ success: true, data: sub, message: 'Subscription resumed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
