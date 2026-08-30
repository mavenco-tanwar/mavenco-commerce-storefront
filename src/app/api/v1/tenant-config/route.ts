import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTenantConfig, updateTenantConfig } from '@/lib/tenant-config';

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
  const config = getTenantConfig(tenantSlug);

  return NextResponse.json(
    {
      data: config,
      tenant: tenantSlug,
      status: 'success',
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders() }
  );
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'jqtrends';
    const body = await request.json();

    const updated = updateTenantConfig(tenantSlug, body);

    try {
      revalidatePath(`/stores/${tenantSlug}`);
      revalidatePath('/');
    } catch {}

    return NextResponse.json(
      {
        data: updated,
        tenant: tenantSlug,
        status: 'success',
        message: `Tenant ${updated.name} registered successfully!`,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to register tenant' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug');
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Missing tenant slug' }, { status: 400, headers: corsHeaders() });
    }

    const { archiveTenantSlug } = require('@/lib/tenant-config');
    archiveTenantSlug(tenantSlug);

    try {
      revalidatePath(`/stores/${tenantSlug}`);
      revalidatePath('/');
    } catch {}

    return NextResponse.json(
      {
        tenant: tenantSlug,
        status: 'success',
        message: `Tenant ${tenantSlug} archived successfully!`,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete tenant' },
      { status: 400, headers: corsHeaders() }
    );
  }
}
