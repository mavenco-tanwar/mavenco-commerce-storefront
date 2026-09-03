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
    const insights = [
      {
        id: 'ins_01',
        type: 'inventory_risk',
        severity: 'high',
        title: 'Stockout Risk on Hero SKU (Midnight Silk Gown)',
        summary: 'Stock on hand (14 units) will be depleted within 8 days at current sales velocity (2.1 units/day).',
        actionableRecommendation: 'Trigger purchase order for 50 units immediately to avoid $17,500 in lost revenue.',
        confidence: 0.94,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'ins_02',
        type: 'conversion_anomaly',
        severity: 'medium',
        title: 'High Search Intent with Zero Results ("Linen Blazers")',
        summary: 'Over 184 shoppers searched for "linen blazer" in the last 7 days with zero product matches.',
        actionableRecommendation: 'Create a curated redirect or tag existing Silk Blends to capture search demand.',
        confidence: 0.89,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'ins_03',
        type: 'merchandising_tip',
        severity: 'low',
        title: 'High-Converting Bundle Opportunity',
        summary: '38% of customers purchasing Botanical Serum also view Chronograph 41mm.',
        actionableRecommendation: 'Deploy "Frequently Bought Together" bundle with a 5% combo incentive.',
        confidence: 0.92,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: insights,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
