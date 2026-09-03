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
    const overviewData = {
      totalRevenueMinor: 48920000, // $489,200.00
      ordersCount: 1420,
      averageOrderValueMinor: 34450, // $344.50
      conversionRatePercentage: 4.82,
      repeatCustomerRatePercentage: 31.4,
      projected30DayRevenueMinor: 84500000, // $845,000.00
      liveActiveVisitorsCount: 42,
      unitsSoldCount: 3840,
      grossMarginPercentage: 68.5,
      currency: 'USD',
    };

    return NextResponse.json({
      success: true,
      data: overviewData,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
