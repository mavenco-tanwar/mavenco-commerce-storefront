import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_RETURNS = [
  {
    id: 'ret_1001',
    returnNumber: 'RET-89210',
    orderId: 'ord_1',
    orderNumber: 'LUM-100234',
    customerName: 'Aanya Kapoor',
    customerEmail: 'aanya.kapoor@example.com',
    customerPhone: '+91 9876543210',
    type: 'exchange',
    status: 'pickup_scheduled',
    items: [
      {
        orderItemId: 'it_1',
        productId: 'prod_1',
        variantId: 'var_1_m',
        sku: 'DRS-FLR-M',
        title: 'Blush Floral Tiered Midi Dress',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200',
        unitPrice: 1499,
        quantityOrdered: 1,
        quantityRequested: 1,
        reason: 'wrong_size',
        customerNotes: 'Need a larger size (Size L) for better bust fit.',
        refundAmount: 0,
        exchangeVariantTitle: 'Rose / Size L',
      },
    ],
    reason: 'Size Exchange to Size L',
    pickupCarrier: 'BlueDart Reverse Logistics',
    pickupTrackingNumber: 'BLUEDART-REV-984210',
    pickupScheduledDate: 'Tomorrow, 10:00 AM - 2:00 PM',
    totalRefundAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const email = searchParams.get('email');

    const db = await getDatabase();
    if (db) {
      const query: any = { tenantId: tenant };
      if (email) query.customerEmail = email;

      const docs = await db.collection('return_requests').find(query).toArray();
      if (docs && docs.length > 0) {
        return NextResponse.json({ success: true, data: docs });
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_RETURNS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve returns' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      orderNumber,
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      type = 'refund',
      items,
      reason,
      customerNote,
    } = body;

    if (!orderNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order details and at least one return item are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const returnNumber = `RET-${Math.floor(10000 + Math.random() * 90000)}`;

    const totalRefundAmount = items.reduce(
      (sum: number, it: any) => sum + (it.unitPrice || 0) * (it.quantityRequested || 1),
      0
    );

    const newReturn = {
      id: `ret_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenant,
      returnNumber,
      orderId: orderId || orderNumber,
      orderNumber,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || 'customer@example.com',
      customerPhone: customerPhone || '+91 9876543210',
      type,
      status: 'requested',
      items,
      reason: reason || 'Return Request',
      customerNote,
      totalRefundAmount: type === 'exchange' ? 0 : totalRefundAmount,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('return_requests').insertOne(newReturn);
    }

    return NextResponse.json({
      success: true,
      data: newReturn,
      returnNumber,
      message: 'Return request submitted successfully. Our concierge team will review it within 24 hours.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create return request' },
      { status: 500 }
    );
  }
}
