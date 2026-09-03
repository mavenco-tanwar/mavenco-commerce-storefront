import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getMongoClient } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, X-API-Key, X-Store-ID',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_TENANTS = [
  {
    tenantId: 'lumina',
    slug: 'lumina',
    name: 'Lumina Luxury Group',
    status: 'active',
    databaseIdentifier: 'db_tenant_lumina_prod',
    planId: 'plan_growth',
    planName: 'Growth Commerce Tier',
    storesCount: 2,
    customDomainsCount: 3,
    mrrMinor: 29900,
    health: 'healthy',
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tenantId: 'elysium',
    slug: 'elysium',
    name: 'Elysium Haute Horlogerie',
    status: 'active',
    databaseIdentifier: 'db_tenant_elysium_prod',
    planId: 'plan_scale',
    planName: 'Scale Enterprise Tier',
    storesCount: 4,
    customDomainsCount: 6,
    mrrMinor: 79900,
    health: 'healthy',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tenantId: 'aurora',
    slug: 'aurora',
    name: 'Aurora Botanical Cosmetics',
    status: 'active',
    databaseIdentifier: 'db_tenant_aurora_prod',
    planId: 'plan_starter',
    planName: 'Starter Tier',
    storesCount: 1,
    customDomainsCount: 1,
    mrrMinor: 9900,
    health: 'healthy',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tenantId: 'vanguard',
    slug: 'vanguard',
    name: 'Vanguard Audio Atelier',
    status: 'suspended',
    databaseIdentifier: 'db_tenant_vanguard_prod',
    planId: 'plan_growth',
    planName: 'Growth Commerce Tier',
    storesCount: 2,
    customDomainsCount: 2,
    mrrMinor: 29900,
    health: 'warning',
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let memoryTenants: any[] = [];

export async function GET() {
  try {
    const db = await getDatabase();
    let tenants: any[] = [];

    if (db) {
      const collection = db.collection('platform_tenants_registry');
      const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
      tenants = docs.map(({ _id, ...rest }) => rest as any);
      memoryTenants = tenants;
    } else {
      tenants = memoryTenants;
    }

    return NextResponse.json({
      success: true,
      data: tenants,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const now = new Date().toISOString();
    const tenantId = body.slug || `tenant_${Date.now()}`;

    const newTenant = {
      tenantId,
      slug: body.slug || `tenant-${Date.now()}`,
      name: body.name || 'New Enterprise Tenant',
      status: 'active',
      databaseIdentifier: `db_tenant_${tenantId}_prod`,
      planId: body.planId || 'plan_growth',
      planName: body.planName || 'Growth Commerce Tier',
      storesCount: 1,
      customDomainsCount: 1,
      mrrMinor: body.mrrMinor || 29900,
      health: 'healthy',
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('platform_tenants_registry').insertOne(newTenant);
    }
    memoryTenants.unshift(newTenant);

    return NextResponse.json({
      success: true,
      data: newTenant,
      message: `Tenant '${newTenant.name}' provisioned and registered successfully!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, action, reason } = body;
    const db = await getDatabase();

    const updateStatus = action === 'suspend' ? 'suspended' : action === 'restore' ? 'active' : 'maintenance';

    if (db) {
      await db.collection('platform_tenants_registry').updateOne(
        { tenantId },
        { $set: { status: updateStatus, updatedAt: new Date().toISOString() } }
      );
    }

    const idx = memoryTenants.findIndex(
      (t) => t.tenantId === tenantId || t.slug === tenantId || t.id === tenantId
    );
    if (idx >= 0) {
      memoryTenants[idx] = {
        ...memoryTenants[idx],
        status: updateStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      message: `Tenant status updated to '${updateStatus}' (Reason: ${reason || 'Operator Action'})`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deleteAll = searchParams.get('all') === 'true';
    let targetId = searchParams.get('tenantId') || searchParams.get('id') || searchParams.get('slug');

    if (!targetId && !deleteAll) {
      try {
        const body = await req.json();
        targetId = body.tenantId || body.id || body.slug;
      } catch {}
    }

    if (!targetId && !deleteAll) {
      return NextResponse.json(
        { success: false, error: 'tenantId or slug is required for deletion' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const cleanTargetId = (targetId || '').toLowerCase().trim();
    const safeSlug = cleanTargetId.replace(/^store_/, '');

    const db = await getDatabase();
    let deletedCount = 0;

    if (deleteAll) {
      if (db) {
        const res = await db.collection('platform_tenants_registry').deleteMany({});
        deletedCount = res.deletedCount;
        await db.collection('tenant_module_entitlements').deleteMany({});
        await db.collection('tenant_roles').deleteMany({});
        await db.collection('storefronts').deleteMany({});
        await db.collection('storefront_pages').deleteMany({});
        await db.collection('storefront_versions').deleteMany({});
        await db.collection('stores').deleteMany({});
      }
      memoryTenants = [];
      return NextResponse.json(
        {
          success: true,
          deletedCount,
          message: 'All platform tenants and isolated database records have been completely purged from MongoDB.',
        },
        { headers: corsHeaders() }
      );
    }

    // Filter memory registry
    memoryTenants = memoryTenants.filter((t) => {
      const tid = (t.tenantId || t.id || t.slug || '').toLowerCase();
      const tslug = (t.slug || '').toLowerCase();
      return tid !== cleanTargetId && tslug !== cleanTargetId && tid !== safeSlug && tslug !== safeSlug;
    });

    if (db) {
      // 1. Delete from platform_tenants_registry
      const deleteResult = await db.collection('platform_tenants_registry').deleteMany({
        $or: [
          { tenantId: cleanTargetId },
          { slug: cleanTargetId },
          { id: cleanTargetId },
          { tenantId: safeSlug },
          { slug: safeSlug },
        ],
      });
      deletedCount = deleteResult.deletedCount;

      // 2. Cascade cleanup from platform governance & storefront collections
      await db.collection('tenant_module_entitlements').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('tenant_roles').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('storefronts').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('storefront_pages').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('storefront_versions').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('stores').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });

      // 3. Drop isolated dedicated database for this tenant
      try {
        const client = await getMongoClient();
        if (client) {
          await client.db(`tenant_${safeSlug}`).dropDatabase();
        }
      } catch (dropErr) {
        console.warn(`[DELETE /platform/tenants] Could not drop database tenant_${safeSlug}:`, dropErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        deletedCount,
        deletedTenantId: safeSlug,
        message: `Tenant '${safeSlug}' and all its isolated database records have been permanently deleted from MongoDB.`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

