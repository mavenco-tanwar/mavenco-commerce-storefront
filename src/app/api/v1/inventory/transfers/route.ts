import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_TRANSFERS = [
  {
    id: 'tr_1001',
    transferNumber: 'TRF-10082',
    sourceWarehouseId: 'blr_studio',
    sourceWarehouseName: 'Bengaluru Flagship Studio',
    destWarehouseId: 'mumbai_hub',
    destWarehouseName: 'Mumbai Central Logistics Hub',
    items: [
      {
        sku: 'DRS-FLR-M',
        title: 'Blush Floral Tiered Midi Dress',
        quantityRequested: 15,
        quantityShipped: 15,
        quantityReceived: 0,
      },
      {
        sku: 'BLZ-IVY-S',
        title: 'Ivory Linen Relaxed Blazer Co-ord',
        quantityRequested: 10,
        quantityShipped: 10,
        quantityReceived: 0,
      },
    ],
    status: 'in_transit',
    notes: 'Inter-warehouse seasonal stock balancing for upcoming festive drop.',
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
      const docs = await db.collection('stock_transfers').find({ tenantId: tenant }).toArray();
      if (docs && docs.length > 0) {
        return NextResponse.json({ success: true, data: docs });
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_TRANSFERS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve transfers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenant = 'lumina', transfer } = body;

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newTransfer = {
      ...transfer,
      id: transfer.id || `tr_${Date.now()}`,
      transferNumber: `TRF-${Math.floor(10000 + Math.random() * 90000)}`,
      tenantId: tenant,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('stock_transfers').insertOne(newTransfer);
    }

    return NextResponse.json({
      success: true,
      data: newTransfer,
      message: 'Stock transfer created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create transfer' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const db = await getDatabase();
    if (db) {
      await db.collection('stock_transfers').updateOne(
        { id },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Transfer status updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update transfer' },
      { status: 500 }
    );
  }
}
