import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'jq-trends';
    const tenantSlug = (rawSlug === 'lumina' || rawSlug === 'demo' ? 'jq-trends' : rawSlug).toLowerCase().trim();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('customers');
      const docs = await collection
        .find({
          $or: [
            { tenantId: tenantSlug },
            { tenantId: `store_${tenantSlug}` },
            { storeSlug: tenantSlug },
            { tenantSlug: tenantSlug },
          ],
        })
        .sort({ createdAt: -1 })
        .toArray();

      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customers' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newCust = {
      ...body,
      id: body.id || `cust_${Date.now()}`,
      tenantId: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('customers').insertOne(newCust);
    }

    return NextResponse.json(
      { success: true, data: newCust, message: 'Customer created in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
