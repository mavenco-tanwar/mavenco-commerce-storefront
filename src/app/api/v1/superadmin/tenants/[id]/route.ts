import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getMongoClient } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('platform_tenants_registry').findOne({ tenantId: id.toLowerCase() });
      if (doc) {
        const { _id, ...clean } = doc;
        return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          tenantId: id,
          slug: id,
          name: `${id.toUpperCase()} Atelier`,
          status: 'active',
          databaseIdentifier: `tenant_${id}`,
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
    const cleanId = id.toLowerCase().trim();
    const safeSlug = cleanId.replace(/^store_/, '');

    const db = await getDatabase();
    let deletedCount = 0;

    if (db) {
      const res = await db.collection('platform_tenants_registry').deleteMany({
        $or: [{ tenantId: cleanId }, { slug: cleanId }, { id: cleanId }, { tenantId: safeSlug }, { slug: safeSlug }],
      });
      deletedCount = res.deletedCount;

      await db.collection('tenant_module_entitlements').deleteMany({
        $or: [{ tenantId: cleanId }, { tenantId: safeSlug }],
      });
      await db.collection('tenant_roles').deleteMany({
        $or: [{ tenantId: cleanId }, { tenantId: safeSlug }],
      });
      await db.collection('storefronts').deleteMany({
        $or: [{ tenantId: cleanId }, { tenantId: safeSlug }],
      });
      await db.collection('storefront_pages').deleteMany({
        $or: [{ tenantId: cleanId }, { tenantId: safeSlug }],
      });
      await db.collection('storefront_versions').deleteMany({
        $or: [{ tenantId: cleanId }, { tenantId: safeSlug }],
      });
      await db.collection('stores').deleteMany({
        $or: [{ tenantId: cleanId }, { tenantId: safeSlug }],
      });

      try {
        const client = await getMongoClient();
        if (client) {
          await client.db(`tenant_${safeSlug}`).dropDatabase();
        }
      } catch (dropErr) {
        console.warn(`Could not drop database tenant_${safeSlug}:`, dropErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        deletedCount,
        deletedTenantId: safeSlug,
        message: `Tenant '${safeSlug}' deleted from MongoDB.`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

