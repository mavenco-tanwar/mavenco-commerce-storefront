import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PimService } from '@/server/pim/pim.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const brandId = searchParams.get('brandId') || undefined;
  const minCompleteness = searchParams.get('minCompleteness') ? parseInt(searchParams.get('minCompleteness')!, 10) : undefined;
  const minQuality = searchParams.get('minQuality') ? parseInt(searchParams.get('minQuality')!, 10) : undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const { products, total } = await PimService.getProducts(tenantSlug, {
      category,
      search,
      status,
      brandId,
      minCompleteness,
      minQuality,
      page,
      limit,
    });

    return NextResponse.json(
      {
        data: products,
        total,
        page,
        limit,
        source: 'pim_authoritative',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error('PIM products query error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantSlug = (body.tenantSlug || body.tenantId || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
    const operator = request.headers.get('x-user-name') || 'Admin Curator';

    const saved = await PimService.upsertProduct(tenantSlug, body, operator);

    // Sync to legacy MongoDB products collection if available
    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('products').insertOne({
          ...saved,
          tenantSlug,
          storeSlug: tenantSlug,
        });
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: saved,
        source: 'pim_authoritative',
        message: 'Product created and validated in PIM',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
