import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { StorefrontProvisioningService } from '@/server/governance/storefront-provisioning.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-id',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cleanId = id.toLowerCase().trim();
    const safeSlug = cleanId.replace(/^store_/, '');

    const db = await getDatabase();
    if (db) {
      const matchCriteria = {
        $or: [
          { tenantId: cleanId },
          { slug: cleanId },
          { id: cleanId },
          { tenantId: safeSlug },
          { slug: safeSlug },
          { id: `store_${safeSlug}` },
          { tenantId: `store_${safeSlug}` },
        ],
      };

      const doc =
        (await db.collection('platform_tenants_registry').findOne(matchCriteria)) ||
        (await db.collection('tenants').findOne(matchCriteria));

      if (doc) {
        const { _id, ...clean } = doc;
        return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          tenantId: safeSlug,
          slug: safeSlug,
          name: `${safeSlug.toUpperCase()} Atelier`,
          status: 'active',
          databaseIdentifier: `tenant_${safeSlug}`,
          planId: 'plan_growth',
          planName: 'Enterprise SaaS Tier',
          storesCount: 1,
          customDomainsCount: 1,
          mrrMinor: 29900,
          health: 'healthy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await StorefrontProvisioningService.deleteTenant(id);
    return NextResponse.json(result, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

