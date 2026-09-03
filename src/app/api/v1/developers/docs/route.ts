import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const endpoints = [
      {
        id: 'ep_products_list',
        path: '/api/v1/products',
        method: 'GET',
        tag: 'Products',
        summary: 'List Catalog Products',
        description: 'Retrieves a paginated list of catalog products filtered by status, category, or inventory availability.',
        requiredScopes: ['products:read'],
        parameters: [
          { name: 'limit', in: 'query', required: false, type: 'number', description: 'Number of results (max 100)' },
          { name: 'category', in: 'query', required: false, type: 'string', description: 'Filter by category slug' },
        ],
        sampleResponseJson: '{\n  "success": true,\n  "data": [\n    {\n      "id": "prod_silk_gown",\n      "title": "Midnight Silk Evening Gown",\n      "priceMinor": 35000,\n      "currency": "USD",\n      "stockOnHand": 14\n    }\n  ]\n}',
      },
      {
        id: 'ep_orders_create',
        path: '/api/v1/orders',
        method: 'POST',
        tag: 'Orders',
        summary: 'Create Commerce Order',
        description: 'Creates an authoritative commerce order and triggers fulfillment and inventory reservation workflows.',
        requiredScopes: ['orders:write'],
        parameters: [
          { name: 'Idempotency-Key', in: 'header', required: true, type: 'string', description: 'UUID to ensure safe replay' },
        ],
        sampleResponseJson: '{\n  "success": true,\n  "data": {\n    "id": "ord_9841",\n    "orderNumber": "ORD-2026-9841",\n    "status": "paid",\n    "totalAmountMinor": 35000\n  }\n}',
      },
      {
        id: 'ep_inventory_update',
        path: '/api/v1/inventory/stock',
        method: 'PATCH',
        tag: 'Inventory',
        summary: 'Adjust Warehouse Stock Levels',
        description: 'Updates atomic inventory on-hand balances across designated fulfillment centers.',
        requiredScopes: ['inventory:write'],
        parameters: [],
        sampleResponseJson: '{\n  "success": true,\n  "data": {\n    "sku": "LUM-DR-001",\n    "warehouseId": "wh_main",\n    "newStockOnHand": 50\n  }\n}',
      },
    ];

    return NextResponse.json({
      success: true,
      data: endpoints,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
