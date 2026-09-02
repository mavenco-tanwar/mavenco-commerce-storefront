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
      const collection = db.collection('customers');
      const count = await collection.countDocuments({
        $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
      });

      if (count === 0) {
        // Auto-seed customers in MongoDB Atlas
        const initialCustomers = [
          {
            id: 'cust_1',
            tenantId: tenantSlug,
            name: 'Aanya Kapoor',
            email: 'aanya.kapoor@example.com',
            phone: '+91 9876543210',
            ordersCount: 3,
            totalSpent: 4297,
            status: 'active',
            tags: ['VIP', 'Haute Couture'],
            addresses: [
              {
                id: 'addr_1',
                fullName: 'Aanya Kapoor',
                addressLine1: 'Villa 14, Palm Meadows, Indiranagar',
                city: 'Bengaluru',
                state: 'Karnataka',
                postalCode: '560038',
                isDefault: true,
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'cust_2',
            tenantId: tenantSlug,
            name: 'Rohan Mehra',
            email: 'rohan.mehra@example.com',
            phone: '+91 98111 22334',
            ordersCount: 1,
            totalSpent: 1799,
            status: 'active',
            tags: ['New Member'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        await collection.insertMany(initialCustomers);
      }

      const docs = await collection
        .find({
          $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
        })
        .sort({ createdAt: -1 })
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
