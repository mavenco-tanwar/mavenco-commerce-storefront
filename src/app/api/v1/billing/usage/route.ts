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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const usageData = {
      tenantId: tenantSlug,
      periodStart: new Date(Date.now() - 86400000 * 15).toISOString(),
      periodEnd: new Date(Date.now() + 86400000 * 15).toISOString(),
      storesCount: 2,
      storesLimit: 5,
      domainsCount: 3,
      domainsLimit: 5,
      productsCount: 4500,
      productsLimit: 10000,
      monthlyOrdersCount: 1240,
      monthlyOrdersLimit: 5000,
      apiRequestsCount: 82400,
      apiRequestsLimit: 250000,
      storageGbUsed: 14.8,
      storageGbLimit: 50,
    };

    return NextResponse.json({
      success: true,
      data: usageData,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
