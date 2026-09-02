import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_MOVEMENTS = [
  {
    id: 'mov_1',
    sku: 'DRS-FLR-M',
    productId: 'prod_1',
    variantId: 'var_1_m',
    warehouseId: 'blr_studio',
    warehouseName: 'Bengaluru Flagship Studio',
    type: 'IN',
    quantity: 30,
    previousQuantity: 0,
    newQuantity: 30,
    reason: 'Initial production run arrival from master weaver workshop',
    actorName: 'Inventory Lead',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mov_2',
    sku: 'DRS-FLR-M',
    productId: 'prod_1',
    variantId: 'var_1_m',
    warehouseId: 'blr_studio',
    warehouseName: 'Bengaluru Flagship Studio',
    type: 'COMMIT',
    quantity: -2,
    previousQuantity: 30,
    newQuantity: 28,
    reason: 'Order LUM-100234 fulfillment dispatch',
    referenceType: 'ORDER',
    referenceId: 'LUM-100234',
    actorName: 'Automated Checkout Engine',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mov_3',
    sku: 'BLZ-IVY-S',
    productId: 'prod_2',
    variantId: 'var_2_s',
    warehouseId: 'mumbai_hub',
    warehouseName: 'Mumbai Central Logistics Hub',
    type: 'ADJUSTMENT',
    quantity: 10,
    previousQuantity: 15,
    newQuantity: 25,
    reason: 'Cycle count physical audit inventory reconciliation',
    actorName: 'Warehouse Manager',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';

    const db = await getDatabase();
    if (db) {
      const docs = await db
        .collection('stock_movements')
        .find({ tenantId: tenant })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      if (docs && docs.length > 0) {
        return NextResponse.json({ success: true, data: docs });
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_MOVEMENTS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve movements' },
      { status: 500 }
    );
  }
}
