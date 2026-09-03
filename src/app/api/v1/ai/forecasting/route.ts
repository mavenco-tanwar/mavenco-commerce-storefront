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
    const forecasts = [
      {
        id: 'fc_01',
        productTitle: 'Midnight Silk Evening Gown',
        sku: 'LUM-DR-001',
        category: 'Apparel',
        currentStockOnHand: 14,
        predictedDemand30d: 48,
        predictedDemand90d: 135,
        confidenceScore: 0.94,
        reorderRecommendation: 'urgent_reorder',
        reorderUnits: 50,
      },
      {
        id: 'fc_02',
        productTitle: 'Cellular Revitalizing Serum',
        sku: 'AUR-SC-003',
        category: 'Skincare',
        currentStockOnHand: 180,
        predictedDemand30d: 95,
        predictedDemand90d: 260,
        confidenceScore: 0.96,
        reorderRecommendation: 'optimal',
        reorderUnits: 0,
      },
      {
        id: 'fc_03',
        productTitle: 'Royal Heritage Chronograph 41mm',
        sku: 'ELY-WT-002',
        category: 'Timepieces',
        currentStockOnHand: 6,
        predictedDemand30d: 22,
        predictedDemand90d: 65,
        confidenceScore: 0.91,
        reorderRecommendation: 'reorder_soon',
        reorderUnits: 25,
      },
      {
        id: 'fc_04',
        productTitle: 'Cashmere Ribbed Knit Cardigan',
        sku: 'LUM-KN-005',
        category: 'Knitwear',
        currentStockOnHand: 320,
        predictedDemand30d: 40,
        predictedDemand90d: 110,
        confidenceScore: 0.88,
        reorderRecommendation: 'excess_stock',
        reorderUnits: 0,
      },
    ];

    return NextResponse.json({
      success: true,
      data: forecasts,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
