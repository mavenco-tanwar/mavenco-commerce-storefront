import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_FULFILLMENTS = [
  {
    id: 'ful_101',
    orderId: 'ord_1',
    orderNumber: 'LUM-100234',
    customerName: 'Aanya Kapoor',
    warehouseId: 'blr_studio',
    warehouseName: 'Bengaluru Flagship Studio',
    items: [
      { sku: 'DRS-FLR-M', title: 'Blush Floral Tiered Midi Dress', quantity: 1 },
    ],
    status: 'packing',
    carrier: 'BlueDart Air Express',
    trackingNumber: 'BLUEDART-847291-BLR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ful_102',
    orderId: 'ord_2',
    orderNumber: 'LUM-100289',
    customerName: 'Rohan Mehra',
    warehouseId: 'mumbai_hub',
    warehouseName: 'Mumbai Central Logistics Hub',
    items: [
      { sku: 'BLZ-IVY-S', title: 'Ivory Linen Relaxed Blazer Co-ord', quantity: 1 },
    ],
    status: 'picking',
    carrier: 'Delhivery Surface',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';

    const db = await getDatabase();
    if (db) {
      const docs = await db.collection('fulfillments').find({ tenantId: tenant }).toArray();
      if (docs && docs.length > 0) {
        return NextResponse.json({ success: true, data: docs });
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_FULFILLMENTS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve fulfillments' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, carrier, trackingNumber } = body;

    const db = await getDatabase();
    if (db) {
      const updateData: any = {
        status,
        updatedAt: new Date().toISOString(),
      };
      if (carrier) updateData.carrier = carrier;
      if (trackingNumber) updateData.trackingNumber = trackingNumber;

      if (status === 'packed') updateData.packedAt = new Date().toISOString();
      if (status === 'shipped') updateData.shippedAt = new Date().toISOString();
      if (status === 'delivered') updateData.deliveredAt = new Date().toISOString();

      await db.collection('fulfillments').updateOne(
        { id },
        { $set: updateData }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Fulfillment status advanced to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update fulfillment' },
      { status: 500 }
    );
  }
}
