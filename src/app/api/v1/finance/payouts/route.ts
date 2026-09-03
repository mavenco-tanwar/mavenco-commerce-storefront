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

const DEFAULT_PAYOUTS = [
  {
    id: 'po_992019',
    tenantId: 'lumina',
    provider: 'razorpay',
    payoutReference: 'PO-HDFC-992019',
    destinationBank: 'HDFC Bank Commercial Banking',
    accountEnding: '8812',
    amountMinor: 4686720,
    currency: 'USD',
    status: 'paid',
    initiatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1 + 3600000).toISOString(),
  },
  {
    id: 'po_992018',
    tenantId: 'lumina',
    provider: 'stripe',
    payoutReference: 'PO-CITI-992018',
    destinationBank: 'Citibank N.A.',
    accountEnding: '4401',
    amountMinor: 3136000,
    currency: 'USD',
    status: 'paid',
    initiatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let payouts = DEFAULT_PAYOUTS;

    if (db) {
      const collection = db.collection('payouts');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_PAYOUTS.map((p) => ({ ...p, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ initiatedAt: -1 }).toArray();
      payouts = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      payouts = payouts.filter((p) => p.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: payouts,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
