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
    const funnelSteps = [
      { stepIndex: 1, stepName: '1. Storefront Visits', visitorsCount: 48200, stepConversionRate: 100.0, dropOffRate: 0.0 },
      { stepIndex: 2, stepName: '2. Product Views', visitorsCount: 24100, stepConversionRate: 50.0, dropOffRate: 50.0 },
      { stepIndex: 3, stepName: '3. Added to Bag', visitorsCount: 6800, stepConversionRate: 28.2, dropOffRate: 71.8 },
      { stepIndex: 4, stepName: '4. Reached Checkout', visitorsCount: 3200, stepConversionRate: 47.0, dropOffRate: 53.0 },
      { stepIndex: 5, stepName: '5. Order Completed', visitorsCount: 2320, stepConversionRate: 72.5, dropOffRate: 27.5 },
    ];

    return NextResponse.json({
      success: true,
      data: funnelSteps,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
