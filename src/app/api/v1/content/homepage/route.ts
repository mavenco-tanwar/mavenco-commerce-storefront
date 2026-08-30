import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoredHomepageSections, saveStoredHomepageSections } from '@/lib/cms-store';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'jqtrends';
  const sections = getStoredHomepageSections(tenantSlug);

  return NextResponse.json(
    {
      data: {
        id: `hp_live_${tenantSlug}`,
        storeId: `store_${tenantSlug}`,
        tenant: tenantSlug,
        version: 1,
        status: 'published',
        sections: sections,
        updatedAt: new Date().toISOString(),
      },
    },
    { headers: corsHeaders() }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'jqtrends';
    const body = await request.json();
    const newSections = body.sections || body;

    if (Array.isArray(newSections) && newSections.length > 0) {
      saveStoredHomepageSections(newSections, tenantSlug);
      try {
        revalidatePath('/');
      } catch {}
    }

    const updatedSections = getStoredHomepageSections(tenantSlug);

    return NextResponse.json(
      {
        data: {
          id: `hp_live_${tenantSlug}`,
          storeId: `store_${tenantSlug}`,
          tenant: tenantSlug,
          version: Date.now(),
          status: 'published',
          sections: updatedSections,
          updatedAt: new Date().toISOString(),
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  return PUT(request);
}
