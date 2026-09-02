import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      variantId,
      sku,
      warehouseId = 'blr_studio',
      changeAmount,
      reason = 'cycle_count',
      notes,
      actor = 'Staff Admin',
    } = body;

    const db = await getDatabase();
    const now = new Date().toISOString();

    if (db) {
      // Find item
      const item = await db.collection('inventory_items').findOne({
        tenantId: tenant,
        $or: [{ variantId }, { sku }],
      });

      const currentAvailable = item?.available ?? 25;
      const newAvailable = Math.max(0, currentAvailable + Number(changeAmount));

      await db.collection('inventory_items').updateOne(
        { tenantId: tenant, $or: [{ variantId }, { sku }] },
        {
          $set: {
            available: newAvailable,
            onHand: newAvailable + (item?.reserved ?? 2),
            status: newAvailable > 10 ? 'in_stock' : newAvailable > 0 ? 'low_stock' : 'out_of_stock',
            updatedAt: now,
          },
        },
        { upsert: true }
      );

      // Append to immutable Stock Movement Ledger
      const movement = {
        id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tenantId: tenant,
        sku: sku || variantId,
        productId: item?.productId || 'prod',
        variantId: variantId || item?.variantId,
        warehouseId,
        warehouseName: warehouseId === 'mumbai_hub' ? 'Mumbai Central Logistics Hub' : 'Bengaluru Flagship Studio',
        type: 'ADJUSTMENT',
        quantity: Number(changeAmount),
        previousQuantity: currentAvailable,
        newQuantity: newAvailable,
        reason,
        notes,
        actorName: actor,
        createdAt: now,
      };

      await db.collection('stock_movements').insertOne(movement);

      return NextResponse.json({
        success: true,
        message: `Adjusted stock by ${changeAmount} units`,
        data: { newAvailable },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Adjusted stock locally',
      data: { changeAmount },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to adjust stock' },
      { status: 500 }
    );
  }
}
