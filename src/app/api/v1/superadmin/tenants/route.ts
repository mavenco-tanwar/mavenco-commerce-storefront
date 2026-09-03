import { NextRequest, NextResponse } from 'next/server';
import { StorefrontProvisioningService } from '@/server/governance/storefront-provisioning.service';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase();
    let tenants: any[] = [];
    if (db) {
      const docs = await db.collection('platform_tenants_registry').find({}).sort({ createdAt: -1 }).toArray();
      tenants = docs.map(({ _id, ...rest }) => rest);
    }
    return NextResponse.json({ success: true, data: tenants }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.slug || !body.tenantName) {
      return NextResponse.json(
        { success: false, error: 'Both slug and tenantName are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const result = await StorefrontProvisioningService.provisionTenant({
      tenantName: body.tenantName,
      slug: body.slug,
      email: body.email || `admin@${body.slug}.com`,
      phone: body.phone,
      country: body.country || 'US',
      timezone: body.timezone || 'UTC',
      storeName: body.storeName || `${body.tenantName} Store`,
      defaultCurrency: body.defaultCurrency || 'USD',
      defaultLocale: body.defaultLocale || 'en-US',
      selectedModules: body.selectedModules || ['dashboard', 'storefront', 'products'],
      adminName: body.adminName || 'Tenant Owner',
      adminEmail: body.adminEmail || `owner@${body.slug}.com`,
      storefrontTemplate: body.storefrontTemplate || 'luxury',
      planId: body.planId,
    });

    return NextResponse.json(result, { status: result.success ? 201 : 400, headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
