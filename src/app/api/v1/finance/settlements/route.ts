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

const DEFAULT_SETTLEMENTS = [
  {
    id: 'sett_2026_0901',
    tenantId: 'lumina',
    provider: 'razorpay',
    settlementReference: 'RZP-SETT-8829101',
    grossAmountMinor: 4800000, // $48,000.00
    feesMinor: 96000, // $960.00 (2%)
    taxOnFeesMinor: 17280, // 18% GST on MDR
    netAmountMinor: 4686720, // $46,867.20
    currency: 'USD',
    settlementDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'reconciled',
    transactionCount: 42,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'sett_2026_0831',
    tenantId: 'lumina',
    provider: 'stripe',
    settlementReference: 'STR-SETT-7719202',
    grossAmountMinor: 3200000, // $32,000.00
    feesMinor: 64000, // $640.00
    taxOnFeesMinor: 0,
    netAmountMinor: 3136000, // $31,360.00
    currency: 'USD',
    settlementDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'reconciled',
    transactionCount: 28,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let settlements = DEFAULT_SETTLEMENTS;

    if (db) {
      const collection = db.collection('settlements');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_SETTLEMENTS.map((s) => ({ ...s, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ settlementDate: -1 }).toArray();
      settlements = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      settlements = settlements.filter((s) => s.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: settlements,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
