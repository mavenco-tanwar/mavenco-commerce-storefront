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
    const salesBreakdown = [
      { date: 'Aug 28', grossRevenueMinor: 1420000, netRevenueMinor: 1320000, ordersCount: 42, unitsCount: 98, discountsMinor: 100000, taxMinor: 237600 },
      { date: 'Aug 29', grossRevenueMinor: 1850000, netRevenueMinor: 1720000, ordersCount: 54, unitsCount: 120, discountsMinor: 130000, taxMinor: 309600 },
      { date: 'Aug 30', grossRevenueMinor: 2100000, netRevenueMinor: 1950000, ordersCount: 61, unitsCount: 145, discountsMinor: 150000, taxMinor: 351000 },
      { date: 'Aug 31', grossRevenueMinor: 1980000, netRevenueMinor: 1840000, ordersCount: 58, unitsCount: 132, discountsMinor: 140000, taxMinor: 331200 },
      { date: 'Sep 01', grossRevenueMinor: 2450000, netRevenueMinor: 2280000, ordersCount: 72, unitsCount: 168, discountsMinor: 170000, taxMinor: 410400 },
      { date: 'Sep 02', grossRevenueMinor: 2680000, netRevenueMinor: 2490000, ordersCount: 78, unitsCount: 184, discountsMinor: 190000, taxMinor: 448200 },
      { date: 'Sep 03', grossRevenueMinor: 2890000, netRevenueMinor: 2690000, ordersCount: 85, unitsCount: 195, discountsMinor: 200000, taxMinor: 484200 },
    ];

    return NextResponse.json({
      success: true,
      data: salesBreakdown,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
