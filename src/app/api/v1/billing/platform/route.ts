import { NextRequest, NextResponse } from 'next/server';

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
    const metrics = {
      mrrMinor: 4285000, // $42,850.00
      arrMinor: 51420000, // $514,200.00
      activeTenantsCount: 148,
      trialingTenantsCount: 24,
      churnRatePercentage: 1.2,
      currency: 'USD',
      planDistribution: [
        {
          planName: 'Starter Tier ($99/mo)',
          subscribersCount: 42,
          revenueMinor: 415800,
        },
        {
          planName: 'Growth Commerce ($299/mo)',
          subscribersCount: 86,
          revenueMinor: 2571400,
        },
        {
          planName: 'Scale Enterprise ($799/mo)',
          subscribersCount: 20,
          revenueMinor: 1598000,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
