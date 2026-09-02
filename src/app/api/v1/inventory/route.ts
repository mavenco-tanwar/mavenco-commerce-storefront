import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ProductService } from '@/services/products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const warehouseId = searchParams.get('warehouseId');

    const db = await getDatabase();
    if (db) {
      const query: any = { tenantId: tenant };
      if (warehouseId && warehouseId !== 'all') {
        query.warehouseId = warehouseId;
      }

      const docs = await db.collection('inventory_items').find(query).toArray();
      if (docs && docs.length > 0) {
        return NextResponse.json({
          success: true,
          data: docs,
        });
      }
    }

    // Dynamic Seed from Products Catalog
    const prodsRes = await ProductService.getAllProducts();
    const products = prodsRes.data || [];

    const defaultItems = products.flatMap((p: any) => {
      const stock = p.stock || 25;
      return [
        {
          id: `inv_${p.id}_blr`,
          tenantId: tenant,
          productId: p.id,
          productTitle: p.name,
          variantId: `${p.id}_M`,
          variantTitle: 'Rose / Size M',
          sku: `${p.sku || 'SKU'}-M`,
          warehouseId: 'blr_studio',
          warehouseName: 'Bengaluru Flagship Studio',
          onHand: stock + 2,
          reserved: 2,
          available: stock,
          incoming: 20,
          damaged: 0,
          safetyStock: 5,
          lowStockThreshold: 10,
          status: stock > 10 ? 'in_stock' : stock > 0 ? 'low_stock' : 'out_of_stock',
          updatedAt: new Date().toISOString(),
        },
        {
          id: `inv_${p.id}_bom`,
          tenantId: tenant,
          productId: p.id,
          productTitle: p.name,
          variantId: `${p.id}_S`,
          variantTitle: 'Rose / Size S',
          sku: `${p.sku || 'SKU'}-S`,
          warehouseId: 'mumbai_hub',
          warehouseName: 'Mumbai Central Logistics Hub',
          onHand: stock + 5,
          reserved: 0,
          available: stock + 5,
          incoming: 50,
          damaged: 0,
          safetyStock: 5,
          lowStockThreshold: 10,
          status: 'in_stock',
          updatedAt: new Date().toISOString(),
        },
      ];
    });

    return NextResponse.json({
      success: true,
      data: defaultItems,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve inventory' },
      { status: 500 }
    );
  }
}
