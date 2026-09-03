import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let MAPPINGS = [
  {
    id: 'map_01',
    integrationId: 'inst_netsuite_01',
    entityType: 'products',
    internalField: 'product.sku',
    externalField: 'item.itemId',
    direction: 'bidirectional',
    transformationType: 'trim',
    isRequired: true,
  },
  {
    id: 'map_02',
    integrationId: 'inst_netsuite_01',
    entityType: 'products',
    internalField: 'product.title',
    externalField: 'item.displayName',
    direction: 'outbound',
    transformationType: 'direct',
    isRequired: true,
  },
  {
    id: 'map_03',
    integrationId: 'inst_netsuite_01',
    entityType: 'inventory',
    internalField: 'inventory.available',
    externalField: 'locationQuantity.quantityAvailable',
    direction: 'inbound',
    transformationType: 'direct',
    isRequired: true,
  },
  {
    id: 'map_04',
    integrationId: 'inst_quickbooks_01',
    entityType: 'orders',
    internalField: 'order.totalAmountMinor',
    externalField: 'SalesReceipt.TotalAmt',
    direction: 'outbound',
    transformationType: 'math_multiply',
    transformationParam: '0.01',
    isRequired: true,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: MAPPINGS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sampleInput, transformationType, transformationParam } = body;

    if (action === 'test_transform') {
      let output = sampleInput;
      if (transformationType === 'uppercase') output = String(sampleInput).toUpperCase();
      if (transformationType === 'lowercase') output = String(sampleInput).toLowerCase();
      if (transformationType === 'trim') output = String(sampleInput).trim();
      if (transformationType === 'math_multiply') {
        const factor = parseFloat(transformationParam || '1');
        output = (parseFloat(sampleInput) * factor).toFixed(2);
      }
      if (transformationType === 'currency_convert') {
        output = `$${(parseFloat(sampleInput) / 100).toFixed(2)} USD`;
      }

      return NextResponse.json({
        success: true,
        data: { input: sampleInput, output, valid: true },
        message: 'Transformation evaluated deterministically!',
      }, { headers: corsHeaders() });
    }

    const newRule = {
      id: `map_${Date.now()}`,
      integrationId: body.integrationId || 'inst_netsuite_01',
      entityType: body.entityType || 'products',
      internalField: body.internalField || 'product.title',
      externalField: body.externalField || 'item.name',
      direction: body.direction || 'bidirectional',
      transformationType: body.transformationType || 'direct',
      transformationParam: body.transformationParam,
      defaultValue: body.defaultValue,
      isRequired: body.isRequired ?? true,
    };

    MAPPINGS.push(newRule);

    return NextResponse.json({
      success: true,
      data: newRule,
      message: 'Field mapping rule created successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
