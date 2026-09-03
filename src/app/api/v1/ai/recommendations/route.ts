import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let RECOMMENDATION_CONFIGS = [
  {
    id: 'rec_pdp',
    placement: 'pdp',
    strategy: 'frequently_bought_together',
    minConfidence: 0.85,
    inventoryFilterEnabled: true,
    fallbackStrategy: 'best_sellers',
    enabled: true,
    clickThroughRatePercentage: 14.8,
  },
  {
    id: 'rec_home',
    placement: 'homepage',
    strategy: 'personalized',
    minConfidence: 0.80,
    inventoryFilterEnabled: true,
    fallbackStrategy: 'popular',
    enabled: true,
    clickThroughRatePercentage: 11.2,
  },
  {
    id: 'rec_cart',
    placement: 'cart',
    strategy: 'similar_products',
    minConfidence: 0.90,
    inventoryFilterEnabled: true,
    fallbackStrategy: 'best_sellers',
    enabled: true,
    clickThroughRatePercentage: 8.9,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: RECOMMENDATION_CONFIGS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, enabled } = body;
    const config = RECOMMENDATION_CONFIGS.find((c) => c.id === id);
    if (config) {
      if (typeof enabled === 'boolean') config.enabled = enabled;
    }
    return NextResponse.json({
      success: true,
      data: config,
      message: 'Recommendation strategy updated successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
