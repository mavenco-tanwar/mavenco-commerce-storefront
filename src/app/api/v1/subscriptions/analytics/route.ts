import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/subscription/subscription.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'lumina';

    const analytics = await SubscriptionService.getAnalytics(tenantId);
    return NextResponse.json({ success: true, data: analytics, tenantId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
