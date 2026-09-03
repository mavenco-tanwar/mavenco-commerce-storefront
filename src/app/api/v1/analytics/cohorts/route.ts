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
    const cohortRows = [
      { cohortMonth: 'May 2026', initialCustomersCount: 320, retentionPercentages: [100, 34.2, 28.5, 24.1, 21.0], cumulativeRevenueMinor: 4890000 },
      { cohortMonth: 'Jun 2026', initialCustomersCount: 410, retentionPercentages: [100, 36.8, 30.1, 26.4], cumulativeRevenueMinor: 6240000 },
      { cohortMonth: 'Jul 2026', initialCustomersCount: 540, retentionPercentages: [100, 38.5, 32.4], cumulativeRevenueMinor: 8120000 },
      { cohortMonth: 'Aug 2026', initialCustomersCount: 680, retentionPercentages: [100, 41.2], cumulativeRevenueMinor: 9940000 },
      { cohortMonth: 'Sep 2026', initialCustomersCount: 790, retentionPercentages: [100], cumulativeRevenueMinor: 3100000 },
    ];

    return NextResponse.json({
      success: true,
      data: cohortRows,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
