import { NextRequest, NextResponse } from 'next/server';
import { StorefrontPageService } from '@/server/governance/storefront-page.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const storefront = await StorefrontPageService.getStorefront(id);
    const pages = await StorefrontPageService.getPages(id, storefront.id);
    return NextResponse.json({ success: true, data: pages }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const storefront = await StorefrontPageService.getStorefront(id);

    const now = new Date().toISOString();
    const newPage = {
      id: `page_${id}_${Date.now()}`,
      storefrontId: storefront.id,
      tenantId: id.toLowerCase().trim(),
      storeId: 'store_primary',
      slug: body.slug || `page-${Date.now()}`,
      title: body.title || 'New Page',
      type: body.type || 'standard',
      status: 'draft' as const,
      sections: body.sections || [],
      createdAt: now,
      updatedAt: now,
    };

    const pages = await StorefrontPageService.getPages(id, storefront.id);
    pages.push(newPage);

    return NextResponse.json({ success: true, data: newPage, message: 'Page created in draft state.' }, { status: 201, headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
