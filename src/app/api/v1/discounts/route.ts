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
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('discounts');
      const count = await collection.countDocuments({
        $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
      });

      if (count === 0) {
        // Auto-seed discounts in MongoDB Atlas
        const initialDiscounts = [
          {
            id: 'disc_welcome10',
            tenantId: tenantSlug,
            code: 'WELCOME10',
            type: 'percentage',
            value: 10,
            description: '10% off on your first atelier luxury garment order.',
            minOrderValue: 999,
            usageLimit: 1000,
            usageCount: 42,
            isActive: true,
            startsAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 86400000 * 90).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'disc_festive20',
            tenantId: tenantSlug,
            code: 'FESTIVE20',
            type: 'percentage',
            value: 20,
            description: '20% off on festive collections above $2000.',
            minOrderValue: 2000,
            usageLimit: 500,
            usageCount: 18,
            isActive: true,
            startsAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        await collection.insertMany(initialDiscounts);
      }

      const docs = await collection
        .find({
          $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
        })
        .toArray();

      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
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
    const newDisc = {
      ...body,
      id: body.id || `disc_${Date.now()}`,
      tenantId: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('discounts').insertOne(newDisc);
    }

    return NextResponse.json(
      { success: true, data: newDisc, message: 'Discount created in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
