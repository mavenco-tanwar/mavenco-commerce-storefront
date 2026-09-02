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

const DEFAULT_POINTS_LEDGER = [
  {
    id: 'pt_1',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'EARN',
    points: 750,
    balanceBefore: 0,
    balanceAfter: 750,
    source: 'order.delivered',
    sourceId: 'LUM-100234',
    description: 'Gold VIP 1.5x Earned Points for Order #LUM-100234',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'pt_2',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'REVIEW',
    points: 100,
    balanceBefore: 750,
    balanceAfter: 850,
    source: 'review.verified',
    description: 'Verified Purchase Photo Review Bonus',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'pt_3',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'REFERRAL',
    points: 600,
    balanceBefore: 850,
    balanceAfter: 1450,
    source: 'referral.qualified',
    description: 'VIP Referral Bonus for Friend Order #LUM-100289',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const customerId = searchParams.get('customerId') || 'cust_1';

    const db = await getDatabase();
    let ledger = DEFAULT_POINTS_LEDGER;

    if (db) {
      const collection = db.collection('loyalty_ledger_entries');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_POINTS_LEDGER.map((l) => ({ ...l, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug, customerId }).sort({ createdAt: -1 }).toArray();
      ledger = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      ledger = ledger.filter((l) => l.tenantId === tenantSlug && l.customerId === customerId);
    }

    const currentBalance = ledger.length > 0 ? ledger[0].balanceAfter : 1450;

    return NextResponse.json({
      success: true,
      data: ledger,
      currentBalance,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();
    const db = await getDatabase();

    const points = Number(body.points) || 100;
    const now = new Date().toISOString();
    const newEntry = {
      id: `pt_${Date.now()}`,
      tenantId: tenantSlug,
      customerId: body.customerId || 'cust_1',
      type: body.type || 'ADJUSTMENT',
      points,
      balanceBefore: body.balanceBefore || 1450,
      balanceAfter: (body.balanceBefore || 1450) + points,
      source: body.source || 'admin.adjustment',
      description: body.description || 'Manual Points Adjustment',
      createdAt: now,
    };

    if (db) {
      await db.collection('loyalty_ledger_entries').insertOne(newEntry);
    }

    return NextResponse.json({
      success: true,
      data: newEntry,
      message: 'Points transaction committed successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
