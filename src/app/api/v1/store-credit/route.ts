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

const DEFAULT_STORE_CREDIT_LEDGER = [
  {
    id: 'sc_1',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'refund_credit',
    amount: 150,
    balanceAfter: 150,
    description: 'Instant Store Credit Refund for Return RET-1002',
    orderId: 'LUM-100234',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sc_2',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'goodwill_credit',
    amount: 50,
    balanceAfter: 200,
    description: 'VIP Concierge Anniversary Goodwill Credit',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('store_credit_ledgers');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_STORE_CREDIT_LEDGER.map((s) => ({ ...s, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean, totalBalance: 200 }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_STORE_CREDIT_LEDGER, totalBalance: 200 }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newEntry = {
      ...body,
      id: body.id || `sc_${Date.now()}`,
      tenantId: tenantSlug,
      balanceAfter: body.amount || 50,
      createdAt: now,
    };

    if (db) {
      await db.collection('store_credit_ledgers').insertOne(newEntry);
    }

    return NextResponse.json({ success: true, data: newEntry, message: 'Store credit adjusted successfully!' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
