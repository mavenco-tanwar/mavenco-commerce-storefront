import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';

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
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const catalogs = PimService.getCatalogs(tenantSlug);
    return NextResponse.json({ success: true, data: catalogs }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const newCatalog = {
      id: body.id || `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      name: body.name || 'New Catalog',
      code: (body.code || 'CAT').toUpperCase(),
      type: body.type || 'market',
      status: body.status || 'draft',
      parentCatalogId: body.parentCatalogId,
      markets: body.markets || ['US'],
      channels: body.channels || ['web'],
      categories: body.categories || [],
      productIds: body.productIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const catalogs = PimService.getCatalogs(tenantSlug);
    catalogs.push(newCatalog);

    return NextResponse.json({ success: true, data: newCatalog, message: 'Catalog created successfully' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
