import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_RECONCILIATION = [
  {
    id: 'rec_8839201',
    tenantId: 'lumina',
    provider: 'razorpay',
    providerTransactionId: 'pay_rzp_8839201',
    internalPaymentId: 'pay_100234',
    orderId: 'ord_100234',
    amountMinor: 50000,
    currency: 'USD',
    matchStatus: 'matched',
    reconciledAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'rec_7749202',
    tenantId: 'lumina',
    provider: 'razorpay',
    providerTransactionId: 'pay_rzp_7749202',
    internalPaymentId: 'pay_100189',
    orderId: 'ord_100189',
    amountMinor: 15000,
    currency: 'USD',
    matchStatus: 'matched',
    reconciledAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let reconciliation = DEFAULT_RECONCILIATION;

    if (db) {
      const collection = db.collection('payment_reconciliation');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_RECONCILIATION.map((r) => ({ ...r, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ reconciledAt: -1 }).toArray();
      reconciliation = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      reconciliation = reconciliation.filter((r) => r.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: reconciliation,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
