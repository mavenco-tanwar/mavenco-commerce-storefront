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
    const attributions = [
      { channel: 'Meta (Instagram & Facebook Ads)', firstTouchRevenueMinor: 18400000, lastTouchRevenueMinor: 15200000, linearRevenueMinor: 16800000, adSpendMinor: 3800000, roasMultiplier: 4.42, ordersCount: 520 },
      { channel: 'Google Search & Shopping (PMax)', firstTouchRevenueMinor: 12100000, lastTouchRevenueMinor: 14800000, linearRevenueMinor: 13450000, adSpendMinor: 2900000, roasMultiplier: 4.64, ordersCount: 410 },
      { channel: 'Direct & Organic Search (SEO)', firstTouchRevenueMinor: 9200000, lastTouchRevenueMinor: 8900000, linearRevenueMinor: 9050000, adSpendMinor: 0, roasMultiplier: 99.0, ordersCount: 290 },
      { channel: 'Klaviyo Email & SMS Retargeting', firstTouchRevenueMinor: 5100000, lastTouchRevenueMinor: 7200000, linearRevenueMinor: 6150000, adSpendMinor: 450000, roasMultiplier: 13.6, ordersCount: 160 },
      { channel: 'Affiliate & Influencer Partnerships', firstTouchRevenueMinor: 4120000, lastTouchRevenueMinor: 2820000, linearRevenueMinor: 3470000, adSpendMinor: 850000, roasMultiplier: 4.08, ordersCount: 90 },
    ];

    return NextResponse.json({
      success: true,
      data: attributions,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
