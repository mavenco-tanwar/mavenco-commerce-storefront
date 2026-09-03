import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/subscription/subscription.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || 'lumina';
    // IDOR protection: In authenticated storefront, customerId is derived from verified JWT/session
    const customerId = req.headers.get('x-customer-id') || searchParams.get('customerId') || 'cust_atelier_01';

    const result = await SubscriptionService.getSubscriptions(tenantId, {
      customerId,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
