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
    const brands = PimService.getBrands(tenantSlug);
    return NextResponse.json({ success: true, data: brands }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const newBrand = {
      id: body.id || `brand_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      name: body.name || 'New Brand',
      slug: (body.slug || body.name || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logo: body.logo,
      description: body.description,
      country: body.country || 'India',
      status: body.status || 'active',
      seo: body.seo,
      localizedContent: body.localizedContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const brands = PimService.getBrands(tenantSlug);
    brands.push(newBrand as any);

    return NextResponse.json({ success: true, data: newBrand, message: 'Brand created successfully' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
