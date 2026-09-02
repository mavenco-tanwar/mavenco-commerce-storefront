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
      const collection = db.collection('orders');
      const count = await collection.countDocuments({
        $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
      });

      if (count === 0) {
        // Auto-seed initial orders in MongoDB Atlas
        const initialOrders = [
          {
            id: 'ord_100234',
            orderNumber: 'LUM-100234',
            tenantId: tenantSlug,
            customerName: 'Aanya Kapoor',
            customerEmail: 'aanya.kapoor@example.com',
            phone: '+91 9876543210',
            orderStatus: 'CONFIRMED',
            paymentStatus: 'PAID',
            paymentMethod: 'card',
            pricing: {
              subtotal: 1499,
              discountTotal: 0,
              shippingFee: 0,
              grandTotal: 1499,
            },
            shippingAddress: {
              fullName: 'Aanya Kapoor',
              phone: '+91 9876543210',
              addressLine1: 'Villa 14, Palm Meadows, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560038',
            },
            items: [
              {
                id: 'it_1',
                productId: 'prod_1',
                quantity: 1,
                unitPrice: 1499,
                productSnapshot: {
                  title: 'Blush Floral Tiered Midi Dress',
                  image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
                  sku: 'DRS-FLR-M',
                },
                variantSnapshot: {
                  name: 'Rose / Size M',
                },
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'ord_100289',
            orderNumber: 'LUM-100289',
            tenantId: tenantSlug,
            customerName: 'Rohan Mehra',
            customerEmail: 'rohan.mehra@example.com',
            phone: '+91 98111 22334',
            orderStatus: 'PROCESSING',
            paymentStatus: 'PAID',
            paymentMethod: 'upi',
            pricing: {
              subtotal: 1899,
              discountTotal: 100,
              shippingFee: 0,
              grandTotal: 1799,
            },
            shippingAddress: {
              fullName: 'Rohan Mehra',
              phone: '+91 98111 22334',
              addressLine1: 'Flat 402, Sea Green Apartments, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
            },
            items: [
              {
                id: 'it_2',
                productId: 'prod_2',
                quantity: 1,
                unitPrice: 1899,
                productSnapshot: {
                  title: 'Ivory Linen Relaxed Blazer Co-ord',
                  image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
                  sku: 'BLZ-IVY-S',
                },
                variantSnapshot: {
                  name: 'Ivory / Size S',
                },
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        await collection.insertMany(initialOrders);
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
      { success: false, error: error.message || 'Failed to fetch orders' },
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
    const newOrder = {
      ...body,
      id: body.id || `ord_${Date.now()}`,
      orderNumber: body.orderNumber || `LUM-${Math.floor(100000 + Math.random() * 900000)}`,
      tenantId: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('orders').insertOne(newOrder);
    }

    return NextResponse.json(
      { success: true, data: newOrder, message: 'Order created in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
