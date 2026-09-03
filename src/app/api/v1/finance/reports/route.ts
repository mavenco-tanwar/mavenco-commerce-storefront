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

export async function GET(req: NextRequest) {
  try {
    const reportData = {
      currency: 'USD',
      period: 'FY 2026 Q3 (Current)',
      grossSalesMinor: 14892000, // $148,920.00
      discountsMinor: 1180000, // $11,800.00
      returnsRefundsMinor: 345000, // $3,450.00
      netSalesMinor: 13367000, // $133,670.00
      shippingRevenueMinor: 485000, // $4,850.00
      taxCollectedMinor: 2173500, // $21,735.00
      gatewayFeesMinor: 297800, // $2,978.00
      netProfitMinor: 13554200, // $135,542.00
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: reportData,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
