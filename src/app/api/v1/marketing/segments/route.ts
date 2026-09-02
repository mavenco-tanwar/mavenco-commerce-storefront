import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_SEGMENTS = [
  {
    id: 'seg_vip',
    tenantId: 'lumina',
    name: '👑 VIP Champions ($5,000+ Spend)',
    description: 'High-LTV loyal customers who ordered 3+ times or spent over $5,000.',
    type: 'dynamic',
    conditions: { minSpent: 5000, minOrders: 3, rfmStage: 'champions' },
    estimatedAudienceCount: 342,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seg_recent_30d',
    tenantId: 'lumina',
    name: '🛍️ Active Buyers (Last 30 Days)',
    description: 'Engaged customers with a completed purchase within the past month.',
    type: 'dynamic',
    conditions: { maxDaysSinceLastOrder: 30, rfmStage: 'loyal_customers' },
    estimatedAudienceCount: 890,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seg_at_risk',
    tenantId: 'lumina',
    name: '⏳ At-Risk Customers (Inactive 90+ Days)',
    description: 'Customers with past purchases who have not shopped in over 90 days.',
    type: 'dynamic',
    conditions: { maxDaysSinceLastOrder: 90, rfmStage: 'at_risk' },
    estimatedAudienceCount: 520,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('customer_segments');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_SEGMENTS.map((s) => ({ ...s, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_SEGMENTS }, { headers: corsHeaders() });
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
    const newSegment = {
      ...body,
      id: body.id || `seg_${Date.now()}`,
      tenantId: tenantSlug,
      type: body.type || 'dynamic',
      estimatedAudienceCount: Math.floor(Math.random() * 400) + 100,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('customer_segments').insertOne(newSegment);
    }

    return NextResponse.json({ success: true, data: newSegment, message: 'Customer segment created' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const db = await getDatabase();
    if (db && id) {
      await db.collection('customer_segments').deleteOne({ id });
    }
    return NextResponse.json({ success: true, message: 'Segment deleted' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
