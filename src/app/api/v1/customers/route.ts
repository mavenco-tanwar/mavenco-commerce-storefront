import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

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
    const db = await getDatabase();
    const tenantSlug = await resolveRequestTenantSlug(req, searchParams, db);

    if (db) {
      const collection = db.collection('customers');
      const query = tenantSlug
        ? {
            $or: [
              { tenantId: tenantSlug },
              { tenantId: `store_${tenantSlug}` },
              { storeSlug: tenantSlug },
              { tenantSlug: tenantSlug },
            ],
          }
        : {};

      const docs = await collection
        .find(query)
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
    const db = await getDatabase();
    const rawResolved =
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-store-slug') ||
      body.tenantId ||
      body.storeSlug ||
      body.tenantSlug ||
      (await resolveRequestTenantSlug(req, undefined, db));

    const tenantSlug = (rawResolved || '').replace(/^store_/, '').toLowerCase().trim();

    const now = new Date().toISOString();
    const newCust = {
      ...body,
      id: body.id || `cust_${Date.now()}`,
      tenantId: `store_${tenantSlug}`,
      tenantSlug,
      storeSlug: tenantSlug,
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
