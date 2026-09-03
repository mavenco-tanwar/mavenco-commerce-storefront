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
    const products = [
      { id: 'prod_01', title: 'Midnight Silk Evening Gown', sku: 'LUM-DR-001', category: 'Apparel', viewsCount: 14200, cartAddsCount: 3890, unitsSold: 420, revenueMinor: 14700000, conversionRate: 10.8, wishlistAdds: 2100, refundRatePercentage: 1.2 },
      { id: 'prod_02', title: 'Royal Heritage Chronograph 41mm', sku: 'ELY-WT-002', category: 'Timepieces', viewsCount: 11500, cartAddsCount: 2450, unitsSold: 210, revenueMinor: 16800000, conversionRate: 8.5, wishlistAdds: 3400, refundRatePercentage: 0.5 },
      { id: 'prod_03', title: 'Cellular Revitalizing Botanical Serum', sku: 'AUR-SC-003', category: 'Skincare', viewsCount: 18900, cartAddsCount: 5600, unitsSold: 890, revenueMinor: 8010000, conversionRate: 15.9, wishlistAdds: 1800, refundRatePercentage: 0.8 },
      { id: 'prod_04', title: 'Acoustic Master Reference Headphones', sku: 'VAN-AU-004', category: 'Audio', viewsCount: 8900, cartAddsCount: 1820, unitsSold: 140, revenueMinor: 4900000, conversionRate: 7.7, wishlistAdds: 1200, refundRatePercentage: 2.1 },
    ];

    return NextResponse.json({
      success: true,
      data: products,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
