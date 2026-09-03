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

const DEFAULT_PERIODS = [
  {
    id: 'fp_2026_09',
    tenantId: 'lumina',
    name: 'September 2026 Fiscal Period',
    startDate: '2026-09-01T00:00:00.000Z',
    endDate: '2026-09-30T23:59:59.999Z',
    status: 'open',
  },
  {
    id: 'fp_2026_08',
    tenantId: 'lumina',
    name: 'August 2026 Fiscal Period',
    startDate: '2026-08-01T00:00:00.000Z',
    endDate: '2026-08-31T23:59:59.999Z',
    status: 'closed',
    closedAt: '2026-09-01T02:00:00.000Z',
    closedBy: 'admin_finance_chief',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let periods = DEFAULT_PERIODS;

    if (db) {
      const collection = db.collection('financial_periods');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_PERIODS.map((p) => ({ ...p, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ startDate: -1 }).toArray();
      periods = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      periods = periods.filter((p) => p.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: periods,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
